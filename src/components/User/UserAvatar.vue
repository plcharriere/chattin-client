<template>
  <div
    class="avatar"
    :class="[
      size,
      {
        default:
          (uuid.length === 0 &&
            overrideUrl.length === 0 &&
            overrideUuid.length === 0) ||
          overrideUrl === 'default',
      },
    ]"
    :style="{
      backgroundImage:
        overrideUrl === 'default'
          ? ''
          : overrideUrl.length > 0
          ? 'url(' + overrideUrl + ')'
          : overrideUuid.length > 0
          ? 'url(' + getAvatarUrl(overrideUuid) + ')'
          : uuid.length > 0
          ? 'url(' + getAvatarUrl(uuid) + ')'
          : '',
    }"
  >
    <div
      v-if="overlay"
      class="overlay"
      :class="overlayIcon"
      @click="overlayClickCallback"
    ></div>
  </div>
</template>

<script lang="ts">
import { httpUrl } from "@/env";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    uuid: {
      type: String,
      default: "",
    },
    overrideUuid: {
      type: String,
      default: "",
    },
    overrideUrl: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "medium",
    },
    overlay: {
      type: Boolean,
      default: false,
    },
    overlayIcon: {
      type: String,
      default: "pencil",
    },
    overlayClickCallback: {
      type: Function,
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

  .overlay {
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

    &.arrow-up {
      background-image: url(~@/assets/svg/arrow-up.svg);
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
