---
reviewers:
- jessfraz
title: Inject Information into Pods Using a PodPreset
content_template: templates/task
weight: 60
---

{{% capture overview %}}

You can use a `podpreset` object to inject information like secrets, volume
mounts, and environment variables etc into pods at creation time.
This task shows some examples on using the `PodPreset` resource.

{{% /capture %}}

{{< toc >}}

{{% capture prerequisites %}}

Get an overview of PodPresets at
[Understanding Pod Presets](/docs/concepts/workloads/pods/podpreset/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Create a Pod Preset

### Simple Pod Spec Example

This is a simple example to show how a Pod spec is modified by the Pod
Preset.

{{< code file="podpreset-preset.yaml" >}}

Create the PodPreset:

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/podpreset-preset.yaml
```

Examine the created PodPreset:

```shell
$ kubectl get podpreset
NAME             AGE
allow-database   1m
```

The new PodPreset will act upon any pod that has label `role: frontend`.

{{< code file="podpreset-pod.yaml" >}}

Create a pod:

```shell
$ kubectl create -f https://k8s.io/docs/tasks/inject-data-application/podpreset-pod.yaml
```

List the running Pods:

```shell
$ kubectl get pods
NAME      READY     STATUS    RESTARTS   AGE
website   1/1       Running   0          4m
```

**Pod spec after admission controller:**

{{< code file="podpreset-merged.yaml" >}}

To see above output, run the following command:

```shell
$ kubectl get pod website -o yaml
```

### Pod Spec with `ConfigMap` Example

This is an example to show how a Pod spec is modified by the Pod Preset
that defines a `ConfigMap` for Environment Variables.

**User submitted pod spec:**

{{< code file="podpreset-pod.yaml" >}}

**User submitted `ConfigMap`:**

{{< code file="podpreset-configmap.yaml" >}}

**Example Pod Preset:**

{{< code file="podpreset-allow-db.yaml" >}}

**Pod spec after admission controller:**

{{< code file="podpreset-allow-db-merged.yaml" >}}

### ReplicaSet with Pod Spec Example

The following example shows that only the pod spec is modified by the Pod
Preset.

**User submitted ReplicaSet:**

{{< code file="podpreset-replicaset.yaml" >}}

**Example Pod Preset:**

{{< code file="podpreset-preset.yaml" >}}

**Pod spec after admission controller:**

Note that the ReplicaSet spec was not changed, users have to check individual pods
to validate that the PodPreset has been applied.

{{< code file="podpreset-replicaset-merged.yaml" >}}

### Multiple PodPreset Example

This is an example to show how a Pod spec is modified by multiple Pod
Injection Policies.

**User submitted pod spec:**

{{< code file="podpreset-pod.yaml" >}}

**Example Pod Preset:**

{{< code file="podpreset-preset.yaml" >}}

**Another Pod Preset:**

{{< code file="podpreset-proxy.yaml" >}}

**Pod spec after admission controller:**

{{< code file="podpreset-multi-merged.yaml" >}}

### Conflict Example

This is an example to show how a Pod spec is not modified by the Pod Preset
when there is a conflict.

**User submitted pod spec:**

{{< code file="podpreset-conflict-pod.yaml" >}}

**Example Pod Preset:**

{{< code file="podpreset-conflict-preset.yaml" >}}

**Pod spec after admission controller will not change because of the conflict:**

{{< code file="podpreset-conflict-pod.yaml" >}}

**If we run `kubectl describe...` we can see the event:**

```shell
$ kubectl describe ...
....
Events:
  FirstSeen             LastSeen            Count   From                    SubobjectPath               Reason      Message
  Tue, 07 Feb 2017 16:56:12 -0700   Tue, 07 Feb 2017 16:56:12 -0700 1   {podpreset.admission.kubernetes.io/podpreset-allow-database }    conflict  Conflict on pod preset. Duplicate mountPath /cache.
```

## Deleting a Pod Preset

Once you don't need a pod preset anymore, you can delete it with `kubectl`:

```shell
$ kubectl delete podpreset allow-database
podpreset "allow-database" deleted
```

{{% /capture %}}
