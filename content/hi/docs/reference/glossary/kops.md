---
title: kOps (Kubernetes Operations)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps will not only help you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes cluster, but it will also provision the necessary cloud infrastructure.

aka: 
tags:
- tool
- operation
---

`kOps` will not only help you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes cluster, but it will also provision the necessary cloud infrastructure.

<!--more--> 

{{< note >}}
AWS (Amazon Web Services) is currently officially supported, with DigitalOcean, GCE and OpenStack in beta support, and Azure in alpha.
{{< /note >}}

`kOps` is an automated provisioning system:
  * Fully automated installation
  * Uses DNS to identify clusters
  * Self-healing: everything runs in Auto-Scaling Groups
  * Multiple OS support (Amazon Linux, Debian, Flatcar, RHEL, Rocky and Ubuntu)
  * High-Availability support
  * Can directly provision, or generate terraform manifests
