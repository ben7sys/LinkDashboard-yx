import { useState, useEffect } from 'react'
import { ExternalLinkIcon, StickyNoteIcon } from 'lucide-react'

export default function Dashboard() {
  const [links, setLinks] = useState([])
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch links
        const linksRes = await fetch('/api/links')
        const linksData = await linksRes.json()
        
        // Fetch notes
        const notesRes = await fetch('/api/notes')
        const notesData = await notesRes.json()
        
        setLinks(linksData)
        setNotes(notesData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-6 flex justify-center items-center h-40">
          <p className="text-gray-500">Lade Dashboard...</p>
        </div>
      ) : (
        <>
          {/* Links Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Ihre Links</h2>
              <a href="/links" className="text-blue-500 hover:text-blue-700 text-sm">Alle anzeigen</a>
            </div>
            
            {links.length === 0 ? (
              <p className="text-gray-500">Keine Links vorhanden. Fügen Sie Links auf der Links-Seite hinzu.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.slice(0, 4).map((link) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLinkIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-600">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Ihre Notizen</h2>
              <a href="/notes" className="text-blue-500 hover:text-blue-700 text-sm">Alle anzeigen</a>
            </div>
            
            {notes.length === 0 ? (
              <p className="text-gray-500">Keine Notizen vorhanden. Fügen Sie Notizen auf der Notizen-Seite hinzu.</p>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="flex p-3 border border-gray-200 rounded-md">
                    <StickyNoteIcon className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-gray-800 line-clamp-2">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
