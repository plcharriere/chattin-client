<template>
  <router-view />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
})
export default class App extends Vue {
  created(): void {
    const token = localStorage.getItem("token");
    if (token) {
      this.$store.state.token = token;
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/global.scss";

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  background: $background-color;
  box-sizing: border-box;
  color: $default-color;
}
html,
body,
textarea {
  font-family: sans-serif;
  font-size: 14px;
  background: transparent;
}
::-webkit-scrollbar {
  width: 8px;
  padding: 2px;
  background-clip: padding-box;
}
::-webkit-scrollbar-track {
  background: $scrollbar-track-color;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb {
  background: $scrollbar-thumb-color;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: $scrollbar-thumb-hover-color;
}
</style>
