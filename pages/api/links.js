import prisma from '../../lib/prisma'

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      // Erstellen eines neuen Links
      const { url, title, tags } = req.body
      
      // Erstelle den Link mit Tags
      const result = await prisma.link.create({
        data: {
          url,
          title,
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
      console.error('Error creating link:', error)
      res.status(500).json({ error: 'Failed to create link' })
    }
  } else if (req.method === 'GET') {
    try {
      // Abrufen aller Links mit Tags
      const links = await prisma.link.findMany({
        include: {
          tags: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      res.json(links)
    } catch (error) {
      console.error('Error fetching links:', error)
      res.status(500).json({ error: 'Failed to fetch links' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
