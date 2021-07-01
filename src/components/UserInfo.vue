<template>
  <div class="user">
    <img class="avatar" />
    <div class="name">{{ getUserName(user) }}</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import router from "../router/index";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";

@Options({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
})
export default class UserInfo extends Vue {
  getUserName(user: User): string {
    console.log(user);
    if (user) return user.nickname.length > 0 ? user.nickname : user.login;
    return "";
  }
}
</script>

<style scoped lang="scss">
.user {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  width: 200px;
  padding: 20px 20px;
  align-items: center;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background: #ddd;
  }

  .name {
    padding-left: 10px;
  }
}
</style>
