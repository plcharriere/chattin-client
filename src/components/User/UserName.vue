<template>
  <div
    ref="userName"
    class="user-name"
    :class="{ clickable: openUserPopout }"
    @click="onNameClick()"
  >
    {{ getUserName(user) }}
    <small v-if="showUserLogin && user.nickname.length > 0" class="login">
      {{ user.login }}
    </small>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { getUserName } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import { ref } from "vue";

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    showUserLogin: {
      type: Boolean,
      default: false,
    },
    openUserPopout: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const userName = ref();

    const onNameClick = () => {
      if (props.openUserPopout && userName.value)
        emit("setUserPopoutUuid", props.user.uuid, userName.value);
    };

    return {
      userName,
      onNameClick,
      getUserName,
    };
  },
});
</script>

<style scoped lang="scss">
.user-name {
  display: flex;
  flex-direction: column;

  .login {
    color: var(--light-color);
    margin-top: 2px;
  }

  &.clickable {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
