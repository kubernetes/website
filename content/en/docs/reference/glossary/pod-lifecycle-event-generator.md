---
id: pod-lifecycle-event-generator
title: Pod Lifecycle Event Generator (PLEG)
full_link: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/pod-lifecycle-event-generator.md
date: 2020-02-09
short_description: >
 The Pod Lifecycle Event Generator (PLEG) monitors the state of the Pods' containers, creating events when changes occur.

related:
 - kubelet
 - pod-lifecycle
tags:
 - architecture
---

 The Pod Lifecycle Event Generator (PLEG) monitors the state of the Pods' containers, creating events when changes occur.

<!--more--> 

 The [PLEG](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/pod-lifecycle-event-generator.md) is a component of the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} and gets information on the current containers state by polling the container runtime. When state changes are observed, they are reported as container-runtime-agnostic Pod Lifecycle Events.

