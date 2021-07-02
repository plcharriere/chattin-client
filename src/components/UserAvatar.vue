<template>
  <div
    class="avatar"
    :class="[size]"
    :style="{
      backgroundImage:
        avatarPreviewUrl.length > 0 ? 'url(' + avatarPreviewUrl + ')' : '',
    }"
  >
    <div v-if="editable" class="edit" @click="editClick">
      <input
        type="file"
        id="avatarFileInput"
        @change="avatarChange"
        style="display: none"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
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
  },
})
export default class UserAvatar extends Vue {
  avatarPreviewUrl = "";

  editClick() {
    const avatarFileInput = document.getElementById("avatarFileInput");
    if (avatarFileInput) avatarFileInput.click();
  }

  avatarChange(event: any) {
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
    background: rgba(0, 0, 0, 0.5);
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
