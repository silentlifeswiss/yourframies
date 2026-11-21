export interface Review {
  id: string
  author: string
  city: string
  rating: number
  date: string
  title: string
  comment: string
  productTitle: string
  verifiedBuyer: boolean
  userImage?: string
}

export const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Vikramaditya S.',
    city: 'Bengaluru',
    rating: 5,
    date: '3 days ago',
    title: 'Mind-blowing frame quality & safe packaging!',
    comment: 'Ordered the Porsche 911 GT3 RS frame for my home office setup. The matte black wood is solid, corner joints are seamlessly flush, and the anti-glare acrylic looks just like museum glass. Arrived with triple bubble wrap and edge protectors!',
    productTitle: 'Porsche 911 GT3 RS Neon Night Frame',
    verifiedBuyer: true,
  },
  {
    id: 'rev-02',
    author: 'Ananya Mehta',
    city: 'Mumbai',
    rating: 5,
    date: '1 week ago',
    title: 'The customizer preview was 100% accurate',
    comment: 'I uploaded our wedding photo using the live customizer with off-white matting and natural oak frame. The final product delivered by Delhivery looks even more stunning in person. Thank you Your Framies!',
    productTitle: 'Bespoke Studio Custom Frame',
    verifiedBuyer: true,
  },
  {
    id: 'rev-03',
    author: 'Rohan Deshmukh',
    city: 'Pune',
    rating: 5,
    date: '2 weeks ago',
    title: 'Super fast delivery & flawless print finish',
    comment: 'Got the E30 M3 print. Colors are rich and deep without any weird reflections under LED spotlights. COD checkout was smooth and got delivered within 3 days.',
    productTitle: 'Vintage BMW E30 M3 Heritage Edition',
    verifiedBuyer: true,
  },
  {
    id: 'rev-04',
    author: 'Pooja Iyer',
    city: 'Chennai',
    rating: 5,
    date: '3 weeks ago',
    title: 'Best personalized gift ever',
    comment: 'Made a 9-photo memories collage for my parents’ 25th anniversary. They were moved to tears. Premium craft quality and very responsive customer support.',
    productTitle: 'The Memories Collage • 9-Photo Storyboard',
    verifiedBuyer: true,
  },
]
