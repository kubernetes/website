---
title: Autoscale the DNS Service in a Cluster
content_template: templates/task
---

{{% capture overview %}}
This page shows how to enable and configure autoscaling of the DNS service in a
Kubernetes cluster.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* This guide assumes your nodes use the AMD64 or Intel 64 CPU architecture

* Make sure the [DNS feature](/docs/concepts/services-networking/dns-pod-service/) itself is enabled.

* Kubernetes version 1.4.0 or later is recommended.

{{% /capture %}}

{{% capture steps %}}

## Determining whether DNS horizontal autoscaling is already enabled

List the {{< glossary_tooltip text="Deployments" term_id="deployment" >}}
in your cluster in the kube-system namespace:

```shell
kubectl get deployment --namespace=kube-system
```

The output is similar to this:

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        1         1         1            1           ...
    ...

If you see "dns-autoscaler" in the output, DNS horizontal autoscaling is
already enabled, and you can skip to
[Tuning autoscaling parameters](#tuning-autoscaling-parameters).

## Getting the name of your DNS Deployment or ReplicationController

List the Deployments in your cluster in the kube-system namespace:

```shell
kubectl get deployment --namespace=kube-system
```

The output is similar to this:

    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns      2         2         2            2           ...
    ...


In Kubernetes versions earlier than 1.12, the DNS Deployment was called "kube-dns".

In Kubernetes versions earlier than 1.5 DNS was implemented using a
ReplicationController instead of a Deployment. So if you don't see kube-dns,
or a similar name, in the preceding output, list the ReplicationControllers in
your cluster in the kube-system namespace:

```shell
kubectl get rc --namespace=kube-system
```

The output is similar to this:

    NAME            DESIRED   CURRENT   READY     AGE
    ...
    kube-dns-v20    1         1         1         ...
    ...

## Determining your scale target

If you have a DNS Deployment, your scale target is:

    Deployment/<your-deployment-name>

where `<your-deployment-name>` is the name of your DNS Deployment. For example, if
your DNS Deployment name is coredns, your scale target is Deployment/coredns.

If you have a DNS ReplicationController, your scale target is:

    ReplicationController/<your-rc-name>

where `<your-rc-name>` is the name of your DNS ReplicationController. For example,
if your DNS ReplicationController name is kube-dns-v20, your scale target is
ReplicationController/kube-dns-v20.

## Enabling DNS horizontal autoscaling

In this section, you create a Deployment. The Pods in the Deployment run a
container based on the `cluster-proportional-autoscaler-amd64` image.

Create a file named `dns-horizontal-autoscaler.yaml` with this content:

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

In the file, replace `<SCALE_TARGET>` with your scale target.

Go to the directory that contains your configuration file, and enter this
command to create the Deployment:

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

The output of a successful command is:

    deployment.apps/kube-dns-autoscaler created

DNS horizontal autoscaling is now enabled.

## Tuning autoscaling parameters

Verify that the dns-autoscaler {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} exists:

```shell
kubectl get configmap --namespace=kube-system
```

The output is similar to this:

    NAME                  DATA      AGE
    ...
    dns-autoscaler        1         ...
    ...

Modify the data in the ConfigMap:

```shell
kubectl edit configmap dns-autoscaler --namespace=kube-system
```

Look for this line:

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

Modify the fields according to your needs. The "min" field indicates the
minimal number of DNS backends. The actual number of backends number is
calculated using this equation:

    replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )

Note that the values of both `coresPerReplica` and `nodesPerReplica` are
integers.

The idea is that when a cluster is using nodes that have many cores,
`coresPerReplica` dominates. When a cluster is using nodes that have fewer
cores, `nodesPerReplica` dominates.

There are other supported scaling patterns. For details, see
[cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).

## Disable DNS horizontal autoscaling

There are a few options for tuning DNS horizontal autoscaling. Which option to
use depends on different conditions.

### Option 1: Scale down the dns-autoscaler deployment to 0 replicas

This option works for all situations. Enter this command:

```shell
kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system
```

The output is:

    deployment.extensions/dns-autoscaler scaled

Verify that the replica count is zero:

```shell
kubectl get deployment --namespace=kube-system
```

The output displays 0 in the DESIRED and CURRENT columns:

    NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler        0         0         0            0           ...
    ...

### Option 2: Delete the dns-autoscaler deployment

This option works if dns-autoscaler is under your own control, which means
no one will re-create it:

```shell
kubectl delete deployment dns-autoscaler --namespace=kube-system
```

The output is:

    deployment.extensions "dns-autoscaler" deleted

### Option 3: Delete the dns-autoscaler manifest file from the master node

This option works if dns-autoscaler is under control of the (deprecated)
[Addon Manager](https://git.k8s.io/kubernetes/cluster/addons/README.md),
and you have write access to the master node.

Sign in to the master node and delete the corresponding manifest file.
The common path for this dns-autoscaler is:

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

After the manifest file is deleted, the Addon Manager will delete the
dns-autoscaler Deployment.

{{% /capture %}}

{{% capture discussion %}}

## Understanding how DNS horizontal autoscaling works

* The cluster-proportional-autoscaler application is deployed separately from
the DNS service.

* An autoscaler Pod runs a client that polls the Kubernetes API server for the
number of nodes and cores in the cluster.

* A desired replica count is calculated and applied to the DNS backends based on
the current schedulable nodes and cores and the given scaling parameters.

* The scaling parameters and data points are provided via a ConfigMap to the
autoscaler, and it refreshes its parameters table every poll interval to be up
to date with the latest desired scaling parameters.

* Changes to the scaling parameters are allowed without rebuilding or restarting
the autoscaler Pod.

* The autoscaler provides a controller interface to support two control
patterns: *linear* and *ladder*.

## Future enhancements

Control patterns, in addition to linear and ladder, that consider custom metrics
are under consideration as a future development.

Scaling of DNS backends based on DNS-specific metrics is under consideration as
a future development. The current implementation, which uses the number of nodes
and cores in cluster, is limited.

Support for custom metrics, similar to that provided by
[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/),
is under consideration as a future development.

{{% /capture %}}

{{% capture whatsnext %}}
* Learn more about the
[implementation of cluster-proportional-autoscaler](https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).
{{% /capture %}}
