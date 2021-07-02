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
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  background: #fff;
  box-sizing: border-box;
}
html,
body,
textarea {
  font-family: sans-serif;
  font-size: 14px;
  background: transparent;
}
</style>
