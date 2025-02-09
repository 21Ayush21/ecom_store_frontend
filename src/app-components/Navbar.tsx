import React from 'react'

const Navbar = () => {
  return (
    <header className='bg-white shadow-md flex flex-row justify-between items-center p-4'>
        <h1 className='text-2xl font-bold'>Logo</h1>
        <nav>
            <ul className='flex flex-row space-x-4'>
            <li><a href='/login'>Login</a></li>
            <li><a href='/signup'>Sign Up</a></li>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar
