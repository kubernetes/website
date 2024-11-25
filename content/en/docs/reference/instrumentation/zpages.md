---
title: Kubernetes z-pages
content_type: reference
weight: 60
reviewers:
- dashpole
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.32" state="alpha" >}}

Kubernetes core components can expose a suite of _z-endpoints_ to make it easier for users
to debug their cluster and its components. These endpoints are strictly to be used for human
inspection to gain real time debugging information of a component binary.
Avoid automated scraping of data returned by these endpoints; in Kubernetes {{< skew currentVersion >}}
these are an **alpha** feature and the response format may change in future releases.

<!-- body -->

## z-pages

Kubernetes v{{< skew currentVersion >}} allows you to enable _z-pages_ to help you troubleshoot
problems with its core control plane components. These special debugging endpoints provide internal
information about running components. For Kubernetes {{< skew currentVersion >}}, components
serve the following endpoints (when enabled):

- [z-pages](#z-pages)
  - [statusz](#statusz)
  - [flagz](#flagz)

### statusz

Enabled using the `ComponentStatusz` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the `/statusz` endpoint displays high level information about the component such as its Kubernetes version, emulation version, start time and more.

The `/statusz` response from the API server is similar to:

```
kube-apiserver statusz
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

Started: Wed Oct 16 21:03:43 UTC 2024
Up: 0 hr 00 min 16 sec
Go version: go1.23.2
Binary version: 1.32.0-alpha.0.1484&#43;5eeac4f21a491b-dirty
Emulation version: 1.32.0-alpha.0.1484
```

### flagz

Enabled using the `ComponentFlagz` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/), the `/flagz` endpoint shows you the command line arguments that were used to start a component.

The `/flagz` data for the API server looks something like:

```
kube-apiserver flags
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

advertise-address=192.168.8.2
contention-profiling=false
enable-priority-and-fairness=true
profiling=true
authorization-mode=[Node,RBAC]
authorization-webhook-cache-authorized-ttl=5m0s
authorization-webhook-cache-unauthorized-ttl=30s
authorization-webhook-version=v1beta1
default-watch-cache-size=100
```