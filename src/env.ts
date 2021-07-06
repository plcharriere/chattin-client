export const webSocketUrl =
  "ws://" +
  process.env.VUE_APP_SERVER_HOST +
  ":" +
  process.env.VUE_APP_SERVER_PORT;
export const httpUrl =
  process.env.VUE_APP_SERVER_SCHEME +
  "://" +
  process.env.VUE_APP_SERVER_HOST +
  ":" +
  process.env.VUE_APP_SERVER_PORT;
