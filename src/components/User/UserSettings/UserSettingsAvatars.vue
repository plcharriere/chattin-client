<template>
  <div class="avatars">
    <div class="edit">
      <div class="avatar">
        <UserAvatar
          :user="user"
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
        class="btn btn-green"
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
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import axios from "axios";
import { httpUrl } from "@/env";
import { getAvatars } from "@/api/http";
import { TrashIcon } from "@heroicons/vue/solid";
import { useStore } from "vuex";
import { ref } from "vue";

export default defineComponent({
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
  setup() {
    const loading = ref(false);

    const avatars = ref([] as string[]);

    const previewUrl = ref("");
    const previewUuid = ref("");

    const file = ref(null as File | null);

    const store = useStore();

    const fetchAvatars = async (): Promise<void> => {
      avatars.value = (await getAvatars(store.state.token)).reverse() || [];
    };

    fetchAvatars();

    const previewClick = () => {
      const fileInput = document.getElementById("avatarFile");
      if (fileInput) fileInput.click();
    };

    const previewChange = (event: Event) => {
      if (
        event.target &&
        event.target instanceof HTMLInputElement &&
        event.target.files &&
        event.target.files[0]
      )
        file.value = event.target.files[0];
      previewUrl.value = URL.createObjectURL(file.value);
    };

    const previewRemove = () => {
      previewUrl.value = "default";
    };

    const avatarClick = (uuid: string) => {
      previewUrl.value = "";
      file.value = null;
      previewUuid.value = uuid;
    };

    const deleteAvatar = (uuid: string) => {
      axios
        .delete(`${httpUrl}/avatars/${uuid}`, {
          headers: {
            token: store.state.token,
          },
        })
        .then(async () => {
          await fetchAvatars();
        });
    };

    const save = () => {
      loading.value = true;

      const formData = new FormData();
      if (file.value) formData.append("file", file.value);
      else if (previewUuid.value) formData.append("uuid", previewUuid.value);
      axios
        .post(httpUrl + "/avatars", formData, {
          headers: {
            token: store.state.token,
          },
        })
        .then(async () => {
          await fetchAvatars();
          loading.value = false;
          previewUrl.value = "";
          previewUuid.value = "";
          file.value = null;
          (document.getElementById("avatarFile") as HTMLInputElement).value =
            "";
        });
    };

    return {
      loading,
      avatars,
      previewUrl,
      previewUuid,
      previewClick,
      previewChange,
      previewRemove,
      avatarClick,
      deleteAvatar,
      save,
    };
  },
});
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
        color: var(--link-color);
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
    border-top: 1px solid var(--border-color);
    padding: 20px 0;

    &.empty {
      padding: 40px;
      justify-content: center;
      align-items: center;

      span {
        color: var(--light-color);
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
        color: var(--icon-button-color);

        &:hover {
          text-decoration: underline;
          color: var(--icon-button-hover-color);
        }
      }
    }
  }
}
</style>
