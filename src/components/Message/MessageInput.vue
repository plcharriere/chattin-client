<template>
  <div class="message-input">
    <textarea
      ref="textarea"
      class="input"
      v-model="message"
      :placeholder="getPlaceholder()"
      v-on:keydown="keyDown"
    ></textarea>
    <PaperAirplaneIcon class="icon-btn" @click="sendMessage()" />
  </div>
</template>

<script lang="ts">
import { Channel } from "@/dto/Channel";
import { defineComponent, PropType } from "@vue/runtime-core";
import { PaperAirplaneIcon } from "@heroicons/vue/solid";
import { ref, watch } from "vue";

export default defineComponent({
  components: {
    PaperAirplaneIcon,
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const textarea = ref();
    const message = ref("");
    const textareaHeight = 16;

    const getPlaceholder = () => {
      return "Message in #" + props.channel.name;
    };

    const sendMessage = () => {
      if (message.value.length > 0) {
        emit("sendMessage", message.value);
        message.value = "";
      }
    };

    watch(message, () => {
      emit("typed");
      const textareaElement = textarea.value as HTMLTextAreaElement;
      let newline = 0;
      for (let i = 0; i < message.value.length; i++) {
        if (message.value[i] === "\n") newline++;
      }
      textareaElement.style.height = textareaHeight * (newline + 1) + "px";
    });

    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        sendMessage();
        e.preventDefault();
      }
    };

    return {
      textarea,
      message,
      getPlaceholder,
      keyDown,
      sendMessage,
    };
  },
});
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

  .input {
    height: 16px;
    max-height: 200px;
    border: 0;
    margin: 0;
    padding: 0 5px;

    &:focus {
      border: 0;
      box-shadow: none;
    }
  }

  svg {
    padding-left: 15px;
    width: 20px;
    height: 20px;
  }
}
</style>
