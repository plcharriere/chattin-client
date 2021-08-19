<template>
  <div
    ref="userAvatar"
    class="user-avatar"
    :class="[
      size,
      {
        default:
          (user &&
            user.avatarUuid.length === 0 &&
            overrideUrl.length === 0 &&
            overrideUuid.length === 0) ||
          overrideUrl === 'default',
      },
      {
        clickable: openUserPopout,
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
          : user.avatarUuid.length > 0
          ? 'url(' + getAvatarUrl(user.avatarUuid) + ')'
          : '',
    }"
    @click="onAvatarClick()"
  >
    <UserIcon
      class="user"
      v-if="
        (user &&
          user.avatarUuid.length === 0 &&
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
import { UserIcon } from "@heroicons/vue/outline";
import { PencilIcon } from "@heroicons/vue/solid";
import { UploadIcon } from "@heroicons/vue/outline";
import { ArrowUpIcon } from "@heroicons/vue/solid";
import { defineComponent } from "@vue/runtime-core";
import { PropType, ref } from "vue";
import { User } from "@/dto/User";

export default defineComponent({
  components: {
    UserIcon,
    PencilIcon,
    UploadIcon,
    ArrowUpIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
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
    openUserPopout: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const userAvatar = ref();

    const getAvatarUrl = (uuid: string) => {
      return `${httpUrl}/avatars/${uuid}`;
    };

    const onAvatarClick = () => {
      if (props.user && props.openUserPopout && userAvatar.value)
        emit("setUserPopoutUuid", props.user.uuid, userAvatar.value);
    };

    return { userAvatar, getAvatarUrl, onAvatarClick };
  },
});
</script>

<style scoped lang="scss">
.user-avatar {
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

    svg {
      width: 25px;
      height: 25px;
    }
  }
  &.large {
    width: 100px;
    height: 100px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &.default {
    color: var(--default-avatar-icon-color);
    background-color: var(--default-avatar-background-color);
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
      color: #fff;
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
