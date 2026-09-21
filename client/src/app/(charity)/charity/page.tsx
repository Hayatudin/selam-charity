import React from 'react';

export default function CharityRootPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          🌱
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Charity Portal Foundation</h1>
        <p className="text-sm text-slate-500">
          Architecture initialized. Core services, database models, and API endpoints are linked and ready for UI implementation.
        </p>
      </div>
    </div>
  );
}
