---
assignees:
- erictune
- jbeda
title: VMware vSphere
---

This page covers how to get started with deploying Kubernetes on vSphere and details for how to configure the vSphere Cloud Provider.

* TOC
{:toc}

### Getting started with vSphere

Kubernetes comes with a cloud provider for vSphere. A quick and easy way to try out the cloud provider is to deploy Kubernetes using [Kubernetes-Anywhere](https://github.com/kubernetes/kubernetes-anywhere).

This page also describes how to configure and get started with the cloud provider if deploying using custom install scripts.

### Deploy Kubernetes on vSphere

To start using Kubernetes on top of vSphere and use the vSphere Cloud Provider use Kubernetes-Anywhere. Kubernetes-Anywhere will deploy and configure a cluster from scratch.

Detailed steps can be found at the [getting started with Kubernetes-Anywhere on vSphere page](https://git.k8s.io/kubernetes-anywhere/phase1/vsphere/README.md)

### vSphere Cloud Provider

vSphere Cloud Provider allows using vSphere managed storage within Kubernetes. It supports:

1. Volumes
2. Persistent Volumes
3. Storage Classes and provisioning of volumes.
4. vSphere Storage Policy Based Management for Containers orchestrated by Kubernetes.

Documentation for how to use vSphere managed storage can be found in the
[persistent volumes user
guide](/docs/concepts/storage/persistent-volumes/#vsphere) and the
[volumes user
guide](/docs/concepts/storage/volumes/#vspherevolume)

Examples can be found
[here](https://git.k8s.io/kubernetes/examples/volumes/vsphere)

#### Configuring vSphere Cloud Provider

If a Kubernetes cluster has not been deployed using Kubernetes-Anywhere, follow the instructions below to use the vSphere Cloud Provider. These steps are not needed when using Kubernetes-Anywhere, they will be done as part of the deployment.

* Enable UUID for a VM

This can be done via [govc tool](https://github.com/vmware/govmomi/tree/master/govc)

```
export GOVC_URL=<IP/URL>
export GOVC_USERNAME=<vCenter User>
export GOVC_PASSWORD=<vCenter Password>
export GOVC_INSECURE=1
govc vm.change -e="disk.enableUUID=1" -vm=<VMNAME>
```

* Create Role and User with Required Privileges for vSphere Cloud Provider

vSphere Cloud Provider requires the following minimal set of privileges to interact with vCenter:

Please refer [vSphere Documentation Center](http://pubs.vmware.com/vsphere-65/index.jsp?topic=%2Fcom.vmware.vsphere.security.doc%2FGUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html&resultof=%22%43%72%65%61%74%65%22%20%22%63%72%65%61%74%22%20%22%43%75%73%74%6f%6d%22%20%22%63%75%73%74%6f%6d%22%20%22%52%6f%6c%65%22%20%22%72%6f%6c%65%22%20) to know about steps for creating a Custom Role, User and Role Assignment.

Note: Assign Permissions at the vCenter Level and make sure to check Propagate.

```
Datastore > Allocate space
Datastore > Low level file Operations
Virtual Machine > Configuration > Add existing disk
Virtual Machine > Configuration > Add or remove device
Virtual Machine > Configuration > Remove disk
```

For the VSAN policy based volume provisioning feature, the following additional privileges are required.

```
Network > Assign network
Virtual machine > Configuration > Add new disk
Virtual Machine > Inventory > Create new
Virtual machine > Configuration > Add new disk
Resource > Assign virtual machine to resource pool
```

* Provide the cloud config file to each instance of kubelet, apiserver and controller manager via ```--cloud-config=<path to file>``` flag. Cloud config [template can be found at Kubernetes-Anywhere](https://git.k8s.io/kubernetes-anywhere/phase1/vsphere/vsphere.conf)

Sample Config:

```
[Global]
        user = <User name for vCenter>
        password = <Password for vCenter>
        server = <IP/URL for vCenter>
        port = <Default 443 for vCenter>
        insecure-flag = <set to 1 if the host above uses a self-signed cert>
        datacenter = <Datacenter to be used>
        datastore = <Datastore to use for provisioning volumes using storage classes/dynamic provisioning>
        working-dir = <Folder in which VMs are provisioned, can be null>
        vm-uuid = <VM Instance UUID of virtual machine which can be retrieved from instanceUuid property in VmConfigInfo, or also set as vc.uuid in VMX file. If empty, will be retrieved from sysfs (requires root)>
[Disk]
    scsicontrollertype = pvscsi
```

* Set the cloud provider via ```--cloud-provider=vsphere``` flag for each instance of kubelet, apiserver and controller manager.

* When upgrading to 1.6 install the default storage class addons, [click here for more details](https://github.com/kubernetes/kubernetes/issues/40070)

#### Known issues

### Kube-up (Deprecated)

Kube-up.sh is no longer supported and is deprecated. The steps for kube-up are included but going forward [kube-anywhere](https://github.com/kubernetes/kubernetes-anywhere) is preferred.

The recommended version for kube-up is [v1.4.7](https://github.com/kubernetes/kubernetes/releases/tag/v1.4.7)

The example below creates a Kubernetes cluster with 4 worker node Virtual.
Machines and a master Virtual Machine (i.e. 5 VMs in your cluster). This cluster is set up and controlled from your workstation (or wherever you find convenient).

#### Prerequisites

* You need administrator credentials to an ESXi machine or vCenter instance with write mode api access enabled (not available on the free ESXi license).
* You must have Go (see [here](https://git.k8s.io/community/contributors/devel/development.md#go-versions) for supported versions) installed: [www.golang.org](http://www.golang.org).
* You must have your `GOPATH` set up and include `$GOPATH/bin` in your `PATH`.

```shell
export GOPATH=$HOME/src/go
mkdir -p $GOPATH
export PATH=$PATH:$GOPATH/bin
```

* Install the govc tool to interact with ESXi/vCenter. Head to [govc Releases](https://github.com/vmware/govmomi/releases) to download the latest.

```shell
# Sample commands for v0.8.0 for 64 bit Linux.
curl -OL https://github.com/vmware/govmomi/releases/download/v0.8.0/govc_linux_amd64.gz
gzip -d govc_linux_amd64.gz
chmod +x govc_linux_amd64
mv govc_linux_amd64 /usr/local/bin/govc
```

* Get or build a [binary release](/docs/getting-started-guides/binary_release)

#### Setup

Download a prebuilt Debian 8.2 VMDK that we'll use as a base image:

```shell
curl --remote-name-all https://storage.googleapis.com/govmomi/vmdk/2016-01-08/kube.vmdk.gz{,.md5}
md5sum -c kube.vmdk.gz.md5
gzip -d kube.vmdk.gz
```

Configure the environment for govc

```shell
export GOVC_URL='hostname' # hostname of the vc
export GOVC_USERNAME='username' # username for logging into the vsphere.
export GOVC_PASSWORD='password' # password for the above username
export GOVC_NETWORK='Network Name' # Name of the network the vms should join. Many times it could be "VM Network"
export GOVC_INSECURE=1 # If the host above uses a self-signed cert
export GOVC_DATASTORE='target datastore'
# To get resource pool via govc: govc ls -l 'host/*' | grep ResourcePool | awk '{print $1}' | xargs -n1 -t govc pool.info
export GOVC_RESOURCE_POOL='resource pool or cluster with access to datastore'
export GOVC_GUEST_LOGIN='kube:kube' # Used for logging into kube.vmdk during deployment.
export GOVC_PORT=443 # The port to be used by vSphere cloud provider plugin
# To get datacente via govc: govc datacenter.info
export GOVC_DATACENTER='ha-datacenter' # The datacenter to be used by vSphere cloud provider plugin
```

Sample environment

```shell
export GOVC_URL='10.161.236.217'
export GOVC_USERNAME='administrator'
export GOVC_PASSWORD='MyPassword1'
export GOVC_NETWORK='VM Network'
export GOVC_INSECURE=1
export GOVC_DATASTORE='datastore1'
export GOVC_RESOURCE_POOL='/Datacenter/host/10.20.104.24/Resources'
export GOVC_GUEST_LOGIN='kube:kube'
export GOVC_PORT='443'
export GOVC_DATACENTER='Datacenter'
```

Import this VMDK into your vSphere datastore:

```shell
govc import.vmdk kube.vmdk ./kube/
```

Verify that the VMDK was correctly uploaded and expanded to ~3GiB:

```shell
govc datastore.ls ./kube/
```

If you need to debug any part of the deployment, the guest login for
the image that you imported is `kube:kube`. It is normally specified
in the GOVC_GUEST_LOGIN parameter above.

Also take a look at the file `cluster/vsphere/config-default.sh` and
make any needed changes. You can configure the number of nodes
as well as the IP subnets you have made available to Kubernetes, pods,
and services.

#### Starting a cluster

Now, let's continue with deploying Kubernetes.
This process takes about ~20-30 minutes depending on your network.

##### From extracted binary release

```shell
cd kubernetes
KUBERNETES_PROVIDER=vsphere cluster/kube-up.sh
```

##### Build from source

```shell
cd kubernetes
make release
KUBERNETES_PROVIDER=vsphere cluster/kube-up.sh
```

Refer to the top level README and the getting started guide for Google Compute
Engine. Once you have successfully reached this point, your vSphere Kubernetes
deployment works just as any other one!

**Enjoy!**

#### Extra: debugging deployment failure

The output of `kube-up.sh` displays the IP addresses of the VMs it deploys. You
can log into any VM as the `kube` user to poke around and figure out what is
going on (find yourself authorized with your SSH key, or use the password
`kube` otherwise).

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Vmware vSphere       | Kube-anywhere    | Photon OS | Flannel         | [docs](/docs/getting-started-guides/vsphere)                                |          | Community  ([@abrarshivani](https://github.com/abrarshivani)), ([@kerneltime](https://github.com/kerneltime)), ([@BaluDontu](https://github.com/BaluDontu)), ([@luomiao](https://github.com/luomiao)), ([@divyenpatel](https://github.com/divyenpatel))

If you identify any issues/problems using the vSphere cloud provider, you can create an issue in our repo - [VMware Kubernetes](https://github.com/vmware/kubernetes).

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

