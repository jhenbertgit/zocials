import path from 'path'
import { fileURLToPath } from 'url'
import Users from './collections/Users'
import Media from './collections/Media'
import Posts from './collections/Posts'
import Comments from './collections/Comments'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Posts, Comments],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, adjust as needed
    },
  },
  secret: process.env.PAYLOAD_SECRET || '',
})
