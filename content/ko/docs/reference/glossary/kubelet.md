---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
short_description: >
  An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.

aka: 
tags:
- fundamental
- core-object
---
 An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.

<!--more--> 

The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. The kubelet doesn’t manage containers which were not created by Kubernetes.

