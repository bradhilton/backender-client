export type AnyModel = {
  id: string
  fields: {
    [fieldName: string]: {
      id: string
    }
  }
}

type BaseRequest = {
  backendId: string
  clientId: string
}

type Query<Model extends AnyModel> = BaseRequest & {
  type: 'query'
  model: Model
}

type Create<Model extends AnyModel> = BaseRequest & {
  type: 'create'
  model: Model
  data: Partial<Omit<{ [fieldName in keyof Model['fields']]: unknown }, 'id'>>
}

type Update<Model extends AnyModel> = BaseRequest & {
  type: 'update'
  model: Model
  data: Partial<{ [fieldName in keyof Model['fields']]: unknown }> & {
    id: string
  }
}

type Delete<Model extends AnyModel> = BaseRequest & {
  type: 'delete'
  model: Model
  id: string
}

type Request<Model extends AnyModel> =
  | Query<Model>
  | Create<Model>
  | Update<Model>
  | Delete<Model>

const api = async <Request, Response>(request: Request): Promise<Response> => {
  const response = await fetch('https://backender.vercel.com/api', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(request),
  })
  return response.json()
}

export default {
  all: async <Model extends AnyModel>(
    request: Query<Model>
  ): Promise<Model[]> => api(request),
  create: async <Model extends AnyModel>(
    request: Create<Model>
  ): Promise<Model> => api(request),
  update: async <Model extends AnyModel>(
    request: Update<Model>
  ): Promise<Model> => api(request),
  delete: async <Model extends AnyModel>(
    request: Delete<Model>
  ): Promise<void> => api(request),
}
