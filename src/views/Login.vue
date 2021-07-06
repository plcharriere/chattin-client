<template>
  <div class="main">
    <div
      :class="[
        'catto',
        { loading: loading },
        { polite: authenticated },
        { menacing: !loading && !authenticated },
      ]"
    ></div>
    <span v-if="loading">wait lemmi check dis out...</span>
    <span v-else-if="authenticated"
      >looks like everithing is fine, pls proceed sir</span
    >
    <span v-else-if="wrong"><b>wrong credentials!!!!</b></span>
    <span v-else>hold on sir, authenticate <b>now!!!!</b></span>
    <template v-if="authenticated">
      <button @click="proceed">alright, lets proceed then!!!1</button>
    </template>
    <template v-else>
      <input
        type="text"
        id="login"
        placeholder="ok my name is"
        :disabled="loading"
      />
      <input
        type="password"
        id="password"
        placeholder="and my secret is"
        :disabled="loading"
      />
      <button @click="login" :disabled="loading">sure catto</button>
      <span class="register" @click="register">i wanna register pls</span>
    </template>
  </div>
</template>

<script lang="ts">
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
    axios
      .post(httpUrl + "/login", {
        login: (document.getElementById("login") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement)
          .value,
      })
      .then((resp) => {
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
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  .catto {
    width: 64px;
    height: 64px;
    border-radius: 2px;
    margin-bottom: 15px;
    transition: all 300ms;

    &:hover {
      transform: scale(1.15);
    }

    &.menacing {
      background: url(~@/assets/img/menacing-catto.png);
      background-size: contain;
    }

    &.loading {
      background: url(h~@/assets/img/loading-catto.gif);
      background-size: contain;
    }

    &.polite {
      background: url(~@/assets/img/polite-catto.png);
      background-size: contain;
    }
  }

  span {
    margin-bottom: 20px;
  }

  input {
    margin-bottom: 10px;
    padding: 10px 20px;
    width: 200px;
    border-radius: 20px;
    border: 2px solid #ccc;
    outline: 0;
    transition: all 300ms;

    &:hover {
      transform: scale(1.04);
      border-color: #3296ff;
    }
    &:focus {
      transform: scale(1.06);
      border-color: #3296ff;
    }
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
</style>
