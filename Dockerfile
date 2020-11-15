FROM buildkite/puppeteer:latest

ENV HOME /app
WORKDIR $HOME

RUN mv /node_modules $HOME/node_modules
COPY package.json $HOME/
ARG CACHEBUST=1
RUN npm i
COPY . $HOME

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p $HOME/pptruser/Downloads \
    && chown -R pptruser:pptruser $HOME/pptruser \
    && chown -R pptruser:pptruser $HOME/node_modules \
    && chown -R pptruser:pptruser $HOME/

USER pptruser

EXPOSE 8080

CMD [ "npm", "start" ]