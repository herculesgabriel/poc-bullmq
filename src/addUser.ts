import { MongoClient } from 'mongodb';

type User = { name: string; age: number };

export const addUser = async ({ name, age }: User, done?: CallableFunction) => {
  try {
    const mongoInstance = await MongoClient.connect('mongodb://127.0.0.1:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoInstance.db('bull_example');

    console.log('Estou inserindo um usuário...');
    const result = await connection
      .collection('users')
      .insertOne({ name, age, createdAt: new Date() });

    return result?.insertedCount;
  } catch (error) {
    console.error('Houve um erro ao tentar se conectar com o banco!');
    console.error(error);
  }
};
