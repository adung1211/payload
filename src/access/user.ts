import type { Access } from 'payload'

const user: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }
  return false
}

export default user
