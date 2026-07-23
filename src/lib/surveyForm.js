export function getInitialSurveyForm(survey, customers = []) {
  return {
    customer_id: survey?.customer_id || survey?.customer?.id || customers[0]?.id || "",
    email: survey?.email || "",
    installation_area: survey?.installation_area || "",
    need: survey?.need || "",
    target_finishing: toDateInputValue(survey?.target_finishing),
    survey_fee_acknowledged: Boolean(survey?.survey_fee_acknowledged),
    refund_acknowledged: Boolean(survey?.refund_acknowledged),
    commitment_fee_acknowledged: Boolean(survey?.commitment_fee_acknowledged),
    status: survey?.status || "scheduled",
    notes: survey?.notes || "",
  };
}

function toDateInputValue(value) {
  return value ? String(value).slice(0, 10) : "";
}
