---
layout: blog
title: "Kubernetes v1.37: Streaming Large List Responses from etcd with RangeStream"
date: 2026-XX-XX
draft: true
slug: kubernetes-v1-37-etcd-range-stream
author: >
  [Jeffrey Ying](https://github.com/Jefftree) (Google)
---

_Placeholder for the v1.37 feature blog on etcd RangeStream
([KEP-5966](https://github.com/kubernetes/enhancements/issues/5966)). Content to follow._

## Background

<!-- Why large LIST requests are expensive for etcd and kube-apiserver today. -->

## What RangeStream does

<!-- How the apiserver streams large list responses from etcd instead of buffering
a single Range response, and the memory benefits on both sides. -->

## How to use it

<!-- The EtcdRangeStream feature gate (beta, default off in v1.37) and how to enable it. -->

## What's next

<!-- Path to default-on and GA. -->
