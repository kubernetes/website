---
assignees:
- janetkuo

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
* **Stateful Set fencing**: Fencing guards are implemented in >= 1.5 to prevent split brain scenarios for Stateful Sets. *TODO: Link to doc about fencing*
* **Flipped debug hook behavior**: The default value of the debug annotation (`pod.alpha.kubernetes.io/initialized`) is now `true`. The absence of this annotation will pause the Pet Sets, but will NOT pause the Stateful Sets. In most cases, you no longer need this annotation in your Stateful Set manifests. 


### Upgrading from Pet Sets to Stateful Sets

#### Find all Pet Sets and their manifests 

First, find all existing Pet Sets in your cluster:

```shell
$ kubectl get petsets --all-namespaces
```

If you don't find any existing Pet Sets, you can safely upgrade your cluster to >= 1.5.

If you find existing Pet Sets and you have all their manifests at hand, you can continue to the next step to prepare Stateful Set manifests. 

Otherwise, you need to save their manifests so that you can recreate them as Stateful Sets later. 
Here's an example command for you to save all existing Pet Sets as one file. 

```shell
# Save all existing Pet Sets in all namespaces into a single file. Only needed when you don't have their manifests at hand. 
$ kubectl get petsets --all-namespaces -o yaml > all-petsets.yaml
```

#### Prepare Stateful Set manifests 

Now, for every Pet Set manifest you have, prepare a corresponding Stateful Set manifest with the following steps: 

1. Change `apiVersion` from `apps/v1alpha1` to `apps/v1beta1`
2. Change `kind` from `PetSet` to `StatefulSet`
3. If you have the debug hook annotation `pod.alpha.kubernetes.io/initialized` set to `true`, you may remove it since it's redundant. If you don't have this annotation, you should add one, with the value set to `false`.

It's recommended that you keep both Pet Set manifests and Stateful Set manifests, so that you may safely rollback and recreate your Pet Sets, 
if you decide not to upgrade your cluster. 

#### Delete all Pet Sets without cascading

If you find existing Pet Sets in your cluster in the previous step, you need to delete all Pet Sets *without cascading*. You can do this from `kubectl` with `--cascade=false`. 
Note that if the flag wasn't set, **cascading deletion will be performed by default**, and all pods managed by your Pet Sets will be gone. 

```shell
# Delete all existing Pet Sets without cascading 
$ kubectl delete petsets -f <pet-set-file> --cascade=false

# Alternatively, delete them by name and namespace without cascading
$ kubectl delete petsets <pet-set-name> -n=<pet-set-namespace> --cascade=false

# Get all Pet Sets again to make sure you deleted them all 
$ kubectl get petsets --all-namespaces
```

At this moment, you've deleted all Pet Sets in your cluster, but not their pods, persistent volumes, or persistent volume claims. 
However, since the pods are not managed by Pet Sets anymore, they will be vulnerable to node failures until you finish the upgrade and recreate Stateful Sets.

#### Upgrade your Kubernetes cluster to >= 1.5

Now, you may [upgrade your Kubernetes cluster](/docs/admin/cluster-management/#upgrading-a-cluster), or just your master, to >= 1.5.0.

#### Create Stateful Sets

Now, you want to recreate all Pet Sets, but turning them into Stateful Sets. To do this, just create all Stateful Set manifests you generate in the previous step. 

```shell
$ kubectl create -f <stateful-set-file>
```

Now, you can find all Stateful Sets in the newly-upgraded cluster. 

```shell
$ kubectl get statefulsets --all-namespaces
```

{% endcapture %}

{% capture whatsnext %}
Learn more about debugging a Stateful Set. *TODO: Link to the task for debugging a Stateful Set*
{% endcapture %}

{% include templates/task.md %}
