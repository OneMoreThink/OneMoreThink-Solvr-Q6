import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getSleepStats } from '../services/sleepService';

interface SleepStats {
  totalRecords: number;
  averageSleepHours: number;
  last7Days: {
    date: string;
    sleepHours: number;
  }[];
}

// 수면 목표 달성률 계산
function calculateSleepGoalAchievement(records: { sleepHours: number }[]) {
  if (!records || records.length === 0) return 0;
  
  console.log('전체 기록:', records);
  
  // 7-9시간 사이의 수면을 달성한 기록 수 계산
  const achievedCount = records.filter(record => {
    const hours = parseFloat(record.sleepHours.toString());
    console.log('수면 시간:', hours, '달성 여부:', hours >= 7 && hours <= 9);
    return hours >= 7 && hours <= 9;
  }).length;
  
  const achievementRate = (achievedCount / records.length) * 100;
  console.log('달성 기록 수:', achievedCount, '전체 기록 수:', records.length, '달성률:', achievementRate);
  
  return achievementRate;
}

// 게이지 차트 데이터 생성
function createGaugeData(achievementRate: number) {
  return [
    { name: '달성', value: achievementRate },
    { name: '미달성', value: 100 - achievementRate }
  ];
}

export default function SleepStats() {
  const [stats, setStats] = useState<SleepStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [allRecords, setAllRecords] = useState<{ sleepHours: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSleepStats();
        setStats(data);
        const resp = await fetch('/api/sleep-records');
        if (resp.ok) {
          const all = await resp.json();
          console.log('받은 데이터:', all);
          setAllRecords(all);
        }
      } catch (error) {
        console.error('Error fetching sleep stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">불러오는 중...</div>;
  }

  if (!stats || stats.totalRecords === 0) {
    return <div className="text-center text-gray-500 py-10">아직 기록이 없어요!<br/>수면 기록을 추가하면 통계와 차트를 볼 수 있습니다.</div>;
  }

  const achievementRate = calculateSleepGoalAchievement(allRecords);
  const gaugeData = createGaugeData(achievementRate);

  return (
    <div className="space-y-8 p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">나의 수면 통계</h2>
        <p className="text-gray-600">최근 30일간의 수면 기록을 바탕으로 한 통계와 차트입니다.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">최근 7일간 수면 시간 추이</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                label={{ value: '날짜', position: 'insideBottom', offset: -5 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
              />
              <YAxis 
                label={{ value: '수면 시간(시간)', angle: -90, position: 'insideLeft' }}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip 
                labelFormatter={(date) => `날짜: ${new Date(date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}`}
                formatter={(value) => [`${value}시간`, '수면 시간']}
              />
              <Legend formatter={() => '수면 시간'} />
              <Line 
                type="monotone" 
                dataKey="sleepHours" 
                stroke="#82ca9d" 
                name="수면 시간"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">📊 차트 해설</h4>
          <p className="text-gray-600 text-sm">
            • 최근 7일간의 수면 시간 변화를 보여줍니다.<br/>
            • 수면 시간이 7-9시간 사이를 유지하는 것이 좋습니다.<br/>
            • 급격한 변화가 있다면 수면 패턴을 점검해보세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">평균 수면 시간</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.averageSleepHours.toFixed(1)} <span className="text-base font-normal">시간</span></p>
          <p className="text-gray-500 mt-2">충분한 수면을 취하고 있나요?</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">수면 목표 달성률</h3>
          <p className="text-3xl font-bold text-blue-600">{achievementRate.toFixed(1)}<span className="text-base font-normal">%</span></p>
          <p className="text-gray-500 mt-2">권장 수면 시간(7-9시간) 달성 비율</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">수면 목표 달성 현황</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {gaugeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#82ca9d' : '#8884d8'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, '비율']}
              />
              <Legend 
                formatter={(value) => value === '달성' ? '목표 달성' : '미달성'} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">📊 차트 해설</h4>
          <p className="text-gray-600 text-sm">
            • 초록색: 권장 수면 시간(7-9시간) 달성<br/>
            • 보라색: 권장 수면 시간 미달성<br/>
            • 전체 기록 중 권장 수면 시간을 달성한 비율을 보여줍니다.<br/>
            • 수면 패턴을 개선하는 데 도움이 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
} 