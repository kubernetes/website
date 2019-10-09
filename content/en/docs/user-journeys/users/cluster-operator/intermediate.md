---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Intermediate
track: "USERS > CLUSTER OPERATOR > INTERMEDIATE"
content_template: templates/user-journey-content
---

{{% capture overview %}}

If you are a cluster operator looking to expand your grasp of Kubernetes, this page and its linked topics extend the information provided on the [foundational cluster operator page](/docs/user-journeys/users/cluster-operator/foundational). From this page you can get information on key Kubernetes tasks needed to manage a complete production cluster.

{{% /capture %}}

{{% capture body %}}

## Work with ingress, networking, storage, and workloads

Introductions to Kubernetes typically discuss simple stateless applications. As you move into more complex development, testing, and production environments, you need to consider more complex cases:

Communication: Ingress and Networking

* [Ingress](/docs/concepts/services-networking/ingress/)

Storage: Volumes and PersistentVolumes

* [Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

Workloads

* [DaemonSets](/docs/concepts/workloads/controllers/daemonset/)
* [Stateful Sets](/docs/concepts/workloads/controllers/statefulset/)
* [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)

Pods

* [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)
  * [Init Containers](/docs/concepts/workloads/pods/init-containers/)
  * [Pod Presets](/docs/concepts/workloads/pods/podpreset/)
  * [Container Lifecycle Hooks](/docs/concepts/containers/container-lifecycle-hooks/)

And how Pods work with scheduling, priority, disruptions:

* [Taints and Tolerations](/docs/concepts/configuration/taint-and-toleration/)
* [Pods and Priority](/docs/concepts/configuration/pod-priority-preemption/)
* [Disruptions](/docs/concepts/workloads/pods/disruptions/)
* [Assigning Pods to Nodes](/docs/concepts/configuration/assign-pod-node/)
* [Managing Compute Resources for Containers](/docs/concepts/configuration/manage-compute-resources-container/)
* [Configuration Best Practices](/docs/concepts/configuration/overview/)

## Implement security best practices

Securing your cluster includes work beyond the scope of Kubernetes itself.

In Kubernetes, you configure access control:

* [Controlling Access to the Kubernetes API](/docs/reference/access-authn-authz/controlling-access/)
* [Authenticating](/docs/reference/access-authn-authz/authentication/)
* [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)

You also configure authorization. That is, you determine not just how users and services authenticate to the API server, or whether they have access, but also what resources they have access to. Role-based access control (RBAC) is the recommended mechanism for controlling authorization to Kubernetes resources. Other authorization modes are available for more specific use cases.

* [Authorization Overview](/docs/reference/access-authn-authz/authorization/)
* [Using RBAC Authorization](/docs/reference/access-authn-authz/rbac/)

You should create Secrets to hold sensitive data such as passwords, tokens, or keys. Be aware, however, that there are limitations to the protections that a Secret can provide. See [the Risks section of the Secrets documentation](/docs/concepts/configuration/secret/#risks).

<!-- TODO: Other security content? -->

## Implement custom logging and monitoring

Monitoring the health and state of your cluster is important. Collecting metrics, logging, and providing access to that information are common needs. Kubernetes provides some basic logging structure, and you may want to use additional tools to help aggregate and analyze log data.

Start with the [basics on Kubernetes logging](/docs/concepts/cluster-administration/logging/) to understand how containers do logging and common patterns. Cluster operators often want to add something to gather and aggregate those logs. See the following topics:

* [Logging Using Elasticsearch and Kibana](/docs/tasks/debug-application-cluster/logging-elasticsearch-kibana/)
* [Logging Using Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/)

Like log aggregation, many clusters utilize additional software to help capture metrics and display them. There is an overview of tools at [Tools for Monitoring Compute, Storage, and Network Resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/).
Kubernetes also supports a [resource metrics pipeline](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/) which can be used by Horizontal Pod Autoscaler with custom metrics.

[Prometheus](https://prometheus.io/), another {{< glossary_tooltip text="CNCF" term_id="cncf" >}} project, is a common choice to support capture and temporary collection of metrics. There are several options for installing Prometheus, including using the [stable/prometheus](https://github.com/kubernetes/charts/tree/master/stable/prometheus) [helm](https://helm.sh/) chart, and CoreOS provides a [prometheus operator](https://github.com/coreos/prometheus-operator) and [kube-prometheus](https://github.com/coreos/prometheus-operator/tree/master/contrib/kube-prometheus), which adds on Grafana dashboards and common configurations.

A common configuration on [Minikube](https://github.com/kubernetes/minikube) and some Kubernetes clusters uses [Heapster](https://github.com/kubernetes/heapster)
[along with InfluxDB and Grafana](https://github.com/kubernetes/heapster/blob/master/docs/influxdb.md).
There is a [walkthrough of how to install this configuration in your cluster](https://blog.kublr.com/how-to-utilize-the-heapster-influxdb-grafana-stack-in-kubernetes-for-monitoring-pods-4a553f4d36c9).
As of Kubernetes 1.11, Heapster is deprecated, as per [sig-instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation).  See [Prometheus vs. Heapster vs. Kubernetes Metrics APIs](https://brancz.com/2018/01/05/prometheus-vs-heapster-vs-kubernetes-metrics-apis/) for more information alternatives.

Hosted monitoring, APM, or data analytics services such as [Datadog](https://docs.datadoghq.com/integrations/kubernetes/) or [Instana](https://www.instana.com/supported-integrations/kubernetes-monitoring/) also offer Kubernetes integration.

## Additional resources

Cluster Administration:

* [Troubleshoot Clusters](/docs/tasks/debug-application-cluster/debug-cluster/)
* [Debug Pods and Replication Controllers](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/)
* [Debug Init Containers](/docs/tasks/debug-application-cluster/debug-init-containers/)
* [Debug Stateful Sets](/docs/tasks/debug-application-cluster/debug-stateful-set/)
* [Debug Applications](/docs/tasks/debug-application-cluster/debug-application/)
* [Using explorer to investigate your cluster](https://github.com/kubernetes/examples/blob/master/staging/explorer/README.md)

{{% /capture %}}


