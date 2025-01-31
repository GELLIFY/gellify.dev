'use server';

import { embed, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { codeBlock, oneLine } from 'common-tags';
import GPT3Tokenizer from 'gpt3-tokenizer'
import { ApplicationError } from '@/lib/errors';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function continueConversation(query: string) {
  'use server';

  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

  // Moderate the content to comply with OpenAI T&C
  const sanitizedQuery = query.trim()

  // Create embedding from query
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: sanitizedQuery.replaceAll('\n', ' '),
  });

  const { error: matchError, data: pageSections } = await supabaseClient.rpc(
    'match_page_sections',
    {
      embedding,
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 50,
    }
  )

  if (matchError) {
    throw new ApplicationError('Failed to match page sections', matchError)
  }

  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
  let tokenCount = 0
  let contextText = ''

  for (let i = 0; i < pageSections.length; i++) {
    const pageSection = pageSections[i]
    const content = pageSection.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    if (tokenCount >= 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }

  const prompt = codeBlock`
    ${oneLine`
      You are a very enthusiastic GELLIFY representative who loves
      to help people! Given the following sections from the GELLIFY.dev
      documentation, answer the question using only that information,
      outputted in markdown format. If you are unsure and the answer
      is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that."
    `}

    Context sections:
    ${contextText}

    Question: """
    ${sanitizedQuery}
    """

    Answer as markdown (including related code snippets if available):
  `
  
  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    prompt
  });

  return result.toDataStreamResponse()
}