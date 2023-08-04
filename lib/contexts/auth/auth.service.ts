import { Api, getFetchFunction, ServiceDependencies } from '../data-fetch'

export const fetchCurrentUser = async ({
  fetch = getFetchFunction(),
}: ServiceDependencies<Api.Get.Fetch<'/user/me'>> = {}) => fetch('/user/me')
