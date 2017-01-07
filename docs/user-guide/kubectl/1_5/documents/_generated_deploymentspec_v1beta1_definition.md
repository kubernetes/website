## DeploymentSpec v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DeploymentSpec

> Example yaml coming soon...



DeploymentSpec is the specification of the desired behavior of the Deployment.

<aside class="notice">
Appears In  <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
minReadySeconds <br /> *integer* | Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
paused <br /> *boolean* | Indicates that the deployment is paused and will not be processed by the deployment controller.
progressDeadlineSeconds <br /> *integer* | The maximum time in seconds for a deployment to make progress before it is considered to be failed. The deployment controller will continue to process failed deployments and a condition with a ProgressDeadlineExceeded reason will be surfaced in the deployment status. Once autoRollback is implemented, the deployment controller will automatically rollback failed deployments. Note that progress will not be estimated during the time a deployment is paused. This is not set by default.
replicas <br /> *integer* | Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
revisionHistoryLimit <br /> *integer* | The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)* | The config this deployment is rolling back to. Will be cleared after rollback is done.
selector <br /> *[LabelSelector](#labelselector-unversioned)* | Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment.
strategy <br /> *[DeploymentStrategy](#deploymentstrategy-v1beta1)* | The deployment strategy to use to replace existing pods with new ones.
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)* | Template describes the pods that will be created.

