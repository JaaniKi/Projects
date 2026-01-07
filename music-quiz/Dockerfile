# -------- deps --------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# -------- build --------
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next build
RUN npm run build

# -------- runner --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Kopioi vain tarvittavat
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/server.ts ./server.ts
COPY --from=build /app/src ./src

EXPOSE 3000

CMD ["npm", "run", "start"]
