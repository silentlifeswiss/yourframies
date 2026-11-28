import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('Your Framies E-Commerce App', () => {
  it('renders the brand title and announcement bar', () => {
    render(<App />)
    const brandTitles = screen.getAllByText(/Your Framies/i)
    expect(brandTitles.length).toBeGreaterThan(0)
    expect(screen.getByText(/WELCOME10/i)).toBeInTheDocument()
  })

  it('renders primary navigation links', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /^Shop All$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Custom Studio$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Track Order/i })).toBeInTheDocument()
  })

  it('renders hero banner and call to action', () => {
    render(<App />)
    expect(screen.getByText(/A4 Wall Art/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore Collections/i })).toBeInTheDocument()
  })
})
