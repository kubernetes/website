

-----------
# DeploymentStrategy v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DeploymentStrategy







DeploymentStrategy describes how to replace existing pods with new ones.

<aside class="notice">
Appears In <a href="#deploymentspec-v1beta1">DeploymentSpec</a> </aside>

Field        | Description
------------ | -----------
rollingUpdate <br /> *[RollingUpdateDeployment](#rollingupdatedeployment-v1beta1)*  | Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate.
type <br /> *string*  | Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate.






