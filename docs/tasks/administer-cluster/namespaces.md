---
assignees:
- derekwaynecarr
- janetkuo
title: Share a Cluster with Namespaces
---

A Namespace is a mechanism to partition resources created by users into
a logically named group.

## Motivation

A single cluster should be able to satisfy the needs of multiple users or groups of users (henceforth a 'user community').

Each user community wants to be able to work in isolation from other communities.

Each user community has its own:

1. resources (pods, services, replication controllers, etc.)
2. policies (who can or cannot perform actions in their community)
3. constraints (this community is allowed this much quota, etc.)

A cluster operator may create a Namespace for each unique user community.

The Namespace provides a unique scope for:

1. named resources (to avoid basic naming collisions)
2. delegated management authority to trusted users
3. ability to limit community resource consumption

## Use cases

1.  As a cluster operator, I want to support multiple user communities on a single cluster.
2.  As a cluster operator, I want to delegate authority to partitions of the cluster to trusted users
    in those communities.
3.  As a cluster operator, I want to limit the amount of resources each community can consume in order
    to limit the impact to other communities using the cluster.
4.  As a cluster user, I want to interact with resources that are pertinent to my user community in
    isolation of what other user communities are doing on the cluster.

## Viewing namespaces

You can list the current namespaces in a cluster using:

```shell
$ kubectl get namespaces
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
```

Kubernetes starts with two initial namespaces:

   * `default` The default namespace for objects with no other namespace
   * `kube-system` The namespace for objects created by the Kubernetes system

You can also get the summary of a specific namespace using:

```shell
$ kubectl get namespaces <name>
```

Or you can get detailed information with:

```shell
$ kubectl describe namespaces <name>
Name:       default
Labels:       <none>
Status:       Active

No resource quota.

Resource Limits
 Type        Resource    Min    Max    Default
 ----                --------    ---    ---    ---
 Container            cpu            -    -    100m
```

Note that these details show both resource quota (if present) as well as resource limit ranges.

Resource quota tracks aggregate usage of resources in the *Namespace* and allows cluster operators
to define *Hard* resource usage limits that a *Namespace* may consume.

A limit range defines min/max constraints on the amount of resources a single entity can consume in
a *Namespace*.

See [Admission control: Limit Range](https://git.k8s.io/community/contributors/design-proposals/admission_control_limit_range.md)

A namespace can be in one of two phases:

   * `Active` the namespace is in use
   * `Terminating` the namespace is being deleted, and can not be used for new objects

See the [design doc](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#phases) for more details.

## Creating a new namespace

To create a new namespace, first create a new YAML file called `my-namespace.yaml` with the contents:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <insert-namespace-name-here>
```

Then run:

```shell
$ kubectl create -f ./my-namespace.yaml
```

Note that the name of your namespace must be a DNS compatible label.

There's an optional field `finalizers`, which allows observables to purge resources whenever the namespace is deleted. Keep in mind that if you specify a nonexistent finalizer, the namespace will be created but will get stuck in the `Terminating` state if the user tries to delete it.

More information on `finalizers` can be found in the namespace [design doc](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#finalizers).


### Working in namespaces

See [Setting the namespace for a request](/docs/user-guide/namespaces/#setting-the-namespace-for-a-request)
and [Setting the namespace preference](/docs/user-guide/namespaces/#setting-the-namespace-preference).

## Deleting a namespace

You can delete a namespace with

```shell
$ kubectl delete namespaces <insert-some-namespace-name>
```

**WARNING, this deletes _everything_ under the namespace!**

This delete is asynchronous, so for a time you will see the namespace in the `Terminating` state.

## Namespaces and DNS

When you create a [Service](/docs/user-guide/services), it creates a corresponding [DNS entry](/docs/admin/dns).
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container just uses `<service-name>` it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).

## Design

Details of the design of namespaces in Kubernetes, including a [detailed example](https://git.k8s.io/community/contributors/design-proposals/namespaces.md#example-openshift-origin-managing-a-kubernetes-namespace)
can be found in the [namespaces design doc](https://git.k8s.io/community/contributors/design-proposals/namespaces.md)
