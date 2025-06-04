import { useEffect, useState } from 'react'
import { type SleepRecord } from '../types/sleepRecord'
import { sleepRecordService } from '../services/sleepRecordService'

interface SleepRecordListProps {
  onEdit?: (record: SleepRecord) => void
  editingRecordId?: number | null
  onRecordUpdate?: (updatedRecord: SleepRecord) => void
}

export function SleepRecordList({ onEdit, editingRecordId, onRecordUpdate }: SleepRecordListProps) {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      setLoading(true)
      const data = await sleepRecordService.getAllSleepRecords()
      setRecords(data)
      setError(null)
    } catch (err) {
      setError('수면 기록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      try {
        await sleepRecordService.deleteSleepRecord(id)
        setRecords(prevRecords => prevRecords.filter(record => record.id !== id))
      } catch (err) {
        setError('수면 기록을 삭제하는데 실패했습니다.')
      }
    }
  }

  const handleEdit = (record: SleepRecord) => {
    if (onEdit) {
      onEdit({ ...record })
    }
  }

  const updateRecord = (updatedRecord: SleepRecord) => {
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    )
    if (onRecordUpdate) {
      onRecordUpdate(updatedRecord)
    }
  }

  if (loading) {
    return <div className="text-center py-4">로딩 중...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-primary-700">수면 기록</h2>
      {records.length === 0 ? (
        <p className="text-gray-500 text-center">아직 수면 기록이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div
              key={record.id}
              className={`bg-white p-4 rounded-lg shadow-sm transition-all ${
                record.id === editingRecordId
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-semibold text-primary-900">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    수면 시간: {record.sleepHours}시간
                  </p>
                  {record.notes && (
                    <p className="text-gray-600 mt-2">특이사항: {record.notes}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => handleEdit(record)}
                    className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                      record.id === editingRecordId
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-primary-600 hover:text-primary-700 border border-primary-200 bg-primary-50'
                    }`}
                  >
                    {record.id === editingRecordId ? '수정 중...' : '수정'}
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-sm px-3 py-1.5 rounded-md text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 