FROM node:22-bookworm-slim
WORKDIR /srv
ENV WRANGLER_SEND_METRICS=false
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
RUN --mount=type=cache,target=/root/.npm npm install --prefer-offline --no-save --package-lock=false wrangler@4.153.0
COPY cloudflare /srv/cloudflare
COPY sandbox/local-worker.mjs sandbox/wrangler.jsonc /srv/sandbox/
COPY index.html /srv/public/index.html
COPY app /srv/public/app
COPY css /srv/public/css
COPY assets /srv/public/assets
COPY sandbox/dev-environment.js /srv/public/dev-environment.js
EXPOSE 8787
CMD ["sh", "-c", "exec ./node_modules/.bin/wrangler dev --config sandbox/wrangler.jsonc --local --ip 0.0.0.0 --port 8787 --inspector-port 0 --var DEV_INSTANCE_ID:$DEV_INSTANCE_ID"]
