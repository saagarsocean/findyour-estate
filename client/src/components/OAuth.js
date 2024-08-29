import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import axios from '../config/axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleGoogleClick = async () => {
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await axios.post('/auth/google',{
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            })
            const data = res.data
            dispatch(signInSuccess(data))
            navigate('/')
        } catch(error) {
            console.log('Could not sign in with Google', error)
        }
    }
    return (
        <button 
            onClick={handleGoogleClick} 
            type="button" 
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Continue with Google
        </button>
    )
}