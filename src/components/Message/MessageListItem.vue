<template>
  <div class="message-list-item" :class="{ user: showUser }">
    <template v-if="showUser">
      <UserAvatar
        :uuid="user.avatarUuid"
        size="small"
        :openPopoutUuid="user.uuid"
        @setUserPopoutUuid="setUserPopoutUuid"
      />
      <div class="container">
        <div class="infos">
          <UserName
            :user="user"
            @click="setUserPopoutUuid(user.uuid)"
            :openPopoutUuid="user.uuid"
            @setUserPopoutUuid="setUserPopoutUuid"
          />
          <div class="date">{{ getMessageDateString(message, false) }}</div>
        </div>
        <div v-if="!editMode" class="content">
          {{ message.content
          }}<span class="edited" v-if="message.edited.getTime() > 0"
            >(edited)</span
          >
        </div>
        <div v-else class="edit">
          <textarea ref="edit" :value="message.content" />
          <XIcon @click="toggleEditMode()" />
          <CheckIcon @click="saveEdit(message.uuid)" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="date small">{{ getMessageDateString(message, true) }}</div>
      <div v-if="!editMode" class="content">
        {{ message.content
        }}<span class="edited" v-if="message.edited.getTime() > 0"
          >(edited)</span
        >
      </div>
      <div v-else class="edit">
        <textarea ref="edit" :value="message.content" />
        <XIcon @click="toggleEditMode()" />
        <CheckIcon @click="saveEdit(message.uuid)" />
      </div>
    </template>
    <div class="actions">
      <PencilIcon @click="toggleEditMode()" v-if="canEdit" />
      <TrashIcon @click="deleteMessage(message.uuid)" v-if="canDelete" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { PropType } from "@vue/runtime-core";
import { format, isToday, isYesterday } from "date-fns";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";
import { PencilIcon } from "@heroicons/vue/solid";
import { TrashIcon } from "@heroicons/vue/solid";
import { CheckIcon } from "@heroicons/vue/solid";
import { XIcon } from "@heroicons/vue/solid";
import { ref } from "vue";

@Options({
  components: {
    UserAvatar,
    UserName,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XIcon,
  },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    showUser: {
      type: Boolean,
      default: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
  },
})
export default class MessageList extends Vue {
  edit = ref();

  editMode = false;

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveEdit(uuid: string): void {
    this.$emit("editMessage", uuid, this.edit.value);
    this.toggleEditMode();
  }

  setUserPopoutUuid(userUuid: string, element: HTMLElement): void {
    this.$emit("setUserPopoutUuid", userUuid, element);
  }

  getMessageDateString(message: Message, onlyHour: boolean): string {
    if (onlyHour) return format(message.date, "h:mm aa");
    if (isToday(message.date))
      return format(message.date, "'Today at' h:mm aa");
    if (isYesterday(message.date))
      return format(message.date, "'Yesterday at' h:mm aa");
    return format(message.date, "dd/MM/yyyy 'at' h:mm aa");
  }

  editMessage(): void {
    //
  }

  deleteMessage(uuid: string): void {
    this.$emit("deleteMessage", uuid);
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.message-list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 20px 6px 0;

  &:hover {
    background: $hover-color;

    .date {
      &.small {
        visibility: visible;
      }
    }
    .actions {
      visibility: visible;
    }
  }

  .date {
    font-size: 12px;
    color: $lighter-color;

    &.small {
      visibility: hidden;
      text-align: center;
      width: 78px;
    }
  }

  .edited {
    font-size: 13px;
    color: $light-color;
    margin-left: 8px;
  }

  &.user {
    padding: 6px 20px;
    margin-top: 12px;

    .container {
      margin-left: 16px;
      flex-grow: 1;

      .infos {
        display: flex;
        flex-direction: row;
        margin-top: 1px;
        margin-bottom: 8px;
        align-items: center;

        .name {
          font-size: 15px;
        }

        .date {
          margin-left: 16px;
        }
      }
    }
  }

  .actions {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    visibility: hidden;

    svg {
      color: $icon-button-color;
      width: 16px;
      height: 16px;
      cursor: pointer;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      margin-left: 15px;

      &:hover {
        color: $icon-button-hover-color;
      }
    }
  }

  .edit {
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

    svg {
      color: $icon-button-color;
      cursor: pointer;
      width: 24px;
      height: 24px;
      margin-left: 10px;

      &:hover {
        color: $icon-button-hover-color;
      }
    }
  }
}
</style>
