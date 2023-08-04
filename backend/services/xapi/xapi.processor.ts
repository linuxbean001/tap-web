import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { SQS } from '@aws-sdk/client-sqs'
import { Activity, Statement } from '@xapi/xapi'
import { Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'
import { getTimestampUTC } from '../../utils'
import { getErrorMessage } from '../../utils/errors'
import { CourseActivityCheckService } from '../course/course-activity/course-activity-service'
import { CourseKnowledgeCheckService } from '../course/course-knowledge/course-knowledge-service'
import { CourseQuizQuestionService } from '../course/course-quiz/course-quiz-service'
import { CourseSimulationService } from '../course/course-simulation/course-simulation-service'
import { CourseTopicActivityRecordService } from '../course/course-topic-activity-record/course-topic-activity-record.service'

import knex from '../db/conn.knex'
import UserService from '../user/user.service'

const PROCESSOR = {
  LAUNCHED: 'launched',
  INITIALIZED: 'initialized',
  COMPLETED: 'completed',
  PASSED: 'passed',
  FAILED: 'failed',
  ABANDONED: 'abandoned',
  WAIVED: 'waived',
  TERMINATED: 'terminated',
  SATISIFED: 'satisified',
  ANSWERED: 'answered',
  EXPERIENCED: 'experienced',
  LEFT: 'left',
}

const VERBS = {
  'http://adlnet.gov/expapi/verbs/launched': PROCESSOR.LAUNCHED,
  'http://adlnet.gov/expapi/verbs/initialized': PROCESSOR.INITIALIZED,
  'http://adlnet.gov/expapi/verbs/completed': PROCESSOR.COMPLETED,
  'http://adlnet.gov/expapi/verbs/passed': PROCESSOR.PASSED,
  'http://adlnet.gov/expapi/verbs/failed': PROCESSOR.FAILED,
  'https://w3id.org/xapi/adl/verbs/abandoned': PROCESSOR.ABANDONED,
  'https://w3id.org/xapi/adl/verbs/waived': PROCESSOR.WAIVED,
  'http://adlnet.gov/expapi/verbs/terminated': PROCESSOR.TERMINATED,
  'https://w3id.org/xapi/adl/verbs/satisfied': PROCESSOR.SATISIFED,
  'http://adlnet.gov/expapi/verbs/answered': PROCESSOR.ANSWERED,
  'http://adlnet.gov/expapi/verbs/experienced': PROCESSOR.EXPERIENCED,
  'http://activitystrea.ms/schema/1.0/leave': PROCESSOR.LEFT,
}

export default class xAPIProcessor {
  db: Knex
  constructor(db: Knex = knex) {
    this.db = db
  }
  // Create an SQS service object
  sqs = new SQS({
    apiVersion: '2012-11-05',
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  lambda = new LambdaClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  readonly queueURL: string = process.env.AWS_SQS_URL
  readonly params: {
    AttributeNames: string[]
    MaxNumberOfMessages: number
    MessageAttributeNames: string[]
    QueueUrl: string
    VisibilityTimeout: number
    WaitTimeSeconds: number
  } = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: ['All'],
    QueueUrl: this.queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0,
  }

  answered: Statement[] = []
  quizId: string = ''
  courseTopicActivityId: string = ''

  /**
   * @function sendMessage
   * @param queueUrl
   * @param message
   *
   * This function sends a message to the SQS queue
   */
  async sendMessage(queueUrl: string, message: string) {
    const uuid = uuidv4()
    const params = {
      MessageBody: message,
      QueueUrl: queueUrl,
      MessageGroupId: uuid,
      MessageDeduplicationId: uuid,
    }
    try {
      await this.sqs.sendMessage(params)
    } catch (error) {
      throw new Error(
        `Failed to sendMessage xAPI statement ${JSON.stringify(error)}`
      )
    }
  }

  async dispatch(statements: Statement[]) {
    await Promise.all(statements.map(this._dispatch, this))
  }

  async _dispatch(statement: Statement) {
    try {
      const processor: string = VERBS[statement.verb.id] || ''
      switch (processor.toLowerCase()) {
        case PROCESSOR.COMPLETED:
          /**
           * at this point, we have all the answer xAPI statements
           * loop through all the answer statements and for each one,
           * add the question to the question table.
           */
          if (this.answered.length > 0) {
            const answerPromises = []
            this.answered.forEach(async (answerStatement) => {
              answerPromises.push(
                this.processAssessmentQuestions(answerStatement)
              )
            })
            await Promise.all(answerPromises)
          }
          await this.markCourseTopicActivityRecordComplete(statement)
          break
        case PROCESSOR.ANSWERED:
          this.answered.push(statement)
          break
        case PROCESSOR.PASSED:
        case PROCESSOR.FAILED:
          await this.processResultsStatement(statement)
          break
        default:
          break
      }
    } catch (e) {
      console.error(`[xAPI.dispatch] `, getErrorMessage(e))
      throw new Error(
        `Failed to process xAPI statement ${JSON.stringify(statement)}`
      )
    }
  }

  async markCourseTopicActivityRecordComplete(statement: Statement) {
    try {
      const activity = statement.object as Activity
      if (activity.objectType.toLowerCase() !== 'activity')
        throw new Error("Expected object type of 'activity'.")
      activity.id
      const courseRecordId: string = statement.context.registration
      const activityRecordService = new CourseTopicActivityRecordService()
      this.courseTopicActivityId = this.parseActivityId(activity.id)
      const activityRecord =
        await activityRecordService.getCourseTopicActivityRecordByCourseRecord(
          courseRecordId,
          this.courseTopicActivityId
        )
      if (!activityRecord)
        throw new Error('Failed to retrieve existing activity record.')

      if (activityRecord.completedAt) return
      const completeActivityRecord =
        await activityRecordService.updateCourseTopicActivityRecord(
          activityRecord.id,
          {
            completedAt: getTimestampUTC(),
            updatedAt: getTimestampUTC(),
          }
        )
      if (!completeActivityRecord)
        throw new Error('Failed to update activity record.')
      const userId = statement?.actor?.account?.name
      const user = await new UserService().getUserById(userId)
      const ENV_VARS = {
        PG_PORT: process.env.PG_PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        PG_USERNAME: process.env.PG_USERNAME,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        PG_HOST: process.env.PG_HOST,
        PG_PASSWORD: process.env.PG_PASSWORD,
        AWS_REGION_NAME: process.env.AWS_REGION,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        PG_DATABASE: process.env.PG_DATABASE,
      }
      const data = {
        organization_id: user?.organization?.id,
        statement: statement,
      }
      const updatedStatement = {
        ...ENV_VARS,
        ...statement,
        organization_id: user?.organization?.id,
        data: data,
      }
      await this.sendMessage(
        process.env.AWS_SQS_URL,
        JSON.stringify(updatedStatement)
      )
      // add the admin packet, send organization_id with the SQS message
      await this.sendMessage(
        process.env.AWS_SQS_ADMIN_URL,
        JSON.stringify(updatedStatement)
      )
      const userMetricslambdaParams = {
        FunctionName:
          'arn:aws:lambda:us-west-2:547807111216:function:TAP-USER-METRICS',
        Payload: new TextEncoder().encode(JSON.stringify(updatedStatement)), // Convert payload to Uint8Array
      }

      const adminMetricslambdaParams = {
        FunctionName:
          'arn:aws:lambda:us-west-2:547807111216:function:TAP-ADMIN-METRICS',
        Payload: new TextEncoder().encode(JSON.stringify(updatedStatement)), // Convert payload to Uint8Array
      }
      await this.lambda.send(new InvokeCommand(userMetricslambdaParams))
      await this.lambda.send(new InvokeCommand(adminMetricslambdaParams))
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error('Failed to mark course topic activity record complete.')
    }
  }

  /**
   * processAssessmentQuestions
   * @param statement
   *
   * This function processes a single xAPI statement that contains an answer to a question.
   * It will create a new question record in the database, and quiz record if it doesn't exist.
   * It will then create an answer record for the question.
   */
  async processAssessmentQuestions(statement: Statement): Promise<void> {
    try {
      const userId = statement?.actor?.account?.name
      const topicCourseURL: string =
        statement?.context?.contextActivities?.parent[0]?.id
      const topicId: string = this.parseActivityId(topicCourseURL)
      const activity = statement.object as Activity
      const courseTopicActivityId = this.parseActivityId(activity.id)
      const courseTopicActivity = await this.db('course_topic_activity')
        .where('id', courseTopicActivityId)
        .first()
      const courseTopicActivityType = courseTopicActivity.type
      if ('definition' in statement.object) {
        const type: string = statement?.object?.definition?.type
        const questionService = new CourseQuizQuestionService()
        const kcQuestionService = new CourseKnowledgeCheckService()
        const acQuestionService = new CourseActivityCheckService()
        const activity = statement.object as Activity
        const courseTopicActivityId = this.parseActivityId(activity.id)
        const wasCorrect = statement?.result?.success
        const timeSpent = statement?.result?.duration
        const pointValue =
          statement.result.extensions[
            'http://id.tincanapi.com/extension/cmi-interaction-weighting'
          ]
        switch (courseTopicActivityType) {
          case 'Knowledge_Check':
            const kcQuizId: string = await kcQuestionService.getKCQuizId(
              courseTopicActivityId
            )
            const { kcId: kcQuestionId } =
              await kcQuestionService.createCourseKCQuestion(
                topicId,
                type,
                kcQuizId
              )
            await kcQuestionService.createCourseKCAnswers(
              kcQuestionId,
              userId,
              wasCorrect,
              timeSpent,
              pointValue
            )
            break
          case 'Activity_Check':
            const acQuizId: string = await acQuestionService.getACQuizId(
              courseTopicActivityId
            )
            const { acId: acQuestionId } =
              await acQuestionService.createCourseACQuestion(
                topicId,
                type,
                acQuizId
              )

            await acQuestionService.createCourseAnswer(
              acQuestionId,
              userId,
              wasCorrect,
              timeSpent,
              pointValue
            )
            break
          case 'Quiz':
            const quizId: string = await questionService.getQuizId(
              courseTopicActivityId
            )
            const { id } = await questionService.createCourseQuestion(
              topicId,
              type,
              quizId
            )
            await questionService.createCourseAnswer(
              id,
              userId,
              wasCorrect,
              timeSpent,
              pointValue
            )
            break
          default:
            console.log('Activity Type Not Supported.')
            break
        }
      } else {
        throw new Error('Statement does not contain definition property.')
      }
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error(
        `Failed to process assessment questions. See error msg: ${e}`
      )
    }
  }

  async insertAssessmentResult(
    statement: Statement,
    courseTopicActivityRecordId: string,
    courseTopicActivityId: string
  ): Promise<void> {
    try {
      const activity = statement.object as Activity
      if (activity.objectType.toLowerCase() !== 'activity')
        throw new Error("Expected object type of 'activity'.")
      const userId = statement.actor.account.name
      const quizService = new CourseQuizQuestionService()
      const score = statement.result.score.raw
      await quizService.addUserQuizScore(
        userId,
        courseTopicActivityRecordId,
        score,
        statement.result.duration,
        courseTopicActivityId
      )
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error(
        `Failed to process assessment result. See error msg: ${e}`
      )
    }
  }

  async insertSimulationAssessmentResult(
    statement: Statement,
    courseTopicActivityRecordId: string,
    courseTopicActivityId: string
  ): Promise<void> {
    try {
      const activity = statement.object as Activity
      if (activity.objectType.toLowerCase() !== 'activity')
        throw new Error("Expected object type of 'activity'.")
      const userId = statement.actor.account.name
      const simulationAssessmentService = new CourseSimulationService()
      const score = statement?.result?.score?.raw || 0
      await simulationAssessmentService.addSimulationAssessmentScore(
        userId,
        courseTopicActivityRecordId,
        score,
        statement.result.duration,
        courseTopicActivityId
      )
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error(
        `Failed to process simulation assessment result. See error msg: ${e}`
      )
    }
  }

  async insertSimulationTrainingResult(
    statement: Statement,
    courseTopicActivityRecordId: string,
    courseTopicActivityId: string
  ): Promise<void> {
    try {
      const activity = statement.object as Activity
      if (activity.objectType.toLowerCase() !== 'activity')
        throw new Error("Expected object type of 'activity'.")
      const userId = statement.actor.account.name
      const simulationTrainingService = new CourseSimulationService()
      await simulationTrainingService.addSimulationTrainingScore(
        userId,
        courseTopicActivityRecordId,
        courseTopicActivityId,
        statement.result.duration
      )
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error(
        `Failed to process simulation training result. See error msg: ${e}`
      )
    }
  }

  async insertActivityCheckResult(
    statement: Statement,
    courseTopicActivityRecordId: string,
    courseTopicActivityId: string
  ): Promise<void> {
    try {
      const activity = statement.object as Activity
      if (activity.objectType.toLowerCase() !== 'activity')
        throw new Error("Expected object type of 'activity'.")
      const userId = statement.actor.account.name
      const courseActivityCheckService = new CourseActivityCheckService()
      await courseActivityCheckService.addUserACScore(
        userId,
        courseTopicActivityRecordId,
        0,
        statement.result.duration,
        courseTopicActivityId
      )
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error(
        `Failed to process activity check result. See error msg: ${e}`
      )
    }
  }

  async insertKnowledgeCheckResult(
    statement: Statement,
    courseTopicActivityRecordId: string,
    courseTopicActivityId: string
  ): Promise<void> {
    try {
      const activity = statement.object as Activity
      if (activity.objectType.toLowerCase() !== 'activity')
        throw new Error("Expected object type of 'activity'.")
      const userId = statement.actor.account.name
      const courseKnowledgeCheckService = new CourseKnowledgeCheckService()
      await courseKnowledgeCheckService.addUserKCScore(
        userId,
        courseTopicActivityRecordId,
        0,
        statement.result.duration,
        courseTopicActivityId
      )
    } catch (e) {
      console.error(getErrorMessage(e))
      throw new Error(
        `Failed to process knowledge check result. See error msg: ${e}`
      )
    }
  }

  async processResultsStatement(statement: Statement): Promise<void> {
    const activity = statement.object as Activity
    const sessionKey = 'https://w3id.org/xapi/cmi5/context/extensions/sessionid'
    const courseTopicActivityRecordId = this.parseActivityId(
      statement.context.extensions[sessionKey]
    )
    const courseTopicActivityId = this.parseActivityId(activity.id)
    const courseTopicActivity = await this.db('course_topic_activity')
      .where('id', courseTopicActivityId)
      .first()
    switch (courseTopicActivity.type) {
      case 'Quiz':
        await this.insertAssessmentResult(
          statement,
          courseTopicActivityRecordId,
          courseTopicActivityId
        )
        break
      case 'Simulation_Assessment':
        await this.insertSimulationAssessmentResult(
          statement,
          courseTopicActivityRecordId,
          courseTopicActivityId
        )
        break
      case 'Activity_Check':
        await this.insertActivityCheckResult(
          statement,
          courseTopicActivityRecordId,
          courseTopicActivityId
        )
        break
      case 'Simulation_Training':
        await this.insertSimulationTrainingResult(
          statement,
          courseTopicActivityRecordId,
          courseTopicActivityId
        )
        break
      case 'Knowledge_Check':
        await this.insertKnowledgeCheckResult(
          statement,
          courseTopicActivityRecordId,
          courseTopicActivityId
        )
        break
      default:
        console.error(
          `Unknown course topic activity type: ${courseTopicActivity.type}`
        )
        break
    }
  }

  parseActivityId(iri: string): string {
    const match = iri.match(/course-topic-activity\/(.+?)(#|$)/)
    const match2 = iri.match(/^[^|]*\|(.*)$/)
    if (match && match[1]) {
      return match[1]
    } else if (match2 && match2[1]) {
      return match2[1]
    }
    throw new Error(`Failed to parse activity id from iri: ${iri}`)
  }
}
