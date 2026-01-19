// Shared Constants
// Add common constants used by both frontend and backend here

export const API_VERSION = 'v1'

export const IDEA_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IMPLEMENTED: 'implemented',
} as const

export const IDEA_CATEGORIES = [
  'feature',
  'improvement',
  'bug-fix',
  'documentation',
  'community',
  'other',
] as const

export const COTI_NETWORKS = {
  TESTNET: {
    id: 7082400,
    name: 'COTI Testnet',
    rpcUrl: 'https://testnet.coti.io/rpc',
    blockExplorer: 'https://testnet.cotiscan.io',
  },
  MAINNET: {
    id: 2632500,
    name: 'COTI Mainnet',
    rpcUrl: 'https://mainnet.coti.io/rpc',
    blockExplorer: 'https://mainnet.cotiscan.io',
  },
} as const

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const
