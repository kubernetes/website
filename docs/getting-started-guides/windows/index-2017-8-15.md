---
title: Windows Server Containers
---

Kubernetes version 1.5 introduces support for Windows Server Containers. In version 1.5, the Kubernetes control plane (API Server, Scheduler, Controller Manager, etc) continue to run on Linux, while the kubelet and kube-proxy can be run on Windows Server.

**Note:** Windows Server Containers on Kubernetes is an Alpha feature in Kubernetes 1.5.

## Prerequisites
In Kubernetes version 1.5, Windows Server Containers for Kubernetes is supported using the following:

1. Kubernetes control plane running on existing Linux infrastructure (version 1.5 or later)
2. Kubenet network plugin setup on the Linux nodes
3. Windows Server 2016 (RTM version 10.0.14393 or later)
4. Docker Version 1.12.2-cs2-ws-beta or later for Windows Server nodes (Linux nodes and Kubernetes control plane can run any Kubernetes supported Docker Version)

## Networking
Network is achieved using L3 routing. Because third-party networking plugins (e.g. flannel, calico, etc) don't natively work on Windows Server, existing technology that is built into the Windows and Linux operating systems is relied on. In this L3 networking approach, a /16 subnet is chosen for the cluster nodes, and a /24 subnet is assigned to each worker node. All pods on a given worker node will be connected to the /24 subnet. This allows pods on the same node to communicate with each other. In order to enable networking between pods running on different nodes, routing features that are built into Windows Server 2016 and Linux are used.

### Linux
The above networking approach is already supported on Linux using a bridge interface, which essentially creates a private network local to the node. Similar to the Windows side, routes to all other pod CIDRs must be created in order to send packets via the "public" NIC.

### Windows
Each Window Server node should have the following configuration:

1. Two NICs (virtual networking adapters) are required on each Windows Server node - The two Windows container networking modes of interest (transparent and L2 bridge) use an external Hyper-V virtual switch. This means that one of the NICs is entirely allocated to the bridge, creating the need for the second NIC.
2. Transparent container network created - This is a manual configuration step and is shown in **_Route Setup_** section below
3. RRAS (Routing) Windows feature enabled - Allows routing between NICs on the box, and also "captures" packets that have the destination IP of a POD running on the node. To enable, open "Server Manager". Click on "Roles", "Add Roles". Click "Next". Select "Network Policy and Access Services". Click on "Routing and Remote Access Service" and the underlying checkboxes
4. Routes defined pointing to the other pod CIDRs via the "public" NIC - These routes are added to the built-in routing table as shown in **_Route Setup_** section below

The following diagram illustrates the Windows Server networking setup for Kubernetes Setup
![Windows Setup](windows-setup.png)

## Setting up Windows Server Containers on Kubernetes
To run Windows Server Containers on Kubernetes, you'll need to set up both your host machines and the Kubernetes node components for Windows and setup Routes for Pod communication on different nodes
### Host Setup
**Windows Host Setup**

1. Windows Server container host running Windows Server 2016 and Docker v1.12. Follow the setup instructions outlined by this blog post: https://msdn.microsoft.com/en-us/virtualization/windowscontainers/quick_start/quick_start_windows_server
2. DNS support for Windows recently got merged to docker master and is currently not supported in a stable docker release. To use DNS build docker from master or download the binary from [Docker master](https://master.dockerproject.org/)
3. Pull the `apprenda/pause` image from `https://hub.docker.com/r/apprenda/pause` 
4. RRAS (Routing) Windows feature enabled
5. Install a VMSwitch of type `Internal`, by running `New-VMSwitch -Name KubeProxySwitch -SwitchType Internal` command in *PowerShell* window. This will create a new Network Interface with name `vEthernet (KubeProxySwitch)`. This interface will be used by kube-proxy to add Service IPs.

**Linux Host Setup**

1. Linux hosts should be setup according to their respective distro documentation and the requirements of the Kubernetes version you will be using. 
2. CNI network plugin installed.

### Component Setup

Requirements

* Git
* Go 1.7.1+
* make (if using Linux or MacOS)
* Important notes and other dependencies are listed [here](https://git.k8s.io/community/contributors/devel/development.md#building-kubernetes-on-a-local-osshell-environment)

**kubelet**

To build the *kubelet*, run:

1. `cd $GOPATH/src/k8s.io/kubernetes`
2. Build *kubelet*
   1. Linux/MacOS: `KUBE_BUILD_PLATFORMS=windows/amd64 make WHAT=cmd/kubelet`
   2. Windows: `go build cmd/kubelet/kubelet.go`

**kube-proxy**

To build *kube-proxy*, run:

1. `cd $GOPATH/src/k8s.io/kubernetes`
2. Build *kube-proxy*
   1. Linux/MacOS: `KUBE_BUILD_PLATFORMS=windows/amd64 make WHAT=cmd/kube-proxy`
   2. Windows: `go build cmd/kube-proxy/proxy.go`

### Route Setup
The below example setup assumes one Linux and two Windows Server 2016 nodes and a cluster CIDR 192.168.0.0/16

| Hostname | Routable IP address | Pod CIDR |
| --- | --- | --- |
| Lin01 | `<IP of Lin01 host>` | 192.168.0.0/24 |
| Win01 | `<IP of Win01 host>` | 192.168.1.0/24 |
| Win02 | `<IP of Win02 host>` | 192.168.2.0/24 |

**Lin01**

```
ip route add 192.168.1.0/24 via <IP of Win01 host>
ip route add 192.168.2.0/24 via <IP of Win02 host>
```

**Win01**

```
docker network create -d transparent --gateway 192.168.1.1 --subnet 192.168.1.0/24 <network name>
# A bridge is created with Adapter name "vEthernet (HNSTransparent)". Set its IP address to transparent network gateway
netsh interface ipv4 set address "vEthernet (HNSTransparent)" addr=192.168.1.1
route add 192.168.0.0 mask 255.255.255.0 192.168.0.1 if <Interface Id of the Routable Ethernet Adapter> -p
route add 192.168.2.0 mask 255.255.255.0 192.168.2.1 if <Interface Id of the Routable Ethernet Adapter> -p
```

**Win02**

```
docker network create -d transparent --gateway 192.168.2.1 --subnet 192.168.2.0/24 <network name>
# A bridge is created with Adapter name "vEthernet (HNSTransparent)". Set its IP address to transparent network gateway
netsh interface ipv4 set address "vEthernet (HNSTransparent)" addr=192.168.2.1
route add 192.168.0.0 mask 255.255.255.0 192.168.0.1 if <Interface Id of the Routable Ethernet Adapter> -p
route add 192.168.1.0 mask 255.255.255.0 192.168.1.1 if <Interface Id of the Routable Ethernet Adapter> -p
```

## Starting the Cluster
To start your cluster, you'll need to start both the Linux-based Kubernetes control plane, and the Windows Server-based Kubernetes node components. 
## Starting the Linux-based Control Plane
Use your preferred method to start Kubernetes cluster on Linux. Please note that Cluster CIDR might need to be updated.
## Starting the Windows Node Components
To start kubelet on your Windows node:
Run the following in a PowerShell window. Be aware that if the node reboots or the process exits, you will have to rerun the commands below to restart the kubelet

1. Set environment variable *CONTAINER_NETWORK* value to the docker container network to use
`$env:CONTAINER_NETWORK = "<docker network>"`

2. Run *kubelet* executable using the below command
`kubelet.exe --hostname-override=<ip address/hostname of the windows node>  --pod-infra-container-image="apprenda/pause" --resolv-conf="" --api_servers=<api server location>`

To start kube-proxy on your Windows node:

Run the following in a PowerShell window with administrative privileges. Be aware that if the node reboots or the process exits, you will have to rerun the commands below to restart the kube-proxy.

1. Set environment variable *INTERFACE_TO_ADD_SERVICE_IP* value to `vEthernet (KubeProxySwitch)` which we created in **_Windows Host Setup_** above
`$env:INTERFACE_TO_ADD_SERVICE_IP = "vEthernet (KubeProxySwitch)"`

2. Run *kube-proxy* executable using the below command
`.\proxy.exe --v=3 --proxy-mode=userspace --hostname-override=<ip address/hostname of the windows node> --master=<api server location> --bind-address=<ip address of the windows node>`

## Scheduling Pods on Windows
Because your cluster has both Linux and Windows nodes, you must explicitly set the nodeSelector constraint to be able to schedule Pods to Windows nodes. You must set nodeSelector with the label beta.kubernetes.io/os to the value windows; see the following example:

```
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

## Known Limitations:
1. There is no network namespace in Windows and as a result currently only one container per pod is supported
2. Secrets currently do not work because of a bug in Windows Server Containers described [here](https://github.com/docker/docker/issues/28401)
3. ConfigMaps have not been implemented yet.
4. `kube-proxy` implementation uses `netsh portproxy` and as it only supports TCP, DNS currently works only if the client retries DNS query using TCP
