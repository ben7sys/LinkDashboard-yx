import prisma from '../../lib/prisma'

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      // Erstellen einer neuen Notiz
      const { content, tags } = req.body
      
      // Erstelle die Notiz mit Tags
      const result = await prisma.note.create({
        data: {
          content,
          tags: {
            connectOrCreate: tags?.map(tagName => ({
              where: { name: tagName },
              create: { name: tagName }
            })) || []
          }
        },
        include: {
          tags: true
        }
      })
      
      res.json(result)
    } catch (error) {
      console.error('Error creating note:', error)
      res.status(500).json({ error: 'Failed to create note' })
    }
  } else if (req.method === 'GET') {
    try {
      // Abrufen aller Notizen mit Tags
      const notes = await prisma.note.findMany({
        include: {
          tags: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      res.json(notes)
    } catch (error) {
      console.error('Error fetching notes:', error)
      res.status(500).json({ error: 'Failed to fetch notes' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
