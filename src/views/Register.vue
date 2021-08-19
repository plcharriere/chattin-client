<template>
  <div class="register">
    <div class="container">
      <div class="infos">
        <span class="name">{{ name }}</span>
        <span class="description">{{ description }}</span>
      </div>
      <span v-if="error.length > 0" class="error">{{ error }}</span>
      <input
        type="text"
        id="login"
        placeholder="Username"
        :disabled="loading"
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        :disabled="loading"
      />
      <input
        type="password"
        id="confirm-password"
        placeholder="Confirm password"
        :disabled="loading"
      />
      <button class="btn" @click="register" :disabled="loading">Sign up</button>
      <span class="login" @click="login">Login</span>
    </div>
  </div>
</template>

<script lang="ts">
import { httpUrl } from "@/env";
import { defineComponent } from "@vue/runtime-core";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();

    document.title = `Register ~ ${store.state.configuration.name}`;

    if (store.state.token != "") router.push("/");
    else {
      const loading = ref(false);
      const error = ref("");

      const register = () => {
        loading.value = true;

        const login = (document.getElementById("login") as HTMLInputElement)
          .value;
        const password = (
          document.getElementById("password") as HTMLInputElement
        ).value;
        const confirmPassword = (
          document.getElementById("confirm-password") as HTMLInputElement
        ).value;

        if (password !== confirmPassword) {
          error.value = "Passwords do not match.";

          loading.value = false;
        } else {
          const formData = new FormData();
          formData.append("login", login);
          formData.append("password", password);

          axios
            .post(httpUrl + "/users/register", formData)
            .then((resp) => {
              store.state.token = resp.data;
              localStorage.setItem("token", resp.data);
              router.push("/");
            })
            .catch((e) => {
              error.value =
                e.response.status === 409
                  ? "Username is already taken."
                  : "Unexpected error.";
              loading.value = false;
            });
        }
      };

      const login = () => {
        router.push("/login");
      };

      return {
        loading,
        error,
        register,
        login,
        name: store.state.configuration.name,
        description: store.state.configuration.description,
      };
    }
  },
});
</script>

<style scoped lang="scss">
.register {
  width: 100%;
  height: 100%;
  background: #eee;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  .container {
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--background-color);
    border-radius: 10px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 30px;

    .infos {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      .name {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .description {
        color: var(--light-color);
        font-size: 13px;
      }
    }

    input {
      border-radius: 20px;
      padding: 10px 20px;
    }

    .error {
      color: rgb(220, 0, 0);
      margin-bottom: 20px;
    }

    .login {
      cursor: pointer;
      margin-top: 20px;
      margin-bottom: 0;
      text-decoration: underline;
      font-size: 12px;
    }
  }
}
</style>
