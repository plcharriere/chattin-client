<template>
  <div class="message-input">
    <textarea
      v-model="message"
      :placeholder="getPlaceholder(channel)"
      v-on:keydown="keyDown"
      v-on:keydown.exact.enter="sendMessage"
    ></textarea>
    <PaperAirplaneIcon class="icon-btn" @click="sendMessage()" />
  </div>
</template>

<script lang="ts">
import { Channel } from "@/dto/Channel";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";
import { PaperAirplaneIcon } from "@heroicons/vue/solid";

@Options({
  components: {
    PaperAirplaneIcon,
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
    },
  },
})
export default class MessageInput extends Vue {
  message = "";

  getPlaceholder(channel: Channel): string {
    if (!channel) return "Message";
    return "Message in #" + channel.name;
  }

  keyDown(e: KeyboardEvent): void {
    if (e.key !== "Enter") this.$emit("keyDown");
  }

  sendMessage(e: KeyboardEvent | null = null): void {
    if (this.message.length > 0) {
      this.$emit("sendMessage", this.message);
      this.message = "";
    }
    if (e) e.preventDefault();
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.message-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border: 1px solid $border-color;
  border-radius: 10px;
  resize: none;
  margin: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  textarea {
    height: 16px;
    border: 0;
    padding: 0 5px;
    margin: 0;

    &:focus {
      border: 0;
      box-shadow: none;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
