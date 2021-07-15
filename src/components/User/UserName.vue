<template>
  <div
    class="name"
    :class="{ clickable: openPopoutUuid.length > 0 }"
    @click="nameClick(openPopoutUuid)"
  >
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
    openPopoutUuid: {
      type: String,
      default: "",
    },
  },
})
export default class UserName extends Vue {
  getUserName(user: User): string {
    return user.nickname.length > 0 ? user.nickname : user.login;
  }

  nameClick(openPopoutUuid: string): void {
    if (openPopoutUuid !== "")
      this.$emit("setUserPopoutUuid", openPopoutUuid, this.$el);
  }
}
</script>

<style scoped lang="scss">
.name {
  color: #222;

  &.clickable {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
