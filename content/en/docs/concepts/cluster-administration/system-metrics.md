---
title: Metrics For Kubernetes System Components
reviewers:
- brancz
- logicalhan
- RainbowMango
content_type: concept
weight: 70
---

<!-- overview -->

System component metrics can give a better look into what is happening inside them. Metrics are
particularly useful for building dashboards and alerts.

Kubernetes components emit metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/).
This format is structured plain text, designed so that people and machines can both read it.

<!-- body -->

## Metrics in Kubernetes

In most cases metrics are available on `/metrics` endpoint of the HTTP server. For components that
don't expose endpoint by default, it can be enabled using `--bind-address` flag.

Examples of those components:

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

In a production environment you may want to configure [Prometheus Server](https://prometheus.io/)
or some other metrics scraper to periodically gather these metrics and make them available in some
kind of time series database.

Note that {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} also exposes metrics in
`/metrics/cadvisor`, `/metrics/resource` and `/metrics/probes` endpoints. Those metrics do not
have the same lifecycle.

If your cluster uses {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, reading metrics requires
authorization via a user, group or ServiceAccount with a ClusterRole that allows accessing
`/metrics`. For example:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - nonResourceURLs:
      - "/metrics"
    verbs:
      - get
```

## Metric lifecycle

Alpha metric →  Stable metric →  Deprecated metric →  Hidden metric → Deleted metric

Alpha metrics have no stability guarantees. These metrics can be modified or deleted at any time.

Stable metrics are guaranteed to not change. This means:

* A stable metric without a deprecated signature will not be deleted or renamed
* A stable metric's type will not be modified

Deprecated metrics are slated for deletion, but are still available for use.
These metrics include an annotation about the version in which they became deprecated.

For example:

* Before deprecation

  ```
  # HELP some_counter this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

* After deprecation

  ```
  # HELP some_counter (Deprecated since 1.15.0) this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

Hidden metrics are no longer published for scraping, but are still available for use. To use a
hidden metric, please refer to the [Show hidden metrics](#show-hidden-metrics) section. 

Deleted metrics are no longer published and cannot be used.

## Show hidden metrics

As described above, admins can enable hidden metrics through a command-line flag on a specific
binary. This intends to be used as an escape hatch for admins if they missed the migration of the
metrics deprecated in the last release.

The flag `show-hidden-metrics-for-version` takes a version for which you want to show metrics
deprecated in that release. The version is expressed as x.y, where x is the major version, y is
the minor version. The patch version is not needed even though a metrics can be deprecated in a
patch release, the reason for that is the metrics deprecation policy runs against the minor release.

The flag can only take the previous minor version as it's value. All metrics hidden in previous
will be emitted if admins set the previous version to `show-hidden-metrics-for-version`. The too
old version is not allowed because this violates the metrics deprecated policy.

Take metric `A` as an example, here assumed that `A` is deprecated in 1.n. According to metrics
deprecated policy, we can reach the following conclusion:

* In release `1.n`, the metric is deprecated, and it can be emitted by default.
* In release `1.n+1`, the metric is hidden by default and it can be emitted by command line
  `show-hidden-metrics-for-version=1.n`.
* In release `1.n+2`, the metric should be removed from the codebase. No escape hatch anymore.

If you're upgrading from release `1.12` to `1.13`, but still depend on a metric `A` deprecated in
`1.12`, you should set hidden metrics via command line: `--show-hidden-metrics=1.12` and remember
to remove this metric dependency before upgrading to `1.14`

## Component metrics

### kube-controller-manager metrics

Controller manager metrics provide important insight into the performance and health of the
controller manager. These metrics include common Go language runtime metrics such as go_routine
count and controller specific metrics such as etcd request latencies or Cloudprovider (AWS, GCE,
OpenStack) API latencies that can be used to gauge the health of a cluster.

Starting from Kubernetes 1.7, detailed Cloudprovider metrics are available for storage operations
for GCE, AWS, Vsphere and OpenStack.
These metrics can be used to monitor health of persistent volume operations.

For example, for GCE these metrics are called:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```


### kube-scheduler metrics

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

The scheduler exposes optional metrics that reports the requested resources and the desired limits
of all running pods. These metrics can be used to build capacity planning dashboards, assess
current or historical scheduling limits, quickly identify workloads that cannot schedule due to
lack of resources, and compare actual usage to the pod's request.

The kube-scheduler identifies the resource [requests and limits](/docs/concepts/configuration/manage-resources-containers/)
configured for each Pod; when either a request or limit is non-zero, the kube-scheduler reports a
metrics timeseries. The time series is labelled by:

- namespace
- pod name
- the node where the pod is scheduled or an empty string if not yet scheduled
- priority
- the assigned scheduler for that pod
- the name of the resource (for example, `cpu`)
- the unit of the resource if known (for example, `cores`)

Once a pod reaches completion (has a `restartPolicy` of `Never` or `OnFailure` and is in the
`Succeeded` or `Failed` pod phase, or has been deleted and all containers have a terminated state)
the series is no longer reported since the scheduler is now free to schedule other pods to run.
The two metrics are called `kube_pod_resource_request` and `kube_pod_resource_limit`.

The metrics are exposed at the HTTP endpoint `/metrics/resources` and require the same
authorization as the `/metrics` endpoint on the scheduler. You must use the
`--show-hidden-metrics-for-version=1.20` flag to expose these alpha stability metrics.

## Disabling metrics

You can explicitly turn off metrics via command line flag `--disabled-metrics`. This may be
desired if, for example, a metric is causing a performance problem. The input is a list of
disabled metrics (i.e. `--disabled-metrics=metric1,metric2`).

## Metric cardinality enforcement

Metrics with unbounded dimensions could cause memory issues in the components they instrument. To
limit resource use, you can use the `--allow-label-value` command line option to dynamically
configure an allow-list of label values for a metric.

In alpha stage, the flag can only take in a series of mappings as metric label allow-list.
Each mapping is of the format `<metric_name>,<label_name>=<allowed_labels>` where 
`<allowed_labels>` is a comma-separated list of acceptable label names.
                                                                                           
The overall format looks like:

```
--allow-label-value <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```

Here is an example:

```none
--allow-label-value number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

In addition to specifying this from the CLI, this can also be done within a configuration file. You
can specify the path to that configuration file using the `--allow-metric-labels-manifest` command
line argument to a component. Here's an example of the contents of that configuration file:

```yaml
allow-list:
- "metric1,label2": "v1,v2,v3"
- "metric2,label1": "v1,v2,v3"
```

Additionally, the `cardinality_enforcement_unexpected_categorizations_total` meta-metric records the
count of unexpected categorizations during cardinality enforcement, that is, whenever a label value
is encountered that is not allowed with respect to the allow-list constraints.

## {{% heading "whatsnext" %}}

* Read about the [Prometheus text format](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format)
  for metrics
* See the list of [stable Kubernetes metrics](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
* Read about the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)