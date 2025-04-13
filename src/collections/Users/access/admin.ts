import type { Access } from 'payload'

const admin: Access = ({ req: { user } }) => {
  if (user) {
    if (user?.roles?.includes('admin')) {
      return true
    }
  }

  return false
}

export default admin
