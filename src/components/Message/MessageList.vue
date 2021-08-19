<template>
  <div ref="messageList" class="message-list">
    <div v-if="reachedTop" class="channel-intro">
      <div class="text">
        <div class="channel-name">
          <HashtagIcon class="hashtag" />
          {{ channel.name }}
        </div>
        <div>This is the beginning of this channel.</div>
        <div class="channel-description">{{ channel.description }}</div>
      </div>
      <div class="date-separator">
        <div class="date" v-if="messages.length > 0">
          {{ format(messages[0].date, "PPP") }}
        </div>
      </div>
    </div>
    <template v-for="(message, index) in messages" v-bind:key="message.uuid">
      <div
        v-if="
          index > 0
            ? !datesAreOnSameDay(messages[index - 1].date, message.date)
            : false
        "
        class="date-separator"
      >
        <div class="date">
          {{ format(message.date, "PPP") }}
        </div>
      </div>
      <MessageListItem
        :message="message"
        :user="getUserByUuid(users, message.userUuid)"
        :showUser="index === 0 ? true : showUser(messages[index - 1], message)"
        @setUserPopoutUuid="setUserPopoutUuid"
        :canEdit="user.uuid === message.userUuid"
        :editing="editingMessageUuid === message.uuid"
        :canDelete="user.uuid === message.userUuid"
        @editMessage="editMessage"
        @deleteMessage="deleteMessage"
        @setEditingMessageUuid="setEditingMessageUuid"
        @openEmbedViewer="openEmbedViewer"
      />
    </template>
    <transition name="fade">
      <ArrowDownIcon
        v-if="showScrollBottomButton"
        class="scroll-bottom"
        @click="scrollBottom"
      />
    </transition>
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
import { ArrowDownIcon } from "@heroicons/vue/solid";
import { format } from "date-fns";
import { HashtagIcon } from "@heroicons/vue/solid";
import { Channel } from "@/dto/Channel";
import { Embed } from "@/dto/Embed";

export default defineComponent({
  components: {
    ArrowDownIcon,
    MessageListItem,
    HashtagIcon,
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
    reachedTop: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
    editingMessageUuid: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const messageList = ref();
    const showScrollBottomButton = ref(false);

    onMounted(() => {
      messageList.value.addEventListener("scroll", () => {
        if (messageList.value.scrollTop === 0) {
          emit("scrolledTop");
        } else if (
          messageList.value.scrollHeight -
            messageList.value.offsetHeight -
            messageList.value.scrollTop >=
          5000
        ) {
          if (!showScrollBottomButton.value)
            showScrollBottomButton.value = true;
        } else {
          if (showScrollBottomButton.value)
            showScrollBottomButton.value = false;
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

    const setEditingMessageUuid = (messageUuid: string) => {
      emit("setEditingMessageUuid", messageUuid);
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

    const scrollBottom = () => {
      messageList.value.scrollTo({
        top: messageList.value.scrollHeight - messageList.value.offsetHeight,
        behavior: "smooth",
      });
    };

    const openEmbedViewer = (embeds: Embed[], embedIndex: number) => {
      emit("openEmbedViewer", embeds, embedIndex);
    };

    return {
      messageList,
      showUser,
      datesAreOnSameDay,
      editMessage,
      deleteMessage,
      setUserPopoutUuid,
      fixScroll,
      scrollBottom,
      showScrollBottomButton,
      getUserByUuid,
      setEditingMessageUuid,
      format,
      openEmbedViewer,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/animations.scss";

.message-list {
  flex-grow: 1;
  min-width: 400px;
  height: 0;
  overflow: auto;
  padding-bottom: 20px;
  overflow-y: scroll;
  position: relative;

  .channel-intro {
    position: relative;
    display: flex;
    flex-direction: column;

    .text {
      padding: 20px;

      .channel-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 10px;

        svg {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }

      .channel-description {
        margin-top: 10px;
      }
    }

    .date-separator {
      margin: 5px 0px 12px 0px;
    }
  }

  .date-separator {
    position: relative;
    border-top: 1px solid var(--border-color);
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .date {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--light-color);
      font-size: 12px;
      background: var(--background-color);
      padding: 0 10px;
    }
  }

  .scroll-bottom {
    position: fixed;
    width: 20px;
    height: 20px;
    bottom: 90px;
    padding: 10px;
    border-radius: 100%;
    margin-left: -20px;
    left: 50%;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
}
</style>
