import { useState } from 'react'
import { PlusIcon, TagIcon } from 'lucide-react'

export default function LinkForm({ onSubmit }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Process tags
    const tagList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    onSubmit({ url, title, tags: tagList })
    setUrl('')
    setTitle('')
    setTags('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Neuen Link hinzufügen</h2>
      
      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Meine Webseite"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
          placeholder="arbeit, projekt, referenz"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional: Fügen Sie Tags hinzu, um Ihre Links zu organisieren
        </p>
      </div>
      
      <button 
        type="submit" 
        className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <PlusIcon size={16} />
        <span>Link hinzufügen</span>
      </button>
    </form>
  )
}
