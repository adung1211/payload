import type { Access } from 'payload'

const isCreaterOrAdmin: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) {
    return true
  }

  return {
    createdBy: { equals: user?.id },
  }
}

export default isCreaterOrAdmin
