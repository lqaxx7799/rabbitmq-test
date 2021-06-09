FROM node:10.16.0

# Update repository and install dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  redis-tools \
  # curl \
  # wget \
  sudo \
  vim

EXPOSE 5001 5001

# # Define app and log variables
# app log obsolete, remove soon
ENV APP_SRC_DIR=/usr/src/app \
  APP_LOGS_DIR=/var/log/app \
  APP_LOG=/var/log/app/app.log \
  APP_ERR=/var/log/app/app.err

# # Add node user to sudoers
RUN /usr/sbin/adduser node sudo
RUN echo "node ALL=NOPASSWD: ALL" >> /etc/sudoers

# Change NPM global location
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global \
  PATH=$PATH:/home/node/.npm-global/bin

# Install NPM global dependencies
RUN npm install -g \
  gulp-cli@2.0.1 \
  nodemon@1.18.9 \
  pm2@3.2.4

# Change permissions for folders
RUN mkdir -p $APP_LOGS_DIR && chown node:node $APP_LOGS_DIR

# Set working directory and switch user
WORKDIR $APP_SRC_DIR
RUN chown node:node $APP_SRC_DIR
USER node

# Install local npm dependencies
COPY --chown=node package*.json ./
RUN npm install

# Copy source over
COPY --chown=node ./ .

# Start app
CMD npm start
