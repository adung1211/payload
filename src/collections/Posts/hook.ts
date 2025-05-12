import { CollectionBeforeChangeHook } from 'payload'

import { getPayload } from 'payload'
import config from '@payload-config'

import { type DefaultNodeTypes } from '@payloadcms/richtext-lexical'

import {
  convertLexicalToHTMLAsync,
  type HTMLConvertersFunctionAsync,
} from '@payloadcms/richtext-lexical/html-async'

const htmlConverters: HTMLConvertersFunctionAsync<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: async ({ node, providedStyleTag }) => {
    console.log(node)
    const payload = await getPayload({ config })
    const mediaDoc = await payload.findByID({
      collection: 'media',
      id: node.value as string,
    })
    return `<figure style="text-align: center;"> <img src="${process.env.S3_API}${mediaDoc.filename}"/><figcaption>${mediaDoc.alt}</figcaption></figure>`
  },
})

export const beforeChangeHook: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  if (data.richText !== originalDoc.richText) {
    const html = await convertLexicalToHTMLAsync({
      converters: htmlConverters,
      data: data.richText,
    })
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

  if (req.user?.id) {
    data.createdBy = req.user.email
  }

  return data
}

// import type { ContentWithMedia as ContentWithMediaType } from '@/payload-types'
// import { CollectionBeforeChangeHook } from 'payload'

// import {
//   type DefaultNodeTypes,
//   type SerializedBlockNode,
//   type SerializedLinkNode,
// } from '@payloadcms/richtext-lexical'

// import {
//   convertLexicalToHTML,
//   type HTMLConvertersFunction,
// } from '@payloadcms/richtext-lexical/html'
// import type { PayloadRequest } from 'payload'

// type NodeTypes = DefaultNodeTypes | SerializedBlockNode<ContentWithMediaType> | SerializedLinkNode

// const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
//   ...defaultConverters,
//   LinkHTMLConverter: ({ node }): string => {
//     return 'Dung dep trai'
//   },
//   blocks: {
//     contentWithMedia: ({ node }) => {
//       const filename = node.fields?.filename
//       return `<div class="content-with-media"><img src="${process.env.S3_API}${filename}" /></div>`
//     },
//   },
// })

// export const beforeChangeHook: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
//   if (data.richText?.root?.children?.length) {
//     for (const block of data.richText.root.children) {
//       if (block.type === 'block' && block.fields?.image) {
//         try {
//           const mediaDoc = await req.payload.findByID({
//             collection: 'media',
//             id: block.fields.image,
//           })
//           if (mediaDoc) {
//             const imageFilename = mediaDoc.filename
//             const imageUrl = mediaDoc.url
//             block.fields.filename = imageFilename
//             block.fields.url = imageUrl
//           }
//         } catch (error) {
//           console.error('Error fetching media:', error)
//         }
//       }
//     }
//   }

//   if (data.richText !== originalDoc.richText) {
//     const html = convertLexicalToHTML({ converters: htmlConverters, data: data.richText })
//     data.content = html
//   }

//   if (data.thumbnail?.length) {
//     try {
//       const mediaDoc = await req.payload.findByID({
//         collection: 'media',
//         id: data.thumbnail,
//       })
//       if (mediaDoc) {
//         const imageFilename = mediaDoc.filename
//         data.thumbnail_url = `${process.env.S3_API}${imageFilename}`
//       }
//     } catch (error) {
//       console.error('Error fetching media thumbnail:', error)
//     }
//   }

//   if (req.user?.id) {
//     data.createdBy = req.user.id
//   }

//   return data
// }
