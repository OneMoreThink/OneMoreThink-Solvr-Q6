import { Routes, Route } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { SleepRecordList } from './components/SleepRecordList'
import { SleepRecordForm } from './components/SleepRecordForm'
import { SleepRecord } from './types/sleepRecord'
import Navigation from './components/Navigation'
import SleepStats from './components/SleepStats'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [editRecord, setEditRecord] = useState<SleepRecord | null>(null)

  const handleSuccess = useCallback((updatedRecord?: SleepRecord) => {
    if (updatedRecord) {
      setRefreshKey(prev => prev + 1)
    }
    setEditRecord(null)
  }, [])

  const handleEdit = useCallback((record: SleepRecord) => {
    setEditRecord({ ...record })
  }, [])

  const handleCancel = useCallback(() => {
    setEditRecord(null)
  }, [])

  const handleRecordUpdate = useCallback((updatedRecord: SleepRecord) => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto max-w-md px-2 py-6">
              <div className="space-y-6">
                <SleepRecordForm 
                  onSuccess={handleSuccess} 
                  record={editRecord} 
                  onCancel={handleCancel} 
                />
                <SleepRecordList 
                  key={refreshKey} 
                  onEdit={handleEdit} 
                  editingRecordId={editRecord?.id}
                  onRecordUpdate={handleRecordUpdate}
                />
              </div>
            </div>
          } />
          <Route path="/stats" element={<SleepStats />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
