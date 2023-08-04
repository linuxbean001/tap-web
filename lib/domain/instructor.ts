import Asset from './asset'

export type Instructor = {
  id: string
  firstName: string
  lastName: string
  title: string
  description: string
  avatarId: string
  avatar?: Partial<Asset>
}

export default Instructor
