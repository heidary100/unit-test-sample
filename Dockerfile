From node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm install --only=production
RUN npm install

# Install pm2 package
RUN npm install pm2 -g


# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "pm2-runtime", "npm", "--", "start" ]
