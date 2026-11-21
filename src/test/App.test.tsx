import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('App Component', () => {
  it('renders the brand title', () => {
    render(<App />)
    expect(screen.getByText('yourframies')).toBeInTheDocument()
  })

  it('renders the interactive counter', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /clicked 0 times/i })).toBeInTheDocument()
  })
})
