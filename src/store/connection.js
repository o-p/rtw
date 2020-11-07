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

const ALL_CLIENT_EVENTS = [
  'first-video-frame-decode',
  'stream-published',
  'stream-unpublished',
  'stream-added',
  'stream-removed',
  'stream-subscribed',
  'peer-online',
  'peer-leave',
  'mute-audio',
  'unmute-audio',
  'mute-video',
  'unmute-video',
  'crypt-error',
  'client-banned',
  'active-speaker',
  'volume-indicator',
  'liveStreamingStarted',
  'liveStreamingFailed',
  'liveStreamingStopped',
  'liveTranscodingUpdated',
  'streamInjectedStatus',
  'onTokenPrivilegeWillExpire',
  'onTokenPrivilegeDidExpire',
  'error',
  'network-type-changed',
  'recording-device-changed',
  'playout-device-changed',
  'camera-changed',
  'stream-type-changed',
  'connection-state-change',
  'stream-reconnect-start',
  'stream-reconnect-end',
  'client-role-changed',
  'reconnect',
  'rejoin',
  'connected',
  'network-quality',
  'stream-fallback',
  'stream-updated',
  'exception',
  'enable-local-video',
  'disable-local-video',
  'channel-media-relay-event',
  'channel-media-relay-state',
];

function dispatchAllEvents(client, dispatcher) {
  ALL_CLIENT_EVENTS.forEach((type) => client.on(type, (event) => dispatcher({ type, event })));
}

export default {
  namespaced: true,
  state: {
    channel: null,
    client: null,
    listeners: {},
  },
  mutations: {
    client(state, client) {
      state.client = client;
    },
    listener(state, { event, handler }) {
      state.listener = [
        ...(state.listeners[event] || []),
        handler,
      ];
    },
    channel(state, channel) {
      state.channel = channel;
    },
  },
  actions: {
    emit({ state }, { type, event }) {
      (state.listeners[type] || [])
        .forEach((fn) => fn(event));
    },
    restart({ commit, state, dispatch }, appId) {
      const client = state.client || AgoraRTC.createClient(AGORA_RTC_CONFIG);
      dispatchAllEvents(client, dispatch.emit);
      commit('client', client);
      return new Promise((resolve, reject) => {
        client.init(appId, () => resolve(client), (err) => reject(err));
      });
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
    on({ commit }, { event, handler }) {
      commit('listener', { event, handler });
    },
  },
  getters: {
    established(state) { return !!state.channel; },
  },
};
