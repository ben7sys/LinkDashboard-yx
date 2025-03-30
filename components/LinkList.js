import { ExternalLinkIcon, TagIcon } from 'lucide-react'

export default function LinkList({ links }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {links.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Keine Links vorhanden. Fügen Sie oben neue Links hinzu.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {links.map((link) => (
            <li key={link.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <ExternalLinkIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline font-medium block"
                  >
                    {link.title}
                  </a>
                  <p className="text-sm text-gray-500 mb-2">{link.url}</p>
                  
                  {link.tags && link.tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1 mt-2">
                      <TagIcon className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      {link.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
