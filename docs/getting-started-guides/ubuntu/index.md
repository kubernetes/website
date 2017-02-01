---
title: Kubernetes on Ubuntu
---

{% capture overview %}
There are multiple ways to run a Kubernetes cluster with Ubuntu. These pages explain how to deploy Kubernetes on Ubuntu on multiple public and private clouds, as well as bare metal. 
{% endcapture %}

{% capture body %}
## Official Ubuntu Guides

- [The Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes)

Supports AWS, GCE, Azure, Joyent, OpenStack, Bare Metal and local workstation deployment.

### Quick Start

[conjure-up](http://conjure-up.io/) provides quick wasy to deploy Kubernetes on multiple clouds and bare metal. It provides a user-friendly UI that prompts you for cloud credentials and configuration options:  

Available for Ubuntu 16.04 and newer: 

```
sudo apt-add-repository ppa:juju/stable
sudo apt-add-repository ppa:conjure-up/next
sudo apt update
sudo apt install conjure-up
conjure-up
```

### Operational Guides

These are more in-depth guides for users choosing to run Kubernetes in production: 

  - [Installation](/docs/getting-started-guides/ubuntu/installation)
  - [Validation](/docs/getting-started-guides/ubuntu/validation)
  - [Backups](/docs/getting-started-guides/ubuntu/backups)
  - [Upgrades](/docs/getting-started-guides/ubuntu/upgrades)
  - [Scaling](/docs/getting-started-guides/ubuntu/scaling)
  - [Logging](/docs/getting-started-guides/ubuntu/logging)
  - [Monitoring](/docs/getting-started-guides/ubuntu/monitoring)
  - [Networking](/docs/getting-started-guides/ubuntu/networking)
  - [Security](/docs/getting-started-guides/ubuntu/security)
  - [Storage](/docs/getting-started-guides/ubuntu/storage)
  - [Troubleshooting](/docs/getting-started-guides/ubuntu/troubleshooting)
  - [Decommissioning](/docs/getting-started-guides/ubuntu/decommissioning)
  - [Operational Considerations](/docs/getting-started-guides/ubuntu/operational-considerations)
  - [Glossary](/docs/getting-started-guides/ubuntu/glossary)

## Developer Guides

  - [Local development using LXD](/docs/getting-started-guides/ubuntu/local)

## Community Ubuntu Guides

- [Manual Installation](/docs/getting-started-guides/ubuntu/manual)
- [Calico Configuration](/docs/getting-started-guides/ubuntu/calico)

Please feel free to submit guides to this section. 

## Where to find us

We're normally following the following Slack channels: 

- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)

and we monitor the Kubernetes mailing lists. 
{% endcapture %}

{% include templates/concept.md %}
