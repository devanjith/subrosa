FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn set version berry
RUN yarn
RUN yarn prisma generate
RUN yarn build

EXPOSE 8080

CMD ["node", "dist/index.js"]
