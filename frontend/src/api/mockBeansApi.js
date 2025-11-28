// src/api/mockBeansApi.js

// pretend this came from Django, but it's just hardcoded for now:
const MOCK_BEANS_OPTIONS = {
  roasters: [
    { label: "Daybreak Coffee Roaster", value: 1 },
    { label: "Perkatory Roaster", value: 2 },
    { label: "Radial Coffee Company", value: 3 },
  ],
  countries: [
    { label: "Kenya", value: 1 },
    { label: "Papua New Guinea", value: 2 },
    { label: "Ethiopia", value: 3 },
  ],
  roastLevels: [
    { label: "Light", value: "light" },
    { label: "Light-Medium", value: "light_medium" },
    { label: "Medium", value: "medium" },
    { label: "Medium-Dark", value: "medium_dark" },
    { label: "Dark", value: "dark" },
  ],
  organicFlags: [
    { label: "Organic", value: true },
    { label: "Non-organic", value: false },
  ],
  processTypes: [
    { label: "Washed", value: "washed" },
    { label: "Natural", value: "natural" },
  ],
  caffeineFlags: [
    { label: "Caffeinated", value: true },
    { label: "Decaffeinated", value: false },
  ],
};

export async function fetchBeansOptions() {
  // mock “API” — could be a real fetch later
  return Promise.resolve(MOCK_BEANS_OPTIONS);
}

export async function submitBeans(formData) {
  // mock submit — replace with real fetch later
  console.log("Submitting beans payload:", formData);
  // In real code: POST to /api/beans/
  return Promise.resolve({ ok: true, id: 123 });
}