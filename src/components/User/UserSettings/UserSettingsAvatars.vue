<template>
  <div class="avatars">
    <div class="edit">
      <div class="avatar">
        <UserAvatar
          :uuid="user.avatarUuid"
          size="large"
          :overlay="!loading"
          overlayIcon="upload"
          :overlayClickCallback="previewClick"
          :overrideUrl="previewUrl"
          :overrideUuid="previewUuid"
        />
        <span class="remove" @click="previewRemove">Remove</span>
      </div>
      <input
        type="file"
        id="avatarFile"
        @change="previewChange"
        :disabled="loading"
        accept="image/png, image/gif, image/jpeg, image/webp"
      />
      <button
        class="btn"
        @click="save"
        :class="{
          disabled:
            loading || (previewUrl.length === 0 && previewUuid.length === 0),
        }"
      >
        Save
      </button>
    </div>
    <div class="list" :class="{ empty: avatars.length === 0 }">
      <span v-if="avatars.length === 0">You haven't uploaded any avatar.</span>
      <div v-else v-for="uuid in avatars" v-bind:key="uuid" class="item">
        <UserAvatar
          size="medium"
          :overlay="true"
          overlayIcon="arrowUp"
          :overrideUuid="uuid"
          @click="avatarClick(uuid)"
        />
        <TrashIcon class="delete" @click="deleteAvatar(uuid)" />
      </div>
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
import { TrashIcon } from "@heroicons/vue/solid";

@Options({
  components: {
    TrashIcon,
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

  avatars: string[] = [];

  previewUrl = "";
  previewUuid = "";

  file: File | null = null;

  mounted(): void {
    this.fetchAvatars();
  }

  async fetchAvatars(): Promise<void> {
    this.avatars = (await getAvatars(this.$store.state.token)).reverse() || [];
  }

  previewClick(): void {
    const fileInput = document.getElementById("avatarFile");
    if (fileInput) fileInput.click();
  }

  previewChange(event: Event): void {
    if (
      event.target &&
      event.target instanceof HTMLInputElement &&
      event.target.files &&
      event.target.files[0]
    )
      this.file = event.target.files[0];
    this.previewUrl = URL.createObjectURL(this.file);
  }

  previewRemove(): void {
    this.previewUrl = "default";
  }

  avatarClick(uuid: string): void {
    this.previewUrl = "";
    this.file = null;
    this.previewUuid = uuid;
  }

  deleteAvatar(uuid: string): void {
    axios
      .delete(`${httpUrl}/avatars/${uuid}`, {
        headers: {
          token: this.$store.state.token,
        },
      })
      .then(async () => {
        await this.fetchAvatars();
      });
  }

  save(): void {
    this.loading = true;

    const formData = new FormData();
    if (this.file) formData.append("file", this.file);
    else if (this.previewUuid) formData.append("uuid", this.previewUuid);
    axios
      .post(httpUrl + "/avatars", formData, {
        headers: {
          token: this.$store.state.token,
        },
      })
      .then(async () => {
        await this.fetchAvatars();
        this.loading = false;
        this.previewUrl = "";
        this.previewUuid = "";
        this.file = null;
        (document.getElementById("avatarFile") as HTMLInputElement).value = "";
      });
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

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
        color: $link-color;
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
    flex-wrap: wrap;
    margin-top: 20px;
    border-top: 1px solid $border-color;
    padding: 20px 0;

    &.empty {
      padding: 40px;
      justify-content: center;
      align-items: center;

      span {
        color: $light-color;
      }
    }
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0px 10px 15px;

      .delete {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin-top: 8px;
        color: $icon-button-color;

        &:hover {
          text-decoration: underline;
          color: $icon-button-hover-color;
        }
      }
    }
  }
}
</style>
