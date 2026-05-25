import { Merchant } from '../../types';

const mockMerchants: Merchant[] = [
  {
    id: 'm1',
    name: 'Quán Nướng BBQ Bụi',
    address: '123 Đường ABC, Quận 1',
    rating: 4.5,
    coverImageUrl: 'https://picsum.photos/600/300',
    menu: [
      { id: 'f1', name: 'Sườn nướng tảng', price: 150000, imageUrl: 'https://picsum.photos/100/100' },
      { id: 'f2', name: 'Hải sản nướng', price: 200000, imageUrl: 'https://picsum.photos/101/101' }
    ]
  },
  {
    id: 'm2',
    name: 'Trà Sữa Mây Trắng',
    address: '456 Đường XYZ, Quận 3',
    rating: 4.8,
    coverImageUrl: 'https://picsum.photos/601/300',
    menu: [
      { id: 'f3', name: 'Trà sữa trân châu', price: 45000, imageUrl: 'https://picsum.photos/102/102' }
    ]
  }
];

export const MerchantServices = {
  getMerchants: async (): Promise<Merchant[]> => {
    return mockMerchants;
  },

  getMerchantDetail: async (id: string): Promise<Merchant> => {
    const merchant = mockMerchants.find(m => m.id === id);
    if (!merchant) throw new Error('Không tìm thấy quán');
    return merchant;
  }
};