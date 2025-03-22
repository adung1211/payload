import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html'
import type { CollectionConfig } from 'payload'
import { ContentWithMedia } from '@/blocks/contentWithMedia'

import {
  BlocksFeature,
  type DefaultNodeTypes,
  lexicalEditor,
  lexicalHTMLField,
  type SerializedBlockNode,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

type NodeTypes = DefaultNodeTypes

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
})

export const Temps: CollectionConfig = {
  slug: 'temps',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'richText',
      name: 'content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, UploadFeature()],
      }),
    },
    {
      name: 'html',
      type: 'text',
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data.content !== originalDoc.content) {
          const html = convertLexicalToHTML({ converters: htmlConverters, data: data.content })
          data.html = html
        }
        return data
      },
    ],
  },
}
