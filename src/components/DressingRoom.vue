<template>
  <b-row class="dressing-room">
    <b-col
      class="pt-3 text-center"
      offset="2"
      cols="8"
    >
      <b-card title="Preapre to Join">
        <b-row>
          <b-col />
          <player
            v-if="stream"
            :stream="stream"
          />
          <b-col />
        </b-row>
        <b-card-body class="text-center">
          <b-button
            v-if="isVideoOn"
            class="mx-2"
            pill
            variant="danger"
            @click="muteVideo"
          >
            <b-icon icon="camera-video-off" />
          </b-button>
          <b-button
            v-else
            class="mx-2 text-danger"
            pill
            variant="light"
            @click="unmuteVideo"
          >
            <b-icon icon="camera-video" />
          </b-button>

          <b-button
            v-if="isAudioOn"
            class="mx-2"
            pill
            variant="danger"
            @click="muteAudio"
          >
            <b-icon icon="mic-mute" />
          </b-button>
          <b-button
            v-else
            class="mx-2 text-danger"
            pill
            variant="light"
            @click="unmuteAudio"
          >
            <b-icon icon="mic" />
          </b-button>

          <b-button
            class="mx-2"
            pill
            variant="success"
            @click="ready"
          >
            <b-icon icon="door-open" />
          </b-button>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import store from '../store';
import Player from './StreamPlayer.vue';

export default {
  name: 'DressingRoom',
  store,
  components: { Player },
  computed: {
    ...mapGetters({
      stream: 'Connection/localStream',
      channel: 'Connection/channel',
    }),
    isAudioOn() { return this.stream && this.stream.isAudioOn(); },
    isVideoOn() { return this.stream && this.stream.isVideoOn(); },
  },
  mounted() {
    this.$nextTick(this.startLocalStream);
  },
  methods: {
    ...mapActions({
      ready: 'Connection/publish',
      startLocalStream: 'Connection/createStream',
    }),
    muteVideo() {
      this.stream.muteVideo();
    },
    unmuteVideo() {
      this.stream.unmuteVideo();
    },
    muteAudio() {
      this.stream.muteAudio();
    },
    unmuteAudio() {
      this.stream.unmuteAudio();
    },
  },
};
</script>
