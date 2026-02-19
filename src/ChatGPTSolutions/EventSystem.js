function eventSystem() {
  let topics = new Set();
  let subscribers = [];
  let eventQueue = [];
  let processing = false;

  /*
    subscriber structure:
    {
      topic: "face" | "*",
      callback: fn,
      once: boolean,
      priority: number
    }
  */

  const createTopic = (t) => {
    topics.add(t);
  };

  const subscribeTopic = (t, callback, options = {}) => {
    const { once = false, priority = 0 } = options;

    if (t !== "*" && !topics.has(t)) return;

    const alreadySubscribed = subscribers.some(
      (sub) => sub.topic === t && sub.callback === callback
    );

    if (alreadySubscribed) return;

    subscribers.push({
      topic: t,
      callback,
      once,
      priority,
    });

    // Keep subscribers sorted by priority (high → low)
    subscribers.sort((a, b) => b.priority - a.priority);
  };

  const unsubscribe = (t, callback) => {
    subscribers = subscribers.filter(
      (sub) => !(sub.topic === t && sub.callback === callback)
    );
  };

  const processQueue = async () => {
    if (processing) return;
    processing = true;

    while (eventQueue.length > 0) {
      const { topic, data } = eventQueue.shift();

      const matchedSubscribers = subscribers.filter(
        (sub) => sub.topic === topic || sub.topic === "*"
      );

      for (let sub of matchedSubscribers) {
        await Promise.resolve().then(() => sub.callback(data));

        if (sub.once) {
          unsubscribe(sub.topic, sub.callback);
        }
      }
    }

    processing = false;
  };

  const createEvent = (topic, data) => {
    eventQueue.push({ topic, data });
    processQueue();
  };

  return {
    createTopic,
    subscribeTopic,
    unsubscribe,
    createEvent,
  };
}




function user1(data) {
  console.log("User1:", data);
}

function user2(data) {
  console.log("User2:", data);
}

function logger(data) {
  console.log("Logger (wildcard):", data);
}

const system = eventSystem();

system.createTopic("face");
system.createTopic("theme");

// Higher priority runs first.
system.subscribeTopic("face", user1, { priority: 5 });

// Auto-removes after first event execution.
system.subscribeTopic("face", user2, { once: true });

// Receives events from ALL topics.
system.subscribeTopic("*", logger);

system.createEvent("face", { msg: "Hello" });
system.createEvent("face", { msg: "Second Call" });

// Removes only that specific subscriber.
// unsubscribe("face", user1);