FROM node as build-stage

WORKDIR /chattin-client

COPY . .

RUN npm install && npm run build

FROM nginx as production-stage

RUN mkdir /chattin-client
COPY --from=build-stage /chattin-client/dist /chattin-client

RUN echo "server {\n\
  listen       80;\n\
  server_name  _;\n\
\n\
  location / {\n\
    root   /chattin-client;\n\
    index  index.html;\n\
    try_files \$uri \$uri/ /index.html;\n\
  }\n\
}" > /etc/nginx/conf.d/default.conf

