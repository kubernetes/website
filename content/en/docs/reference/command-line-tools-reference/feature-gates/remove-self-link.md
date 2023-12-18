---
title: RemoveSelfLink
content_type: feature_gate
_build:
  list: never
  render: false
---
Sets the `.metadata.selfLink` field to blank (empty string) for all
objects and collections. This field has been deprecated since the Kubernetes v1.16
release. When this feature is enabled, the `.metadata.selfLink` field remains part of
the Kubernetes API, but is always unset.
