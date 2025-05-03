import type { Access } from 'payload'

const notSent: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) {
    return true
  }

  return {
    createdBy: { equals: user?.id },
    isSent: { equals: 'Chưa gửi' },
  }
}

export default notSent
