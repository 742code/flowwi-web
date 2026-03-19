# -------------------------
# Stage 1 - Build
# -------------------------
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

# Copia apenas arquivos de dependência primeiro (cache)
COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

# Copia o resto do projeto
COPY . .

# Build do Nuxt (gera .output)
RUN pnpm run build


# -------------------------
# Stage 2 - Runtime
# -------------------------
FROM node:22-alpine

WORKDIR /app

# IMPORTANTE: Railway injeta PORT automaticamente
ENV HOST=0.0.0.0

# Copia apenas o build final
COPY --from=build /app/.output/ ./

# Expor é opcional no Railway, mas ok manter
EXPOSE 3000

# Start do servidor Nitro
CMD ["node", "/app/server/index.mjs"]
