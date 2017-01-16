## NodeDaemonEndpoints v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NodeDaemonEndpoints

> Example yaml coming soon...



NodeDaemonEndpoints lists ports opened by daemons running on the Node.

<aside class="notice">
Appears In  <a href="#nodestatus-v1">NodeStatus</a> </aside>

Field        | Description
------------ | -----------
kubeletEndpoint <br /> *[DaemonEndpoint](#daemonendpoint-v1)* | Endpoint on which Kubelet is listening.

