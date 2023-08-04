import { Knex } from 'knex'

import { Tap } from '../../../../lib'

type StringKeys<TEntity extends {}> = {
  [key in keyof TEntity]: key extends string ? key : never
}[keyof TEntity]
type LiteralKeys<TEntity extends {}> = {
  [key in keyof TEntity]: TEntity[key] extends string | number | boolean
    ? key
    : never
}[keyof TEntity]
type StringArrayKeys<TEntity extends {}> = {
  [key in keyof TEntity]: TEntity[key] extends string[] ? key : never
}[keyof TEntity]
type ObjectKeys<TEntity extends {}> = {
  [key in keyof TEntity]: TEntity[key] extends Array<any>
    ? never
    : TEntity[key] extends Record<string, any>
    ? key
    : never
}[keyof TEntity]
type IdSuffix<TKey> = TKey extends string ? `${TKey}Id` : never
type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S
type ObjectWithSnakeCaseKeys<TEntity extends {}> = {
  [key in CamelToSnakeCase<StringKeys<TEntity>>]: TEntity extends Record<
    SnakeToCamelCase<key>,
    infer TValue
  >
    ? TEntity[SnakeToCamelCase<key>]
    : never
}
type CompositeTableType<
  TEntity extends { created_at: string; updated_at: string }
> = Knex.CompositeTableType<
  TEntity,
  Omit<TEntity, 'created_at' | 'updated_at'> &
    Partial<Pick<TEntity, 'created_at' | 'updated_at'>>,
  Omit<TEntity, 'id' | 'created_at'>
>

/**
 * A table type has:
 * - literals as they are ✅
 * - string arrays, turned into string ✅
 * - keys with object prop values turned into propId: string
 * - object arrays removed ✅
 * - timestamps ✅
 * - all camelCase keys in snake_case
 */
export type Table<TEntity extends {}> = ObjectWithSnakeCaseKeys<
  {
    [key in LiteralKeys<TEntity>]: TEntity[key]
  } & {
    [key in StringArrayKeys<TEntity>]: string
  } & {
    [key in IdSuffix<ObjectKeys<TEntity>>]: string
  } & {
    createdAt: string
    updatedAt: string
  }
>
export type NewTable<TEntity> = Omit<
  Table<TEntity>,
  'created_at' | 'updated_at'
>

declare module 'knex/types/tables' {
  type Asset = Table<Tap.Asset>
  type Course = Table<Tap.Course>
  type CourseCategory = Table<Tap.Course.Category>
  type CourseRecord = Table<Tap.Course.Record>
  type CourseTopic = Table<Tap.Course.Topic>
  type CourseTopicRecord = Table<Tap.Course.TopicRecord>
  type CourseTopicActivity = Table<Tap.Course.TopicActivity>
  type CourseTopicActivityRecord = Table<Tap.Course.TopicActivityRecord>
  type Instructor = Table<Tap.Instructor>
  type CourseToInstructor = Table<{ courseId: string; instructorId: string }>
  type CourseAssets = Table<{ courseId: string; assetId: string }>
  type UserGroup = Table<Tap.User.Group>
  type UserToGroup = Table<{ userId: string; userGroupId: string }>
  type UserOrganization = Table<Tap.User.Organization>
  type User = Table<Tap.User>
  type Quiz = Table<Tap.Course.Quiz>
  type Question = Table<Tap.Course.Question>
  type Answers = Table<Tap.Course.Answer>
  type KnowledgeCheck = Table<Tap.Course.KnowledgeCheck>
  type KnowledgeCheckAnswer = Table<Tap.Course.KnowledgeCheckAnswer>
  type KnowledgeCheckQuestion = Table<Tap.Course.KnowledgeCheckQuestion>
  type ActivityCheck = Table<Tap.Course.ActivityCheck>
  type ActivityCheckQuestion = Table<Tap.Course.ActivityCheckQuestion>
  type ActivityCheckAnswer = Table<Tap.Course.ActivityCheckAnswer>
  type UserMetrics = Table<Tap.User.Metrics>
  type AdminMetrics = Table<Tap.User.AdminMetrics>
  type SimulationAssessment = Table<Tap.Course.SimulationAssessment>
  type SimulationTraining = Table<Tap.Course.SimulationTraining>
  type SimulationAssessmentRecord = Table<Tap.Course.SimulationAssessmentRecord>
  type SimulationTrainingRecord = Table<Tap.Course.SimulationTrainingRecord>
  type OrganizationToCourse = Table<Tap.Course.OrganizationCourses>
  interface Tables {
    asset: CompositeTableType<Asset>
    course: CompositeTableType<Course>
    course_category: CompositeTableType<CourseCategory>
    course_record: CompositeTableType<CourseRecord>
    course_topic: CompositeTableType<CourseTopic>
    course_topic_record: CompositeTableType<CourseTopicRecord>
    course_topic_activity: CompositeTableType<CourseTopicActivity>
    course_topic_activity_record: CompositeTableType<CourseTopicActivityRecord>
    instructor: CompositeTableType<Instructor>
    course_to_instructor: CompositeTableType<CourseToInstructor>
    course_assets: CompositeTableType<CourseAssets>
    user_group: CompositeTableType<UserGroup>
    user_to_group: CompositeTableType<UserToGroup>
    quiz: CompositeTableType<Quiz>
    questions: CompositeTableType<Question>
    answers: CompositeTableType<Answers>
    knowledge_check: CompositeTableType<KnowledgeCheck>
    knowledge_check_answer: CompositeTableType<KnowledgeCheckAnswer>
    knowledge_check_question: CompositeTableType<KnowledgeCheckQuestion>
    activity_check: CompositeTableType<ActivityCheck>
    activity_check_questions: CompositeTableType<ActivityCheckQuestion>
    activity_check_answers: CompositeTableType<ActivityCheckAnswer>
    user_metrics: CompositeTableType<UserMetrics>
    admin_metrics: CompositeTableType<AdminMetrics>
    simulation_assessment: CompositeTableType<SimulationAssessment>
    simulation_training: CompositeTableType<SimulationTraining>
    simulation_assessment_record: CompositeTableType<SimulationAssessmentRecord>
    simulation_training_record: CompositeTableType<SimulationTrainingRecord>
    organization_to_course: CompositeTableType<OrganizationToCourse>
  }
}
