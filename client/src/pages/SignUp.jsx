import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import OAuth from "../components/OAuth"

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleChange = (event) => {
    const {id, value} = event.target
    setFormData({...formData, [id]: value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()

      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }

      setError(null)
      navigate('/signin')
      
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center py-7">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="name@company.in"
          className="border p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-md
          hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading? 'Loading...': 'SIGN UP'}
        </button>
        <OAuth/>
      </form>
      <p className="mt-4">Have an account? <span className="text-blue-500">
        <a href="/signin">Sign In</a></span>
      </p>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}
