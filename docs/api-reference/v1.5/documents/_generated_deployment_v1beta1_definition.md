## Deployment v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | Deployment



Deployment enables declarative updates for Pods and ReplicaSets.

<aside class="notice">
Appears In  <a href="#deploymentlist-v1beta1">DeploymentList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata.
spec <br /> *[DeploymentSpec](#deploymentspec-v1beta1)*  | Specification of the desired behavior of the Deployment.
status <br /> *[DeploymentStatus](#deploymentstatus-v1beta1)*  | Most recently observed status of the Deployment.

