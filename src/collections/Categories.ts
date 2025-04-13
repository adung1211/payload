import type { CollectionConfig } from 'payload'
import admin from './Users/access/admin'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: admin,
    create: admin,
    update: admin,
    delete: admin,
  },
  admin: {
    useAsTitle: 'name',
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
