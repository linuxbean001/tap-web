import { customAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export const Id = {
  UserGroup: () => getId('usr-grp'),
  Asset: () => getId('ast'),
  Instructor: () => getId('ins'),
  Course: () => getId('crs'),
  CourseCategory: () => getId('crs-cat'),
  CourseTopic: () => getId('crs-top'),
  CourseRecord: () => uuidv4(), // https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#814-registration
  CourseTopicActivity: () => getId('crs-top-act'),
  CourseTopicRecord: () => getId('crs-top-rec'),
  CourseTopicActivityRecord: () => getId('crs-top-act-rec'),
  Quiz: () => getId('crs-qz'),
  QuizRecord: () => getId('crs-qz-rec'),
  Question: () => getId('crs-qz-qst'),
  Answer: () => getId('crs-qz-ans'),
  KnowledgeCheck: () => getId('crs-kc'),
  KnowledgeCheckRecord: () => getId('crs-kc-rec'),
  KnowledgeCheckQuestion: () => getId('crs-kc-qst'),
  KnowledgeCheckAnswer: () => getId('crs-kc-ans'),
  ActivityCheck: () => getId('crs-ac'),
  ActivityCheckRecord: () => getId('crs-ac-rec'),
  ActivityCheckQuestion: () => getId('crs-ac-qst'),
  ActivityCheckAnswer: () => getId('crs-ac-ans'),
  SimulationAssessment: () => getId('crs-sim-assessment'),
  SimulationTraining: () => getId('crs-sim-training'),
  SimulationAssessmentRecord: () => getId('crs-sim-assessment-rec'),
  SimulationTrainingRecord: () => getId('crs-sim-training-rec'),
  Metrics: () => getId('usr-met'),
  AdminMetrics: () => getId('adm-met'),
  OrganizationCourses: () => getId('org-to-crs'),
} as const

export default Id

export const getId = (prefix?: string) => {
  const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    10
  )
  return `${prefix ? `${prefix}-` : ''}${nanoid()}`
}
