<template>
  <div class="menu">
    <div
      v-for="(item, index) in items"
      v-bind:key="item"
      class="item"
      :class="{ active: index === menuIndex }"
      @click="setMenuIndex(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {},
  props: {
    menuIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const items: string[] = [
      "Profile",
      "Avatars",
      // "Messages",
      // "Files",
      // "Security",
      // "Other",
    ];

    const setMenuIndex = (index: number) => {
      emit("setMenuIndex", index);
    };

    return {
      items,
      setMenuIndex,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.menu {
  flex-shrink: 0;
  width: 150px;
  padding-right: 20px;
  margin-right: 30px;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  user-select: none;

  .item {
    padding: 8px 12px;
    margin-bottom: 6px;
    cursor: pointer;

    &:hover,
    &.active {
      background: $hover-color;
      border-radius: 5px;
    }
  }
}
</style>
