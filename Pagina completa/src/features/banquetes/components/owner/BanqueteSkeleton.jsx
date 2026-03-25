const BanqueteSkeleton = () => (
  <div className="card bg-base-200 rounded-[2rem] overflow-hidden animate-pulse">
    <div className="h-56 bg-base-300" />
    <div className="card-body p-7 space-y-4">
      <div className="h-5 bg-base-300 rounded-full w-3/4" />
      <div className="h-3 bg-base-300 rounded-full w-full" />
      <div className="h-3 bg-base-300 rounded-full w-2/3" />
      <div className="flex justify-between mt-6">
        <div className="h-8 bg-base-300 rounded-xl w-24" />
        <div className="h-8 bg-base-300 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

export default BanqueteSkeleton;
