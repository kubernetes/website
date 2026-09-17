---
layout: blog
title: "SIG Instrumentation Welcomes kubernetes-mixin"
draft: true
slug: sig-instrumentation-welcomes-kubernetes-mixin
author: >
  [Stephen Lang](https://github.com/skl) (Grafana Labs)
---

The kubernetes-mixin project, with over eight years of commit history, has been adopted by SIG Instrumentation.

## What is kubernetes-mixin?

Kubernetes and Prometheus go hand in hand when it comes to monitoring clusters; a lot of data is already provided by many components and through related projects such as [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/), [cAdvisor](https://github.com/google/cadvisor), and [node_exporter](https://github.com/prometheus/node_exporter). However, knowing which metrics to look at, how to keep PromQL queries performant in large fleets, and what constitutes an error condition can be a tricky subject. This is where kubernetes-mixin comes in; it provides recording rules (such as `namespace_workload_pod:kube_pod_owner:relabel`) to speed up and simplify queries, alert rules (like `KubePodCrashLooping`) to identify info/warning/critical conditions, and Grafana dashboards to visualize the metrics. These assets work together to provide an infrastructure monitoring setup available to install directly or via downstream projects such as [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack).

## Adoption by SIG Instrumentation

Following a [#sig-instrumentation](https://kubernetes.slack.com/archives/C20HH14P7) Slack discussion, a [website issue](https://github.com/kubernetes/website/issues/53168) to provide documentation on instrumentation best practices was created. It seemed many of the alerts provided by kubernetes-mixin were recognized as commonly deployed but were not part of an official Kubernetes project or subproject, making it difficult to reference in official Kubernetes documentation. [Consensus](https://github.com/kubernetes-sigs/kubernetes-mixin/discussions/1169) was reached among the original maintainers and [KEP-5905](https://github.com/kubernetes/enhancements/issues/5905) was created to track the move of the kubernetes-mixin repo into the Kubernetes SIGs organization. The transfer was confirmed to be completed on Tuesday, September 8, 2026.

## Ongoing maintenance and compatibility

Transferring the repo, rather than forking, allows existing Git remote and runbook URLs to continue working as before. Regular maintenance continues (see below to get involved!) and kubernetes-mixin continues to follow the Kubernetes release cycle, tracking new metrics and deprecations based on real-world usage.

## Getting involved

Whether it's a new alert rule you have in mind, a dashboard improvement, an edge-case that could be addressed, or anything else - contributions are always welcome! Here are some ways you can get involved:

* Slack: join the [#monitoring-mixins](https://kubernetes.slack.com/messages/monitoring-mixins) and [#sig-instrumentation](https://kubernetes.slack.com/messages/sig-instrumentation) channels (visit [slack.k8s.io](https://slack.k8s.io/) for a workspace invitation)
* Head over to the [kubernetes-mixin repository](https://sigs.k8s.io/kubernetes-mixin/) to contribute issues/PRs/discussions
* Join the [SIG Instrumentation weekly calls](https://github.com/kubernetes/community/tree/main/sig-instrumentation#meetings)

## Acknowledgments

Thanks to the original maintainers who built kubernetes-mixin in 2018 and agreed to the transfer, to everyone who has kept it aligned with Kubernetes releases in the years since, and to SIG Instrumentation for taking it on.

