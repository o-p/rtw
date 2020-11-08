<template>
  <b-row class="hall">
    <b-col
      class="pt-5 text-left"
      offset="3"
      cols="6"
    >
      <b-card title="Connection Settings">
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
              :readonly="readonly"
            />
          </b-form-group>
          <b-form-group
            label="Channel Name"
            label-cols="3"
          >
            <b-form-input
              v-model="channelName"
              :readonly="readonly"
            />
          </b-form-group>
          <b-form-group
            label="Token"
            label-cols="3"
          >
            <b-form-input
              v-model="token"
              :readonly="readonly"
            />
          </b-form-group>
          <b-form-group
            class="text-right mt-3 mb-0"
          >
            <b-button
              variant="primary"
              :disabled="readonly"
              @click="establish"
            >
              Connect
            </b-button>
          </b-form-group>
        </form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import store from '../store';

export default {
  name: 'Hall',
  store,
  data() {
    return {
      appId: '',
      channelName: '',
      token: '',
    };
  },
  computed: {
    ...mapGetters({
      connection: 'Connection/state',
    }),
    readonly() {
      return this.connection !== 'DISCONNECTED';
    },
  },
  methods: {
    ...mapActions({
      initLocalStream: 'Connection/createStream',
      join: 'Connection/joinChannel',
      restart: 'Connection/restart',
    }),
    async establish() {
      const { appId, channelName, token } = this;
      return this.restart(appId)
        .then(() => this.join({ channelName, token }))
        .then((channel) => {
          this.$emit('info', `Joined Channel "${channel.name}"`);
          return this.initLocalStream({ streamID: channel.uid });
        })
        .catch((err) => this.$emit('error', err.message || err));
    },
  },
};
</script>
