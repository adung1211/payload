import { redirect } from 'next/navigation'

export default function Home() {
  // Get the base URL dynamically (works for localhost, staging, or production)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006'
  // Redirect to [URL]/admin
  redirect(`${baseUrl}/admin`)
}
