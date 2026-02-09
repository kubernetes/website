---
reviewers:
- adrianmoisey
- omerap12
title: Vertical Pod Autoscaling
feature:
  title: Vertical scaling
  description: >
    Automatically adjust resource requests and limits based on actual usage patterns.
content_type: concept
weight: 70
math: true
---

<!-- overview -->

In Kubernetes, a _VerticalPodAutoscaler_ automatically updates a workload management {{< glossary_tooltip text="resource" term_id="api-resource" >}} (such as
a {{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), with the
aim of automatically adjusting infrastructure {{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}}
[requests and limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) to match actual usage.

Vertical scaling means that the response to increased resource demand is to assign more resources (for example: memory or CPU) 
to the {{< glossary_tooltip text="Pods" term_id="pod" >}} that are already running for the workload.
This is also known as _rightsizing_, or sometimes _autopilot_.
This is different from horizontal scaling, which for Kubernetes would mean deploying more Pods to distribute the load.

If the resource usage decreases, and the Pod resource requests are above optimal levels, 
the VerticalPodAutoscaler instructs the workload resource (the Deployment, StatefulSet, or other similar resource) 
to adjust resource requests back down, preventing resource waste.

The VerticalPodAutoscaler is implemented as a Kubernetes API resource and a 
{{< glossary_tooltip text="controller" term_id="controller" >}}.
The resource determines the behavior of the controller. 
The vertical pod autoscaling controller, running within the Kubernetes data plane,
periodically adjusts the resource requests and limits of its target (for example, a Deployment)
based on analysis of historical resource utilization,
the amount of resources available in the cluster, and real-time events such as out-of-memory (OOM) conditions.

<!-- body -->

## API object

The VerticalPodAutoscaler is defined as a {{< glossary_tooltip text="Custom Resource Definition" term_id="customresourcedefinition" >}} (CRD) in Kubernetes. Unlike HorizontalPodAutoscaler, which is part of the core Kubernetes API, VPA must be installed separately in your cluster.

The current stable API version is `autoscaling.k8s.io/v1`. More details about the VPA installation and API can be found in the [VPA GitHub repository](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler).

## How does a VerticalPodAutoscaler work?

{{< figure
  src="/images/docs/concepts/vpa-architecture.svg"
  alt="Vertical Pod Autoscaling architecture"
  class="diagram-large"
  caption="Figure 1. VerticalPodAutoscaler controls the resource requests and limits of Pods in a Deployment"
>}}

<!-- https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqlVG1P2zAQ_iuW-RpY0rVNG6RJpSkSH9hQuzFpLZo850o9nDiznQKj_PddYqcvMGmaSKXG53vuuefuHD9RrjKgCb3VrFyRs8-LguBjqh9uY1SWUnBmhSrIV6XvpGKZg9QPV4XVSkrQ8xRKqR5zKCx5R6Zj_JtZZmFZyRnYm11IqbL5lcrQP8ZgJgrQ3guFZ3b_OVgtuJlfujeZgV5vsawU89HVxYvNLBfGoNL59dWIjFqrSeRU3uwnWJfsO9fza9AWK5QoalRZZXAJmoynqQdr4CrHujIssubdsz2iKjOs1Hn9Gj0HVZDj4w_7ka-oa8BmZpUGQ6btdtN2s_FKW0pnNQHjFfA7Q5ZKE75ixS0g2Cs4kNaAJ2vBrSF18xH_pfEYIgpSSsZhszdMF7uzm_Ap_KrAIEEB9zXJph5CqwmXDeij85Gxhkb8ZjeUFzPynNgdWKMMWYuxu4746Lby16EXxU_gXg02TVWaA1kzWdU9-IuyRhEYp_wfpbZV3Au7Ip9KK3ImcSouCdLjGW7puWTGpLCslZKlkDI5Gp6Pe5NBYJDxDpKjaIK_1JvH9yKzqyQqHwKupNKt-_QFG9eZZ0t7o_5Z-ja29hA6xvPzdNjvv42RlaVnO-un8ej_q93j2_8MAn9gg92wsbH72dvjjx062G5r9O8D3268AY6uFn9KA7zxREYTqysIaA46Z7VJn-rABbUryGFBE1xmsGSVtAu6KJ4xrGTFN6XyNlKr6nZFkyWTBi0nPxUMb88txG1OMoGf9xbJ8K6ZPRZ8y9PUP1ZVYWkSdZs8NHmiDzSJOyedXhiGUe_9IIw63SigjzQZhCfhMO5FcTwcdgaDuPsc0N-NsPBkENf4MBr0O_1uNx4GFJrsl-6ub6785z9_1f9X -->

Kubernetes implements vertical pod autoscaling through multiple cooperating components that run intermittently (it is not a continuous process). The VPA consists of three main components: 

* The _recommender_, which analyzes resource usage and provides recommendations.
* The _updater_, that Pod resource requests either by evicting Pods or modifying them in place.
* And the VPA _admission controller_ webhook, which applies resource recommendations to new or recreated Pods.

Once during each period, the Recommender queries the resource utilization for Pods targeted by each VerticalPodAutoscaler definition. The Recommender finds the target resource defined by the `targetRef`, then selects the pods based on the target resource's `.spec.selector` labels, and obtains the metrics from the resource metrics API to analyze actual CPU and memory consumption.

The Recommender analyzes both current and historical resource usage data (CPU and memory) for each Pod targeted by the VerticalPodAutoscaler. It examines:
- Historical consumption patterns over time to identify trends
- Peak usage and variance to ensure sufficient headroom
- Out-of-memory (OOM) events and other resource-related incidents

Based on this analysis, the Recommender calculates three types of recommendations:
- Target recommendation (optimal resources for typical usage)
- Lower bound (minimum viable resources)
- Upper bound (maximum reasonable resources).

These recommendations are stored in the VerticalPodAutoscaler resource's `.status.recommendation` field.


The _updater_ component monitors the VerticalPodAutoscaler resources and compares current Pod resource requests with the recommendations. When the difference exceeds configured thresholds and the update policy allows it, the updater can either:

- Evict Pods, triggering their recreation with new resource requests (traditional approach)
- Update Pod resources in place without eviction, when the cluster supports in-place Pod resource updates

The chosen method depends on the configured update mode, cluster capabilities, and the type of resource change needed. In-place updates, when available, avoid Pod disruption but may have limitations on which resources can be modified. The updater respects PodDisruptionBudgets to minimize service impact.

The _admission controller_ operates as a mutating webhook that intercepts Pod creation requests. It
checks if the Pod is targeted by a VerticalPodAutoscaler and, if so, applies the recommended
resource requests and limits before the Pod is created. More specifically, the admission controller uses the Target recommendation in the VerticalPodAutoscaler resource's `.status.recommendation` stanza as the new resource requests. The admission controller ensures new Pods start with appropriately sized resource allocations, whether they're created during initial deployment, after an eviction by the updater, or due to scaling operations.

The VerticalPodAutoscaler requires a metrics source, such as Kubernetes' Metrics Server {{< glossary_tooltip text="add-on" term_id="addons" >}},
to be installed in the cluster.
The VPA components fetch metrics from the `metrics.k8s.io` API. The Metrics Server needs to be launched separately as it is not deployed by default in most clusters. For more information about resource metrics, see [Metrics Server](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-server).

## Update modes

A VerticalPodAutoscaler supports different _update modes_ that control how and when
resource recommendations are applied to your Pods. You configure the update mode using
the `updateMode` field in the VPA spec under `updatePolicy`:

```yaml
---
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"  # Off, Initial, Recreate, InPlaceOrRecreate
```

### Off {#updateMode-Off}

In the _Off_ update mode, the VPA recommender still analyzes resource usage and generates
recommendations, but these recommendations are not automatically applied to Pods.
The recommendations are only stored in the VPA object's `.status` field.

You can use a tool such as `kubectl` to view the `.status` and the recommendations in it.

### Initial {#updateMode-Initial}

In _Initial_ mode, VPA only sets resource requests when Pods are first created. It does not update resources for already running Pods, even if recommendations change over time. The recommendations apply only during Pod creation.

### Recreate {#updateMode-Recreate}

In _Recreate_ mode, VPA actively manages Pod resources by evicting Pods when their current
resource requests differ significantly from recommendations. When a Pod is evicted, the workload
controller (managing a Deployment, StatefulSet, etc) creates a replacement Pod, and the VPA admission
controller applies the updated resource requests to the new Pod.

### InPlaceOrRecreate {#updateMode-InPlaceOrRecreate}

In `InPlaceOrRecreate` mode, VPA attempts to update Pod resource requests and limits without restarting the Pod when possible. However, if in-place updates cannot be performed for a particular resource change, VPA falls back to evicting the Pod
(similar to `Recreate` mode) and allowing the workload controller to create a replacement Pod with updated resources.

In this mode, the updater applies recommendations in-place using the [Resize Container Resources In-Place](/docs/tasks/configure-pod-container/resize-container-resources/) feature.

### Auto (deprecated) {#updateMode-Auto}

{{< note >}}
The `Auto` update mode is **deprecated since VPA version 1.4.0**. Use `Recreate` for
eviction-based updates, or `InPlaceOrRecreate` for in-place updates with eviction fallback.
{{< /note >}}

`Auto` mode is currently an alias for `Recreate` mode and behaves identically. It was introduced to allow for future expansion of automatic update strategies.

## Resource policies

Resource policies allow you to fine-tune how the VerticalPodAutoscaler generates recommendations and applies updates.
You can set boundaries for resource recommendations, specify which resources to manage, and configure different policies for individual containers within a Pod.

You define resource policies in the `resourcePolicy` field of the VPA spec:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: "application"
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources:
      - cpu
      - memory
      controlledValues: RequestsAndLimits
```

#### minAllowed and maxAllowed

These fields set boundaries for VPA recommendations.
The VPA will never recommend resources below `minAllowed` or above `maxAllowed`, even if the actual usage data suggests different values.

#### controlledResources

The `controlledResources` field specifies which resource types VPA should manage for a container in a Pod.
If not specified, VPA manages both CPU and memory by default. You can restrict VPA to manage only specific resources.
Valid resource names include `cpu` and `memory`.

### controlledValues

The `controlledValues` field determines whether VPA controls resource requests, limits, or both:

RequestsAndLimits
: VPA sets both requests and limits. The limit scales proportionally to the request based on the request-to-limit ratio defined in the Pod spec. This is the default mode.

RequestsOnly
: VPA only sets requests, leaving limits unchanged. Limits are respected and can still trigger throttling or out-of-memory kills if usage exceeds them.

See [requests and limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) to learn more about those two concepts.

## LimitRange resources

The admission controller and updater VPA components post-process recommendations to comply with the constraints defined in [LimitRanges](/docs/concepts/policy/limit-range/). The LimitRange resources with `type` Pod and Container are checked in the Kubernetes cluster. 

For example, if the `max` field in a Container LimitRange resource is exceeded, both VPA components lower the limit to the value defined in the `max` field, and the request is proportionally decreased to maintain the request-to-limit ratio in the Pod spec.

## {{% heading "whatsnext" %}}

If you configure autoscaling in your cluster, you may also want to consider using
[node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)
to ensure you are running the right number of nodes.
You can also read more about [_horizontal_ Pod autoscaling](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).
