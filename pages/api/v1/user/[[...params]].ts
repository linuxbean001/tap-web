import { createHandler } from 'next-api-decorators'

import UserController from '../../../../backend/services/user/user.controller'

export default createHandler(UserController)
