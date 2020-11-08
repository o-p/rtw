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

import DressingRoom from './components/DressingRoom.vue';
import Hall from './components/Hall.vue';
import MeetingRoom from './components/MeetingRoom.vue';
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

      if (!this.published) {
        return DressingRoom;
      }

      return MeetingRoom;
    },
  },
  mounted() {

  },
  methods: {
    onEnterChannel(channel) {
      this.$bvToast.toast(`Joined Channel "${channel.name}" (${channel.uid})`, {
        variant: 'success',
      });
    },
    onEnterFailure(error) {
      this.$bvToast.toast(error.message || error, {
        title: 'Join Channel Failure',
        variant: 'danger',
      });
    },
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
