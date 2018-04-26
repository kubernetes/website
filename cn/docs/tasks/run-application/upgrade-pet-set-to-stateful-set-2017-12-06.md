---
approvers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Upgrade from PetSets to StatefulSets
---

{% capture overview %}
This page shows how to upgrade from PetSets (Kubernetes version 1.3 or 1.4) to *StatefulSets* (Kubernetes version 1.5 or later).
{% endcapture %}

{% capture prerequisites %}

* If you don't have PetSets in your current cluster, or you don't plan to upgrade
  your master to Kubernetes 1.5 or later, you can skip this task.

{% endcapture %}

{% capture steps %}

## Differences between alpha PetSets and beta StatefulSets

PetSet was introduced as an alpha resource in Kubernetes release 1.3, and was renamed to StatefulSet as a beta resource in 1.5.
Here are some notable changes:

* **StatefulSet is the new PetSet**: PetSet is no longer available in Kubernetes release 1.5 or later. It becomes beta StatefulSet. To understand why the name was changed, see this [discussion thread](https://github.com/kubernetes/kubernetes/issues/27430).
* **StatefulSet guards against split brain**: StatefulSets guarantee at most one Pod for a given ordinal index can be running anywhere in a cluster, to guard against split brain scenarios with distributed applications. *TODO: Link to doc about fencing.*
* **Flipped debug annotation behavior**:
  The default value of the debug annotation (`pod.alpha.kubernetes.io/initialized`) is `true` in 1.5 through 1.7.
  The annotation is completely ignored in 1.8 and above, which always behave as if it were `true`.

  The absence of this annotation will pause PetSet operations, but will NOT pause StatefulSet operations.
  In most cases, you no longer need this annotation in your StatefulSet manifests.


## Upgrading from PetSets to StatefulSets

Note that these steps need to be done in the specified order. You **should
NOT upgrade your Kubernetes master, nodes, or `kubectl` to Kubernetes version
1.5 or later**, until told to do so.

### Find all PetSets and their manifests

First, find all existing PetSets in your cluster:

```shell
kubectl get petsets --all-namespaces
```

If you don't find any existing PetSets, you can safely upgrade your cluster to
Kubernetes version 1.5 or later.

If you find existing PetSets and you have all their manifests at hand, you can continue to the next step to prepare StatefulSet manifests.

Otherwise, you need to save their manifests so that you can recreate them as StatefulSets later.
Here's an example command for you to save all existing PetSets as one file.

```shell
# Save all existing PetSets in all namespaces into a single file. Only needed when you don't have their manifests at hand.
kubectl get petsets --all-namespaces -o yaml > all-petsets.yaml
```

### Prepare StatefulSet manifests

Now, for every PetSet manifest you have, prepare a corresponding StatefulSet manifest:

1. Change `apiVersion` from `apps/v1alpha1` to `apps/v1beta1`.
2. Change `kind` from `PetSet` to `StatefulSet`.
3. If you have the debug hook annotation `pod.alpha.kubernetes.io/initialized` set to `true`,
   you can remove it because it's redundant.
   If you don't have this annotation or have it set to `false`,
   be aware that StatefulSet operations might resume after the upgrade.

   If you are upgrading to 1.6 or 1.7, you can set the annotation explicitly to `false` to maintain
   the paused behavior.
   If you are upgrading to 1.8 or above, there's no longer any debug annotation to pause StatefulSets.

It's recommended that you keep both PetSet manifests and StatefulSet manifests, so that you can safely roll back and recreate your PetSets,
if you decide not to upgrade your cluster.

### Delete all PetSets without cascading

If you find existing PetSets in your cluster in the previous step, you need to delete all PetSets *without cascading*. You can do this from `kubectl` with `--cascade=false`.
Note that if the flag isn't set, **cascading deletion will be performed by default**, and all Pods managed by your PetSets will be gone.

Delete those PetSets by specifying file names. This only works when
the files contain only PetSets, but not other resources such as Services:

```shell
# Delete all existing PetSets without cascading
# Note that <pet-set-file> should only contain PetSets that you want to delete, but not any other resources
kubectl delete -f <pet-set-file> --cascade=false
```

Alternatively, delete them by specifying resource names:

```shell
# Alternatively, delete them by name and namespace without cascading
kubectl delete petsets <pet-set-name> -n=<pet-set-namespace> --cascade=false
```

Make sure you've deleted all PetSets in the system:

```shell
# Get all PetSets again to make sure you deleted them all
# This should return nothing
kubectl get petsets --all-namespaces
```

At this moment, you've deleted all PetSets in your cluster, but not their Pods, Persistent Volumes, or Persistent Volume Claims.
However, since the Pods are not managed by PetSets anymore, they will be vulnerable to node failures until you finish the master upgrade and recreate StatefulSets.

### Upgrade your master to Kubernetes version 1.5 or later

Now, you can [upgrade your Kubernetes master](/docs/admin/cluster-management/#upgrading-a-cluster) to Kubernetes version 1.5 or later.
Note that **you should NOT upgrade Nodes at this time**, because the Pods
(that were once managed by PetSets) are now vulnerable to node failures.

### Upgrade kubectl to Kubernetes version 1.5 or later

Upgrade `kubectl` to Kubernetes version 1.5 or later, following [the steps for installing and setting up
kubectl](/docs/tasks/kubectl/install/).

### Create StatefulSets

Make sure you have both master and `kubectl` upgraded to Kubernetes version 1.5
or later before continuing:

```shell
kubectl version
```

The output is similar to this:

```shell
Client Version: version.Info{Major:"1", Minor:"5", GitVersion:"v1.5.0", GitCommit:"0776eab45fe28f02bbeac0f05ae1a203051a21eb", GitTreeState:"clean", BuildDate:"2016-11-24T22:35:03Z", GoVersion:"go1.7.3", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"5", GitVersion:"v1.5.0", GitCommit:"0776eab45fe28f02bbeac0f05ae1a203051a21eb", GitTreeState:"clean", BuildDate:"2016-11-24T22:30:23Z", GoVersion:"go1.7.3", Compiler:"gc", Platform:"linux/amd64"}
```

If both `Client Version` (`kubectl` version) and `Server Version` (master
version) are 1.5 or later, you are good to go.

Create StatefulSets to adopt the Pods belonging to the deleted PetSets with the
StatefulSet manifests generated in the previous step:

```shell
kubectl create -f <stateful-set-file>
```

Make sure all StatefulSets are created and running as expected in the
newly-upgraded cluster:

```shell
kubectl get statefulsets --all-namespaces
```

### Upgrade nodes to Kubernetes version 1.5 or later (optional)

You can now [upgrade Kubernetes nodes](/docs/admin/cluster-management/#upgrading-a-cluster)
to Kubernetes version 1.5 or later. This step is optional, but needs to be done after all StatefulSets
are created to adopt PetSets' Pods.

You should be running Node version >= 1.1.0 to run StatefulSets safely. Older versions do not support features which allow the StatefulSet to guarantee that at any time, there is **at most** one Pod with a given identity running in a cluster.

{% endcapture %}

{% capture whatsnext %}

Learn more about [scaling a StatefulSet](/docs/tasks/manage-stateful-set/scale-stateful-set/).

{% endcapture %}

{% include templates/task.md %}
