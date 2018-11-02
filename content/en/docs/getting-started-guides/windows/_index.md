---
title: Using Windows Server Containers in Kubernetes
toc_hide: true
---

<!-- TOC -->

- [Application Developers](#application-developers)
    - [Deploying a stateless web application](#deploying-a-stateless-web-application)
        - [Manual scaling with replica sets](#manual-scaling-with-replica-sets)
        - [Handling secrets](#handling-secrets)
    - [Deploying a stateful application](#deploying-a-stateful-application)
        - [Creating a volume claim](#creating-a-volume-claim)
- [Cluster Operators](#cluster-operators)
    - [Building a cluster](#building-a-cluster)
        - [Overview](#overview)
        - [Components run on Windows](#components-run-on-windows)
        - [Deploying on Azure with ACS-Engine](#deploying-on-azure-with-acs-engine)
        - [Deploying on GCE](#deploying-on-gce)
        - [Deploying on OpenStack](#deploying-on-openstack)
        - [Deploying with Kubeadm](#deploying-with-kubeadm)
    - [Managing Windows Applications](#managing-windows-applications)
        - [Metrics](#metrics)
        - [Resource governance](#resource-governance)
        - [Horizontal pod autoscaling](#horizontal-pod-autoscaling)
        - [Daemon set](#daemon-set)
- [Feature Reference](#feature-reference)
    - [Windows Server Version Support](#windows-server-version-support)
        - [Containers and Windows versions](#containers-and-windows-versions)
    - [Alpha: Hyper-V Isolation](#alpha-hyper-v-isolation)
    - [Differences from Linux](#differences-from-linux)
        - [Security](#security)
        - [Networking](#networking)
        - [Storage](#storage)

<!-- /TOC -->


# Getting Started

## Application Developers

### Deploying a stateless web application

#### Manual scaling with replica sets

##### Health checks

Sample: stop web service to trigger restart

#### Handling secrets

Sample: database connection string

### Deploying a stateful application

#### Creating a volume claim

##### Using Azure Files - store a sqllite database for the web app

<!-- TODO: future PR - Using SMB/CIFS -->

## Cluster Operators

### Building a cluster

#### Overview

Diagram of typical Linux-only cluster

Diagram of hybrid cluster

#### Components run on Windows

#### Deploying on Azure with ACS-Engine

[ACS-Engine](../../setup/turnkey/azure.md) can be used to create a hybrid cluster with Windows and Linux worker nodes. For step by step instructions, see http://aks.ms/windowscontainers/kubernetes.

#### Deploying on GCE

See https://github.com/pjh/kubernetes/blob/windows-up/README-GCE-Windows-kube-up.md

#### Deploying on OpenStack

See [OpenStack](building-cluster.md#for-3-open-vswitch-ovs--open-virtual-network-ovn-with-overlay)

#### Deploying with Kubeadm

### Managing Windows Applications

#### Metrics

Sample: run web site, then run extra step to create CPU load

#### Resource governance

Apply a resource governance policy to above

#### Horizontal pod autoscaling

Scale based on CPU load for above

#### Daemon set


## Feature Reference

### Windows Server Version Support

As of v1.13, _Windows Server version 1803_ is stable. _Windows Server 2016_ and _Windows Server version 1709_ are deprecated and work with a reduced feature set. Code supporting them may be removed as early as v1.14. Since _Windows Server version 1803_ will reach [Microsoft end of support](https://support.microsoft.com/en-us/help/4316957) in November 2019, you may want to wait for _Windows Server 2019_ availability from Microsoft and support in Kubernetes for production workloads.

#### Containers and Windows versions

Windows Server containers are not automatically compatible between Windows Server versions. For more details, see [Windows Container Version Compatibility](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility) in the Microsoft docs.

Kubernetes nodes can run containers based on a previous OS version using [Hyper-V Isolation](#alpha-hyper-v-isolation). Read that section for more details.

### Alpha: Hyper-V Isolation

Sample - run a Windows Server 1709 based container

### Differences from Linux

#### Security

##### Username vs UID

##### Privileged

##### Other Linux-only features

#### Networking
      
##### HostNetwork
    
#### Storage

##### Mount types & filesystems

##### Mount permissions

##### Mount propagation

