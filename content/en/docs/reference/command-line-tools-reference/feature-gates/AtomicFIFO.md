---
title: AtomicFIFO
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"

---
A client-go implementation of a FIFO queue that uses atomic operations to ensure events that come in
batches, such as those from a ListAndWatch call, are processed in a single chunk. This is in contrast to
the previous implementation which would process these events one by one, potentially causing the internal
cache to become temporarily inconsistent with the API server. This feature gate can be toggled in the
kube-controller-manager and any client-go based controller.
