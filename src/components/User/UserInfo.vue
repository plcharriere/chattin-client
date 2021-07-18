<template>
  <div class="user-info">
    <UserAvatar :uuid="user.avatarUuid" size="tiny" />
    <UserName :user="user" class="name" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
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
export default class UserInfo extends Vue {}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.user-info {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  width: 200px;
  padding: 20px 20px;
  align-items: center;

  .name {
    padding-left: 10px;
  }

  &:hover {
    background: $hover-color;
    cursor: pointer;
  }
}
</style>
