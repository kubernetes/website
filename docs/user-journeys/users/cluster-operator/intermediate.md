---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Cluster Operators - Intermediate
track: "USERS > CLUSTER OPERATOR > INTERMEDIATE"
---

{% capture overview %}

If you're a cluster operator looking to expand your grasp of Kubernetes, this page and its linked topics extend the information provided on the [foundational cluster operator page](/docs/user-journeys/users/cluster-operator/foundational). Here we'll get you going on key Kubernetes tasks that you need to manage a complete production cluster.

{% endcapture %}

<!--
Intermediate
External services & Endpoints
Autoscaling, taints, and tolerations to limit/expose resources in a cluster
Ingress management
External service discovery mechanisms/service broker
Stateful sets, operators, Persistent Volume Claims
-->

{% capture body %}

## Work with Ingress, Networking, Storage, Workloads

Introductions to Kubernetes typically discuss simpler stateless applications. As you move into fuller dev, testing, and production environments, you need to consider more complex cases:

Communication: Ingress and Networking

* [Ingress](/docs/concepts/services-networking/ingress/)

Storage: Volumes and PersistentVolumes

* [Volumes](/docs/concepts/storage/volumes/)
* [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

Workloads

* [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/)
* [Stateful Sets](/docs/concepts/workloads/controllers/statefulset/)
* [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)

Pods

* [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/)
  * [Init Containers](/docs/concepts/workloads/pods/init-containers/)
  * [Pod Presets](/docs/concepts/workloads/pods/podpreset/)
  * [Container Lifecycle Hooks](docs/concepts/containers/container-lifecycle-hooks/)

And how Pods work with scheduling, priority, disruptions:

* [Taints and Tolerations](/docs/concepts/configuration/taint-and-toleration/)
* [Pods and Priority](/docs/concepts/configuration/pod-priority-preemption/)
* [Disruptions](/docs/concepts/workloads/pods/disruptions/)
* [Assigning Pods to Nodes](docs/concepts/configuration/assign-pod-node/)
* [Managing compute resources for containers](docs/concepts/configuration/manage-compute-resources-container/)
* [Configuration best practices](docs/concepts/configuration/overview/)

## Implement security best practices

RBAC/authz and authn, admission controller

Secrets (not just how but limitations)

Other security content?

## Implement custom logging and monitoring

Ancillary tooling to support log capture
? fluentd, logstash, elastic
Ancillary tooling to support metrics capture, trending, and monitoring
? prometheus, influxdb, kibana, datadog/external monitoring
Ancillary tooling to support distributed performance analysis -- does this maybe belong in advanced?
? Opentracing, jaeger, zipkin

## Additional resources

TODO

{% endcapture %}

{% include templates/user-journey-content.md %}
