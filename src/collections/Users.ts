import type { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'username',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'followers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'following',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}

export default Users
