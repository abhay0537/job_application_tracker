const transitions = {
  CREATED: ["ELIGIBLE", "REJECTED"],
  ELIGIBLE: ["APPLIED"],
  APPLIED: [],
  REJECTED: []
};

function isValidTransition(from, to) {
  return transitions[from]?.includes(to);
}

module.exports = { isValidTransition };
