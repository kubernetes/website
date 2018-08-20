---
title: Kubernetes on Ubuntu
content_template: templates/concept
---

{{% capture overview %}}
There are multiple ways to run a Kubernetes cluster with Ubuntu. These pages explain how to deploy Kubernetes on Ubuntu on multiple public and private clouds, as well as bare metal.
{{% /capture %}}

{{% capture body %}}
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

  - [Installation](/docs/independent-solutions/ubuntu/installation/)
  - [Validation](/docs/independent-solutions/ubuntu/validation/)
  - [Backups](/docs/independent-solutions/ubuntu/backups/)
  - [Upgrades](/docs/independent-solutions/ubuntu/upgrades/)
  - [Scaling](/docs/independent-solutions/ubuntu/scaling/)
  - [Logging](/docs/independent-solutions/ubuntu/logging/)
  - [Monitoring](/docs/independent-solutions/ubuntu/monitoring/)
  - [Networking](/docs/independent-solutions/ubuntu/networking/)
  - [Security](/docs/independent-solutions/ubuntu/security/)
  - [Storage](/docs/independent-solutions/ubuntu/storage/)
  - [Troubleshooting](/docs/independent-solutions/ubuntu/troubleshooting/)
  - [Decommissioning](/docs/independent-solutions/ubuntu/decommissioning/)
  - [Operational Considerations](/docs/independent-solutions/ubuntu/operational-considerations/)
  - [Glossary](/docs/independent-solutions/ubuntu/glossary/)


## Third-party Product Integrations

  - [Rancher](/docs/independent-solutions/ubuntu/rancher/)

## Developer Guides

  - [Localhost using LXD](/docs/independent-solutions/ubuntu/local/)

## Where to find us

We're normally following the following Slack channels:

- [kubernetes-users](https://kubernetes.slack.com/messages/kubernetes-users/)
- [kubernetes-novice](https://kubernetes.slack.com/messages/kubernetes-novice/)
- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

and we monitor the Kubernetes mailing lists.
{{% /capture %}}


