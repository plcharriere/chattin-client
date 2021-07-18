<template>
  <div
    class="name"
    :class="{ clickable: openPopoutUuid.length > 0 }"
    @click="nameClick(openPopoutUuid)"
  >
    {{ getUserName(user) }}
    <small v-if="showLogin && user.nickname.length > 0" class="login">
      {{ user.login }}
    </small>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { getUserName } from "@/utils";
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
    showLogin: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getUserName: getUserName,
  },
})
export default class UserName extends Vue {
  nameClick(openPopoutUuid: string): void {
    if (openPopoutUuid !== "") {
      this.$emit("setUserPopoutUuid", openPopoutUuid, this.$el);
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.name {
  display: flex;
  flex-direction: column;

  .login {
    color: $light-color;
    margin-top: 2px;
  }

  &.clickable {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
