FROM node:22-bullseye

WORKDIR /financly
COPY package-lock.json .
COPY package.json .
RUN npm i
COPY src/ src/
COPY package.json .
ENTRYPOINT [ "npm", "run", "dev" ] 