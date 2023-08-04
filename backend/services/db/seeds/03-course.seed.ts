import { Knex } from 'knex'
import { Tap } from '../../../../lib'
import { Id } from '../../../utils/id.utils'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('course').del()

  const category = await knex('course_category').first()
  const instructorAsset = await knex('asset').first()
  const thumbnailAsset = await knex('asset').where({
    url: 'https://dev.cdn.tap3d.com/assets/images/OnboardingThumbnail.png',
  })

  const levels: Tap.Course.Level[] = [
    'Foundational',
    'Beginner',
    'Intermediate',
    'Advanced',
  ]

  // Inserts seed entries
  // await Promise.all(
  //   categories.map((category) =>
  //     knex('course').insert(
  //       levels.map((level) => ({
  //         id: Id.Course(),
  //         category_id: category.id,
  //         title: `${level} ${category.label}`,
  //         level,
  //         description: `A simple guide to ${level} ${category.label}`,
  //         length_min: 60,
  //         objectives: [
  //           `- To introduce ${level} ${category.label}`,
  //           `- To provide a walkthrough of ${level} ${category.label}`,
  //         ].join('\n'),
  //         published: true,
  //         thumbnail_id: asset.id,
  //       }))
  //     )
  //   )
  // )

  await knex('course').insert({
    id: Id.Course(),
    category_id: category.id,
    title: `${levels[0]} ${category.label}`,
    level: levels[0],
    description: `This is a course used for testing our systems. If you are a user who can see this, please contact a TAP employee.`,
    length_min: 1,
    objectives: [`- Test our systems`].join('\n'),
    published: true,
    thumbnail_id: thumbnailAsset[0].id,
  })

  await knex('instructor').insert({
    id: Id.Instructor(),
    first_name: 'TAP',
    last_name: '',
    title: 'Onboarding Instructor',
    description:
      'Training All People (TAP) is breaking down the barriers that prevent people from pursuing promising vocational careers.',
    avatar_id: instructorAsset.id,
  })

  const course = await knex('course').first()
  const instructor = await knex('instructor').first()

  await knex('course_to_instructor').insert({
    course_id: course.id,
    instructor_id: instructor.id,
  })

  await knex('course_assets').insert({
    course_id: course.id,
    asset_id: thumbnailAsset[0].id,
  })

  await knex('organization_to_course').insert({
    id: Id.OrganizationCourses(),
    organization_name: 'ACME Inc.',
    course_id: course.id,
    third_party_id: '0adf3b90-d205-4ecc-8386-469e11efa3b8',
  })
}
