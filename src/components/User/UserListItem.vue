<template>
  <div
    ref="userListItem"
    class="user-list-item open-user-popout"
    @click="onClick"
    :class="{ active: active, offline: offline }"
  >
    <UserAvatar :user="user" size="tiny" />
    <UserName :user="user" class="name" />
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";
import { onUnmounted, ref } from "vue";

export default defineComponent({
  components: {
    UserAvatar,
    UserName,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    offline: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const userListItem = ref();
    const active = ref(false);

    const onClick = () => {
      if (active.value) {
        active.value = false;
        emit("setUserPopoutUuid", "", null);
      } else if (userListItem.value) {
        active.value = true;
        emit("setUserPopoutUuid", props.user.uuid, userListItem.value);
      }
    };

    let onDocumentClick = (e: MouseEvent) => {
      if (
        userListItem.value &&
        !(
          userListItem.value === e.target ||
          userListItem.value.contains(e.target)
        )
      ) {
        if (active.value) active.value = false;
      }
    };
    document.body.addEventListener("click", onDocumentClick);
    onUnmounted(() => {
      document.body.removeEventListener("click", onDocumentClick);
    });

    return {
      userListItem,
      active,
      onClick,
    };
  },
});
</script>

<style scoped lang="scss">
.user-list-item {
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  margin: 4px 0;
  align-items: center;
  cursor: pointer;

  .user-name {
    padding-left: 10px;
  }

  &.offline {
    opacity: 0.5;
  }

  &:hover,
  &.active {
    opacity: 1;
    background: var(--hover-color);
    border-radius: 5px;
  }
}
</style>
