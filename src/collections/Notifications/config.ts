import type { CollectionConfig } from 'payload'

import isCreaterOrAdmin from '@/access/isCreaterOrAdmin'
import notSent from './access'

export const Notifications: CollectionConfig = {
  labels: { plural: 'Gửi thông báo', singular: 'Gửi thông báo' },
  slug: 'notifications',
  admin: {
    group: 'Quản lý tài khoản',
    useAsTitle: 'title',
    defaultColumns: ['title', 'createdAt', 'isSent', 'createdBy'],
  },
  access: {
    create: ({ req: { user } }) => {
      return Boolean(user)
    },
    read: isCreaterOrAdmin,
    update: () => {
      return false
    },
    delete: isCreaterOrAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'text',
      required: true,
    },
    {
      name: 'send_to',
      label: 'Danh sách người nhận',
      type: 'relationship',
      relationTo: 'zusers',
      hasMany: true,
      required: true,
    },
    {
      name: 'createdBy',
      label: 'Người tạo',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'isSent',
      type: 'text',
      label: 'Tình trạng gửi',
      defaultValue: 'Chưa gửi',
      access: {
        create: () => {
          return false
        },
        update: () => {
          return false
        },
      },
      // admin: { hidden: true },
    },
    {
      name: 'action',
      type: 'ui',
      admin: {
        // position: 'sidebar',
        components: {
          Field: 'src/components/noti/CustomServerButton',
        },
        condition: (data, siblingData, { blockData, path, user }) => {
          if (data.isSent == 'Chưa gửi' && data.id) {
            return true
          } else {
            return false
          }
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req: { user } }) => {
        if (user) {
          data.createdBy = user.email
        }
      },
    ],
  },
}
