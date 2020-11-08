<template>
  <div
    :id="playerId"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      background: '#C00',
    }"
    class="stream-player"
  />
</template>

<script>
export default {
  name: 'StreamPlayer',
  props: {
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
    this.$nextTick(this.redraw);
  },
  beforeDestroy() {
    this.stream.stop();
    this.stream.close();
  },
  methods: {
    redraw() {
      if (this.stream) {
        this.stream.play(this.playerId, { fit: 'cover' }, (err) => {
          console.log(err);
        });
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
