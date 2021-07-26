<template>
  <div class="message-input">
    <transition name="slide-up">
      <div v-if="files.length > 0" class="files-container">
        <div class="files">
          <div
            v-for="(file, index) in files"
            v-bind:key="file.name"
            class="file"
          >
            <DocumentIcon /> <span>{{ file.name }}</span>
            <XIcon class="icon-btn" @click="removeFile(index)" />
          </div>
        </div>
        <div v-if="uploading" class="uploading">Uploading...</div>
      </div>
    </transition>
    <div class="input">
      <input ref="fileInput" type="file" multiple @change="fileInputChange" />
      <PlusIcon class="icon-btn file-icon" @click="fileInput.click()" />
      <textarea
        ref="textarea"
        class="area"
        v-model="message"
        :placeholder="getPlaceholder()"
        v-on:keydown="keyDown"
        :disabled="!canWrite"
      ></textarea>
      <PaperAirplaneIcon class="icon-btn send-icon" @click="sendMessage()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Channel } from "@/dto/Channel";
import { defineComponent, PropType } from "@vue/runtime-core";
import { PlusIcon } from "@heroicons/vue/solid";
import { PaperAirplaneIcon } from "@heroicons/vue/solid";
import { DocumentIcon } from "@heroicons/vue/outline";
import { XIcon } from "@heroicons/vue/outline";
import { ref, watch } from "vue";
import axios from "axios";
import { httpUrl } from "@/env";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    PlusIcon,
    DocumentIcon,
    PaperAirplaneIcon,
    XIcon,
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
    canWrite: {
      type: Boolean,
      default: true,
    },
    canAttachFile: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const textarea = ref();
    const fileInput = ref();
    const message = ref("");
    const textareaHeight = 16;
    const files = ref([] as File[]);
    const uploading = ref(false);
    const store = useStore();

    const getPlaceholder = () => {
      return props.canWrite
        ? "Message in #" + props.channel.name
        : "You do not have permission to send message in this channel.";
    };

    const sendMessage = async () => {
      if (message.value.length > 0 || files.value.length > 0) {
        const fileUuids: string[] = [];
        if (files.value.length > 0) {
          uploading.value = true;
          for (const file of files.value) {
            const formData = new FormData();
            formData.append("file", file);
            const resp = await axios.post(httpUrl + "/files", formData, {
              headers: {
                token: store.state.token,
              },
            });
            fileUuids.push(resp.data);
          }
          uploading.value = false;
          files.value = [];
        }
        emit("sendMessage", message.value, fileUuids);
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

    const fileInputChange = (e: Event) => {
      if (e.target && e.target instanceof HTMLInputElement && e.target.files) {
        for (let i = 0; i < e.target.files.length; i++) {
          files.value.push(e.target.files[i]);
        }
      }
    };

    const removeFile = (index: number) => {
      files.value.splice(index, 1);
    };

    return {
      textarea,
      fileInput,
      message,
      getPlaceholder,
      keyDown,
      sendMessage,
      fileInputChange,
      files,
      removeFile,
      uploading,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.message-input {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  .files-container {
    display: flex;
    flex-direction: column;
    border: 1px solid $border-color;
    padding: 10px;
    border-radius: 10px 10px 0 0;
    position: relative;
    top: 10px;
    margin-top: -10px;

    .files {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .file {
        display: flex;
        flex-direction: row;
        padding: 10px;
        border: 1px solid $border-color;
        align-items: center;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 10px;

        svg {
          width: 20px;
          height: 20px;
        }

        span {
          margin: 0 10px;
        }
      }
    }

    .uploading {
      margin: 0 0 10px 5px;
    }
  }

  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px;
    border: 1px solid $border-color;
    border-radius: 10px;
    resize: none;
    margin: 0;
    position: relative;
    background: $background-color;
    z-index: 2;

    input[type="file"] {
      display: none;
    }

    .area {
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
      width: 20px;
      height: 20px;

      &.file-icon {
        padding-right: 10px;
      }
      &.send-icon {
        padding-left: 15px;
      }
    }
  }
}
</style>
