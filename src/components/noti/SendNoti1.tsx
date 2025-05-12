'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import GetToken from '../zalo/GetToken'

export async function SendNoti1(content: string, send_to: string[], noti_id: string) {
  const payload = await getPayload({ config })
  const accessToken = await GetToken()

  const results = []

  if (accessToken) {
    for (const id of send_to) {
      try {
        const { zid } = await payload.findByID({
          collection: 'zusers',
          id,
        })

        const body = {
          recipient: {
            user_id: zid,
          },
          message: {
            text: content,
          },
        }

        const response = await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            access_token: accessToken,
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          const errorData = await response.json()
          results.push({ id, success: false, error: errorData })
        } else {
          const data = await response.json()
          results.push({ id, success: true, data })
        }
      } catch (error) {
        results.push({ id, success: false, error })
      }
    }
  }

  const successCount = results.filter((result) => result.success).length
  await payload.update({
    collection: 'notifications', // required
    id: noti_id, // required
    data: {
      isSent: 'Đã gửi thành công ' + successCount + '/' + results.length,
    },
  })

  return results
}
