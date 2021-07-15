<template>
  <div class="loading">
    <div></div>
    <span v-if="reconnecting">connection lost, trying to reconnect...</span>
    <span v-else>totally <b title="not*">now</b> loading...</span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    reconnecting: {
      type: Boolean,
      default: false,
    },
  },
})
export default class Loading extends Vue {}
</script>

<style scoped lang="scss">
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
</style>
