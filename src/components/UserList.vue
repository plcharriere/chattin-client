<template>
  <div class="users">
    <div class="list" v-if="getOnlineUsers(users).length > 0">
      <div class="status">
        <div>Online</div>
        <div class="separator"></div>
        <div>{{ getOnlineUsers(users).length }}</div>
      </div>
      <div
        v-for="user in getOnlineUsers(users)"
        v-bind:key="user.uuid"
        class="user online"
      >
        <img class="avatar" />
        <div class="name">{{ getUserName(user) }}</div>
      </div>
    </div>
    <div class="list" v-if="getOfflineUsers(users).length > 0">
      <div class="status">
        <div>Offline</div>
        <div class="separator"></div>
        <div>{{ getOfflineUsers(users).length }}</div>
      </div>
      <div
        v-for="user in getOfflineUsers(users)"
        v-bind:key="user.uuid"
        class="user offline"
      >
        <img class="avatar" />
        <div class="name">{{ getUserName(user) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import router from "../router/index";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";

@Options({
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

  getUserName(user: User) {
    return user.nickname.length > 0 ? user.nickname : user.login;
  }
}
</script>

<style scoped lang="scss">
.users {
  display: flex;
  flex-direction: column;
  width: 220px;
  padding: 20px 10px;
  flex-grow: 1;
  flex-shrink: 0;
  border-left: 1px solid #ddd;

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
        border-top: 1px solid #ddd;
        margin: 0px 16px;
      }
    }

    .user {
      display: flex;
      flex-direction: row;
      padding: 5px 10px;
      margin: 4px 0;
      align-items: center;
      cursor: pointer;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        background: #ddd;
      }

      .name {
        padding-left: 10px;
      }

      &:hover {
        background: #eee;
        border-radius: 5px;
      }
    }
  }
}
</style>
