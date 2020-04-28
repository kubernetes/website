---
title: API Priority and Fairness
content_template: templates/concept
min-kubernetes-server-version: v1.18
---

{{% capture overview %}}

{{< feature-state state="alpha"  for_k8s_version="v1.18" >}}

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
of very brief bursts.  Requests are dispatched from queues using a
fair queuing technique so that, for example, a poorly-behaved
{{< glossary_tooltip text="controller" term_id="controller" >}} need not
starve others (even at the same priority level).

{{< caution >}}
Requests classified as "long-running" — primarily watches — are not
subject to the API Priority and Fairness filter. This is also true for
the `--max-requests-inflight` flag without the API Priority and
Fairness feature enabled.
{{< /caution >}}

{{% /capture %}}

{{% capture body %}}

## Enabling API Priority and Fairness

The API Priority and Fairness feature is controlled by a feature gate
and is not enabled by default.  See
[Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
for a general explanation of feature gates and how to enable and disable them.  The
name of the feature gate for APF is "APIPriorityAndFairness".  This
feature also involves an {{< glossary_tooltip term_id="api-group"
text="API Group" >}} that must be enabled.  You can do these
things by adding the following command-line flags to your
`kube-apiserver` invocation:

```shell
kube-apiserver \
--feature-gates=APIPriorityAndFairness=true \
--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true \
 # …and other flags as usual
```

The command-line flag `--enable-priority-and-fairness=false` will disable the
API Priority and Fairness feature, even if other flags have enabled it.

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
Without APF enabled, overall concurrency in
the API server is limited by the `kube-apiserver` flags
`--max-requests-inflight` and `--max-mutating-requests-inflight`. With APF
enabled, the concurrency limits defined by these flags are summed and then the sum is divided up
among a configurable set of _priority levels_. Each incoming request is assigned
to a single priority level, and each priority level will only dispatch as many
concurrent requests as its configuration allows.

The default configuration, for example, includes separate priority levels for
leader-election requests, requests from built-in controllers, and requests from
Pods. This means that an ill-behaved Pod that floods the API server with
requests cannot prevent leader election or actions by the built-in controllers
from succeeding.

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

After classifying a request into a flow, the API Priority and Fairness
feature then may assign the request to a queue.  This assignment uses
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

## Defaults
The Priority and Fairness feature ships with a suggested configuration that
should suffice for experimentation; if your cluster is likely to
experience heavy load then you should consider what configuration will work best. The suggested configuration groups requests into five priority
classes:

* The `system` priority level is for requests from the `system:nodes` group,
  i.e. Kubelets, which must be able to contact the API server in order for
  workloads to be able to schedule on them.

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
  account, which will typically include all requests from controllers runing in
  Pods.
  
* The `global-default` priority level handles all other traffic, e.g.
  interactive `kubectl` commands run by nonprivileged users.

Additionally, there are two PriorityLevelConfigurations and two FlowSchemas that
are built in and may not be overwritten:

* The special `exempt` priority level is used for requests that are not subject
  to flow control at all: they will always be dispatched immediately. The
  special `exempt` FlowSchema classifies all requests from the `system:masters`
  group into this priority level. You may define other FlowSchemas that direct
  other requests to this priority level, if appropriate.
  
* The special `catch-all` priority level is used in combination with the special
  `catch-all` FlowSchema to make sure that every request gets some kind of
  classification. Typically you should not rely on this catch-all configuration,
  and should create your own catch-all FlowSchema and PriorityLevelConfiguration
  (or use the `global-default` configuration that is installed by default) as
  appropriate. To help catch configuration errors that miss classifying some
  requests, the mandatory `catch-all` priority level only allows one concurrency
  share and does not queue requests, making it relatively likely that traffic
  that only matches the `catch-all` FlowSchema will be rejected with an HTTP 429
  error.

## Resources
The flow control API involves two kinds of resources.
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1alpha1-flowcontrol-apiserver-k8s-io) 
define the available isolation classes, the share of the available concurrency
budget that each can handle, and allow for fine-tuning queuing behavior.
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1alpha1-flowcontrol-apiserver-k8s-io)
are used to classify individual inbound requests, matching each to a single
PriorityLevelConfiguration.

### PriorityLevelConfiguration
A PriorityLevelConfiguration represents a single isolation class. Each
PriorityLevelConfiguration has an independent limit on the number of outstanding
requests, and limitations on the number of queued requests.

Concurrency limits for PriorityLevelConfigurations are not specified in absolute
number of requests, but rather in "concurrency shares." The total concurrency
limit for the API Server is distributed among the existing
PriorityLevelConfigurations in proportion with these shares. This allows a
cluster administrator to scale up or down the total amount of traffic to a
server by restarting `kube-apiserver` with a different value for
`--max-requests-inflight` (or `--max-mutating-requests-inflight`), and all
PriorityLevelConfigurations will see their maximum allowed concurrency go up (or
down) by the same fraction.
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
priority level. Details of the algorithm can be read in the [enhancement
proposal](#what-s-next), but in short:

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

{{< table caption="Example Shuffle Sharding Configurations" >}}
|HandSize|     Queues|	1 elephant|		4 elephants|		16 elephants|
|--------|-----------|------------|----------------|--------------------|
|      12|         32|	4.428838398950118e-09|	0.11431348830099144|	0.9935089607656024|
|      10|         32|	1.550093439632541e-08|	0.0626479840223545|	0.9753101519027554|
|      10|         64|	6.601827268370426e-12|	0.00045571320990370776|	0.49999929150089345|
|       9|         64|	3.6310049976037345e-11|	0.00045501212304112273|	0.4282314876454858|
|       8|         64|	2.25929199850899e-10|	0.0004886697053040446|	0.35935114681123076|
|       8|        128|	6.994461389026097e-13|	3.4055790161620863e-06|	0.02746173137155063|
|       7|        128|	1.0579122850901972e-11|	6.960839379258192e-06|	0.02406157386340147|
|       7|        256|	7.597695465552631e-14|	6.728547142019406e-08|	0.0006709661542533682|
|       6|        256|	2.7134626662687968e-12|	2.9516464018476436e-07|	0.0008895654642000348|
|       6|        512|	4.116062922897309e-14|	4.982983350480894e-09|	2.26025764343413e-05|
|       6|       1024|	6.337324016514285e-16|	8.09060164312957e-11|	4.517408062903668e-07|

### FlowSchema

A FlowSchema matches some inbound requests and assigns them to a
priority level. Every inbound request is tested against every
FlowSchema in turn, starting with those with numerically lowest ---
which we take to be the logically highest --- `matchingPrecedence` and
working onward.  The first match wins.

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
incoming request is for a resource or non-resource URL) matches the request.

For the `name` field in subjects, and the `verbs`, `apiGroups`, `resources`,
`namespaces`, and `nonResourceURLs` fields of resource and non-resource rules,
the wildcard `*` may be specified to match all values for the given field,
effectively removing it from consideration.

A FlowSchema's `distinguisherMethod.type` determines how requests matching that
schema will be separated into flows. It may be
either `ByUser`, in which case one requesting user will not be able to starve
other users of capacity, or `ByNamespace`, in which case requests for resources
in one namespace will not be able to starve requests for resources in other
namespaces of capacity, or it may be blank (or `distinguisherMethod` may be
omitted entirely), in which case all requests matched by this FlowSchema will be
considered part of a single flow. The correct choice for a given FlowSchema
depends on the resource and your particular environment.

## Diagnostics
Every HTTP response from an API server with the priority and fairness feature
enabled has two extra headers: `X-Kubernetes-PF-FlowSchema-UID` and
`X-Kubernetes-PF-PriorityLevel-UID`, noting the flow schema that matched the request
and the priority level to which it was assigned, respectively. The API objects'
names are not included in these headers in case the requesting user does not
have permission to view them, so when debugging you can use a command like 

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

to get a mapping of UIDs to names for both FlowSchemas and
PriorityLevelConfigurations.

## Observability
When you enable the API Priority and Fairness feature, the kube-apiserver
exports additional metrics. Monitoring these can help you determine whether your
configuration is inappropriately throttling important traffic, or find
poorly-behaved workloads that may be harming system health.

* `apiserver_flowcontrol_rejected_requests_total` counts requests that
  were rejected, grouped by the name of the assigned priority level,
  the name of the assigned FlowSchema, and the reason for rejection.
  The reason will be one of the following:
    * `queue-full`, indicating that too many requests were already
      queued,
    * `concurrency-limit`, indicating that the
      PriorityLevelConfiguration is configured to reject rather than
      queue excess requests, or
    * `time-out`, indicating that the request was still in the queue
      when its queuing time limit expired.

* `apiserver_flowcontrol_dispatched_requests_total` counts requests
  that began executing, grouped by the name of the assigned priority
  level and the name of the assigned FlowSchema.

* `apiserver_flowcontrol_current_inqueue_requests` gives the
  instantaneous total number of queued (not executing) requests,
  grouped by priority level and FlowSchema.

* `apiserver_flowcontrol_current_executing_requests` gives the instantaneous
  total number of executing requests, grouped by priority level and FlowSchema.

* `apiserver_flowcontrol_request_queue_length_after_enqueue` gives a
  histogram of queue lengths for the queues, grouped by priority level
  and FlowSchema, as sampled by the enqueued requests.  Each request
  that gets queued contributes one sample to its histogram, reporting
  the length of the queue just after the request was added.  Note that
  this produces different statistics than an unbiased survey would.
    {{< note >}}
    An outlier value in a histogram here means it is likely that a single flow
    (i.e., requests by one user or for one namespace, depending on
    configuration) is flooding the API server, and being throttled. By contrast,
    if one priority level's histogram shows that all queues for that priority
    level are longer than those for other priority levels, it may be appropriate
    to increase that PriorityLevelConfiguration's concurrency shares.
    {{< /note >}}

* `apiserver_flowcontrol_request_concurrency_limit` gives the computed
  concurrency limit (based on the API server's total concurrency limit and PriorityLevelConfigurations'
  concurrency shares) for each PriorityLevelConfiguration.

* `apiserver_flowcontrol_request_wait_duration_seconds` gives a histogram of how
  long requests spent queued, grouped by the FlowSchema that matched the
  request, the PriorityLevel to which it was assigned, and whether or not the
  request successfully executed.
    {{< note >}}
    Since each FlowSchema always assigns requests to a single
    PriorityLevelConfiguration, you can add the histograms for all the
    FlowSchemas for one priority level to get the effective histogram for
    requests assigned to that priority level.
    {{< /note >}}

* `apiserver_flowcontrol_request_execution_seconds` gives a histogram of how
  long requests took to actually execute, grouped by the FlowSchema that matched the
  request and the PriorityLevel to which it was assigned.
    

{{% /capture %}}

{{% capture whatsnext %}}

For background information on design details for API priority and fairness, see
the [enhancement proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/20190228-priority-and-fairness.md).
You can make suggestions and feature requests via [SIG API
Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).

{{% /capture %}}
