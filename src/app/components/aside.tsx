'use client'

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

import { text } from './text';
import { Label } from "@/components/ui/label"
import { ModeToggle } from './theme-switch';
import { useChunkerizerStore } from '@/store/settings';

export default function Aside({
  chunkerize,
  tokenize,
  content,
  setContent
}: {
  chunkerize: () => void,
  tokenize: (text: string) => Promise<number>,
  content: string,
  setContent: (content: string) => void
}
) {

  const chunkerizerStore = useChunkerizerStore();

  return (
    <aside className='border-l col-span-full md:col-span-1 relative font-space-grotesk order-2'>
      <div className='grid gap-3'>
        <header className='p-3 z-10 border-b items-center flex gap-2 relative justify-between h-12'>
          <p className="text-xs uppercase tracking-wide text-default-500 flex items-center gap-1">
            <Cog6ToothIcon className='w-4 h-4' />
            <span>Settings</span>
          </p>
          <ModeToggle />
        </header>
        <div className='py-3 px-6'>
          <div className='grid gap-6'>
            <div>
              <label>Chunk Size</label>
              <Slider
                defaultValue={[chunkerizerStore.size]}
                max={1024}
                min={64}
                step={16}
                onValueChange={(value: number[]) => {
                  chunkerizerStore.setSize(value[0])
                }}
                onValueCommit={() => chunkerize()}
              />
              <span>{chunkerizerStore.size}</span>
            </div>
            <div>
              <label>Chunk Overlap</label>
              <Slider
                defaultValue={[chunkerizerStore.overlap]}
                max={chunkerizerStore.size / 2}
                min={0}
                step={8}
                onValueChange={(value: number[]) => {
                  chunkerizerStore.setOverlap(value[0])
                }}
                onValueCommit={() => chunkerize()}
              />
              <span>
                {
                  chunkerizerStore.overlap
                }
              </span>
            </div>
            <div>
              <Label htmlFor="message">Your message</Label>
              <Textarea
                className='text-sm resize-none'
                value={content}
                defaultValue={content}
                onChange={(e) => {
                  setContent(e.target.value)
                }}
              />
            </div>
            <Button
              onClick={async () => {
                chunkerize()
                chunkerizerStore.setContentTokens(await tokenize(text))
              }}
              disabled={chunkerizerStore.isLoading}
            >chunkerize</Button>
          </div>
        </div>
      </div>
    </aside>
  );
}