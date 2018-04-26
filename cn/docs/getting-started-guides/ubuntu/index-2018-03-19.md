---
title: Kubernetes on Ubuntu
---

{% capture overview %}
There are multiple ways to run a Kubernetes cluster with Ubuntu. These pages explain how to deploy Kubernetes on Ubuntu on multiple public and private clouds, as well as bare metal.
{% endcapture %}

{% capture body %}
## Official Ubuntu Guides

- [The Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes)

The latest version of Kubernetes with upstream binaries. Supports AWS, GCE, Azure, Joyent, OpenStack, VMware, Bare Metal and localhost deployments.

### Quick Start

[conjure-up](http://conjure-up.io/) provides the quickest way to deploy Kubernetes on Ubuntu for multiple clouds and bare metal. It provides a user-friendly UI that prompts you for cloud credentials and configuration options

Available for Ubuntu 16.04 and newer:

```
sudo snap install conjure-up --classic
# re-login may be required at that point if you just installed snap utility
conjure-up kubernetes
```

As well as Homebrew for macOS:

```
brew install conjure-up
conjure-up kubernetes
```

### Operational Guides

These are more in-depth guides for users choosing to run Kubernetes in production:

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

## Developer Guides

  - [Localhost using LXD](/docs/getting-started-guides/ubuntu/local/)

## Where to find us

We're normally following the following Slack channels:

- [kubernetes-users](https://kubernetes.slack.com/messages/kubernetes-users/)
- [kubernetes-novice](https://kubernetes.slack.com/messages/kubernetes-novice/)
- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

and we monitor the Kubernetes mailing lists.
{% endcapture %}

{% include templates/concept.md %}
