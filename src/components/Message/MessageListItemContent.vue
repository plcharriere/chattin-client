<template>
  <div v-if="!editing" class="message-content">
    {{ message.content
    }}<span class="edited" v-if="message.edited.getTime() > 0">(edited)</span>
  </div>
  <div v-else class="message-edit">
    <textarea ref="editTextarea" :value="message.content" />
    <XIcon class="icon-btn" @click="cancelEditing()" />
    <CheckIcon class="icon-btn" @click="saveEditing()" />
  </div>
</template>

<script lang="ts">
import { Message } from "@/dto/Message";
import { defineComponent, PropType } from "@vue/runtime-core";
import { CheckIcon } from "@heroicons/vue/solid";
import { XIcon } from "@heroicons/vue/solid";
import { ref } from "vue";

export default defineComponent({
  components: {
    CheckIcon,
    XIcon,
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

    return {
      editTextarea,
      cancelEditing,
      saveEditing,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.message-content {
  .edited {
    font-size: 12px;
    color: $lighter-color;
    margin-left: 8px;
  }
}

.message-edit {
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
</style>
