<template>
  <Loading v-if="loading" />
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import Loading from "@/components/Loading.vue";
import { getConfiguration } from "./api/http";
import { ref, watch } from "vue";

export default defineComponent({
  components: {
    Loading,
  },
  setup() {
    const loading = ref(true);
    const store = useStore();

    onMounted(async () => {
      store.state.configuration = await getConfiguration();
      loading.value = false;
    });

    const token = localStorage.getItem("token");
    if (token) store.state.token = token;

    watch(
      () => store.state.darkMode,
      () => {
        if (store.state.darkMode) {
          document.querySelector("#app")?.classList.add("dark");
          localStorage.setItem("darkMode", "");
        } else {
          document.querySelector("#app")?.classList.remove("dark");
          localStorage.removeItem("darkMode");
        }
      }
    );

    const darkMode = localStorage.getItem("darkMode");
    store.state.darkMode = darkMode !== null ? true : false;

    return {
      loading,
    };
  },
});
</script>

<style lang="scss">
@import "~@/assets/scss/global.scss";
@import "~@/assets/scss/variables.scss";

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  background: var(--background-color);
  box-sizing: border-box;
  color: var(--default-color);
  overflow: hidden;
  scrollbar-color: --scrollbar-thumb-color var(--scrollbar-track-color);
}
html,
body,
textarea {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  background: transparent;
}
::-webkit-scrollbar {
  width: 8px;
  padding: 2px;
  background-clip: padding-box;
}
::-webkit-scrollbar-track {
  background: var(--scrollbar-track-color);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb-color);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover-color);
}
</style>
