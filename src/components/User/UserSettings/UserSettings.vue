<template>
  <div class="overlay" @click="closeCallback"></div>
  <div class="container">
    <div class="settings">
      <UserSettingsMenu @setMenuIndex="setMenuIndex" :menuIndex="menuIndex" />
      <UserSettingsProfile
        v-if="menuIndex === 0"
        :user="user"
        @setMenuIndex="setMenuIndex"
      />
      <UserSettingsAvatars v-if="menuIndex === 1" :user="user" />
      <div class="close" @click="closeCallback"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserSettingsMenu from "@/components/User/UserSettings/UserSettingsMenu.vue";
import UserSettingsProfile from "@/components/User/UserSettings/UserSettingsProfile.vue";
import UserSettingsAvatars from "@/components/User/UserSettings/UserSettingsAvatars.vue";

@Options({
  components: {
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
})
export default class UserSettings extends Vue {
  menuIndex = 0;

  setMenuIndex(index: number): void {
    this.menuIndex = index;
  }
}
</script>

<style scoped lang="scss">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .settings {
    position: relative;
    background: #fff;
    min-width: 800px;
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
      background: url(~@/assets/svg/close.svg);
      color: #555;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background-size: contain;
    }
  }
}
</style>
