<template>
  <b-container id="app">
    <Hall
      @enter="onEnterChannel"
      @error="error => this.$bvToast.toast(error, { variant: 'danger '})"
    />
  </b-container>
</template>

<script>
import Hall from './components/Hall.vue';
import store from './store';

export default {
  name: 'App',
  components: {
    Hall,
  },
  store,
  data() {
    return {
      channels: [],
    };
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
