<template>
  <div class="popout" v-click-outside="clickedOutside">
    <div class="infos">
      <UserAvatar :uuid="user.avatarUuid" size="medium" />
      <UserName :user="user" :showLogin="true" />
    </div>
    <div class="bio" v-if="user.bio.length > 0">
      <div class="separator">
        Bio
        <div></div>
      </div>
      {{ user.bio }}
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";
import { getUserName } from "@/utils";

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
  methods: {
    getUserName: getUserName,
  },
})
export default class UserPopout extends Vue {
  clickedOutside(): void {
    this.$emit("clickedOutsidePopout");
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.popout {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 2;

  .infos {
    display: flex;
    flex-direction: row;
    align-items: center;

    .name {
      margin-left: 20px;
      font-size: 20px;
    }
  }

  .bio {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    margin-bottom: 5px;

    .separator {
      display: flex;
      flex-direction: row;
      color: #999;
      font-size: 13px;
      align-items: center;
      margin-bottom: 10px;

      div {
        width: 100%;
        margin-left: 10px;
        border-top: 1px solid $border-color;
      }
    }
  }
}
</style>
