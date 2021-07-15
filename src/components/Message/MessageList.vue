<template>
  <div class="messages">
    <MessageListItem
      v-for="(message, index) in messages"
      v-bind:key="message.uuid"
      :message="message"
      :user="getUserByUuid(users, message.userUuid)"
      :showUser="index === 0 ? true : showUser(messages[index - 1], message)"
      @setUserPopoutUuid="setUserPopoutUuid"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import MessageListItem from "@/components/Message/MessageListItem.vue";
import { getUserByUuid } from "@/utils";

@Options({
  components: {
    MessageListItem,
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
}
</script>

<style scoped lang="scss">
.messages {
  flex-grow: 1;
  min-width: 400px;
  height: 0;
  overflow: auto;
  padding-bottom: 20px;
}
</style>
