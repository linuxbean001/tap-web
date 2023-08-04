import { Tap } from '../../../lib'
import { Fields } from './fields'

const User: Fields<Tap.User>[] = [
  'email',
  'firstName',
  'id',
  'lastName',
  'organizationId',
  'role',
]
const UserGroup: Fields<Tap.User.Group>[] = ['id', 'name', 'organizationId']
const Organization: Fields<Tap.User.Organization>[] = ['id', 'name']
const Asset: Fields<Tap.Asset>[] = ['id', 'type', 'url']
const Instructor: Fields<Tap.Instructor>[] = [
  'id',
  'avatarId',
  'description',
  'firstName',
  'lastName',
  'title',
]
const Course: Fields<Tap.Course>[] = [
  'id',
  'categoryId',
  'lengthMin',
  'level',
  'published',
  'thumbnailId',
  'title',
]

const CourseCategory: Fields<Tap.Course.Category>[] = ['id', 'label']
const CourseTopic: Fields<Tap.Course.Topic>[] = [
  'id',
  'courseId',
  'description',
  'order',
  'title',
]
const CourseRecord: Fields<Tap.Course.Record>[] = ['id', 'courseId', 'userId']
const CourseTopicActivity: Fields<Tap.Course.TopicActivity>[] = [
  'id',
  'description',
  'order',
  'path',
  'title',
  'courseTopicId',
]
const CourseTopicRecord: Fields<Tap.Course.TopicRecord>[] = ['id']
const CourseTopicActivityRecord: Fields<Tap.Course.TopicActivityRecord>[] = [
  'id',
  'createdAt',
]

export const AllowedFields = {
  User,
  UserGroup,
  Organization,
  Asset,
  Instructor,
  Course,
  CourseCategory,
  CourseTopic,
  CourseRecord,
  CourseTopicActivity,
  CourseTopicRecord,
  CourseTopicActivityRecord,
}
