// planSelection/updateFeatureFlagWorkflow.ts

import {
  onPlanSelection,
  WorkflowSettings,
  WorkflowTrigger,
  createKindeAPI,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "onPlanSelectionUpdateFlag",
  name: "UpdateDocoplantFlagOnPlanSelection",
  trigger: WorkflowTrigger.PlanSelection,
  failurePolicy: {
    action: "stop",
  }
};

export default async function Workflow(event: onPlanSelection) {
  try {
    console.log("Plan selection workflow triggered");

    const kindeAPI = await createKindeAPI(event);
    const orgCode = event.context?.organization?.code;

    if (!orgCode) {
      console.warn("No organization code found - aborting");
      return;
    }

    // Update the docoplant-json-flag feature flag for this organization
    const flagValue = JSON.stringify({
      "v": 1,
      "plugin_enabled": true,
    });

    await kindeAPI.patch({
    endpoint: `organizations/${orgCode}/feature_flags/docoplant-json-flag`,
    params: { value: flagValue },
    contentType: "application/json",
    });


    console.log(`docoplant-json-flag updated for org ${orgCode}`);
  } catch (err) {
    console.error("Workflow error:", (err as Error).message ?? err);
    throw err;
  }
}
