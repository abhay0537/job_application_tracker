function calculateATS(resumeText) {
  const keywords = ["node", "backend", "sql"];
  let score = 0;

  keywords.forEach(k => {
    if (resumeText.toLowerCase().includes(k)) score += 20;
  });

  return score;
}

module.exports = { calculateATS };
