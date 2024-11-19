# Fetching the minified node image on apline linux
FROM node:alpine

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY package.json .

# Installing dependencies
RUN npm install

COPY . .

# Exposing server port
EXPOSE 6900

# Starting our application
CMD [ "npm", "run", "dev" ]


