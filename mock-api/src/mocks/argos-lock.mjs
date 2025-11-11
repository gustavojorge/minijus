const responses = [
  {
    body: (req) => ({
      status: "ok",
      experiment_group: {
        name: "justarter",
      },
      experiment: {
        name: "litigants-experiment",
      },
      alternative: {
        name: req.query.alternative || "control",
      },
      client_id: "a8f0a7cd-ab76-4fa1-9294-7aac653010d9",
      participating: req.query.simulating === "true" ? false : true,
      simulating: convertToBoolean(req.query.simulating) || false,
    }),
  },
  {
    body: (req) => ({
      status: "ok",
      experiment_group: {
        name: "justarter",
      },
      experiment: {
        name: "litigants-experiment",
      },
      alternative: {
        name: req.query.alternative || "control",
      },
      client_id: "a8f0a7cd-ab76-4fa1-9294-7aac653010d9",
      participating: false,
      simulating: convertToBoolean(req.query.simulating) || false,
    }),
  },
  {
    body: (req) => ({
      status: "ok",
      experiment_group: {
        name: "justarter",
      },
      experiment: {
        name: "litigants-experiment",
      },
      alternative: {
        name: req.query.alternative || "variant-a",
      },
      client_id: "a8f0a7cd-ab76-4fa1-9294-7aac653010d9",
      participating: req.query.simulating === "true" ? false : true,
      simulating: convertToBoolean(req.query.simulating) || false,
    }),
  },
  {
    body: (req) => ({
      status: "ok",
      experiment_group: {
        name: "justarter",
      },
      experiment: {
        name: "litigants-experiment",
      },
      alternative: {
        name: req.query.alternative || "variant-b",
      },
      client_id: "a8f0a7cd-ab76-4fa1-9294-7aac653010d9",
      participating: req.query.simulating === "true" ? false : true,
      simulating: convertToBoolean(req.query.simulating) || false,
    }),
  },
];

// Convert "true" and "false" strings to boolean values
const convertToBoolean = (value) => {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
  return value;
};

// Randomly select a response
export const getRandomResponse = (req) => {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index].body(req);
};
