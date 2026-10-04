import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Info,
  Calendar,
  Globe,
  Heart,
  Activity,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  PawPrint,
  Clock,
  ShieldCheck,
  X
} from 'lucide-react';
import { CAT_BREEDS_DIRECTORY, CatBreedInfo } from '../data/catBreedsData';

interface CatBreedsDirectoryProps {
  onSelectBreedForListing?: (breedName: string) => void;
  viewerRole?: 'adopter' | 'shelter' | 'admin';
  onFilterCatsByBreed?: (breedName: string) => void;
}

export const CatBreedsDirectory: React.FC<CatBreedsDirectoryProps> = ({
  onSelectBreedForListing,
  viewerRole = 'adopter',
  onFilterCatsByBreed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('All');
  const [selectedBreedModal, setSelectedBreedModal] = useState<CatBreedInfo | null>(null);

  const filteredBreeds = CAT_BREEDS_DIRECTORY.filter((cat) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBreed = cat.breed.toLowerCase().includes(q);
      const matchOrigin = cat.origin.toLowerCase().includes(q);
      const matchTemp = cat.temperament.toLowerCase().includes(q);
      if (!matchBreed && !matchOrigin && !matchTemp) return false;
    }
    if (selectedActivity !== 'All' && cat.activityLevel !== selectedActivity) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Stats */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <PawPrint className="w-3.5 h-3.5 fill-current" />
              <span>Official Feline Companion Encyclopedia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Cat Breeds &amp; Origin Directory
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Explore 10 globally recognized feline breeds, their geographical heritage, average life expectancies, and temperament profiles to match adopters with their ideal companion.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-2xl font-black text-white">10</span>
              <span className="text-[10px] uppercase font-bold text-purple-200 tracking-wider">Breeds Cataloged</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-2xl font-black text-white">8–20</span>
              <span className="text-[10px] uppercase font-bold text-purple-200 tracking-wider">Years Lifespan Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search breed by name, origin country, or temperament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-800"
          />
        </div>

        {/* Activity Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0">Activity:</span>
          {['All', 'Calm & Gentle', 'Playful & Social', 'Very Active & Vocal', 'Affectionate & Docile'].map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActivity(act)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedActivity === act
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Official Cat Breeds Table View (matches prompt specs) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Standard Cat Breeds Reference Table</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                10 Verified Records
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official reference table for shelter medical intake, shelter pet listings, and prospective adopter match screening.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">No.</th>
                <th className="py-3 px-3">Cat Breed</th>
                <th className="py-3 px-3">Origin / Where Found</th>
                <th className="py-3 px-3">Average Lifespan</th>
                <th className="py-3 px-3">Temperament &amp; Traits</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBreeds.map((cat) => (
                <tr
                  key={cat.no}
                  className="hover:bg-purple-50/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedBreedModal(cat)}
                >
                  <td className="py-3.5 px-3 text-center font-bold text-slate-400 font-mono">
                    {cat.no}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.imageUrl}
                        alt={cat.breed}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-xs block group-hover:text-purple-700 transition-colors">
                          {cat.breed}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {cat.coatType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{cat.origin}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{cat.lifespan}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs">
                    <p className="text-slate-600 line-clamp-1">{cat.temperament}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-purple-700">
                      #{cat.activityLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBreedModal(cat)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Breed Details
                      </button>
                      {viewerRole === 'shelter' && onSelectBreedForListing && (
                        <button
                          onClick={() => onSelectBreedForListing(cat.breed)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Use for Pet</span>
                        </button>
                      )}
                      {viewerRole === 'adopter' && onFilterCatsByBreed && (
                        <button
                          onClick={() => onFilterCatsByBreed(cat.breed)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Find {cat.breed}s
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of Visual Breed Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Visual Breed Showcase</h3>
            <p className="text-xs text-slate-500">In-depth profiles, dietary needs, grooming routines, and personality profiles.</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredBreeds.length} of 10 Breeds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredBreeds.map((cat) => (
            <div
              key={cat.no}
              onClick={() => setSelectedBreedModal(cat)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img
                    src={cat.imageUrl}
                    alt={cat.breed}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    #{cat.no}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {cat.lifespan}
                  </span>
                </div>

                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                      {cat.breed}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{cat.origin}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                    {cat.temperament}
                  </p>

                  <div className="p-2 bg-slate-50 rounded-xl space-y-1 text-[10px] text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weight:</span>
                      <span className="font-semibold text-slate-700">{cat.weightRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Coat:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[120px]">{cat.coatType}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBreedModal(cat);
                  }}
                  className="w-full py-1.5 bg-slate-100 group-hover:bg-purple-50 text-slate-700 group-hover:text-purple-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Explore Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: IN-DEPTH BREED PROFILE ================= */}
      {selectedBreedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                  #{selectedBreedModal.no}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedBreedModal.breed} Cat Guide
                  </h3>
                  <p className="text-xs text-slate-500">
                    Heritage: {selectedBreedModal.origin} • Lifespan: {selectedBreedModal.lifespan}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBreedModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo & Quick Overview Banner */}
            <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={selectedBreedModal.imageUrl}
                alt={selectedBreedModal.breed}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    Feline Breed Spotlight
                  </span>
                  <h4 className="text-xl font-bold">{selectedBreedModal.breed}</h4>
                  <p className="text-xs text-slate-200">{selectedBreedModal.temperament}</p>
                </div>
              </div>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[10px] text-purple-600 block font-semibold">Origin</span>
                <span className="font-bold text-slate-900">{selectedBreedModal.origin}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-600 block font-semibold">Lifespan</span>
                <span className="font-bold text-slate-900">{selectedBreedModal.lifespan}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-600 block font-semibold">Avg Weight</span>
                <span className="font-bold text-slate-900">{selectedBreedModal.weightRange}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[10px] text-blue-600 block font-semibold">Activity</span>
                <span className="font-bold text-slate-900 truncate block">{selectedBreedModal.activityLevel}</span>
              </div>
            </div>

            {/* Coat & Care Guidance */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Coat Characteristics</span>
                </h5>
                <p className="text-slate-600 leading-relaxed">{selectedBreedModal.coatType}</p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
                <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <span>Care, Nutrition &amp; Grooming Recommendations</span>
                </h5>
                <p className="text-emerald-900 leading-relaxed">{selectedBreedModal.careTips}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedBreedModal(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Close Reference
              </button>
              {viewerRole === 'shelter' && onSelectBreedForListing && (
                <button
                  onClick={() => {
                    onSelectBreedForListing(selectedBreedModal.breed);
                    setSelectedBreedModal(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <PawPrint className="w-4 h-4" />
                  <span>Add {selectedBreedModal.breed} to Shelter</span>
                </button>
              )}
              {viewerRole === 'adopter' && onFilterCatsByBreed && (
                <button
                  onClick={() => {
                    onFilterCatsByBreed(selectedBreedModal.breed);
                    setSelectedBreedModal(null);
                  }}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Browse Available {selectedBreedModal.breed}s</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
