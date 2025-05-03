'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function SendNoti2(userId: string) {
  const accessToken =
    'bF_W71M-q06I-k4O4BpL3PNsunGCl8LMxhd1J13xcW6Iwwi0GE7IUutKcGO3vDf5XCwJCLtrvt3IvQau8DITGExBw3KjqQeew9lFNYYujoloizTYDFA0EAxw-4PfnBHRvzpNCZB2hd_8-Cn-1RsP4u2j-bfdZ9qGlOlrSKQmlMt1eOevEBVnGUUAlXquolnezj390m2NZ5RUWViD7B-WMzcxaIu7iTPt-uIbTdN1d0kavDP9OD2j18VGb65QvTu2ek7iTqFok3h5plLYAucs2CEGpcX6qQe6izMJHMtTvYgsneqrKTRcVT-JlJKCZf5DqOtVAY68ZYldpEfm1VAu1Dldz48fuAejviZdNZtfq2U-mkDISVBR6F78dmCyW_Ldqf2GAHM4rr7xeUCB7Eg04EZgisq-xuGuKBTo0ImNezK6'

  const payload = {
    recipient: {
      user_id: '2539805396614680484',
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'promotion',
          elements: [
            {
              image_url: 'https://i.imgur.com/4CVmNSg.png',
              type: 'banner',
            },
            {
              type: 'header',
              content: 'Đây là tiêu đề',
            },
            {
              type: 'text',
              align: 'left',
              content: 'Xin chào, đây là tin nhắn gửi từ payload cms',
            },
          ],
        },
      },
    },
  }

  try {
    const response = await fetch('https://openapi.zalo.me/v3.0/oa/message/promotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: accessToken,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}
