<template>
  <div class="login">
    <div class="container">
      <div class="infos">
        <span class="name">{{ name }}</span>
        <span class="description">{{ description }}</span>
      </div>
      <span>{{ error.length > 0 ? error : "Please sign in" }}</span>
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
      <button @click="login" :disabled="loading">Sign in</button>
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
        loading.value = true;
        const formData = new FormData();
        formData.append(
          "login",
          (document.getElementById("login") as HTMLInputElement).value
        );
        formData.append(
          "password",
          (document.getElementById("password") as HTMLInputElement).value
        );
        axios.post(httpUrl + "/users/login", formData).then((resp) => {
          if (resp.status === 200) {
            store.state.token = resp.data;
            localStorage.setItem("token", resp.data);
            router.push("/");
          } else {
            error.value =
              resp.status === 401 ? "Wrong credentials" : "Unexpected error";
            loading.value = false;
          }
        });
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
  padding: 15px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  .container {
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .infos {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .name {
        font-size: 25px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .description {
        color: $light-color;
        font-size: 13px;
        margin-bottom: 25px;
      }
    }

    span {
      margin-bottom: 20px;
    }

    button {
      margin-top: 10px;
      padding: 10px 30px;
      border-radius: 20px;
      border: 0;
      background: #ccc;
      outline: 0;
      cursor: pointer;
      transition: all 300ms;

      &:hover {
        background: #bbb;
        transform: scale(1.06);
      }
    }

    .register {
      cursor: pointer;
      margin-top: 20px;
      text-decoration: underline;
      font-size: 12px;
    }
  }
}
</style>
