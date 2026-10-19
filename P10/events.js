const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

// Export single shared EventEmitter instance
const taskEvents = new TaskEvents();
module.exports = taskEvents;
