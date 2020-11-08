<template>
  <b-container class="meeting">
    <b-row class="self-cam">
      <b-col
        class="pt-1 text-center"
        offset="2"
        cols="8"
      >
        <b-card
          class="pt-3"
          no-body
        >
          <b-row>
            <b-col />
            <player
              v-if="stream"
              ref="player"
              :width="400"
              :height="300"
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
              v-if="!joined"
              class="mx-2"
              pill
              variant="success"
              @click="ready"
            >
              <b-icon icon="door-open" />
            </b-button>
          </b-card-body>
          <b-card-footer v-if="!joined">
            Click Join Button When Cam/Mic Settings are Ready.
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col />
      <b-col
        v-for="remote in remotes"
        :key="remote.getId()"
      >
        <player
          :stream="remote"
          :width="300"
          :height="200"
          autoplay
        />
      </b-col>
      <b-col />
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import store from '../store';
import Player from './StreamPlayer.vue';

export default {
  name: 'MeetingRoom',
  store,
  components: { Player },
  computed: {
    ...mapGetters({
      channel: 'Connection/channel',
      joined: 'Connection/published',
      remotes: 'Connection/remoteStreams',
      stream: 'Connection/localStream',
    }),
    isAudioOn() {
      return this.stream
        && this.stream.isAudioOn()
        && this.stream.isPlaying();
    },
    isVideoOn() {
      return this.stream
        && this.stream.isVideoOn()
        && this.stream.isPlaying();
    },
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
      if (this.stream.isPlaying()) {
        this.stream.unmuteVideo();
      } else {
        this.$refs.player.redraw();
      }
    },
    muteAudio() {
      this.stream.muteAudio();
    },
    unmuteAudio() {
      if (this.stream.isPlaying()) {
        this.stream.unmuteAudio();
      } else {
        this.$refs.player.redraw();
      }
    },
  },
};
</script>
