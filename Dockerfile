FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

RUN mkdir ./app
COPY app/package.json ./app/
COPY app/yarn.lock ./app/

RUN yarn --cwd app

COPY . .

RUN yarn --cwd app build-prod

EXPOSE 4001

CMD [ "yarn", "start" ]