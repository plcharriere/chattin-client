<template>
  <div class="message-list">
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
import { Options, Vue } from "vue-class-component";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import MessageListItem from "@/components/Message/MessageListItem.vue";
import { datesAreOnSameDay, getUserByUuid } from "@/utils";

@Options({
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
      default: [],
    },
    messages: {
      type: Array as PropType<Message[]>,
      default: [],
    },
  },
  methods: {
    getUserByUuid: getUserByUuid,
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

  showUser(previousMessage: Message, currentMessage: Message): boolean {
    if (previousMessage.userUuid !== currentMessage.userUuid) return true;
    if (!datesAreOnSameDay(currentMessage.date, previousMessage.date))
      return true;
    if (
      currentMessage.date.getTime() - previousMessage.date.getTime() >
      600 * 1000
    )
      return true;
    return false;
  }

  setUserPopoutUuid(userUuid: string, element: HTMLElement): void {
    this.$emit("setUserPopoutUuid", userUuid, element);
  }

  editMessage(uuid: string, content: string): void {
    this.$emit("editMessage", uuid, content);
  }

  deleteMessage(uuid: string): void {
    this.$emit("deleteMessage", uuid);
  }
}
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
