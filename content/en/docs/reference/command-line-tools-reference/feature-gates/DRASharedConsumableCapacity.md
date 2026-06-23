---
title: DRASharedConsumableCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enables request-driven consumption of shared counters.

When enabled, DRA drivers can define parent-scoped shared capacities that are consumed
per allocation by related child devices, with scheduler accounting that prevents
aggregate over-allocation.
