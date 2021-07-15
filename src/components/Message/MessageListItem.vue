<template>
  <div class="message" :class="{ user: showUser }">
    <template v-if="showUser">
      <UserAvatar :user="user" size="medium" />
      <div class="container">
        <div class="infos">
          <UserName :user="user" />
          <div class="date">{{ getMessageDateString(message, false) }}</div>
        </div>
        <div class="content">{{ message.content }}</div>
      </div>
    </template>
    <template v-else>
      <div class="date small">{{ getMessageDateString(message, true) }}</div>
      <div class="content">{{ message.content }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { format, isToday, isYesterday } from "date-fns";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";

@Options({
  components: {
    UserAvatar,
    UserName,
  },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    showUser: {
      type: Boolean,
      default: true,
    },
  },
})
export default class MessageList extends Vue {
  getMessageDateString(message: Message, onlyHour: boolean): string {
    if (onlyHour) return format(message.date, "h:mm aa");
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
  align-items: center;
  padding: 6px 0px;

  &:hover {
    background: #eee;

    .date {
      &.small {
        visibility: visible;
      }
    }
  }

  .date {
    font-size: 12px;
    color: #777;

    &.small {
      visibility: hidden;
      text-align: center;
      width: 74px;
    }
  }

  &.user {
    padding: 6px 16px;
    margin-top: 12px;

    .container {
      margin-left: 16px;

      .infos {
        display: flex;
        flex-direction: row;
        margin-top: 1px;
        margin-bottom: 8px;
        align-items: center;

        .date {
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
