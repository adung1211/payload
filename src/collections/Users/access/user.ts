import type { Access } from 'payload'
import { User } from '@/payload-types'

const user: Access = ({ req: { user } }) => {
  if (user?.collection === 'users') {
    if (user?.roles?.includes('admin')) {
      return true
    }

    return {
      id: { equals: user.id },
    }
  }

  return false
}

export default user
