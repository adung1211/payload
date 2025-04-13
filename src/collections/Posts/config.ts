import type { CollectionConfig } from 'payload'
import { beforeChangeHook } from './hook'

import {
  BlocksFeature,
  lexicalEditor,
  UploadFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'

import { ContentWithMedia } from '@/blocks/contentWithMedia'
import { on } from 'events'
import isCreaterOrAdmin from './access/isCreaterOrAdmin'

export const Posts: CollectionConfig = {
  slug: 'Posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'richText'],
  },
  access: {
    create: ({ req: { user } }) => {
      return Boolean(user)
    },
    read: isCreaterOrAdmin,
    update: isCreaterOrAdmin,
    delete: isCreaterOrAdmin,
  },
  fields: [
    {
      name: 'thumbnail', // required
      label: 'Thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature(),
          BlocksFeature({
            blocks: [ContentWithMedia],
          }),
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: 'content',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'thumbnail_url',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'createdBy',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Anh Dũng',
    },
    {
      name: 'view',
      type: 'number',
      defaultValue: 0,
      admin: { hidden: true },
    },
    {
      name: 'like',
      type: 'number',
      defaultValue: 0,
      admin: { hidden: true },
    },
    {
      name: 'comment',
      type: 'number',
      defaultValue: 0,
      admin: { hidden: true },
    },
    {
      name: 'payload_tags',
      label: 'Tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'payload_categories',
      label: 'Categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
  hooks: {
    beforeChange: [beforeChangeHook],
  },
}
