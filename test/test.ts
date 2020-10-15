import BackenderClient, { Schema } from '../src/index'

export type User = {
  id: string
  firstName: string
  lastName: string
  isStaff: boolean
}

type Models = {
  users: User
}

const schema: Schema<Models> = {
  id: '',
  models: {
    users: {
      id: '',
      fields: {
        id: {
          id: '',
        },
        firstName: {
          id: '',
        },
        lastName: {
          id: '',
        },
        isStaff: {
          id: '',
        },
      },
    },
  },
}

const Client = (options: { clientId: string }) =>
  BackenderClient({ schema, ...options })
const client = Client({ clientId: '' })
const test = async () => {
  const users = await client.users.all()
  const user = await client.users.update({
    id: '',
    firstName: 'Brad',
    lastName: 'Hilton',
  })
}
