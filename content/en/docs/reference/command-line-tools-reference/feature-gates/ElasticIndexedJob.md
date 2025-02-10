---
title: ElasticIndexedJob
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.31"
---
Enables Indexed Jobs to be scaled up or down by mutating both
`spec.completions` and `spec.parallelism` together such that `spec.completions == spec.parallelism`.
See docs on [elastic Indexed Jobs](/docs/concepts/workloads/controllers/job#elastic-indexed-jobs)
for more details.
