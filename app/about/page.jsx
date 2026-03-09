import React from 'react'

import Link from 'next/link';

export default function about() {
  return (
    <div className='about-page'>
      <Link href="/menu" className='back-button'>Back</Link>
      <h1 className='about-title'>About Me</h1>

      <p className='about-text'>My name is Suzan Tadha and I am a Computer Science student at UIC.
        I enjoy learning new programming languages and building projects
        that help me improve my problem solving skills. I have experience
        with Java, JavaScript, Python, HTML/CSS, and C++, and I am excited
        to continue expanding my knowledge in software development. <br></br> </p>
    </div>
  )
}
