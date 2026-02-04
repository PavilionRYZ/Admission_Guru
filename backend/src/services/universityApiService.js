import axios from "axios";

// Hipolabs University API - Free API for university data
const HIPOLABS_API = "http://universities.hipolabs.com";

// Fetch universities by country
export const fetchUniversitiesByCountry = async (country) => {
  try {
    const response = await axios.get(`${HIPOLABS_API}/search`, {
      params: { country },
    });

    return response.data.map((uni) => ({
      name: uni.name,
      country: uni.country,
      website: uni.web_pages[0],
      domains: uni.domains,
    }));
  } catch (error) {
    console.error("Hipolabs API Error:", error);
    throw new Error("Failed to fetch universities from Hipolabs");
  }
};

// Fetch all universities (with limit)
export const fetchAllUniversities = async (limit = 100) => {
  try {
    const countries = [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
    ];
    const allUniversities = [];

    for (const country of countries) {
      const unis = await fetchUniversitiesByCountry(country);
      allUniversities.push(...unis);
    }

    return allUniversities.slice(0, limit);
  } catch (error) {
    console.error("Fetch All Universities Error:", error);
    return [];
  }
};

// Transform external API data to our schema
export const transformUniversityData = (externalData, additionalInfo = {}) => {
  return {
    name: externalData.name,
    country: externalData.country,
    city: additionalInfo.city || "Unknown",
    website: externalData.website || externalData.web_pages?.[0],
    logo: additionalInfo.logo || "",
    ranking: {
      world: additionalInfo.worldRanking || null,
      national: additionalInfo.nationalRanking || null,
    },
    cost: {
      tuitionPerYear: {
        min: additionalInfo.tuitionMin || 10000,
        max: additionalInfo.tuitionMax || 50000,
        currency: additionalInfo.currency || "USD",
      },
      livingCostPerYear: {
        min: additionalInfo.livingMin || 8000,
        max: additionalInfo.livingMax || 15000,
        currency: additionalInfo.currency || "USD",
      },
    },
    acceptanceRate: additionalInfo.acceptanceRate || 50,
    programs: additionalInfo.programs || [],
    popularFields: additionalInfo.popularFields || [
      "Computer Science",
      "Business",
      "Engineering",
    ],
  };
};
