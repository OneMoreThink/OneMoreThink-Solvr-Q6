import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import UsersPage from './routes/UsersPage'
import UserDetailPage from './routes/UserDetailPage'
import CreateUserPage from './routes/CreateUserPage'
import EditUserPage from './routes/EditUserPage'
import NotFoundPage from './routes/NotFoundPage'
import { useState, useCallback } from 'react'
import { SleepRecordList } from './components/SleepRecordList'
import { SleepRecordForm } from './components/SleepRecordForm'
import { SleepRecord } from './types/sleepRecord'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [editRecord, setEditRecord] = useState<SleepRecord | null>(null)

  const handleSuccess = useCallback((updatedRecord?: SleepRecord) => {
    if (updatedRecord) {
      // 수정된 기록이 있으면 해당 기록만 업데이트
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
    // 수정된 기록만 업데이트
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={
          <div className="container mx-auto max-w-md px-2 py-6">
            <h1 className="text-3xl font-bold text-center mb-6">잘자요 당근</h1>
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
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path="new" element={<CreateUserPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/edit" element={<EditUserPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
