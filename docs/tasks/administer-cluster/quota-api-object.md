---
title: Configure Quotas for API Objects
---


{% capture overview %}

This page shows how to set a quotas for API objects, including
PersistentVolumeClaims, NodePorts, and Load Balancers. You specify quotas in a
[ResourceQuota](/docs/api-reference/v1.7/#resourcequota-v1-core)
object.

See https://github.com/kubernetes/community/blob/master/contributors/design-proposals/admission_control_resource_quota.md. 

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace quota-object-example
```

## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:

{% include code.html language="yaml" file="quota-objects.yaml" ghlink="/docs/tasks/administer-cluster/quota-objects.yaml" %}

Create the ResourceQuota:

```shell
kubectl create -f https://k8s.io/docs/tasks/administer-cluster/quota-objects.yaml --namespace=quota-object-example
```

View detailed information about the ResourceQuota:

```shell
kubectl get resourcequota api-object-demo --namespace=quota-object-example --output=yaml
```

The output shows that the namespace has 

```yaml
xxx
```


## Clean up

Delete your namespace:

```shell
kubectl delete namespace quota-object-example
```

{% endcapture %}

{% capture whatsnext %}

### For cluster administrators

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configure Default Memory Requests and Limits for a Namespace](docs/tasks/administer-cluster/default-memory-request-limit/)

* [Configure Default CPU Requests and Limits for a Namespace](docs/tasks/administer-cluster/default-cpu-request-limit/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](docs/tasks/configure-pod-container/assign-cpu-resource/)

{% endcapture %}


{% include templates/task.md %}


