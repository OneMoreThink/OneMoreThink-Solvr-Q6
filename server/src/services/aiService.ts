import { GoogleGenerativeAI } from '@google/generative-ai';
import { sleepRecords } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../db';

// Google AI Studio API 키 설정
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface SleepAnalysis {
  pattern: string;
  quality: number;
  advice: string[];
}

export class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async analyzeSleepPattern(userId: string): Promise<SleepAnalysis> {
    try {
      // 최근 30일간의 수면 기록 조회
      const records = await db
        .select()
        .from(sleepRecords)
        .where(eq(sleepRecords.userId, userId))
        .orderBy(sleepRecords.date)
        .limit(30);

      if (records.length === 0) {
        throw new Error('수면 기록이 없습니다.');
      }

      // 수면 데이터 분석을 위한 프롬프트 생성
      const prompt = this.createAnalysisPrompt(records);

      // AI 모델에 분석 요청
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = this.parseAIResponse(response.text());

      return analysis;
    } catch (error) {
      console.error('수면 패턴 분석 중 오류 발생:', error);
      throw new Error('수면 패턴 분석에 실패했습니다.');
    }
  }

  private createAnalysisPrompt(records: any[]): string {
    const sleepData = records.map(record => ({
      date: record.date,
      hours: record.sleepHours,
      notes: record.notes
    }));

    return `
당신은 수면 전문가입니다. 다음 수면 데이터를 분석하고 조언을 제공해주세요:

수면 기록:
${JSON.stringify(sleepData, null, 2)}

다음 형식으로 분석 결과를 제공해주세요:
1. 수면 패턴 분석 (불규칙한 수면, 수면 부족, 과다 수면 등)
2. 수면 품질 점수 (0-100)
3. 개선을 위한 구체적인 조언 3가지

JSON 형식으로 응답해주세요:
{
  "pattern": "수면 패턴 분석 결과",
  "quality": 수면 품질 점수,
  "advice": ["조언1", "조언2", "조언3"]
}
`;
  }

  private parseAIResponse(response: string): SleepAnalysis {
    try {
      // JSON 응답 파싱
      const analysis = JSON.parse(response);
      return {
        pattern: analysis.pattern,
        quality: analysis.quality,
        advice: analysis.advice
      };
    } catch (error) {
      console.error('AI 응답 파싱 중 오류 발생:', error);
      throw new Error('AI 응답을 처리하는 중 오류가 발생했습니다.');
    }
  }
} 