export namespace Report {
  export type Level = 'Unqualified' | 'Novice' | 'Proficient' | 'Expert'
  export type UserProgressSummary = {
    pointsEarned: number
    topicsCompleted: number
    averageScore: number
    averageSkillGrowth: number
  }

  export type AdminProgressSummary = {
    activeUsers: number
    learningHours: number
    assessedUsers: number
    averageSkillGrowth: number
  }

  export type SkillDistribution = {
    topicId: string
    topicTitle: string
    metrics: {
      count: number
      level: Level
    }[]
  }[]

  export type UserSkillDistribution = {
    topic: string
    level: string
  }[]

  export type Leaderboard = {
    firstName: string
    lastName: string
    points: number
    id?: string
  }[]

  export type CompletedActivities = {
    date: string
    count: number
    courseId?: string
  }[]

  export type ActiveTopics = { topicId: string; topicTitle: string }[]
}
