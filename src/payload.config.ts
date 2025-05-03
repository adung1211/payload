// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users/config'
import { Posts } from './collections/Posts/config'
import { Temps } from './collections/Temps'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Notifications } from './collections/Notifications/config'
import { ZUsers } from './collections/ZUser/config'
import { auth } from 'node_modules/payload/dist/auth/operations/auth'
import { vi } from '@payloadcms/translations/languages/vi'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        createAccount: {
          Component: 'src/components/user/CreateAccount',
          path: '/create-account',
        },
      },
    },
  },
  i18n: {
    fallbackLanguage: 'vi',
    supportedLanguages: { vi },
  },
  collections: [Users, Posts, Temps, Media, Categories, Tags, Notifications, ZUsers],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    transactionOptions: false,
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET || '',
        },
        region: 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
      },
    }),
  ],
})
