<template>
  <div class="login">
    <div class="container">
      <h1>Chattin</h1>
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
        axios.post(httpUrl + "/login", formData).then((resp) => {
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
      };
    }
  },
});
</script>

<!--<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";
import { httpUrl } from "@/env";

@Options({
  props: {},
})
export default class Main extends Vue {
  loading = false;
  authenticated = false;
  wrong = false;

  mounted(): void {
    if (this.$store.state.token != "") {
      this.$router.push("/");
    }
  }

  login(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append(
      "login",
      (document.getElementById("login") as HTMLInputElement).value
    );
    formData.append(
      "password",
      (document.getElementById("password") as HTMLInputElement).value
    );
    axios.post(httpUrl + "/login", formData).then((resp) => {
      setTimeout(() => {
        if (resp.data == -1) {
          this.wrong = true;
        } else {
          this.$store.state.token = resp.data;
          localStorage.setItem("token", resp.data);
          this.wrong = false;
          this.authenticated = true;
        }
        this.loading = false;
      }, 2000);
    });
  }

  register(): void {
    this.$router.push("/register");
  }

  proceed(): void {
    if (this.$store.state.token != "") {
      this.$router.push("/");
    } else {
      this.$router.push("/login");
    }
  }
}
</script>-->

<style scoped lang="scss">
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
