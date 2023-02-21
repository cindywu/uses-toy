// Initialize the JS client
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = "https://vyrrxzwtehtncaarlbed.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMwNzk2MzI5LCJleHAiOjE5NDYzNzIzMjl9.oYPplUVonrTLlW-8S7ZdNPVerk6vJX_bOD8xqJ19T2E"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
import { nanoid } from 'nanoid'



export default async function handler(req :any, res: any) {


  const email = JSON.parse(req.body).email
  console.log('email', email)

  const public_key = nanoid()
  console.log({ public_key })

  // Make a request

  const { error } = await supabase
  .from('uses users')
  .insert({ email, public_key})

  console.log({ error })

  res.status(200).json({ email, public_key })

}


