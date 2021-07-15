<template>
  <div class="users">
    <div class="list" v-if="getOnlineUsers(users).length > 0">
      <div class="status">
        <div>Online</div>
        <div class="separator"></div>
        <div>{{ getOnlineUsers(users).length }}</div>
      </div>
      <UserListItem
        v-for="user in getOnlineUsers(users)"
        v-bind:key="user.uuid"
        :user="user"
        @click="setUserPopoutUuid(user.uuid)"
      />
    </div>
    <div class="list" v-if="getOfflineUsers(users).length > 0">
      <div class="status">
        <div>Offline</div>
        <div class="separator"></div>
        <div>{{ getOfflineUsers(users).length }}</div>
      </div>
      <UserListItem
        v-for="user in getOfflineUsers(users)"
        v-bind:key="user.uuid"
        :user="user"
        @click="setUserPopoutUuid(user.uuid)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserListItem from "@/components/User/UserListItem.vue";

@Options({
  components: {
    UserListItem,
  },
  props: {
    users: {
      type: Array as PropType<User[]>,
      default: [],
    },
  },
})
export default class UserList extends Vue {
  getOnlineUsers(users: User[]): User[] {
    return users.filter((user) => user.online === true);
  }

  getOfflineUsers(users: User[]): User[] {
    return users.filter((user) => user.online === false);
  }

  setUserPopoutUuid(userUuid: string): void {
    this.$emit("setUserPopoutUuid", userUuid);
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.users {
  display: flex;
  flex-direction: column;
  width: 220px;
  padding: 20px 10px;
  flex-grow: 1;
  flex-shrink: 0;
  border-left: 1px solid $border-color;

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
