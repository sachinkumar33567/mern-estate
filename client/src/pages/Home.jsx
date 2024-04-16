import { useEffect, useState } from "react"
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import Card from '../components/Card'

export default function Home() {
  SwiperCore.use([Navigation])
  const [offerListings, setOfferListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error.message)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error.message)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await res.json()
        if (data.success === false) {
          console.log(data.message)
          return
        }
        setSaleListings(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchOfferListings()

  }, [])

  return <div>
    <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
      <h1 className="text-3xl lg:text-6xl text-slate-700 font-bold">
        Find your next <span className="text-slate-500">
          perfect
        </span>
      <br />place with ease</h1>

      <p className="text-xs lg:text-lg text-gray-400">
        Bjorn Estate will help you find your home fast,
        easy and comfirtable.
        <br />Our expert support are always available.
      </p>

      <a href="" className="text-xs lg:text-lg text-blue-800 font-bold hover:underline">
        Let's get started...
      </a>
    </div>

    <Swiper navigation>
      {offerListings.length > 0 && offerListings.map(listing => <SwiperSlide key={listing._id}>
        <div
        className="h-[600px]"
        style={{background: `url(${listing.images[0]}) center no-repeat`, backgroundSize: 'cover'}}
        >

        </div>
      </SwiperSlide>)}
    </Swiper>

    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
      {offerListings.length > 0 &&
      <div>
        <div className="mb-3">
          <h2 className="text-2xl text-slate-600 font-semibold">Recent offers</h2>
          <a href="/search?offer=true"
          className="text-sm text-blue-800 hover:underline" >
            Show more offers
          </a>
        </div>
        <div className="flex flex-wrap gap-4">
          {offerListings.map(listing => <Card key={listing._id} listing={listing}/>)}
        </div>
      </div>}
      {rentListings.length > 0 &&
      <div>
        <div className="mb-3">
          <h2 className="text-2xl text-slate-600 font-semibold">Recent places for rent</h2>
          <a href="/search?type=rent"
          className="text-sm text-blue-800 hover:underline" >
            Show more places for rent
          </a>
        </div>
        <div className="flex flex-wrap gap-4">
          {rentListings.map(listing => <Card key={listing._id} listing={listing}/>)}
        </div>
      </div>}
      {saleListings.length > 0 &&
      <div>
        <div className="mb-3">
          <h2 className="text-2xl text-slate-600 font-semibold">Recent places for sale</h2>
          <a href="/search?type=sale"
          className="text-sm text-blue-800 hover:underline" >
            Show more places for sale
          </a>
        </div>
        <div className="flex flex-wrap gap-4">
          {saleListings.map(listing => <Card key={listing._id} listing={listing}/>)}
        </div>
      </div>}
    </div>
  </div>
}
