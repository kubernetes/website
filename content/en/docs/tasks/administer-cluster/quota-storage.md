---
title: Configure Quotas for Storage
content_type: task
weight: 131
---


<!-- overview -->

This page shows how to configure quotas for PersistentVolumeClaims.
You specify quotas in a
[ResourceQuota](/docs/concepts/policy/resource-quotas/)
object.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace quota-object-example
```

## Create a ResourceQuota

Here is the configuration file for a ResourceQuota object:

{{% code_sample file="admin/resource/quota-objects.yaml" %}}

Create the ResourceQuota:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

View detailed information about the ResourceQuota:

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

The output shows that in the quota-object-example namespace, there can be at most
one PersistentVolumeClaim, at most two Services of type LoadBalancer, and no Services
of type NodePort.

```yaml
status:
  hard:
    persistentvolumeclaims: "1"
    services.loadbalancers: "2"
    services.nodeports: "0"
  used:
    persistentvolumeclaims: "0"
    services.loadbalancers: "0"
    services.nodeports: "0"
```

## Create a PersistentVolumeClaim

Here is the configuration file for a PersistentVolumeClaim object:

{{% code_sample file="admin/resource/quota-objects-pvc.yaml" %}}

Create the PersistentVolumeClaim:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

Verify that the PersistentVolumeClaim was created:

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

The output shows that the PersistentVolumeClaim exists and has status Pending:

```
NAME             STATUS
pvc-quota-demo   Pending
```

## Attempt to create a second PersistentVolumeClaim

Here is the configuration file for a second PersistentVolumeClaim:

{{% code_sample file="admin/resource/quota-objects-pvc-2.yaml" %}}

Attempt to create the second PersistentVolumeClaim:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

The output shows that the second PersistentVolumeClaim was not created,
because it would have exceeded the quota for the namespace.

```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

## Associate a ResourceQuota with a VolumeAttributesClass

This example creates a quota object and matches it with PVC at specific volume attributes classes. The example works as follows:

- PVCs in the cluster have at least one of the three VolumeAttributesClasses: "gold", "silver", "copper".
- One quota object is created for each volume attributes class.

Take a look at the following manifest:

{{% code_sample file="policy/quota-vac.yaml" %}}

Apply the manifest using `kubectl create`.

```shell
kubectl create -f https://k8s.io/examples/policy/quota-vac.yaml --namespace=quota-object-example 
```

```
resourcequota/pvcs-gold created
resourcequota/pvcs-silver created
resourcequota/pvcs-copper created
```

Verify that `Used` quota is `0` using `kubectl describe quota`.

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

Take a look at the following manifest:

{{% code_sample file="policy/gold-vac-pvc.yaml" %}}

Apply it with `kubectl create`.

```shell
kubectl apply -f https://k8s.io/examples/policy/gold-vac-pvc.yaml --namespace=quota-object-example 
```

Verify that "Used" stats for "gold" volume attributes class quota, `pvcs-gold` has changed and that the other two quotas are unchanged.

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

Once the PVC is bound, it is allowed to modify the desired volume attributes class. Let's change it to "silver" with `kubectl patch`:

```shell
kubectl patch pvc gold-vac-pvc --type='merge' -p '{"spec":{"volumeAttributesClassName":"silver"}}'
```

Verify that "Used" stats for "silver" volume attributes class quota, `pvcs-silver` has changed, `pvcs-copper` is unchanged, and `pvcs-gold` might be unchanged or released, which depends on the PVC's status.

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     30Gi
```

Let's change it to "copper" with `kubectl patch`:

```shell
kubectl patch pvc gold-vac-pvc --type='merge' -p '{"spec":{"volumeAttributesClassName":"copper"}}'
```

Verify that "Used" stats for "copper" volume attributes class quota, `pvcs-copper` has changed, `pvcs-silver` and `pvcs-gold` might be unchanged or released, which depends on the PVC's status. 

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   30Gi
```

Print the manifest of the PVC using the following command:

```shell
kubectl get pvc gold-vac-pvc -o yaml
```

It might show the following output:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gold-vac-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: default
  volumeAttributesClassName: copper
status:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 2Gi
  currentVolumeAttributesClassName: gold
  phase: Bound
  modifyVolumeStatus:
    status: InProgress
    targetVolumeAttributesClassName: silver
  storageClassName: default
```

Wait a moment for the volume modification to complete, then verify the quota again.

```shell
kubectl describe quota
```

```
Name:                   pvcs-gold
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     10Gi


Name:                   pvcs-silver
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  0     10
requests.storage        0     20Gi


Name:                   pvcs-copper
Namespace:              default
Resource                Used  Hard
--------                ----  ----
persistentvolumeclaims  1     10
requests.storage        2Gi   30Gi
```

## Clean up

Delete your namespace:

```shell
kubectl delete namespace quota-object-example
```



## {{% heading "whatsnext" %}}

You can also read [Limit Storage Consumption](/docs/tasks/administer-cluster/limit-storage-consumption/)


### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)








