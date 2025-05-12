import { redirect } from 'next/navigation'

export default function Home() {
  // Get the base URL dynamically (works for localhost, staging, or production)
  // Redirect to [URL]/admin
  redirect(`/admin`)
}
