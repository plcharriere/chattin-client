<template>
  <div class="typing-users">
    <div v-if="users.length > 0">
      <span v-for="(user, index) in users" v-bind:key="user.uuid">
        <b>{{ getUserName(user) }}</b>
        <template v-if="users.length > 1 && index + 1 < users.length">
          <template v-if="index + 2 == users.length"> and </template>
          <template v-else>, </template>
        </template>
      </span>
      <template v-if="users.length === 1"> is typing... </template>
      <template v-else> are typing... </template>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { getUserName } from "@/utils";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    users: {
      type: Array as PropType<User[]>,
      default() {
        return [];
      },
    },
  },
  methods: {
    getUserName: getUserName,
  },
});
</script>

<style scoped lang="scss">
.typing-users {
  display: flex;
  align-items: center;
  height: 15px;
  padding: 5px 10px;
  font-size: 12px;
}
</style>
