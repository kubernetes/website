---
title: Federated Horizontal Pod Autoscalers (HPA)
content_template: templates/task
---

{{% capture overview %}}

{{< feature-state state="alpha" >}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use federated horizontal pod autoscalers (HPAs) in the federation control plane.

HPAs in the federation control plane are similar to the traditional [Kubernetes
HPAs](/docs/tasks/run-application/horizontal-pod-autoscale/), and provide the same functionality.
Creating an HPA targeting a federated object in the federation control plane ensures that the
desired number of replicas of the target object are scaled across the registered clusters,
instead of a single cluster. Also, the control plane keeps monitoring the status of each
individual HPA in the federated clusters and ensures the workload replicas move where they are
needed most by manipulating the min and max limits of the HPA objects in the federated clusters.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "federated-task-tutorial-prereqs.md" >}}
* You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general and [HPAs](/docs/tasks/run-application/horizontal-pod-autoscale/) in particular.

The federated HPA is an alpha feature. The API is not enabled by default on the
federated API server. To use this feature, the user or the admin deploying the federation control
plane needs to run the federated API server with option `--runtime-config=api/all=true` to
enable all APIs, including alpha APIs. Additionally, the federated HPA only works
when used with CPU utilization metrics.
{{% /capture %}}

{{% capture steps %}}

## Creating a federated HPA

The API for federated HPAs is 100% compatible with the
API for traditional Kubernetes HPA. You can create an HPA by sending
a request to the federation API server.

You can do that with [kubectl](/docs/user-guide/kubectl/) by running:

```shell
cat <<EOF | kubectl --context=federation-cluster create -f -
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1beta1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50
EOF
```

The `--context=federation-cluster` flag tells `kubectl` to submit the
request to the federation API server instead of sending it to a Kubernetes
cluster.

Once a federated HPA is created, the federation control plane partitions and
creates the HPA in all underlying Kubernetes clusters. As of Kubernetes V1.7,
[cluster selectors](/docs/tasks/administer-federation/cluster/#clusterselector-annotation)
can also be used to restrict any federated object, including the HPAs in a subset
of clusters.

You can verify the creation by checking each of the underlying clusters. For example, with a context named `gce-asia-east1a`
configured in your client for your cluster in that zone:

```shell
kubectl --context=gce-asia-east1a get HPA php-apache
```

The HPA in the underlying clusters will match the federation HPA
except in the number of min and max replicas. The federation control plane ensures that the sum of max replicas in each cluster matches the specified
max replicas on the federated HPA object, and the sum of minimum replicas will be greater
than or equal to the minimum specified on the federated HPA object. 

{{< note >}}
A particular cluster cannot have a minimum replica sum of 0.
{{< /note >}}

### Spreading HPA min and max replicas in underlying clusters

By default, first max replicas are spread equally in all the underlying clusters, then min replicas are distributed to those clusters that received their maximum value. This means
that each cluster will get an HPA if the specified max replicas are greater than
the total clusters participating in this federation, and some clusters will be
skipped if specified max replicas are less than the total clusters participating
in the federation.

For example: if you have 3 registered clusters and you create a federated HPA with
`spec.maxReplicas = 9`, and `spec.minReplicas = 2`, then each HPA in the 3 clusters
will get `spec.maxReplicas=3` and `spec.minReplicas = 1`.

Currently the default distribution is only available on the federated HPA, but in the
future, users preferences could also be specified to control and/or restrict this
distribution.

## Updating a federated HPA

You can update a federated HPA as you would update a Kubernetes
HPA; however, for a federated HPA, you must send the request to
the federation API server instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated HPA is
updated, it updates the corresponding HPA in all underlying clusters to
match it.

If your update includes a change in the number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that the sum of the max and min replicas remains matched as specified
in the previous section.

## Deleting a federated HPA

You can delete a federated HPA as you would delete a Kubernetes
HPA; however, for a federated HPA, you must send the request to
the federation API server instead of to a specific Kubernetes cluster.

{{< note >}}
For the federated resource to be deleted from all underlying clusters, [cascading deletion](/docs/concepts/cluster-administration/federation/#cascading-deletion) should be used.
{{< /note >}}

For example, you can do that using `kubectl` by running:

```shell
kubectl --context=federation-cluster delete HPA php-apache
```

## Alternative ways to use federated HPA

To a federation user interacting with federated control plane (or simply federation),
the interaction is almost identical to interacting with a normal Kubernetes cluster (but
with a limited set of APIs that are federated). As both Deployments and
HorizontalPodAutoscalers are now federated, `kubectl` commands like `kubectl run`
and `kubectl autoscale` work on federation. Given this fact, the mechanism specified in
[horizontal pod autoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
will also work when used with federation.
Care however will need to be taken that when
[generating load on a target deployment](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#step-three-increase-load),
it should be done against a specific federated cluster (or multiple clusters) not the federation.

## Conclusion

The use of federated HPA is to ensure workload replicas move to the cluster(s) where
they are needed most, or in other words where the load is beyond expected threshold.
The federated HPA feature achieves this by manipulating the min and max replicas on the
HPAs it creates in the federated clusters. It does not directly monitor the target
object metrics from the federated clusters. It actually relies on the in-cluster HPA
controllers to monitor the metrics and update relevant fields. The in-cluster HPA
controller monitors the target pod metrics and updates the fields like desired
replicas (after metrics based calculations) and current replicas (observing the
current status of in cluster pods). The federated HPA controller, on the other hand,
monitors only the cluster-specific HPA object fields and updates the min replica and
max replica fields of those in cluster HPA objects, which have replicas matching thresholds.

For example, if a cluster has both desired replicas and current replicas the same as the max replicas,
and averaged current CPU utilization still higher than the target CPU utilization (all of which
are fields on local HPA object), then the target app in this cluster
needs more replicas, and the scaling is currently restricted by max replicas set on this local
HPA object. In such a scenario, the federated HPA controller scans all clusters and tries to
find clusters which do not have such a condition (meaning the desired replicas are less
than the max, and current averaged CPU utilization is lower then the threshold). If it finds such
a cluster, it reduces the max replica on the HPA in this cluster and increases the max replicas
on the HPA in the cluster which needed the replicas.

There are many other similar conditions which the federated HPA controller checks and moves the max
replicas and min replicas around the local HPAs in federated clusters to eventually ensure that
the replicas move (or remain) in the cluster(s) which need them.

For more information, see ["federated HPA design proposal"](https://github.com/kubernetes/community/pull/593).

{{% /capture %}}


