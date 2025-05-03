'use client'

import { Button } from '@payloadcms/ui'
import { useState } from 'react'
import { SendNoti1 } from './SendNoti1'

interface AButtonProps {
  content: string
  noti_id: string
  send_to: string[]
}

export function AButton({ content, send_to, noti_id }: AButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState<any[]>([]) // Adjust the type as needed

  const handleAction = async () => {
    const response = await SendNoti1(content, send_to, noti_id)
    setResults(response)
    setShowConfirm(false)
    setShowResult(true)
  }

  return (
    <div>
      <Button onClick={() => setShowConfirm(true)}>Gửi thông báo</Button>

      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <p>Hãy lưu các thông tin trước khi gửi thông báo, xác nhận gửi ?</p>
            <div className="popup-actions">
              <button onClick={() => setShowConfirm(false)}>Quay trở lại</button>
              <button onClick={handleAction}>Gửi</button>
            </div>
          </div>
        </div>
      )}

      {showResult && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <p>
              Đã gửi thành công{' '}
              <b>
                {results.filter((result) => result.success).length}/{results.length}
              </b>{' '}
              tin nhắn
            </p>
            <div className="popup-actions">
              <button onClick={() => setShowResult(false)}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
