## EnvVarSource v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | EnvVarSource

> Example yaml coming soon...



EnvVarSource represents a source for the value of an EnvVar.

<aside class="notice">
Appears In  <a href="#envvar-v1">EnvVar</a> </aside>

Field        | Description
------------ | -----------
configMapKeyRef <br /> *[ConfigMapKeySelector](#configmapkeyselector-v1)* | Selects a key of a ConfigMap.
fieldRef <br /> *[ObjectFieldSelector](#objectfieldselector-v1)* | Selects a field of the pod: supports metadata.name, metadata.namespace, metadata.labels, metadata.annotations, spec.nodeName, spec.serviceAccountName, status.podIP.
resourceFieldRef <br /> *[ResourceFieldSelector](#resourcefieldselector-v1)* | Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.
secretKeyRef <br /> *[SecretKeySelector](#secretkeyselector-v1)* | Selects a key of a secret in the pod's namespace

