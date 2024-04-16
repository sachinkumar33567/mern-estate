import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)
            const {displayName, email, photoURL} = result.user

            const res = await fetch('/api/auth/google', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: displayName,
                    email,
                    googlePhoto: photoURL
                })
            })

            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')            
            
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <button
            type="button"
            className="bg-red-700 text-white p-3 rounded-md
            hover:opacity-95 disabled:opacity-80 uppercase"
            onClick={handleGoogleClick}
        >
            Continue with Google
        </button>
    )
}
