import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html'
import type { PayloadRequest } from 'payload'
import type { NodeTypes } from '@/collections/Posts/config'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<ContentWithMediaType>

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    contentWithMedia: ({ node }) => {
      const filename = node.fields?.filename
      return `<div class="content-with-media"><img src="${process.env.S3_API}${filename}" /></div>`
    },
  },
})

export const beforeChangeHook = async ({
  data,
  originalDoc,
  req,
}: {
  data: any
  originalDoc: any
  req: PayloadRequest
}) => {
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
}
