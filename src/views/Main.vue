<template>
  <transition name="fade">
    <Loading v-if="loading" :reconnecting="reconnecting" />
    <div v-else class="main">
      <transition name="zoom">
        <UserPopout
          v-if="userPopoutUuid.length > 0 && userPopoutElement"
          :element="userPopoutElement"
          :user="getUserByUuid(users, userPopoutUuid)"
          @closeUserPopout="setUserPopoutUuid('')"
        />
      </transition>
      <UserSettings
        v-if="showUserSettings"
        :user="getUserByUuid(users, userUuid)"
        :closeCallback="toggleUserSettings"
      />
      <transition name="fade">
        <EmbedViewer
          v-if="viewEmbeds.length > 0"
          :embeds="viewEmbeds"
          :embedIndex="viewEmbedIndex"
          :closeCallback="closeEmbedViewer"
        />
      </transition>
      <div class="infos">
        <div class="server">
          <span class="name">{{ serverName }}</span
          ><span v-if="serverDescription.length > 0" class="description">{{
            serverDescription
          }}</span>
        </div>
        <ChannelInfo :channel="getChannelByUuid(channels, channelUuid)" />
        <UserInfo
          :user="getUserByUuid(users, userUuid)"
          @openUserSettings="toggleUserSettings"
          @logout="logout"
        />
      </div>
      <div class="content">
        <ChannelList
          :channels="channels"
          :channelUuid="channelUuid"
          @setChannelUuid="setChannelUuid"
        />
        <div class="channel">
          <MessageList
            :channel="getChannelByUuid(channels, channelUuid)"
            :messages="getMessagesByChannelUuid(messages, channelUuid)"
            :reachedTop="
              getChannelByUuid(channels, channelUuid).loadedAllMessages
            "
            :user="getUserByUuid(users, userUuid)"
            :users="users"
            :editingMessageUuid="editingMessageUuid"
            @scrolledTop="fetchChannelMessages"
            @setUserPopoutUuid="setUserPopoutUuid"
            @editMessage="editMessage"
            @deleteMessage="deleteMessage"
            @setEditingMessageUuid="setEditingMessageUuid"
            @openEmbedViewer="openEmbedViewer"
          />
          <div class="message">
            <MessageInput
              :channel="getChannelByUuid(channels, channelUuid)"
              @typed="messageTyping"
              @sendMessage="sendMessage"
              @editLastMessage="editLastMessage"
            />
            <TypingUsers :users="getTypingUsers()" />
          </div>
        </div>
        <UserList :users="users" @setUserPopoutUuid="setUserPopoutUuid" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { Channel } from "@/dto/Channel";
import { Message } from "@/dto/Message";
import { TypingUser } from "@/dto/TypingUser";
import {
  Packet,
  PacketAuth,
  PacketReceiveEditMessage,
  PacketSendEditMessage,
  PacketType,
} from "@/dto/Packet";
import Loading from "@/components/Loading.vue";
import ChannelInfo from "@/components/Channel/ChannelInfo.vue";
import UserInfo from "@/components/User/UserInfo.vue";
import ChannelList from "@/components/Channel/ChannelList.vue";
import MessageList from "@/components/Message/MessageList.vue";
import UserList from "@/components/User/UserList.vue";
import UserSettings from "@/components/User/UserSettings/UserSettings.vue";
import MessageInput from "@/components/Message/MessageInput.vue";
import UserPopout from "@/components/User/UserPopout.vue";
import TypingUsers from "@/components/TypingUsers.vue";
import EmbedViewer from "@/components/Embed/EmbedViewer.vue";
import { webSocketUrl } from "@/env";
import { getChannelMessages, getChannels, getUsers } from "@/api/http";
import { sendPacket, sendPacketMessage } from "@/api/ws";
import {
  getUserByUuid,
  getChannelByUuid,
  getMessagesByChannelUuid,
  getUserName,
} from "@/utils";
import { useStore } from "vuex";
import { defineComponent, watch } from "@vue/runtime-core";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Embed } from "@/dto/Embed";

export default defineComponent({
  components: {
    Loading,
    ChannelList,
    UserSettings,
    ChannelInfo,
    UserInfo,
    MessageList,
    MessageInput,
    UserList,
    UserPopout,
    TypingUsers,
    EmbedViewer,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    if (store.state.token == "") {
      router.push("/login");
    }

    const loading = ref(true);

    const ws = ref(null as WebSocket | null);
    const reconnecting = ref(false);

    const userUuid = ref("");
    const channelUuid = ref("");

    const users = ref([] as User[]);
    const channels = ref([] as Channel[]);
    const messages = ref([] as Message[]);

    const userPopoutUuid = ref("");
    const userPopoutElement = ref(null as HTMLElement | null);

    const showUserSettings = ref(false);

    const typingUsers = ref([] as TypingUser[]);
    const cleanTypingUsersTimeout = ref(0);

    document.title = `${store.state.configuration.name}`;

    const serverName = store.state.configuration.name;

    const serverDescription = store.state.configuration.description;

    const unreadMessageCount = ref(0);

    const viewEmbeds = ref([] as Embed[]);
    const viewEmbedIndex = ref(0);

    const openEmbedViewer = (embeds: Embed[], embedIndex: number) => {
      viewEmbeds.value = embeds;
      viewEmbedIndex.value = embedIndex;
    };

    const closeEmbedViewer = () => {
      viewEmbeds.value = [];
    };

    watch(channelUuid, () => {
      const channel = getChannelByUuid(channels.value, channelUuid.value);
      if (channel) {
        document.title = `#${channel.name} ~ ${store.state.configuration.name}`;
      }
    });

    watch(
      users,
      () => {
        users.value = users.value.sort((user1: User, user2: User) => {
          return getUserName(user1).localeCompare(getUserName(user2));
        });
      },
      {
        deep: true,
      }
    );

    watch(
      messages,
      () => {
        messages.value = messages.value.sort(
          (message1: Message, message2: Message) => {
            return (
              new Date(message1.date).getTime() -
              new Date(message2.date).getTime()
            );
          }
        );
      },
      {
        deep: true,
      }
    );

    watch(unreadMessageCount, () => {
      const channel = getChannelByUuid(channels.value, channelUuid.value);
      if (channel) {
        if (unreadMessageCount.value > 0)
          document.title = `(${unreadMessageCount.value}) #${channel.name} ~ ${store.state.configuration.name}`;
        else
          document.title = `#${channel.name} ~ ${store.state.configuration.name}`;
      }
    });

    const onWindowFocus = () => {
      unreadMessageCount.value = 0;
    };

    window.addEventListener("focus", onWindowFocus);

    const logout = () => {
      ws.value = null;
      store.state.token = "";
      localStorage.removeItem("token");
      router.push("/login");
    };

    const editMessage = (messageUuid: string, content: string) => {
      sendPacket(ws.value, PacketType.EDIT_MESSAGE, {
        messageUuid,
        content,
      } as PacketSendEditMessage);
    };

    const deleteMessage = (uuid: string) => {
      sendPacket(ws.value, PacketType.DELETE_MESSAGE, uuid);
    };

    const setUserPopoutUuid = (
      userUuid: string,
      element: HTMLElement | null
    ) => {
      userPopoutUuid.value = userUuid;
      userPopoutElement.value = element;
    };

    const getTypingUsers = () => {
      let rusers: User[] = [];
      let now = new Date();
      typingUsers.value.forEach((typing) => {
        if (
          typing.userUuid !== userUuid.value &&
          now.getTime() - typing.date.getTime() < 1000
        ) {
          let user = users.value.find((user) => user.uuid === typing.userUuid);
          if (user) rusers.push(user);
        }
      });
      return rusers;
    };

    const cleanTypingUsers = () => {
      let outdatedTypingUsers = typingUsers.value.filter(
        (typing) => new Date().getTime() - typing.date.getTime() >= 1000
      );
      outdatedTypingUsers.forEach((outdatedTyping) => {
        let index = typingUsers.value.findIndex(
          (typing) => typing.userUuid === outdatedTyping.userUuid
        );
        typingUsers.value.splice(index, 1);
      });
    };

    const messageTyping = () => {
      sendPacket(ws.value, PacketType.TYPING, channelUuid.value);
    };

    const initWebSocket = () => {
      ws.value = new WebSocket(webSocketUrl + "/ws");
      ws.value.onopen = () => {
        sendPacket(ws.value, PacketType.AUTH, store.state.token);
      };
      ws.value.onclose = () => {
        loading.value = true;
        reconnecting.value = true;
        setTimeout(initWebSocket, 3000);
      };
      ws.value.onmessage = (e: MessageEvent) => {
        parseWebSocketMessage(e.data);
      };
      ws.value.onerror = function () {
        //
      };
    };

    const toggleUserSettings = () => {
      showUserSettings.value = !showUserSettings.value;
    };

    const fetchChannels = async () => {
      channels.value = await getChannels(store.state.token);
    };

    const fetchChannelMessages = async () => {
      const firstChannelMessage = messages.value.filter(
        (message) => message.channelUuid === channelUuid.value
      )[0];
      const channelMessages = await getChannelMessages(
        store.state.token,
        channelUuid.value,
        firstChannelMessage !== undefined ? firstChannelMessage.uuid : "",
        50
      );
      channelMessages.forEach(async (channelMessage) => {
        if (
          !messages.value.find(
            (message) => message.uuid === channelMessage.uuid
          )
        )
          messages.value.push(channelMessage);
      });
      if (channelMessages.length === 0 || channelMessages.length < 50) {
        const channel = getChannelByUuid(channels.value, channelUuid.value);
        if (channel) channel.loadedAllMessages = true;
      }
    };

    const fetchUsers = async () => {
      users.value = await getUsers(store.state.token);
    };

    const setChannelUuid = (uuid: string, notify = true) => {
      channelUuid.value = uuid;
      const channel = getChannelByUuid(channels.value, uuid);
      if (channel) channel.unread = false;
      if (notify) sendPacket(ws.value, PacketType.SET_CHANNEL_UUID, uuid);
      if (
        messages.value.filter((message) => message.channelUuid === uuid)
          .length === 0
      ) {
        if (channel) {
          if (channel.saveMessages) fetchChannelMessages();
          else channel.loadedAllMessages = true;
        }
      }
    };

    const parseWebSocketMessage = (data: string) => {
      const packet = JSON.parse(data) as Packet;

      if (packet.type === PacketType.AUTH) {
        reconnecting.value = false;
        const auth = packet.data as PacketAuth;
        if (auth.userUuid) {
          userUuid.value = auth.userUuid;
          const channelUuid = auth.channelUuid;
          fetchChannels().then(() => {
            setChannelUuid(
              channelUuid == "" ? channels.value[0].uuid : channelUuid,
              false
            );
            fetchUsers().then(() => {
              loading.value = false;
              reconnecting.value = false;
            });
          });
        } else {
          localStorage.removeItem("token");
          store.state.token = "";
          router.push("/login");
        }
      } else if (packet.type === PacketType.ADD_USERS) {
        if (packet.data instanceof Array) {
          for (let i = 0; i < packet.data.length; i++) {
            let user = packet.data[i] as User;
            user.online = false;
            users.value.push(user);
          }
          sendPacket(ws.value, PacketType.ONLINE_USERS);
        }
      } else if (packet.type === PacketType.MESSAGE) {
        let message = packet.data as Message;
        message.date = new Date(message.date);
        message.edited = new Date(message.edited);
        messages.value.push(message);
        if (message.channelUuid === channelUuid.value) {
          if (!document.hasFocus()) unreadMessageCount.value++;
          const index = typingUsers.value.findIndex(
            (typing) => typing.userUuid === message.userUuid
          );
          if (index >= 0) typingUsers.value.splice(index, 1);
        } else {
          const channel = getChannelByUuid(channels.value, message.channelUuid);
          if (channel) channel.unread = true;
        }
      } else if (packet.type === PacketType.ONLINE_USERS) {
        if (packet.data instanceof Array) {
          for (let i = 0; i < packet.data.length; i++) {
            let userUuid = packet.data[i] as string;
            const userIndex = users.value.findIndex(
              (user) => user.uuid === userUuid
            );
            if (userIndex >= 0) users.value[userIndex].online = true;
          }
        }
      } else if (packet.type === PacketType.OFFLINE_USERS) {
        if (packet.data instanceof Array) {
          for (let i = 0; i < packet.data.length; i++) {
            let userUuid = packet.data[i] as string;
            const userIndex = users.value.findIndex(
              (user) => user.uuid === userUuid
            );
            if (userIndex >= 0) users.value[userIndex].online = false;
          }
        }
      } else if (packet.type === PacketType.REMOVE_USERS) {
        if (packet.data instanceof Array) {
          for (let i = 0; i < packet.data.length; i++) {
            let userUuid = packet.data[i] as string;
            const userIndex = users.value.findIndex(
              (user) => user.uuid === userUuid
            );
            if (userIndex >= 0) users.value.splice(userIndex, 1);
          }
        }
      } else if (packet.type === PacketType.UPDATE_USERS) {
        if (packet.data instanceof Array) {
          for (let i = 0; i < packet.data.length; i++) {
            let packetUser = packet.data[i] as User;
            const userIndex = users.value.findIndex(
              (user) => user.uuid === packetUser.uuid
            );
            if (userIndex >= 0) {
              let currentUser = users.value[userIndex];
              packetUser.online = currentUser.online;
              users.value[userIndex] = packetUser;
            }
          }
        }
      } else if (packet.type === PacketType.TYPING) {
        if (packet.data instanceof Array) {
          let channelUuid = packet.data[0] as string;
          let userUuid = packet.data[1] as string;
          let index = typingUsers.value.findIndex(
            (typing) => typing.userUuid == userUuid
          );
          if (index >= 0) {
            typingUsers.value[index].channelUuid = channelUuid;
            typingUsers.value[index].date = new Date();
          } else {
            typingUsers.value.push({
              userUuid,
              channelUuid,
              date: new Date(),
            } as TypingUser);
          }
          clearTimeout(cleanTypingUsersTimeout.value);
          cleanTypingUsersTimeout.value = setTimeout(cleanTypingUsers, 1000);
        }
      } else if (packet.type === PacketType.DELETE_MESSAGE) {
        let index = messages.value.findIndex(
          (message) => message.uuid === (packet.data as string)
        );
        if (index >= 0) messages.value.splice(index, 1);
      } else if (packet.type === PacketType.EDIT_MESSAGE) {
        let editMessage = packet.data as PacketReceiveEditMessage;
        let index = messages.value.findIndex(
          (message) => message.uuid === editMessage.messageUuid
        );
        if (index >= 0) {
          messages.value[index].content = editMessage.content;
          messages.value[index].edited = new Date(editMessage.date);
        }
      } else {
        // Unkown PacketType
      }
    };

    const sendMessage = (content: string, files: string[]) => {
      sendPacketMessage(ws.value, channelUuid.value, content, files);
    };

    const editingMessageUuid = ref("");

    const setEditingMessageUuid = (messageUuid: string) => {
      editingMessageUuid.value = messageUuid;
    };

    const editLastMessage = () => {
      const lastUserMessage = messages.value
        .slice()
        .reverse()
        .find(
          (message) =>
            message.userUuid === userUuid.value &&
            message.channelUuid === channelUuid.value
        );
      if (lastUserMessage) editingMessageUuid.value = lastUserMessage.uuid;
    };

    initWebSocket();

    return {
      loading,
      reconnecting,

      serverName,
      serverDescription,

      userUuid,
      channelUuid,

      users,
      channels,
      messages,

      userPopoutUuid,
      userPopoutElement,

      showUserSettings,

      typingUsers,

      logout,
      editMessage,
      deleteMessage,
      setUserPopoutUuid,
      getTypingUsers,
      messageTyping,
      toggleUserSettings,
      sendMessage,
      fetchChannelMessages,
      setChannelUuid,

      editingMessageUuid,
      setEditingMessageUuid,
      editLastMessage,

      getUserByUuid,
      getChannelByUuid,
      getMessagesByChannelUuid,

      openEmbedViewer,
      closeEmbedViewer,
      viewEmbeds,
      viewEmbedIndex,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";
@import "~@/assets/scss/animations.scss";

.main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .infos {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 64px;

    .server {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 200px;
      padding: 20px;

      .name {
        font-size: 22px;
        font-weight: 400;
      }

      .description {
        color: $light-color;
        font-size: 12px;
      }
    }

    & > div {
      background: #fff;
      z-index: 2;
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }

    div:last-child {
      border-right: 0;
    }
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: row;

    & > div {
      border-right: 1px solid $border-color;
    }

    div:last-child {
      border-right: 0;
    }

    .channel {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;

      .message {
        padding: 0px 15px;
      }
    }
  }
}
</style>
