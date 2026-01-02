
export default function TestPage() {
  return (
    <div>
      <h1>Env Check</h1>
      <pre>
        URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set'}
        KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'}
      </pre>
    </div>
  )
}
