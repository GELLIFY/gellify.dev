import { findRelevantContent } from "./lib/ai/embedding";

const description = 'Why this template?';
const similarGuides = await findRelevantContent(description);

console.log(similarGuides)

