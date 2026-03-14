// src/api/mockDrinkApi.js

// pretend this came from Django, but it's just hardcoded for now:
const MOCK_DRINK_OPTIONS = {
  roasters: [
    { label: "Daybreak Coffee Roaster", value: 1 },
    { label: "Perkatory Roaster", value: 2 },
    { label: "Radial Coffee Company", value: 3 },
  ]
};

export async function fetchDrinkOptions() {
  // mock “API” — could be a real fetch later
  return Promise.resolve(MOCK_DRINK_OPTIONS);
}

export async function submitDrink(formData) {
  // mock submit — replace with real fetch later
  console.log("Submitting beans payload:", formData);
  // In real code: POST to /api/beans/
  return Promise.resolve({ ok: true, id: 123 });
}