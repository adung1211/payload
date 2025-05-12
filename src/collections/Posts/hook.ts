import type { ContentWithMedia as ContentWithMediaType } from '@/payload-types'
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
    data.createdBy = req.user.id
  }

  return data
}
