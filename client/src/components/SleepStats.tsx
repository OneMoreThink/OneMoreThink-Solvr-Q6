import React, { useEffect, useState } from 'react';
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
import { sleepService } from '../services/sleepService';
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';

interface SleepStats {
  totalRecords: number;
  averageSleepHours: number;
  last7Days: {
    date: string;
    sleepHours: number;
  }[];
}

interface SleepAnalysis {
  pattern: string;
  quality: number;
  advice: string[];
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

export const SleepStats: React.FC = () => {
  const [stats, setStats] = useState<SleepStats | null>(null);
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allRecords, setAllRecords] = useState<{ sleepHours: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 통계 데이터 먼저 가져오기
        const statsResponse = await sleepService.getSleepStats();
        setStats(statsResponse);
        
        // AI 분석은 선택적으로 처리
        try {
          const analysisResponse = await sleepService.getSleepAnalysis();
          setAnalysis(analysisResponse.data);
        } catch (analysisError) {
          console.warn('AI 분석을 불러오는데 실패했습니다:', analysisError);
          // AI 분석 실패는 전체 에러로 처리하지 않음
        }

        // 전체 기록 가져오기
        const resp = await fetch('/api/sleep-records');
        if (resp.ok) {
          const all = await resp.json();
          console.log('받은 데이터:', all);
          setAllRecords(all);
        }
        
        setError(null);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('데이터 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="text-center">
        {error}
      </Typography>
    );
  }

  if (!stats) {
    return null;
  }

  const achievementRate = calculateSleepGoalAchievement(allRecords);
  const gaugeData = createGaugeData(achievementRate);

  return (
    <div className="space-y-6">
      {/* 기존 통계 카드 */}
      <Card className="p-4">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            수면 통계
          </Typography>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Typography variant="h6">평균 수면 시간</Typography>
              <Typography variant="h4">{stats.averageSleepHours.toFixed(1)}시간</Typography>
            </div>
            <div>
              <Typography variant="h6">총 기록 수</Typography>
              <Typography variant="h4">{stats.totalRecords}일</Typography>
            </div>
          </div>
          <div className="h-64">
            <Typography variant="h6" className="mb-2">
              최근 7일 수면 시간
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sleepHours" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI 분석 결과 카드 - 분석 데이터가 있을 때만 표시 */}
      {analysis && (
        <Card className="p-4">
          <CardContent>
            <Typography variant="h5" className="mb-4">
              AI 수면 분석
            </Typography>

            <div className="mb-6">
              <Typography variant="h6" className="mb-2">
                수면 패턴
              </Typography>
              <Typography>{analysis.pattern}</Typography>
            </div>

            <div className="mb-6">
              <Typography variant="h6" className="mb-2">
                수면 품질 점수
              </Typography>
              <div className="flex items-center">
                <CircularProgress
                  variant="determinate"
                  value={analysis.quality}
                  size={60}
                  className="mr-4"
                />
                <Typography variant="h4">{analysis.quality}점</Typography>
              </div>
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                개선을 위한 조언
              </Typography>
              <List>
                {analysis.advice.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {index < analysis.advice.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8 p-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">나의 수면 통계</h2>
          <p className="text-gray-600">최근 30일간의 수면 기록을 바탕으로 한 통계와 차트입니다.</p>
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
    </div>
  );
}; 