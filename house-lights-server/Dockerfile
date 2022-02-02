FROM node:current-alpine

ENV NODE_ENV=production

#RUN apt-get update && apt-get install -y curl && apt-get clean

EXPOSE 8088 4210/udp

WORKDIR /Ctest

# Install NTPD for time synchronization and timezone data.
RUN apk --no-cache update && \
    apk --no-cache upgrade && \
apk --no-cache add tzdata openntpd

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json ./
## extra_hosts is ignored and had to use echo here
#RUN echo "10.0.0.15 mercury.mesh" >> /etc/hosts
RUN npm ci && npm cache clean --force 

COPY . .

#HEALTHCHECK CMD curl http://127.0.0.1:4000/healthcheck || exit 1
#HEALTHCHECK CMD node /Ctest/healthcheck_cmd.mjs

USER node
CMD [ "node", "src/index.mjs" ]
