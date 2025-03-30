import Layout from '../components/Layout'
import Dashboard from '../components/Dashboard'

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Willkommen zu Ihrem Link-Dashboard</h1>
      <Dashboard />
    </Layout>
  )
}
