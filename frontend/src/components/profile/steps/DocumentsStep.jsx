const DocumentsStep = ({ formData, updateFormData }) => {
  const statuses = ['Not Started', 'In Progress', 'Ready', 'Submitted'];

  const documents = [
    { key: 'sopStatus', label: 'Statement of Purpose (SOP)' },
    { key: 'lorStatus', label: 'Letters of Recommendation (LOR)' },
    { key: 'resumeStatus', label: 'Resume/CV' },
    { key: 'transcriptsStatus', label: 'Academic Transcripts' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Preparation</h2>
        <p className="text-gray-600">Track your application documents</p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.key} className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {doc.label}
            </label>
            <select
              value={formData[doc.key]}
              onChange={(e) => updateFormData({ [doc.key]: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Keep your documents ready before starting applications. Most universities require these documents during the application process.
        </p>
      </div>
    </div>
  );
};

export default DocumentsStep;
