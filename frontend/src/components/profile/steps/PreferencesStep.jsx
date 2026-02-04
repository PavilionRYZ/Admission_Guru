import { useState } from 'react';
import { X } from 'lucide-react';

const PreferencesStep = ({ formData, updateFormData }) => {
  const [countryInput, setCountryInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Singapore', 'Ireland'];
  const seasons = ['Fall', 'Spring', 'Summer'];
  const priorities = ['Cost', 'Ranking', 'Location', 'Research', 'Industry Connections', 'Campus Life'];

  const addCountry = (country) => {
    if (!formData.preferredCountries.includes(country)) {
      updateFormData({
        preferredCountries: [...formData.preferredCountries, country],
      });
    }
  };

  const removeCountry = (country) => {
    updateFormData({
      preferredCountries: formData.preferredCountries.filter((c) => c !== country),
    });
  };

  const addCity = () => {
    if (cityInput && !formData.preferredCities.includes(cityInput)) {
      updateFormData({
        preferredCities: [...formData.preferredCities, cityInput],
      });
      setCityInput('');
    }
  };

  const removeCity = (city) => {
    updateFormData({
      preferredCities: formData.preferredCities.filter((c) => c !== city),
    });
  };

  const togglePriority = (priority) => {
    const priorities = formData.priorities || [];
    if (priorities.includes(priority)) {
      updateFormData({
        priorities: priorities.filter((p) => p !== priority),
      });
    } else {
      updateFormData({
        priorities: [...priorities, priority],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Study Preferences</h2>
        <p className="text-gray-600">Tell us what you're looking for</p>
      </div>

      {/* Preferred Countries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Countries
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {countries.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => addCountry(country)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                formData.preferredCountries.includes(country)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
        {formData.preferredCountries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.preferredCountries.map((country) => (
              <span
                key={country}
                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{country}</span>
                <button onClick={() => removeCountry(country)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Preferred Cities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Cities (Optional)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Boston, London"
          />
          <button
            type="button"
            onClick={addCity}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Add
          </button>
        </div>
        {formData.preferredCities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.preferredCities.map((city) => (
              <span
                key={city}
                className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{city}</span>
                <button onClick={() => removeCity(city)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Annual Budget Range (USD)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              value={formData.budgetPerYear.min}
              onChange={(e) =>
                updateFormData({
                  budgetPerYear: {
                    ...formData.budgetPerYear,
                    min: parseInt(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Min Budget"
            />
          </div>
          <div>
            <input
              type="number"
              value={formData.budgetPerYear.max}
              onChange={(e) =>
                updateFormData({
                  budgetPerYear: {
                    ...formData.budgetPerYear,
                    max: parseInt(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Max Budget"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Selected Range: ${formData.budgetPerYear.min.toLocaleString()} - $
          {formData.budgetPerYear.max.toLocaleString()}
        </p>
      </div>

      {/* Target Intake */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Intake Year
          </label>
          <input
            type="number"
            value={formData.targetIntakeYear}
            onChange={(e) =>
              updateFormData({ targetIntakeYear: parseInt(e.target.value) })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min={2026}
            max={2030}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Intake Season
          </label>
          <select
            value={formData.targetIntakeSeason}
            onChange={(e) => updateFormData({ targetIntakeSeason: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Priorities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Priorities (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {priorities.map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => togglePriority(priority)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                (formData.priorities || []).includes(priority)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
