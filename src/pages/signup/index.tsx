import React from 'react'

export default function index() {

  async function handleSignUp() {
    const email = "test@test.com"
    const response = await fetch('/api/signup', {
      method: 'POST',
    body: JSON.stringify({ email})

    })
    console.log('response.json()', await response.json())
    // return response.json();
  }

  return (
    <div className={'grid h-screen place-items-center'}>
      <button
        className={'border p-2'}
        onClick={() => handleSignUp()}
      >
        Sign Up
      </button>
    </div>
  )
}


