---
title: Web UI for Kubernetes (Dashboard Alternatives)
content_type: concept
weight: 10
---

<!-- overview -->

As of January 21, 2026, the original [Kubernetes Dashboard project](https://github.com/kubernetes-retired/dashboard/commit/0ba796d9b85f7070dbd4a5c88354fc79f88763bb) is deprecated. For new deployments, it is recommended to use modern, actively maintained graphical interfaces.

<!-- body -->

## Alternative: Headlamp

Headlamp is an open-source Kubernetes UI designed to provide a clear view of cluster resources and simplify day-to-day operations.

Headlamp can run either as a desktop application or as a web interface connected to your cluster. It uses your existing kubeconfig and Kubernetes permissions, so access control continues to be managed through standard Kubernetes authentication and RBAC.

### Key Capabilities

- Security: Native integration with Kubernetes RBAC.
- Flexibility: Supports multi-cluster management via kubeconfig.
- Extensibility: Features a plugin system for custom resource views.

### Installation

Headlamp provides several installation options depending on how you want to access it:

- Desktop application for local cluster management
- Web UI deployed inside a cluster
- Kubernetes manifests or Helm charts for cluster installation

For installation instructions and configuration details, see the official [Headlamp documentation](https://headlamp.dev/docs/).
