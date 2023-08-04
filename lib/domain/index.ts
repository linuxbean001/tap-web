import type { Asset as IAsset } from './asset'
import type { Course as ICourse } from './course'
import type { Instructor as IInstructor } from './instructor'
import type { Report as IReport } from './report'
import { Role as IRole, User as IUser } from './user'

export namespace Tap {
  export type Course = ICourse
  export type Asset = IAsset
  export type Instructor = IInstructor
  export type User = IUser

  export namespace Asset {
    export type Type = IAsset.Type
  }

  export namespace User {
    export type Group = IUser.Group
    export const Role = IRole
    export type Organization = IUser.Organization
    export type Metrics = IUser.Metrics
    export type AdminMetrics = IUser.AdminMetrics
  }

  export namespace Course {
    export type Level = ICourse.Level
    export type Category = ICourse.Category
    export type Topic = ICourse.Topic
    export type Record = ICourse.Record
    export type TopicActivity = ICourse.TopicActivity
    export type TopicRecord = ICourse.TopicRecord
    export type TopicActivityRecord = ICourse.TopicActivityRecord
    export type Quiz = ICourse.Quiz
    export type QuizRecord = ICourse.QuizRecord
    export type Question = ICourse.Question
    export type Answer = ICourse.Answer
    export type KnowledgeCheck = ICourse.KnowledgeCheck
    export type KnowledgeCheckRecord = ICourse.KnowledgeCheckRecord
    export type KnowledgeCheckAnswer = ICourse.KnowledgeCheckAnswer
    export type KnowledgeCheckQuestion = ICourse.KnowledgeCheckQuestion
    export type ActivityCheck = ICourse.ActivityCheck
    export type ActivityCheckRecord = ICourse.ActivityCheckRecord
    export type ActivityCheckQuestion = ICourse.ActivityCheckQuestion
    export type ActivityCheckAnswer = ICourse.ActivityCheckAnswer
    export type SimulationAssessment = ICourse.SimulationAssessment
    export type SimulationTraining = ICourse.SimulationTraining
    export type SimulationAssessmentRecord = ICourse.SimulationAssessmentRecord
    export type SimulationTrainingRecord = ICourse.SimulationTrainingRecord
    export type OrganizationCourses = ICourse.OrganizationCourses
  }

  export namespace Report {
    export type SkillDistribution = IReport.SkillDistribution
    export type CompletedActivities = IReport.CompletedActivities
    export type AdminProgressSummary = IReport.AdminProgressSummary
    export type Leaderboard = IReport.Leaderboard
    export type UserProgressSummary = IReport.UserProgressSummary
    export type UserSkillDistribution = IReport.UserSkillDistribution
    export type ActiveTopics = IReport.ActiveTopics
    export type Level = IReport.Level
  }
}
