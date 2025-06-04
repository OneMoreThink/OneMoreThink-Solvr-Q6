import { FastifyRequest, FastifyReply } from 'fastify';
import { AIService } from '../services/aiService';

const aiService = new AIService();

export async function analyzeSleepPattern(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;
    const analysis = await aiService.analyzeSleepPattern(userId);
    
    return reply.code(200).send({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('수면 패턴 분석 중 오류 발생:', error);
    return reply.code(500).send({
      success: false,
      error: '수면 패턴 분석에 실패했습니다.'
    });
  }
} 