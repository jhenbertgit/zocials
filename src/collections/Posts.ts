import { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'caption',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      required: true,
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'comments',
      type: 'relationship',
      relationTo: 'comments',
      hasMany: true,
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'hashtags',
      type: 'array',
      label: 'Hashtags',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Add hashtags for your post (without the # symbol)',
      },
    },
  ],
}

export default Posts
