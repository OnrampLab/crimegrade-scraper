FROM apify/actor-node-puppeteer-chrome:14 as dev

WORKDIR /app

USER root

RUN npm install -g yarn gulp-cli apify-cli && yarn --version

# Define build arguments
ARG USER_ID
ARG GROUP_ID

# Define environment variables
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID
ENV USER_ID=${USER_ID:-1001}
ENV GROUP_ID=${GROUP_ID:-1001}

RUN addgroup --gid ${GROUP_ID} user
RUN adduser --disabled-password --gecos '' --uid ${USER_ID} --gid ${GROUP_ID} user

RUN usermod -a -G user user

RUN chown -Rh user:user /app

ADD package.json /app

ADD yarn.lock /app

RUN yarn --production=false

RUN chown -Rh user:user /app/node_modules

ENV APIFY_DISABLE_OUTDATED_WARNING 1
