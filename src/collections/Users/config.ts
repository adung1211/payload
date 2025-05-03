import type { CollectionConfig } from 'payload'
import { protectRoles } from '@/collections/Users/hooks/protectRoles'
import admin from '@/access/admin'
import isUserAccount from '@/access/isUserAccount'

export const Users: CollectionConfig = {
  labels: { plural: 'Tài khoản', singular: 'Tài khoản' },
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => Boolean(user?.roles.includes('admin')) === false,
  },
  auth: true,
  access: {
    create: admin,
    read: isUserAccount,
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
