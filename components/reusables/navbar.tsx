import { Search, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <div className="w-full border rounded h-12 flex items-center justify-between px-4 shadow-sm mt-4">
      <Link href="/">
        <div className="text-lg font-bold cursor-pointer">Spicyanime</div>
      </Link>
      <div className="flex gap-4">
        <Link href="/search">
              <Button variant="ghost" size={'icon'} className="p-1">
            <Search className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/user">
          <Button variant="ghost" size={'icon'} className="p-1">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
