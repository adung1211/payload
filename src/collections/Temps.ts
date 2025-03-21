import type { HTMLConvertersFunction } from '@payloadcms/richtext-lexical/html'
import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  type DefaultNodeTypes,
  lexicalEditor,
  lexicalHTMLField,
  type SerializedBlockNode,
} from '@payloadcms/richtext-lexical'

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
      name: 'content',
      label: 'Content',
      type: 'text',
    },
    // {
    //   name: 'customRichText',
    //   type: 'richText',
    //   editor: lexicalEditor({
    //     features: ({ defaultFeatures }) => [
    //       ...defaultFeatures,
    //       BlocksFeature({
    //         blocks: [
    //           {
    //             interfaceName: 'MyTextBlock',
    //             slug: 'myTextBlock',
    //             fields: [
    //               {
    //                 name: 'text',
    //                 type: 'text',
    //               },
    //             ],
    //           },
    //         ],
    //       }),
    //     ],
    //   }),
    // },
    // lexicalHTMLField({
    //   htmlFieldName: 'customRichText_html',
    //   lexicalFieldName: 'customRichText',
    //   // can pass in additional converters or override default ones
    //   converters: (({ defaultConverters }) => ({
    //     ...defaultConverters,
    //     blocks: {
    //       myTextBlock: ({ node, providedCSSString }) =>
    //         `<div style="background-color: red;${providedCSSString}">${node.fields.text}</div>`,
    //     },
    //   })) as HTMLConvertersFunction<DefaultNodeTypes | SerializedBlockNode<MyTextBlock>>,
    // }),
  ],
}
