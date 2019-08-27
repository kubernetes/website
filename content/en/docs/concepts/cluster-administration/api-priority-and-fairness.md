---
title: API priority and fairness
content_template: templates/concept
weight: 20
---


{{% capture overview %}}

{{< feature-state state="alpha" >}}

The control plane of Kubernetes is itself a resource (broadly
construed) to which access is managed.  In particular, each API server
applies some prioritization and fairness in its handling of requests.
This includes not only kube-apiservers but aggregated API servers too.

Prioritization and fairness applies only to requests that are not
_long-running_.  The nature of the request, not the size of its
reply, determines whether a request is long-running.  The requests
considered to be long running are
[WATCHES](https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes),
[EXECs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec),
and
[fetching of logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)
(with or without "following").

Each API server independently applies prioritization and fairness,
based on API objects that configure this feature.  This involves two
concepts: priority level and flow schema.

{{% /capture %}}


{{% capture body %}}

## Enabling API priority and fairness

API priority and fairness is an alpha feature, so it is disabled by
default.  To enable API priority and fairness you need to do two
things: turn on the RequestManagement feature gate (e.g., by including
the `--feature-gates RequestManagement=true` flag when starting your
API servers) and enable the flowcontrol.apiserver.k8s.io/v1alpha1 API
version (e.g., by including the `--runtime-config
flowcontrol.apiserver.k8s.io/v1alpha1=true` flag when starting your
`kube-apiserver`s).

Enabling the feature gate replaces the "max in flight" filter, which
enforces simple aggregate concurrency limits, with a filter that
implements API priority and fairness --- which can be seen as a more
general version of the "max in flight" filter.

## Priority level

Each API server has an aggregate concurrency limit and divides
it&mdash;without examining the request load&mdash;among several
priority levels.  The priority levels operate independently of each
other.  That is, the API server classifies a given request to exactly
one priority level and, for a given priority level, handles at most
the corresponding number of requests at any given time.  One special
priority level&mdash;used for meta-requests and other top-priority
traffic&mdash;imposes no limit.  This priority level and the requests
mapped to it are described as _exempt_, because of the lack of
concurrency limitation.

For a non-exempt request, if it is not allowed to be handled
immediately then the API server will either reject the request or hold
it in a queue for a while.  Each non-exempt priority level has a
number of FIFO queues.  Whenever that priority level's number of
requests currently being handled drops below the concurrency limit,
the API server draws requests to begin handling from these queues in a
fair way.

## Flow schema

To determine how to control a request, an API server first classifies
that request to a _flow_ according to a configured collection of _flow
schemas_.  The flow schemas are considered in order, according to each
flow schema's _matching precedence_ (which is a number).  A flow
schema has rules that describe which requests match that schema.
Matching takes into account (a) the requested operation&mdash;as
identified by the HTTP request verb and URI&mdash;and (b) if the request
arrived through a secured port then the authenticated user attributes
otherwise just the UserAgent.  Among the schemas that match the
request, one with the logically highest matching precedence wins.

A flow schema also has a declaration of how to complete the _flow
identifier_ for the request's flow.  A flow identifier is a pair of
strings: the name of its flow schema plus one more string called the
_flow distinguisher_.  A flow schema indicates whether the
distinguisher is (1) the username of the client making the request,
(2) the namespace (if any) of the object that the request seeks to
access, or (3) the empty string.

A flow schema also states the name of the priority level to use for
requests that match.

## Queuing

An API server first classifies a request to a flow, and thus a
corresponding priority level, and if the priority level is not exempt
then the API server assigns the request to a queue using a technique
called "shuffle sharding".  This technique starts with hashing the
flow identifier, and then uses the hash value as a source of entropy
to pseudo-randomly pick a small subset of the queues, and finally
assigns the request to one of the shortest queues in that subset.  The
priority level declares the size of the subset.

After assigning a request to a priority level and a queue, the
API server immediately begins handling the request if that would not
violate the priority level's concurrency limit; otherwise the queue
holds the request until it can be executed or is evicted.

The API server applies two criteria to limit queue occupancy.  First,
each non-exempt priority level has a queue length limit.  The
API server will not add a request to a queue that is already at or
exceeding its length limit; rather, the request is immediately
rejected.  Second, each API server is configured with a limit on how
long a request can wait in a queue.  If that limit expires before the
request can be handled then the request is rejected.  When rejecting
requests, the API server responds using HTTP status code 429 "Too Many
Requests".

## Configuration

Configuration is mainly through API objects of kinds
`PriorityLevelConfiguration` and `FlowSchema` in the
`flowcontrol.apiserver.k8s.io` API group.

The API server's aggregate concurrency limit is the sum of the two
limits applied by the older simpler functionality: the limit on the
number of mutating requests being handled at one time and the limit on
the number of readonly requests being handled at a time.

An API server's limit on how long a request can wait in a queue is one
quarter of the time that an API server allows itself for handling a
request.

{{% /capture %}}
