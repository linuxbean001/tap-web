import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createCourseTopicActivityRecord } from '../components/courses/courses.service'
import Header from '../components/header'
import Layout from '../components/layout'
import { useCurrentUser, withPageContexts } from '../lib/contexts'

const CURRICULUM = {
  sessionKey: 'SESSION-KEY',
  activityId: 'ACTIVITY-ID',
}
const SIMULATION = {
  sessionKey: 'SESSION-KEY',
  activityId: 'ACTIVITY-ID',
}

const COURSE_ID = 'crs-1'
const STORYLINE_COURSE_TOPIC_ACTIVITY_ID =
  'https://dev.app.tap3d.com/course-topic-activity/1b2c3'

const SIMULATION_COURSE_TOPIC_ACTIVITY_ID =
  'https://dev.app.tap3d.com/course-topic-activity/1b2c3'

function Demo() {
  const { user } = useCurrentUser()
  const [storylineUrl, setStorylineUrl] = useState<string>('')
  const [simulationUrl, setSimulationUrl] = useState<string>('')

  useEffect(() => {
    const init = async () => {
      const slResp = await createCourseTopicActivityRecord(
        COURSE_ID,
        STORYLINE_COURSE_TOPIC_ACTIVITY_ID
      )
      if (slResp.launchUrl) {
        setStorylineUrl(slResp.launchUrl)
      }

      const simResp = await createCourseTopicActivityRecord(
        COURSE_ID,
        SIMULATION_COURSE_TOPIC_ACTIVITY_ID
      )
      if (simResp.launchUrl) {
        setSimulationUrl(simResp.launchUrl)
      }
    }
    init()
  }, [])

  return (
    <>
      <Head>
        <title>TAP | Demo</title>
      </Head>
      <Layout header={<Header title="Demo" />}>
        <div className="my-4">
          <h2>
            <b>Storyline Course</b>
          </h2>
          <div>
            <a
              href={`${
                process.env.NEXT_PUBLIC_CDN_URL
              }/curriculum/test/story.html?${new URLSearchParams(CURRICULUM)}`}
              className="hover:text-primary-5"
              target="_blank"
              rel="noreferrer"
            >
              Launch Static &rarr;
            </a>
          </div>
          <div>
            <a
              href={storylineUrl}
              className="hover:text-primary-5"
              target="_blank"
              rel="noreferrer"
            >
              Launch Dynamic &rarr;
            </a>
          </div>
        </div>
        <div className="my-4">
          <h2>
            <b>Virtual Simulation</b>
          </h2>
          <div>
            <a
              href={`${
                process.env.NEXT_PUBLIC_CDN_URL
              }/simulations/index.html?${new URLSearchParams(SIMULATION)}`}
              className="hover:text-primary-5"
              target="_blank"
              rel="noreferrer"
            >
              Launch &rarr;
            </a>
          </div>
          <div>
            <a
              href={simulationUrl}
              className="hover:text-primary-5"
              target="_blank"
              rel="noreferrer"
            >
              Launch Dynamic &rarr;
            </a>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default withPageContexts(Demo)
