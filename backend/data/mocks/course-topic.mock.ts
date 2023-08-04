import type Course from '../../../lib/domain/course'
import { WithTimestamps } from '../../services/db'

export const courseTopic: Course.Topic = {
  id: 'crs-top-1',
  title: 'Pre-Assessment',
  description: 'Learn all the prequisites for working with Basic Electronics',
  order: 0,
  courseId: 'crs-1',
  activities: [
    {
      id: 'crs-top-act-1',
      auId: 'https://tap3d.com/au/1',
      title: 'History of Electricity',
      description: `The history of electricity dates back to the ancient Greeks, who were familiar with the phenomenon 
        of static electricity. However, it wasn't until the late 18th and early 19th centuries that scientists and inventors 
        began to fully understand and harness the power of electricity. During this time, numerous experiments were conducted 
        to investigate the properties of electricity, and many of the fundamental principles of electricity were discovered.`,
      path: '/curriculum/...',
      courseTopicId: 'crs-top-1',
      order: 0,
      createdAt: 'now',
      updatedAt: 'now',
      type: 'Quiz',
    },
  ],
}

export const courseTopicWithTimestamps: WithTimestamps<Course.Topic> = {
  ...courseTopic,
  createdAt: 'now',
  updatedAt: 'now',
}

export const courseTopics: Course.Topic[] = [
  courseTopic,
  {
    id: 'crs-top-2',
    title: 'Resistors',
    description: 'Learn all about Resistance, Ohms, etc',
    order: 1,
    courseId: 'crs-1',
    activities: [
      {
        id: 'crs-top-act-2',
        auId: 'https://tap3d.com/au/2',
        title: 'Identifying Resistors',
        description: `Identifying resistors by their signature color codes is a skill that can be learnt. 
          There are four main colors used on resistors, and these are brown, red, orange, and yellow. 
          Each color represents a different value, with brown representing the lowest value, and yellow representing the highest. 
          The value of a resistor can be determined by its color code, which is a series of numbers and letters that are printed on the resistor itself.`,
        path: '/curriculum/...',
        courseTopicId: 'crs-top-2',
        order: 0,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      },
      {
        id: 'crs-top-act-3',
        auId: 'https://tap3d.com/au/3',
        title: 'Using Breadboards',
        description: `Placing resistors on a breadboard is one of the foundational skills for anyone working in electronics. The following steps will show you how to place a resistor on a breadboard.
          Step 1: Look at the Resistor
          The first thing you need to do is to look at the resistor. You will notice that there are two colored stripes running down the side of the resistor. These stripes indicate the resistance value of the resistor.`,
        path: '/curriculum/...',
        courseTopicId: 'crs-top-2',
        order: 1,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      },
    ],
    createdAt: 'now',
    updatedAt: 'now',
  },
  {
    id: 'crs-top-3',
    title: 'Electric Current',
    description:
      'Learn all about Electric Current, Voltage, flow of Electrons, etc',
    order: 2,
    courseId: 'crs-1',
    activities: [
      {
        id: 'crs-top-act-4',
        auId: 'https://tap3d.com/au/4',
        title: 'Basic Principles of Electric Current',
        description: `Electrical current, conductivity, resistance, and Ohm's law, which describes the 
        relationship between electric current, voltage, and resistance`,
        path: '/curriculum/...',
        courseTopicId: 'crs-top-3',
        order: 0,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      },
      {
        id: 'crs-top-act-5',
        auId: 'https://tap3d.com/au/5',
        title: 'AC/DC, and not the rock band',
        description: `Direct current, or DC, is a type of electric current that flows in one direction only.
        Alternating current, or AC, is a type of electric current that periodically reverses direction.`,
        path: '/curriculum/...',
        courseTopicId: 'crs-top-3',
        order: 1,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      },
    ],
    createdAt: 'now',
    updatedAt: 'now',
  },
  {
    id: 'crs-top-4',
    title: 'Electrical Safety',
    description: `Learn all about Electrical safety`,
    order: 3,
    courseId: 'crs-1',
    activities: [
      {
        id: 'crs-top-act-6',
        auId: 'https://tap3d.com/au/6',
        title: 'Grounding of electrical systems',
        description: `Grounding of electrical systems refers to the practice of connecting electrical devices and 
          equipment to the ground, usually through a grounding wire or conductor. This is an important safety measure 
          that helps to protect people and equipment from the dangers of electric shock and electrical fires.`,
        path: '/curriculum/...',
        courseTopicId: 'crs-top-4',
        order: 0,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      },
      {
        id: 'crs-top-act-7',
        auId: 'https://tap3d.com/au/7',
        title: 'Safe use of Electrical tools and Appliances',
        description: `The safe use of electrical tools and appliances is an important aspect of electrical safety. 
          When using any electrical tool or appliance, it is important to follow the manufacturer's instructions and safety 
          guidelines to avoid accidents and injuries.`,
        path: '/curriculum/...',
        courseTopicId: 'crs-top-4',
        order: 1,
        createdAt: 'now',
        updatedAt: 'now',
        type: 'Activity_Check',
      },
    ],
    createdAt: 'now',
    updatedAt: 'now',
  },
]

export const courseTopicsWithTimestamps =
  courseTopics as WithTimestamps<Course.Topic>[]
