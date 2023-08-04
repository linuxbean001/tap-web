const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '\\.mdx?$': '<rootDir>/__mocks__/mdx.js', // mocks out MDX files because none contain actual tests
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['./backend/**'],
  coveragePathIgnorePatterns: [
    // Files
    '.*.spec.(ts|js)',
    '.*.mock.(ts|js)',
    '.*.seed.(ts|js)',
    '.*index.(ts|js)',
    // Directories
    'data/.*',
    'services/db/migrations/.*',
  ],
  coverageThreshold: {
    global: {
      lines: 10,
    },
  },
}

const getConfig = createJestConfig(customJestConfig)

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  const config = await getConfig()
  config.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    '/node_modules/(?!nanoid|d3|internmap|delaunator|robust-predicates)',
  ]
  return config
}
