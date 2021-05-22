import { Queue, Worker, QueueEvents, Job } from 'bullmq';

import { addUser } from './addUser';
import { delay, succeededJob } from './utils';

async function addUserHandler(job: Job) {
  if (job.name === 'add user to database') {
    console.log(`Starting Job ${job.id}: ${job.name}...`);

    job.updateProgress(20);
    await delay();

    job.updateProgress(40);
    const insertedCount = await addUser({ name: job.data.name, age: job.data.age });

    job.updateProgress(100);
    return insertedCount;
  } else {
    console.log(`Nothing on ${job.id}: ${job.name}`);
  }
}

async function returningPromise(job: Job) {
  if (job.name === 'return promise') {
    console.log(`Starting Job ${job.id}: ${job.name}...`);

    await delay();

    const serviceStatus = succeededJob();

    if (serviceStatus === 'pending') {
      throw new Error('Deu ruim');
    }

    if (serviceStatus === 'failure') {
      throw new Error('Deu muito ruim');
    }

    return 'Deu bom!';
  } else {
    console.log(`Nothing on ${job.id}: ${job.name}`);
  }
}

const addUserQueue = new Queue('MAIN QUEUE');
const addUserQueueEvents = new QueueEvents('MAIN QUEUE');

new Worker('MAIN QUEUE', addUserHandler);
new Worker('MAIN QUEUE', returningPromise);

addUserQueueEvents.on('progress', ({ jobId, data }) =>
  console.log(`-> Job ${jobId} on ${data}%`)
);

addUserQueueEvents.on('failed', ({ jobId, failedReason }) =>
  console.log(`-> Job ${jobId} failed. Reason: ${failedReason}`)
);

addUserQueueEvents.on('completed', ({ jobId, returnvalue }) =>
  console.log(`-> Job ${jobId} completed! Inserted values: ${returnvalue || 0}`)
);

addUserQueue.add('add user to database', { name: 'Gabriel', age: 24 });
addUserQueue.add('return promise', {}, { attempts: 5 });
