export type Asset = {
  id: string
  type: Asset.Type
  url: string
}

export namespace Asset {
  export type Type = 'image' | 'video'
}

export default Asset
