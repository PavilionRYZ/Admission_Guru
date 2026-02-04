import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    ranking: {
      world: {
        type: Number,
      },
      national: {
        type: Number,
      },
    },
    programs: [
      {
        name: String,
        degree: {
          type: String,
          enum: ["Bachelor's", "Master's", "MBA", "PhD"],
        },
        field: String,
        duration: String,
        tuitionFee: {
          min: Number,
          max: Number,
          currency: {
            type: String,
            default: "USD",
          },
        },
        requirements: {
          minGPA: Number,
          englishTest: {
            type: String,
            minScore: Number,
          },
          standardizedTest: {
            type: String,
            minScore: Number,
          },
        },
        intakes: [String],
        deadline: Date,
      },
    ],
    cost: {
      tuitionPerYear: {
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
      livingCostPerYear: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
    },
    acceptanceRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    studentPopulation: {
      total: Number,
      international: Number,
    },
    facilities: [String],
    popularFields: [String],
    scholarships: [
      {
        name: String,
        amount: Number,
        eligibility: String,
      },
    ],
    applicationFee: {
      amount: Number,
      currency: {
        type: String,
        default: "USD",
      },
    },
  },
  { timestamps: true },
);

universitySchema.index({ country: 1, name: 1 });
universitySchema.index({ "programs.field": 1 });
universitySchema.index({
  "cost.tuitionPerYear.min": 1,
  "cost.tuitionPerYear.max": 1,
});

export default mongoose.model("University", universitySchema);
