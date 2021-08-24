FROM apify/actor-node-puppeteer-chrome:16 AS builder

USER root

RUN npm install -g yarn && yarn --version

COPY package.json yarn.lock ./

RUN yarn install  --frozen-lockfile

COPY . .

RUN yarn build

RUN yarn install --prod --ignore-optional

ENV APIFY_DISABLE_OUTDATED_WARNING 1

FROM apify/actor-node-puppeteer-chrome:16

# # Copy source code
COPY . ./

COPY --from=builder /home/myuser/node_modules ./node_modules
COPY --from=builder /home/myuser/build ./build

# Install default dependencies, print versions of everything
RUN echo "Installed NPM packages:" \
 && npm list --prod \
 && echo "Node.js version:" \
 && node --version \
 && echo "NPM version:" \
 && npm --version

ENV APIFY_DISABLE_OUTDATED_WARNING 1
