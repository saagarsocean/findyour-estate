import React from 'react'
import { SiGmail } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";

export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>FINDYOUR-ESTATE</h1>
      <p className='mb-4 text-slate-700'>
        FINDYOUR-ESTATE is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
      </p>
      <p className='mb-4 text-slate-700'>
        Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
      </p>
      <p className='mb-4 text-slate-700'>
        Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
      </p>

      <h2 className='text-2xl font-semibold mb-4 text-slate-800 mt-20 uppercase'>Contact Us</h2>
      <div className='flex items-center mb-4'>
        <SiGmail className='text-2xl mr-2 cursor-pointer' onClick={() => window.location.href = 'mailto:soceanizeit@gmail.com'} />
        <a href='mailto:soceanizeit@gmail.com' className='text-slate-700 hover:underline font-semibold'>findyourestate@gmail.com</a>
      </div>
      <div className='flex items-center'>
        <RiInstagramFill className='text-2xl mr-2 cursor-pointer' onClick={() => window.open('https://www.instagram.com/saagarsocean', '_blank')} />
        <a href='https://www.instagram.com/saagarsocean' target='_blank' rel='noopener noreferrer' className='text-slate-700 hover:underline font-semibold'>@findyourestate</a>
      </div>
    </div>
  )
}
