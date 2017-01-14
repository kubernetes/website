## DeploymentRollback v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DeploymentRollback



DeploymentRollback stores the information required to rollback a deployment.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
name <br /> *string*  | Required: This must match the Name of a deployment.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)*  | The config of this deployment rollback.
updatedAnnotations <br /> *object*  | The annotations to be updated to a deployment

