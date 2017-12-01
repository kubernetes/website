---
title: Using Windows Server Containers in Kubernetes
---
**Note:** These instructions were recently updated based on Windows Server platform enhancements and the Kubernetes v1.9 release

Kubernetes version 1.5 introduced Alpha support for Windows Server Containers based on the Windows Server 2016 operating system. With the release of Windows Server version 1709 and using Kubernetes v1.9 users are able to deploy a Kubernetes cluster either on-premises or in a private/public cloud using a number of different network topologies and CNI plugins. Some key feature improvements for Windows Server Containers on Kubernetes include:
- Improved support for pods! Shared network namespace (compartment) with multiple Windows Server containers (shared kernel)
- Reduced network complexity by using a single network endpoint per pod
- Kernel-Based load-balancing using the Virtual Filtering Platform (VFP) Hyper-v Switch Extension (analogous to Linux iptables)
- Container Runtime Interface (CRI) pod and node level statistics
- Support for kubeadm commands to add Windows Server nodes to a Kubernetes environment

The Kubernetes control plane (API Server, Scheduler, Controller Manager, etc) continue to run on Linux, while the kubelet and kube-proxy can be run on Windows Server 2016 or later

**Note:** Windows Server Containers on Kubernetes is a Beta feature in Kubernetes v1.9

## Build
If you wish to build the code yourself, please refer to these [instructions](https://github.com/Microsoft/SDN/blob/master/Kubernetes/HOWTO-on-prem.md), otherwise the release binaries can be found at [https://github.com/kubernetes/kubernetes/releases](https://github.com/kubernetes/kubernetes/releases). 

## Prerequisites
In Kubernetes version 1.9 or later, Windows Server Containers for Kubernetes are supported using the following:

1. Kubernetes control plane running on existing Linux infrastructure (version 1.9 or later).
2. Kubenet network plugin setup on the Linux nodes.
3. Windows Server 2016 RTM or later. Windows Server version 1709 or later is preferred; unlocks key capabilities like shared network namespace
4. Docker Version 17.06.1-ee-2 or later for Windows Server nodes (Linux nodes and Kubernetes control plane can run any Kubernetes supported Docker Version).

## Networking
There are several supported network configurations with Kubernetes v1.9 on Windows, including both Layer-3 routed and overlay topologies using third-party network plugins.
 
1. [Upstream L3 Routing](#upstream-l3-routing-topology) - IP routes configured in upstream ToR
2. [Host-Gateway](#host-gateway-topology) - IP routes configured on each host
3. [Open vSwitch (OVS) & Open Virtual Network (OVN) with Overlay](#overlay-using-ovn-controller-and-ovs-switch-extension-topology) - OVS switch extension and OVN controller creates VXLAN overlay network
4. [Future Release] Overlay - VXLAN or IP-in-IP encapsulation using Flannel
5. [Future Release] Layer-3 Routing with BGP (Calico)

The selection of which network configuration and topology to deploy depends on the physical network topology and a user's ability to configure routes, performance concerns with encapsulation, and requirement to integrate with third-party network plugins.

## Future CNI Plugins
An additional two CNI plugins [win-l2bridge (host-gateway) and win-overlay (vxlan)] will be published in a future release. These two CNI plugins can either be used directly by WinCNI.exe or with Flannel

### Linux
The above networking approaches are already supported on Linux using a bridge interface, which essentially creates a private network local to the node. Similar to the Windows side, routes to all other pod CIDRs must be created in order to send packets via the "public" NIC.

### Windows
Windows supports the CNI network model and uses plugins to interface with the Windows Host Networking Service (HNS) to configure host networking and policy. An administrator creates a local host network using HNS PowerShell commands on each node as documented in the [Windows Host Setup](#windows-host-setup) section below.

#### Upstream L3 Routing Topology
In this topology, networking is achieved using L3 routing with static IP routes configured in an upstream Top of Rack (ToR) switch/router. Each cluster node is connected to the management network with a host IP. Additionally, each node uses a local 'l2bridge' network with a pod CIDR assigned. All pods on a given worker node will be connected to the pod CIDR subnet ('l2bridge' network). In order to enable network communication between pods running on different nodes, the upstream router has static routes configured with pod CIDR prefix => Host IP.

Each Window Server node should have the following configuration:

The following diagram illustrates the Windows Server networking setup for Kubernetes using Upstream L3 Routing Setup:
![K8s Cluster using L3 Routing with ToR](UpstreamRouting.png)

#### Host-Gateway Topology
This topology is similar to the Upstream L3 Routing topology with the only difference being that static IP routes are configured directly on each cluster node and not in the upstream ToR. Each node uses a local 'l2bridge' network with a pod CIDR assigned as before and has routing table entries for all other pod CIDR subnets assigned to the remote cluster nodes.

#### Overlay using OVN controller and OVS Switch Extension Topology
_Documentation is pending..._

## Setting up Windows Server Containers on Kubernetes
To run Windows Server Containers on Kubernetes, you'll need to set up both your host machines and the Kubernetes node components for Windows. Depending on your network topology, routes may need to be set up for pod communication on different nodes.

### Host Setup

#### Linux Host Setup

1. Linux hosts should be setup according to their respective distro documentation and the requirements of the Kubernetes version you will be using. 
2. Configure Linux Master node using steps [here](https://github.com/Microsoft/SDN/blob/master/Kubernetes/HOWTO-on-prem.md#prepare-the-master)
3. [Optional] CNI network plugin installed.

#### Windows Host Setup

1. Windows Server container host running the required Windows Server and Docker versions. Follow the setup instructions outlined by this help topic: https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/quick-start-windows-server.
2. Build or download kubelet.exe, kube-proxy.exe, and kubectl.exe using instructions found [here](https://github.com/Microsoft/SDN/blob/master/Kubernetes/HOWTO-on-prem.md#building-kubernetes)
3. Copy Node spec file (config) from Linux master node with X.509 keys
4. Create the HNS Network, ensure the correct CNI network config, and start kubelet.exe using this script [start-kubelet.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/start-kubelet.ps1)
5. Start kube-proxy using this script [start-kubeproxy.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/start-kubeproxy.ps1)
6. [Optional] Add static routes on Windows host

**Windows CNI Config Example**
Today, Windows CNI plugin is based on wincni.exe code with the following example, configuration file.

Note: this file assumes that a user previous created 'l2bridge' host networks on each Windows node using `<Verb>-HNSNetwork` cmdlets as shown in the `start-kubelet.ps1` and `start-kubeproxy.ps1` scripts linked above

```json
{
	"cniVersion": "0.2.0",
	"name": "l2bridge",
	"type": "wincni.exe",
	"master": "Ethernet",
	"ipam": {
		"environment": "azure",
		"subnet": "10.10.187.64/26",
		"routes": [{
			"GW": "10.10.187.66"
		}]
	},
	"dns": {
		"Nameservers": [
			"11.0.0.10"
		]
	},
	"AdditionalArgs": [{
			"Name": "EndpointPolicy",
			"Value": {
				"Type": "OutBoundNAT",
				"ExceptionList": [
					"11.0.0.0/8",
					"10.10.0.0/16",
					"10.127.132.128/25"
				]
			}
		},
		{
			"Name": "EndpointPolicy",
			"Value": {
				"Type": "ROUTE",
				"DestinationPrefix": "11.0.0.0/8",
				"NeedEncap": true
			}
		},
		{
			"Name": "EndpointPolicy",
			"Value": {
				"Type": "ROUTE",
				"DestinationPrefix": "10.127.132.213/32",
				"NeedEncap": true
			}
		}
	]
}
```

## Starting the Cluster
To start your cluster, you'll need to start both the Linux-based Kubernetes control plane, and the Windows Server-based Kubernetes node components (kubelet and kube-proxy). 

## Starting the Linux-based Control Plane
Use your preferred method to setup and start Kubernetes cluster on Linux or follow the directions given in this [link](https://github.com/Microsoft/SDN/blob/master/Kubernetes/HOWTO-on-prem.md). Please note that Cluster CIDR might need to be updated.

## Scheduling Pods on Windows
Because your cluster has both Linux and Windows nodes, you must explicitly set the nodeSelector constraint to be able to schedule pods to Windows nodes. You must set nodeSelector with the label beta.kubernetes.io/os to the value windows; see the following example:

```yaml
{
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
    "name": "iis",
    "labels": {
      "name": "iis"
    }
  },
  "spec": {
    "containers": [
      {
        "name": "iis",
        "image": "microsoft/iis",
        "ports": [
          {
            "containerPort": 80
          }
        ]
      }
    ],
    "nodeSelector": {
      "beta.kubernetes.io/os": "windows"
    }
  }
}
```
## Support for kubeadm join

If your cluster has been created by [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/), 
and your networking is setup correctly using one of the methods listed above (networking is setup outside of kubeadm), you can use kubeadm to add a Windows node to your cluster.

The kubeadm binary can be found at [Kubernetes Releases](https://github.com/kubernetes/kubernetes/releases), inside the node binaries archive.  Adding a Windows node
is not any different than adding a Linux node:

`kubeadm.exe join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>`

See [joining-your-nodes](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#44-joining-your-nodes) for more details.

## Supported Features

### Secrets and ConfigMaps
Secrets and ConfigMaps can be utilized in Windows Server Containers, but must be used as environment variables. See limitations section below for additional details.

**Examples:**

 Windows pod with secrets mapped to environment variables
 ```yaml
 apiVersion: v1
    kind: Secret
    metadata:
      name: mysecret
    type: Opaque
    data:
      username: YWRtaW4=
      password: MWYyZDFlMmU2N2Rm
    
    ---
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: mypod-secret
    spec:
      containers:
      - name: mypod-secret
        image: redis:3.0-nanoserver
        env:
          - name: USERNAME
            valueFrom:
              secretKeyRef:
                name: mysecret
                key: username
          - name: PASSWORD
            valueFrom:
              secretKeyRef:
                name: mysecret
                key: password
      nodeSelector:
        beta.kubernetes.io/os: windows
```
 
 Windows pod with configMap values mapped to environment variables

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: example-config
data:
  example.property.1: hello
  example.property.2: world

---

apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
  - name: configmap-redis
    image: redis:3.0-nanoserver
    env:
      - name: EXAMPLE_PROPERTY_1
        valueFrom:
          configMapKeyRef:
            name: example-config
            key: example.property.1
      - name: EXAMPLE_PROPERTY_2
        valueFrom:
          configMapKeyRef:
            name: example-config
            key: example.property.2
  nodeSelector:
    beta.kubernetes.io/os: windows
```
 
### Volumes
Some supported Volume Mounts are local, emptyDir, hostPath.  One thing to remember is that paths must either be escaped, or use forward slashes, for example `mountPath: "C:\\etc\\foo"` or `mountPath: "C:/etc/foo"`.

Persistent Volume Claims are supported for supported volume types.

**Examples:**
 
 Windows pod with a hostPath volume
 ```yaml
 apiVersion: v1
 kind: Pod
 metadata:
   name: hostpath-volume-pod
 spec:
   containers:
   - name: hostpath-redis
     image: redis:3.0-nanoserver
     volumeMounts:
     - name: blah
       mountPath: "C:\\etc\\foo"
       readOnly: true
   nodeSelector:
     beta.kubernetes.io/os: windows
   volumes:
   - name: blah
     hostPath:
       path: "C:\\etc\\foo"
 ```
 
 Windows pod with multiple emptyDir volumes
 
 ```yaml
 apiVersion: v1
 kind: Pod
 metadata:
   name: empty-dir-pod
 spec:
   containers:
   - image: redis:3.0-nanoserver
     name: empty-dir-redis
     volumeMounts:
     - mountPath: /cache
       name: cache-volume
     - mountPath: C:/scratch
       name: scratch-volume
   volumes:
   - name: cache-volume
     emptyDir: {}
   - name: scratch-volume
     emptyDir: {}
   nodeSelector:
     beta.kubernetes.io/os: windows
 ```
 
### Metrics

Windows Stats use a hybrid model: pod and container level stats come from CRI (via dockershim), while node level stats come from the "winstats" package that exports cadvisor like datastructures using windows specific perf counters from the node.

## Known Limitations for Windows Server Containers with v1.9
Some of these limitations will be addressed by the community in future releases of Kubernetes
- Shared network namespace (compartment) with multiple Windows Server containers (shared kernel) per pod is only supported on Windows Server 1709 or later
- Using Secrets and ConfigMaps as volume mounts is not supported 
- The StatefulSet functionality for stateful applications is not supported
- Horizontal Pod Autoscaling for Windows Server Container pods has not been verified to work end-to-end
- Hyper-V Containers are not supported
