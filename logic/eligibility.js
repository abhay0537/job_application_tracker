function checkEligibility(job, application) {
  if (application.cgpa < job.min_cgpa) {
    return { eligible: false, reason: "CGPA below threshold" };
  }

  const branches = job.allowed_branches.split(",");
  if (!branches.includes(application.branch)) {
    return { eligible: false, reason: "Branch not allowed" };
  }

  return { eligible: true };
}

module.exports = { checkEligibility };
