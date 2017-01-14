## DeploymentStatus v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | DeploymentStatus

> Example yaml coming soon...



DeploymentStatus is the most recently observed status of the Deployment.

<aside class="notice">
Appears In  <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer* | Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.
conditions <br /> *[DeploymentCondition](#deploymentcondition-v1beta1) array* | Represents the latest available observations of a deployment's current state.
observedGeneration <br /> *integer* | The generation observed by the deployment controller.
replicas <br /> *integer* | Total number of non-terminated pods targeted by this deployment (their labels match the selector).
unavailableReplicas <br /> *integer* | Total number of unavailable pods targeted by this deployment.
updatedReplicas <br /> *integer* | Total number of non-terminated pods targeted by this deployment that have the desired template spec.

