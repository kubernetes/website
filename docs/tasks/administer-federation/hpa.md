---
title: Federated Federated Horizontal Pod Autoscalers (HPA)
---

{% capture overview %}
This guide explains how to use Hpas in the Federation control plane.

HPAs in the federation control plane (referred to as "federated HPAs" in
this guide) are very similar to the traditional [Kubernetes
HPAs](/docs/tasks/run-application/horizontal-pod-autoscale/), and provide the same functionality.
Creating a HPA targeting a federated object in the federation control plane ensures that the
desired number of replicas of the target object are scaled across the registered clusters,
instead of a single cluster. Further the control plane keeps monitoring the status of each
individual HPA in the federated clusters and ensures the workload replicas move where they are
needed most by manipulating the min and max limits of the HPA objects into the federated clusters.
{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/getting-started-guides/) in
general and [HPAs](/docs/tasks/run-application/horizontal-pod-autoscale/) in particular.

The federated HPA is an alpha feature as of now and the API is not enabled by default on the
federated apiserver. To use this feature the user or the admin deploying the federation control
plane will need to run the federated apiserver with option `--runtime-config=api/all=true` to
enable all apis, including alpha apis. Additionally the federated HPA as of now can work only
when used with cpuUtilization metrics.
{% endcapture %}

{% capture steps %}

## Creating a Federated HPA

The API for Federated HPA is 100% compatible with the
API for traditional Kubernetes HPA. You can create an HPA by sending
a request to the federation apiserver.

You can do that using [kubectl](/docs/user-guide/kubectl/) by running:

``` shell
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

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation apiserver instead of sending it to a Kubernetes
cluster.

Once a federated HPA is created, the federation control plane will partition and
create this HPA in all underlying Kubernetes clusters. As of `kubernetes V1.7`
[cluster selectors](docs/tasks/administer-federation/cluster/#clusterselector-annotation)
can also be used to restrict any federated object, including the HPAs into a subset
of clusters.
You can verify the creation by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get HPA php-apache
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

The HPA in the underlying clusters will match the federation HPA
except in the number of min and max replicas. The federation control plane
will ensure that the sum of max replicas in each cluster matches the specified
max replicas on the federated HPA object and sum of min replicas will be greater
than or equal to the min specified on the federated HPA object. The sum of min
is greater than or equal to specified min because an HPA into a particular
cluster cannot have a min replica as 0.


### Spreading HPA min and max replicas in Underlying Clusters

By default, first max replicas are spread equally in all the underlying clusters
and then min replicas are distributed to those clusters which got max. This means
that each cluster will get an HPA if the specified max replicas are greater than
the total clusters participating in this federation and some clusters will be
skipped if specified max replicas are lesser than the total clusters participating
in this federation.

For example:
if you have 3 registered clusters and you create a federated HPA with
`spec.maxReplicas = 9`, and `spec.minReplicas = 2` then each HPA in the 3 clusters
will get `spec.maxReplicas=3` and `spec.minReplicas = 1`.
Its worth noting that the minimum number of minReplicas on an HPA cannot be zero.
Currently the default distribution is only available on the federated HPA, but in
future users preferences could also be specified to control and/or restrict this
distribution.


## Updating a Federated ReplicaSet

You can update a federated HPA as you would update a Kubernetes
HPA; however, for a federated HPA, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated HPA is
updated, it updates the corresponding HPA in all underlying clusters to
match it.
If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that the sum of the max and min replica remains matched as specified
in the previous section above.

## Deleting a Federated HPA

You can delete a federated HPA as you would delete a Kubernetes
HPA; however, for a federated HPA, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
It should also be noted that for the federated resource to be deleted from
all underlying clusters, [cascading deletion](docs/concepts/cluster-administration/federation/#cascading-deletion)
should be used.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete HPA php-apache
```

## Alternative ways to use federated HPA

To a `federation user` interacting with federated control plane (or simply federation),
the interaction is almost identical as interacting with a normal k8s cluster (but
with a limited set of APIs that are federated). As both deployments and
horizontalpodautoscalers are now federated, `kubectl` commands like `kubectl run`
and `kubectl autoscale` work on federation. Given this fact the mechanism specified in
[horizontal pod autoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)
will also work when used with federation.
Care however will need to be taken that when
[generating load on a target deployment](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#step-three-increase-load)
it should be done against a specific federated cluster (or multiple clusters) not the federation.

## Conclusion

The use of federated HPA is to ensure workload replicas move to the cluster(s) where
they are needed most, or in other words where the load is beyond expected threshold.
Federated HPA feature achieves this by manipulating the min and max replicas on the
HPAs it creates in the federated clusters. It does not directly monitor the target
object metrics from the federated clusters. It actually relies on the in cluster HPA
controllers to monitor the metrics and update relevant fields. The in cluster HPA
controller monitors the target pod metrics and updates the fields like desired
replicas (after metrics based calculations) and current replicas (observing the
current status of in cluster pods). The federate HPA controller on the other hand
monitors only the cluster specific HPA object fields and updates the min replica and
max replica fields of those in cluster HPA objects which have replicas matching thresholds.

For example:
The cluster which has both desired replicas and current replicas same as the max replicas
and averaged current cpu utilization still higher than the target cpu utilization (all of which
are fields on local HPA object) would mean that the target app in this particular cluster
needs more replicas, and the scaling is currently restricted by max replicas set on this local
HPA object. In such a scenario, the federated HPA controller scans all clusters and tries to
find clusters which do not have such a condition (meaning the the desired replicas are lesser
than the max and current averaged cpu utilization is lower then the threshold). If it finds such
a cluster, it reduces the max replica on the HPA in this cluster and increases the max replicas
on the HPA in the cluster which needed the replicas.
There are many other similar conditions which federated HPA controller checks and moves the max
replicas and min replicas around the local HPAs in federated clusters to eventually ensure, that
the replicas move (or remain) in the cluster(s) which need them.
For a more curious reader [federated HPA design proposal](https://github.com/kubernetes/community/pull/593)
can be checked for more details.

{% endcapture %}

{% include templates/task.md %}
