<template>
	<div class="avatar" :class="[ size ]"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    size: {
      type: String,
      default: "medium",
    },
  },
})
export default class UserAvatar extends Vue {
}
</script>

<style scoped lang="scss">
.avatar {
	border-radius: 100%;
	background: #ddd;

	&.small {
		width: 32px;
		height: 32px;
	}
	&.medium {
		width: 42px;
		height: 42px;
	}
	&.large {
		width: 52px;
		height: 52px;
	}
}
</style>