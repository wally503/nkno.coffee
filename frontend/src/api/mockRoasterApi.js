// src/api/mockRoasterApi.js

// Fake option data for roaster form
const MOCK_ROASTER_OPTIONS = {
  countries: [
    { label: "United States", value: "USA" },
    { label: "Canada", value: "Canada" },
    { label: "Japan", value: "Japan" },
    { label: "United Kingdom", value: "UK" },
    { label: "Australia", value: "Australia" },
  ],
  businessTypes: [
    { label: "Roaster Only", value: "roaster" },
    { label: "Cafe Only", value: "cafe" },
    { label: "Roaster + Cafe", value: "roaster_cafe" },
  ],
};

// pretend API: fetch select options
export async function fetchRoasterOptions() {
  return Promise.resolve(MOCK_ROASTER_OPTIONS);
}

// pretend API: submit a new roaster/cafe record
export async function submitRoaster(formData) {
  console.log("Submitting roaster payload (mock):", formData);
  // later: POST to /api/roasters/
  return Promise.resolve({ ok: true, id: 42 });
}

// optional for future Edit page:
export async function fetchRoasterById(id) {
  // mock existing record for editing
  const example = {
    id,
    name: "Perkatory Coffee Roasters",
    city: "New Haven",
    state: "Connecticut",
    country: "USA",
    address: "123 Brew St",
    website: "https://perkatorycoffee.com",
    social_link: "https://instagram.com/perkatorycoffee",
    business_type: "roaster_cafe",
    notes: "Solid third-wave spot. Great Ethiopias.",
  };
  return Promise.resolve(example);
}

export async function updateRoaster(id, formData) {
  console.log("Updating roaster (mock):", id, formData);
  // later: PUT/PATCH to /api/roasters/:id/
  return Promise.resolve({ ok: true });
}