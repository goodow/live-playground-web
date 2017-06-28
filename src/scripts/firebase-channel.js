import * as firebase from 'firebase';

/**
 * Bus
 *
 * @param options
 * @constructor
 */
var Bus = function (options) {
  var self = this;

  options = options || {};
  this.serverKey = options['serverKey'];
  this.targetClients = [];

  // database = firebase.database();
  // database.ref('.info/connected').on('value', function (connectedSnap) {
  //   if (connectedSnap.val() === true) {
  //     self.onopen && self.onopen();
  //   } else {
  //     self.onclose && self.onclose(e);
  //   }
  // });
};

/**
 * Send a message
 *
 * @param {String} topic
 * @param {Object} payload
 * @param {Object} [options]
 * @param {Function} [callback]
 */
Bus.prototype.send = function (topic, payload, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  var clientId = this.targetClients[0];
  if (typeof clientId !== 'string') {
    if (window.snackbar.show) {
      window.snackbar.show({message: '请选择一个目标设备', actionText: 'OK', actionHandler: () => {}});
      if (callback) {
        callback({failed: true, cause: '请先设置 bus.targetClients'});
      }
      return;
    }
    throw new Error("请先设置 bus.targetClients");
  }
  var msg = {
    'topic': topic,
    'payload': payload === undefined ? null : payload,
    'options': options === undefined ? null : options
  };

  var busRef = firebase.database().ref('bus');
  var queueRef = busRef.child('queue').child(clientId).push();
  queueRef.set(msg, function () {
    queueRef.child('reply').on('value', function (snap) {
      var replyMsg = snap.val();
      if (replyMsg === null) {
        return;
      }
      snap.ref.off();

      var failed = !!replyMsg['error'];
      if (!failed) {
        var historyPath = 'history/' + msg.topic.replace(/\//g, '_') + '/messages/' + queueRef.key;
        var values = {};
        values[historyPath] = {
          'topic': topic,
          'payload': msg.payload,
          'options': msg.options,
          'reply': replyMsg,
          'client': clientId,
          'time': firebase.database.ServerValue.TIMESTAMP
        };
        var categoryPath = 'category/';
        var index = msg.topic.indexOf('/');
        if (index > -1) {
          categoryPath = categoryPath + msg.topic.substring(0, index) + '/topics/' + msg.topic.substring(index + 1).replace(/\//g, '_');
        } else {
          categoryPath = categoryPath + msg.topic;
        }
        values[categoryPath] = {
          time: firebase.database.ServerValue.TIMESTAMP
        };
        busRef.update(values);
      }

      if (callback) {
        callback({failed: failed, cause: replyMsg['error'], result: replyMsg});
      }
    });
  });
};

Bus.prototype.publish = function (topic, payload, options) {
  if (typeof this.serverKey !== 'string') {
    throw new Error("请先设置 bus.serverKey");
  }
  var notification = false;
  if (typeof options === 'object' && 'notification' in options) {
    notification = options['notification'];
  }
  var body = {
    'content_available': !notification,
  };
  if (notification) {
    body['notification'] = payload;
  } else {
    body['data'] = {
      'gdc': {
        'topic': topic,
        'payload': payload,
        'options': options
      }
    };
  }

  function doSend(to, serverKey) {
    body['to'] = to;
    fetch('https://fcm.googleapis.com/fcm/send', {
      'method': 'POST',
      'headers': {
        'Authorization': 'key=' + serverKey,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(body)
    }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.error(error);
    });
  }

  if (notification) {
    doSend(topic, this.serverKey);
    return;
  }
  for (var i in this.targetClients) {
    var client = this.targetClients[i];
    doSend(client, this.serverKey);
  }
};

export default Bus;
