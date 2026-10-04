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
import { DOG_BREEDS_DIRECTORY, DogBreedInfo } from '../data/dogBreedsData';

interface DogBreedsDirectoryProps {
  onSelectBreedForListing?: (breedName: string) => void;
  viewerRole?: 'adopter' | 'shelter' | 'admin';
  onFilterDogsByBreed?: (breedName: string) => void;
}

export const DogBreedsDirectory: React.FC<DogBreedsDirectoryProps> = ({
  onSelectBreedForListing,
  viewerRole = 'adopter',
  onFilterDogsByBreed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('All');
  const [selectedBreedModal, setSelectedBreedModal] = useState<DogBreedInfo | null>(null);

  const filteredBreeds = DOG_BREEDS_DIRECTORY.filter((dog) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBreed = dog.breed.toLowerCase().includes(q);
      const matchOrigin = dog.origin.toLowerCase().includes(q);
      const matchTemp = dog.temperament.toLowerCase().includes(q);
      if (!matchBreed && !matchOrigin && !matchTemp) return false;
    }
    if (selectedActivity !== 'All' && dog.activityLevel !== selectedActivity) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Stats */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/30 text-amber-200 text-xs font-semibold">
              <PawPrint className="w-3.5 h-3.5 fill-current" />
              <span>Official Canine Companion Encyclopedia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Dog Breeds &amp; Origin Directory
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              Explore 10 globally recognized canine breeds, their heritage origins, lifespan expectations, exercise demands, and protective temperament profiles to find your perfect canine match.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-2xl font-black text-white">10</span>
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">Breeds Cataloged</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-2xl font-black text-white">8–16</span>
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">Years Lifespan Range</span>
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
            placeholder="Search dog breed by name, origin country, or temperament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        {/* Activity Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0">Activity:</span>
          {['All', 'High Energy & Working', 'Playful & Friendly', 'Calm & Companion', 'Alert & Protective'].map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActivity(act)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedActivity === act
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Official Dog Breeds Table View (matches prompt specs) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Standard Dog Breeds Reference Table</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                10 Verified Records
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official reference table for shelter medical intake, shelter dog listings, and prospective adopter match screening.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">No.</th>
                <th className="py-3 px-3">Dog Breed</th>
                <th className="py-3 px-3">Origin / Where Found</th>
                <th className="py-3 px-3">Average Lifespan</th>
                <th className="py-3 px-3">Temperament &amp; Traits</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBreeds.map((dog) => (
                <tr
                  key={dog.no}
                  className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedBreedModal(dog)}
                >
                  <td className="py-3.5 px-3 text-center font-bold text-slate-400 font-mono">
                    {dog.no}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={dog.imageUrl}
                        alt={dog.breed}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-xs block group-hover:text-amber-700 transition-colors">
                          {dog.breed}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {dog.coatType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-amber-600" />
                      <span>{dog.origin}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-700">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dog.lifespan}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs">
                    <p className="text-slate-600 line-clamp-1">{dog.temperament}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-800">
                      #{dog.activityLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBreedModal(dog)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Breed Details
                      </button>
                      {viewerRole === 'shelter' && onSelectBreedForListing && (
                        <button
                          onClick={() => onSelectBreedForListing(dog.breed)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Use for Pet</span>
                        </button>
                      )}
                      {viewerRole === 'adopter' && onFilterDogsByBreed && (
                        <button
                          onClick={() => onFilterDogsByBreed(dog.breed)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Find {dog.breed}s
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
            <h3 className="text-base font-bold text-slate-900">Visual Dog Breed Showcase</h3>
            <p className="text-xs text-slate-500">In-depth profiles, exercise needs, trainability, and temperament guides.</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredBreeds.length} of 10 Breeds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredBreeds.map((dog) => (
            <div
              key={dog.no}
              onClick={() => setSelectedBreedModal(dog)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 bg-slate-100 overflow-hidden">
                  <img
                    src={dog.imageUrl}
                    alt={dog.breed}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{dog.no}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {dog.lifespan}
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-700 transition-colors">
                      {dog.breed}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-amber-500" />
                      <span>{dog.origin}</span>
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {dog.temperament}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">Weight:</span>
                    <span className="font-bold text-slate-700">{dog.weightRange}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBreedModal(dog);
                  }}
                  className="w-full py-1.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-[11px] font-bold rounded-xl border border-slate-200 group-hover:border-amber-200 transition-colors text-center"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Full Breed Inspection */}
      {selectedBreedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 bg-slate-900">
              <img
                src={selectedBreedModal.imageUrl}
                alt={selectedBreedModal.breed}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedBreedModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-white">
                    Dog Breed #{selectedBreedModal.no}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white">
                    {selectedBreedModal.activityLevel}
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{selectedBreedModal.breed}</h3>
                <p className="text-xs text-amber-200/90 flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Native to: {selectedBreedModal.origin}</span>
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Quick Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Lifespan</span>
                  <p className="font-bold text-xs text-emerald-700 mt-0.5">{selectedBreedModal.lifespan}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight Range</span>
                  <p className="font-bold text-xs text-slate-800 mt-0.5">{selectedBreedModal.weightRange}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Origin Location</span>
                  <p className="font-bold text-xs text-slate-800 mt-0.5">{selectedBreedModal.origin}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Coat Texture</span>
                  <p className="font-bold text-xs text-slate-800 mt-0.5 truncate">{selectedBreedModal.coatType}</p>
                </div>
              </div>

              {/* Personality & Temperament */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Personality &amp; Temperament Profile</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                  {selectedBreedModal.temperament}
                </p>
              </div>

              {/* Daily Care & Grooming Guidance */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exercise, Health &amp; Daily Care Tips</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {selectedBreedModal.careTips}
                </p>
              </div>

              {/* Adoption Compatibility Insights */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200/80">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Shelter Adopter Matching Tip</span>
                </h4>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  When adopting or rescuing a {selectedBreedModal.breed}, ensure your home has appropriate space and exercise routines tailored to its {selectedBreedModal.activityLevel.toLowerCase()} disposition. With proper love and vet care, expect an average of {selectedBreedModal.lifespan} of companionship.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedBreedModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
                {viewerRole === 'shelter' && onSelectBreedForListing && (
                  <button
                    onClick={() => {
                      const breed = selectedBreedModal.breed;
                      setSelectedBreedModal(null);
                      onSelectBreedForListing(breed);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <PawPrint className="w-4 h-4" />
                    <span>Use {selectedBreedModal.breed} for New Pet</span>
                  </button>
                )}
                {viewerRole === 'adopter' && onFilterDogsByBreed && (
                  <button
                    onClick={() => {
                      const breed = selectedBreedModal.breed;
                      setSelectedBreedModal(null);
                      onFilterDogsByBreed(breed);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Available {selectedBreedModal.breed}s</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
