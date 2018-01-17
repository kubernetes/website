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

* [DaemonSets](/docs/concepts/workloads/controllers/daemonset/)
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

Securing your cluster includes work beyond the scope of Kubernetes itself. (TODO: identify major items)

In Kubernetes, you configure access control:

* [Controlling Access to the Kubernetes API](docs/admin/accessing-the-api/)
* [Authenticating](/docs/admin/authentication/)
* [Using Admission Controllers](/docs/admin/admission-controllers/)

You also configure authorization. That is, you determine not just how users and services authenticate to the API server, or whether they have access, but also what resources they have access to. Role-based access control (RBAC) is currently the recommended mechanism for controlling authorization to Kubernetes resources. Other authorization modes are available for more specific use cases. 

* [Authorization Overview](https://kubernetes.io/docs/admin/authorization/)
* [Using RBAC Authorization](/docs/admin/authorization/rbac/)

You should create Secrets to hold sensitive data such as passwords, tokens, or keys. Be aware, however, that there are limitations to the protections that a Secret can provide. See [the Risks section of the Secrets documentation](/docs/concepts/configuration/secret/#risks).

TODO: Other security content?

## Implement custom logging and monitoring

Monitoring the health and state of your cluster is important. Kubernetes provides some basic logging structure, but you will almost certainly need third-party tools to help aggregate and analyze log data.

Start with the [basics on Kubernetes logging](docs/concepts/cluster-administration/logging/).

You'll need to add tooling to support log capture and more. See the following topics:

* [Logging Using Elasticsearch and Kibana](docs/tasks/debug-application-cluster/logging-elasticsearch-kibana/)

Other third-party tools to support metrics capture, trends, and monitoring include:

* Prometheus
* Influxdb
* Datadog

<!--Ancillary tooling to support distributed performance analysis -- does this maybe belong in advanced?
? Opentracing, jaeger, zipkin-->

## Additional resources

TODO

{% endcapture %}

{% include templates/user-journey-content.md %}
