// Problem Statement

// Class EventSystem
 
// Any one who wants to create events can create the events
// Users who wants to subscribe they can subscribe.
// When something changes to the subscribed topics, subscribers gets events.
 
 
// Initialise the event system
 
// const user = function(event) {
// 	console.log()
// }
 
// const eventSystem = new EventSystem();
// eventSystem.createTopic(“instagram”)
// eventSystem.subscribe(“instagram”, user)
 
// eventSystem.createEvent(“instagram”, “”post_liked);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function eventSystem(){
  let topics = [];
  let subscribedTopics = [];

  // [{topic: "face" , users: [user1]}, {topic: "theme" , users: []}]


  const createTopic = (t) => {
    let newTopic = {id: topics.length, topic: t}
    topics = [...topics, newTopic];
  }

  const subscribeTopic = (t,u) => {
    let topicPresent = topics.length>0 && topics.findIndex(t);
    let userPresent  = subscribedTopics.length > 0 && subscribedTopics.filter((top) =>  t === top.topic && top.users.includes(u));
    if(userPresent)  return;

    if(topicPresent){
      let subscribedTopics = subscribedTopics.map((top) => {
        if(top.topic === t){
          return {
            ...top,
            users: [...top.users, u]
          }
        } else {
          return {
            topic: t,
            users: [u]
          }
        }
      });
    }
  
  }

  const createEvent = () => {

  }

  return {
    createTopic, subscribeTopic, createEvent
  }
}

function user1() {

}
function user2(){

}