import { useState, useEffect } from 'react'
import { type SleepRecord } from '../types'
import { sleepRecordService } from '../services/sleepRecordService'

interface SleepRecordFormProps {
  record?: SleepRecord
  onSuccess: (updatedRecord?: SleepRecord) => void
  onCancel?: () => void
}

export const SleepRecordForm = ({
  record,
  onSuccess,
  onCancel
}: SleepRecordFormProps) => {
  const [date, setDate] = useState(record?.date || '')
  const [sleepHours, setSleepHours] = useState(record?.sleepHours || '')
  const [notes, setNotes] = useState(record?.notes || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (record) {
      setDate(record.date)
      setSleepHours(record.sleepHours)
      setNotes(record.notes || '')
    }
  }, [record])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      let updatedRecord: SleepRecord | undefined

      if (record) {
        updatedRecord = await sleepRecordService.updateSleepRecord(record.id, {
          date,
          sleepHours: Number(sleepHours),
          notes
        })
      } else {
        updatedRecord = await sleepRecordService.createSleepRecord({
          date,
          sleepHours: Number(sleepHours),
          notes
        })
      }

      setSuccess(record ? '수면 기록이 수정되었습니다.' : '수면 기록이 추가되었습니다.')
      onSuccess(updatedRecord)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('수면 기록 저장 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="relative">
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-primary-700">
          {record ? '수면 기록 수정' : '수면 기록 추가'}
        </h2>
        {error && <div className="text-red-500 p-3 bg-red-50 rounded-md">{error}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              날짜
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700 mb-2">
              수면 시간 (시간)
            </label>
            <input
              type="number"
              id="sleepHours"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              step="0.5"
              min="0"
              max="24"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              특이사항
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary-500 text-white py-2.5 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            {record ? '수정' : '저장'}
          </button>
          {record && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 