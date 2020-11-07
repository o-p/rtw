<template>
  <b-modal
    :visible="!hasConnected"
    ok-only
    ok-title="JOIN"
    no-close-on-backdrop
    no-close-on-esc
    @ok="establish"
  >
    <form
      class="pt-3"
      @submit.stop.prevent="establish"
    >
      <b-form-group
        label="APP ID"
        label-cols="3"
      >
        <b-form-input
          v-model="appId"
          required
        />
      </b-form-group>
      <b-form-group
        label="Channel Name"
        label-cols="3"
      >
        <b-form-input
          v-model="channelName"
          required
        />
      </b-form-group>
      <b-form-group
        label="Token"
        label-cols="3"
      >
        <b-form-input v-model="token" />
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import store from '../store';

export default {
  name: 'Hall',
  store,
  data() {
    return {
      appId: '67efc4ba0e964676bac899637f38de70',
      channelName: 'challenge',
      token: '00667efc4ba0e964676bac899637f38de70IADPkLL7xRtoze75oBa0gdcDDo7INlIosXF3dGk9K0A6CVGJCdcAAAAAEABqf2ZwBvKnXwEAAQAG8qdf',
    };
  },
  computed: {
    ...mapGetters({
      hasConnected: 'Connection/established',
    }),
  },
  methods: {
    ...mapActions({
      restart: 'Connection/restart',
      join: 'Connection/joinChannel',
    }),
    async establish() {
      const { appId, channelName, token } = this;
      return this.restart(appId)
        .then(() => this.join({ channelName, token }))
        .then((channel) => this.$emit('enter', channel))
        .catch((err) => this.$emit('error', err));
    },
  },
};
</script>
