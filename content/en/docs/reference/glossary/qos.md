---
title: QoS
id: qos
date: 2019-04-15
full_link: 
short_description: >
  QoS provides a way for kubernetes to classify pods within the cluster into several classes and make decisions about scheduling and eviction.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod

---
 QoS provides a way for kubernetes to classify Pods within the cluster into several classes and make decisions about scheduling and eviction.

<!--more--> 
QoS Class of a Pod is set at creation time  based on the pod compute resources ({{< glossary_tooltip text="requests and limits" term_id="LimitRange" >}}) settings. QoS classes are used to make decisions about pods scheduling and eviction.
Kubernetes can assigns one of the following  QoS class to a Pod: `Guaranteed`, `Burstable` or `BestEffort`.


