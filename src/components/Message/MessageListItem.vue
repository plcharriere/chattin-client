<template>
  <div class="message-list-item" :class="{ user: showUser }">
    <template v-if="showUser">
      <UserAvatar
        :uuid="user.avatarUuid"
        size="small"
        class="open-user-popout"
        :openPopoutUuid="user.uuid"
        @setUserPopoutUuid="setUserPopoutUuid"
      />
      <div class="container">
        <div class="infos">
          <UserName
            :user="user"
            class="open-user-popout"
            :openPopoutUuid="user.uuid"
            @setUserPopoutUuid="setUserPopoutUuid"
          />
          <div class="date">{{ getMessageDateString(message, false) }}</div>
        </div>
        <MessageListItemContent
          :message="message"
          :editing="editing"
          @saveEditing="saveEditing"
          @cancelEditing="toggleEditMode"
        />
      </div>
    </template>
    <template v-else>
      <div class="date small">{{ getMessageDateString(message, true) }}</div>
      <MessageListItemContent
        :message="message"
        :editing="editing"
        @saveEditing="saveEditing"
        @cancelEditing="toggleEditMode"
      />
    </template>
    <div class="actions" v-if="!editing">
      <PencilIcon class="icon-btn" @click="toggleEditMode()" v-if="canEdit" />
      <TrashIcon
        class="icon-btn"
        @click="deleteMessage(message.uuid)"
        v-if="canDelete"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Message } from "@/dto/Message";
import { User } from "@/dto/User";
import { defineComponent, PropType } from "@vue/runtime-core";
import { format, isToday, isYesterday } from "date-fns";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";
import { PencilIcon } from "@heroicons/vue/solid";
import { TrashIcon } from "@heroicons/vue/solid";
import { ref } from "vue";
import MessageListItemContent from "@/components/Message/MessageListItemContent.vue";

export default defineComponent({
  components: {
    UserAvatar,
    MessageListItemContent,
    UserName,
    PencilIcon,
    TrashIcon,
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
  setup(props, { emit }) {
    const editing = ref(false);

    const toggleEditMode = () => {
      editing.value = !editing.value;
    };

    const saveEditing = (content: string) => {
      emit("editMessage", props.message.uuid, content);
      toggleEditMode();
    };

    const setUserPopoutUuid = (userUuid: string, element: HTMLElement) => {
      emit("setUserPopoutUuid", userUuid, element);
    };

    const getMessageDateString = (message: Message, onlyHour: boolean) => {
      if (onlyHour) return format(message.date, "h:mm aa");
      if (isToday(message.date))
        return format(message.date, "'Today at' h:mm aa");
      if (isYesterday(message.date))
        return format(message.date, "'Yesterday at' h:mm aa");
      return format(message.date, "dd/MM/yyyy 'at' h:mm aa");
    };

    const deleteMessage = () => {
      emit("deleteMessage", props.message.uuid);
    };

    return {
      editing,
      toggleEditMode,
      saveEditing,
      setUserPopoutUuid,
      getMessageDateString,
      deleteMessage,
    };
  },
});
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

  &.user {
    padding: 6px 20px;
    margin-top: 12px;

    .user-avatar {
      align-self: flex-start;
    }

    .container {
      margin-left: 16px;
      flex-grow: 1;

      .infos {
        display: flex;
        flex-direction: row;
        margin-top: 1px;
        margin-bottom: 8px;
        align-items: center;

        .user-name {
          font-size: 15px;
        }

        .date {
          margin-left: 8px;
        }
      }
    }
  }

  .actions {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    visibility: hidden;

    .icon-btn {
      width: 16px;
      height: 16px;
      margin-left: 10px;
    }
  }
}
</style>
