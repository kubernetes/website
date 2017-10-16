Cloud Controller Manager
-------------------------

The Cloud Controller Manager (CCM) was originally created to allow cloud specific vendor code and kubernetes core to evolve independent of one another. The cloud controller manager runs alongside other master components such as Kube Controller Manager, Kube Apiserver, and Kube Scheduler.

Cloud Controller Manager's design is based on a plugin mechanism that allows new cloud providers to integrate with Kubernetes easily using plugins. There are distinct plans in place for on-boarding new cloud providers on Kubernetes, and for migrating new cloud provider from the old model to using the CCM model.

In this document, the concepts behind the components of cloud controller manager, and its associated functions will be discussed in detail. Here's the architecture of a Kubernetes cluster without the Cloud Controller Manager

![Pre CCM Kube Arch](https://i.imgur.com/LAmMku4.png)

Design
-------

In the architecture diagram of a Kubernetes cluster above, Kubernetes and the Cloud integrate from many different components. Namely

1. Kubelet
2. Kube Controller Manager
3. Kube ApiServer

The CCM consolidates all of these cloud dependent logic from the above 3 components to create a single point of integration with the cloud. The new architecture with CCM looks like this:

![CCM Kube Arch](https://i.imgur.com/iqiIFHY.png)

Components of CCM
------------------
The CCM breaks away some of the functionality of Kube Controller Manager (KCM) and runs it as a separate process. Specifically, it breaks away those controllers in KCM that are cloud dependent. The KCM has the following cloud dependent controller loops:

 1. Node Controller
 2. Volume Controller
 3. Route Controller
 4. Service Controller

The CCM currently (v1.8) runs the following controllers from the above list

1. Node Controller
2. Route Controller 
3. Service Controller

Additionally, it runs another controller called the PersistentVolumeLabels controller. This controller is responsible for setting the zone and region labels on PersistentVolumes created in GCE and AWS clouds. 

To summarize, the CCM runs the following 4 controllers:

1. Node Controller
2. Route Controller 
3. Service Controller
4. Persistent Volume Labels Controller

**Note:** Volume Controller was deliberately chosen to *NOT* be a part of CCM. Due to the complexity involved and due to the existing efforts to abstract away vendor specific volume logic, it was decided that Volume Controller will not be moved to CCM.   


Functions of CCM
------------------

CCM inherits its functions from cloud provided dependent components of Kubernetes. This section is structured based on the components from which CCM inherits its functions.

### 1. Kube Controller Manager

The majority of CCM's functions are derived from KCM. As mentioned in the previous section, CCM runs the following control loops

1. Node Controller
2. Route Controller 
3. Service Controller
4. Persistent Volume Labels Controller

#### Node Controller

The Node Controller is responsible for initializing a node by obtaining information about the nodes running in the cluster from the cloud provider. The node controller performs the following functions

1. Initialize a node with cloud specific zone/region labels
2. Initialize a node with cloud specific Instance details (type, size etc.)
3. Obtain the node's network addresses (IP addresses, hostname etc.)
4. In case a node becomes unresponsive, then it checks the cloud to see if the node has been deleted from the cloud. It proceeds to delete the node object from Kubernetes if the node was indeed deleted from the cloud.  

#### Route Controller

The Route Controller is responsible for configuring routes in GCE appropriately so that containers on different nodes in the Kubernetes cluster can communicate with each other. The route controller is only applicable for GCE clusters.

#### Service Controller

The Service Controller is responsible for listening to service create, update, and delete events. Based on the current state of the services in Kubernetes, it configures cloud load balancers (Such as ELB, or Google LB) to reflect the state of the services in Kubernetes. Additionally, it ensures that service backends for cloud load balancers are up-to-date.

#### Persistent Volume Labels Controller

The Persistent Volume Labels Controller applies labels on AWS EBS, and GCE PD volumes when they are created. This removes the need for users to manually set the labels on these volumes. 

These labels are essential for the scheduling of pods, as these volumes are constrained to work only within the region/zone that they are in, and therefore any pod using these volumes need to be scheduled in the same region/zone.

### 2. Kubelet

The Node Controller contains the cloud dependent functionality of Kubelet.

### 3. Kube APIServer

The Persistent Volume Labels controller moves the cloud dependent functionality of Kube APIServer to CCM. 

Plugin Mechanism
------------------

The Cloud Controller Manager uses Go interfaces to allow implementations from any cloud to be plugged in. Specifically, it uses the CloudProvider Interface defined [here](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go)

Any vendor that wants to plugin their cloud into Kubernetes only need to satisfy that interface. The implementation of the controllers and the scaffolding will be in core, but the implementation will exec out to the cloud interfaces, so long as the interface is satisfied. 

To find more information about developing plugins, refer [here](https://kubernetes.io/docs/tasks/administer-cluster/developing-cloud-controller-manager/)

Authorization
--------------

This section breaks down the access required on various API objects by CCM to perform its operations. 

#### Node Controller

The Node Controller only works with node objects. It requires full access to get, list, create, update, patch, watch, and delete node objects.

v1/Node: 
- Get
- List
- Create
- Update
- Patch
- Watch

#### Route Controller

The Route Controller listens to node object creation and configures routes appropriately. It requires get access to node objects. 

v1/Node: 
- List

#### Service Controller

The Service Controller listens to service create, update and delete events and then configures endpoints for those services appropriately. 

In order to access services it requires list, and watch access. In order to update services, it requires patch and update access. 

In order to setup endpoints for the services, it requires access to create, list, get, watch, and update.

v1/Service:
- List
- Watch
- Patch
- Update

#### Persistent Volume Labels Controller

Persistent Volume Labels Controller listens on PersistentVolume (PV) create events and then updates them. This controller requires access to list, watch, get and update PVs.

v1/PersistentVolume:
- Get
- List
- Watch
- Update

#### Others

The implementation of the core of CCM requires access to create events, and to ensure secure operation, it requires access to create ServiceAccounts.

v1/Event:
- Create
- Patch
- Update

v1/ServiceAccount:
- Create

The RBAC ClusterRole for CCM looks like

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: system:cloud-controller-manager
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

Vendor Implementations
-----------------------

The following cloud providers have implemented a CCM for their own clouds. 

1. [Digital Ocean]()
2. [Oracle]()
3. [Azure]()
4. [GCE]()
5. [AWS]()

Cluster Administration
-----------------------

Complete instructions for configuring and running CCM is provided [here](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
