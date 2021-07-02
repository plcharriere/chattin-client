<template>
  <div class="main">
    <div class="doggo"></div>
    <span v-if="loading">mmmh let me think about it...</span>
    <span v-else-if="registered"
      >thanks for bepis hooman!!!!<br />looks like everithing is fine, pls
      proceed sir</span
    >
    <span v-else-if="wrong"
      >sorry hooman, <b>something went wrong...</b><br />pls try again</span
    >
    <span v-else
      >henlo sir, i am register doggo<br />pls <b>register</b> below</span
    >
    <template v-if="registered">
      <button @click="proceed">thamks register doggo!!!!</button>
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
      <button @click="register" :disabled="loading">
        here doggo, have some bepis
      </button>
      <span class="login" @click="login">pranked i wanna login pls</span>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";

@Options({
  props: {},
})
export default class Main extends Vue {
  loading = false;
  registered = false;
  wrong = false;

  mounted(): void {
    if (this.$store.state.token != "") {
      this.$router.push("/");
    }
  }

  register(): void {
    this.loading = true;
    axios
      .post("http://localhost:2727/register", {
        login: (document.getElementById("login") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement)
          .value,
      })
      .then((resp) => {
        setTimeout(() => {
          if (resp.data.length != 64) {
            this.wrong = true;
          } else {
            this.$store.state.token = resp.data;
            localStorage.setItem("token", resp.data);
            this.wrong = false;
            this.registered = true;
          }
          this.loading = false;
        }, 2000);
      });
  }

  login(): void {
    this.$router.push("/login");
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

  .doggo {
    width: 64px;
    height: 64px;
    border-radius: 2px;
    margin-bottom: 15px;
    transition: all 300ms;
    background: url(~@/assets/img/polite-doggo.png);
    background-size: contain;

    &:hover {
      transform: scale(1.15);
    }
  }

  span {
    margin-bottom: 20px;
    text-align: center;
    line-height: 18px;
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

  .login {
    cursor: pointer;
    margin-top: 20px;
    text-decoration: underline;
    font-size: 12px;
  }
}
</style>
