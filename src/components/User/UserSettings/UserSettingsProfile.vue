<template>
  <div class="user">
    <UserAvatar
      :user="user"
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
      <button
        class="btn btn-green"
        @click="saveProfile"
        :class="{ disabled: loading }"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import axios from "axios";
import { httpUrl } from "@/env";
import { ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    UserAvatar,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const nickname = ref(props.user.nickname);
    const bio = ref(props.user.bio);

    const editAvatar = () => {
      emit("setMenuIndex", 1);
    };

    const saveProfile = () => {
      loading.value = true;
      const formData = new FormData();
      formData.append("nickname", nickname.value);
      formData.append("bio", bio.value);
      axios
        .post(`${httpUrl}/users/profile`, formData, {
          headers: {
            token: store.state.token,
          },
        })
        .then(() => {
          loading.value = false;
        });
    };

    return {
      loading,
      nickname,
      bio,
      editAvatar,
      saveProfile,
    };
  },
});
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
