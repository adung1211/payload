'use client'
import { useRouter } from 'next/navigation'
import { Button, TextInput } from '@payloadcms/ui'
import { PasswordInput } from 'node_modules/@payloadcms/ui/dist/fields/Password/input.js'
import React, { useState } from 'react'

export const CreateAccountForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          roles: ['user'],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error('Create account failed')
      router.push('/admin')
    } catch (error) {
      console.error('Create account error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <TextInput
        label="Email"
        path="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Password"
        path="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />
      <Button type="submit">Create Account</Button>
    </form>
  )
}
