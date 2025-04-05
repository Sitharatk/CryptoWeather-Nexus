// pages/city/[id].js

import { useRouter } from 'next/router';

const CityDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-white">City Details - {id}</h1>
      {/* Fetch and render city details based on the id */}
    </div>
  );
};

export default CityDetails;
