import type { CollectionConfig } from 'payload'
import { protectRoles } from '@/collections/Users/hooks/protectRoles'
import admin from '@/collections/Users/access/admin'
import user from '@/collections/Users/access/user'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => (user as any).roles.includes('user'),
  },
  auth: true,
  access: {
    create: admin,
    read: user,
    update: admin,
    delete: admin,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      hooks: {
        beforeChange: [protectRoles],
      },
    },
    // Email added by default
    // Add more fields as needed
  ],
}
