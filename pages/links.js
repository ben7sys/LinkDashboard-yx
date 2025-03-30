import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LinkForm from '../components/LinkForm'
import LinkList from '../components/LinkList'
import { TagIcon, GridIcon, ListIcon } from 'lucide-react'

export default function LinksPage() {
  const [links, setLinks] = useState([])
  const [viewMode, setViewMode] = useState('all') // 'all' or 'byTag'
  const [selectedTag, setSelectedTag] = useState(null)
  const [allTags, setAllTags] = useState([])
  const [layoutMode, setLayoutMode] = useState('list') // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const res = await fetch('/api/links')
    const data = await res.json()
    setLinks(data)
    
    // Extract all unique tags
    const uniqueTags = new Set()
    data.forEach(link => {
      link.tags.forEach(tag => {
        uniqueTags.add(tag.name)
      })
    })
    setAllTags(Array.from(uniqueTags))
  }

  const addLink = async (newLink) => {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLink),
    })
    const data = await res.json()
    setLinks([data, ...links])
    
    // Update all tags
    const newTags = new Set(allTags)
    newLink.tags.forEach(tag => newTags.add(tag))
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

  // Filter links based on selected tag and search term
  const filteredLinks = links
    .filter(link => {
      // Filter by tag if in tag view mode
      if (viewMode === 'byTag' && selectedTag) {
        return link.tags.some(tag => tag.name === selectedTag)
      }
      return true
    })
    .filter(link => {
      // Filter by search term if one exists
      if (searchTerm.trim() === '') return true
      
      const term = searchTerm.toLowerCase()
      return (
        link.title.toLowerCase().includes(term) || 
        link.url.toLowerCase().includes(term) ||
        link.tags.some(tag => tag.name.toLowerCase().includes(term))
      )
    })

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Link-Verwaltung</h1>
      
      <LinkForm onSubmit={addLink} />
      
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Links durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 absolute left-2.5 top-3 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Layout Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Layout:</span>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded ${layoutMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Listenansicht"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded ${layoutMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Rasteransicht"
            >
              <GridIcon size={18} />
            </button>
          </div>
        </div>
        
        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div>
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
      </div>
      
      <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
        <LinkList links={filteredLinks} />
      </div>
    </Layout>
  )
}
