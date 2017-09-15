---
title: Federated Hpas
---

{% capture overview %}
This guide explains how to use Hpas in the Federation control plane.

Hpas in the federation control plane (referred to as "federated Hpas" in
this guide) are very similar to the traditional [Kubernetes
Hpas](/docs/tasks/run-application/horizontal-pod-autoscale/), and provide the same functionality.
Creating a hpa targeting a federated object in the federation control plane ensures that the
desired number of replicas of the target object are scaled across the registered clusters,
instead of a single cluster. Further the control plane keeps monitoring the status of each
individual hpa in the federated clusters and ensures the workload replicas move where they are
needed most by manipulating the min and max limits of the hpa objects into the federated clusters.
{% endcapture %}

{% capture prerequisites %}

* {% include federated-task-tutorial-prereqs.md %}
* You are also expected to have a basic
[working knowledge of Kubernetes](/docs/getting-started-guides/) in
general and [Hpas](/docs/tasks/run-application/horizontal-pod-autoscale/) in particular.

The federated hpa is an alpha feature as of now and the API is not enabled by default on the
federated apiserver. To use this feature the user or the admin deploying the federation control
plane will need to run the federated apiserver with option `--runtime-config=api/all=true` to
enable all apis, including alpha apis. Additionally the federated hpa as of now can work only
when used with cpuUtilization metrics.
{% endcapture %}

{% capture steps %}

## Creating a Federated Hpa

The API for Federated Hpa is 100% compatible with the
API for traditional Kubernetes Hpa. You can create an Hpa by sending
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

Once a federated Hpa is created, the federation control plane will partition and
create an Hpa in all underlying Kubernetes clusters.
You can verify this by checking each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get hpa php-apache
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone.

The Hpa in the underlying clusters will match the federation Hpa
except in the number of min and max replicas. The federation control plane
will ensure that the sum of max replicas in each cluster matches the specified
max replicas on the federated hpa object and sum of min replicas will be greater
then or equal to the min specified on the federated hpa object. The sum of min
is greater or equal to specified min because an Hpa into a particular cluster
cannot have a min replica as 0.


### Spreading Hpa min and max replicas in Underlying Clusters

By default, first max replicas are spread equally in all the underlying clusters
and then min replicas are distributed to those clusters which got max. This means
that each cluster will get an hpa if the max replicas specified are greater then
the total clusters participating in this federation and some clusters will be
skipped if max replicas specified are lesser then the total clusters participating
in this federation.

For example:
if you have 3 registered clusters and you create a federated Hpa with
`spec.maxReplicas = 9`, and `spec.minReplicas = 2` then each Hpa in the 3 clusters
will get `spec.maxReplicas=3` and `spec.minReplicas = 1`.
Its worth noting that the minimum number of minReplicas on an Hpa cannot be zero.
Currently the default distribution is only available on the federated hpa, but in
future users preferences could also be specified to control and/or restrict this
distribution.


## Updating a Federated ReplicaSet

You can update a federated Hpa as you would update a Kubernetes
Hpa; however, for a federated Hpa, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.
The Federation control plane ensures that whenever the federated Hpa is
updated, it updates the corresponding Hpa in all underlying clusters to
match it.
If your update includes a change in number of replicas, the federation
control plane will change the number of replicas in underlying clusters to
ensure that the sum of the max and min replica remains matched as specified
in the previous section above.

## Deleting a Federated Hpa

You can delete a federated Hpa as you would delete a Kubernetes
Hpa; however, for a federated Hpa, you must send the request to
the federation apiserver instead of sending it to a specific Kubernetes cluster.

For example, you can do that using kubectl by running:

```shell
kubectl --context=federation-cluster delete hpa php-apache
```

## Alternative ways to use federated Hpa

To a `federation user` interacting with federated control plane (or simply federation),
the interaction is same as interacting with a normal k8s cluster (but with a limited set of
apis, that which are federated). As both deployments and horizontalpodautoscalers are
now federated, `kubectl` commands like `kubectl run` and `kubectl autoscale` work on
federation. Given this fact the mechanism specified in
[horizontal pod autoscaler walkthrough](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)
will also work when used with federation.
Care however will need to be taken that when
{generating load on a target deployment](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#step-three-increase-load)
it should be done against a specific federated cluster (or multiple clusters) not the federation.

## Conclusion

The use of federated hpa is to ensure workload replicas move to the cluster(s) where
they are needed most, or in other words where the load is more. Federated hpa feature
achieves this by manipulating the min and max replicas on the hpas it creates in the
federated clusters. It reduces the max and min replicas from those clusters which does
not see load or needed cpu utilization on the target workload and increases the same
on the hpa in those clusters where the target workload is more loaded or sees higher
cpu utilization. [Federated hpa proposal](https://github.com/kubernetes/community/pull/593)
can be checked for more details.

{% endcapture %}

{% include templates/task.md %}
