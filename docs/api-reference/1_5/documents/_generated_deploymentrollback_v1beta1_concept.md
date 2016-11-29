

-----------
# DeploymentRollback v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DeploymentRollback







DeploymentRollback stores the information required to rollback a deployment.



Field        | Description
------------ | -----------
name <br /> *string*  | Required: This must match the Name of a deployment.
rollbackTo <br /> *[RollbackConfig](#rollbackconfig-v1beta1)*  | The config of this deployment rollback.
updatedAnnotations <br /> *object*  | The annotations to be updated to a deployment






