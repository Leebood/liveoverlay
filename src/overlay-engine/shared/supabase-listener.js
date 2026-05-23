// overlay-engine/shared/supabase-listener.js
// Supabase Realtime listener for live control

var SupabaseListener = {
  client: null,
  channel: null,
  handlers: {},

  init: function(url, anonKey, channelName) {
    this.channel = channelName;
    this.handlers = {};

    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/main/iife.min.js';
    s.onload = function() {
      SupabaseListener.client = window.supabase.createClient(url, anonKey);
      SupabaseListener.client.channel(channelName)
        .on('broadcast', { event: 'control' }, function(payload) {
          var msg = payload.payload;
          var action = msg.action;
          if (SupabaseListener.handlers[action]) {
            SupabaseListener.handlers[action](msg);
          }
        })
        .subscribe();
    };
    document.head.appendChild(s);
  },

  on: function(action, handler) {
    this.handlers[action] = handler;
  },

  destroy: function() {
    if (this.client && this.channel) {
      this.client.removeChannel(this.channel);
    }
    this.handlers = {};
  }
};
