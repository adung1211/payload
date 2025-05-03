import type { CollectionConfig } from 'payload'
import admin from '@/access/admin'
import user from '@/access/user'
import { create } from 'domain'

export const Categories: CollectionConfig = {
  labels: { plural: 'Chuyên mục', singular: 'Chuyên mục' },
  slug: 'categories',
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
