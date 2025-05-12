import type { Access } from 'payload'

const notSent: Access = ({ req: { user } }) => {
  if (user) {
    return {
      createdBy: { equals: user?.id },
      isSent: { equals: 'Chưa gửi' },
    }
  }

  return false
}

export default notSent
