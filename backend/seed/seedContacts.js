// backend/seed/seedContacts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../models/contactModel.js';

dotenv.config();

// MongoDBに接続
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    return seedContacts();
  })
  .catch((err) => {
    console.error('Connection error:', err);
    process.exit(1);
  });

// 初期問い合わせデータ
const contacts = [
  {
    name: '山田太郎',
    email: 'taro@example.com',
    message: '資料請求をしたいです。',
    createdAt: new Date(),
  },
  {
    name: '佐藤花子',
    email: 'hanako@example.com',
    message: 'サービスについて質問があります。',
    createdAt: new Date(),
  },
];

// シード処理
async function seedContacts() {
  try {
    await Contact.deleteMany(); // 既存のデータをクリア
    const created = await Contact.insertMany(contacts);
    console.log(`Seeded ${created.length} contacts`);
    process.exit(); // 終了
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}
