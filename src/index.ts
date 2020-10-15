import type { AnyModel } from 'backender-core'
import api from './api'

type ModelClient<Model> = {
  all(): Promise<Model[]>
  create(partialModel: Partial<Omit<Model, 'id'>>): Promise<Model>
  update(partialModel: Partial<Model> & { id: string }): Promise<Model>
  delete(id: string): Promise<void>
}

type Client<Models> = {
  [modelPluralName in keyof Models]: ModelClient<Models[modelPluralName]>
}

type AnyModels = {
  [modelPluralName: string]: {
    [fieldName: string]: any
  }
}

export type Schema<Models extends AnyModels> = {
  id: string
  models: {
    [modelPluralName in keyof Models]: {
      id: string
      fields: {
        [fieldName in keyof Models[modelPluralName]]: {
          id: string
        }
      }
    }
  }
}

const Client = <Models extends AnyModels>(options: {
  schema: Schema<Models>
  clientId: string
}): Client<Models> => {
  const client = {} as Client<Models>
  Object.entries(options.schema.models).forEach(
    ([modelPluralName, model]: [keyof Models, AnyModel]) => {
      const baseRequest = {
        backendId: options.schema.id,
        clientId: options.clientId,
        model,
      }
      client[modelPluralName] = {
        all() {
          return (api.all({
            ...baseRequest,
            type: 'query',
          }) as unknown) as Promise<Models[keyof Models][]>
        },
        create(data: {}) {
          return (api.create({
            ...baseRequest,
            type: 'create',
            data,
          }) as unknown) as Promise<Models[keyof Models]>
        },
        update(data: { id: string }) {
          return (api.update({
            ...baseRequest,
            type: 'update',
            data,
          }) as unknown) as Promise<Models[keyof Models]>
        },
        delete(id: string) {
          return api.delete({ ...baseRequest, type: 'delete', id })
        },
      }
    }
  )
  return client
}
export default Client
