import React, { useState } from 'react';
import { usePetVerification } from '../../context/PetVerificationContext';
import { ShelterPet, PetVerificationStatus } from '../../types/petVerification';
import { StatusBadge } from './StatusBadge';
import { RejectionReasonModal } from './RejectionReasonModal';
import { PetVerificationDetailsModal } from './PetVerificationDetailsModal';
import {
  PawPrint,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CalendarCheck,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ShelterMyPetsPageProps {
  onAddNewPetClick: () => void;
}

export const ShelterMyPetsPage: React.FC<ShelterMyPetsPageProps> = ({ onAddNewPetClick }) => {
  const { pets } = usePetVerification();

  const [activeTab, setActiveTab] = useState<'All' | PetVerificationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [selectedPetForDetails, setSelectedPetForDetails] = useState<ShelterPet | null>(null);
  const [rejectionModalPet, setRejectionModalPet] = useState<ShelterPet | null>(null);

  // Filter logic
  const filteredPets = pets.filter((pet) => {
    const matchesTab = activeTab === 'All' ? true : pet.status === activeTab;
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.shelterName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusCounts = () => {
    return {
      all: pets.length,
      pending: pets.filter((p) => p.status === 'Pending Verification').length,
      scheduled: pets.filter((p) => p.status === 'Verification Scheduled').length,
      verified: pets.filter((p) => p.status === 'Verified').length,
      rejected: pets.filter((p) => p.status === 'Rejected').length,
      available: pets.filter((p) => p.status === 'Available for Adoption').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Title and Add Pet CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Shelter Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-900 font-semibold">My Added Pets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Shelter Pet Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage all shelter companions submitted for physical verification and public adoption.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNewPetClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pet for Adoption</span>
        </button>
      </div>

      {/* Trust & Transparency Policy Callout */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Adopter Visibility Criterion</p>
            <p className="text-slate-600">
              Only pets with status <span className="font-bold text-teal-800">Available for Adoption</span>{' '}
              (Physically Verified + Admin Approved) appear in the public search directory.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-medium text-slate-500">
          <span>Active Registry Count:</span>
          <span className="font-mono font-bold text-slate-900">{pets.length} Pets</span>
        </div>
      </div>

      {/* Search Bar & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pet name, breed, ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-200">
        {[
          { key: 'All', label: 'All Pets', count: counts.all },
          { key: 'Pending Verification', label: '🟡 Pending Verification', count: counts.pending },
          { key: 'Verification Scheduled', label: '🔵 Scheduled', count: counts.scheduled },
          { key: 'Verified', label: '🟢 Verified', count: counts.verified },
          { key: 'Available for Adoption', label: '✨ Available', count: counts.available },
          { key: 'Rejected', label: '🔴 Rejected', count: counts.rejected },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.key ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredPets.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <PawPrint className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No pets match this filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or status filter to view other shelter pets in the pipeline.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* TABLE VIEW (as requested in Section 2) */}
      {viewMode === 'table' && filteredPets.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Pet Photo
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Pet Name
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Breed
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Age
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Submission Date
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Verification Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPets.map((pet) => {
                  const isRejected = pet.status === 'Rejected';

                  return (
                    <tr
                      key={pet.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Pet Photo */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={pet.photoUrl}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>

                      {/* Pet Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {pet.name}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block">{pet.id}</span>
                      </td>

                      {/* Breed */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div>{pet.breed}</div>
                        <span className="text-[11px] text-slate-400">{pet.gender}</span>
                      </td>

                      {/* Age */}
                      <td className="py-3 px-4 text-slate-700 font-mono">
                        {pet.age}
                      </td>

                      {/* Submission Date */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {pet.submissionDate}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={pet.status} size="sm" />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* For rejected pets show: "View Rejection Reason" (Section 2) */}
                          {isRejected && (
                            <button
                              type="button"
                              onClick={() => setRejectionModalPet(pet)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>View Rejection Reason</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedPetForDetails(pet)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CARD GRID VIEW (alternative responsive layout) */}
      {viewMode === 'cards' && filteredPets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPets.map((pet) => {
            const isRejected = pet.status === 'Rejected';

            return (
              <div
                key={pet.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-base font-bold text-slate-900 truncate">{pet.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{pet.id}</span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {pet.breed} · {pet.age}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pet.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-b border-slate-100 my-3 text-xs">
                    <span className="text-slate-400">Status:</span>
                    <StatusBadge status={pet.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {pet.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Added: {pet.submissionDate}
                  </span>

                  <div className="flex items-center gap-2">
                    {isRejected && (
                      <button
                        type="button"
                        onClick={() => setRejectionModalPet(pet)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Rejection Reason</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedPetForDetails(pet)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details & Lifecycle Modal */}
      {selectedPetForDetails && (
        <PetVerificationDetailsModal
          pet={selectedPetForDetails}
          onClose={() => setSelectedPetForDetails(null)}
        />
      )}

      {/* View Rejection Reason Modal */}
      {rejectionModalPet && (
        <RejectionReasonModal
          pet={rejectionModalPet}
          mode="view"
          onClose={() => setRejectionModalPet(null)}
        />
      )}
    </div>
  );
};
