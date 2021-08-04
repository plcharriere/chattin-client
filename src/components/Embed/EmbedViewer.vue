<template>
  <div ref="embedViewer" class="embed-viewer">
    <Embed
      v-for="(embed, currIndex) in embeds"
      v-bind:key="embed"
      :embed="embed"
      class="embed"
      :class="{ hidden: currIndex !== index }"
    />
    <div class="navigation" v-if="embeds.length > 1">
      <ChevronLeftIcon
        class="icon-btn light"
        :class="{ disabled: index === 0 }"
        @click="previousEmbed()"
      />
      {{ index + 1 }} of {{ embeds.length }}
      <ChevronRightIcon
        class="icon-btn light"
        :class="{ disabled: index === embeds.length - 1 }"
        @click="nextEmbed()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Embed as EmbedT } from "@/dto/Embed";
import Embed from "@/components/Embed/Embed.vue";
import { defineComponent, onUnmounted, PropType, ref } from "vue";
import { ChevronLeftIcon } from "@heroicons/vue/outline";
import { ChevronRightIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: {
    Embed,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  props: {
    embeds: {
      type: Array as PropType<EmbedT[]>,
      required: true,
    },
    embedIndex: {
      type: Number,
      default: 0,
    },
    closeCallback: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const embedViewer = ref();
    const index = ref(props.embedIndex);

    const nextEmbed = () => {
      if (index.value < props.embeds.length - 1) index.value++;
    };
    const previousEmbed = () => {
      if (index.value > 0) index.value--;
    };

    let onDocumentClick = (e: MouseEvent) => {
      if (e.target && e.target === embedViewer.value) props.closeCallback();
    };
    let onDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") previousEmbed();
      else if (e.key === "ArrowRight") nextEmbed();
      else if (e.key === "Enter")
        window.open(props.embeds[index.value].source, "_blank")?.focus();
      else if (e.key === "Escape") props.closeCallback();
    };
    document.body.addEventListener("click", onDocumentClick);
    document.body.addEventListener("keydown", onDocumentKeyDown);
    onUnmounted(() => {
      document.body.removeEventListener("click", onDocumentClick);
      document.body.removeEventListener("keydown", onDocumentKeyDown);
    });

    return {
      embedViewer,
      index,
      nextEmbed,
      previousEmbed,
    };
  },
});
</script>

<style lang="scss" scoped>
.embed-viewer {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 50px;
  box-sizing: border-box;
  user-select: none;

  .close-btn {
    width: 30px;
    height: 30px;
    position: absolute;
    right: -45px;
    top: 5px;
  }

  .embed {
    margin: auto;

    &.hidden {
      display: none;
    }
  }

  .icon-btn {
    width: 40px;
    height: 40px;

    margin: 0 50px;
  }

  .navigation {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #fff;
    font-size: 16px;
    word-spacing: 10px;
  }

  img,
  iframe,
  .youtube {
    max-width: 100%;
    max-height: 100%;
  }

  img {
    overflow: hidden;
  }

  .youtube,
  .spotify-album,
  .spotify-track {
    width: 100%;
    height: 100%;
  }
  .spotify-album,
  .spotify-track {
    max-width: 600px;
    max-height: 600px;
  }
}
</style>
