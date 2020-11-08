import AgoraRTC from 'agora-rtc-sdk';

/**
 * @link https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
 */
const AGORA_RTC_CONFIG = {
  // rtc | live (RTC for 1-to-1, live for broadcasting)
  mode: 'rtc',
  // vp8 | h264
  codec: 'h264',
};

// const ALL_CLIENT_EVENTS = [
//   'first-video-frame-decode',
//   'stream-published',
//   'stream-unpublished',
//   'stream-added',
//   'stream-removed',
//   'stream-subscribed',
//   'peer-online',
//   'peer-leave',
//   'mute-audio',
//   'unmute-audio',
//   'mute-video',
//   'unmute-video',
//   'crypt-error',
//   'client-banned',
//   'active-speaker',
//   'volume-indicator',
//   'liveStreamingStarted',
//   'liveStreamingFailed',
//   'liveStreamingStopped',
//   'liveTranscodingUpdated',
//   'streamInjectedStatus',
//   'onTokenPrivilegeWillExpire',
//   'onTokenPrivilegeDidExpire',
//   'error',
//   'network-type-changed',
//   'recording-device-changed',
//   'playout-device-changed',
//   'camera-changed',
//   'stream-type-changed',
//   'connection-state-change',
//   'stream-reconnect-start',
//   'stream-reconnect-end',
//   'client-role-changed',
//   'reconnect',
//   'rejoin',
//   'connected',
//   'network-quality',
//   'stream-fallback',
//   'stream-updated',
//   'exception',
//   'enable-local-video',
//   'disable-local-video',
//   'channel-media-relay-event',
//   'channel-media-relay-state',
// ];

export default {
  namespaced: true,
  state: {
    channel: null,
    client: null,
    connectionState: 'DISCONNECTED',
    listeners: {},
    localStream: null,
    remoteStreams: [],
    peers: [],
    published: false,
  },
  mutations: {
    addPeer(state, peer) {
      const { peers } = state;
      if (!peers.find((online) => online.uid === peer.uid)) {
        state.peers = [
          ...peers,
          peer,
        ];
      }
    },
    addRemoteStream(state, stream) {
      const { remoteStreams } = state;
      if (!remoteStreams.find((registered) => registered.getId() === stream.getId())) {
        state.remoteStreams = [
          ...remoteStreams,
          stream,
        ];
      }
    },
    channel(state, channel) {
      state.channel = channel;
    },
    client(state, client) {
      state.client = client;
    },
    connectionState(state, connectionState) {
      state.connectionState = connectionState;
    },
    listener(state, { event, handler }) {
      state.listeners = [
        ...(state.listeners[event] || []).filter((callback) => callback !== handler),
        handler,
      ];
    },
    localStream(state, stream) { state.localStream = stream; },
    published(state, published) { state.published = published; },
    removePeer(state, peer) {
      state.peers = state.peers.filter((online) => online.uid !== peer.uid);
    },
    removeRemoteStream(state, stream) {
      state.remoteStreams = state.remoteStreams
        .filter((registered) => registered.getId() !== stream.getId());
    },
  },
  actions: {
    createStream({ commit, state }, options = {}) {
      const stream = AgoraRTC.createStream({
        streamID: state.channel?.uid,
        audio: true,
        video: true,
        screen: false,
        ...options,
      });
      commit('localStream', stream);
      return new Promise((resolve, reject) => {
        stream.init(resolve, reject);
      });
    },
    listen({ state }, { event, handler }) {
      state.client.on(event, handler);
    },
    async joinChannel({ commit, state: { client } }, { channelName, token }) {
      const uid = await new Promise((resolve, reject) => client.join(
        token,
        channelName,
        null,
        resolve,
        reject,
      ));
      const channel = {
        uid,
        name: channelName,
        token,
      };
      commit('channel', channel);
      return channel;
    },
    /** Publish local stream */
    publish({ state, commit }) {
      const { client, localStream } = state;

      client.publish(localStream, (err) => {
        console.error(err);
        commit('published', false);
      });
      commit('published', true);
    },
    /** Restart connection to Agora server */
    restart({ commit, state }, appId) {
      const client = state.client || AgoraRTC.createClient(AGORA_RTC_CONFIG);

      client.on(
        'connection-state-change',
        ({ curState }) => commit('connectionState', curState),
      );

      client.on(
        'stream-added',
        ({ stream }) => client.subscribe(stream),
      );

      client.on(
        'stream-subscribed',
        ({ stream }) => commit('addRemoteStream', stream),
      );

      client.on(
        'stream-removed',
        ({ stream }) => commit('removeRemoteStream', stream),
      );

      client.on(
        'peer-online',
        (peer) => commit('addPeer', peer),
      );

      client.on(
        'peer-leave',
        (peer) => commit('removePeer', peer),
      );

      commit('client', client);
      return new Promise((resolve, reject) => {
        client.init(appId, () => resolve(client), reject);
      });
    },
  },
  getters: {
    channel(state) { return state.channel; },
    established(state) { return !!state.channel; },
    localStream(state) { return state.localStream; },
    peers(state) { return state.peers; },
    published(state) { return state.published; },
    remoteStreams(state) { return state.remoteStreams; },
    /** @return string DISCONNECTED | CONNECTING | CONNECTED | DISCONNECTING */
    state(state) { return state.connectionState; },
  },
};
