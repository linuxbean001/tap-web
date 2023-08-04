import { AssetService } from './asset.service'

describe('AssetService', () => {
  const service = new AssetService()

  describe('getAssets', () => {
    it('should getAssets', async () => {
      const assets = await service.getAssets(['ast-1'], {
        getAssets: async () => [
          {
            id: 'ast-1',
            type: 'image',
            url: 'https://cdn.tap3d.com/images/rain.jpg',
            created_at: 'now',
            updated_at: 'now',
          },
        ],
      })
      expect(assets).toEqual([
        {
          id: 'ast-1',
          type: 'image',
          url: 'https://cdn.tap3d.com/images/rain.jpg',
          createdAt: 'now',
          updatedAt: 'now',
        },
      ])
    })

    it('should return empty', async () => {
      const assets = await service.getAssets([], {
        getAssets: async () => [],
      })
      expect(assets).toEqual([])
    })
  })

  describe('getAsset', () => {
    it('should getAsset', async () => {
      const asset = await service.getAsset('ast-1', {
        getAsset: async () => ({
          id: 'ast-1',
          type: 'image',
          url: 'https://cdn.tap3d.com/images/rain.jpg',
          created_at: 'now',
          updated_at: 'now',
        }),
      })
      expect(asset).toEqual({
        id: 'ast-1',
        type: 'image',
        url: 'https://cdn.tap3d.com/images/rain.jpg',
        createdAt: 'now',
        updatedAt: 'now',
      })
    })

    it('should return null', async () => {
      const asset = await service.getAsset('ast-1', {
        getAsset: async () => null,
      })
      expect(asset).toEqual(null)
    })
  })
})
