import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { PlusIcon, TagIcon, StickyNoteIcon } from 'lucide-react'

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [viewMode, setViewMode] = useState('all') // 'all' or 'byTag'
  const [selectedTag, setSelectedTag] = useState(null)
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    const res = await fetch('/api/notes')
    const data = await res.json()
    setNotes(data)
    
    // Extract all unique tags
    const uniqueTags = new Set()
    data.forEach(note => {
      note.tags.forEach(tag => {
        uniqueTags.add(tag.name)
      })
    })
    setAllTags(Array.from(uniqueTags))
  }

  const addNote = async (e) => {
    e.preventDefault()
    
    // Process tags
    const tagList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content,
        tags: tagList
      }),
    })
    const data = await res.json()
    setNotes([data, ...notes])
    setContent('')
    setTags('')
    
    // Update all tags
    const newTags = new Set(allTags)
    tagList.forEach(tag => newTags.add(tag))
    setAllTags(Array.from(newTags))
  }

  const filterByTag = (tagName) => {
    setSelectedTag(tagName)
    setViewMode('byTag')
  }

  const resetFilter = () => {
    setSelectedTag(null)
    setViewMode('all')
  }

  const filteredNotes = viewMode === 'byTag' && selectedTag
    ? notes.filter(note => note.tags.some(tag => tag.name === selectedTag))
    : notes

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Notizen-Verwaltung</h1>
      
      <form onSubmit={addNote} className="mb-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Neue Notiz hinzufügen</h2>
        
        <div className="mb-4">
          <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <StickyNoteIcon size={16} className="mr-1" />
            <span>Notiz</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Ihre Notiz hier eingeben..."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="tags" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <TagIcon size={16} className="mr-1" />
            <span>Tags (durch Komma getrennt)</span>
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="wichtig, idee, todo"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional: Fügen Sie Tags hinzu, um Ihre Notizen zu organisieren
          </p>
        </div>
        
        <button 
          type="submit" 
          className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <PlusIcon size={16} />
          <span>Notiz hinzufügen</span>
        </button>
      </form>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TagIcon size={16} className="mr-1" />
            <span>Nach Tags filtern:</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={resetFilter}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                viewMode === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Alle
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => filterByTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  viewMode === 'byTag' && selectedTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500 bg-white shadow rounded-lg p-6 text-center">
            {viewMode === 'byTag' 
              ? `Keine Notizen mit dem Tag "${selectedTag}" gefunden.` 
              : 'Keine Notizen vorhanden.'}
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-white shadow rounded-lg p-4">
              <p className="whitespace-pre-wrap">{note.content}</p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-1 mt-3 mb-1">
                  <TagIcon className="h-3.5 w-3.5 text-gray-400 mr-1" />
                  {note.tags.map((tag) => (
                    <span 
                      key={tag.id} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                      onClick={() => filterByTag(tag.name)}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                Erstellt am: {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  )
}
