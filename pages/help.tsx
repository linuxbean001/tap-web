import Head from 'next/head'
import Header from '../components/header'
import Layout from '../components/layout'
import { withPageContexts } from '../lib/contexts'

function Help() {
  return (
    <>
      <Head>
        <title>TAP | Help</title>
      </Head>
      <Layout header={<Header title={'Help'} />}></Layout>
    </>
  )
}

export default withPageContexts(Help)
