---
title: QoSClass
id: qosClass
date: 2019-04-15
full_link: 
short_description: >
  QoSClass provides a way for Kubernetes to classify pods within the cluster into several classes and make decisions about scheduling and eviction.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod

---
 QoSClass provides a way for Kubernetes to classify Pods within the cluster into several classes and make decisions about scheduling and eviction.

<!--more--> 
QoSClass of a Pod is set at creation time  based on the Pod compute resources ({{< glossary_tooltip text="requests and limits" term_id="LimitRange" >}}) settings. QoS classes are used to make decisions about Pods scheduling and eviction.
Kubernetes can assigns one of the following  QoS class to a Pod: `Guaranteed`, `Burstable` or `BestEffort`.


