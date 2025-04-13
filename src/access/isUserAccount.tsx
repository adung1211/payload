import type { Access } from 'payload'

const isUserAccount: Access = ({ req: { user } }) => {
  if (user) {
    if (user?.roles?.includes('admin')) {
      return true
    }

    return {
      id: { equals: user.id },
    }
  }
  return false
}

export default isUserAccount
