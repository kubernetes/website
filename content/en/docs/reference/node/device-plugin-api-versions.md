---
content_type: "reference"
title: Kubelet Device Manager API Versions
weight: 10
---

Please note that the device plugin API is present here: https://github.com/kubernetes/kubelet/tree/master/pkg/apis/deviceplugin.

#### Compatibility matrix

|               |  Kubernetes 1.21 | Kubernetes 1.22 | Kubernetes 1.23 | Kubernetes 1.24 | Kubernetes 1.25 | Kubernetes 1.26 |
|---------------|------------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| `v1alpha1`    |  -               | -               | -               | -               | -               | -               |
| `v1beta1`     |  ✓               | ✓               | ✓               | ✓               | ✓               | ✓               |

Key:

* `✓` Exactly the same features / API objects in both device plugin API and
   the Kubernetes version.
* `+` device plugin API has features or API objects that may not be present in the
  Kubernetes cluster, either due to that device plugin API has additional new API, or
  that the server has removed old API. However, everything they have in
  common (i.e., most APIs) will work. Please note that alpha APIs may vanish or
  change significantly in a single release.
* `-` The Kubernetes cluster has features the device plugin API can't use,
  either due to the server has additional new API, or that device plugin API has
  removed old API. However, everything they share in common (i.e., most APIs)
  will work.