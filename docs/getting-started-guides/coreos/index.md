---
title: CoreOS on AWS or GCE
---

* TOC
{:toc}

There are multiple guides on running Kubernetes with [CoreOS](https://coreos.com/kubernetes/docs/latest/):

### Official CoreOS Guides

These guides are maintained by CoreOS and deploy Kubernetes the "CoreOS Way" with full TLS, the DNS add-on, and more. These guides pass Kubernetes conformance testing and we encourage you to [test this yourself](https://coreos.com/kubernetes/docs/latest/conformance-tests.html).

[**AWS Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)

Guide and CLI tool for setting up a multi-node cluster on AWS. CloudFormation is used to set up a master and multiple workers in auto-scaling groups.

<hr/>

[**Bare Metal Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-baremetal.html#automated-provisioning)

Guide and HTTP/API service for PXE booting and provisioning a multi-node cluster on bare metal. [Ignition](https://coreos.com/ignition/docs/latest/) is used to provision a master and multiple workers on the first boot from disk.

[**Vagrant Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)

Guide to setting up a multi-node cluster on Vagrant. The deployer can independently configure the number of etcd nodes, master nodes, and worker nodes to bring up a fully HA control plane.

<hr/>

[**Vagrant Single-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant-single.html)

The quickest way to set up a Kubernetes development environment locally. As easy as `git clone`, `vagrant up` and configuring `kubectl`.

<hr/>

[**Full Step by Step Guide**](https://coreos.com/kubernetes/docs/latest/getting-started.html)

A generic guide to setting up an HA cluster on any cloud or bare metal, with full TLS. Repeat the master or worker steps to configure more machines of that role.

### Community Guides

These guides are maintained by community members, cover specific platforms and use cases, and experiment with different ways of configuring Kubernetes on CoreOS.

[**Easy Multi-node Cluster on Google Compute Engine**](https://github.com/rimusz/coreos-multi-node-k8s-gce/blob/master/README.md)

Scripted installation of a single master, multi-worker cluster on GCE. Kubernetes components are managed by [fleet](https://github.com/coreos/fleet).

<hr/>

[**Multi-node cluster using cloud-config and Weave on Vagrant**](https://github.com/errordeveloper/weave-demos/blob/master/poseidon/README.md)

Configure a Vagrant-based cluster of 3 machines with networking provided by Weave.

<hr/>

[**Multi-node cluster using cloud-config and Vagrant**](https://github.com/pires/kubernetes-vagrant-coreos-cluster/blob/master/README.md)

Configure a single master, multi-worker cluster locally, running on your choice of hypervisor: VirtualBox, Parallels, or VMware

<hr/>

[**Single-node cluster using a small OS X App**](https://github.com/rimusz/kube-solo-osx/blob/master/README.md)

Guide to running a solo cluster (master + worker) controlled by an OS X menubar application. Uses xhyve + CoreOS under the hood.

<hr/>

[**Multi-node cluster with Vagrant and fleet units using a small OS X App**](https://github.com/rimusz/coreos-osx-gui-kubernetes-cluster/blob/master/README.md)

Guide to running a single master, multi-worker cluster controlled by an OS X menubar application. Uses Vagrant under the hood.

<hr/>

[**Multi-node cluster using cloud-config, CoreOS and VMware ESXi**](https://github.com/xavierbaude/VMware-coreos-multi-nodes-Kubernetes)

Configure a single master, single worker cluster on VMware ESXi.

<hr/>

[**Single/Multi-node cluster using cloud-config, CoreOS and Foreman**](https://github.com/johscheuer/theforeman-coreos-kubernetes)

Configure a standalone Kubernetes or a Kubernetes cluster with [Foreman](https://theforeman.org).

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
