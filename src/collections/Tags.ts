import type { CollectionConfig } from 'payload'
import admin from '@/access/admin'
import user from '@/access/user'

export const Tags: CollectionConfig = {
  labels: { plural: 'Chủ đề', singular: 'Chủ đề' },
  slug: 'tags',
  access: {
    read: user,
    create: admin,
    update: admin,
    delete: admin,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
    hidden: ({ user }) => Boolean(user?.roles.includes('admin')) === false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}
