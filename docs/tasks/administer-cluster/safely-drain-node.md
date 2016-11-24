---
assignees:
- davidopp

---
 
{% capture overview %}
This page shows how to safely drain a machine, respecting the application-level
disruption SLOs you have specified using PodDisruptionBudget.
{% endcapture %}

{% capture prerequisites %}

* We assume you are using Kubernetes release >= 1.5.

* We assume you have created [PodDisruptionBudget(s)](../../admin/disruptions.md) to express the
application-level disruption SLOs you want the system to enforce.

{% endcapture %}

{% capture steps %}

### Use `kubectl drain` to remove a node from service

You can use `kubectl drain` to safely evict all of your pods from a node before you perform maintenance
on the node (e.g. kernel upgrade, hardware maintenance, etc.). To define a few terms:

* **your pods**: Certain system pods that cannot be killed are ignored; see the
[kubectl drain](../../user-guide/kubectl/kubectl_drain/) documentation for more details
* **safely**: (1) the evictions wil give the containers [graceful termination](../../user-guide/production-pods/#lifecycle-hooks-and-termination-notice)
and (2) will respect the PodDisruptionBudgets

What this means is that when `kubectl drain` returns (without giving an error), all of
your pods have been evicted respecting the desired graceful termination period and without
violating any application-level disruption SLOs. At that point is is safe to power down
the node (or equivalently, if on a cloud platform, delete the virtual machine backing the node).

First, identify the name of the node you wish to drain. You can list all of the nodes in your cluster with
```shell
kubectl get nodes
```

Next, tell Kubernetes to drain the node:
```shell
kubectl drain <node name>
```

Once it returns (without giving an error), you can power down the node
(or equivalently, if on a cloud platform, delete the virtual machine backing the node).
If you leave the node in the cluster during the maintenance operation, you need to run
```shell
kubectl uncordon <node name>
```
afterwards to tell Kubernetes that it can resume scheduling new pods onto the node.

### What `kubectl drain` is doing under the covers

The way `kubectl drain` work is that first is "cordons" the node, meaning it marks
the node as unschedulable so that new pods won't be assigned to the node. Then it
evicts the pods, respecting their graceful termination and PodDisruptionBudgets.
After the desired maintenance activities have been performed, the operator must
run `kubectl uncordon` to enable new pods to be scheduled onto the node.

### Draining multiple nodes in parallel

`kubectl drain` only takes a single node as an argument. However, you can run multiple
`kubectl drain` operations in parallel, in different terminals or in the backround.
PodDisruptionBudget will be respected. For example, say you have a three-replica
StatefulSet, and have created a PodDisruptionBudget specifying `minAvailable: 2`
using a label selector that identifies the StatefulSet. Then `kubectl drain` will
only evict a pod from the StatefulSet if all three pods are ready, and if you run
multiple drains in parallel, only one pod will be unavailable at a time (any drains
that would cause the number of ready replicas to fall below 2 will be blocked).

Do not run more than one `kubectl drain` on the same node at the same time.


{% endcapture %}

{% capture whatsnext %}
*TODO: link to other docs about Stateful Set?*
{% endcapture %}

{% include templates/task.md %}
