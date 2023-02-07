FROM dperson/torproxy

# To Run
# sudo docker run -it -p 8118:8118 -p 9050:9050 -d dockerpuppeteertor:latest

# To Test from within the containers shell:
# curl -Lx http://127.0.0.1:8118 https://check.torproject.org/api/ip

RUN apk add --no-cache make gcc g++ python3 git nodejs nodejs-npm yarn libstdc++ chromium

WORKDIR /usr/src/app
COPY . ./
RUN npm install
COPY onrun.sh /usr/bin/

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

VOLUME ["/etc/tor", "/var/lib/tor"]

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--", "/usr/bin/onrun.sh"]