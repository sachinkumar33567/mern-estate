import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                if (data.success === false) {
                    return console.log(data.message)
                }
                setLandlord(data)
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchUser()
    }, [listing.userRef])

    const handleChange = (event) => {
        setMessage(event.target.value)
    }

    return <>
    {landlord &&
    <div className="flex flex-col gap-2">
        <p>Contact <span className="font-semibold text-slate-800">
            {landlord.username}
            </span> for <span className="font-semibold text-slate-800">
            {listing.name.toLowerCase()}
        </span></p>
        <textarea
        name="message"
        id="message"
        rows="2"
        placeholder="Write your message here"
        value={message}
        onChange={handleChange}
        className="w-full border p-2 sm:p-3 text-sm sm:text-lg rounded-md"
        ></textarea>
        <Link
        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
        className="p-2 sm:p-3 bg-slate-700 text-white text-lg sm:text-xl
        uppercase rounded-md w-full text-center hover:opacity-95 mt-4"
        >
            Send message
        </Link>
    </div>}
    </>
}