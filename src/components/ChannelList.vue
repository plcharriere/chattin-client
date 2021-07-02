<template>
  <div class="channels">
    <div
      v-for="channel in channels"
      v-bind:key="channel.uuid"
      class="channel"
      :class="{ active: currentChannelUuid == channel.uuid }"
      @click="setCurrentChannelUuid(channel.uuid)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="tag"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        />
      </svg>
      {{ channel.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PropType } from "@vue/runtime-core";
import { Channel } from "@/dto/Channel";

@Options({
  props: {
    channels: {
      type: Array as PropType<Channel[]>,
      required: true,
    },
    currentChannelUuid: {
      type: String,
      required: true,
    },
  },
})
export default class ChannelList extends Vue {
  setCurrentChannelUuid(uuid: string): void {
    this.$emit("setCurrentChannelUuid", uuid);
  }
}
</script>

<style scoped lang="scss">
.channels {
  min-width: 200px;
  padding: 20px;
  border-right: 1px solid #ddd;

  .channel {
    font-size: 14px;
    padding: 8px 12px;
    margin-bottom: 6px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    .tag {
      color: #333;
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }

    &.active,
    &:hover {
      background: #eee;
      border-radius: 5px;
    }
  }
}
</style>
