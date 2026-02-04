const AcademicStep = ({ formData, updateFormData }) => {
  const degrees = ['Bachelor', 'Master', 'PhD', 'Diploma'];
  const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Academic Background</h2>
        <p className="text-gray-600">Share your educational qualifications</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highest Education Level
        </label>
        <select
          value={formData.highestEducation}
          onChange={(e) => updateFormData({ highestEducation: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        >
          <option value="">Select education level</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Institution Name
        </label>
        <input
          type="text"
          value={formData.institution}
          onChange={(e) => updateFormData({ institution: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., University of California"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field of Study
        </label>
        <input
          type="text"
          value={formData.fieldOfStudy}
          onChange={(e) => updateFormData({ fieldOfStudy: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Computer Science"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CGPA/GPA
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.cgpa}
            onChange={(e) => updateFormData({ cgpa: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="3.8"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scale
          </label>
          <select
            value={formData.cgpaScale}
            onChange={(e) => updateFormData({ cgpaScale: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={4}>4.0</option>
            <option value={10}>10.0</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Graduation Year
          </label>
          <input
            type="number"
            value={formData.graduationYear}
            onChange={(e) => updateFormData({ graduationYear: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="2024"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Intended Degree
        </label>
        <select
          value={formData.intendedDegree}
          onChange={(e) => updateFormData({ intendedDegree: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        >
          <option value="">Select degree</option>
          {degrees.map((degree) => (
            <option key={degree} value={degree}>
              {degree}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AcademicStep;
