'use client'

import React, { useState } from 'react'
import { useChunkerizerStore } from '@/store/settings'
import Aside from "./components/aside"
import Chunkerizer from "./components/chunkerizer"
import { text } from '@/app/components/text'

export default function Home() {
  const [content, setContent] = useState(text)

  const chunkerizerStore = useChunkerizerStore();

  const chunkerize = () => {
    chunkerizerStore.setIsLoading(true)
    try {
      fetch('/api/chunkerize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: content,
          chunkSize: chunkerizerStore.size,
          chunkOverlap: chunkerizerStore.overlap
        })
      }).then(async (resp) => {
        const c = await resp.json()
        chunkerizerStore.setChunks(c.data)
        chunkerizerStore.setIsLoading(false)
        console.log(chunkerizerStore.chunks)
      })
    } catch (error) {
      console.error(error)
      chunkerizerStore.setIsLoading(false)
    }
  }

  const tokenize = async (text: string): Promise<number> => {
    if (!text) return 0;

    try {
      const response = await fetch('/api/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data.tokens;
    } catch (error) {
      console.error('Error fetching token count:', error);
      return 0;
    }
  }

  return (
    <>
      <div className='flex justify-center grid-rows-[auto_1fr]'>
        <div className='grid grid-cols-1 md:grid-cols-5 w-dvw'>
          <Aside chunkerize={chunkerize} tokenize={tokenize} content={content} setContent={setContent} />
          <Chunkerizer chunkerize={chunkerize} />
        </div>
      </div>
    </>
  );
}