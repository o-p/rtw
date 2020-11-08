<template>
  <b-container
    id="app"
    fluid
  >
    <component
      :is="room"
      @error="showError"
      @info="showInfo"
    />
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';

import MeetingRoom from './components/MeetingRoom.vue';
import Hall from './components/Hall.vue';
import store from './store';

export default {
  name: 'App',
  store,
  data() {
    return {
      channels: [],
    };
  },
  computed: {
    ...mapGetters({
      connection: 'Connection/state',
      published: 'Connection/published',
    }),
    room() {
      const { connection } = this;
      if (connection !== 'CONNECTED') {
        return Hall;
      }

      return MeetingRoom;
    },
  },
  mounted() {

  },
  methods: {
    showError(message) {
      this.$bvToast.toast(message, {
        variant: 'danger',
      });
    },
    showInfo(message) {
      this.$bvToast.toast(message, {
        variant: 'info',
      });
    },
  },
};
</script>

<style lang="scss">
@import 'assets/world.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
