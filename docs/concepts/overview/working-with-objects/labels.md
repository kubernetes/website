---
assignees:
- mikedanese
title: Labels and Selectors
redirect_from:
- "/docs/user-guide/labels/"
- "/docs/user-guide/labels.html"
---

_Labels_ are key/value pairs that are attached to objects, such as pods.
Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system.
Labels can be used to organize and to select subsets of objects.  Labels can be attached to objects at creation time and subsequently added and modified at any time.
Each object can have a set of key/value labels defined.  Each Key must be unique for a given object.

```json
"labels": {
  "key1" : "value1",
  "key2" : "value2"
}
```

We'll eventually index and reverse-index labels for efficient queries and watches, use them to sort and group in UIs and CLIs, etc. We don't want to pollute labels with non-identifying, especially large and/or structured, data. Non-identifying information should be recorded using [annotations](/docs/user-guide/annotations).

* TOC
{:toc}

## Motivation

Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion, without requiring clients to store these mappings.

Service deployments and batch processing pipelines are often multi-dimensional entities (e.g., multiple partitions or deployments, multiple release tracks, multiple tiers, multiple micro-services per tier). Management often requires cross-cutting operations, which breaks encapsulation of strictly hierarchical representations, especially rigid hierarchies determined by the infrastructure rather than by users.

Example labels:

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

These are just examples of commonly used labels; you are free to develop your own conventions. Keep in mind that label Key must be unique for a given object.

## Syntax and character set

_Labels_ are key value pairs. Valid label keys have two segments: an optional prefix and name, separated by a slash (`/`).  The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.  The prefix is optional.  If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (`.`), not longer than 253 characters in total, followed by a slash (`/`).
If the prefix is omitted, the label key is presumed to be private to the user. Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, or other third-party automation) which add labels to end-user objects must specify a prefix.  The `kubernetes.io/` prefix is reserved for Kubernetes core components.

Valid label values must be 63 characters or less and must be empty or begin and end with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.

## Label selectors

Unlike [names and UIDs](/docs/user-guide/identifiers), labels do not provide uniqueness. In general, we expect many objects to carry the same label(s).

Via a _label selector_, the client/user can identify a set of objects. The label selector is the core grouping primitive in Kubernetes.

The API currently supports two types of selectors: _equality-based_ and _set-based_.
A label selector can be made of multiple _requirements_ which are comma-separated. In the case of multiple requirements, all must be satisfied so the comma separator acts as an _AND_ logical operator.

An empty label selector (that is, one with zero requirements) selects every object in the collection.

A null label selector (which is only possible for optional selector fields) selects no objects.

**Note**: the label selectors of two controllers must not overlap within a namespace, otherwise they will fight with each other. 

### _Equality-based_ requirement

_Equality-_ or _inequality-based_ requirements allow filtering by label keys and values. Matching objects must satisfy all of the specified label constraints, though they may have additional labels as well.
Three kinds of operators are admitted `=`,`==`,`!=`. The first two represent _equality_ (and are simply synonyms), while the latter represents _inequality_. For example:

```
environment = production
tier != frontend
```

The former selects all resources with key equal to `environment` and value equal to `production`.
The latter selects all resources with key equal to `tier` and value distinct from `frontend`, and all resources with no labels with the `tier` key.
One could filter for resources in `production` excluding `frontend` using the comma operator: `environment=production,tier!=frontend`


### _Set-based_ requirement

_Set-based_ label requirements allow filtering keys according to a set of values. Three kinds of operators are supported: `in`,`notin` and exists (only the key identifier). For example:

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

The first example selects all resources with key equal to `environment` and value equal to `production` or `qa`.
The second example selects all resources with key equal to `tier` and values other than `frontend` and `backend`, and all resources with no labels with the `tier` key.
The third example selects all resources including a label with key `partition`; no values are checked.
The fourth example selects all resources without a label with key `partition`; no values are checked.
Similarly the comma separator acts as an _AND_ operator. So filtering resources with a `partition` key (no matter the value) and with `environment` different than  `qa` can be achieved using `partition,environment notin (qa)`.
The _set-based_ label selector is a general form of equality since `environment=production` is equivalent to `environment in (production)`; similarly for `!=` and `notin`.

_Set-based_ requirements can be mixed with _equality-based_ requirements. For example: `partition in (customerA, customerB),environment!=qa`.


## API

### LIST and WATCH filtering

LIST and WATCH operations may specify label selectors to filter the sets of objects returned using a query parameter. Both requirements are permitted (presented here as they would appear in a URL query string):

  * _equality-based_ requirements: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * _set-based_ requirements: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Both label selector styles can be used to list or watch resources via a REST client. For example, targeting `apiserver` with `kubectl` and using _equality-based_ one may write:

```shell
$ kubectl get pods -l environment=production,tier=frontend
```

or using _set-based_ requirements:

```shell
$ kubectl get pods -l 'environment in (production),tier in (frontend)'
```

As already mentioned _set-based_ requirements are more expressive.  For instance, they can implement the _OR_ operator on values:

```shell
$ kubectl get pods -l 'environment in (production, qa)'
```

or restricting negative matching via _exists_ operator:

```shell
$ kubectl get pods -l 'environment,environment notin (frontend)'
```

### Set references in API objects

Some Kubernetes objects, such as [`services`](/docs/user-guide/services) and [`replicationcontrollers`](/docs/user-guide/replication-controller), also use label selectors to specify sets of other resources, such as [pods](/docs/user-guide/pods).

#### Service and ReplicationController

The set of pods that a `service` targets is defined with a label selector. Similarly, the population of pods that a `replicationcontroller` should manage is also defined with a label selector.

Labels selectors for both objects are defined in `json` or `yaml` files using maps, and only _equality-based_ requirement selectors are supported:

```json
"selector": {
    "component" : "redis",
}
```
or

```yaml
selector:
    component: redis
```

this selector (respectively in `json` or `yaml` format) is equivalent to `component=redis` or `component in (redis)`.

#### Resources that support set-based requirements

Newer resources, such as [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/), [`Deployment`](/docs/concepts/workloads/controllers/deployment/), [`Replica Set`](/docs/concepts/workloads/controllers/replicaset/), and [`Daemon Set`](/docs/concepts/workloads/controllers/daemonset/), support _set-based_ requirements as well.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

`matchLabels` is a map of `{key,value}` pairs. A single `{key,value}` in the `matchLabels` map is equivalent to an element of `matchExpressions`, whose `key` field is "key", the `operator` is "In", and the `values` array contains only "value". `matchExpressions` is a list of pod selector requirements. Valid operators include In, NotIn, Exists, and DoesNotExist. The values set must be non-empty in the case of In and NotIn. All of the requirements, from both `matchLabels` and `matchExpressions` are ANDed together -- they must all be satisfied in order to match.

#### Selecting sets of nodes

One use case for selecting over labels is to constrain the set of nodes onto which a pod can schedule.
See the documentation on [node selection](/docs/user-guide/node-selection) for more information.
