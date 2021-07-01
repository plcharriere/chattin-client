<template>
  <UserListItem :user="user" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserListItem from "@/components/UserListItem.vue";

@Options({
  components: {
    UserListItem,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
})
export default class UserInfo extends Vue {}
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
