import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { sleepService } from '../services/sleepService';

interface SleepAnalysis {
  pattern: string;
  quality: number;
  advice: string[];
}

export const SleepAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await sleepService.getSleepAnalysis();
        setAnalysis(response.data);
        setError(null);
      } catch (err) {
        setError('수면 분석을 불러오는데 실패했습니다.');
        console.error('수면 분석 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-48">
          <CircularProgress />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <Typography color="error" className="text-center">
          {error}
        </Typography>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
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
  );
}; 