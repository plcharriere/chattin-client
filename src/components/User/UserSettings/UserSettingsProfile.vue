<template>
  <div class="user">
    <UserAvatar
      :uuid="user.avatarUuid"
      size="large"
      :overlay="true"
      overlayIcon="pencil"
      :overlayClickCallback="editAvatar"
    />
    <div class="form">
      <span>Login :</span>
      <input type="text" disabled :value="user.login" />
      <span>Nickname :</span>
      <input
        type="text"
        id="nickname"
        v-model="profileEdit.nickname"
        :disabled="loading"
        placeholder="How would you like to be called ?"
      />
      <span>Bio :</span>
      <textarea
        type="text"
        v-model="profileEdit.bio"
        :disabled="loading"
        placholder="Tell us more about yourself..."
      />
      <button class="btn" @click="save" :class="{ disabled: loading }">
        Save
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User, UserProfileEdit } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import axios from "axios";
import { httpUrl } from "@/env";

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
  loading = false;

  profileEdit: UserProfileEdit = {
    token: "",
    nickname: "",
    bio: "",
  };

  setProfileEdit(user: User): void {
    this.profileEdit.token = this.$store.state.token;
    this.profileEdit.nickname = user.nickname;
    this.profileEdit.bio = user.bio;
  }

  editAvatar(): void {
    this.$emit("setMenuIndex", 1);
  }

  save(): void {
    this.loading = true;
    axios.post(httpUrl + "/users/profile", this.profileEdit).then(() => {
      this.loading = false;
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
