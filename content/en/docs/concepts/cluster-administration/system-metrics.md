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

Alpha metric → Beta metric → Stable metric →  Deprecated metric →  Hidden metric → Deleted metric

Alpha metrics have no stability guarantees. These metrics can be modified or deleted at any time.

Beta metrics observe a looser API contract than its stable counterparts. No labels can be removed from beta metrics during their lifetime, however, labels can be added while the metric is in the beta stage.

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

Hidden metrics are no longer published for scraping, but are still available for use.
A deprecated metric becomes a hidden metric after a period of time, based on its stability level:
* **STABLE** metrics become hidden after a minimum of 3 releases or 9 months, whichever is longer.
* **BETA** metrics become hidden after a minimum of 1 release or 4 months, whichever is longer.
* **ALPHA** metrics can be hidden or removed in the same release in which they are deprecated.

To use a hidden metric, you must enable it. For more details, refer to the [Show hidden metrics](#show-hidden-metrics) section. 

Deleted metrics are no longer published and cannot be used.

## Show hidden metrics

As described above, admins can enable hidden metrics through a command-line flag on a specific
binary. This intends to be used as an escape hatch for admins if they missed the migration of the
metrics deprecated in the last release.

The flag `show-hidden-metrics-for-version` takes a version for which you want to show metrics
deprecated in that release. The version is expressed as x.y, where x is the major version, y is
the minor version. The patch version is not needed even though a metrics can be deprecated in a
patch release, the reason for that is the metrics deprecation policy runs against the minor release.

The flag can only take the previous minor version as its value. If you want to show all metrics hidden in the previous release, you can set the `show-hidden-metrics-for-version` flag to the previous version. Using a version that is too old is not allowed because it violates the metrics deprecation policy.

For example, let's assume metric `A` is deprecated in `1.29`. The version in which metric `A` becomes hidden depends on its stability level:
* If metric `A` is **ALPHA**, it could be hidden in `1.29`.
* If metric `A` is **BETA**, it will be hidden in `1.30` at the earliest. If you are upgrading to `1.30` and still need `A`, you must use the command-line flag `--show-hidden-metrics-for-version=1.29`.
* If metric `A` is **STABLE**, it will be hidden in `1.32` at the earliest. If you are upgrading to `1.32` and still need `A`, you must use the command-line flag `--show-hidden-metrics-for-version=1.31`.

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

The metrics are exposed at the HTTP endpoint `/metrics/resources`. They require
authorization for the `/metrics/resources` endpoint, usually granted by a
ClusterRole with the `get` verb for the `/metrics/resources` non-resource URL.

On Kubernetes 1.21 you must use the `--show-hidden-metrics-for-version=1.20`
flag to expose these alpha stability metrics.

### kubelet Pressure Stall Information (PSI) metrics

{{< feature-state feature_gate_name="KubeletPSI" >}}

When the kernel has PSI enabled (version 4.20 or later), the kubelet collects
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory and I/O usage.
The information is collected at node, pod and container level.

*Prometheus Metrics*: Exposed at the `/metrics/cadvisor` endpoint as cumulative counters (totals) representing the total stall time in seconds. The metrics are exposed at this endpoint with the following names: 

```
container_pressure_cpu_stalled_seconds_total
container_pressure_cpu_waiting_seconds_total
container_pressure_memory_stalled_seconds_total
container_pressure_memory_waiting_seconds_total
container_pressure_io_stalled_seconds_total
container_pressure_io_waiting_seconds_total
```
*Summary API*: Exposed at the `/stats/summary` endpoint, providing both the cumulative `totals` and the moving averages (`avg10`, `avg60`, `avg300`) in a JSON format. These averages represent the percentage of time that tasks were stalled on a resource over the respective 10-second, 60-second, and 5-minute intervals. 

These metrics are also natively exported through the node's respective file in `/proc/pressure/` -- cpu, memory, and io in the following format: 

```
some avg10=0.00 avg60=0.00 avg300=0.00 total=0
full avg10=0.00 avg60=0.00 avg300=0.00 total=0
```

How can these metrics be interpreted together? Take for example the following query from the Summary API:  
`kubectl get --raw "/api/v1/nodes/$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')/proxy/stats/summary" | jq '.pods[].containers[] | select(.name=="<CONTAINER_NAME>") | {name, cpu: .cpu.psi, memory: .memory.psi, io: .io.psi}'`. 
This returns the information in a json format as such. 

```
{
  "name": "<CONTAINER_NAME>",
  "cpu": {
    "full": {
      "total": 0,
      "avg10": 0,
      "avg60": 0,
      "avg300": 0
    },
    "some": {
      "total": 35232438,
      "avg10": 0.74,
      "avg60": 0.52,
      "avg300": 0.21,
    },  
  },
  "memory": {
    "full": {
      "total": 539105,
      "avg10": 0,
      "avg60": 0,
      "avg300": 0
    },
    "some": {
      "total": 658164,
      "avg10": 0.01,
      "avg60": 0.01,
      "avg300": 0.00,
    },
    }
  },
  "io": {
    "full": {
      "total": 33190987,
      "avg10": 0.31,
      "avg60": 0.22,
      "avg300": 0.05,
    },
    "some": {
      "total": 40809937,
      "avg10": 0.52,
      "avg60": 0.45,
      "avg300": 0.12,
    }
  }
}
```

Here is a simple spike scenario. The cpu.some `avg10` value of `0.74` indicates that in the last 10 seconds, at least one task in this container was stalled on the CPU for 0.74% of the time (0.0074 seconds or 74 milliseconds). Because `avg10` (0.74) is significantly higher than `avg300` (0.21) on the same resource, this suggests a recent surge in resource contention rather than a sustained long-term bottleneck. If monitored continuously and the `avg300` metrics increase as well, we can diagnose a more serious, lasting issue!

Additionally, notice how in this example `cpu.some` shows pressure, while `cpu.full` remains at 0.00. This tells us that while some processes were delayed waiting for CPU time, the container as a whole was still making progress. A non-zero full value would indicate that all non-idle tasks were stalled simultaneously, a much bigger problem.
Although not as human-readable, the `total` value of 35232438 represents the cumulative stall time in microseconds, that allow latency spike detection that otherwise may not show in the averages. They are also useful for monitoring systems, like Prometheus, to calculate precise rates of increase over specific time windows.
As a final note, when observing high I/O Pressure alongside low Memory Pressure, it can indicate that the application is waiting on disk throughput rather than failing due to a lack of available RAM. The node is not over-committed on memory, and a different diagnosis for disk consumption can be investigated. 

PSI metrics unlock a more robust way to monitor realitime resource contention at all levels for every cgroup, opening up the opportunity to dynamically handle workloads across the system. You can read more about the PSI metrics in [Understand PSI Metrics](/docs/reference/instrumentation/understand-psi-metrics/).

#### Requirements

Pressure Stall Information requires:

- [Linux kernel versions 4.20 or later](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)

## Disabling metrics

You can explicitly turn off metrics via command line flag `--disabled-metrics`. This may be
desired if, for example, a metric is causing a performance problem. The input is a list of
disabled metrics (i.e. `--disabled-metrics=metric1,metric2`).

## Metric cardinality enforcement

Metrics with unbounded dimensions could cause memory issues in the components they instrument. To
limit resource use, you can use the `--allow-metric-labels` command line option to dynamically
configure an allow-list of label values for a metric.

In alpha stage, the flag can only take in a series of mappings as metric label allow-list.
Each mapping is of the format `<metric_name>,<label_name>=<allowed_labels>` where 
`<allowed_labels>` is a comma-separated list of acceptable label names.
                                                                                           
The overall format looks like:

```
--allow-metric-labels <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```

Here is an example:

```none
--allow-metric-labels number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

In addition to specifying this from the CLI, this can also be done within a configuration file. You
can specify the path to that configuration file using the `--allow-metric-labels-manifest` command
line argument to a component. Here's an example of the contents of that configuration file:

```yaml
"metric1,label2": "v1,v2,v3"
"metric2,label1": "v1,v2,v3"
```

Additionally, the `cardinality_enforcement_unexpected_categorizations_total` meta-metric records the
count of unexpected categorizations during cardinality enforcement, that is, whenever a label value
is encountered that is not allowed with respect to the allow-list constraints.

## {{% heading "whatsnext" %}}

* Read about the [Prometheus text format](https://github.com/prometheus/docs/blob/main/docs/instrumenting/exposition_formats.md#text-based-format)
  for metrics
* See the list of [stable Kubernetes metrics](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
* Read about the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
