<template>
  <div class="modal-container">
    <div class="modal" ref="modal">
      <slot></slot>
      <XIcon class="close" @click="closeCallback" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { XIcon } from "@heroicons/vue/outline";
import { onUnmounted, ref } from "vue";

export default defineComponent({
  components: {
    XIcon,
  },
  props: {
    closeCallback: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const modal = ref();

    let clickedOutside = (e: MouseEvent) => {
      if (
        modal.value &&
        !(modal.value === e.target || modal.value.contains(e.target))
      ) {
        if (
          !(e.target as HTMLElement).closest(".open-modal") &&
          !(e.target as HTMLElement).closest(".modal") &&
          !(e.target as HTMLElement).closest(".user") // prevent closing modal when clicking avatar in user profile settings, need to find a fix for this
        ) {
          props.closeCallback();
        }
      }
    };
    document.body.addEventListener("click", clickedOutside);
    onUnmounted(() => {
      document.body.removeEventListener("click", clickedOutside);
    });

    return {
      modal,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.modal-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;

  .modal {
    position: relative;
    background: $background-color;
    width: 800px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    padding: 30px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 2;

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      color: $icon-button-color;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background-size: contain;

      &:hover {
        color: $icon-button-hover-color;
      }
    }
  }
}
</style>
