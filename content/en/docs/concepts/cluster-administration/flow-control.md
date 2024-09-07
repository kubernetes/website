---
title: API Priority and Fairness
content_type: concept
min-kubernetes-server-version: v1.18
weight: 110
---

<!-- overview -->

{{< feature-state state="stable"  for_k8s_version="v1.29" >}}

Controlling the behavior of the Kubernetes API server in an overload situation
is a key task for cluster administrators. The {{< glossary_tooltip
term_id="kube-apiserver" text="kube-apiserver" >}} has some controls available
(i.e. the `--max-requests-inflight` and `--max-mutating-requests-inflight`
command-line flags) to limit the amount of outstanding work that will be
accepted, preventing a flood of inbound requests from overloading and
potentially crashing the API server, but these flags are not enough to ensure
that the most important requests get through in a period of high traffic.

The API Priority and Fairness feature (APF) is an alternative that improves upon
aforementioned max-inflight limitations. APF classifies
and isolates requests in a more fine-grained way. It also introduces
a limited amount of queuing, so that no requests are rejected in cases
of very brief bursts. Requests are dispatched from queues using a
fair queuing technique so that, for example, a poorly-behaved
{{< glossary_tooltip text="controller" term_id="controller" >}} need not
starve others (even at the same priority level).

This feature is designed to work well with standard controllers, which
use informers and react to failures of API requests with exponential
back-off, and other clients that also work this way.

{{< caution >}}
Some requests classified as "long-running"&mdash;such as remote
command execution or log tailing&mdash;are not subject to the API
Priority and Fairness filter. This is also true for the
`--max-requests-inflight` flag without the API Priority and Fairness
feature enabled. API Priority and Fairness _does_ apply to **watch**
requests. When API Priority and Fairness is disabled, **watch** requests
are not subject to the `--max-requests-inflight` limit.
{{< /caution >}}

<!-- body -->

## Enabling/Disabling API Priority and Fairness

The API Priority and Fairness feature is controlled by a command-line flag
and is enabled by default. See 
[Options](/docs/reference/command-line-tools-reference/kube-apiserver/#options)
for a general explanation of the available kube-apiserver command-line 
options and how to enable and disable them. The name of the 
command-line option for APF is "--enable-priority-and-fairness". This feature
also involves an {{<glossary_tooltip term_id="api-group" text="API Group" >}} 
with: (a) a stable `v1` version, introduced in 1.29, and 
enabled by default (b) a `v1beta3` version, enabled by default, and
deprecated in v1.29. You can
disable the API group beta version `v1beta3` by adding the
following command-line flags to your `kube-apiserver` invocation:

```shell
kube-apiserver \
--runtime-config=flowcontrol.apiserver.k8s.io/v1beta3=false \
 # …and other flags as usual
```

The command-line flag `--enable-priority-and-fairness=false` will disable the
API Priority and Fairness feature.

## Recursive server scenarios

API Priority and Fairness must be used carefully in recursive server
scenarios. These are scenarios in which some server A, while serving
a request, issues a subsidiary request to some server B. Perhaps
server B might even make a further subsidiary call back to server
A. In situations where Priority and Fairness control is applied to
both the original request and some subsidiary ones(s), no matter how
deep in the recursion, there is a danger of priority inversions and/or
deadlocks.

One example of recursion is when the `kube-apiserver` issues an
admission webhook call to server B, and while serving that call,
server B makes a further subsidiary request back to the
`kube-apiserver`. Another example of recursion is when an `APIService`
object directs the `kube-apiserver` to delegate requests about a
certain API group to a custom external server B (this is one of the
things called "aggregation").

When the original request is known to belong to a certain priority
level, and the subsidiary controlled requests are classified to higher
priority levels, this is one possible solution. When the original
requests can belong to any priority level, the subsidiary controlled
requests have to be exempt from Priority and Fairness limitation. One
way to do that is with the objects that configure classification and
handling, discussed below. Another way is to disable Priority and
Fairness on server B entirely, using the techniques discussed above. A
third way, which is the simplest to use when server B is not
`kube-apisever`, is to build server B with Priority and Fairness
disabled in the code.

## Concepts

There are several distinct features involved in the API Priority and Fairness
feature. Incoming requests are classified by attributes of the request using
_FlowSchemas_, and assigned to priority levels. Priority levels add a degree of
isolation by maintaining separate concurrency limits, so that requests assigned
to different priority levels cannot starve each other. Within a priority level,
a fair-queuing algorithm prevents requests from different _flows_ from starving
each other, and allows for requests to be queued to prevent bursty traffic from
causing failed requests when the average load is acceptably low.

### Priority Levels

Without APF enabled, overall concurrency in the API server is limited by the
`kube-apiserver` flags `--max-requests-inflight` and
`--max-mutating-requests-inflight`. With APF enabled, the concurrency limits
defined by these flags are summed and then the sum is divided up among a
configurable set of _priority levels_. Each incoming request is assigned to a
single priority level, and each priority level will only dispatch as many
concurrent requests as its particular limit allows.

The default configuration, for example, includes separate priority levels for
leader-election requests, requests from built-in controllers, and requests from
Pods. This means that an ill-behaved Pod that floods the API server with
requests cannot prevent leader election or actions by the built-in controllers
from succeeding.

The concurrency limits of the priority levels are periodically
adjusted, allowing under-utilized priority levels to temporarily lend
concurrency to heavily-utilized levels. These limits are based on
nominal limits and bounds on how much concurrency a priority level may
lend and how much it may borrow, all derived from the configuration
objects mentioned below.

### Seats Occupied by a Request

The above description of concurrency management is the baseline story.
Requests have different durations but are counted equally at any given
moment when comparing against a priority level's concurrency limit. In
the baseline story, each request occupies one unit of concurrency. The
word "seat" is used to mean one unit of concurrency, inspired by the
way each passenger on a train or aircraft takes up one of the fixed
supply of seats.

But some requests take up more than one seat. Some of these are **list**
requests that the server estimates will return a large number of
objects. These have been found to put an exceptionally heavy burden
on the server. For this reason, the server estimates the number of objects
that will be returned and considers the request to take a number of seats
that is proportional to that estimated number.

### Execution time tweaks for watch requests

API Priority and Fairness manages **watch** requests, but this involves a
couple more excursions from the baseline behavior. The first concerns
how long a **watch** request is considered to occupy its seat. Depending
on request parameters, the response to a **watch** request may or may not
begin with **create** notifications for all the relevant pre-existing
objects. API Priority and Fairness considers a **watch** request to be
done with its seat once that initial burst of notifications, if any,
is over.

The normal notifications are sent in a concurrent burst to all
relevant **watch** response streams whenever the server is notified of an
object create/update/delete. To account for this work, API Priority
and Fairness considers every write request to spend some additional
time occupying seats after the actual writing is done. The server
estimates the number of notifications to be sent and adjusts the write
request's number of seats and seat occupancy time to include this
extra work.

### Queuing

Even within a priority level there may be a large number of distinct sources of
traffic. In an overload situation, it is valuable to prevent one stream of
requests from starving others (in particular, in the relatively common case of a
single buggy client flooding the kube-apiserver with requests, that buggy client
would ideally not have much measurable impact on other clients at all). This is
handled by use of a fair-queuing algorithm to process requests that are assigned
the same priority level. Each request is assigned to a _flow_, identified by the
name of the matching FlowSchema plus a _flow distinguisher_ — which
is either the requesting user, the target resource's namespace, or nothing — and the
system attempts to give approximately equal weight to requests in different
flows of the same priority level.
To enable distinct handling of distinct instances, controllers that have
many instances should authenticate with distinct usernames

After classifying a request into a flow, the API Priority and Fairness
feature then may assign the request to a queue. This assignment uses
a technique known as {{< glossary_tooltip term_id="shuffle-sharding"
text="shuffle sharding" >}}, which makes relatively efficient use of
queues to insulate low-intensity flows from high-intensity flows.

The details of the queuing algorithm are tunable for each priority level, and
allow administrators to trade off memory use, fairness (the property that
independent flows will all make progress when total traffic exceeds capacity),
tolerance for bursty traffic, and the added latency induced by queuing.

### Exempt requests

Some requests are considered sufficiently important that they are not subject to
any of the limitations imposed by this feature. These exemptions prevent an
improperly-configured flow control configuration from totally disabling an API
server.

## Resources

The flow control API involves two kinds of resources.
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1-flowcontrol-apiserver-k8s-io)
define the available priority levels, the share of the available concurrency
budget that each can handle, and allow for fine-tuning queuing behavior.
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1-flowcontrol-apiserver-k8s-io)
are used to classify individual inbound requests, matching each to a
single PriorityLevelConfiguration.

### PriorityLevelConfiguration

A PriorityLevelConfiguration represents a single priority level. Each
PriorityLevelConfiguration has an independent limit on the number of outstanding
requests, and limitations on the number of queued requests.

The nominal concurrency limit for a PriorityLevelConfiguration is not
specified in an absolute number of seats, but rather in "nominal
concurrency shares." The total concurrency limit for the API Server is
distributed among the existing PriorityLevelConfigurations in
proportion to these shares, to give each level its nominal limit in
terms of seats. This allows a cluster administrator to scale up or
down the total amount of traffic to a server by restarting
`kube-apiserver` with a different value for `--max-requests-inflight`
(or `--max-mutating-requests-inflight`), and all
PriorityLevelConfigurations will see their maximum allowed concurrency
go up (or down) by the same fraction.

{{< caution >}}
In the versions before `v1beta3` the relevant
PriorityLevelConfiguration field is named "assured concurrency shares"
rather than "nominal concurrency shares". Also, in Kubernetes release
1.25 and earlier there were no periodic adjustments: the
nominal/assured limits were always applied without adjustment.
{{< /caution >}}

The bounds on how much concurrency a priority level may lend and how
much it may borrow are expressed in the PriorityLevelConfiguration as
percentages of the level's nominal limit. These are resolved to
absolute numbers of seats by multiplying with the nominal limit /
100.0 and rounding. The dynamically adjusted concurrency limit of a
priority level is constrained to lie between (a) a lower bound of its
nominal limit minus its lendable seats and (b) an upper bound of its
nominal limit plus the seats it may borrow. At each adjustment the
dynamic limits are derived by each priority level reclaiming any lent
seats for which demand recently appeared and then jointly fairly
responding to the recent seat demand on the priority levels, within
the bounds just described.

{{< caution >}}
With the Priority and Fairness feature enabled, the total concurrency limit for
the server is set to the sum of `--max-requests-inflight` and
`--max-mutating-requests-inflight`. There is no longer any distinction made
between mutating and non-mutating requests; if you want to treat them
separately for a given resource, make separate FlowSchemas that match the
mutating and non-mutating verbs respectively.
{{< /caution >}}

When the volume of inbound requests assigned to a single
PriorityLevelConfiguration is more than its permitted concurrency level, the
`type` field of its specification determines what will happen to extra requests.
A type of `Reject` means that excess traffic will immediately be rejected with
an HTTP 429 (Too Many Requests) error. A type of `Queue` means that requests
above the threshold will be queued, with the shuffle sharding and fair queuing techniques used
to balance progress between request flows.

The queuing configuration allows tuning the fair queuing algorithm for a
priority level. Details of the algorithm can be read in the
[enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness), but in short:

* Increasing `queues` reduces the rate of collisions between different flows, at
  the cost of increased memory usage. A value of 1 here effectively disables the
  fair-queuing logic, but still allows requests to be queued.

* Increasing `queueLengthLimit` allows larger bursts of traffic to be
  sustained without dropping any requests, at the cost of increased
  latency and memory usage.

* Changing `handSize` allows you to adjust the probability of collisions between
  different flows and the overall concurrency available to a single flow in an
  overload situation.

  {{< note >}}
  A larger `handSize` makes it less likely for two individual flows to collide
  (and therefore for one to be able to starve the other), but more likely that
  a small number of flows can dominate the apiserver. A larger `handSize` also
  potentially increases the amount of latency that a single high-traffic flow
  can cause. The maximum number of queued requests possible from a
  single flow is `handSize * queueLengthLimit`.
  {{< /note >}}

Following is a table showing an interesting collection of shuffle
sharding configurations, showing for each the probability that a
given mouse (low-intensity flow) is squished by the elephants (high-intensity flows) for
an illustrative collection of numbers of elephants. See
https://play.golang.org/p/Gi0PLgVHiUg , which computes this table.

{{< table caption = "Example Shuffle Sharding Configurations" >}}
HandSize | Queues | 1 elephant | 4 elephants | 16 elephants
|----------|-----------|------------|----------------|--------------------|
| 12 | 32 | 4.428838398950118e-09 | 0.11431348830099144 | 0.9935089607656024 |
| 10 | 32 | 1.550093439632541e-08 | 0.0626479840223545 | 0.9753101519027554 |
| 10 | 64 | 6.601827268370426e-12 | 0.00045571320990370776 | 0.49999929150089345 |
| 9 | 64 | 3.6310049976037345e-11 | 0.00045501212304112273 | 0.4282314876454858 |
| 8 | 64 | 2.25929199850899e-10 | 0.0004886697053040446 | 0.35935114681123076 |
| 8 | 128 | 6.994461389026097e-13 | 3.4055790161620863e-06 | 0.02746173137155063 |
| 7 | 128 | 1.0579122850901972e-11 | 6.960839379258192e-06 | 0.02406157386340147 |
| 7 | 256 | 7.597695465552631e-14 | 6.728547142019406e-08 | 0.0006709661542533682 |
| 6 | 256 | 2.7134626662687968e-12 | 2.9516464018476436e-07 | 0.0008895654642000348 |
| 6 | 512 | 4.116062922897309e-14 | 4.982983350480894e-09 | 2.26025764343413e-05 |
| 6 | 1024 | 6.337324016514285e-16 | 8.09060164312957e-11 | 4.517408062903668e-07 |
{{< /table >}}

### FlowSchema

A FlowSchema matches some inbound requests and assigns them to a
priority level. Every inbound request is tested against FlowSchemas,
starting with those with the numerically lowest `matchingPrecedence` and
working upward. The first match wins.

{{< caution >}}
Only the first matching FlowSchema for a given request matters. If multiple
FlowSchemas match a single inbound request, it will be assigned based on the one
with the highest `matchingPrecedence`. If multiple FlowSchemas with equal
`matchingPrecedence` match the same request, the one with lexicographically
smaller `name` will win, but it's better not to rely on this, and instead to
ensure that no two FlowSchemas have the same `matchingPrecedence`.
{{< /caution >}}

A FlowSchema matches a given request if at least one of its `rules`
matches. A rule matches if at least one of its `subjects` *and* at least
one of its `resourceRules` or `nonResourceRules` (depending on whether the
incoming request is for a resource or non-resource URL) match the request.

For the `name` field in subjects, and the `verbs`, `apiGroups`, `resources`,
`namespaces`, and `nonResourceURLs` fields of resource and non-resource rules,
the wildcard `*` may be specified to match all values for the given field,
effectively removing it from consideration.

A FlowSchema's `distinguisherMethod.type` determines how requests matching that
schema will be separated into flows. It may be `ByUser`, in which one requesting
user will not be able to starve other users of capacity; `ByNamespace`, in which
requests for resources in one namespace will not be able to starve requests for
resources in other namespaces of capacity; or blank (or `distinguisherMethod` may be
omitted entirely), in which all requests matched by this FlowSchema will be
considered part of a single flow. The correct choice for a given FlowSchema
depends on the resource and your particular environment.

## Defaults

Each kube-apiserver maintains two sorts of APF configuration objects:
mandatory and suggested.

### Mandatory Configuration Objects

The four mandatory configuration objects reflect fixed built-in
guardrail behavior. This is behavior that the servers have before
those objects exist, and when those objects exist their specs reflect
this behavior. The four mandatory objects are as follows.

* The mandatory `exempt` priority level is used for requests that are
  not subject to flow control at all: they will always be dispatched
  immediately. The mandatory `exempt` FlowSchema classifies all
  requests from the `system:masters` group into this priority
  level. You may define other FlowSchemas that direct other requests
  to this priority level, if appropriate.

* The mandatory `catch-all` priority level is used in combination with
  the mandatory `catch-all` FlowSchema to make sure that every request
  gets some kind of classification. Typically you should not rely on
  this catch-all configuration, and should create your own catch-all
  FlowSchema and PriorityLevelConfiguration (or use the suggested
  `global-default` priority level that is installed by default) as
  appropriate. Because it is not expected to be used normally, the
  mandatory `catch-all` priority level has a very small concurrency
  share and does not queue requests.

### Suggested Configuration Objects

The suggested FlowSchemas and PriorityLevelConfigurations constitute a
reasonable default configuration. You can modify these and/or create
additional configuration objects if you want. If your cluster is
likely to experience heavy load then you should consider what
configuration will work best.

The suggested configuration groups requests into six priority levels:

* The `node-high` priority level is for health updates from nodes.

* The `system` priority level is for non-health requests from the
  `system:nodes` group, i.e. Kubelets, which must be able to contact
  the API server in order for workloads to be able to schedule on
  them.

* The `leader-election` priority level is for leader election requests from
  built-in controllers (in particular, requests for `endpoints`, `configmaps`,
  or `leases` coming from the `system:kube-controller-manager` or
  `system:kube-scheduler` users and service accounts in the `kube-system`
  namespace). These are important to isolate from other traffic because failures
  in leader election cause their controllers to fail and restart, which in turn
  causes more expensive traffic as the new controllers sync their informers.

* The `workload-high` priority level is for other requests from built-in
  controllers.

* The `workload-low` priority level is for requests from any other service
  account, which will typically include all requests from controllers running in
  Pods.

* The `global-default` priority level handles all other traffic, e.g.
  interactive `kubectl` commands run by nonprivileged users.

The suggested FlowSchemas serve to steer requests into the above
priority levels, and are not enumerated here.

### Maintenance of the Mandatory and Suggested Configuration Objects

Each `kube-apiserver` independently maintains the mandatory and
suggested configuration objects, using initial and periodic behavior.
Thus, in a situation with a mixture of servers of different versions
there may be thrashing as long as different servers have different
opinions of the proper content of these objects.

Each `kube-apiserver` makes an initial maintenance pass over the
mandatory and suggested configuration objects, and after that does
periodic maintenance (once per minute) of those objects.

For the mandatory configuration objects, maintenance consists of
ensuring that the object exists and, if it does, has the proper spec.
The server refuses to allow a creation or update with a spec that is
inconsistent with the server's guardrail behavior.

Maintenance of suggested configuration objects is designed to allow
their specs to be overridden. Deletion, on the other hand, is not
respected: maintenance will restore the object. If you do not want a
suggested configuration object then you need to keep it around but set
its spec to have minimal consequences. Maintenance of suggested
objects is also designed to support automatic migration when a new
version of the `kube-apiserver` is rolled out, albeit potentially with
thrashing while there is a mixed population of servers.

Maintenance of a suggested configuration object consists of creating
it --- with the server's suggested spec --- if the object does not
exist. OTOH, if the object already exists, maintenance behavior
depends on whether the `kube-apiservers` or the users control the
object. In the former case, the server ensures that the object's spec
is what the server suggests; in the latter case, the spec is left
alone.

The question of who controls the object is answered by first looking
for an annotation with key `apf.kubernetes.io/autoupdate-spec`. If
there is such an annotation and its value is `true` then the
kube-apiservers control the object. If there is such an annotation
and its value is `false` then the users control the object. If
neither of those conditions holds then the `metadata.generation` of the
object is consulted. If that is 1 then the kube-apiservers control
the object. Otherwise the users control the object. These rules were
introduced in release 1.22 and their consideration of
`metadata.generation` is for the sake of migration from the simpler
earlier behavior. Users who wish to control a suggested configuration
object should set its `apf.kubernetes.io/autoupdate-spec` annotation
to `false`.

Maintenance of a mandatory or suggested configuration object also
includes ensuring that it has an `apf.kubernetes.io/autoupdate-spec`
annotation that accurately reflects whether the kube-apiservers
control the object.

Maintenance also includes deleting objects that are neither mandatory
nor suggested but are annotated
`apf.kubernetes.io/autoupdate-spec=true`.

## Health check concurrency exemption

The suggested configuration gives no special treatment to the health
check requests on kube-apiservers from their local kubelets --- which
tend to use the secured port but supply no credentials. With the
suggested config, these requests get assigned to the `global-default`
FlowSchema and the corresponding `global-default` priority level,
where other traffic can crowd them out.

If you add the following additional FlowSchema, this exempts those
requests from rate limiting.

{{< caution >}}
Making this change also allows any hostile party to then send
health-check requests that match this FlowSchema, at any volume they
like. If you have a web traffic filter or similar external security
mechanism to protect your cluster's API server from general internet
traffic, you can configure rules to block any health check requests
that originate from outside your cluster.
{{< /caution >}}

{{% code_sample file="priority-and-fairness/health-for-strangers.yaml" %}}

## Observability

### Metrics

{{< note >}}
In versions of Kubernetes before v1.20, the labels `flow_schema` and
`priority_level` were inconsistently named `flowSchema` and `priorityLevel`,
respectively. If you're running Kubernetes versions v1.19 and earlier, you
should refer to the documentation for your version.
{{< /note >}}

When you enable the API Priority and Fairness feature, the kube-apiserver
exports additional metrics. Monitoring these can help you determine whether your
configuration is inappropriately throttling important traffic, or find
poorly-behaved workloads that may be harming system health.

#### Maturity level BETA

* `apiserver_flowcontrol_rejected_requests_total` is a counter vector
  (cumulative since server start) of requests that were rejected,
  broken down by the labels `flow_schema` (indicating the one that
  matched the request), `priority_level` (indicating the one to which
  the request was assigned), and `reason`. The `reason` label will be
  one of the following values:

  * `queue-full`, indicating that too many requests were already
    queued.
  * `concurrency-limit`, indicating that the
    PriorityLevelConfiguration is configured to reject rather than
    queue excess requests.
  * `time-out`, indicating that the request was still in the queue
    when its queuing time limit expired.
  * `cancelled`, indicating that the request is not purge locked
    and has been ejected from the queue.

* `apiserver_flowcontrol_dispatched_requests_total` is a counter
  vector (cumulative since server start) of requests that began
  executing, broken down by `flow_schema` and `priority_level`.

* `apiserver_flowcontrol_current_inqueue_requests` is a gauge vector
  holding the instantaneous number of queued (not executing) requests,
  broken down by `priority_level` and `flow_schema`.

* `apiserver_flowcontrol_current_executing_requests` is a gauge vector
  holding the instantaneous number of executing (not waiting in a
  queue) requests, broken down by `priority_level` and `flow_schema`.

* `apiserver_flowcontrol_current_executing_seats` is a gauge vector
  holding the instantaneous number of occupied seats, broken down by
  `priority_level` and `flow_schema`.

* `apiserver_flowcontrol_request_wait_duration_seconds` is a histogram
  vector of how long requests spent queued, broken down by the labels
  `flow_schema`, `priority_level`, and `execute`. The `execute` label
  indicates whether the request has started executing.

  {{< note >}}
  Since each FlowSchema always assigns requests to a single
  PriorityLevelConfiguration, you can add the histograms for all the
  FlowSchemas for one priority level to get the effective histogram for
  requests assigned to that priority level.
  {{< /note >}}

* `apiserver_flowcontrol_nominal_limit_seats` is a gauge vector
  holding each priority level's nominal concurrency limit, computed
  from the API server's total concurrency limit and the priority
  level's configured nominal concurrency shares.

#### Maturity level ALPHA

* `apiserver_current_inqueue_requests` is a gauge vector of recent
  high water marks of the number of queued requests, grouped by a
  label named `request_kind` whose value is `mutating` or `readOnly`.
  These high water marks describe the largest number seen in the one
  second window most recently completed. These complement the older
  `apiserver_current_inflight_requests` gauge vector that holds the
  last window's high water mark of number of requests actively being
  served.

* `apiserver_current_inqueue_seats` is a gauge vector of the sum over
  queued requests of the largest number of seats each will occupy,
  grouped by labels named `flow_schema` and `priority_level`.

* `apiserver_flowcontrol_read_vs_write_current_requests` is a
  histogram vector of observations, made at the end of every
  nanosecond, of the number of requests broken down by the labels
  `phase` (which takes on the values `waiting` and `executing`) and
  `request_kind` (which takes on the values `mutating` and
  `readOnly`). Each observed value is a ratio, between 0 and 1, of
  the number of requests divided by the corresponding limit on the
  number of requests (queue volume limit for waiting and concurrency
  limit for executing).

* `apiserver_flowcontrol_request_concurrency_in_use` is a gauge vector
  holding the instantaneous number of occupied seats, broken down by
  `priority_level` and `flow_schema`.

* `apiserver_flowcontrol_priority_level_request_utilization` is a
  histogram vector of observations, made at the end of each
  nanosecond, of the number of requests broken down by the labels
  `phase` (which takes on the values `waiting` and `executing`) and
  `priority_level`. Each observed value is a ratio, between 0 and 1,
  of a number of requests divided by the corresponding limit on the
  number of requests (queue volume limit for waiting and concurrency
  limit for executing).

* `apiserver_flowcontrol_priority_level_seat_utilization` is a
  histogram vector of observations, made at the end of each
  nanosecond, of the utilization of a priority level's concurrency
  limit, broken down by `priority_level`. This utilization is the
  fraction (number of seats occupied) / (concurrency limit). This
  metric considers all stages of execution (both normal and the extra
  delay at the end of a write to cover for the corresponding
  notification work) of all requests except WATCHes; for those it
  considers only the initial stage that delivers notifications of
  pre-existing objects. Each histogram in the vector is also labeled
  with `phase: executing` (there is no seat limit for the waiting
  phase).

* `apiserver_flowcontrol_request_queue_length_after_enqueue` is a
  histogram vector of queue lengths for the queues, broken down by
  `priority_level` and `flow_schema`, as sampled by the enqueued requests.
  Each request that gets queued contributes one sample to its histogram,
  reporting the length of the queue immediately after the request was added.
  Note that this produces different statistics than an unbiased survey would.

  {{< note >}}
  An outlier value in a histogram here means it is likely that a single flow
  (i.e., requests by one user or for one namespace, depending on
  configuration) is flooding the API server, and being throttled. By contrast,
  if one priority level's histogram shows that all queues for that priority
  level are longer than those for other priority levels, it may be appropriate
  to increase that PriorityLevelConfiguration's concurrency shares.
  {{< /note >}}

* `apiserver_flowcontrol_request_concurrency_limit` is the same as
  `apiserver_flowcontrol_nominal_limit_seats`. Before the
  introduction of concurrency borrowing between priority levels,
  this was always equal to `apiserver_flowcontrol_current_limit_seats`
  (which did not exist as a distinct metric).

* `apiserver_flowcontrol_lower_limit_seats` is a gauge vector holding
  the lower bound on each priority level's dynamic concurrency limit.

* `apiserver_flowcontrol_upper_limit_seats` is a gauge vector holding
  the upper bound on each priority level's dynamic concurrency limit.

* `apiserver_flowcontrol_demand_seats` is a histogram vector counting
  observations, at the end of every nanosecond, of each priority
  level's ratio of (seat demand) / (nominal concurrency limit). 
  A priority level's seat demand is the sum, over both queued requests
  and those in the initial phase of execution, of the maximum of the
  number of seats occupied in the request's initial and final
  execution phases.

* `apiserver_flowcontrol_demand_seats_high_watermark` is a gauge vector
  holding, for each priority level, the maximum seat demand seen
  during the last concurrency borrowing adjustment period.

* `apiserver_flowcontrol_demand_seats_average` is a gauge vector
  holding, for each priority level, the time-weighted average seat
  demand seen during the last concurrency borrowing adjustment period.

* `apiserver_flowcontrol_demand_seats_stdev` is a gauge vector
  holding, for each priority level, the time-weighted population
  standard deviation of seat demand seen during the last concurrency
  borrowing adjustment period.

* `apiserver_flowcontrol_demand_seats_smoothed` is a gauge vector
  holding, for each priority level, the smoothed enveloped seat demand
  determined at the last concurrency adjustment.

* `apiserver_flowcontrol_target_seats` is a gauge vector holding, for
  each priority level, the concurrency target going into the borrowing
  allocation problem.

* `apiserver_flowcontrol_seat_fair_frac` is a gauge holding the fair
  allocation fraction determined in the last borrowing adjustment.

* `apiserver_flowcontrol_current_limit_seats` is a gauge vector
  holding, for each priority level, the dynamic concurrency limit
  derived in the last adjustment.

* `apiserver_flowcontrol_request_execution_seconds` is a histogram
  vector of how long requests took to actually execute, broken down by
  `flow_schema` and `priority_level`.

* `apiserver_flowcontrol_watch_count_samples` is a histogram vector of
  the number of active WATCH requests relevant to a given write,
  broken down by `flow_schema` and `priority_level`.

* `apiserver_flowcontrol_work_estimated_seats` is a histogram vector
  of the number of estimated seats (maximum of initial and final stage
  of execution) associated with requests, broken down by `flow_schema`
  and `priority_level`.

* `apiserver_flowcontrol_request_dispatch_no_accommodation_total` is a
  counter vector of the number of events that in principle could have led
  to a request being dispatched but did not, due to lack of available
  concurrency, broken down by `flow_schema` and `priority_level`.

* `apiserver_flowcontrol_epoch_advance_total` is a counter vector of
  the number of attempts to jump a priority level's progress meter
  backward to avoid numeric overflow, grouped by `priority_level` and
  `success`.

## Good practices for using API Priority and Fairness

When a given priority level exceeds its permitted concurrency, requests can
experience increased latency or be dropped with an HTTP 429 (Too Many Requests)
error. To prevent these side effects of APF, you can modify your workload or
tweak your APF settings to ensure there are sufficient seats available to serve
your requests.

To detect whether requests are being rejected due to APF, check the following
metrics:

- apiserver_flowcontrol_rejected_requests_total: the total number of requests
  rejected per FlowSchema and PriorityLevelConfiguration.
- apiserver_flowcontrol_current_inqueue_requests: the current number of requests
  queued per FlowSchema and PriorityLevelConfiguration.
- apiserver_flowcontrol_request_wait_duration_seconds: the latency added to
  requests waiting in queues.
- apiserver_flowcontrol_priority_level_seat_utilization: the seat utilization
  per PriorityLevelConfiguration.

### Workload modifications {#good-practice-workload-modifications}

To prevent requests from queuing and adding latency or being dropped due to APF,
you can optimize your requests by:

- Reducing the rate at which requests are executed. A fewer number of requests
  over a fixed period will result in a fewer number of seats being needed at a
  given time.
- Avoid issuing a large number of expensive requests concurrently. Requests can
  be optimized to use fewer seats or have lower latency so that these requests
  hold those seats for a shorter duration. List requests can occupy more than 1
  seat depending on the number of objects fetched during the request. Restricting
  the number of objects retrieved in a list request, for example by using
  pagination, will use less total seats over a shorter period. Furthermore,
  replacing list requests with watch requests will require lower total concurrency
  shares as watch requests only occupy 1 seat during its initial burst of
  notifications. If using streaming lists in versions 1.27 and later, watch
  requests will occupy the same number of seats as a list request for its initial
  burst of notifications because the entire state of the collection has to be
  streamed. Note that in both cases, a watch request will not hold any seats after
  this initial phase.

Keep in mind that queuing or rejected requests from APF could be induced by
either an increase in the number of requests or an increase in latency for
existing requests. For example, if requests that normally take 1s to execute
start taking 60s, it is possible that APF will start rejecting requests because
requests are occupying seats for a longer duration than normal due to this
increase in latency. If APF starts rejecting requests across multiple priority
levels without a significant change in workload, it is possible there is an
underlying issue with control plane performance rather than the workload or APF
settings.

### Priority and fairness settings {#good-practice-apf-settings}

You can also modify the default FlowSchema and PriorityLevelConfiguration
objects or create new objects of these types to better accommodate your
workload.

APF settings can be modified to:

- Give more seats to high priority requests.
- Isolate non-essential or expensive requests that would starve a concurrency
  level if it was shared with other flows.

#### Give more seats to high priority requests

1. If possible, the number of seats available across all priority levels for a
   particular `kube-apiserver` can be increased by increasing the values for the
   `max-requests-inflight` and `max-mutating-requests-inflight` flags. Alternatively,
   horizontally scaling the number of `kube-apiserver` instances will increase the
   total concurrency per priority level across the cluster assuming there is
   sufficient load balancing of requests.
1. You can create a new FlowSchema which references a PriorityLevelConfiguration
   with a larger concurrency level. This new PriorityLevelConfiguration could be an
   existing level or a new level with its own set of nominal concurrency shares.
   For example, a new FlowSchema could be introduced to change the
   PriorityLevelConfiguration for your requests from global-default to workload-low
   to increase the number of seats available to your user. Creating a new
   PriorityLevelConfiguration will reduce the number of seats designated for
   existing levels. Recall that editing a default FlowSchema or
   PriorityLevelConfiguration will require setting the
   `apf.kubernetes.io/autoupdate-spec` annotation to false.
1. You can also increase the NominalConcurrencyShares for the
   PriorityLevelConfiguration which is serving your high priority requests.
   Alternatively, for versions 1.26 and later, you can increase the LendablePercent
   for competing priority levels so that the given priority level has a higher pool
   of seats it can borrow.

#### Isolate non-essential requests from starving other flows

For request isolation, you can create a FlowSchema whose subject matches the
user making these requests or create a FlowSchema that matches what the request
is (corresponding to the resourceRules). Next, you can map this FlowSchema to a
PriorityLevelConfiguration with a low share of seats.

For example, suppose list event requests from Pods running in the default namespace
are using 10 seats each and execute for 1 minute. To prevent these expensive
requests from impacting requests from other Pods using the existing service-accounts
FlowSchema, you can apply the following FlowSchema to isolate these list calls
from other requests.

Example FlowSchema object to isolate list event requests:

{{% code_sample file="priority-and-fairness/list-events-default-service-account.yaml" %}}

- This FlowSchema captures all list event calls made by the default service
  account in the default namespace. The matching precedence 8000 is lower than the
  value of 9000 used by the existing service-accounts FlowSchema so these list
  event calls will match list-events-default-service-account rather than
  service-accounts.
- The catch-all PriorityLevelConfiguration is used to isolate these requests.
  The catch-all priority level has a very small concurrency share and does not
  queue requests.

## {{% heading "whatsnext" %}}

- You can visit flow control [reference doc](/docs/reference/debug-cluster/flow-control/) to learn more about troubleshooting.
- For background information on design details for API priority and fairness, see
  the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
- You can make suggestions and feature requests via [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)
  or the feature's [slack channel](https://kubernetes.slack.com/messages/api-priority-and-fairness).
