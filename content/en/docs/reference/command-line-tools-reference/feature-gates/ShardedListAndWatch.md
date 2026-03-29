---
title: ShardedListAndWatch
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Enable support for the `shardSelector` parameter on **list** and **watch** requests,
allowing clients to receive a filtered subset of objects based on hash ranges of
metadata fields (such as UID). See
[Sharded list and watch](/docs/reference/using-api/api-concepts/#sharded-list-and-watch)
for more details.
