FROM node:hydrogen-buster 

LABEL maintainer="Hoplin"
LABEL email="jhoplin7259@gmail.com"

RUN apt-get update\
    && apt-get upgrade -y\
    && mkdir api
WORKDIR /api

COPY . .
RUN rm -rf node_modules\
    && npm i
EXPOSE 4000 6500

CMD [ "-c","npm run service:run" ]
ENTRYPOINT [ "/bin/bash" ]