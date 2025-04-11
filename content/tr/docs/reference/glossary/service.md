---
title: Service
id: service
date: 2018-04-12
full_link: /docs/concepts/services-networking/service/
short_description: >
  A way to expose an application running on a set of Pods as a network service.
tags:
- fundamental
- core-object
---
A method for exposing a network application that is running as one or more
{{< glossary_tooltip text="Pods" term_id="pod" >}} in your cluster.

<!--more-->

The set of Pods targeted by a Service is (usually) determined by a
{{< glossary_tooltip text="selector" term_id="selector" >}}. If more Pods are added or removed,
the set of Pods matching the selector will change. The Service makes sure that network traffic
can be directed to the current set of Pods for the workload.

Kubernetes Services either use IP networking (IPv4, IPv6, or both), or reference an external name in
the Domain Name System (DNS).

The Service abstraction enables other mechanisms, such as Ingress and Gateway.
