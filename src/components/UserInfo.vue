<template>
	<UserListItem :user="user" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import router from "../router/index";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserListItem from "@/components/UserListItem.vue";

@Options({
	components: {
		UserListItem
	},
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
}
</style>
