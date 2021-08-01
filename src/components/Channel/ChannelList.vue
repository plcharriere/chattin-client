<template>
  <div class="channel-list">
    <div
      v-for="channel in channels"
      v-bind:key="channel.uuid"
      class="channel"
      :class="{ active: channelUuid == channel.uuid, unread: channel.unread }"
      @click="setChannelUuid(channel.uuid)"
    >
      <HashtagIcon class="hashtag" />
      {{ channel.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Channel } from "@/dto/Channel";
import { HashtagIcon } from "@heroicons/vue/outline";

export default defineComponent({
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
  setup(props, { emit }) {
    const setChannelUuid = (uuid: string) => {
      emit("setChannelUuid", uuid);
    };
    return {
      setChannelUuid,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.channel-list {
  min-width: 200px;
  padding: 20px;
  user-select: none;

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
      background: $hover-color;
      border-radius: 5px;
    }

    &.unread {
      font-weight: 600;
    }
  }
}
</style>
