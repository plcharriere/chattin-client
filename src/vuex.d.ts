import { Store } from "vuex";
import { Configuration } from "./dto/Configuration";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    token: string;
    configuration: Configuration;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
