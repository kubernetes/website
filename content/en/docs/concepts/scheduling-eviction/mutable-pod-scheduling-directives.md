---
title: Pod Scheduling Readiness
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

Pods with [scheduling gates](/docs/concepts/scheduling-eviction/node-pressure-eviction/) have 
mutable scheduling directives, with certain constraints. Specifically, only updates to node selector
and node affinitities that further constrain the node selection are allowed.

<!-- body -->

The rules for updating a Pod's scheduling directives are as follows:

1. For `.spec.nodeSelector`, only additions are allowed. If absent, it will be allowed to be set.

2. For `spec.affinity.nodeAffinity`, if nil, then setting with anything, is allowed.

3. For `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`, the terms are ORed while `nodeSelectorTerms[]`.matchExpressions list and `nodeSelectorTerms[].fieldExpressions` are ANDed. If `NodeSelectorTerms` was empty, it will be allowed to be set. If not empty, then only additions of `NodeSelectorRequirements` to `matchExpressions` or `fieldExpressions` are allowed, and no changes to existing `matchExpressions` and `fieldExpressions` will be allowed.

4. For `.preferredDuringSchedulingIgnoredDuringExecution`, all updates are allowed. This is because preferred terms are not authoritative, and so policy controllers don't validate those terms.