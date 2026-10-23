---
layout: blog
title: "Kubernetes v1.38: Updating Pod Resources for Suspended Jobs"
draft: true
slug: kubernetes-v1-38-updating-pod-resources-for-suspended-jobs
author: Utkarsh Raj
---

This placeholder outlines a planned article about KEP-5440 and its targeted
graduation to Stable in Kubernetes v1.38. The final article will explain how
resource updates to a suspended Job's Pod template can help queueing systems
adapt workloads to available cluster capacity before the Job runs again.

## Why update resources for suspended Jobs?

The final article will describe why a queueing controller or cluster operator
might adjust CPU, memory, GPU, or other extended-resource requests and limits
after creating a Job but before allowing it to run.

## What changes in Kubernetes v1.38?

The article will cover the targeted Stable graduation of the Beta,
default-enabled `MutablePodResourcesForSuspendedJobs` and
`MutableSchedulingDirectivesForSuspendedJobs` feature gates. The former permits
resource updates, while the latter permits scheduling-directive updates and
supports the safe suspend-and-update workflow for previously started Jobs.

## How resource updates work

The article will explain that updates change the suspended Job's Pod template,
so they apply to Pods created after the Job resumes; they do not resize an
existing running Pod. For a previously started Job, suspension terminates its
active Pods, and template updates are accepted only after the Job is safely
suspended and has no active Pods.

## Planned usage example

The full draft will include a focused example that creates a suspended Job,
updates its container resource requests and limits, and then resumes the Job so
that newly created Pods use the revised template.

## Limitations and operational considerations

The article will cover normal resource validation, the restrictions on unrelated
Pod-template changes, and considerations for replacement Pods and Dynamic
Resource Allocation. It will also make clear that suspending a running Job
terminates its active Pods rather than preserving their containers or memory.

## Further reading

The full article will build on [KEP-5440](https://kep.k8s.io/5440) and the
official documentation for [Kubernetes Jobs](/docs/concepts/workloads/controllers/job/).
