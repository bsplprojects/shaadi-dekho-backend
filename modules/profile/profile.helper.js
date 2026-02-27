export const EXPECTED_STRUCTURE = {
  basicDetails: {
    profileFor: true,
    name: true,
    dob: true,
    gender: true,
    bodyType: true,
    age: true,
    physicalStatus: true,
    height: true,
    weight: true,
    motherTongue: true,
    maritalStatus: true,
  },

  lifestyle: {
    drinkingHabits: true,
    smokingHabits: true,
    diet: true,
    description: true,
  },

  religion: {
    religion: true,
    caste: true,
    subCaste: true,
  },

  location: {
    country: true,
    city: true,
    state: true,
    citizenship: true,
    ancestralOrigin: true,
  },

  professional: {
    education: true,
    educationDetail: true,
    college: true,
    employmentSector: true,
    occupation: true,
    occupationDetail: true,
    organization: true,
    annualIncome: true,
    workingCity: true,
  },

  family: {
    fatherName: true,
    fatherOccupation: true,
    motherName: true,
    motherOccupation: true,
    familyType: true,
    familyValues: true,
    familyLocation: true,
    brothers: true,
    sisters: true,
    about: true,
    status: true,
  },

  horoscope: {
    tob: true,
    pob: true,
    star: true,
    raasi: true,
    manglik: true,
  },

  hobbies: true,
  interests: true,
  images: true,
};
function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export function calculateProfileCompletion(profile) {
  const data = profile?._doc ?? profile;
  let totalFields = 0;
  let filledFields = 0;
  const emptyFields = [];

  function check(expected, actual, path = "") {
    for (const key in expected) {
      const fieldPath = path ? `${path}.${key}` : key;
      const expectedValue = expected[key];
      const actualValue = actual?.[key];

      if (typeof expectedValue === "object") {
        check(expectedValue, actualValue, fieldPath);
        continue;
      }

      totalFields++;

      if (isFilled(actualValue)) {
        filledFields++;
      } else {
        emptyFields.push(fieldPath);
      }
    }
  }

  check(EXPECTED_STRUCTURE, data);

  return {
    percentage: Math.round((filledFields / totalFields) * 100),
    totalFields,
    filledFields,
    emptyFields,
  };
}
