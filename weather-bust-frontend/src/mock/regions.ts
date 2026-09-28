import type { Region } from '../types'

export const MOCK_REGIONS: Region[] = [
  {
    id: 'North India',
    name: 'North India',
    description: 'Gangetic plains, Himalayan foothills, and northwestern arid/semi-arid zones.',
    locationCount: 7,
    primaryTerrain: 'Alluvial plains & Himalayan foothills',
  },
  {
    id: 'South India',
    name: 'South India',
    description: 'Peninsular plateau, Western & Eastern Ghats, and southern coastal belts.',
    locationCount: 7,
    primaryTerrain: 'Peninsular plateau & tropical coastlines',
  },
  {
    id: 'East India',
    name: 'East India',
    description: 'Lower Gangetic basin, Chota Nagpur plateau, and Bay of Bengal coastal delta.',
    locationCount: 6,
    primaryTerrain: 'River deltas & coastal floodplains',
  },
  {
    id: 'West India',
    name: 'West India',
    description: 'Western Ghats rainward slopes, Konkan coast, Deccan plateau, and Thar desert fringes.',
    locationCount: 6,
    primaryTerrain: 'Orographic coastal strips & semi-arid plateau',
  },
  {
    id: 'Central India',
    name: 'Central India',
    description: 'Core monsoon trough zone, Satpura-Vindhya ranges, and central river basins.',
    locationCount: 5,
    primaryTerrain: 'Central highlands & monsoon trough basins',
  },
  {
    id: 'Northeast India',
    name: 'Northeast India',
    description: 'Brahmaputra valley, Meghalaya plateau, and sub-Himalayan rain belts.',
    locationCount: 4,
    primaryTerrain: 'High-precipitation river valleys & steep topography',
  },
]
