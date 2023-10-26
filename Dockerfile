FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
# RUN npm cache clean --force && \
#     npm install -g npm@latest && \
#     npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/images ./images
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/ ./.next
COPY --from=builder /app/.env ./.env

ENV DATABASE_URL=mysql://root:abogoboga@10.1.1.13:3306/ecoguardian_db
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
VOLUME ["/app/images"]

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]
