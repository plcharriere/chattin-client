<template>
  <div class="message-input">
    <textarea
      class="input"
      v-model="message"
      :placeholder="getPlaceholder()"
      v-on:keydown="keyDown"
      v-on:keydown.exact.enter="sendMessage"
    ></textarea>
    <PaperAirplaneIcon class="icon-btn" @click="sendMessage()" />
  </div>
</template>

<script lang="ts">
import { Channel } from "@/dto/Channel";
import { defineComponent, PropType } from "@vue/runtime-core";
import { PaperAirplaneIcon } from "@heroicons/vue/solid";
import { ref } from "vue";

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
    const message = ref("");

    const getPlaceholder = () => {
      return "Message in #" + props.channel.name;
    };

    const keyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") emit("keyDown");
    };

    const sendMessage = (e: KeyboardEvent | null = null) => {
      if (message.value.length > 0) {
        emit("sendMessage", message.value);
        message.value = "";
      }
      if (e) e.preventDefault();
    };

    return {
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
