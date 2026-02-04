const TestScoresStep = ({ formData, updateFormData }) => {
  const englishTests = ['IELTS', 'TOEFL', 'PTE', 'Duolingo'];
  const standardizedTests = ['None', 'GRE', 'GMAT', 'SAT', 'ACT'];
  const statuses = ['Not Taken', 'Scheduled', 'Completed', 'Not Required'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Scores</h2>
        <p className="text-gray-600">Enter your standardized test scores</p>
      </div>

      {/* English Test */}
      <div className="p-6 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">English Proficiency Test</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <select
              value={formData.englishTest.type}
              onChange={(e) =>
                updateFormData({
                  englishTest: { ...formData.englishTest, type: e.target.value },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select test</option>
              {englishTests.map((test) => (
                <option key={test} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.englishTest.status}
              onChange={(e) =>
                updateFormData({
                  englishTest: { ...formData.englishTest, status: e.target.value },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {formData.englishTest.status === 'Completed' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score
                </label>
                <input
                  type="text"
                  value={formData.englishTest.score}
                  onChange={(e) =>
                    updateFormData({
                      englishTest: { ...formData.englishTest, score: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 7.5 or 105"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date
                </label>
                <input
                  type="date"
                  value={formData.englishTest.date}
                  onChange={(e) =>
                    updateFormData({
                      englishTest: { ...formData.englishTest, date: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Standardized Test */}
      <div className="p-6 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Standardized Test</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <select
              value={formData.standardizedTest.type}
              onChange={(e) =>
                updateFormData({
                  standardizedTest: { ...formData.standardizedTest, type: e.target.value },
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {standardizedTests.map((test) => (
                <option key={test} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>

          {formData.standardizedTest.type !== 'None' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.standardizedTest.status}
                  onChange={(e) =>
                    updateFormData({
                      standardizedTest: { ...formData.standardizedTest, status: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {formData.standardizedTest.status === 'Completed' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score
                    </label>
                    <input
                      type="text"
                      value={formData.standardizedTest.score}
                      onChange={(e) =>
                        updateFormData({
                          standardizedTest: { ...formData.standardizedTest, score: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 320 or 750"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Date
                    </label>
                    <input
                      type="date"
                      value={formData.standardizedTest.date}
                      onChange={(e) =>
                        updateFormData({
                          standardizedTest: { ...formData.standardizedTest, date: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScoresStep;
