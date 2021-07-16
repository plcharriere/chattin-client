<template>
  <div class="channels">
    <div
      v-for="channel in channels"
      v-bind:key="channel.uuid"
      class="channel"
      :class="{ active: channelUuid == channel.uuid }"
      @click="setChannelUuid(channel.uuid)"
    >
      <HashtagIcon class="hashtag" />
      {{ channel.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PropType } from "@vue/runtime-core";
import { Channel } from "@/dto/Channel";
import { HashtagIcon } from "@heroicons/vue/outline";

@Options({
  components: {
    HashtagIcon,
  },
  props: {
    channels: {
      type: Array as PropType<Channel[]>,
      required: true,
    },
    channelUuid: {
      type: String,
      required: true,
    },
  },
})
export default class ChannelList extends Vue {
  setChannelUuid(uuid: string): void {
    this.$emit("setChannelUuid", uuid);
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.channels {
  min-width: 200px;
  padding: 20px;
  border-right: 1px solid $border-color;

  .channel {
    font-size: 14px;
    padding: 8px 12px;
    margin-bottom: 6px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    .hashtag {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }

    &.active,
    &:hover {
      background: #eee;
      border-radius: 5px;
    }
  }
}
</style>
