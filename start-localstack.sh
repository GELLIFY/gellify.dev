# load env
set -a
. .env
set +a

# setup
docker-compose up -d --wait db neon-proxy

# db
bun run db:migrate

# run
#pnpm run dev