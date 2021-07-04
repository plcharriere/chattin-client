<template>
  <div
    class="avatar"
    :class="[size]"
    :style="{
      backgroundImage:
        avatarPreviewUrl.length > 0 ? 'url(' + avatarPreviewUrl + ')' : '',
    }"
  >
    <div v-if="editable" class="edit" @click="editCallback">
      <input
        type="file"
        id="avatarFileInput"
        @change="avatarChange"
        style="display: none"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    size: {
      type: String,
      default: "medium",
    },
    editable: {
      type: Boolean,
      default: false,
    },
    editCallback: {
      type: Function,
    },
  },
})
export default class UserAvatar extends Vue {
  avatarPreviewUrl = "";

  editClick(): void {
    const avatarFileInput = document.getElementById("avatarFileInput");
    if (avatarFileInput) avatarFileInput.click();
  }

  avatarChange(event: Event): void {
    if (
      event.target &&
      event.target instanceof HTMLInputElement &&
      event.target.files
    )
      this.avatarPreviewUrl = URL.createObjectURL(event.target.files[0]);
  }
}
</script>

<style scoped lang="scss">
.avatar {
  position: relative;
  border-radius: 100%;
  background: #ddd;
  overflow: hidden;
  background-size: cover;
  background-position: center;

  &.small {
    width: 32px;
    height: 32px;
  }
  &.medium {
    width: 42px;
    height: 42px;
  }
  &.large {
    width: 100px;
    height: 100px;
  }

  .edit {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: url(~@/assets/svg/pencil.svg) no-repeat center
      rgba(0, 0, 0, 0.5);
    background-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;

    svg {
      color: #ddd;
      width: 32px;
      height: 32px;
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
