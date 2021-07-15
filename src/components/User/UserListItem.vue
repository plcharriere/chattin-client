<template>
  <div class="user">
    <UserAvatar :user="user" size="tiny" />
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
export default class UserListItem extends Vue {}
</script>

<style scoped lang="scss">
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
    background: #eee;
    border-radius: 5px;
  }
}
</style>
