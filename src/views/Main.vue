<template>
  <div v-if="loading" class="loading">
    <div></div>
    <span v-if="reconnecting">connection lost, trying to reconnect...</span>
    <span v-else>totally <b title="not*">now</b> loading...</span>
  </div>
  <div v-else class="main">
    <UserSettings
      v-if="showUserSettings"
      :user="getUserByUuid(currentUserUuid)"
      :closeCallback="toggleUserSettings"
    />
    <div class="infos">
      <div class="server">Instant Messenger</div>
      <ChannelInfo :channel="getChannelByUuid(currentChannelUuid)" />
      <UserInfo
        :user="getUserByUuid(currentUserUuid)"
        @click="toggleUserSettings"
      />
    </div>
    <div class="content">
      <ChannelList
        :channels="channels"
        :currentChannelUuid="currentChannelUuid"
        @setCurrentChannelUuid="setCurrentChannelUuid"
      />
      <div class="channel">
        <MessageList
          :messages="getChannelMessages(currentChannelUuid)"
          :users="users"
          @scrolledTop="onMessageListScrolledTop"
        />
        <div class="message">
          <textarea
            class="message"
            v-model="message"
            :placeholder="getMessageInputPlaceholder()"
            @keyup.enter.exact="sendMessage()"
          ></textarea>
        </div>
      </div>
      <UserList :users="users" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "@/dto/User";
import { Channel } from "@/dto/Channel";
import { Message, MessageHistoryRequest, MessageInput } from "@/dto/Message";
import { Packet, PacketData, PacketType } from "@/dto/Packet";
import ChannelInfo from "@/components/ChannelInfo.vue";
import UserInfo from "@/components/User/UserInfo.vue";
import ChannelList from "@/components/ChannelList.vue";
import MessageList from "@/components/MessageList.vue";
import UserList from "@/components/User/UserList.vue";
import UserSettings from "@/components/User/UserSettings/UserSettings.vue";

@Options({
  props: {},
  components: {
    ChannelList,
    UserSettings,
    ChannelInfo,
    UserInfo,
    MessageList,
    UserList,
  },
  watch: {
    currentChannelUuid(uuid) {
      this.onChangedCurrentChannelUuid(uuid);
    },
  },
})
export default class Main extends Vue {
  loading = true;
  reconnecting = false;

  ws: WebSocket | null = null;

  channels: Channel[] = [];

  users: User[] = [];

  messages: Message[] = [];

  message = "";

  currentChannelUuid = "";
  currentUserUuid = "";

  showUserSettings = false;

  getMessageInputPlaceholder(): string {
    const channel = this.getChannelByUuid(this.currentChannelUuid);
    if (!channel) return "Message";
    return "Message in #" + channel.name;
  }

  toggleUserSettings(): void {
    this.showUserSettings = !this.showUserSettings;
  }

  getChannelMessageHistory(
    channelUuid: string,
    fromMessageUuid: string,
    count: number
  ): void {
    this.sendPacket(PacketType.GET_MESSAGES, {
      channelUuid,
      fromMessageUuid,
      count,
    } as MessageHistoryRequest);
  }

  onMessageListScrolledTop(): void {
    const channelMessages = this.messages.filter(
      (message) => message.channelUuid === this.currentChannelUuid
    );
    if (channelMessages && channelMessages.length > 0)
      this.getChannelMessageHistory(
        this.currentChannelUuid,
        channelMessages[0].uuid,
        50
      );
  }

  onChangedCurrentChannelUuid(uuid: string): void {
    if (
      this.messages.filter((message) => message.channelUuid === uuid).length ===
      0
    ) {
      const channel = this.getChannelByUuid(uuid);
      if (channel && channel.saveMessages)
        this.getChannelMessageHistory(uuid, "", 50);
    }
  }

  setCurrentChannelUuid(uuid: string): void {
    this.currentChannelUuid = uuid;
  }

  getChannelByUuid(uuid: string): Channel | undefined {
    return this.channels.find((channel) => channel.uuid === uuid);
  }

  getUserByUuid(uuid: string): User | undefined {
    return this.users.find((user) => user.uuid === uuid);
  }

  sendPacket(type: PacketType, data: PacketData = ""): void {
    if (this.ws) {
      console.log("SEND PACKET:", type, data);
      const packet: Packet = {
        type: type,
        data: data,
      };
      this.ws.send(JSON.stringify(packet));
    } else {
      console.log("SEND PACKET: ws is null");
    }
  }

  sendMessage(): void {
    this.sendPacket(PacketType.MESSAGE, {
      channelUuid: this.currentChannelUuid,
      content: this.message,
    } as MessageInput);
    this.message = "";
  }

  getChannelMessages(uuid: string): Message[] {
    return this.messages.filter((message) => message.channelUuid == uuid);
  }

  initWebSocket(): void {
    this.ws = new WebSocket("ws://localhost:2727/ws");
    this.ws.onopen = () => {
      this.sendPacket(PacketType.AUTH, this.$store.state.token);
    };
    this.ws.onclose = () => {
      console.log("CLOSE");
      this.loading = true;
      this.reconnecting = true;
      setTimeout(this.initWebSocket, 3000);
    };
    this.ws.onmessage = (e: MessageEvent) => {
      this.parseWebSocketMessage(e.data);
    };
    this.ws.onerror = function (e: Event) {
      console.log("ERROR: " + e);
    };
  }

  parseWebSocketMessage(data: string): void {
    const packet = JSON.parse(data) as Packet;

    if (packet.type === PacketType.AUTH) {
      this.reconnecting = false;
      if (typeof packet.data == "string" && packet.data.length == 36) {
        console.log("RECEIVED AUTH:", packet.data);
        this.currentUserUuid = packet.data;
        this.sendPacket(PacketType.CHANNEL_LIST);
        this.sendPacket(PacketType.USER_LIST);
      } else {
        localStorage.removeItem("token");
        this.$store.state.token = "";
        this.$router.push("/login");
      }
    } else if (
      packet.type === PacketType.USER_LIST ||
      packet.type === PacketType.ADD_USERS
    ) {
      if (packet.type === PacketType.USER_LIST) {
        console.log("RECEIVED USER_LIST:", packet.data);
        this.users = [];
      } else console.log("RECEIVED ADD_USERS:", packet.data);
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let user = packet.data[i] as User;
          user.online = false;
          this.users.push(user);
        }
        this.sendPacket(PacketType.ONLINE_USERS);
      }
    } else if (packet.type === PacketType.CHANNEL_LIST) {
      console.log("RECEIVED CHANNEL_LIST:", packet.data);
      if (packet.data instanceof Array) {
        this.channels = [];
        for (let i = 0; i < packet.data.length; i++) {
          this.channels.push(packet.data[i] as Channel);
          if (this.currentChannelUuid == "")
            this.currentChannelUuid = (packet.data[i] as Channel).uuid;
        }
      }
    } else if (packet.type === PacketType.MESSAGE) {
      console.log("RECEIVED MESSAGE:", packet.data);
      let message = packet.data as Message;
      message.date = new Date(message.date);
      this.messages.push(message);
    } else if (packet.type === PacketType.ONLINE_USERS) {
      console.log("RECEIVED ONLINE_USERS:", packet.data);
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
      console.log("RECEIVED OFFLINE_USERS:", packet.data);
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
      console.log("RECEIVED REMOVE_USERS:", packet.data);
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
      console.log("RECEIVED UPDATE_USERS:", packet.data);
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
    } else if (packet.type === PacketType.GET_MESSAGES) {
      console.log("RECEIVED GET_MESSAGES:", packet.data);
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let message = packet.data[i] as Message;
          message.date = new Date(message.date);
          this.messages.push(message);
          this.messages = this.messages.sort(function (message1, message2) {
            return (
              new Date(message1.date).getTime() -
              new Date(message2.date).getTime()
            );
          });
        }
      }
    }

    if (this.channels.length > 0 && this.users.length > 0) {
      this.loading = false;
      this.reconnecting = false;
    }
  }

  mounted(): void {
    if (this.$store.state.token == "") {
      this.$router.push("/login");
    } else {
      this.initWebSocket();
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;

  b {
    cursor: pointer;
  }

  div {
    position: relative;
    width: 100px;
    height: 100px;
    background: url(~@/assets/img/loading-catto-full.gif) !important;
    border-radius: 100%;
    background-position: center !important;
    background-size: 400px !important;
    box-shadow: 0 3px 0.5rem 0.25rem rgba(0, 0, 0, 0.15);
    margin-bottom: 30px;
    transition: all 300ms;

    &:hover {
      width: 200px;
      height: 200px;
    }
  }
}
.main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .infos {
    display: flex;
    flex-direction: row;
    height: 64px;
    border-bottom: 1px solid $border-color;

    .server {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 400;
      min-width: 200px;
      padding: 20px;
    }

    div {
      border-right: 1px solid $border-color;
    }

    div:last-child {
      border-right: 0;
    }
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: row;

    .channel {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;

      .message {
        padding: 0px 15px;
        margin-bottom: 20px;

        textarea {
          height: 50px;
          padding: 16px 20px;
          border-radius: 10px;
          resize: none;
          margin: 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          &:focus {
            border: 1px solid $border-color;
          }
        }
      }
    }
  }
}
</style>
