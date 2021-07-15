<template>
  <div v-if="loading" class="loading">
    <div></div>
    <span v-if="reconnecting">connection lost, trying to reconnect...</span>
    <span v-else>totally <b title="not*">now</b> loading...</span>
  </div>
  <div v-else class="main">
    <UserSettings
      v-if="showUserSettings"
      :user="getUserByUuid(userUuid)"
      :closeCallback="toggleUserSettings"
    />
    <div class="infos">
      <div class="server">Chattin</div>
      <ChannelInfo :channel="getChannelByUuid(channelUuid)" />
      <UserInfo :user="getUserByUuid(userUuid)" @click="toggleUserSettings" />
    </div>
    <div class="content">
      <ChannelList
        :channels="channels"
        :channelUuid="channelUuid"
        @setChannelUuid="setChannelUuid"
      />
      <div class="channel">
        <MessageList
          :messages="getChannelMessages(channelUuid)"
          :users="users"
          @scrolledTop="fetchChannelMessages"
        />
        <div class="message">
          <textarea
            class="message"
            v-model="message"
            :placeholder="getMessageInputPlaceholder()"
            v-on:keydown.exact.enter="messageInputEnter"
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
import { Message } from "@/dto/Message";
import { Packet, PacketAuth, PacketType } from "@/dto/Packet";
import ChannelInfo from "@/components/ChannelInfo.vue";
import UserInfo from "@/components/User/UserInfo.vue";
import ChannelList from "@/components/ChannelList.vue";
import MessageList from "@/components/MessageList.vue";
import UserList from "@/components/User/UserList.vue";
import UserSettings from "@/components/User/UserSettings/UserSettings.vue";
import { webSocketUrl } from "@/env";
import { getChannelMessages, getChannels, getUsers } from "@/api/http";
import { sendPacket, sendPacketMessage } from "@/api/ws";

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
    messages() {
      this.messages = this.messages.sort(function (
        message1: Message,
        message2: Message
      ) {
        return (
          new Date(message1.date).getTime() - new Date(message2.date).getTime()
        );
      });
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

  showUserSettings = false;

  messageInputEnter(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      if (this.message.length > 0) {
        sendPacketMessage(this.ws, this.channelUuid, this.message);
        this.message = "";
      }
      e.preventDefault();
    }
  }

  getMessageInputPlaceholder(): string {
    const channel = this.getChannelByUuid(this.channelUuid);
    if (!channel) return "Message";
    return "Message in #" + channel.name;
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
      const channel = this.getChannelByUuid(uuid);
      if (channel && channel.saveMessages) this.fetchChannelMessages();
    }
  }

  getChannelByUuid(uuid: string): Channel | undefined {
    return this.channels.find((channel) => channel.uuid === uuid);
  }

  getUserByUuid(uuid: string): User | undefined {
    return this.users.find((user) => user.uuid === uuid);
  }

  getChannelMessages(uuid: string): Message[] {
    return this.messages.filter((message) => message.channelUuid == uuid);
  }

  initWebSocket(): void {
    this.ws = new WebSocket(webSocketUrl + "/ws");
    this.ws.onopen = () => {
      sendPacket(this.ws, PacketType.AUTH, this.$store.state.token);
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
      console.log("RECEIVED AUTH:", packet.data);
      this.reconnecting = false;
      const auth = packet.data as PacketAuth;
      if (auth.userUuid && auth.channelUuid) {
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
      console.log("RECEIVED ADD_USERS:", packet.data);
      if (packet.data instanceof Array) {
        for (let i = 0; i < packet.data.length; i++) {
          let user = packet.data[i] as User;
          user.online = false;
          this.users.push(user);
        }
        sendPacket(this.ws, PacketType.ONLINE_USERS);
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
        padding: 0px 15px 15px;

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
