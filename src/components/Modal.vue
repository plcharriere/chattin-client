<template>
  <div ref="modalContainer" class="modal-container">
    <div class="modal">
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
    const modalContainer = ref();

    let onDocumentClick = (e: MouseEvent) => {
      if (e.target === modalContainer.value) props.closeCallback();
    };
    document.body.addEventListener("click", onDocumentClick);
    onUnmounted(() => {
      document.body.removeEventListener("click", onDocumentClick);
    });

    return {
      modalContainer,
    };
  },
});
</script>

<style scoped lang="scss">
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
    background: var(--background-color);
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
      color: var(--icon-button-color);
      width: 24px;
      height: 24px;
      cursor: pointer;
      background-size: contain;

      &:hover {
        color: var(--icon-button-hover-color);
      }
    }
  }
}
</style>
