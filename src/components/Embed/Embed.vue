<template>
  <img v-if="embed.type === EmbedType.IMAGE" :src="embed.source" />
  <video v-else-if="embed.type === EmbedType.VIDEO" controls>
    <source :src="embed.source" />
  </video>
  <audio v-else-if="embed.type === EmbedType.AUDIO" controls>
    <source :src="embed.source" />
  </audio>
  <iframe
    v-else-if="embed.type === EmbedType.YOUTUBE"
    class="youtube"
    :src="`https://www.youtube.com/embed/${embed.source}`"
    frameborder="0"
    allow="encrypted-media"
    allowfullscreen
  ></iframe>
  <iframe
    v-else-if="embed.type === EmbedType.SPOTIFY"
    :class="{
      'spotify-track': embed.source.slice(0, 6) === 'track/',
      'spotify-album': embed.source.slice(0, 6) === 'album/',
    }"
    :src="`https://open.spotify.com/embed/${embed.source}`"
    frameborder="0"
    allowtransparency="true"
    allow="encrypted-media"
  ></iframe>
</template>

<script lang="ts">
import { Embed, EmbedType } from "@/dto/Embed";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    embed: {
      type: Object as PropType<Embed>,
      required: true,
    },
  },
  setup() {
    return {
      EmbedType,
    };
  },
});
</script>

<style lang="scss" scoped>
img,
video,
audio,
iframe {
  max-width: 400px;
  max-height: 300px;
  outline: 0;
  border-radius: 3px;
}

.youtube,
.spotify-album {
  width: 400px;
  height: 225px;
}

.spotify-track {
  width: 400px;
  height: 80px;
}
</style>
