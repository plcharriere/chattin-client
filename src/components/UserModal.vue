<template>
  <div class="overlay" @click="closeCallback"></div>
  <div class="container">
    <div class="modal">
      <svg
        class="close"
        @click="closeCallback"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <div class="user">
        <UserAvatar :user="user" size="large" :editable="true" />
        <div class="form">
          <span>Login :</span>
          <input type="text" disabled :value="user.login" />
          <span>Nickname :</span>
          <input type="text" :value="user.nickname" />
        </div>
      </div>
      <button class="submit">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/UserAvatar.vue";
import UserName from "@/components/UserName.vue";

@Options({
  components: {
    UserAvatar,
    UserName,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    closeCallback: {
      type: Function,
      default: null,
    },
  },
})
export default class UserModal extends Vue {}
</script>

<style scoped lang="scss">
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal {
    position: relative;
    background: #fff;
    min-width: 500px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 50px;
    align-items: flex-end;
    z-index: 2;

    .close {
      position: absolute;
      color: #555;
      width: 24px;
      height: 24px;
      top: 16px;
      right: 16px;
      cursor: pointer;
    }

    .user {
      width: 100%;
      display: flex;
      flex-direction: row;

      .form {
        flex-grow: 1;
        margin-top: 5px;
        margin-left: 25px;
        margin-right: 30px;
        display: flex;
        flex-direction: column;

        span {
          margin-bottom: 5px;
        }

        input {
          width: 100%;
          max-width: 100%;

          padding: 8px 14px;
          border-radius: 5px;
          font-size: 15px;
          margin-bottom: 20px;
          outline: 0;
          border: 1px solid #ddd;

          &:focus {
            border-color: #3296ff;
          }
        }
      }
    }

    .submit {
      padding: 8px 25px;
      border: 1px solid rgb(0, 180, 0);
      border-radius: 5px;
      background: transparent;
      color: rgb(0, 180, 0);
      cursor: pointer;
      outline: 0;

      &:hover {
        background: rgba(0, 180, 0, 0.2);
      }
    }
  }
}
</style>
