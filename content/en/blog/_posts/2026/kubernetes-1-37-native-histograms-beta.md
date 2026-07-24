---
layout: blog
title: "Kubernetes v1.37: Native Histograms Graduates to Beta"
date: 2026-07-09T10:00:00-08:00
slug: kubernetes-1-37-feature-native-histograms-beta
author: >
  Richa Banker (Google)
---

We are excited to announce that the `NativeHistograms` feature is graduating to Beta in Kubernetes 1.37! Native histograms are a high-fidelity histogram format in Prometheus that provides better resolution than traditional bucket-based histograms.

## What are Native Histograms?

(Placeholder: Explain what native histograms are, the problem with traditional bucket-based histograms, and how native histograms provide better resolution and lower cost.)

## How does it work in Kubernetes?

The `NativeHistograms` feature gate controls the exposure of native histograms. The `k8s.io/component-base/metrics` package handles this internally.

(Placeholder: Detail how users can enable the feature gate and any requirements, such as needing to scrape the protobuf format `testutil.ScrapeMetricsProto` instead of standard text formats, as classic text format collectors might only see classic buckets.)

## Try it out

(Placeholder: Steps to try it out in 1.37 and provide feedback.)

