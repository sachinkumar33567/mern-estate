import { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromURL = urlParams.get('searchTerm')
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL)
    } else {
      setSearchTerm('')
    }
  }, [location.search])
  
  return (
    <header className="bg-slate-200 px-4 sm:px-12 py-3 flex justify-between items-center shadow-md">
        <a href='/' className="text-slate-700 text-sm sm:text-xl font-bold">
            <span className="text-slate-500">Bjorn</span>
            Estate
        </a>
        <form onSubmit={handleSubmit} className="p-3 rounded-lg bg-slate-100 flex items-center">
            <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
            <button type='submit'>
              <FaSearch className='text-slate-600'/>
            </button>
        </form>

        <div className="flex gap-2 items-center text-slate-700 font-semibold">
            <a href="/" className='hidden sm:inline hover:underline'>Home</a>
            <a href="/about" className='hidden sm:inline hover:underline'>About</a>
            {
              currentUser?
              <a href="/profile">
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.username}
                  className='h-10 w-10 rounded-full object-cover'
                />
              </a>:
              <a href="/signin" className='hover:underline whitespace-nowrap'>Sign In</a>
            }
        </div>
    </header>
  )
}
