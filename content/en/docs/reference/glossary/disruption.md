---
title: Disruption
id: disruption
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  An event that leads to Pod(s) going out of service
aka:
tags:
- fundamental
---
 Disruptions are events that lead to one or more
{{< glossary_tooltip term_id="pod" text="Pods" >}} going out of service.
A disruption has consequences for workload management {{< glossary_tooltip text="resources" term_id="api-resource" >}},
such as {{< glossary_tooltip term_id="deployment" >}}, that rely on the affected
Pods.

<!--more-->

If you, as cluster operator, destroy a Pod that belongs to an application,
Kubernetes terms that a _voluntary disruption_. If a Pod goes offline
because of a Node failure, or an outage affecting a wider failure zone,
Kubernetes terms that an _involuntary disruption_.

See [Disruptions](/docs/concepts/workloads/pods/disruptions/) for more information.
