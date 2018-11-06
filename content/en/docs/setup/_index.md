---
reviewers:
- brendandburns
- erictune
- mikedanese
no_issue: true
title: Setup
main_menu: true
weight: 30
content_template: templates/concept
---

{{% capture overview %}}

Use this page to find the type of solution that best fits your needs.

Deciding where to run Kubernetes depends on what resources you have available 
and how much flexibility you need. You can run Kubernetes almost anywhere, 
from your laptop to VMs on a cloud provider to a rack of bare metal servers. 
You can also set up a fully-managed cluster by running a single command or craft 
your own customized cluster on your bare metal servers.

{{% /capture %}}

{{% capture body %}}

## Local-machine Solutions

A local-machine solution is an easy way to get started with Kubernetes. You
can create and test Kubernetes clusters without worrying about consuming cloud
resources and quotas.

You should pick a local solution if you want to:

* Try or start learning about Kubernetes
* Develop and test clusters locally

Pick a [local-machine solution](/docs/setup/pick-right-solution/#local-machine-solutions).

## Hosted Solutions

Hosted solutions are a convenient way to create and maintain Kubernetes clusters. They 
manage and operate your clusters so you don’t have to.  

You should pick a hosted solution if you:

* Want a fully-managed solution
* Want to focus on developing your apps or services  
* Don’t have dedicated site reliability engineering (SRE) team but want high availability
* Don't have resources to host and monitor your clusters 

Pick a [hosted solution](/docs/setup/pick-right-solution/#hosted-solutions).

## Turnkey – Cloud Solutions


These solutions allow you to create Kubernetes clusters with only a few commands and 
are actively developed and have active community support. They can also be hosted on 
a range of Cloud IaaS providers, but they offer more freedom and flexibility in 
exchange for effort. 

You should pick a turnkey cloud solution if you:

* Want more control over your clusters than the hosted solutions allow
* Want to take on more operations ownership 

Pick a [turnkey cloud solution](/docs/setup/pick-right-solution/#turnkey-cloud-solutions)

## Turnkey – On-Premises Solutions

These solutions allow you to create Kubernetes clusters on your internal, secure,
cloud network with only a few commands.

You should pick a on-prem turnkey cloud solution if you:

* Want to deploy clusters on your private cloud network
* Have a dedicated SRE team
* Have the resources to host and monitor your clusters

Pick an [on-prem turnkey cloud solution](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions).

## Custom Solutions

Custom solutions give you the most freedom over your clusters but require the 
most expertise. These solutions range from bare-metal to cloud providers on 
different operating systems.

Pick a [custom solution](/docs/setup/pick-right-solution/#custom-solutions).

{{% /capture %}}

{{% capture whatsnext %}}
Go to [Picking the Right Solution](/docs/setup/pick-right-solution/) for a complete
list of solutions.
{{% /capture %}}
