import React from 'react'
import { Api, getApiFallbackData } from './models'

type DataFetchContextProps = {
  fallback: Partial<Api.Get>
}

export const DataFetchContext = React.createContext<DataFetchContextProps>({
  fallback: getApiFallbackData(),
})
