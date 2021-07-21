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
        v-model="nickname"
        :disabled="loading"
        placeholder="How would you like to be called ?"
      />
      <span>Bio :</span>
      <textarea
        type="text"
        v-model="bio"
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
import { User } from "@/dto/User";
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

  nickname = "";
  bio = "";

  setProfileEdit(user: User): void {
    this.nickname = user.nickname;
    this.bio = user.bio;
  }

  editAvatar(): void {
    this.$emit("setMenuIndex", 1);
  }

  save(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append("nickname", this.nickname);
    formData.append("bio", this.bio);
    axios
      .post(httpUrl + "/users/profile", formData, {
        headers: {
          token: this.$store.state.token,
        },
      })
      .then(() => {
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
