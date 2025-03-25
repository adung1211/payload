import type { CollectionConfig } from 'payload'
import richText from '@/fields/richText'
import { beforeChangeHook } from './hook'

import {
  BlocksFeature,
  type DefaultNodeTypes,
  lexicalEditor,
  lexicalHTMLField,
  type SerializedBlockNode,
  type SerializedInlineBlockNode,
  LinkFeature,
  UploadFeature,
  FixedToolbarFeature,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical'

import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html'
import { ContentWithMedia } from '@/blocks/contentWithMedia'
import type { ContentWithMedia as ContentWithMediaType } from '@/payload-types'

export const Posts: CollectionConfig = {
  slug: 'Posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'richText'],
  },
  fields: [
    {
      name: 'thumbnail', // required
      label: 'Thumbnail',
      type: 'upload', // required
      relationTo: 'media', // required
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
  ],
  hooks: {
    beforeChange: [beforeChangeHook],
  },
}
