import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import OAuth from "../components/OAuth"

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector(state => state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const {id, value} = event.target
    setFormData({...formData, [id]: value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(signInStart())
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()

      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }

      dispatch(signInSuccess(data))
      navigate('/')
      
    } catch (error) {
      dispatch(signInFailure((error.message)))
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center py-7">
        Sign In
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          {loading? 'Loading...': 'SIGN IN'}
        </button>
        <OAuth/>
      </form>
      <p className="mt-4">Don't have an account? <span className="text-blue-500">
        <a href="/signup">Sign Up</a></span>
      </p>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}