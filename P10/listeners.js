const taskEvents = require('./events');

// Listener for task-created event
taskEvents.on('task-created', (task) => {
  const handlerStartTime = new Date().toISOString();
  console.log(`[Notification Worker] Received 'task-created' event for: "${task.title}" at ${handlerStartTime}`);

  // Simulating asynchronous background work (e.g., sending emails/push notifications)
  setTimeout(() => {
    const completedTime = new Date().toISOString();
    console.log(`[Notification Worker Completed] Email sent for task: "${task.title}" at ${completedTime}`);
  }, 1500);
});

// Listener for task-deleted event
taskEvents.on('task-deleted', (task) => {
  console.log(`[Audit Log] Task "${task.title}" (ID: ${task._id}) deleted at ${new Date().toISOString()}`);
});

// Listener for error handling inside event workflows
taskEvents.on('error', (err) => {
  console.error(`[Event Error] An error occurred in event pipeline: ${err.message}`);
});
