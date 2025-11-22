---
layout: blog
title: "Kubernetes v1.35: Mutable PersistentVolume NodeAffinity Alpha"
draft: true
slug: kubernetes-v1-35-mutable-pv-nodeaffinity
author: >
  Weiwen Hu (Alibaba Cloud)
---

The PersistentVolume NodeAffinity API dates back to Kubernetes v1.10.
It is widely used to express that volumes may not be equally accessible by all nodes in the cluster.

## Why Making NodeAffinity Mutable?

So why bothering to make it mutable after 8 years?

## Race Condition between Editing and Scheduling

## Future Integration with CSI

## Contact

For any inquiries or specific questions related to this feature, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
