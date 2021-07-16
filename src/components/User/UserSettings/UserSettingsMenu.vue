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
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
  props: {
    menuIndex: {
      type: Number,
      required: true,
    },
  },
})
export default class UserSettings extends Vue {
  items: string[] = [
    "Profile",
    "Avatars",
    // "Messages",
    // "Files",
    // "Security",
    // "Other",
  ];

  setMenuIndex(index: number): void {
    this.$emit("setMenuIndex", index);
  }
}
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

  .item {
    color: #333;
    padding: 8px 12px;
    margin-bottom: 6px;
    cursor: pointer;

    &:hover,
    &.active {
      background: #eee;
      border-radius: 5px;
    }
  }
}
</style>
