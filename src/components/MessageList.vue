<template>
  <div class="messages">
    <div class="message" v-for="message in messages" v-bind:key="message.uuid">
      <UserAvatar
        :user="getUserByUuid(users, message.userUuid)"
        size="medium"
      />
      <div class="container">
        <div class="infos">
          <UserName :user="getUserByUuid(users, message.userUuid)" />
          <div class="date">{{ getMessageDateString(message) }}</div>
        </div>
        <div class="content">{{ message.content }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { format, isToday, isYesterday } from "date-fns";
import UserAvatar from "@/components/UserAvatar.vue";
import UserName from "@/components/UserName.vue";

@Options({
  components: {
    UserAvatar,
    UserName,
  },
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
  watch: {
    messages() {
      this.fixScroll();
    },
  },
})
export default class MessageList extends Vue {
  mounted(): void {
    this.$el.addEventListener("scroll", () => {
      if (this.$el.scrollTop === 0) {
        this.$emit("scrolledTop");
      }
    });
  }

  fixScroll(): void {
    const isScrollBarAtTheBottom =
      this.$el.scrollTop >= this.$el.scrollHeight - this.$el.offsetHeight;
    const currentScrollHeight = this.$el.scrollHeight;
    this.$nextTick().then(() => {
      if (isScrollBarAtTheBottom) this.$el.scrollTop = this.$el.scrollHeight;
      else if (this.$el.scrollTop === 0)
        this.$el.scrollTop = this.$el.scrollHeight - currentScrollHeight;
    });
  }

  getUserByUuid(users: User[], uuid: string): User | undefined {
    return users.find((user) => user.uuid === uuid);
  }

  getMessageUserName(message: Message, users: User[]): string {
    const user = users.find((user) => user.uuid == message.userUuid);
    if (user) return user.nickname.length > 0 ? user.nickname : user.login;
    return "Deleted User";
  }

  getMessageDateString(message: Message): string {
    if (isToday(message.date))
      return format(message.date, "'Today at' h:mm aa");
    if (isYesterday(message.date))
      return format(message.date, "'Yesterday at' h:mm aa");
    return format(message.date, "dd/MM/yyyy 'at' h:mm aa");
  }
}
</script>

<style scoped lang="scss">
.messages {
  flex-grow: 1;
  min-width: 400px;
  border-bottom: 1px solid #ddd;
  height: 0;
  overflow: auto;

  .message {
    display: flex;
    flex-direction: row;
    padding: 6px 20px;
    margin: 12px 0;

    &:hover {
      background: #eee;
    }

    .container {
      margin-left: 10px;

      .infos {
        display: flex;
        flex-direction: row;
        margin-top: 1px;
        margin-bottom: 6px;
        align-items: center;

        .date {
          margin-left: 16px;
          font-size: 12px;
          color: #777;
        }
      }
    }
  }
}
</style>
