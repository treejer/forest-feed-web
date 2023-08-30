FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ARG NODE_ENV
ENV NODE_ENV="production"
RUN yarn build

FROM node:16-alpine AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

EXPOSE 8080
ENV PORT 8080
CMD ["node", "./standalone/server.js"]