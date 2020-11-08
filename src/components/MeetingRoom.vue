<template>
  <div class="meeting-room w-100 h-100">
    <b-row
      :cols="4"
      :style="{ height: '220px' }"
    >
      <b-col
        v-for="stream in streams"
        :key="stream.getId()"
      >
        <stream-player
          :stream="stream"
          :width="300"
          :height="200"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col />
      <stream-player
        :stream="local"
        :width="640"
        :height="480"
      />
      <b-col />
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import store from '../store';
import StreamPlayer from './StreamPlayer.vue';

export default {
  name: 'MeetingRoom',
  components: {
    StreamPlayer,
  },
  props: {
    // roomId: { type: String, required: true },
  },
  store,
  computed: {
    ...mapGetters({
      local: 'Connection/localStream',
      members: 'Connection/peers',
      streams: 'Connection/remoteStreams',
    }),
  },
  methods: {
    ...mapActions({}),
  },
};
</script>
