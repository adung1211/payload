import type { ContentWithMedia } from '@/payload-types'
import type { CollectionConfig } from 'payload'
import richText from '@/fields/richText'

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

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<ContentWithMedia>

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    contentWithMedia: ({node})  => {
      // Check if image is an object (Media) and access properties safely
      console.log('node:', node.fields?.image);
      const url = node.fields?.url;
      const filename =  node.fields?.filename;
      return `<div class="content-with-media"><img src="${url}" alt="${filename}" /></div>`;
    },
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
            blocks: [
              {
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
                    type:'text',
                    name: 'filename',
                    admin: {
                      readOnly: true,
                    },
                  },
                  {
                    type: 'text',
                    name: 'url',
                    admin: {
                      readOnly: true,
                    },
                  }
                ],
              }
            ],
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
      async ({ data, originalDoc, req }) => {
        console.log('hehehehehe:');
        console.log('heeeee:');
        for (const block of data.richText.root.children) {
          console.log('iioooe:');
          if (block.type === 'block' && block.fields?.image) {
            console.log('jtrktrkeee:');
            try {
              const mediaDoc = await req.payload.findByID({
                collection: 'media',
                id: block.fields.image,
              });
              console.log('mediaDoc:', mediaDoc);
              if (mediaDoc) {
                const imageFilename = mediaDoc.filename;
                const imageUrl = mediaDoc.url;
                console.log('imageFilename:', imageFilename);
                console.log('imageUrl:', imageUrl);
                block.fields.filename = imageFilename;
                block.fields.url = imageUrl;
              }
            } catch (error) {
              console.error('Error fetching media:', error);
            }
          }
        }
        if (data.richText !== originalDoc.richText) {
          console.log('yyyyyye:');
          const html = convertLexicalToHTML({ converters: htmlConverters, data: data.richText });
          data.content = html;
          
        }
        return data;
      },
    ],
  },
}
