<template>
  <div
    :id="playerId"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      background: '#CCC',
    }"
    class="stream-player"
    @click.once="redraw"
  />
</template>

<script>
export default {
  name: 'StreamPlayer',
  props: {
    autoplay: { type: Boolean, default: false },
    stream: { type: Object, required: true },
    width: { type: Number, default: 640 },
    height: { type: Number, default: 480 },
  },
  computed: {
    playerId() {
      return `player-${this.stream.getId()}`;
    },
  },
  mounted() {
    if (this.autoplay) {
      this.$nextTick(this.redraw);
    }
  },
  beforeDestroy() {
    this.stream.stop();
    this.stream.close();
  },
  methods: {
    redraw() {
      if (!this.stream.isPlaying()) {
        this.stream.play(this.playerId, { fit: 'cover' });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.player {
  min-width: 300px;
  min-height: 200px;
}
</style>
