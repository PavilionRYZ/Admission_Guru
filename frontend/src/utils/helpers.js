export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  const fields = [
    profile.dateOfBirth,
    profile.phoneNumber,
    profile.address?.city,
    profile.highestEducation,
    profile.institution,
    profile.fieldOfStudy,
    profile.cgpa,
    profile.intendedDegree,
    profile.preferredCountries?.length > 0,
    profile.budgetPerYear?.max > 0,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
};

export const getAcceptanceColor = (chance) => {
  if (chance >= 70) return "text-green-600";
  if (chance >= 40) return "text-yellow-600";
  return "text-red-600";
};

export const getCategoryIcon = (category) => {
  const icons = {
    Dream: "⭐",
    Target: "🎯",
    Safe: "🛡️",
  };
  return icons[category] || "📌";
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
