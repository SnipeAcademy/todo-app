import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components'
import { DashboardPage, CalendarPage, CompletedPage } from './pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="completed" element={<CompletedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
