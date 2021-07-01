<template>
  <div class="message" v-for="message in messages" v-bind:key="message.uuid">
    <img
      class="avatar"
    />
    <div class="container">
      <div class="infos">
        <div class="name">{{ getMessageUserName(message, users) }}</div>
        <div class="date">{{ getMessageDateString(message) }}</div>
      </div>
      <div class="content">{{ message.content }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import router from "../router/index";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { format, isToday, isYesterday } from "date-fns";

@Options({
  props: {
    users: {
      type: Array as PropType<User[]>,
      default: [],
    },
    messages: {
      type: Array as PropType<Message[]>,
      default: [],
    },
  },
})
export default class MessageList extends Vue {
  getMessageUserName(message: Message, users: User[]): string {
    const user = users.find((user) => user.uuid == message.userUuid);
    if (user) return user.nickname.length > 0 ? user.nickname : user.login;
    return "Deleted User";
  }

  getMessageDateString(message: Message) {
    if (isToday(message.date))
      return format(message.date, "'Today at' h:mm aa");
    if (isYesterday(message.date))
      return format(message.date, "'Yesterday at' h:mm aa");
    return format(message.date, "dd/MM/yyyy 'at' h:mm aa");
  }
}
</script>

<style scoped lang="scss">
.message {
  display: flex;
  flex-direction: row;
  padding: 6px 20px;
  margin: 12px 0;

  &:hover {
    background: #eee;
  }

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    background: #ddd;
  }

  .container {
    margin-left: 10px;

    .infos {
      display: flex;
      flex-direction: row;
      margin-bottom: 6px;
      align-items: center;

      .name {
        font-weight: 500;
      }
      .date {
        margin-left: 16px;
        font-size: 12px;
        color: #777;
      }
    }
  }
}
</style>
