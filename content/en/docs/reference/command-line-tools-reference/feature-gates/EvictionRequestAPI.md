---
title: EvictionRequestAPI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables the `EvictionRequest` and `Eviction` APIs in the `lifecycle.k8s.io` API group and the
`.spec.evictionResponders` field of a Pod. It also enables the `evictionrequest-controller` and the
`imperative-eviction-responder-controller` in the kube-controller-manager, which process eviction requests. Requesters
create an EvictionRequest to ask for the graceful eviction of a Pod. Responders that are registered on the Pod can run
custom logic, such as starting a replacement or migrating data, before the Pod is terminated. If no other responder
terminates the Pod, the default responder evicts it by using
[API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
