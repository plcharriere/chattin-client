export const webSocketUrl =
  process.env.VUE_APP_SERVER_WS_SCHEME +
  "://" +
  process.env.VUE_APP_SERVER_HOST +
  ":" +
  process.env.VUE_APP_SERVER_PORT;
export const httpUrl =
  process.env.VUE_APP_SERVER_HTTP_SCHEME +
  "://" +
  process.env.VUE_APP_SERVER_HOST +
  ":" +
  process.env.VUE_APP_SERVER_PORT;
