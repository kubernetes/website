---
title: ConsistentGetFromCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enables the `kube-apiserver` to serve consistent **get** requests (`resourceVersion`
unset) and internal object state reads during write and delete optimistic concurrency
retries from its watch cache instead of reading directly from etcd. Requires an etcd
version with watch progress notifications (`v3.4.31+`, `v3.5.13+`, or later), and
falls back to etcd when the watch cache is unready or times out, or when a resource
uses a storage value transformer such as encryption at rest.

See the Kubernetes documentation on
[Semantics for **get** and **list**](/docs/reference/using-api/api-concepts/#semantics-for-get-and-list)
and
[Consistent reads and write conflict recovery from watch cache](/docs/reference/using-api/api-concepts/#consistent-get-from-cache)
for more details.
