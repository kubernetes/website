# <strong>WORKLOADS</strong>

These are responsible for managing and running your containers on the cluster.  [Containers](#container-v1) are created
by Controllers through [Pods](#pod-v1).  Pods run Containers and provide environmental dependencies such as shared or
persistent storage [Volumes](#volume-v1) and [Configuration](#configmap-v1) or [Secret](#secret-v1) data injected into the
container.

The most common Controllers are:

- [Deployments](#deployment-v1beta1) for stateless persistent apps (e.g. http servers)
- [StatefulSets](#statefulset-v1beta1) for stateful persistent apps (e.g. databases)
- [Jobs](#job-v1) for run-to-completion apps (e.g. batch jobs).

------------
