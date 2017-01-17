## ResourceFieldSelector v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ResourceFieldSelector

> Example yaml coming soon...



ResourceFieldSelector represents container resources (cpu, memory) and their output format

<aside class="notice">
Appears In  <a href="#envvarsource-v1">EnvVarSource</a> </aside>

Field        | Description
------------ | -----------
containerName <br /> *string* | Container name: required for volumes, optional for env vars
divisor <br /> *[Quantity](#quantity-resource)* | Specifies the output format of the exposed resources, defaults to "1"
resource <br /> *string* | Required: resource to select

