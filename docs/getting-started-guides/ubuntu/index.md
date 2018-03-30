---
title: Kubernetes on Ubuntu
---

{% capture overview %}
The recommended way to run a full Kubernetes cluster on Ubuntu, which scales from a single node such as your laptop to multiple nodes on bare metal, VMware or public clouds and supports production operations and upgrades.
{% endcapture %}

{% capture body %}
Follow this guide to:

 * Deploy the current stable release of Kubernetes, or older supported releases
 * Run NVIDIA GPU-enabled worker nodes
 * Receive security updates from Canonical
 * Operate the cluster efficiently, scaling up as needed
 * Upgrade to newer versions of Kubernetes when you want

## Quick Start

We'll use [conjure-up](https://conjure-up.io/) to deploy Kubernetes with a user-friendly text UI that prompts you for cloud credentials and configuration options.

On Ubuntu 16.04 or later:
```
sudo snap install conjure-up --classic
conjure-up kubernetes
```

On Homebrew for macOS:
```
brew install conjure-up
conjure-up kubernetes
```

## Official Ubuntu K8s Operations Guides

These cover in-depth daily operations of the [Canonical Distribution of Kubernetes](https://www.ubuntu.com/kubernetes) (CDK) which supports AWS, GCE, Azure, Joyent, OpenStack, VMware, Bare Metal and localhost deployments.

  - [Installation](/docs/getting-started-guides/ubuntu/installation/)
  - [Validation](/docs/getting-started-guides/ubuntu/validation/)
  - [Backups](/docs/getting-started-guides/ubuntu/backups/)
  - [Upgrades](/docs/getting-started-guides/ubuntu/upgrades/)
  - [Scaling](/docs/getting-started-guides/ubuntu/scaling/)
  - [Logging](/docs/getting-started-guides/ubuntu/logging/)
  - [Monitoring](/docs/getting-started-guides/ubuntu/monitoring/)
  - [Networking](/docs/getting-started-guides/ubuntu/networking/)
  - [Security](/docs/getting-started-guides/ubuntu/security/)
  - [Storage](/docs/getting-started-guides/ubuntu/storage/)
  - [Troubleshooting](/docs/getting-started-guides/ubuntu/troubleshooting/)
  - [Decommissioning](/docs/getting-started-guides/ubuntu/decommissioning/)
  - [Operational Considerations](/docs/getting-started-guides/ubuntu/operational-considerations/)
  - [Glossary](/docs/getting-started-guides/ubuntu/glossary/)

## Third-party Product Integrations

  - [Rancher](/docs/getting-started-guides/ubuntu/rancher/)

## Developer-local deployments

  - [Localhost using LXD](/docs/getting-started-guides/ubuntu/local/)

## Where to find us

We're usually in the following Slack channels:

- [kubernetes-users](https://kubernetes.slack.com/messages/kubernetes-users/)
- [kubernetes-novice](https://kubernetes.slack.com/messages/kubernetes-novice/)
- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

...and we monitor the Kubernetes mailing lists. [Consulting](https://www.ubuntu.com/kubernetes) and support for this distribution of Kubernetes are available from Canonical as part of their standard Ubuntu support package.
{% endcapture %}

{% include templates/concept.md %}
