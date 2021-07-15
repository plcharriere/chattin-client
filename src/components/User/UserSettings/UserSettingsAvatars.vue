<template>
  <div class="avatars">
    <div class="edit">
      <div class="avatar">
        <UserAvatar
          :uuid="user.avatarUuid"
          size="large"
          :overlay="!loading"
          overlayIcon="upload"
          :overlayClickCallback="avatarClick"
          :overrideUrl="avatarPreviewUrl"
        />
        <span class="remove" @click="removeCurrentAvatar">Remove</span>
      </div>
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
        :class="{ disabled: loading || avatarPreviewUrl === null }"
      >
        Save
      </button>
    </div>
    <div class="list" :class="{ empty: avatars.length === 0 }">
      <span v-if="avatars.length === 0">You haven't uploaded any avatar.</span>
      <UserAvatar
        v-else
        v-for="uuid in avatars"
        v-bind:key="uuid"
        size="medium"
        :overlay="true"
        overlayIcon="arrow-up"
        :overrideUuid="uuid"
      />
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
import { getAvatars } from "@/api/http";

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

  avatars: string[] = [];

  mounted(): void {
    this.fetchAvatars();
  }

  async fetchAvatars(): Promise<void> {
    this.avatars = (await getAvatars(this.$store.state.token)).reverse() || [];
  }

  getAvatarUrl(uuid: string): string {
    return `${httpUrl}/avatars/${uuid}`;
  }

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

  removeCurrentAvatar(): void {
    this.avatarPreviewUrl = "default";
  }

  chooseAvatarUuid(uuid: string): void {
    console.log(uuid);
  }

  save(): void {
    this.loading = true;
    const avatarFileInput = document.getElementById(
      "avatarFileInput"
    ) as HTMLInputElement;
    const formData = new FormData();
    formData.append("token", this.$store.state.token);
    if (this.avatarFile) {
      formData.append("file", this.avatarFile);
    }
    axios.post(httpUrl + "/avatars", formData).then(async () => {
      await this.fetchAvatars();
      this.loading = false;
      this.avatarPreviewUrl = "";
      this.avatarFile = null;
      avatarFileInput.value = "";
    });
  }
}
</script>

<style scoped lang="scss">
.avatars {
  width: 100%;
  display: flex;
  flex-direction: column;

  .edit {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .avatar {
      display: flex;
      flex-direction: column;
      align-items: center;

      .remove {
        cursor: pointer;
        color: #007fff;
        margin-top: 8px;
        font-size: 13px;

        &:hover {
          text-decoration: underline;
        }
      }
    }

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
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    border-top: 1px solid #ddd;
    padding: 20px 0;

    &.empty {
      padding: 40px;
      justify-content: center;
      align-items: center;

      span {
        color: #666;
      }
    }

    .avatar {
      margin-right: 20px;
    }
  }
}
</style>
