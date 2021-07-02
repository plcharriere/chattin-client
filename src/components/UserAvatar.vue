<template>
  <div class="avatar" :class="[size]"></div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    size: {
      type: String,
      default: "medium",
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
})
export default class UserAvatar extends Vue {}
</script>

<style scoped lang="scss">
.avatar {
  border-radius: 100%;
  background: #ddd;

  &.small {
    width: 32px;
    height: 32px;
  }
  &.medium {
    width: 42px;
    height: 42px;
  }
  &.large {
    width: 100px;
    height: 100px;
  }
}
</style>
