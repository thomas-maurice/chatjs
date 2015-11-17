From debian:jessie
Maintainer Thomas Maurice <thomas@maurice.fr>

RUN apt-get update && apt-get install nodejs npm git -y
RUN npm install -g bower grunt-cli
RUN echo "test" && git clone https://github.com/thomas-maurice/chatjs /chatjs
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN sed -i 's/8080/80/g' /chatjs/conf/chatjs.json
RUN cd /chatjs && \
    npm install && bower install --allow-root -f

EXPOSE 80:8080

ENTRYPOINT cd /chatjs && grunt deploy
