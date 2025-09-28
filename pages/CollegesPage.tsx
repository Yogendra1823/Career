import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const MOCK_COLLEGES = [
  { id: 1, name: 'IIT Bombay', location: 'Mumbai', image: 'https://picsum.photos/400/200?random=1', lat: 19.1334, lon: 72.9155, website: '#', description: 'A leading technical and research university.', programs: ['Science', 'Engineering'], tuition: 120000, type: 'Public', studentFacultyRatio: '8:1' },
  { id: 2, name: 'St. Stephen\'s College', location: 'Delhi', image: 'https://picsum.photos/400/200?random=2', lat: 28.6896, lon: 77.2098, website: '#', description: 'Known for its excellence in arts and sciences.', programs: ['Arts', 'Science'], tuition: 42000, type: 'Public', studentFacultyRatio: '18:1' },
  { id: 3, name: 'IIM Ahmedabad', location: 'Ahmedabad', image: 'https://picsum.photos/400/200?random=3', lat: 23.0334, lon: 72.5353, website: '#', description: 'The top-ranked business school in India.', programs: ['Commerce', 'Management'], tuition: 2300000, type: 'Public', studentFacultyRatio: '7:1' },
  { id: 4, name: 'National Law School', location: 'Bengaluru', image: 'https://picsum.photos/400/200?random=4', lat: 13.0350, lon: 77.5132, website: '#', description: 'The premier university for legal education.', programs: ['Arts', 'Law'], tuition: 280000, type: 'Public', studentFacultyRatio: '15:1' },
  { id: 5, name: 'BITS Pilani', location: 'Pilani', image: 'https://picsum.photos/400/200?random=5', lat: 28.3614, lon: 75.5878, website: '#', description: 'A premier private university known for its flexible curriculum.', programs: ['Science', 'Engineering'], tuition: 420000, type: 'Private', studentFacultyRatio: '16:1' },
  { id: 6, name: 'AIIMS Delhi', location: 'New Delhi', image: 'https://picsum.photos/400/200?random=6', lat: 28.5658, lon: 77.2093, website: '#', description: 'India\'s foremost medical college and hospital.', programs: ['Medical', 'Science'], tuition: 6000, type: 'Public', studentFacultyRatio: '6:1' },
  { id: 7, 'name': 'Vellore Institute of Technology', location: 'Vellore', image: 'https://picsum.photos/400/200?random=7', lat: 12.9712, lon: 79.1593, website: '#', description: 'A leading private engineering university.', programs: ['Engineering', 'Management'], tuition: 198000, type: 'Private', studentFacultyRatio: '18:1' },
  { id: 8, 'name': 'University of Delhi', location: 'Delhi', image: 'https://picsum.photos/400/200?random=8', lat: 28.6885, lon: 77.2081, website: '#', description: 'A premier university with renowned arts and commerce programs.', programs: ['Arts', 'Commerce', 'Science'], tuition: 15000, type: 'Public', studentFacultyRatio: '23:1' },
  { id: 9, 'name': 'Christ University', location: 'Bengaluru', image: 'https://picsum.photos/400/200?random=9', lat: 12.9351, lon: 77.6144, website: '#', description: 'A deemed private university known for its discipline and academics.', programs: ['Commerce', 'Management', 'Arts'], tuition: 180000, type: 'Private', studentFacultyRatio: '15:1' },
  { id: 10, 'name': 'National Institute of Design', location: 'Ahmedabad', image: 'https://picsum.photos/400/200?random=10', lat: 23.0298, lon: 72.5855, website: '#', description: 'The most prestigious design school in India.', programs: ['Design', 'Arts'], tuition: 350000, type: 'Public', studentFacultyRatio: '12:1' }
];

const PROGRAM_OPTIONS = ['All Programs', 'Science', 'Arts', 'Commerce', 'Engineering', 'Management', 'Law', 'Medical', 'Design'];
const TUITION_RANGES = { 'any': 'Any Price', '<50k': 'Under ₹50,000', '50k-150k': '₹50,000 - ₹1,50,000', '>150k': 'Over ₹1,50,000' };
const RADIUS_OPTIONS = { 'any': 'Any Distance', '10': 'Within 10 km', '20': 'Within 20 km', '30': 'Within 30 km' };
const TYPE_OPTIONS = { 'any': 'Any Type', 'Public': 'Public', 'Private': 'Private' };
const RATIO_OPTIONS = { 'any': 'Any Ratio', '<10:1': 'Under 10:1', '<20:1': 'Under 20:1' };

const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBoundingBox = (colleges: typeof MOCK_COLLEGES, selectedCollege?: typeof MOCK_COLLEGES[0]) => {
    if (selectedCollege) {
        return `${selectedCollege.lon - 0.1},${selectedCollege.lat - 0.1},${selectedCollege.lon + 0.1},${selectedCollege.lat + 0.1}`;
    }
    if (colleges.length === 0) return "68,8,98,37"; // BBox for India
    const lats = colleges.map(c => c.lat); const lons = colleges.map(c => c.lon);
    return `${Math.min(...lons) - 0.5},${Math.min(...lats) - 0.5},${Math.max(...lons) + 0.5},${Math.max(...lats) + 0.5}`;
}

// Map user interests to college programs
const getProgramsFromInterests = (interests: string[]): string[] => {
    const mapping: { [interest: string]: string[] } = {
        'coding': ['Engineering', 'Science'], 'tech': ['Engineering', 'Science'],
        'business': ['Commerce', 'Management'], 'finance': ['Commerce', 'Management'],
        'art': ['Arts', 'Design'], 'music': ['Arts'],
        'healthcare': ['Medical', 'Science'], 'biology': ['Medical', 'Science'],
        'law': ['Law']
    };
    const programs = new Set<string>();
    interests.forEach(interest => {
        for (const key in mapping) {
            if (interest.toLowerCase().includes(key)) {
                mapping[key].forEach(p => programs.add(p));
            }
        }
    });
    return Array.from(programs);
}


const CollegesPage: React.FC = () => {
  const { user, updateProgress } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProgram = queryParams.get('program') || 'All Programs';

  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState(initialProgram);
  const [tuitionFilter, setTuitionFilter] = useState('any');
  const [radiusFilter, setRadiusFilter] = useState('any');
  const [typeFilter, setTypeFilter] = useState('any');
  const [ratioFilter, setRatioFilter] = useState('any');
  const [filterByInterests, setFilterByInterests] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<typeof MOCK_COLLEGES[0] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        p => { setUserCoords({ lat: p.coords.latitude, lon: p.coords.longitude }); setIsLocating(false); },
        () => { setLocationError('Location access denied. "Near Me" filter is disabled.'); setIsLocating(false); }
    );
  }, []);

  useEffect(() => {
      // Logic for "Filter by Interests" checkbox
      if (filterByInterests && user?.interests?.length) {
          const programs = getProgramsFromInterests(user.interests);
          // For simplicity, we'll just pick the first relevant program.
          // A multi-select filter would be an improvement here.
          if (programs.length > 0) {
              setProgramFilter(programs[0]);
          } else {
              setProgramFilter('All Programs');
          }
      } else {
          setProgramFilter(initialProgram); // Reset to default or URL param
      }
  }, [filterByInterests, user, initialProgram]);
  
  const handleSearch = () => {
      updateProgress({ collegesSearched: (user?.progress?.collegesSearched || 0) + 1 });
  };

  const filteredColleges = useMemo(() => {
    let interestPrograms: string[] = [];
    if (filterByInterests && user?.interests?.length) {
        interestPrograms = getProgramsFromInterests(user.interests);
    }

    return MOCK_COLLEGES.filter(college => {
      // Search Query Filter
      if (searchQuery && !college.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Program Filter
      if (programFilter !== 'All Programs' && !college.programs.includes(programFilter)) {
        return false;
      }
      // Interest-based Program Filter
      if (filterByInterests && interestPrograms.length > 0 && !college.programs.some(p => interestPrograms.includes(p))) {
        return false;
      }
      // Tuition Filter
      if (tuitionFilter !== 'any') {
        const [min, max] = tuitionFilter.split('-');
        if (min === '<50k') {
          if (college.tuition >= 50000) return false;
        } else if (max === '150k') {
          if (college.tuition < 50000 || college.tuition > 150000) return false;
        } else if (min === '>150k') {
          if (college.tuition <= 150000) return false;
        }
      }
      // Radius Filter
      if (radiusFilter !== 'any' && userCoords) {
        const distance = getDistanceInKm(userCoords.lat, userCoords.lon, college.lat, college.lon);
        if (distance > parseInt(radiusFilter)) {
          return false;
        }
      }
      // Type Filter
      if (typeFilter !== 'any' && college.type !== typeFilter) {
        return false;
      }
      // Ratio Filter
      if (ratioFilter !== 'any') {
        const ratio = parseInt(college.studentFacultyRatio.split(':')[0]);
        if (ratioFilter === '<10:1' && ratio >= 10) return false;
        if (ratioFilter === '<20:1' && ratio >= 20) return false;
      }
      return true;
    });
  }, [searchQuery, programFilter, tuitionFilter, radiusFilter, typeFilter, ratioFilter, userCoords, filterByInterests, user]);
  
  const handleClearFilters = () => {
      setSearchQuery('');
      setProgramFilter('All Programs');
      setTuitionFilter('any');
      setRadiusFilter('any');
      setTypeFilter('any');
      setRatioFilter('any');
      setFilterByInterests(false);
      setSelectedCollege(null);
  };
  
  const mapBbox = getBoundingBox(filteredColleges, selectedCollege || undefined);
  const markers = filteredColleges.map(c => `marker=${c.lat},${c.lon}`).join('&');
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&${markers}`;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Explore Colleges in India</h1>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Advanced Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">College Name</label>
              <input type="text" id="search" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); handleSearch(); }} placeholder="e.g., IIT Bombay" className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Program</label>
              <select id="program" value={programFilter} onChange={e => { setProgramFilter(e.target.value); handleSearch(); }} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {PROGRAM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tuition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Tuition</label>
              <select id="tuition" value={tuitionFilter} onChange={e => { setTuitionFilter(e.target.value); handleSearch(); }} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {Object.entries(TUITION_RANGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Near Me</label>
              <select id="radius" value={radiusFilter} onChange={e => { setRadiusFilter(e.target.value); handleSearch(); }} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" disabled={!userCoords}>
                {Object.entries(RADIUS_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution Type</label>
              <select id="type" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); handleSearch(); }} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {Object.entries(TYPE_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student-Faculty Ratio</label>
              <select id="ratio" value={ratioFilter} onChange={e => { setRatioFilter(e.target.value); handleSearch(); }} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {Object.entries(RATIO_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
             <div className="flex items-center col-span-1 md:col-span-2 lg:col-span-1 pt-6">
                 <input type="checkbox" id="interestFilter" checked={filterByInterests} onChange={(e) => setFilterByInterests(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" disabled={!user?.interests?.length} />
                 <label htmlFor="interestFilter" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 disabled:text-gray-400">Filter by my interests</label>
             </div>
             <div className="flex items-end col-span-1 md:col-span-2 lg:col-span-1">
                 <button onClick={handleClearFilters} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Clear Filters</button>
             </div>
        </div>
        {locationError && <p className="text-xs text-red-500 mt-2">{locationError}</p>}
        {isLocating && <p className="text-xs text-blue-500 mt-2">Getting your location...</p>}
      </Card>

       <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4">{filteredColleges.length} Colleges Found</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredColleges.length > 0 ? filteredColleges.map(college => (
              <div key={college.id} onClick={() => setSelectedCollege(college)} className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${selectedCollege?.id === college.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                <Card className="p-0 flex flex-col md:flex-row h-full">
                    <img src={college.image} alt={college.name} className="w-full md:w-48 h-32 md:h-full object-cover" />
                    <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                            <h4 className="text-lg font-bold">{college.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{college.location}</p>
                            <p className="text-sm mt-2">{college.description}</p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Programs: {college.programs.join(', ')}</span>
                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">Website →</a>
                        </div>
                    </div>
                </Card>
              </div>
            )) : (
                 <Card>
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No colleges match your current filters. Try broadening your search!</p>
                 </Card>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Map View</h3>
          <div className="h-[600px] w-full bg-gray-200 dark:bg-neutral-600 rounded-lg overflow-hidden shadow-md">
            <iframe width="100%" height="100%" src={mapUrl} aria-label="Map of filtered colleges" style={{border:0}}></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegesPage;