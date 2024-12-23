import type { CollectionConfig } from 'payload'

const Comments: CollectionConfig = {
  slug: 'comments',
  fields: [
    {
      name: 'content',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
  ],
}

export default Comments
