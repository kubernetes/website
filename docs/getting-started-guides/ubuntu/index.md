---
title: Kubernetes on Ubuntu
---

{% capture overview %}
There are multiple ways to run a Kubernetes cluster with Ubuntu. These pages explain how to deploy Kubernetes on Ubuntu on multiple public and private clouds, as well as bare metal.
{% endcapture %}

{% capture body %}
## Official Ubuntu Guides

- [The Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes)

Supports AWS, GCE, Azure, Joyent, OpenStack, VMWare, Bare Metal and localhost deployments.

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

  - [Installation](/docs/setup/ubuntu/installation/)
  - [Validation](/docs/setup/ubuntu/validation/)
  - [Backups](/docs/setup/ubuntu/backups/)
  - [Upgrades](/docs/setup/ubuntu/upgrades/)
  - [Scaling](/docs/setup/ubuntu/scaling/)
  - [Logging](/docs/setup/ubuntu/logging/)
  - [Monitoring](/docs/setup/ubuntu/monitoring/)
  - [Networking](/docs/setup/ubuntu/networking/)
  - [Security](/docs/setup/ubuntu/security/)
  - [Storage](/docs/setup/ubuntu/storage/)
  - [Troubleshooting](/docs/setup/ubuntu/troubleshooting/)
  - [Decommissioning](/docs/setup/ubuntu/decommissioning/)
  - [Operational Considerations](/docs/setup/ubuntu/operational-considerations/)
  - [Glossary](/docs/setup/ubuntu/glossary/)

## Developer Guides

  - [Localhost using LXD](/docs/setup/ubuntu/local/)

## Where to find us

We're normally following the following Slack channels:

- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

and we monitor the Kubernetes mailing lists.
{% endcapture %}

{% include templates/concept.md %}
