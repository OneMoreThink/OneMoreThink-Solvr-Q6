import { db } from '../db';
import { sleepRecords } from '../db/schema';
import { subDays } from 'date-fns';

async function generateDummyData() {
  const today = new Date();
  const records = [];

  // Generate 30 days of sleep records
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    // 6.0 ~ 9.0 사이 0.5 단위 랜덤
    const sleepHours = 6 + Math.floor(Math.random() * 7) * 0.5;
    records.push({
      userId: 1, // 기본 사용자 ID
      date: date.toISOString().split('T')[0],
      sleepHours,
      notes: Math.random() > 0.7 ? 'Good sleep' : null,
    });
  }

  await db.insert(sleepRecords).values(records);
  console.log('Dummy data generated successfully!');
}

generateDummyData().catch(console.error); 