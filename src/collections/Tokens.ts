import type { CollectionConfig } from 'payload'
import admin from '@/access/admin'

export const Tokens: CollectionConfig = {
  labels: { plural: 'Token', singular: 'Token' },
  slug: 'tokens',
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
  },
  admin: {
    group: 'Zalo token',
    useAsTitle: 'id',
    defaultColumns: ['id'],
  },
  fields: [
    {
      name: 'token',
      type: 'text',
      required: true,
    },
  ],
}
