---
title: WatchCacheStallResume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables the watch cache to keep a slow watch open and serve it from the event
history until it catches up, instead of closing the watch when its buffer is
full. A watch ends only when its position ages out of the history, with a
`410 Gone` error.
