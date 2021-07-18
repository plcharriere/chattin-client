<template>
  <div
    ref="popout"
    class="user-popout"
    :style="{
      left: left + 'px',
      top: top + 'px',
    }"
  >
    <div class="infos">
      <UserAvatar :uuid="user.avatarUuid" size="medium" />
      <UserName :user="user" :showLogin="true" />
    </div>
    <div class="bio" v-if="user.bio.length > 0">
      <div class="separator">
        Bio
        <div></div>
      </div>
      {{ user.bio }}
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/dto/User";
import { defineComponent, onUnmounted, PropType } from "@vue/runtime-core";
import UserAvatar from "@/components/User/UserAvatar.vue";
import UserName from "@/components/User/UserName.vue";
import { computed, ref } from "vue";

export default defineComponent({
  components: {
    UserAvatar,
    UserName,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    element: {
      type: HTMLElement,
      required: true,
    },
  },
  setup(props, { emit }) {
    const popout = ref();
    const left = computed(() => {
			let rect = props.element.getBoundingClientRect();
			let left = rect.left + props.element.offsetWidth + 12;
      if (popout.value) {
        let clientWidth = window.document.documentElement.clientWidth;
        let popoutWidth = popout.value.offsetWidth;
        if (left + popoutWidth > clientWidth) {
          left =
            rect.left -
            props.element.offsetWidth -
            props.element.offsetWidth / 2 -
            8;
        }
      }
      return left;
    });
    const top = computed(() => {
      let rect = props.element.getBoundingClientRect();
      let top = rect.top;
      if (popout.value) {
        let clientWidth = window.document.documentElement.clientWidth;
        let clientHeight = window.document.documentElement.clientHeight;
        let popoutWidth = popout.value.offsetWidth;
        let popoutHeight = popout.value.offsetHeight;
        if (left.value + popoutWidth > clientWidth)
          top = rect.bottom - props.element.offsetHeight;
        if (popoutHeight + top >= clientHeight)
          top = clientHeight - popoutHeight - 12;
      }
      return top;
    });

    let documentClick = (e: MouseEvent) => {
      if (popout.value && !(popout.value === e.target || popout.value.contains(e.target))) {
        if (!(e.target as HTMLElement).closest(".open-user-popout")) {
          emit("closeUserPopout");
        }
      }
    };

    document.body.addEventListener("click", documentClick);

    onUnmounted(() => {
      document.body.removeEventListener("click", documentClick);
    });

    return {
      popout,
      left,
      top,
    };
  },
});
</script>

<style scoped lang="scss">
@import "~@/assets/scss/variables.scss";

.user-popout {
  transition: all 200ms;
  position: absolute;
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 2;

  .infos {
    display: flex;
    flex-direction: row;
    align-items: center;

    .user-name {
      margin-left: 20px;
      font-size: 20px;
    }
  }

  .bio {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    margin-bottom: 5px;

    .separator {
      display: flex;
      flex-direction: row;
      color: $lighter-color;
      font-size: 13px;
      align-items: center;
      margin-bottom: 10px;

      div {
        width: 100%;
        margin-left: 10px;
        border-top: 1px solid $border-color;
      }
    }
  }
}
</style>
