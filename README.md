# Chattin

Chattin is a **work in progress** self-hosted real-time communication platform heavily inspired from Discord.

This is the client repository. Check out the [server](https://github.com/plcharriere/chattin-server) repository that goes with the client.

## Screenshot

![Chattin Client Screenshot](https://i.imgur.com/pNBfYCt.png)

## Project setup

Install node modules with :

```
npm install
```

Copy and configure your environment file :

```
cp .env.example .env
```

Copy and configure your vue configuration file :

```
cp vue.config.js.example vue.config.js
```

## How to deploy

### Run in development mode

Run with Vue in development mode with :

```
npm run serve
```

### Build to run in production

Build the app for production with :

```
npm run build
```

And host built content in `dist/` with a web server.

### Run in a Docker container

Build the Docker image with :

```
docker build . -t chattin-client
```

Then you can create and run a container with :

```
docker run -d --name chattin-client -p 80:80 chattin-client
```

### Run in a Docker container with Docker-Compose

First, you need to build the Docker image with :

```
docker build . -t chattin-client
```

Then write in a `docker-compose.yml` file :

```
version: "3.6"

services:
  chattin-client:
    image: chattin-client
    ports:
      - 80:80
```

If you have built the [server](https://github.com/plcharriere/chattin-server) Docker image, you can add it as well :

```
version: "3.6"

services:
  chattin-client:
    image: chattin-client
    ports:
      - 80:80

  chattin-server:
    image: chattin-server
    volumes:
      - /path/to/cert:/chattin-server/ssl/cert
      - /path/to/key:/chattin-server/ssl/key
    environment:
      - ADDRESS=:2727
      - SSL_CERT=/chattin-server/ssl/cert
      - SSL_KEY=/chattin-server/ssl/key
      - POSTGRES_ADDRESS=postgres:5432
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=ch4ng3_m3
      - POSTGRES_DATABASE=chattin
    ports:
      - 2727:2727
    depends_on:
      - postgres

  postgres:
    image: postgres
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=ch4ng3_m3
      - POSTGRES_DB=chattin
```

After configuring your `docker-compose.yml` file, create and start containers with :

`docker-compose up -d`
