<template>
  <div class="user-info visible">
    <div class="user" @click="toggleDropdown">
      <UserAvatar :user="user" size="tiny" />
      <UserName :user="user" />
      <ChevronDownIcon :class="{ active: dropdownActive }" />
    </div>
    <transition name="slide-down">
      <div ref="dropdown" class="dropdown" v-if="dropdownActive">
        <div class="item" @click="openUserSettings">
          <CogIcon />
          My settings
        </div>
        <div class="separator"></div>
        <div class="item red" @click="logout">
          <LogoutIcon />
          Logout
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { LogoutIcon } from "@heroicons/vue/outline";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import { defineComponent, onUnmounted, ref } from "vue";

export default defineComponent({
  components: {
    UserAvatar,
    UserName,
    CogIcon,
    LogoutIcon,
    ChevronDownIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props, { emit }) {
    let dropdown = ref();
    let dropdownActive = ref(false);
    let toggleDropdown = () => {
      dropdownActive.value = !dropdownActive.value;
    };
    let disableDropdown = () => {
      dropdownActive.value = false;
    };

    let onDocumentClick = (e: MouseEvent) => {
      if (
        dropdown.value &&
        !(dropdown.value === e.target || dropdown.value.contains(e.target))
      ) {
        if (!(e.target as HTMLElement).closest(".user-info")) disableDropdown();
      }
    };
    document.body.addEventListener("click", onDocumentClick);
    onUnmounted(() => {
      document.body.removeEventListener("click", onDocumentClick);
    });

    let openUserSettings = () => {
      disableDropdown();
      emit("openUserSettings");
    };

    let logout = () => {
      emit("logout");
    };

    return {
      dropdown,
      dropdownActive,
      toggleDropdown,
      disableDropdown,
      openUserSettings,
      logout,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";
@import "~@/assets/scss/animations.scss";

.user-info {
  user-select: none;

  .user {
    position: relative;
    z-index: 3;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    width: 200px;
    height: 100%;
    padding: 0 20px;
    align-items: center;
    background: $background-color;
    border-bottom: 1px solid $border-color;

    .user-name {
      padding-left: 10px;
    }

    &:hover {
      background: $hover-color;
      cursor: pointer;
    }

    svg {
      width: 20px;
      height: 20px;
      margin-left: auto;
      transition: transform 200ms;

      &.active {
        transform: rotate(180deg);
      }
    }
  }

  .dropdown {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    background: $background-color;
    border-radius: 0 0 10px 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .item {
      display: flex;
      flex-direction: row;
      padding: 16px;
      cursor: pointer;
      align-items: center;

      &.red {
        color: red;
      }

      &:hover {
        background: $hover-color;
      }

      svg {
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
    }

    .separator {
      border-top: 1px solid $hover-color;
      padding: 0 20px;
      margin: 0 15px;
    }
  }
}
</style>
