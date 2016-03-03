---
---

Kubernetes can run on a range of platforms, from your laptop, to VMs on a cloud provider, to rack of
bare metal servers.  The effort required to set up a cluster varies from running a single command to
crafting your own customized cluster.  We'll guide you in picking a solution that fits for your needs.

If you just want to "kick the tires" on Kubernetes, we recommend the [local Docker-based](/docs/getting-started-guides/docker) solution.

The local Docker-based solution is one of several [Local cluster](#local-machine-solutions) solutions
that are quick to set up, but are limited to running on one machine.

When you are ready to scale up to more machines and higher availability, a [Hosted](#hosted-solutions)
solution is the easiest to create and maintain.

[Turn-key cloud solutions](#turn-key-cloud-solutions) require only a few commands to create
and cover a wider range of cloud providers.

[Custom solutions](#custom-solutions) require more effort to setup but cover and even
they vary from step-by-step instructions to general advice for setting up
a Kubernetes cluster from scratch.

* TOC
{:toc}

### Local-machine Solutions

Local-machine solutions create a single cluster with one or more Kubernetes nodes on a single
physical machine.  Setup is completely automated and doesn't require a cloud provider account.
But their size and availability is limited to that of a single machine.

The local-machine solutions are:

- [Local Docker-based](/docs/getting-started-guides/docker) (recommended starting point)
- [Vagrant](/docs/getting-started-guides/vagrant) (works on any platform with Vagrant: Linux, MacOS, or Windows.)
- [No-VM local cluster](/docs/getting-started-guides/locally) (Linux only)


### Hosted Solutions

[Google Container Engine](https://cloud.google.com/container-engine) offers managed Kubernetes
clusters.

### Turn-key Cloud Solutions

These solutions allow you to create Kubernetes clusters on a range of Cloud IaaS providers with only a
few commands, and have active community support.

- [GCE](/docs/getting-started-guides/gce)
- [AWS](/docs/getting-started-guides/aws)
- [Azure](/docs/getting-started-guides/coreos/azure/)

### Custom Solutions

Kubernetes can run on a wide range of Cloud providers and bare-metal environments, and with many
base operating systems.

If you can find a guide below that matches your needs, use it.  It may be a little out of date, but
it will be easier than starting from scratch.  If you do want to start from scratch because you
have special requirements or just because you want to understand what is underneath a Kubernetes
cluster, try the [Getting Started from Scratch](/docs/getting-started-guides/scratch) guide.

If you are interested in supporting Kubernetes on a new platform, check out our [advice for
writing a new solution](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/writing-a-getting-started-guide.md).

#### Cloud

These solutions are combinations of cloud provider and OS not covered by the above solutions.

- [AWS + coreos](/docs/getting-started-guides/coreos)
- [GCE + CoreOS](/docs/getting-started-guides/coreos)
- [AWS + Ubuntu](/docs/getting-started-guides/juju)
- [Joyent + Ubuntu](/docs/getting-started-guides/juju)
- [Rackspace + CoreOS](/docs/getting-started-guides/rackspace)

#### On-Premises VMs

- [Vagrant](/docs/getting-started-guides/coreos) (uses CoreOS and flannel)
- [CloudStack](/docs/getting-started-guides/cloudstack) (uses Ansible, CoreOS and flannel)
- [Vmware](/docs/getting-started-guides/vsphere)  (uses Debian)
- [juju.md](/docs/getting-started-guides/juju) (uses Juju, Ubuntu and flannel)
- [Vmware](/docs/getting-started-guides/coreos)  (uses CoreOS and flannel)
- [libvirt-coreos.md](/docs/getting-started-guides/libvirt-coreos)  (uses CoreOS)
- [oVirt](/docs/getting-started-guides/ovirt)
- [libvirt](/docs/getting-started-guides/fedora/flannel_multi_node_cluster) (uses Fedora and flannel)
- [KVM](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)  (uses Fedora and flannel)

#### Bare Metal

- [Offline](/docs/getting-started-guides/coreos/bare_metal_offline) (no internet required.  Uses CoreOS and Flannel)
- [fedora/fedora_ansible_config.md](/docs/getting-started-guides/fedora/fedora_ansible_config)
- [Fedora single node](/docs/getting-started-guides/fedora/fedora_manual_config)
- [Fedora multi node](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)
- [Centos](/docs/getting-started-guides/centos/centos_manual_config)
- [Ubuntu](/docs/getting-started-guides/ubuntu)
- [Docker Multi Node](/docs/getting-started-guides/docker-multinode)

#### Integrations

These solutions provide integration with 3rd party schedulers, resource managers, and/or lower level platforms.

- [Kubernetes on Mesos](/docs/getting-started-guides/mesos)
  - Instructions specify GCE, but are generic enough to be adapted to most existing Mesos clusters
- [Kubernetes on DCOS](/docs/getting-started-guides/dcos)
  - Community Edition DCOS uses AWS
  - Enterprise Edition DCOS supports cloud hosting, on-premise VMs, and bare metal

## Table of Solutions

Here are all the solutions mentioned above in table form.

IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GKE                  |              |        | GCE         | [docs](https://cloud.google.com/container-engine) | ['œ“][3]   | Commercial
Vagrant              | Saltstack    | Fedora | flannel     | [docs](/docs/getting-started-guides/vagrant)                                | ['œ“][2]   | Project
GCE                  | Saltstack    | Debian | GCE         | [docs](/docs/getting-started-guides/gce)                                    | ['œ“][1]   | Project
Azure                | CoreOS       | CoreOS | Weave       | [docs](/docs/getting-started-guides/coreos/azure/)                    |          | Community ([@errordeveloper](https://github.com/errordeveloper), [@squillace](https://github.com/squillace), [@chanezon](https://github.com/chanezon), [@crossorigin](https://github.com/crossorigin))
Docker Single Node   | custom       | N/A    | local       | [docs](/docs/getting-started-guides/docker)                                 |          | Project ([@brendandburns](https://github.com/brendandburns))
Docker Multi Node    | Flannel      | N/A    | local       | [docs](/docs/getting-started-guides/docker-multinode)                       |          | Project ([@brendandburns](https://github.com/brendandburns))
Bare-metal           | Ansible      | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_ansible_config)           |          | Project
Digital Ocean        | custom       | Fedora | Calico      | [docs](/docs/getting-started-guides/fedora/fedora-calico)                   |          | Community (@djosborne)
Bare-metal           | custom       | Fedora | _none_      | [docs](/docs/getting-started-guides/fedora/fedora_manual_config)            |          | Project
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
Mesos/Docker         | custom       | Ubuntu | Docker      | [docs](/docs/getting-started-guides/mesos-docker)                           |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
Mesos/GCE            |              |        |             | [docs](/docs/getting-started-guides/mesos)                                  |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
DCOS                 | Marathon   | CoreOS/Alpine | custom | [docs](/docs/getting-started-guides/dcos)                                   |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
AWS                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community
GCE                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))
Bare-metal (Offline) | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/bare_metal_offline)              |          | Community ([@jeffbean](https://github.com/jeffbean))
Bare-metal           | CoreOS       | CoreOS | Calico      | [docs](/docs/getting-started-guides/coreos/bare_metal_calico)               |          | Community ([@caseydavenport](https://github.com/caseydavenport))
CloudStack           | Ansible      | CoreOS | flannel     | [docs](/docs/getting-started-guides/cloudstack)                             |          | Community ([@runseb](https://github.com/runseb))
Vmware               |              | Debian | OVS         | [docs](/docs/getting-started-guides/vsphere)                                |          | Community ([@pietern](https://github.com/pietern))
Bare-metal           | custom       | CentOS | _none_      | [docs](/docs/getting-started-guides/centos/centos_manual_config)            |          | Community ([@coolsvap](https://github.com/coolsvap))
AWS                  | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/whitmo/bundle-kubernetes) ( [@whit](https://github.com/whitmo), [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
OpenStack/HPCloud    | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/whitmo/bundle-kubernetes) ( [@whit](https://github.com/whitmo), [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
Joyent               | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/whitmo/bundle-kubernetes) ( [@whit](https://github.com/whitmo), [@matt](https://github.com/mbruzek), [@chuck](https://github.com/chuckbutler) )
AWS                  | Saltstack    | Ubuntu | OVS         | [docs](/docs/getting-started-guides/aws)                                    |          | Community ([@justinsb](https://github.com/justinsb))
Bare-metal           | custom       | Ubuntu | Calico      | [docs](/docs/getting-started-guides/ubuntu-calico)                          |          | Community ([@djosborne](https://github.com/djosborne))
Bare-metal           | custom       | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                 |          | Community ([@resouer](https://github.com/resouer), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
Local                |              |        | _none_      | [docs](/docs/getting-started-guides/locally)                                |          | Community ([@preillyme](https://github.com/preillyme))
libvirt/KVM          | CoreOS       | CoreOS | libvirt/KVM | [docs](/docs/getting-started-guides/libvirt-coreos)                         |          | Community ([@lhuard1A](https://github.com/lhuard1A))
oVirt                |              |        |             | [docs](/docs/getting-started-guides/ovirt)                                  |          | Community ([@simon3z](https://github.com/simon3z))
Rackspace            | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/rackspace)                              |          | Community ([@doublerr](https://github.com/doublerr))
any                  | any          | any    | any         | [docs](/docs/getting-started-guides/scratch)                                |          | Community ([@erictune](https://github.com/erictune))


*Note*: The above table is ordered by version test/used in notes followed by support level.

Definition of columns:

- **IaaS Provider** is who/what provides the virtual or physical machines (nodes) that Kubernetes runs on.
- **OS** is the base operating system of the nodes.
- **Config. Mgmt** is the configuration management system that helps install and maintain Kubernetes software on the
  nodes.
- **Networking** is what implements the [networking model](/docs/admin/networking).  Those with networking type
  _none_ may not support more than one node, or may support multiple VM nodes only in the same physical node.
- **Conformance** indicates whether a cluster created with this configuration has passed the project's conformance
  tests for supporting the API and base features of Kubernetes v1.0.0.
- Support Levels
  - **Project**:  Kubernetes Committers regularly use this configuration, so it usually works with the latest release
    of Kubernetes.
  - **Commercial**: A commercial offering with its own support arrangements.
  - **Community**: Actively supported by community contributions. May not work with more recent releases of Kubernetes.
  - **Inactive**: No active maintainer.  Not recommended for first-time Kubernetes users, and may be deleted soon.
- **Notes** is relevant information such as the version of Kubernetes used.


<!-- reference style links below here -->
<!-- GCE conformance test result -->
[1]: https://gist.github.com/erictune/4cabc010906afbcc5061
<!-- Vagrant conformance test result -->
[2]: https://gist.github.com/derekwaynecarr/505e56036cdf010bf6b6
<!-- GKE conformance test result -->
[3]: https://gist.github.com/erictune/2f39b22f72565365e59b
