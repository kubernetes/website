---
layout: blog
title: "Introducing Hierarchical Namespaces"
date: 2020-08-14
author: >
  Adrian Ludwin (Google)
---

Safely hosting large numbers of users on a single Kubernetes cluster has always
been a troublesome task. One key reason for this is that different organizations
use Kubernetes in different ways, and so no one tenancy model is likely to suit
everyone. Instead, Kubernetes offers you building blocks to create your own
tenancy solution, such as Role Based Access Control (RBAC) and NetworkPolicies;
the better these building blocks, the easier it is to safely build a multitenant
cluster.

# Namespaces for tenancy

By far the most important of these building blocks is the namespace, which forms
the backbone of almost all Kubernetes control plane security and sharing
policies. For example, RBAC, NetworkPolicies and ResourceQuotas all respect
namespaces by default, and objects such as Secrets, ServiceAccounts and
Ingresses are freely usable _within_ any one namespace, but fully segregated
from _other_ namespaces.

Namespaces have two key properties that make them ideal for policy enforcement.
Firstly, they can be used to **represent ownership**. Most Kubernetes objects
_must_ be in a namespace, so if you use namespaces to represent ownership, you
can always count on there being an owner.

Secondly, namespaces have **authorized creation and use**. Only
highly-privileged users can create namespaces, and other users require explicit
permission to use those namespaces - that is, create, view or modify objects in
those namespaces. This allows them to be carefully created with appropriate
policies, before unprivileged users can create “regular” objects like pods and
services.

# The limits of namespaces

However, in practice, namespaces are not flexible enough to meet some common use
cases. For example, let’s say that one team owns several microservices with
different secrets and quotas. Ideally, they should place these services into
different namespaces in order to isolate them from each other, but this presents
two problems.

Firstly, these namespaces have no common concept of ownership, even though
they’re both owned by the same team. This means that if the team controls
multiple namespaces, not only does Kubernetes not have any record of their
common owner, but namespaced-scoped policies cannot be applied uniformly across
them.

Secondly, teams generally work best if they can operate autonomously, but since
namespace creation is highly privileged, it’s unlikely that any member of the
dev team is allowed to create namespaces. This means that whenever a team wants
a new namespace, they must raise a ticket to the cluster administrator. While
this is probably acceptable for small organizations, it generates unnecessary
toil as the organization grows.

# Introducing hierarchical namespaces

[Hierarchical
namespaces](https://github.com/kubernetes-sigs/hierarchical-namespaces/blob/master/docs/user-guide/concepts.md#basic-concepts)
are a new concept developed by the [Kubernetes Working Group for Multi-Tenancy
(wg-multitenancy)](https://github.com/kubernetes-sigs/multi-tenancy) in order to
solve these problems. In its simplest form, a hierarchical namespace is a
regular Kubernetes namespace that contains a small custom resource that
identifies a single, optional, parent namespace. This establishes the concept of
ownership _across_ namespaces, not just _within_ them.

This concept of ownership enables two additional types of behaviours:

* **Policy inheritance:** if one namespace is a child of another, policy objects
  such as RBAC RoleBindings are [copied from the parent to the
  child](https://github.com/kubernetes-sigs/hierarchical-namespaces/blob/master/docs/user-guide/concepts.md#policy-inheritance-and-object-propagation).
* **Delegated creation:** you usually need cluster-level privileges to create a
  namespace, but hierarchical namespaces adds an alternative:
  [_subnamespaces_](https://github.com/kubernetes-sigs/hierarchical-namespaces/blob/master/docs/user-guide/concepts.md#subnamespaces-and-full-namespaces),
  which can be manipulated using only limited permissions in the parent
  namespace.

This solves both of the problems for our dev team. The cluster administrator can
create a single “root” namespace for the team, along with all necessary
policies, and then delegate permission to create subnamespaces to members of
that team. Those team members can then create subnamespaces for their own use,
without violating the policies that were imposed by the cluster administrators.

# Hands-on with hierarchical namespaces

Hierarchical namespaces are provided by a Kubernetes extension known as the
[**Hierarchical Namespace
Controller**](https://github.com/kubernetes-sigs/hierarchical-namespaces#the-hierarchical-namespace-controller-hnc),
or **HNC**. The HNC consists of two components:

* The **manager** runs on your cluster, manages subnamespaces, propagates policy
  objects, ensures that your hierarchies are legal and manages extension points.
* The **kubectl plugin**, called `kubectl-hns`, makes it easy for users to
  interact with the manager.

Both can be easily installed from the [releases page of our
repo](https://github.com/kubernetes-sigs/hierarchical-namespaces/releases).

Let’s see HNC in action. Imagine that I do not have namespace creation
privileges, but I can view the namespace `team-a` and create subnamespaces
within it<sup>[1](#note-1)</sup>. Using the plugin, I can now say:

```bash
$ kubectl hns create svc1-team-a -n team-a
```

This creates a subnamespace called `svc1-team-a`. Note that since subnamespaces
are just regular Kubernetes namespaces, all subnamespace names must still be
unique.

I can view the structure of these namespaces by asking for a tree view:

```bash
$ kubectl hns tree team-a
# Output:
team-a
└── svc1-team-a
```

And if there were any policies in the parent namespace, these now appear in the
child as well<sup>[2](#note-2)</sup>. For example, let’s say that `team-a` had
an RBAC RoleBinding called `sres`. This rolebinding will also be present in the
subnamespace:

```bash
$ kubectl describe rolebinding sres -n svc1-team-a
# Output:
Name:         sres
Labels:       hnc.x-k8s.io/inheritedFrom=team-a  # inserted by HNC
Annotations:  <none>
Role:
  Kind:  ClusterRole
  Name:  admin
Subjects: ...
```

Finally, HNC adds labels to these namespaces with useful information about the
hierarchy which you can use to apply other policies. For example, you can create
the following NetworkPolicy:

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-team-a
  namespace: team-a
spec:
  ingress:
  - from:
    - namespaceSelector:
        matchExpressions:
          - key: 'team-a.tree.hnc.x-k8s.io/depth' # Label created by HNC
            operator: Exists
```

This policy will both be propagated to all descendants of `team-a`, and will
_also_ allow ingress traffic between all of those namespaces. The “tree” label
can only be applied by HNC, and is guaranteed to reflect the latest hierarchy.

You can learn all about the features of HNC from the [user
guide](https://github.com/kubernetes-sigs/hierarchical-namespaces/tree/master/docs/user-guide).

# Next steps and getting involved

If you think that hierarchical namespaces can work for your organization, [HNC
v0.5.1 is available on
GitHub](https://github.com/kubernetes-sigs/multi-tenancy/releases/tag/hnc-v0.5.1).
We’d love to know what you think of it, what problems you’re using it to solve
and what features you’d most like to see added. As with all early software, you
should be cautious about using HNC in production environments, but the more
feedback we get, the sooner we’ll be able to drive to HNC 1.0.

We’re also open to additional contributors, whether it’s to fix or report bugs,
or help prototype new features such as exceptions, improved monitoring,
hierarchical resource quotas or fine-grained configuration.

Please get in touch with us via our
[repo](https://github.com/kubernetes-sigs/hierarchical-namespaces), [mailing
list](https://groups.google.com/g/kubernetes-wg-multitenancy) or on
[Slack](https://kubernetes.slack.com/messages/wg-multitenancy) - we look forward
to hearing from you!

---

_[Adrian Ludwin](https://twitter.com/aludwin) is a software engineer and the
tech lead for the Hierarchical Namespace Controller._

<a name="note-1"/>

_Note 1: technically, you create a small object called a "subnamespace anchor"
in the parent namespace, and then HNC creates the subnamespace for you._

<a name="note-2"/>

_Note 2: By default, only RBAC Roles and RoleBindings are propagated, but you
can configure HNC to propagate any namespaced Kubernetes object._
