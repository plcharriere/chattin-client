<template>
  <div class="register">
    <div class="container">
      <h1>Chattin</h1>
      <span>{{ error.length > 0 ? error : "Register" }}</span>
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
      <button @click="register" :disabled="loading">Sign up</button>
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

    if (store.state.token != "") router.push("/");
    else {
      const loading = ref(false);
      const error = ref("");

      const register = () => {
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

        axios.post(httpUrl + "/users/register", formData).then((resp) => {
          if (resp.status === 200) {
            store.state.token = resp.data;
            localStorage.setItem("token", resp.data);
            router.push("/");
          } else {
            error.value =
              resp.status === 409
                ? "Username already taken"
                : "Unexpected error";
            loading.value = false;
          }
        });
      };

      const login = () => {
        router.push("/login");
      };

      return {
        loading,
        error,
        register,
        login,
      };
    }
  },
});
</script>

<style scoped lang="scss">
.register {
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

    span {
      margin-bottom: 20px;
      text-align: center;
      line-height: 18px;
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

    .login {
      cursor: pointer;
      margin-top: 20px;
      text-decoration: underline;
      font-size: 12px;
    }
  }
}
</style>
