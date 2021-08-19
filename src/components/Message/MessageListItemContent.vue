<template>
  <div class="message-list-item-content">
    <div v-if="editing" class="editing">
      <textarea
        ref="editTextarea"
        :value="message.content"
        v-on:keydown="editKeyDown"
      />
      <XIcon class="icon-btn" @click="cancelEditing()" />
      <CheckIcon class="icon-btn" @click="saveEditing()" />
    </div>
    <div v-else class="message">
      <div class="content" v-html="getMessageContentHtml()"></div>
      <span class="edited" v-if="message.edited.getTime() > 0">(edited)</span>
    </div>
    <div
      v-if="embeds.length > 0"
      class="embeds"
      :class="{ below: message.content.length > 0 || editing }"
    >
      <Embed
        v-for="(embed, index) in embeds"
        v-bind:key="embed"
        class="embed"
        :embed="embed"
        @click="openEmbedViewer(index)"
      />
    </div>
    <div
      class="files"
      :class="{
        below: embeds.length > 0 || message.content.length > 0 || editing,
      }"
      v-if="
        files.length > 0 &&
        files.length !==
          getEmbedsByType(embeds, EmbedType.IMAGE).length +
            getEmbedsByType(embeds, EmbedType.VIDEO).length +
            getEmbedsByType(embeds, EmbedType.AUDIO).length
      "
    >
      <div class="file" v-for="file in files" v-bind:key="file" target="_blank">
        <a
          class="dl-icon"
          :href="`${httpUrl}/files/${file.uuid}/${file.name}/download`"
          target="_blank"
          ><DocumentDownloadIcon class="icon-btn"
        /></a>
        <div class="infos">
          <a
            :href="`${httpUrl}/files/${file.uuid}/${file.name}`"
            target="_blank"
            >{{ file.name }}</a
          >
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
import { Embed as EmbedT, EmbedType } from "@/dto/Embed";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CheckIcon } from "@heroicons/vue/solid";
import { XIcon } from "@heroicons/vue/solid";
import { DocumentDownloadIcon } from "@heroicons/vue/outline";
import { computed, ref, watch } from "vue";
import { httpUrl } from "@/env";
import { useStore } from "vuex";
import { getFileInformations } from "@/api/http";
import { bytesToReadable, getEmbedsByType } from "@/utils";
import Embed from "@/components/Embed/Embed.vue";

export default defineComponent({
  components: {
    CheckIcon,
    XIcon,
    DocumentDownloadIcon,
    Embed,
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
    const files = ref([] as File[]);
    const store = useStore();

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

    props.message.files.forEach((fileUuid) => {
      getFileInformations(store.state.token, fileUuid).then((file) => {
        files.value.push(file);
      });
    });

    const embeds = computed(() => {
      const embeds: EmbedT[] = [];

      const youtubeLinks = props.message.content.matchAll(
        /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9-_]+)/g
      );
      for (const youtubeLink of youtubeLinks) {
        embeds.push({
          type: EmbedType.YOUTUBE,
          source: youtubeLink[1],
        } as EmbedT);
      }

      const spotifyLinks = props.message.content.matchAll(
        /https?:\/\/open\.spotify\.com\/((?:album|track)\/[a-zA-Z0-9-_]+)/g
      );
      for (const spotifyLink of spotifyLinks) {
        embeds.push({
          type: EmbedType.SPOTIFY,
          source: spotifyLink[1],
        } as EmbedT);
      }

      files.value.forEach((file) => {
        if (
          [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/bmp",
            "image/x-icon",
            "image/vnd.microsoft.icon",
            "image/svg+xml",
            "image/avif",
          ].includes(file.type)
        ) {
          embeds.push({
            type: EmbedType.IMAGE,
            source: `${httpUrl}/files/${file.uuid}/${file.name}`,
          } as EmbedT);
        } else if (
          [
            "video/3gpp",
            "video/mp4",
            "video/mpeg",
            "video/ogg",
            "video/quicktime",
            "video/webm",
            "video/x-m4v",
            "video/ms-asf",
            "video/x-ms-wmv",
            "video/x-msvideo",
          ].includes(file.type)
        ) {
          embeds.push({
            type: EmbedType.VIDEO,
            source: `${httpUrl}/files/${file.uuid}/${file.name}`,
          } as EmbedT);
        } else if (
          [
            "audio/basic",
            "audio/flac",
            "audio/mid",
            "audio/mpeg",
            "audio/mp4",
            "audio/x-aiff",
            "audio/mpegurl",
            "audio/x-mpegurl",
            "audio/vnd.rn-realaudio",
            "audio/ogg",
            "audio/vorbis",
            "audio/wav",
            "audio/vnd.wav",
            "audio/aac",
          ].includes(file.type)
        ) {
          embeds.push({
            type: EmbedType.AUDIO,
            source: `${httpUrl}/files/${file.uuid}/${file.name}`,
          } as EmbedT);
        }
      });
      return embeds;
    });

    watch(editTextarea, () => {
      if (editTextarea.value) editTextarea.value.focus();
    });

    const editKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        saveEditing();
        e.preventDefault();
      }
      if (e.key === "Escape") {
        cancelEditing();
        e.preventDefault();
      }
    };

    const saveEditing = () => {
      if (editTextarea.value.value !== props.message.content)
        emit("saveEditing", editTextarea.value.value);
      else cancelEditing();
    };

    const cancelEditing = () => {
      emit("cancelEditing");
    };

    const openEmbedViewer = (embedIndex: number) => {
      console.log("messagelistitemcontent");
      emit("openEmbedViewer", embeds.value, embedIndex);
    };

    return {
      httpUrl,
      editTextarea,
      getMessageContentHtml,
      files,
      embeds,
      editKeyDown,
      saveEditing,
      cancelEditing,
      bytesToReadable,
      EmbedType,
      openEmbedViewer,
      getEmbedsByType,
    };
  },
});
</script>

<style scoped lang="scss">
.message-list-item-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .embeds {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 8px;

    &.below {
      margin-top: 10px;
    }

    img {
      cursor: pointer;
    }
  }

  .files {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;

    &.below {
      margin-top: 10px;
    }

    .file {
      background: var(--file-background);
      color: var(--default-color);
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;

      &:hover {
        background: var(--file-hover-background);
      }

      .infos {
        margin: 0 10px;
        display: flex;
        flex-direction: column;

        a {
          color: var(--default-color);
        }

        .secondary {
          display: flex;
          flex-direction: row;
          color: var(--light-color);
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
      color: var(--lighter-color);
      margin-left: 8px;
      align-self: flex-end;
    }
  }

  .editing {
    background: var(--background-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid var(--border-color);
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
