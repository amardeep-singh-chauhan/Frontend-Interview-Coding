function eventSystem() {
  let topics = [];
  let subscribedTopics = [];

  // [{ topic: "face", users: [user1, user2] }]

  const createTopic = (t) => {
    const topicExists = topics.some((topic) => topic === t);
    if (topicExists) return;

    topics = [...topics, t];
  };

  const subscribeTopic = (t, u) => {
    const topicPresent = topics.includes(t);
    if (!topicPresent) return;

    const existingTopic = subscribedTopics.find((top) => top.topic === t);

    // If topic already has subscribers
    if (existingTopic) {
      const userAlreadySubscribed = existingTopic.users.includes(u);
      if (userAlreadySubscribed) return;

      subscribedTopics = subscribedTopics.map((top) =>
        top.topic === t
          ? { ...top, users: [...top.users, u] }
          : top
      );
    } else {
      // First subscription for this topic
      subscribedTopics = [
        ...subscribedTopics,
        { topic: t, users: [u] }
      ];
    }
  };

  const createEvent = (t, data) => {
    const topicSubscribers = subscribedTopics.find(
      (top) => top.topic === t
    );

    if (!topicSubscribers) return;

    topicSubscribers.users.forEach((userFn) => {
      userFn(data);
    });
  };

  return {
    createTopic,
    subscribeTopic,
    createEvent
  };
}


function user1(data) {
  console.log("User1 received:", data);
}

function user2(data) {
  console.log("User2 received:", data);
}

const system = eventSystem();

system.createTopic("face");

system.subscribeTopic("face", user1);
system.subscribeTopic("face", user2);

system.createEvent("face", { message: "Hello World" });
