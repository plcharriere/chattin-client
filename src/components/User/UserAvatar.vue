<template>
  <div
    class="avatar"
    :class="[
      size,
      {
        default:
          ((!user || user.avatarUuid.length === 0) && overrideUrl === null) ||
          (overrideUrl !== null && overrideUrl.length === 0),
      },
    ]"
    :style="{
      backgroundImage:
        overrideUrl && overrideUrl.length > 0
          ? 'url(' + overrideUrl + ')'
          : overrideUrl == null && user.avatarUuid.length > 0
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
import { httpUrl } from "@/env";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    user: {
      type: Object as PropType<User>,
      default: null,
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
      default: null,
    },
  },
})
export default class UserAvatar extends Vue {
  getAvatarUrl(uuid: string): string {
    return httpUrl + "/avatars/" + uuid;
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

  &.tiny {
    width: 32px;
    height: 32px;
  }
  &.small {
    width: 42px;
    height: 42px;
  }
  &.medium {
    width: 64px;
    height: 64px;
  }
  &.large {
    width: 100px;
    height: 100px;
  }

  &.default {
    background-color: #ddd;
    background-image: url(~@/assets/svg/user.svg);

    &.tiny {
      background-size: 20px;
    }
    &.small {
      background-size: 25px;
    }
    &.medium {
      background-size: 30px;
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
