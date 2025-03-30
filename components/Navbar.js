import Link from 'next/link'
import { HomeIcon, LinkIcon, StickyNoteIcon } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <HomeIcon size={24} />
            <span>Link Dashboard</span>
          </Link>
          <div className="space-x-6">
            <Link href="/links" className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
              <LinkIcon size={18} />
              <span>Links</span>
            </Link>
            <Link href="/notes" className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
              <StickyNoteIcon size={18} />
              <span>Notizen</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
