<template>
  <Modal :closeCallback="closeCallback">
    <UserSettingsMenu @setMenuIndex="setMenuIndex" :menuIndex="menuIndex" />
    <UserSettingsProfile
      v-if="menuIndex === 0"
      :user="user"
      @setMenuIndex="setMenuIndex"
    />
    <UserSettingsAvatars v-if="menuIndex === 1" :user="user" />
  </Modal>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import Modal from "@/components/Modal.vue";
import UserSettingsMenu from "@/components/User/UserSettings/UserSettingsMenu.vue";
import UserSettingsProfile from "@/components/User/UserSettings/UserSettingsProfile.vue";
import UserSettingsAvatars from "@/components/User/UserSettings/UserSettingsAvatars.vue";
import { ref } from "vue";

export default defineComponent({
  components: {
    Modal,
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
  setup() {
    const menuIndex = ref(0);

    const setMenuIndex = (index: number) => {
      menuIndex.value = index;
    };

    return {
      menuIndex,
      setMenuIndex,
    };
  },
});
</script>

<style scoped lang="scss"></style>
