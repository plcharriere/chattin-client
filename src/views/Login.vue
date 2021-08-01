<template>
  <div class="login">
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
      <button class="btn" @click="login" :disabled="loading">Sign in</button>
      <span class="register" @click="register">Register</span>
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

    document.title = `Login ~ ${store.state.configuration.name}`;

    if (store.state.token != "") router.push("/");
    else {
      const loading = ref(false);
      const error = ref("");

      const login = () => {
        const login = (document.getElementById("login") as HTMLInputElement)
          .value;
        const password = (
          document.getElementById("password") as HTMLInputElement
        ).value;

        if (login.length === 0 || password.length == 0) {
          error.value = "Please fill in all fields.";
        } else {
          loading.value = true;
          const formData = new FormData();
          formData.append("login", login);
          formData.append("password", password);
          axios
            .post(httpUrl + "/users/login", formData)
            .then((resp) => {
              store.state.token = resp.data;
              localStorage.setItem("token", resp.data);
              router.push("/");
            })
            .catch((e) => {
              error.value =
                e.response.status === 401
                  ? "Wrong credentials"
                  : "Unexpected error";
              loading.value = false;
            });
        }
      };

      const register = () => {
        router.push("/register");
      };

      return {
        loading,
        error,
        login,
        register,
        name: store.state.configuration.name,
        description: store.state.configuration.description,
      };
    }
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.login {
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
    background: #fff;
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
        font-size: 25px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .description {
        color: $light-color;
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

    .register {
      cursor: pointer;
      margin-top: 20px;
      margin-bottom: 0;
      text-decoration: underline;
      font-size: 12px;
    }
  }
}
</style>
