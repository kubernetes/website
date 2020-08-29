---
reviewers:
- jessfraz
title: Inject Information into Pods Using a PodPreset
min-kubernetes-server-version: v1.6
content_type: task
weight: 60
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.6" state="alpha" >}}

This page shows how to use PodPreset objects to inject information like {{< glossary_tooltip text="Secrets" term_id="secret" >}}, volume mounts, and {{< glossary_tooltip text="environment variables" term_id="container-env-variables" >}} into Pods at creation time.



## {{% heading "prerequisites" %}}


You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one using [Minikube](/docs/setup/learning-environment/minikube/).
Make sure that you have [enabled PodPreset](/docs/concepts/workloads/pods/podpreset/#enable-pod-preset) in your cluster.



<!-- steps -->


## Use Pod presets to inject environment variables and volumes

In this step, you create a preset that has a volume mount and one environment variable.
Here is the manifest for the PodPreset:

{{< codenew file="podpreset/preset.yaml" >}}

The name of a PodPreset object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

In the manifest, you can see that the preset has an environment variable definition called `DB_PORT`
and a volume mount definition called `cache-volume` which is mounted under `/cache`. The {{< glossary_tooltip text="selector" term_id="selector" >}} specifies that
the preset will act upon any Pod that is labeled `role:frontend`.

Create the PodPreset:

```shell
kubectl apply -f https://k8s.io/examples/podpreset/preset.yaml
```

Verify that the PodPreset has been created:

```shell
kubectl get podpreset
```
```
NAME             CREATED AT
allow-database   2020-01-24T08:54:29Z
```

This manifest defines a Pod labelled `role: frontend` (matching the PodPreset's selector):

{{< codenew file="podpreset/pod.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://k8s.io/examples/podpreset/pod.yaml
```

Verify that the Pod is running:

```shell
kubectl get pods
```

The output shows that the Pod is running:

```
NAME      READY     STATUS    RESTARTS   AGE
website   1/1       Running   0          4m
```

View the Pod spec altered by the admission controller in order to see the effects of the preset
having been applied:

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/merged.yaml" >}}

The `DB_PORT` environment variable, the `volumeMount` and the `podpreset.admission.kubernetes.io` annotation
of the Pod verify that the preset has been applied.

## Pod spec with ConfigMap example

This is an example to show how a Pod spec is modified by a Pod preset
that references a ConfigMap containing environment variables.

Here is the manifest containing the definition of the ConfigMap:

{{< codenew file="podpreset/configmap.yaml" >}}

Create the ConfigMap:

```shell
kubectl create -f https://k8s.io/examples/podpreset/configmap.yaml
```

Here is a PodPreset manifest referencing that ConfigMap:

{{< codenew file="podpreset/allow-db.yaml" >}}

Create the preset that references the ConfigMap:

```shell
kubectl create -f https://k8s.io/examples/podpreset/allow-db.yaml
```

The following manifest defines a Pod matching the PodPreset for this example:

{{< codenew file="podpreset/pod.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://k8s.io/examples/podpreset/pod.yaml
```

View the Pod spec altered by the admission controller in order to see the effects of the preset
having been applied:

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/allow-db-merged.yaml" >}}

The `DB_PORT` environment variable and the `podpreset.admission.kubernetes.io` annotation of the Pod
verify that the preset has been applied.

## ReplicaSet with Pod spec example

This is an example to show that only Pod specs are modified by Pod presets. Other workload types
like ReplicaSets or Deployments are unaffected.

Here is the manifest for the PodPreset for this example:

{{< codenew file="podpreset/preset.yaml" >}}

Create the preset:

```shell
kubectl apply -f https://k8s.io/examples/podpreset/preset.yaml
```

This manifest defines a ReplicaSet that manages three application Pods:

{{< codenew file="podpreset/replicaset.yaml" >}}

Create the ReplicaSet:

```shell
kubectl create -f https://k8s.io/examples/podpreset/replicaset.yaml
```

Verify that the Pods created by the ReplicaSet are running:

```shell
kubectl get pods
```

The output shows that the Pods are running:

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-2l94q   1/1     Running   0          2m18s
frontend-6vdgn   1/1     Running   0          2m18s
frontend-jzt4p   1/1     Running   0          2m18s
```

View the `spec` of the ReplicaSet:

```shell
kubectl get replicasets frontend -o yaml
```

{{< note >}}
The ReplicaSet object's `spec` was not changed, nor does the ReplicaSet contain a
`podpreset.admission.kubernetes.io` annotation. This is because a PodPreset only
applies to Pod objects.

To see the effects of the preset having been applied, you need to look at individual Pods.
{{< /note >}}

The command to view the specs of the affected Pods is:

```shell
kubectl get pod --selector=role=frontend -o yaml
```

{{< codenew file="podpreset/replicaset-merged.yaml" >}}

Again the `podpreset.admission.kubernetes.io` annotation of the Pods
verifies that the preset has been applied.

## Multiple Pod presets example

This is an example to show how a Pod spec is modified by multiple Pod presets.


Here is the manifest for the first PodPreset:

{{< codenew file="podpreset/preset.yaml" >}}

Create the first PodPreset for this example:

```shell
kubectl apply -f https://k8s.io/examples/podpreset/preset.yaml
```

Here is the manifest for the second PodPreset:

{{< codenew file="podpreset/proxy.yaml" >}}

Create the second preset:

```shell
kubectl apply -f https://k8s.io/examples/podpreset/proxy.yaml
```

Here's a manifest containing the definition of an applicable Pod (matched by two PodPresets):

{{< codenew file="podpreset/pod.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://k8s.io/examples/podpreset/pod.yaml
```

View the Pod spec altered by the admission controller in order to see the effects of both presets
having been applied:

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/multi-merged.yaml" >}}

The `DB_PORT` environment variable, the `proxy-volume` VolumeMount and the two `podpreset.admission.kubernetes.io`
annotations of the Pod verify that both presets have been applied.

## Conflict example

This is an example to show how a Pod spec is not modified by a Pod preset when there is a conflict.
The conflict in this example consists of a `VolumeMount` in the PodPreset conflicting with a Pod that defines the same `mountPath`.

Here is the manifest for the PodPreset:

{{< codenew file="podpreset/conflict-preset.yaml" >}}

Note the `mountPath` value of `/cache`.

Create the preset:

```shell
kubectl apply -f https://k8s.io/examples/podpreset/conflict-preset.yaml
```

Here is the manifest for the Pod:

{{< codenew file="podpreset/conflict-pod.yaml" >}}

Note the volumeMount element with the same path as in the PodPreset.

Create the Pod:

```shell
kubectl create -f https://k8s.io/examples/podpreset/conflict-pod.yaml
```

View the Pod spec:

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/conflict-pod.yaml" >}}

You can see there is no preset annotation (`podpreset.admission.kubernetes.io`). Seeing no annotation tells you that no preset has not been applied to the Pod.

However, the
[PodPreset admission controller](/docs/reference/access-authn-authz/admission-controllers/#podpreset)
logs a warning containing details of the conflict.
You can view the warning using `kubectl`:

```shell
kubectl -n kube-system logs -l=component=kube-apiserver
```

The output should look similar to:

```
W1214 13:00:12.987884       1 admission.go:147] conflict occurred while applying podpresets: allow-database on pod:  err: merging volume mounts for allow-database has a conflict on mount path /cache:
v1.VolumeMount{Name:"other-volume", ReadOnly:false, MountPath:"/cache", SubPath:"", MountPropagation:(*v1.MountPropagationMode)(nil), SubPathExpr:""}
does not match
core.VolumeMount{Name:"cache-volume", ReadOnly:false, MountPath:"/cache", SubPath:"", MountPropagation:(*core.MountPropagationMode)(nil), SubPathExpr:""}
 in container
```

Note the conflict message on the path for the VolumeMount.

## Deleting a PodPreset

Once you don't need a PodPreset anymore, you can delete it with `kubectl`:

```shell
kubectl delete podpreset allow-database
```
The output shows that the PodPreset was deleted:
```
podpreset "allow-database" deleted
```
