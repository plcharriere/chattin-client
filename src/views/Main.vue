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
      <div class="infos">
        <div class="server">
          <span class="name">{{ getConfigurationName() }}</span
          ><span
            v-if="getConfigurationDescription().length > 0"
            class="description"
            >{{ getConfigurationDescription() }}</span
          >
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
            :messages="getMessagesByChannelUuid(messages, channelUuid)"
            :user="getUserByUuid(users, userUuid)"
            :users="users"
            @scrolledTop="fetchChannelMessages"
            @setUserPopoutUuid="setUserPopoutUuid"
            @editMessage="editMessage"
            @deleteMessage="deleteMessage"
          />
          <div class="message">
            <MessageInput
              :channel="getChannelByUuid(channels, channelUuid)"
              @typed="messageTyping"
              @sendMessage="sendMessage"
            />
            <TypingUsers :users="getTypingUsers(typingUsers)" />
          </div>
        </div>
        <UserList :users="users" @setUserPopoutUuid="setUserPopoutUuid" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
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
import { webSocketUrl } from "@/env";
import { getChannelMessages, getChannels, getUsers } from "@/api/http";
import { sendPacket, sendPacketMessage } from "@/api/ws";
import {
  getUserByUuid,
  getChannelByUuid,
  getMessagesByChannelUuid,
  getUserName,
} from "@/utils";

@Options({
  props: {},
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
  },
  methods: {
    getUserByUuid: getUserByUuid,
    getChannelByUuid: getChannelByUuid,
    getMessagesByChannelUuid: getMessagesByChannelUuid,
  },
  watch: {
    channelUuid() {
      const channel = getChannelByUuid(this.channels, this.channelUuid);
      if (channel) {
        document.title = `#${channel.name} ~ ${this.$store.state.configuration.name}`;
      }
    },
    users() {
      this.users = this.users.sort((user1: User, user2: User) => {
        return getUserName(user1).localeCompare(getUserName(user2));
      });
    },
    messages() {
      this.messages = this.messages.sort(
        (message1: Message, message2: Message) => {
          return (
            new Date(message1.date).getTime() -
            new Date(message2.date).getTime()
          );
        }
      );
    },
  },
})
export default class Main extends Vue {
  loading = true;
  reconnecting = false;

  ws: WebSocket | null = null;

  userUuid = "";
  channelUuid = "";

  users: User[] = [];
  channels: Channel[] = [];
  messages: Message[] = [];

  message = "";

  userPopoutUuid = "";
  userPopoutElement: HTMLElement | null = null;

  showUserSettings = false;

  typingUsers: TypingUser[] = [];
  cleanTypingUsersTimeout = 0;

  created(): void {
    document.title = `${this.$store.state.configuration.name}`;
  }

  getConfigurationName(): string {
    return this.$store.state.configuration.name;
  }

  getConfigurationDescription(): string {
    return this.$store.state.configuration.description;
  }

  logout(): void {
    this.ws = null;
    this.$store.state.token = "";
    localStorage.removeItem("token");
    this.$router.push("/login");
  }

  editMessage(messageUuid: string, content: string): void {
    sendPacket(this.ws, PacketType.EDIT_MESSAGE, {
      messageUuid,
      content,
    } as PacketSendEditMessage);
  }

  deleteMessage(uuid: string): void {
    sendPacket(this.ws, PacketType.DELETE_MESSAGE, uuid);
  }

  setUserPopoutUuid(userUuid: string, element: HTMLElement | null): void {
    this.userPopoutUuid = userUuid;
    this.userPopoutElement = element;
  }

  getTypingUsers(typingUsers: TypingUser[]): User[] {
    let users: User[] = [];
    let now = new Date();
    typingUsers.forEach((typing) => {
      if (now.getTime() - typing.date.getTime() < 1000) {
        let user = this.users.find((user) => user.uuid === typing.userUuid);
        if (user) users.push(user);
      }
    });
    return users;
  }

  cleanTypingUsers(): void {
    let outdatedTypingUsers = this.typingUsers.filter(
      (typing) => new Date().getTime() - typing.date.getTime() >= 1000
    );
    outdatedTypingUsers.forEach((outdatedTyping) => {
      let index = this.typingUsers.findIndex(
        (typing) => typing.userUuid === outdatedTyping.userUuid
      );
      this.typingUsers.splice(index, 1);
    });
  }

  messageTyping(): void {
    sendPacket(this.ws, PacketType.TYPING, this.channelUuid);
  }

  mounted(): void {
    if (this.$store.state.token == "") {
      this.$router.push("/login");
    } else {
      this.initWebSocket();
    }
  }

  initWebSocket(): void {
    this.ws = new WebSocket(webSocketUrl + "/ws");
    this.ws.onopen = () => {
      sendPacket(this.ws, PacketType.AUTH, this.$store.state.token);
    };
    this.ws.onclose = () => {
      this.loading = true;
      this.reconnecting = true;
      setTimeout(this.initWebSocket, 3000);
    };
    this.ws.onmessage = (e: MessageEvent) => {
      this.parseWebSocketMessage(e.data);
    };
    this.ws.onerror = function () {
      //
    };
  }

  toggleUserSettings(): void {
    this.showUserSettings = !this.showUserSettings;
  }

  async fetchChannels(): Promise<void> {
    this.channels = await getChannels(this.$store.state.token);
  }

  async fetchChannelMessages(): Promise<void> {
    const firstChannelMessage = this.messages.filter(
      (message) => message.channelUuid === this.channelUuid
    )[0];
    const messages = await getChannelMessages(
      this.$store.state.token,
      this.channelUuid,
      firstChannelMessage !== undefined ? firstChannelMessage.uuid : "",
      50
    );
    this.messages = this.messages.concat(messages);
  }

  async fetchUsers(): Promise<void> {
    this.users = await getUsers(this.$store.state.token);
  }

  setChannelUuid(uuid: string, notify = true): void {
    this.channelUuid = uuid;
    if (notify) sendPacket(this.ws, PacketType.SET_CHANNEL_UUID, uuid);
    if (
      this.messages.filter((message) => message.channelUuid === uuid).length ===
      0
    ) {
      const channel = getChannelByUuid(this.channels, uuid);
      if (channel && channel.saveMessages) this.fetchChannelMessages();
    }
  }

  parseWebSocketMessage(data: string): void {
    const packet = JSON.parse(data) as Packet;

    if (packet.type === PacketType.AUTH) {
      this.reconnecting = false;
      const auth = packet.data as PacketAuth;
      if (auth.userUuid) {
        this.userUuid = auth.userUuid;
        const channelUuid = auth.channelUuid;
        this.fetchChannels().then(() => {
          this.setChannelUuid(
            channelUuid == "" ? this.channels[0].uuid : channelUuid,
            false
          );
          this.fetchUsers().then(() => {
            this.loading = false;
            this.reconnecting = false;
          });
        });
      } else {
        localStorage.removeItem("token");
        this.$store.state.token = "";
        this.$router.push("/login");
      }
    } else if (packet.type === PacketType.ADD_USERS) {
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let user = packet.data[i] as User;
          user.online = false;
          this.users.push(user);
        }
        sendPacket(this.ws, PacketType.ONLINE_USERS);
      }
    } else if (packet.type === PacketType.MESSAGE) {
      let message = packet.data as Message;
      message.date = new Date(message.date);
      message.edited = new Date(message.edited);
      this.messages.push(message);
      let index = this.typingUsers.findIndex(
        (typing) => typing.userUuid === message.userUuid
      );
      if (index >= 0) this.typingUsers.splice(index, 1);
    } else if (packet.type === PacketType.ONLINE_USERS) {
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let userUuid = packet.data[i] as string;
          const userIndex = this.users.findIndex(
            (user) => user.uuid === userUuid
          );
          if (userIndex >= 0) this.users[userIndex].online = true;
        }
      }
    } else if (packet.type === PacketType.OFFLINE_USERS) {
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let userUuid = packet.data[i] as string;
          const userIndex = this.users.findIndex(
            (user) => user.uuid === userUuid
          );
          if (userIndex >= 0) this.users[userIndex].online = false;
        }
      }
    } else if (packet.type === PacketType.REMOVE_USERS) {
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let userUuid = packet.data[i] as string;
          const userIndex = this.users.findIndex(
            (user) => user.uuid === userUuid
          );
          if (userIndex >= 0) this.users.splice(userIndex, 1);
        }
      }
    } else if (packet.type === PacketType.UPDATE_USERS) {
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let packetUser = packet.data[i] as User;
          const userIndex = this.users.findIndex(
            (user) => user.uuid === packetUser.uuid
          );
          if (userIndex >= 0) {
            let currentUser = this.users[userIndex];
            packetUser.online = currentUser.online;
            this.users[userIndex] = packetUser;
          }
        }
      }
    } else if (packet.type === PacketType.TYPING) {
      if (packet.data instanceof Array) {
        let channelUuid = packet.data[0] as string;
        let userUuid = packet.data[1] as string;
        let index = this.typingUsers.findIndex(
          (typing) => typing.userUuid == userUuid
        );
        if (index >= 0) {
          this.typingUsers[index].channelUuid = channelUuid;
          this.typingUsers[index].date = new Date();
        } else {
          this.typingUsers.push({
            userUuid,
            channelUuid,
            date: new Date(),
          } as TypingUser);
        }
        clearTimeout(this.cleanTypingUsersTimeout);
        this.cleanTypingUsersTimeout = setTimeout(this.cleanTypingUsers, 1000);
      }
    } else if (packet.type === PacketType.DELETE_MESSAGE) {
      let index = this.messages.findIndex(
        (message) => message.uuid === (packet.data as string)
      );
      if (index >= 0) this.messages.splice(index, 1);
    } else if (packet.type === PacketType.EDIT_MESSAGE) {
      let editMessage = packet.data as PacketReceiveEditMessage;
      let index = this.messages.findIndex(
        (message) => message.uuid === editMessage.messageUuid
      );
      if (index >= 0) {
        this.messages[index].content = editMessage.content;
        this.messages[index].edited = new Date(editMessage.date);
      }
    } else {
      // Unkown PacketType
    }
  }

  sendMessage(content: string, files: string[]): void {
    sendPacketMessage(this.ws, this.channelUuid, content, files);
  }
}
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
      align-items: center;
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
