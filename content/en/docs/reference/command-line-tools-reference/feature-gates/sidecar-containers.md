---
title: SidecarContainers
content_type: feature_gate
_build:
  list: never
  render: false
---
Allow setting the `restartPolicy` of an init container to
`Always` so that the container becomes a sidecar container (restartable init containers).
See [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/sidecar-containers/)
for more details.
