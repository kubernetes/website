---
reviewers:
  - floreks
  - maciaszczykm
  - shu-mutou
  - mikedanese
title: Web UI (Dashboard) - Deprecated
description: >-
  Information about the deprecated Kubernetes Dashboard and recommended alternatives.
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Use the Web UI Dashboard
---

{{% pageinfo color="primary" %}}
**Kubernetes Dashboard is deprecated and unmaintained.**

The Kubernetes Dashboard project has been archived and is no longer actively maintained.
For new installations, consider using [Headlamp](https://headlamp.dev/).
{{% /pageinfo %}}

{{< note >}}
For in-cluster deployments similar to Kubernetes Dashboard, see the
[Headlamp in-cluster installation guide](https://headlamp.dev/docs/latest/installation/in-cluster/).
{{< /note >}}

<!-- overview -->

Dashboard was a web-based Kubernetes user interface that allowed users to deploy containerized 
applications to a Kubernetes cluster, troubleshoot applications, and manage cluster resources.

<!-- body -->

## Recommended Alternative: Headlamp

{{< note >}}
Since Kubernetes Dashboard is deprecated and no longer maintained, we strongly recommend using
[Headlamp](https://headlamp.dev/) as an alternative web-based Kubernetes UI.
{{< /note >}}

Headlamp is an easy-to-use and extensible Kubernetes web UI that provides similar functionality
to the Kubernetes Dashboard with active development and support.

To deploy Headlamp in your cluster, see the
[Headlamp in-cluster installation guide](https://headlamp.dev/docs/latest/installation/in-cluster/).

For desktop usage, Headlamp also offers a standalone application available at
[headlamp.dev](https://headlamp.dev/).

## About Kubernetes Dashboard (Historical Reference)

Kubernetes Dashboard was a general-purpose web UI for Kubernetes clusters that allowed users to
manage and troubleshoot applications running in the cluster, as well as manage the cluster itself.

The project has been archived and is no longer actively maintained. The repository has been moved to
[kubernetes-retired/dashboard](https://github.com/kubernetes-retired/dashboard) for historical reference only.

## {{% heading "whatsnext" %}}

For more information about Headlamp, see the [Headlamp documentation](https://headlamp.dev/docs/).
