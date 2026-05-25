'use client';
import { useEffect, useState } from 'react';
import { MerchantServices } from '../merchant-services';
import { Merchant } from '../../../types';

export default function MerchantDetailPage({ merchantId }: { merchantId: string }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    MerchantServices.getMerchantDetail(merchantId).then(setMerchant).catch(console.error);
  }, [merchantId]);

  if (!merchant) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <img src={merchant.coverImageUrl} className="w-full h-64 object-cover rounded-lg" />
      <h1 className="text-3xl font-bold mt-4">{merchant.name}</h1>
      <p className="text-gray-600">{merchant.address}</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Thực đơn (MenuList)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {merchant.menu.map(item => (
          <div key={item.id} className="flex border rounded-lg p-2 gap-4">
            <img src={item.imageUrl} className="w-20 h-20 object-cover rounded" />
            <div>
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-green-600 font-medium">{item.price.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}