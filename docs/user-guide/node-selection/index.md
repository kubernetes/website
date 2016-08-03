---
assignees:
- dchen1107
- eparis
- mikedanese

---

This example shows how to assign a [pod](/docs/user-guide/pods/) to a specific [node](/docs/admin/node/) or to one of a set of nodes using node labels and the nodeSelector field in a pod specification. Generally this is unnecessary, as the scheduler will take care of things for you, but you may want to do so in certain circumstances like to ensure that your pod ends up on a machine with an SSD attached to it.

You can find all the files for this example [in our docs
repo here](https://github.com/kubernetes/kubernetes.github.io/tree/{{page.docsbranch}}/docs/user-guide/node-selection).

### Step Zero: Prerequisites

This example assumes that you have a basic understanding of Kubernetes pods and that you have [turned up a Kubernetes cluster](https://github.com/kubernetes/kubernetes#documentation).

### Step One: Attach label to the node

Run `kubectl get nodes` to get the names of your cluster's nodes. Pick out the one that you want to add a label to.

Then, to add a label to the node you've chosen, run `kubectl label nodes <node-name> <label-key>=<label-value>`. For example, if my node name is 'kubernetes-foo-node-1.c.a-robinson.internal' and my desired label is 'disktype=ssd', then I can run `kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`.

If this fails with an "invalid command" error, you're likely using an older version of kubectl that doesn't have the `label` command. In that case, see the [previous version](https://github.com/kubernetes/kubernetes/blob/a053dbc313572ed60d89dae9821ecab8bfd676dc/examples/node-selection/README.md) of this guide for instructions on how to manually set labels on a node.

Also, note that label keys must be in the form of DNS labels (as described in the [identifiers doc](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/identifiers.md)), meaning that they are not allowed to contain any upper-case letters.

You can verify that it worked by re-running `kubectl get nodes` and checking that the node now has a label.

### Step Two: Add a nodeSelector field to your pod configuration

Take whatever pod config file you want to run, and add a nodeSelector section to it, like this. For example, if this is my pod config:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
```

Then add a nodeSelector like so:

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/user-guide/node-selection/pod.yaml" %}

When you then run `kubectl create -f pod.yaml`, the pod will get scheduled on the node that you attached the label to! You can verify that it worked by running `kubectl get pods -o wide` and looking at the "NODE" that the pod was assigned to.

#### Alpha feature in Kubernetes v1.2: Node Affinity

During the first half of 2016 we are rolling out a new mechanism, called *affinity* for controlling which nodes your pods wil be scheduled onto.
Like `nodeSelector`, affinity is based on labels. But it allows you to write much more expressive rules.
`nodeSelector` wil continue to work during the transition, but will eventually be deprecated.

Kubernetes v1.2 offers an alpha version of the first piece of the affinity mechanism, called [node affinity](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/nodeaffinity.md).
There are currently two types of node affinity, called `requiredDuringSchedulingIgnoredDuringExecution` and
`preferresDuringSchedulingIgnoredDuringExecution`. You can think of them as "hard" and "soft" respectively,
in the sense that the former specifies rules that *must* be met for a pod to schedule onto a node (just like
`nodeSelector` but using a more expressive syntax), while the latter specifies *preferences* that the scheduler
will try to enforce but will not guarantee. The "IgnoredDuringExecution" part of the names means that, similar
to how `nodeSelector` works, if labels on a node change at runtime such that the rules on a pod are no longer
met, the pod will still continue to run on the node. In the future we plan to offer
`requiredDuringSchedulingRequiredDuringExecution` which will be just like `requiredDuringSchedulingIgnoredDuringExecution`
except that it will evict pods from nodes that cease to satisfy the pods' node affinity requirements.

Node affinity is currently expressed using an annotation on Pod. In v1.3 it will use a field, and we will
also introduce the second piece of the affinity mechanism, called pod affinity,
which allows you to control whether a pod schedules onto a particular node based on which other pods are
running on the node, rather than the labels on the node.

Here's an example of a pod that uses node affinity:

{% include code.html language="yaml" file="pod-with-node-affinity.yaml" ghlink="/docs/user-guide/node-selection/pod-with-node-affinity.yaml" %}

This node affinity rule says the pod can only be placed on a node with a label whose key is
`kubernetes.io/e2e-az-name` and whose value is either `e2e-az1` or `e2e-az2`. In addition,
among nodes that meet that criteria, nodes with a label whose key is `another-annotation-key` and whose
value is `another-annotation-value` should be preferred.

You can see the operator `In` being used in the example. The new node affinity syntax supports the following operators: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.

If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied for the pod
to be scheduled onto a candidate node.

### Built-in node labels

In addition to labels you [attach yourself](#step-one-attach-label-to-the-node), nodes come pre-populated
with a standard set of labels. As of Kubernetes v1.2 these labels are

* `kubernetes.io/hostname`
* `failure-domain.beta.kubernetes.io/zone`
* `failure-domain.beta.kubernetes.io/region`
* `beta.kubernetes.io/instance-type`

### Conclusion

While this example only covered one node, you can attach labels to as many nodes as you want. Then when you schedule a pod with a nodeSelector, it can be scheduled on any of the nodes that satisfy that nodeSelector. Be careful that it will match at least one node, however, because if it doesn't the pod won't be scheduled at all.
