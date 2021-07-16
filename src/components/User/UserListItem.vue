<template>
  <div class="user" @click="setUserPopoutUuid(user.uuid)">
    <UserAvatar :uuid="user.avatarUuid" size="tiny" />
    <UserName :user="user" class="name" />
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";

@Options({
  components: {
    UserAvatar,
    UserName,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
})
export default class UserListItem extends Vue {
  setUserPopoutUuid(userUuid: string): void {
    this.$emit("setUserPopoutUuid", userUuid, this.$el);
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.user {
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  margin: 4px 0;
  align-items: center;
  cursor: pointer;

  .name {
    padding-left: 10px;
  }

  &:hover {
    background: $hover-color;
    border-radius: 5px;
  }
}
</style>
