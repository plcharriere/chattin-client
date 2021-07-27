<template>
  <div class="message-list-item-content">
    <div v-if="editing" class="editing">
      <textarea ref="editTextarea" :value="message.content" />
      <XIcon class="icon-btn" @click="cancelEditing()" />
      <CheckIcon class="icon-btn" @click="saveEditing()" />
    </div>
    <div v-else class="message">
      <div class="content" v-html="getMessageContentHtml()"></div>
      <span class="edited" v-if="message.edited.getTime() > 0">(edited)</span>
    </div>
    <div class="files" v-if="files.length > 0">
      <div
        class="file"
        v-for="file in files"
        v-bind:key="file"
        :href="httpUrl + `/files/${file.uuid}`"
        target="_blank"
      >
        <a
          class="dl-icon"
          :href="`${httpUrl}/files/${file.uuid}`"
          target="_blank"
          ><DocumentDownloadIcon class="icon-btn"
        /></a>
        <div class="infos">
          <a :href="`${httpUrl}/files/${file.uuid}`" target="_blank">{{
            file.name
          }}</a>
          <div class="secondary">
            <span>{{ file.type }}</span>
            <span>&nbsp;&nbsp;</span>
            <span>{{ bytesToReadable(file.size) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { File } from "@/dto/File";
import { Message } from "@/dto/Message";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CheckIcon } from "@heroicons/vue/solid";
import { XIcon } from "@heroicons/vue/solid";
import { DocumentDownloadIcon } from "@heroicons/vue/outline";
import { ref } from "vue";
import { httpUrl } from "@/env";
import axios from "axios";

export default defineComponent({
  components: {
    CheckIcon,
    XIcon,
    DocumentDownloadIcon,
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

    const files = ref([] as File[]);

    props.message.files.forEach((fileUuid) => {
      axios.get(`${httpUrl}/files/${fileUuid}/infos`).then((resp) => {
        if (
          resp.status === 200 &&
          resp.data &&
          resp.data.name &&
          resp.data.type &&
          resp.data.size
        )
          files.value.push({
            uuid: fileUuid,
            name: resp.data.name,
            type: resp.data.type,
            size: resp.data.size,
          } as File);
      });
    });

    const bytesToReadable = (bytes: number, decimals = 2) => {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    return {
      editTextarea,
      cancelEditing,
      saveEditing,
      getMessageContentHtml,
      httpUrl,
      files,
      bytesToReadable,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.message-list-item-content {
  display: flex;
  flex-direction: column;

  .files {
    margin: 10px 0 5px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .file {
      background: $background-color;
      color: $default-color;
      padding: 10px;
      margin-right: 10px;
      border: 1px solid $border-color;
      border-radius: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .infos {
        margin: 0 10px;
        display: flex;
        flex-direction: column;

        a {
          color: $default-color;
        }

        .secondary {
          display: flex;
          flex-direction: row;
          color: $light-color;
          font-size: 12px;
          justify-content: space-between;
        }
      }

      .dl-icon {
        width: 24px;
        height: 24px;
      }
    }
  }

  .message {
    display: flex;
    flex-direction: row;

    .edited {
      font-size: 12px;
      color: $lighter-color;
      margin-left: 8px;
      align-self: flex-end;
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
</style>
