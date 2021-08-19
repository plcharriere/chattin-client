<template>
  <div class="user-settings-interface">
    <span>Dark mode :</span>
    <input
      type="checkbox"
      :checked="isDarkModeEnabled"
      @change="toggleDarkMode"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();

    const isDarkModeEnabled = localStorage.getItem("darkMode") !== null;

    const toggleDarkMode = () => {
      store.state.darkMode = !store.state.darkMode;
    };

    return {
      isDarkModeEnabled,
      toggleDarkMode,
    };
  },
});
</script>

<style scoped lang="scss">
.user-settings-interface {
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
