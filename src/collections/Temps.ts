import type { CollectionConfig } from 'payload'

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

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<ContentWithMediaType>

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    contentWithMedia: ({ node }) => {
      // Check if image is an object (Media) and access properties safely
      console.log('node:', node.fields?.image)
      const filename = node.fields?.filename
      // const filename =  node.fields?.filename;
      return `<div class="content-with-media"><img src="${process.env.S3_API}${filename}" /></div>`
    },
  },
})

export const Temps: CollectionConfig = {
  slug: 'temps',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'richText'],
    hidden: true,
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
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (data.richText?.root?.children?.length) {
          for (const block of data.richText.root.children) {
            if (block.type === 'block' && block.fields?.image) {
              try {
                const mediaDoc = await req.payload.findByID({
                  collection: 'media',
                  id: block.fields.image,
                })
                if (mediaDoc) {
                  const imageFilename = mediaDoc.filename
                  const imageUrl = mediaDoc.url
                  block.fields.filename = imageFilename
                  block.fields.url = imageUrl
                }
              } catch (error) {
                console.error('Error fetching media:', error)
              }
            }
          }
        }
        if (data.richText !== originalDoc.richText) {
          const html = convertLexicalToHTML({ converters: htmlConverters, data: data.richText })
          data.content = html
        }

        if (data.thumbnail?.length) {
          try {
            const mediaDoc = await req.payload.findByID({
              collection: 'media',
              id: data.thumbnail,
            })
            if (mediaDoc) {
              const imageFilename = mediaDoc.filename
              data.thumbnail_url = `${process.env.S3_API}${imageFilename}`
            }
          } catch (error) {
            console.error('Error fetching media thumbnail:', error)
          }
        }
        return data
      },
    ],
  },
}
