'use server'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function GetToken(): Promise<string> {
  const payload = await getPayload({ config })
  const token = await payload.find({
    collection: 'tokens',
  })

  const secretKey = process.env.ZALO_SECRET_KEY as string
  const refreshToken = token.docs[0].token
  const appId = process.env.ZALO_APP_ID as string

  const url = 'https://oauth.zaloapp.com/v4/oa/access_token'

  const body = new URLSearchParams()
  body.append('refresh_token', refreshToken)
  body.append('app_id', appId)
  body.append('grant_type', 'refresh_token')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        secret_key: secretKey,
      },
      body: body.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${data.error || 'Unknown error'}`)
    }

    await payload.update({
      collection: 'tokens', // required
      id: token.docs[0].id, // required
      data: {
        token: data.refresh_token,
      },
    })

    return data.access_token
  } catch (error) {
    throw new Error(`Error fetching access token: ${(error as Error).message}`)
  }
}
