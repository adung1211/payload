'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function SendNoti1(content: string, send_to: string[], noti_id: string) {
  console.log(noti_id)
  const payload = await getPayload({ config })

  const accessToken =
    '4cOV4dZOTHGKOnuMVTfm61Dl71fXeHHOVtiO0rQH24L7PZ4QATe-R3WJB1KCooDoDpu01bx-7aTMB3OrQy82Hbig449Mu3mdHY5HPr7eMs5R12rdCBu06mXHD4CTfJK245mfKIYQ63y38JTN5UOQM3mSAHKlerzK949rBHofNMnmNdKQJ-1nV5SdOonnw6uk7XD3S1giRNSETW0Q19e1PMbFDpPQb1bUN2ioEtUGBJHyQZDrJgmiUr17BXLZk1f01rToG1ZhN3aq9tT7M9n51sX_CsDZX1qN2dCGLnMLVpe_QXGw0SeQVMi4D3fLwonFNXmy7K3o54TTInqWKfy2P6HL0J9Ph1H0Ptug3LZ65GnJ61nKKEqA0cGkA6KLnJO47te02ZM25WywR0Hf0uzjEof8KquqKaTSZLitUiLm4m'

  const results = []

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
