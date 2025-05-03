import type { CollectionConfig } from 'payload'

import isCreaterOrAdmin from '@/access/isCreaterOrAdmin'
import admin from '@/access/admin'
import user from '@/access/user'

export const ZUsers: CollectionConfig = {
  labels: { plural: 'Người dùng Zalo', singular: 'Người dùng Zalo' },
  slug: 'zusers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'zid'],
  },
  access: {
    create: admin,
    read: user,
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên người dùng',
      required: true,
    },
    {
      name: 'zid',
      type: 'text',
      label: 'Zalo ID',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Khu vực',
      required: true,
    },
  ],
}
