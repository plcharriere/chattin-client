<template>
  <div
    class="user-list-item open-user-popout"
    @click="setUserPopoutUuid(user.uuid)"
    :class="{ active: active, offline: offline }"
    v-click-outside="clickOutside"
  >
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
    offline: {
      type: Boolean,
      default: false,
    },
  },
})
export default class UserListItem extends Vue {
  active = false;

  setUserPopoutUuid(userUuid: string): void {
    this.active = true;
    this.$emit("setUserPopoutUuid", userUuid, this.$el);
  }

  clickOutside(): void {
    if (this.active) this.active = false;
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.user-list-item {
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  margin: 4px 0;
  align-items: center;
  cursor: pointer;

  .user-name {
    padding-left: 10px;
  }

  &.offline {
    opacity: 0.5;
  }

  &:hover,
  &.active {
    opacity: 1;
    background: $hover-color;
    border-radius: 5px;
  }
}
</style>
