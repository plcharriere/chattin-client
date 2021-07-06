<template>
  <div class="name">
    {{ getUserName(user) }}
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
})
export default class UserName extends Vue {
  getUserName(user: User): string {
    return user.nickname.length > 0 ? user.nickname : user.login;
  }
}
</script>

<style scoped lang="scss">
.name {
  color: #222;
}
</style>
