import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Academic Background
    currentEducationLevel: {
      type: String,
      enum: ["High School", "Undergraduate", "Graduate", "Postgraduate"],
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    gpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    // Study Goals
    intendedDegree: {
      type: String,
      enum: ["Bachelor's", "Master's", "MBA", "PhD"],
      required: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
    },
    targetIntakeYear: {
      type: Number,
      required: true,
    },
    targetIntakeSeason: {
      type: String,
      enum: ["Spring", "Fall", "Summer", "Winter"],
      required: true,
    },
    preferredCountries: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one preferred country is required",
      },
    },
    // Budget
    budgetPerYear: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    fundingPlan: {
      type: String,
      enum: ["Self-funded", "Scholarship-dependent", "Loan-dependent", "Mixed"],
      required: true,
    },
    // Exams & Readiness
    englishTest: {
      type: {
        type: String,
        enum: ["IELTS", "TOEFL", "PTE", "Duolingo", "None"],
      },
      status: {
        type: String,
        enum: ["Not Started", "Scheduled", "Completed"],
      },
      score: {
        type: Number,
      },
      testDate: {
        type: Date,
      },
    },
    standardizedTest: {
      type: {
        type: String,
        enum: ["GRE", "GMAT", "SAT", "ACT", "None"],
      },
      status: {
        type: String,
        enum: ["Not Started", "Scheduled", "Completed"],
      },
      score: {
        type: Number,
      },
      testDate: {
        type: Date,
      },
    },
    sopStatus: {
      type: String,
      enum: ["Not Started", "Draft", "Review", "Ready"],
      default: "Not Started",
    },
    lorStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    visaStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Approved", "Rejected"],
      default: "Not Started",
    },
    // Additional Information
    workExperience: {
      hasExperience: {
        type: Boolean,
        default: false,
      },
      years: {
        type: Number,
        default: 0,
      },
      field: {
        type: String,
      },
    },
    researchExperience: {
      hasExperience: {
        type: Boolean,
        default: false,
      },
      details: {
        type: String,
      },
    },
    extracurriculars: [
      {
        activity: String,
        description: String,
      },
    ],
    // Profile Completion & Strength
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    profileStrength: {
      overall: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      academics: {
        type: String,
        enum: ["Weak", "Average", "Strong", "Excellent"],
        default: "Average",
      },
      exams: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
      },
      documents: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
      },
    },
    currentStage: {
      type: String,
      enum: [
        "Building Profile",
        "Discovering Universities",
        "Finalizing Universities",
        "Preparing Applications",
      ],
      default: "Building Profile",
    },
  },
  { timestamps: true },
);

// Calculate profile strength before saving
profileSchema.pre("save", function (next) {
  let academicScore = 0;
  let examScore = 0;
  let documentScore = 0;

  // Academic scoring
  if (this.gpa || this.percentage) {
    const score = this.gpa ? (this.gpa / 10) * 100 : this.percentage;
    if (score >= 80) academicScore = 100;
    else if (score >= 70) academicScore = 75;
    else if (score >= 60) academicScore = 50;
    else academicScore = 25;
  }

  // Exam scoring
  const englishComplete = this.englishTest?.status === "Completed";
  const standardComplete = this.standardizedTest?.status === "Completed";
  if (englishComplete && standardComplete) examScore = 100;
  else if (englishComplete || standardComplete) examScore = 50;

  // Document scoring
  const sopReady = this.sopStatus === "Ready" || this.sopStatus === "Review";
  const lorComplete = this.lorStatus === "Completed";
  if (sopReady && lorComplete) documentScore = 100;
  else if (sopReady || lorComplete) documentScore = 50;

  // Overall score
  this.profileStrength.overall = Math.round(
    academicScore * 0.4 + examScore * 0.3 + documentScore * 0.3,
  );

  // Academic strength
  if (academicScore >= 80) this.profileStrength.academics = "Excellent";
  else if (academicScore >= 70) this.profileStrength.academics = "Strong";
  else if (academicScore >= 50) this.profileStrength.academics = "Average";
  else this.profileStrength.academics = "Weak";

  // Exam strength
  if (englishComplete && standardComplete)
    this.profileStrength.exams = "Completed";
  else if (englishComplete || standardComplete)
    this.profileStrength.exams = "In Progress";
  else this.profileStrength.exams = "Not Started";

  // Document strength
  if (sopReady && lorComplete) this.profileStrength.documents = "Completed";
  else if (sopReady || lorComplete)
    this.profileStrength.documents = "In Progress";
  else this.profileStrength.documents = "Not Started";
});

export default mongoose.model("Profile", profileSchema);
