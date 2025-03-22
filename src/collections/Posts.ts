import type { MyInlineBlock, MyTextBlock } from '@/payload-types'
import type { CollectionConfig } from 'payload'
import richText from '@/fields/richText'
import { ContentWithMedia } from '@/blocks/contentWithMedia'

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
import React from 'react'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MyTextBlock>
  | SerializedInlineBlockNode<MyInlineBlock>

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    dungDepTrai: ({ node, providedCSSString }) => `<img src="./img.png>`,
    UploadFeature: ({ node, providedCSSString }) => `<img src="./img.png>`,
  },
})

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'richText'],
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    // {
    //   name: 'backgroundImage', // required
    //   type: 'upload', // required
    //   relationTo: 'media', // required
    //   required: true,
    // },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures, rootFeatures }) => [
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
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data.richText !== originalDoc.richText) {
          const html = convertLexicalToHTML({ converters: htmlConverters, data: data.richText })
          data.content = html
        }
        return data
      },
    ],
  },
}
