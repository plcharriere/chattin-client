<template>
  <div ref="messageList" class="message-list">
    <MessageListItem
      v-for="(message, index) in messages"
      v-bind:key="message.uuid"
      :message="message"
      :user="getUserByUuid(users, message.userUuid)"
      :showUser="index === 0 ? true : showUser(messages[index - 1], message)"
      @setUserPopoutUuid="setUserPopoutUuid"
      :canEdit="user.uuid === message.userUuid"
      :canDelete="user.uuid === message.userUuid"
      @editMessage="editMessage"
      @deleteMessage="deleteMessage"
    />
  </div>
</template>

<script lang="ts">
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import {
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  watch,
} from "@vue/runtime-core";
import MessageListItem from "@/components/Message/MessageListItem.vue";
import { datesAreOnSameDay, getUserByUuid } from "@/utils";
import { ref } from "vue";

export default defineComponent({
  components: {
    MessageListItem,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const messageList = ref();

    onMounted(() => {
      messageList.value.addEventListener("scroll", () => {
        if (messageList.value.scrollTop === 0) {
          emit("scrolledTop");
        }
      });
    });

    watch(
      () => props.messages,
      () => {
        fixScroll();
      }
    );

    const showUser = (previousMessage: Message, currentMessage: Message) => {
      if (previousMessage.userUuid !== currentMessage.userUuid) return true;
      if (!datesAreOnSameDay(currentMessage.date, previousMessage.date))
        return true;
      if (
        currentMessage.date.getTime() - previousMessage.date.getTime() >
        600 * 1000
      )
        return true;
      return false;
    };

    const editMessage = (uuid: string, content: string) => {
      emit("editMessage", uuid, content);
    };

    const deleteMessage = (uuid: string) => {
      emit("deleteMessage", uuid);
    };

    const setUserPopoutUuid = (userUuid: string, element: HTMLElement) => {
      emit("setUserPopoutUuid", userUuid, element);
    };

    const fixScroll = () => {
      const isScrollBarAtTheBottom =
        messageList.value.scrollTop >=
        messageList.value.scrollHeight - messageList.value.offsetHeight;
      const currentScrollHeight = messageList.value.scrollHeight;
      nextTick().then(() => {
        if (isScrollBarAtTheBottom)
          messageList.value.scrollTop = messageList.value.scrollHeight;
        else if (messageList.value.scrollTop === 0)
          messageList.value.scrollTop =
            messageList.value.scrollHeight - currentScrollHeight;
      });
    };

    return {
      messageList,
      showUser,
      editMessage,
      deleteMessage,
      setUserPopoutUuid,
      fixScroll,
      getUserByUuid,
    };
  },
});
</script>

<style scoped lang="scss">
.message-list {
  flex-grow: 1;
  min-width: 400px;
  height: 0;
  overflow: auto;
  padding-bottom: 20px;
  padding-right: 4px;
  margin-right: 4px;
  overflow-y: scroll;
}
</style>
