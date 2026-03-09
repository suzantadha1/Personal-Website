import React from 'react'

import Link from 'next/link';

export default function Projects() {
  return (
    <div className='about-page'>
      <Link href="/menu" className='back-button'>Back</Link>
      <h1 className='about-title'>Projects</h1>

      <p className='about-text'>Here are some of the projects I have worked on:</p>
      </div>
  )
} 