import type { AnyModel, Query, Create, Update, Delete } from 'backender-core'

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
