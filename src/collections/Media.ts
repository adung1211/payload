import type { CollectionConfig } from 'payload'
import isCreaterOrAdmin from '@/access/isCreaterOrAdmin'

export const Media: CollectionConfig = {
  labels: { plural: 'Hình ảnh', singular: 'Hình ảnh' },
  slug: 'media',
  access: {
    read: isCreaterOrAdmin,
    create: isCreaterOrAdmin,
    update: isCreaterOrAdmin,
    delete: isCreaterOrAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Chú thích',
      required: true,
    },
    {
      name: 'createdBy',
      label: 'Người tạo',
      type: 'text',
      admin: { hidden: true },
    },
  ],
  admin: {
    group: 'Quản lý bài viết',
    defaultColumns: ['filename', 'createdAt', 'createdBy'],
    // hidden: ({ user }) => Boolean(user?.roles.includes('admin')) === false,
  },
  upload: true,
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
