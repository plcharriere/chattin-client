<template>
  <div class="message-list-item-content">
    <div v-if="editing" class="editing">
      <textarea ref="editTextarea" :value="message.content" />
      <XIcon class="icon-btn" @click="cancelEditing()" />
      <CheckIcon class="icon-btn" @click="saveEditing()" />
    </div>
    <div v-else class="message-container">
      <div class="message">
        <div class="content" v-html="getMessageContentHtml()"></div>
        <span class="edited" v-if="message.edited.getTime() > 0">(edited)</span>
      </div>
      <div class="files" v-if="message.files.length > 0">
        <a
          class="file"
          v-for="file in message.files"
          v-bind:key="file"
          :href="httpUrl + `/files/${file}`"
          target="_blank"
        >
          <DocumentIcon /> <span>{{ file }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Message } from "@/dto/Message";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CheckIcon } from "@heroicons/vue/solid";
import { XIcon } from "@heroicons/vue/solid";
import { DocumentIcon } from "@heroicons/vue/outline";
import { ref } from "vue";
import { httpUrl } from "@/env";

export default defineComponent({
  components: {
    CheckIcon,
    XIcon,
    DocumentIcon,
  },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    editing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const editTextarea = ref();

    const cancelEditing = () => {
      emit("cancelEditing");
    };

    const saveEditing = () => {
      emit("saveEditing", editTextarea.value.value);
    };

    const getMessageContentHtml = () => {
      let contentHtml = props.message.content;
      contentHtml = contentHtml
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
      const replaces = [
        {
          regexp: /\n/gm,
          with: "<br>",
        },
        {
          regexp: /((http(s)?:\/\/)\S+)/gim,
          with: '<a href="$1" target="_blank">$1</a>',
        },
        {
          regexp: /\*\*([^*]*)\*\*/gim,
          with: "<b>$1</b>",
        },
        {
          regexp: /__([^_]*)__/gim,
          with: "<u>$1</u>",
        },
        {
          regexp: /\*([^*]*)\*/gim,
          with: "<i>$1</i>",
        },
        {
          regexp: /_([^_]*)_/gim,
          with: "<i>$1</i>",
        },
        {
          regexp: /~~([^~]*)~~/gim,
          with: "<s>$1</s>",
        },
      ];
      replaces.forEach((replace) => {
        contentHtml = contentHtml.replace(replace.regexp, replace.with);
      });
      return contentHtml;
    };

    return {
      editTextarea,
      cancelEditing,
      saveEditing,
      getMessageContentHtml,
      httpUrl,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.message-list-item-content {
  .message-container {
    display: flex;
    flex-direction: column;

    .files {
      margin: 10px 0 5px 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .file {
        color: $default-color;
        padding: 10px;
        margin-right: 10px;
        border: 1px solid $border-color;
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }

        svg {
          width: 20px;
          height: 20px;
        }

        span {
          margin: 0 10px;
        }
      }
    }

    .message {
      .edited {
        font-size: 12px;
        color: $lighter-color;
        margin-left: 8px;
      }
    }

    .editing {
      background: $background-color;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px 10px;
      border: 1px solid $border-color;
      border-radius: 10px;
      resize: none;
      margin: 0;
      flex-grow: 1;

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

      .icon-btn {
        width: 24px;
        height: 24px;
        margin-left: 10px;
      }
    }
  }
}
</style>
