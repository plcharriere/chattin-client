<template>
  <div class="user">
    <UserAvatar
      :user="user"
      size="large"
      :editable="true"
      :editCallback="editAvatar"
    />
    <div class="form">
      <span>Login :</span>
      <input type="text" disabled :value="user.login" />
      <span>Nickname :</span>
      <input type="text" id="nickname" v-model="profileEdit.nickname" />
      <span>Bio :</span>
      <textarea type="text" v-model="profileEdit.bio" />
      <button class="btn" @click="save">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User, UserProfileEdit } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import axios from "axios";

@Options({
  components: {
    UserAvatar,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  mounted() {
    this.setProfileEdit(this.user);
  },
})
export default class UserSettingsProfile extends Vue {
  profileEdit: UserProfileEdit = {
    nickname: "",
    bio: "",
  };

  setProfileEdit(user: User): void {
    this.profileEdit.nickname = user.nickname;
  }

  editAvatar(): void {
    this.$emit("setMenuIndex", 1);
  }

  save(): void {
    axios
      .post("http://localhost:2727/user/profile", this.profileEdit)
      .then((resp) => {
        console.log(resp);
      });
  }
}
</script>

<style scoped lang="scss">
.user {
  width: 100%;
  display: flex;
  flex-direction: row;

  .form {
    flex-grow: 1;
    margin-left: 30px;
    display: flex;
    flex-direction: column;

    span {
      margin-bottom: 5px;
    }

    textarea {
      height: 70px;
    }

    .btn {
      width: 100px;
      align-self: flex-end;
    }
  }
}
</style>
