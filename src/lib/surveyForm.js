export function getInitialSurveyForm(survey, customers = []) {
  return {
    customer_id: survey?.customer_id || survey?.customer?.id || customers[0]?.id || "",
    survey_date: toDateInputValue(survey?.survey_date),
    surveyor_name: survey?.surveyor_name || "",
    project_type: survey?.project_type || "",
    project_location: survey?.project_location || "",
    estimated_budget:
      survey?.estimated_budget == null ? "" : String(survey.estimated_budget),
    status: survey?.status || "pending",
    notes: survey?.notes || "",
  };
}

function toDateInputValue(value) {
  if (!value) return "";

  return String(value).slice(0, 10);
}
