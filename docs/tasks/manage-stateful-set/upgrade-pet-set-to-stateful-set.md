---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton

---

{% capture overview %}
This page shows how to upgrade from Pet Sets (Kubernetes cluster at version 1.3-1.4) to Stateful Sets (version >= 1.5).
{% endcapture %}

{% capture prerequisites %}

* If you don't have Pet Sets in your current cluster, or you don't plan to upgrade your cluster/master to >= 1.5 at this moment, you can skip this task now. 

{% endcapture %}

{% capture steps %}

### Differences between alpha Pet Sets and beta Stateful Sets

Pet Set was introduced as an alpha resource in Kubernetes release 1.3, and was renamed to Stateful Set as a beta resource in 1.5. 
Here are some notable changes:

* **Stateful Set is the new Pet Set**: Pet Set is no longer available in any Kubernetes release >= 1.5. It becomes beta Stateful Set. To know why the name is changed, see this [discussion thread](https://github.com/kubernetes/kubernetes/issues/27430).
* **Stateful Set guards against split brain**: Stateful Sets guarantee at most one pod for a given ordinal index can be running anywhere in a cluster, in order to guard against split brain scenarios with distributed applications. *TODO: Link to doc about fencing*
* **Flipped debug annotation behavior**: The default value of the debug annotation (`pod.alpha.kubernetes.io/initialized`) is now `true`. The absence of this annotation will pause Pet Set operations, but will NOT pause Stateful Set operations. In most cases, you no longer need this annotation in your Stateful Set manifests. 


### Upgrading from Pet Sets to Stateful Sets

Note that these steps need to be operated in the specified order. You **should
NOT upgrade your Kubernetes master, nodes, or `kubectl` to >= 1.5 version yet**,
until told to do so.

#### Find all Pet Sets and their manifests 

First, find all existing Pet Sets in your cluster:

```shell
kubectl get petsets --all-namespaces
```

If you don't find any existing Pet Sets, you can safely upgrade your cluster to >= 1.5.

If you find existing Pet Sets and you have all their manifests at hand, you can continue to the next step to prepare Stateful Set manifests. 

Otherwise, you need to save their manifests so that you can recreate them as Stateful Sets later. 
Here's an example command for you to save all existing Pet Sets as one file. 

```shell
# Save all existing Pet Sets in all namespaces into a single file. Only needed when you don't have their manifests at hand. 
kubectl get petsets --all-namespaces -o yaml > all-petsets.yaml
```

#### Prepare Stateful Set manifests 

Now, for every Pet Set manifest you have, prepare a corresponding Stateful Set manifest with the following steps: 

1. Change `apiVersion` from `apps/v1alpha1` to `apps/v1beta1`
2. Change `kind` from `PetSet` to `StatefulSet`
3. If you have the debug hook annotation `pod.alpha.kubernetes.io/initialized` set to `true`, you may remove it since it's redundant. If you don't have this annotation, you should add one, with the value set to `false`, to pause Stateful Sets operations.

It's recommended that you keep both Pet Set manifests and Stateful Set manifests, so that you may safely rollback and recreate your Pet Sets, 
if you decide not to upgrade your cluster. 

#### Delete all Pet Sets without cascading

If you find existing Pet Sets in your cluster in the previous step, you need to delete all Pet Sets *without cascading*. You can do this from `kubectl` with `--cascade=false`. 
Note that if the flag wasn't set, **cascading deletion will be performed by default**, and all pods managed by your Pet Sets will be gone. 

You may delete those Pet Sets by specifying file names. This only works when in
the files there are only Pet Sets, but not other resources (such as Services):

```shell
# Delete all existing Pet Sets without cascading 
# Note that <pet-set-file> should only contain Pet Sets that you want to delete, but not any other resources
kubectl delete -f <pet-set-file> --cascade=false
```

Alternatively, you may delete them by specifying resource names: 

```shell
# Alternatively, delete them by name and namespace without cascading
kubectl delete petsets <pet-set-name> -n=<pet-set-namespace> --cascade=false
```

To make sure you've deleted all Pet Sets in the system, run this command, which
should return nothing:

```shell
# Get all Pet Sets again to make sure you deleted them all 
kubectl get petsets --all-namespaces
```

At this moment, you've deleted all Pet Sets in your cluster, but not their Pods, Persistent Volumes, or Persistent Volume Claims. 
However, since the pods are not managed by Pet Sets anymore, they will be vulnerable to node failures until you finish the master upgrade and recreate Stateful Sets.

#### Upgrade Kubernetes master to >= 1.5

Now, you may [upgrade your Kubernetes master](/docs/admin/cluster-management/#upgrading-a-cluster) to >= 1.5.0.
Note that Kubernetes nodes should NOT be upgraded at this point, since the pods
(that were once managed be Pet Sets) are now vulnerable to node failures. 

#### Upgrade kubectl to >= 1.5

Upgrade `kubectl` to >= 1.5 following [the steps for installing and setting up 
kubectl](/docs/user-guide/prereqs/).

#### Create Stateful Sets

Make sure you have both master and `kubectl` upgrade to a version >= 1.5 before
continuing. To verify this, run this command to make sure both client and server
versions are >= 1.5:

```shell
kubectl version
```

You need to create Stateful Sets to adopt the pods belonging to the deleted Pet Sets. 
To do this, just create all Stateful Set manifests generated in the previous step. 

```shell
kubectl create -f <stateful-set-file>
```

Then you'll find all Stateful Sets in the newly-upgraded cluster. Run this
command to make sure they are running as expected before continuing:

```shell
kubectl get statefulsets --all-namespaces
```

#### Upgrade Kubernetes nodes to >= 1.5 (optional)

You may now safely [upgrading Kubernetes nodes](/docs/admin/cluster-management/#upgrading-a-cluster)
to >= 1.5.0. This step is optional, but needs to be done after all Stateful Sets
are created to adopt Pet Sets' pods.


{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a Stateful Set. *TODO: Link to the task for debugging a Stateful Set*
{% endcapture %}

{% include templates/task.md %}
