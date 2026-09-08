import { withBase } from '../utils/assetPath.js'

export const featuredProjects = [
  {
    image: withBase('/assets/images/featured1.png'),
    title: 'RESIDENTIAL HOUSE',
    location: 'Santa Barbara, Victoria, Tarlac',
  },
  {
    image: withBase('/assets/images/featured2.png'),
    title: 'RESIDENTIAL HOUSE',
    location: 'Dinorado St., Palayan, Payatas A, Quezon City',
  },
  {
    image: withBase('/assets/images/featured3.png'),
    title: 'MODERN TROPICAL RESIDENTIAL HOUSE',
    location: 'Vicente Rama Ave., Busay Poblacion, Cebu City',
  },
  {
    image: withBase('/assets/images/featured4.png'),
    title: 'ZERO-WASTE CAFE',
    location: 'Isabelo Mendoza Street, Barangay San Roque, Marikina City',
  },
]

export const ongoingProjects = [
  { num: '01', desc: ['Residential,', 'Tarlac'] },
  { num: '02', desc: ['Commercial,', 'Bataan'] },
  { num: '03', desc: ['Food Court'] },
]

export const galleryProjects = [
  {
    id: '1',
    reverse: false,
    image: withBase('/assets/images/bedroom-render-8sqm-tarlac.jpg'),
    imageAlt: 'Renovation of an 8 sqm. Bedroom',
    title: 'Renovation of an 8 sqm Bedroom',
    location: 'Location: Santa Barbara, Victoria, Tarlac',
    description:
      'The design focuses on both function and style, creating a simple yet cozy bedroom. It makes the most of the small space while keeping it bright, comfortable, and pleasing to the eye.',
    galleryTitle: 'Renovation of an 8 sqm Bedroom',
    galleryImages: [
      withBase('/assets/images/tropical-residence-render-cebu.jpg'),
      withBase('/assets/images/bedroom-render-interior-02.jpg'),
      withBase('/assets/images/bedroom-render-interior-04.jpg'),
      withBase('/assets/images/bedroom-render-interior-06.jpg'),
    ],
  },
  {
    id: '2',
    reverse: true,
    image: withBase('/assets/images/bedroom-render-17sqm-main-quezon-city.jpg'),
    imageAlt: 'Renovation of an 17 sqm. Bedroom',
    title: 'Renovation of an 17 sqm Bedroom',
    location: 'Location: Dinorado St., Palayan, Payatas A, Quezon City',
    description:
      'The design highlights comfort and function while keeping a clean and modern look. It uses space wisely to create a relaxing and stylish bedroom that feels warm and inviting.',
    galleryTitle: 'Renovation of an 17 sqm Bedroom',
    galleryImages: [
      withBase('/assets/images/bedroom-render-17sqm-quezon-city.jpg'),
      withBase('/assets/images/bedroom-render-after-quezon-city.jpg'),
      withBase('/assets/images/bedroom-render-interior-05.jpg'),
      withBase('/assets/images/zero-waste-cafe-render-marikina.jpg'),
    ],
  },
  {
    id: '3',
    reverse: false,
    image: withBase('/assets/images/bedroom-render-17sqm-quezon-city.jpg'),
    imageAlt: 'Modern Tropical Residential House',
    title: 'Modern Tropical RH',
    location: 'Location: Vicente Rama Ave., Busay Poblacion, Cebu City',
    description:
      'The design combines natural elements with a modern touch, creating a bright and airy tropical home. It focuses on comfort, openness, and harmony with the surroundings.',
    galleryTitle: 'Modern Tropical RH Gallery',
    galleryImages: [
      withBase('/assets/images/bedroom-render-interior-02.jpg'),
      withBase('/assets/images/bedroom-render-interior-04.jpg'),
      withBase('/assets/images/tropical-residence-render-cebu.jpg'),
      withBase('/assets/images/zero-waste-cafe-render-marikina.jpg'),
    ],
  },
  {
    id: '4',
    reverse: true,
    image: withBase('/assets/images/contactimg.png'),
    imageAlt: 'Zero Waste Cafe Interior Design',
    title: 'Zero Waste Cafe',
    location: 'Location: Isabelo Mendoza, San Roque, Marikina City',
    description:
      'The design uses natural materials and soft tones to create a cozy, eco-friendly café that promotes sustainable living. People can relax and enjoy a mindful dining experience.',
    galleryTitle: 'Zero Waste Cafe Gallery',
    galleryImages: [
      withBase('/assets/images/bedroom-render-17sqm-main-quezon-city.jpg'),
      withBase('/assets/images/bedroom-render-8sqm-tarlac.jpg'),
      withBase('/assets/images/bedroom-render-after-quezon-city.jpg'),
      withBase('/assets/images/zero-waste-cafe-render-interior.jpg'),
    ],
  },
]

export const beforeAfterProjects = [
  {
    id: '1',
    label: 'PROJECT 1',
    before: withBase('/assets/images/before-8sqm-bedroom-renovation-tarlac.jpg'),
    after: withBase('/assets/images/bedroom-render-8sqm-tarlac.jpg'),
  },
  {
    id: '2',
    label: 'PROJECT 2',
    before: withBase('/assets/images/before-17sqm-bedroom-renovation-quezon-city.png'),
    after: withBase('/assets/images/bedroom-render-after-quezon-city.jpg'),
  },
  {
    id: '3',
    label: 'PROJECT 3',
    before: withBase('/assets/images/before-modern-tropical-residence-cebu.png'),
    after: withBase('/assets/images/tropical-residence-render-cebu.jpg'),
  },
  {
    id: '4',
    label: 'PROJECT 4',
    before: withBase('/assets/images/before-zero-waste-cafe-marikina.png'),
    after: withBase('/assets/images/zero-waste-cafe-render-marikina.jpg'),
  },
]
