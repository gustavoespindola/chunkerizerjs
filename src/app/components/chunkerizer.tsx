'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useChunkerizerStore } from '@/store/settings';
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BookOpenIcon, Cog6ToothIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface OverlapResult {
  chunk: { text: string; tokens: number }
  overlap: { text: string; tokens: number }
  prevOverlap?: { text: string; tokens: number }
}

export default function Chunkerizer({
  chunkerize,
}: {
  chunkerize: () => void
}) {

  const chunkerizerStore = useChunkerizerStore();

  const highlightOverlap = (chunks: string[]) => {
    // Convert each chunk into an array of words
    if (!chunks) return;

    if (!chunkerizerStore.overlap) {
      return chunks.map((chunk, i) => {
        return (
          <li key={i}>
            <p>{chunk}</p>
          </li>
        )
      });
    }

    const list = chunks.map((chunk) => chunk.split(' '));

    const overlapList = list.map((chunk, i) => {

      const nextChunk = list[i + 1];

      // If there's no next chunk, return the current chunk without overlap
      if (!nextChunk) return { chunk: { text: chunk.join(' '), tokens: 0 }, overlap: { text: '', tokens: 0 } };

      // Find the first 5 words of the next chunk
      const nextChunkStartWords = nextChunk.slice(0, 5);

      // Find the index in the current chunk where the first few words of the next chunk start appearing
      const overlapStartIndex = chunk.findIndex((word, j) => {
        return nextChunkStartWords.includes(word);
      });

      // If no overlap is found, return the current chunk without overlap
      if (overlapStartIndex === -1) {
        return { chunk: { text: chunk.join(' '), tokens: 0 }, overlap: { text: '', tokens: 0 } };
      }

      // The overlap is the substring of the current chunk starting from the overlap start index
      const overlap = chunk.slice(overlapStartIndex).join(' ');

      const result: OverlapResult = {
        chunk: { text: chunk.join(' '), tokens: 0 },
        overlap: { text: overlap, tokens: 0 },
      };
      return result;
    });

    const listWithPrevOverlap = overlapList.map((overlap, i) => {
      if (i === 0) return overlap;

      const prevOverlap = overlapList[i - 1].overlap;
      return { ...overlap, prevOverlap };
    })

    const render = listWithPrevOverlap.map(({ chunk, overlap, prevOverlap }, i) => {
      return (
        <li key={i}>
          <p className='relative'>
            {prevOverlap &&
              <span className='border-l-4 pl-2 border-fuchsia-500 font-[300] bg-fuchsia-500/20 text-fuchsia-950 break-normal'>
                <span className='text-[9px] font-space-grotesk w-16 text-right border rounded-md border-fuchsia-500 px-1 leading-tight text-fuchsia-900 align-[3px] mr-1 whitespace-nowrap'>from Prev Chunk</span>
                {prevOverlap.text}
              </span>
            }
            <span className='font-[300]'>
              {(() => {
                let text = chunk.text;
                if (overlap.text) {
                  text = text.replace(overlap.text, '');
                }
                if (prevOverlap && prevOverlap.text) {
                  text = text.replace(prevOverlap.text, '');
                }
                return text;
              })()}
            </span>
            {
              overlap.text &&
              <span className='relative border-l-4 pl-2 border-yellow-500 font-[300] bg-yellow-400/20 text-yellow-950 break-normal'>
                <span className='text-[9px] font-space-grotesk w-16 text-right border rounded-md border-yellow-500 px-1 leading-tight text-yellow-900 align-[3px] mr-1 break-normal whitespace-nowrap'>from next Chunk</span>
                {overlap.text}
              </span>
            }
          </p>
        </li>
      )
    });

    return render;
  };

  return (
    <main className='grid col-span-full md:col-span-4 items-start grid-rows-[auto_1fr] relative h-dvh'>
      <section className='grid gap-3 font-space-grotesk p-3 border-b z-10 backdrop-blur-sm h-12'>
        <div className='flex gap-2 justify-between items-center'>
          <div className=''>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  ✂️
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>TextSplitter</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>SentenceSplitter</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className='flex justify-end items-center gap-4'>
            <p className="text-xs uppercase flex gap-1 items-center">
              {
                chunkerizerStore.isLoading ? (
                  <Skeleton className="w-2.5 h-2.5 bg-gray-300 rounded-xl" />
                ) : (
                  <span>{chunkerizerStore.chunks.length}</span>
                )
              }
              <span>Chunks</span>
            </p>
            <div className="h-4 w-[1px] bg-content4" />
            <p className='text-xs uppercase flex gap-1 items-center'>
              {
                chunkerizerStore.isLoading ? (
                  <Skeleton className="w-2.5 h-2.5 bg-gray-300 rounded-xl" />
                ) : (
                  <span>{chunkerizerStore.contentTokens ?? 0}</span>
                )
              }
              <span className='text-xs'>Tokens</span>
            </p>
          </div>
        </div>
      </section>
      <ScrollShadow className="grid max-h-screen h-full py-8 items-start">
        {
          chunkerizerStore.isLoading && (<div className="mb-auto">
            <div className='flex flex-col gap-3 items-start py-8 w-full max-w-xl mx-auto'>
              <Skeleton className='w-full bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-5/6 bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-full bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-4/6 bg-gray-300 h-4 rounded-xl' />
            </div>
            <div className='flex flex-col gap-3 items-start py-8 w-full max-w-xl mx-auto'>
              <Skeleton className='w-full bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-5/6 bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-full bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-4/6 bg-gray-300 h-4 rounded-xl' />
            </div>
            <div className='flex flex-col gap-3 items-start py-8 w-full max-w-xl mx-auto'>
              <Skeleton className='w-full bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-5/6 bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-full bg-gray-300 h-4 rounded-xl' />
              <Skeleton className='w-4/6 bg-gray-300 h-4 rounded-xl' />
            </div>
          </div>)
        }
        {
          chunkerizerStore.chunks.length === 0 && !chunkerizerStore.isLoading && (
            <div className="mx-auto mb-auto rounded-3xl border px-6 py-8 w-full max-w-xl grid gap-4">
              <h2 className="text-sm text-default-500">Split with Precision</h2>
              <p className="text-xl font-noto-serif">
                Visualize the overlap between chunks to ensure that the split is done with precision.
              </p>
              <Separator />
              <h2 className="text-sm text-default-500">How to use</h2>
              <ol className='grid gap-4 text-md leading-tight list-decimal font-noto-serif px-4'>
                <li className=""><p className="flex justify-between items-center">
                  Enter your text in the input box
                  <BookOpenIcon className="w-4 h-4 shrink-0" /></p></li>
                <li className=""><p className="flex justify-between items-center">
                  Adjust the chunk size and overlap live
                  <Cog6ToothIcon className="w-4 h-4 shrink-0" /></p></li>
                <li className=""><p className="flex justify-between items-center">
                  Click on the chunk button
                  <SparklesIcon className="w-4 h-4 shrink-0" /></p></li>
              </ol>
              <Separator />
              <div className="flex gap-2 items-center">
                <Button className='w-fit' variant="outline" onClick={() => chunkerize()}>Run a demo</Button>
                <span className="text-xs text-default-400">From a text from Wikipedia</span>
              </div>
            </div>
          )
        }
        {
          !chunkerizerStore.isLoading && chunkerizerStore.chunks.length !== 0 &&
          <div className='max-w-2xl mx-auto'>
            <ol className='grid gap-4 text-md leading-tight list-decimal font-noto-serif'>
              {highlightOverlap(chunkerizerStore.chunks)}
            </ol>
          </div>
        }
      </ScrollShadow>
    </main>
  );
}