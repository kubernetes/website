---
title: Concepts Underlying the Cloud Controller Manager
---

## Cloud Controller Manager

The cloud controller manager (CCM) concept (not to be confused with the binary) was originally created to allow cloud specific vendor code and the Kubernetes core to evolve independent of one another. The cloud controller manager runs alongside other master components such as the Kubernetes controller manager, the API server, and scheduler. It can also be started as a Kubernetes addon, in which case it runs on top of Kubernetes.

The cloud controller manager's design is based on a plugin mechanism that allows new cloud providers to integrate with Kubernetes easily by using plugins. There are plans in place for on-boarding new cloud providers on Kubernetes and for migrating cloud providers from the old model to the new CCM model.

This document discusses the concepts behind the cloud controller manager and gives details about its associated functions.

Here's the architecture of a Kubernetes cluster without the cloud controller manager:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

## Design

In the preceding diagram, Kubernetes and the cloud provider are integrated through several different components:

* Kubelet
* Kubernetes controller manager
* Kubernetes API server

The CCM consolidates all of the cloud-dependent logic from the preceding three components to create a single point of integration with the cloud. The new architecture with the CCM looks like this:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Components of the CCM

The CCM breaks away some of the functionality of Kubernetes controller manager (KCM) and runs it as a separate process. Specifically, it breaks away those controllers in the KCM that are cloud dependent. The KCM has the following cloud dependent controller loops:

 * Node controller
 * Volume controller
 * Route controller
 * Service controller

In version 1.9, the CCM runs the following controllers from the preceding list:

* Node controller
* Route controller 
* Service controller

Additionally, it runs another controller called the PersistentVolumeLabels controller. This controller is responsible for setting the zone and region labels on PersistentVolumes created in GCP and AWS clouds. 

**Note:** Volume controller was deliberately chosen to not be a part of CCM. Due to the complexity involved and due to the existing efforts to abstract away vendor specific volume logic, it was decided that volume controller will not be moved to CCM. 
{: .note}

The original plan to support volumes using CCM was to use Flex volumes to support pluggable volumes. However, a competing effort known as CSI is being planned to replace Flex. 

Considering these dynamics, we decided to have an intermediate stop gap measure until CSI becomes ready.

## Functions of the CCM

The CCM inherits its functions from components of Kubernetes that are dependent on a cloud provider. This section is structured based on those components.

### 1. Kubernetes controller manager

The majority of the CCM's functions are derived from the KCM. As mentioned in the previous section, the CCM runs the following control loops:

* Node controller
* Route controller 
* Service controller
* PersistentVolumeLabels controller

#### Node controller

The Node controller is responsible for initializing a node by obtaining information about the nodes running in the cluster from the cloud provider. The node controller performs the following functions:

1. Initialize a node with cloud specific zone/region labels.
2. Initialize a node with cloud specific instance details, for example, type and size.
3. Obtain the node's network addresses and hostname.
4. In case a node becomes unresponsive, check the cloud to see if the node has been deleted from the cloud.
If the node has been deleted from the cloud, delete the Kubernetes Node object.

#### Route controller

The Route controller is responsible for configuring routes in the cloud appropriately so that containers on different nodes in the Kubernetes cluster can communicate with each other. The route controller is only applicable for Google Compute Engine clusters.

#### Service Controller

The Service controller is responsible for listening to service create, update, and delete events. Based on the current state of the services in Kubernetes, it configures cloud load balancers (such as ELB or Google LB) to reflect the state of the services in Kubernetes. Additionally, it ensures that service backends for cloud load balancers are up to date.

#### PersistentVolumeLabels controller

The PersistentVolumeLabels controller applies labels on AWS EBS/GCE PD volumes when they are created. This removes the need for users to manually set the labels on these volumes. 

These labels are essential for the scheduling of pods as these volumes are constrained to work only within the region/zone that they are in. Any Pod using these volumes needs to be scheduled in the same region/zone.

The PersistentVolumeLabels controller was created specifically for the CCM; that is, it did not exist before the CCM was created. This was done to move the PV labelling logic in the Kubernetes API server (it was an admission controller) to the CCM. It does not run on the KCM.

### 2. Kubelet

The Node controller contains the cloud-dependent functionality of the kubelet. Prior to the introduction of the CCM, the kubelet was responsible for initializing a node with cloud-specific details such as IP addresses, region/zone labels and instance type information. The introduction of the CCM has moved this initialization operation from the kubelet into the CCM. 

In this new model, the kubelet initializes a node without cloud-specific information. However, it adds a taint to the newly created node that makes the node unschedulable until the CCM initializes the node with cloud-specific information. It then removes this taint.

### 3. Kubernetes API server

The PersistentVolumeLabels controller moves the cloud-dependent functionality of the Kubernetes API server to the CCM as described in the preceding sections.

## Plugin mechanism

The cloud controller manager uses Go interfaces to allow implementations from any cloud to be plugged in. Specifically, it uses the CloudProvider Interface defined [here](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go).

The implementation of the four shared controllers highlighted above, and some scaffolding along with the shared cloudprovider interface, will stay in the Kubernetes core. Implementations specific to cloud providers will be built outside of the core and implement interfaces defined in the core.

For more information about developing plugins, see [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Authorization

This section breaks down the access required on various API objects by the CCM to perform its operations. 

### Node Controller

The Node controller only works with Node objects. It requires full access to get, list, create, update, patch, watch, and delete Node objects.

v1/Node: 
- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

The route controller listens to Node object creation and configures routes appropriately. It requires get access to Node objects. 

v1/Node: 
- Get

### Service controller

The service controller listens to Service object create, update and delete events and then configures endpoints for those Services appropriately. 

To access Services, it requires list, and watch access. To update Services, it requires patch and update access. 

To set up endpoints for the Services, it requires access to create, list, get, watch, and update.

v1/Service:
- List
- Get
- Watch
- Patch
- Update

### PersistentVolumeLabels controller

The PersistentVolumeLabels controller listens on PersistentVolume (PV) create events and then updates them. This controller requires access to get and update PVs.

v1/PersistentVolume:
- Get
- List
- Watch
- Update

### Others

The implementation of the core of CCM requires access to create events, and to ensure secure operation, it requires access to create ServiceAccounts.

v1/Event:
- Create
- Patch
- Update

v1/ServiceAccount:
- Create

The RBAC ClusterRole for the CCM looks like this:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## Vendor Implementations

The following cloud providers have implemented CCMs: 

* Digital Ocean
* Oracle
* Azure
* GCE
* AWS

## Cluster Administration

Complete instructions for configuring and running the CCM are provided
[here](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).
