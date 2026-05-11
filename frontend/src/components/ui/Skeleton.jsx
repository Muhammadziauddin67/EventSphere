import React from 'react'

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
)

export const EventCardSkeleton = () => (
  <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
    <Skeleton className='h-40 w-full rounded-none' />
    <div className='p-4 space-y-2'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-3 w-1/2' />
      <Skeleton className='h-3 w-2/3' />
      <div className='flex justify-between items-center mt-4 pt-3 border-t border-gray-100'>
        <Skeleton className='h-3 w-16' />
        <Skeleton className='h-8 w-16' />
      </div>
    </div>
  </div>
)

export const TicketSkeleton = () => (
  <div className='bg-white rounded-xl border border-gray-100 p-5 flex gap-5'>
    <Skeleton className='w-28 h-28 flex-shrink-0' />
    <div className='flex-1 space-y-2'>
      <Skeleton className='h-5 w-2/3' />
      <Skeleton className='h-3 w-1/2' />
      <Skeleton className='h-3 w-1/3' />
      <div className='flex justify-between pt-4 border-t border-gray-100'>
        <Skeleton className='h-3 w-32' />
        <Skeleton className='h-3 w-16' />
      </div>
    </div>
  </div>
)

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className='border-b border-gray-50'>
    {Array(cols).fill(0).map((_, i) => (
      <td key={i} className='px-5 py-4'>
        <Skeleton className='h-4 w-full' />
      </td>
    ))}
  </tr>
)