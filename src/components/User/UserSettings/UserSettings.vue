<template>
  <div class="overlay" @click="closeCallback"></div>
  <div class="container">
    <div class="settings" ref="modal">
      <UserSettingsMenu @setMenuIndex="setMenuIndex" :menuIndex="menuIndex" />
      <UserSettingsProfile
        v-if="menuIndex === 0"
        :user="user"
        @setMenuIndex="setMenuIndex"
      />
      <UserSettingsAvatars v-if="menuIndex === 1" :user="user" />
      <XIcon class="close" @click="closeCallback" />
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import UserSettingsMenu from "@/components/User/UserSettings/UserSettingsMenu.vue";
import UserSettingsProfile from "@/components/User/UserSettings/UserSettingsProfile.vue";
import UserSettingsAvatars from "@/components/User/UserSettings/UserSettingsAvatars.vue";
import { XIcon } from "@heroicons/vue/outline";
import { onUnmounted, ref } from "vue";

export default defineComponent({
  components: {
    XIcon,
    UserSettingsMenu,
    UserSettingsProfile,
    UserSettingsAvatars,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    closeCallback: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
		const modal = ref()
    const menuIndex = ref(0);

    const setMenuIndex = (index: number) => {
      menuIndex.value = index;
    };

    let clickedOutside = (e: MouseEvent) => {
      if (
        modal.value &&
        !(modal.value === e.target || modal.value.contains(e.target))
      ) {
				if (!(e.target as HTMLElement).closest(".open-modal")) {
        	props.closeCallback();
        }
      }
    };
    document.body.addEventListener("click", clickedOutside);
    onUnmounted(() => {
      document.body.removeEventListener("click", clickedOutside);
    });

    return {
			modal,
      menuIndex,
      setMenuIndex,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
	z-index: 1000;

  .settings {
    position: relative;
    background: $background-color;
    width: 800px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    padding: 30px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 2;

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      color: $icon-button-color;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background-size: contain;

      &:hover {
        color: $icon-button-hover-color;
      }
    }
  }
}
</style>
