

-----------
# Deployment v1beta1

>bdocs-tab:example Deployment Config to run 3 nginx instances (max rollback set to 10 revisions).

```bdocs-tab:example_yaml

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  # Unique key of the Deployment instance
  name: deployment-example
spec:
  # 3 Pods should exist at all times.
  replicas: 3
  # Keep record of 2 revisions for rollback
  revisionHistoryLimit: 2
  template:
    metadata:
      labels:
        # Apply this label to pods and default
        # the Deployment label selector to this value
        app: nginx
    spec:
      containers:
      - name: nginx
        # Run this image
        image: nginx:1.10


```


Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | Deployment







Deployment enables declarative updates for Pods and ReplicaSets.

<aside class="notice">
Appears In <a href="#deploymentlist-v1beta1">DeploymentList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata.
spec <br /> *[DeploymentSpec](#deploymentspec-v1beta1)*  | Specification of the desired behavior of the Deployment.
status <br /> *[DeploymentStatus](#deploymentstatus-v1beta1)*  | Most recently observed status of the Deployment.


### DeploymentSpec v1beta1

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
minReadySeconds <br /> *integer*  | Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
paused <br /> *boolean*  | Indicates that the deployment is paused and will not be processed by the deployment controller.
progressDeadlineSeconds <br /> *integer*  | The maximum time in seconds for a deployment to make progress before it is considered to be failed. The deployment controller will continue to process failed deployments and a condition with a ProgressDeadlineExceeded reason will be surfaced in the deployment status. Once autoRollback is implemented, the deployment controller will automatically rollback failed deployments. Note that progress will not be estimated during the time a deployment is paused. This is not set by default.
replicas <br /> *integer*  | Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
revisionHistoryLimit <br /> *integer*  | The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)*  | The config this deployment is rolling back to. Will be cleared after rollback is done.
selector <br /> *[LabelSelector](#labelselector-unversioned)*  | Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment.
strategy <br /> *[DeploymentStrategy](#deploymentstrategy-v1beta1)*  | The deployment strategy to use to replace existing pods with new ones.
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template describes the pods that will be created.

### DeploymentStatus v1beta1

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.
conditions <br /> *[DeploymentCondition](#deploymentcondition-v1beta1) array*  | Represents the latest available observations of a deployment's current state.
observedGeneration <br /> *integer*  | The generation observed by the deployment controller.
replicas <br /> *integer*  | Total number of non-terminated pods targeted by this deployment (their labels match the selector).
unavailableReplicas <br /> *integer*  | Total number of unavailable pods targeted by this deployment.
updatedReplicas <br /> *integer*  | Total number of non-terminated pods targeted by this deployment that have the desired template spec.

### DeploymentList v1beta1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[Deployment](#deployment-v1beta1) array*  | Items is the list of Deployments.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata.

### DeploymentStrategy v1beta1

<aside class="notice">
Appears In <a href="#deploymentspec-v1beta1">DeploymentSpec</a> </aside>

Field        | Description
------------ | -----------
rollingUpdate <br /> *[RollingUpdateDeployment](#rollingupdatedeployment-v1beta1)*  | Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate.
type <br /> *string*  | Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate.

### DeploymentRollback v1beta1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
name <br /> *string*  | Required: This must match the Name of a deployment.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)*  | The config of this deployment rollback.
updatedAnnotations <br /> *object*  | The annotations to be updated to a deployment

### RollingUpdateDeployment v1beta1

<aside class="notice">
Appears In <a href="#deploymentstrategy-v1beta1">DeploymentStrategy</a> </aside>

Field        | Description
------------ | -----------
maxSurge <br /> *[IntOrString](#intorstring-intstr)*  | The maximum number of pods that can be scheduled above the desired number of pods. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up. By default, a value of 1 is used. Example: when this is set to 30%, the new RC can be scaled up immediately when the rolling update starts, such that the total number of old and new pods do not exceed 130% of desired pods. Once old pods have been killed, new RC can be scaled up further, ensuring that total number of pods running at any time during the update is atmost 130% of desired pods.
maxUnavailable <br /> *[IntOrString](#intorstring-intstr)*  | The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding up. This can not be 0 if MaxSurge is 0. By default, a fixed value of 1 is used. Example: when this is set to 30%, the old RC can be scaled down to 70% of desired pods immediately when the rolling update starts. Once new pods are ready, old RC can be scaled down further, followed by scaling up the new RC, ensuring that the total number of pods available at all times during the update is at least 70% of desired pods.





