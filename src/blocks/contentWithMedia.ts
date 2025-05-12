import { Block } from 'payload'

export const ContentWithMedia: Block = {
  slug: 'contentWithMedia',
  interfaceName: 'ContentWithMedia',
  labels: {
    singular: 'Thêm hình ảnh',
    plural: 'Thêm hình ảnh',
  },
  fields: [
    {
      type: 'upload',
      name: 'image',
      label: 'Chọn hình ảnh',
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
