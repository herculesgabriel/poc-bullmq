import { Queue, Worker, QueueEvents, Job } from 'bullmq';

import { addUser } from './addUser';
import { delay } from './utils';

async function addUserHandler(job: Job) {
  if (job.name === 'add user to database') {
    job.updateProgress(20);
    await delay();

    job.updateProgress(40);
    const insertedCount = await addUser({ name: job.data.name, age: job.data.age });

    job.updateProgress(100);
    return insertedCount;
  }

  console.log(job.name);
  return 0;
}

const addUserQueue = new Queue('add user');
const addUserQueueEvents = new QueueEvents('add user');

new Worker('add user', addUserHandler);

addUserQueueEvents.on('progress', ({ jobId, data }) =>
  console.log(`-> Job ${jobId} on ${data}%`)
);

addUserQueueEvents.on('failed', ({ jobId, failedReason }) =>
  console.log(`-> Job ${jobId} failed. Reason: ${failedReason}`)
);

addUserQueueEvents.on('completed', ({ jobId, returnvalue }) =>
  console.log(`-> Job ${jobId} completed! Inserted values: ${returnvalue}`)
);

addUserQueue.add('add user to database', { name: 'Felipe', age: 30 });
