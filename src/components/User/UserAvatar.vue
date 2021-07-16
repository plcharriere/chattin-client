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
      {
        clickable: openPopoutUuid.length > 0,
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
    @click="avatarClick(openPopoutUuid)"
  >
    <UserIcon
      class="user"
      v-if="
        (uuid.length === 0 &&
          overrideUrl.length === 0 &&
          overrideUuid.length === 0) ||
        overrideUrl === 'default'
      "
    />
    <div v-if="overlay" class="overlay" @click="overlayClickCallback">
      <template v-if="overlayIcon === 'pencil'">
        <PencilIcon />
      </template>
      <template v-else-if="overlayIcon === 'upload'">
        <UploadIcon />
      </template>
      <template v-else-if="overlayIcon === 'arrowUp'">
        <ArrowUpIcon />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { httpUrl } from "@/env";
import { Options, Vue } from "vue-class-component";
import { UserIcon } from "@heroicons/vue/outline";
import { PencilIcon } from "@heroicons/vue/solid";
import { UploadIcon } from "@heroicons/vue/outline";
import { ArrowUpIcon } from "@heroicons/vue/solid";

@Options({
  components: {
    UserIcon,
    PencilIcon,
    UploadIcon,
    ArrowUpIcon,
  },
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
    openPopoutUuid: {
      type: String,
      default: "",
    },
  },
})
export default class UserAvatar extends Vue {
  getAvatarUrl(uuid: string): string {
    return httpUrl + "/avatars/" + uuid;
  }

  avatarClick(openPopoutUuid: string): void {
    if (openPopoutUuid !== "")
      this.$emit("setUserPopoutUuid", openPopoutUuid, this.$el);
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
    color: #666;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;

    &.tiny {
      .user {
        width: 18px;
        height: 18px;
      }
    }
    &.small {
      .user {
        width: 25px;
        height: 25px;
      }
    }
    &.medium {
      .user {
        width: 30px;
        height: 30px;
      }
    }
    &.large {
      .user {
        width: 60px;
        height: 60px;
      }
    }
  }

  &.clickable {
    cursor: pointer;
    transition: all 200ms;

    &:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 200ms;

    svg {
      color: #eee;
      width: 32px;
      height: 32px;
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
