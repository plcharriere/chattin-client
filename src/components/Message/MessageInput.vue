<template>
  <textarea
    v-model="message"
    :placeholder="getPlaceholder(channel)"
    v-on:keydown="keyDown"
    v-on:keydown.exact.enter="sendMessage"
  ></textarea>
</template>

<script lang="ts">
import { Channel } from "@/dto/Channel";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";

@Options({
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

  sendMessage(e: KeyboardEvent): void {
    if (this.message.length > 0) {
      this.$emit("sendMessage", this.message);
      this.message = "";
    }
    e.preventDefault();
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

textarea {
  height: 50px;
  padding: 16px 20px;
  border-radius: 10px;
  resize: none;
  margin: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:focus {
    border: 1px solid $border-color;
  }
}
</style>
