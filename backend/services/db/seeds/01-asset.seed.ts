import { Knex } from 'knex'
import { Id } from '../../../utils/id.utils'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('asset').del()

  // Inserts seed entries
  await knex('asset').insert([
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/TapAvatar.svg',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/leak-checking-course-banner-reskin.png',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/ed-raney.jpeg',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/pneumatics-fundamentals-course-banner.png',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/OnboardingThumbnail.png',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/electrical-fundamentals-course-banner.png',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/workmanship-course-banner.png',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/jim-thompson.jpg',
    },
    {
      id: Id.Asset(),
      type: 'image',
      url: 'https://dev.cdn.tap3d.com/assets/images/semiconductor-occupation-course-banner.png',
    },
  ])
}
