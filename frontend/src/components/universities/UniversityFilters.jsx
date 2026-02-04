import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../redux/slices/universitySlice';
import Button from '../common/Button';

const UniversityFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.universities);

  const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands'];
  const degrees = ['Bachelor', 'Master', 'PhD'];

  const handleCountryToggle = (country) => {
    const newCountries = filters.country.includes(country)
      ? filters.country.filter((c) => c !== country)
      : [...filters.country, country];
    dispatch(setFilters({ country: newCountries }));
  };

  return (
    <div className="space-y-6">
      {/* Countries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Countries
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => handleCountryToggle(country)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                filters.country.includes(country)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* Degree Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Degree Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {degrees.map((degree) => (
            <button
              key={degree}
              onClick={() => dispatch(setFilters({ degree }))}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                filters.degree === degree
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {degree}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="secondary"
        onClick={() => dispatch(clearFilters())}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default UniversityFilters;
