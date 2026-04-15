import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { isValidEmail } from '../utils/validation'
import { AuthProvider, useAuth } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'

// ─── Test 1: Pure function ────────────────────────────────────────────────────

describe('isValidEmail', () => {
  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('returns true for a valid email address', () => {
    expect(isValidEmail('test@test.com')).toBe(true)
  })
})

// ─── Test 2: AuthContext logout ───────────────────────────────────────────────

describe('AuthContext logout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('removes authToken from localStorage after calling logout()', async () => {
    // Build a fake JWT with a base64 payload so AuthContext's useEffect
    // can decode it without hitting the catch block.
    const payload = btoa(
      JSON.stringify({ sub: 'user-1', email: 'test@test.com' })
    )
    const fakeToken = `header.${payload}.signature`
    localStorage.setItem('authToken', fakeToken)

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('authToken')).toBeNull()
  })
})

// ─── Test 3: LoginPage submit with empty fields ───────────────────────────────
// Stub fetch so the real AuthContext.login sees ok=false and throws.
// This avoids vi.mock hoisting, which would break Test 2's real useAuth call.

describe('LoginPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows an error message when submit fails with empty fields', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    )

    // fireEvent.submit bypasses the HTML `required` constraint validation
    const form = document.querySelector('form')!
    await act(async () => {
      fireEvent.submit(form)
    })

    expect(await screen.findByText('Login failed')).toBeInTheDocument()
  })
})
