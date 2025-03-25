import { Block } from 'payload'
import {
  BlocksFeature,
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
} from '@payloadcms/richtext-lexical'

export const ContentWithMedia: Block = {
  slug: 'contentWithMedia',
  interfaceName: 'ContentWithMedia',
  labels: {
    singular: 'Content with Media Block',
    plural: 'Content with Media Blocks',
  },
  fields: [
    {
      type: 'upload',
      name: 'image',
      relationTo: 'media',
    },
    {
      type: 'text',
      name: 'filename',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      type: 'text',
      name: 'url',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
}
