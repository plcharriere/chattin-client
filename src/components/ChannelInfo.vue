<template>
  <div class="channel">
    <div class="name"># {{ channel.name }}</div>
    <template v-if="channel.description.length > 0">
      <div class="separator"></div>
      <div class="description">
        {{ channel.description }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Channel } from "@/dto/Channel";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
})
export default class ChannelInfo extends Vue {}
</script>

<style scoped lang="scss">
.channel {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;

  .name {
    font-size: 18px;
    font-weight: 600;
  }
  .separator {
    border-left: 1px solid #ddd;
    width: 1px;
    height: 100%;
    margin: 0 20px;
  }
  .description {
  }
}
</style>
