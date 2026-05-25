'use client';
import { useEffect, useState } from 'react';
import { MerchantServices } from '../merchant-services';
import { Merchant } from '../../../types';
import { Link } from 'react-router';

export default function MerchantListPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    MerchantServices.getMerchants().then(setMerchants).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {merchants.map(merchant => (
        <Link to={`/merchant/${merchant.id}`} key={merchant.id}>
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <img src={merchant.coverImageUrl} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{merchant.name}</h3>
              <p className="text-gray-500 text-sm">{merchant.address}</p>
              <p className="text-yellow-500 mt-2">⭐ {merchant.rating}/5.0</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}