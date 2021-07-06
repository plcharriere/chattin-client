<template>
  <div
    class="avatar"
    :class="[
      size,
      { default: user.avatarUuid.length === 0 && overrideUrl.length === 0 },
    ]"
    :style="{
      backgroundImage:
        overrideUrl.length > 0
          ? 'url(' + overrideUrl + ')'
          : user.avatarUuid.length > 0
          ? 'url(' + getAvatarUrl(user.avatarUuid) + ')'
          : '',
    }"
  >
    <div
      v-if="editable"
      class="edit"
      :class="editIcon"
      @click="editCallback"
    ></div>
  </div>
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
    editIcon: {
      type: String,
      default: "pencil",
    },
    editCallback: {
      type: Function,
    },
    overrideUrl: {
      type: String,
      default: "",
    },
  },
})
export default class UserAvatar extends Vue {
  getAvatarUrl(uuid: string): string {
    return "http://localhost:2727/avatars/" + uuid;
  }
}
</script>

<style scoped lang="scss">
.avatar {
  position: relative;
  border-radius: 100%;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: cover;
  background-position: center;
  overflow: hidden;

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

  &.default {
    background-color: #ddd;
    background-image: url(~@/assets/svg/user.svg);

    &.small {
      background-size: 20px;
    }
    &.medium {
      background-size: 25px;
    }
    &.large {
      background-size: 64px;
    }
  }

  .edit {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 0, 0, 0.5);
    background-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 200ms;

    &.pencil {
      background-image: url(~@/assets/svg/pencil.svg);
    }

    &.upload {
      background-image: url(~@/assets/svg/upload.svg);
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
