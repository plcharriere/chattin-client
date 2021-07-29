<template>
  <div class="user-list">
    <div class="list" v-if="onlineUsers.length > 0">
      <div class="status">
        <div>Online</div>
        <div class="separator"></div>
        <div>{{ onlineUsers.length }}</div>
      </div>
      <UserListItem
        v-for="user in onlineUsers"
        v-bind:key="user.uuid"
        :user="user"
        @setUserPopoutUuid="setUserPopoutUuid"
      />
    </div>
    <div class="list" v-if="offlineUsers.length > 0">
      <div class="status">
        <div>Offline</div>
        <div class="separator"></div>
        <div>{{ offlineUsers.length }}</div>
      </div>
      <UserListItem
        v-for="user in offlineUsers"
        v-bind:key="user.uuid"
        :user="user"
        @setUserPopoutUuid="setUserPopoutUuid"
        :offline="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import UserListItem from "@/components/User/UserListItem.vue";
import { computed } from "vue";

export default defineComponent({
  components: {
    UserListItem,
  },
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onlineUsers = computed(() => {
      return props.users.filter((user) => user.online === true);
    });

    const offlineUsers = computed(() => {
      return props.users.filter((user) => user.online !== true);
    });

    const setUserPopoutUuid = (userUuid: string, element: HTMLElement) => {
      emit("setUserPopoutUuid", userUuid, element);
    };

    return {
      onlineUsers,
      offlineUsers,
      setUserPopoutUuid,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.user-list {
  display: flex;
  flex-direction: column;
  width: 220px;
  padding: 20px 10px;
  flex-grow: 1;
  flex-shrink: 0;
  user-select: none;

  .list {
    margin-bottom: 20px;

    .status {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      font-weight: 500;
      text-transform: uppercase;
      margin-bottom: 10px;

      .separator {
        height: 1px;
        width: 100%;
        flex-grow: 1;
        border-top: 1px solid $border-color;
        margin: 0px 16px;
      }
    }
  }
}
</style>
