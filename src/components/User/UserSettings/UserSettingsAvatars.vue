<template>
  <div class="avatars">
    <div class="avatar">
      <UserAvatar
        :user="user"
        size="large"
        :editable="!loading"
        editIcon="upload"
        :editCallback="avatarClick"
        :overrideUrl="avatarPreviewUrl"
      />
      <input
        type="file"
        id="avatarFileInput"
        @change="avatarChange"
        :disabled="loading"
        accept="image/png, image/gif, image/jpeg, image/webp"
      />
      <button
        class="btn"
        @click="save"
        :class="{ disabled: loading || avatarPreviewUrl.length === 0 }"
      >
        Save
      </button>
    </div>
    <div class="list"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
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
})
export default class UserSettingsProfile extends Vue {
  loading = false;

  avatarPreviewUrl = "";
  avatarFile: File | null = null;

  avatarClick(): void {
    const avatarFileInput = document.getElementById("avatarFileInput");
    if (avatarFileInput) avatarFileInput.click();
  }

  avatarChange(event: Event): void {
    if (
      event.target &&
      event.target instanceof HTMLInputElement &&
      event.target.files &&
      event.target.files[0]
    )
      this.avatarFile = event.target.files[0];
    console.log(this.avatarFile?.type);
    this.avatarPreviewUrl = URL.createObjectURL(this.avatarFile);
  }

  save(): void {
    if (this.avatarFile) {
      this.loading = true;
      console.log(this.avatarFile.type);
      const formData = new FormData();
      formData.append("token", this.$store.state.token);
      formData.append("file", this.avatarFile);
      axios.post("http://localhost:2727/avatars", formData).then(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped lang="scss">
.avatars {
  width: 100%;
  display: flex;
  flex-direction: column;

  .avatar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    input {
      border: 0;
      width: auto;
      margin: 0;
      padding: 0;
      border-radius: 0;
    }

    .btn {
      width: 100px;
      height: 30px;
    }
  }

  .list {
    margin-top: 20px;
    border-top: 1px solid #ddd;
  }
}
</style>
