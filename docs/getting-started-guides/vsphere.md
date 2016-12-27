---
assignees:
- erictune
- jbeda
title: VMware vSphere
---

* TOC
{:toc}

## vSphere Cloud Provider

On a vSphere cluster it is recommended to use the vSphere cloud provider. vSphere cloud provider currently supports 

1. [Volumes](http://kubernetes.io/docs/user-guide/volumes)
2. [Persistent Volumes](http://kubernetes.io/docs/user-guide/persistent-volumes/)
   1. [Static](http://kubernetes.io/docs/user-guide/persistent-volumes/#static)
   2. [Dynamic](http://kubernetes.io/docs/user-guide/persistent-volumes/#dynamic)
3. [Storage Class](http://kubernetes.io/docs/user-guide/persistent-volumes/#storageclasses)

## Configuring vSphere Cloud Provider

To use the vSphere cloud provider set ```--cloud-config=vsphere``` for the APIServer, kubelet and Kube Controller.
The vCenter details are passed into the cloud provider via ```--cloud-config=<Path to config file Ex:/etc/cloud.conf>```

```
[Global]
        user = admin
        password = password
        server = 10.10.20.21
        port = 443
        insecure-flag = 1
        datacenter = Datacenter
        datastore = datastore1
[Disk]
	scsicontrollertype = pvscsi
```
## Using vSphere Cloud Provider
The Volume usage is covered as part of [Volume](http://kubernetes.io/docs/user-guide/volumes/) and [Persistent Volume](http://kubernetes.io/docs/user-guide/persistent-volumes/) documentation

## Kube-up

The example below creates a Kubernetes cluster with 4 worker node Virtual
Machines and a master Virtual Machine (i.e. 5 VMs in your cluster). This
cluster is set up and controlled from your workstation (or wherever you find
convenient).



### Prerequisites

1. You need administrator credentials to an ESXi machine or vCenter instance with write mode api access enabled (not available on the free ESXi license).
2. You must have Go (see [here](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/development.md#go-versions) for supported versions) installed: [www.golang.org](http://www.golang.org).
3. You must have your `GOPATH` set up and include `$GOPATH/bin` in your `PATH`.

```shell
export GOPATH=$HOME/src/go
mkdir -p $GOPATH
export PATH=$PATH:$GOPATH/bin
```

4. Install the govc tool to interact with ESXi/vCenter. Head to [govc Releases](https://github.com/vmware/govmomi/releases) to download the latest.

```shell
# Sample commands for v0.8.0 for 64 bit Linux.
curl -OL https://github.com/vmware/govmomi/releases/download/v0.8.0/govc_linux_amd64.gz
gzip -d govc_linux_amd64.gz
chmod +x govc_linux_amd64
mv govc_linux_amd64 /usr/local/bin/govc
```

5. Get or build a [binary release](/docs/getting-started-guides/binary_release)

### Setup

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

### Starting a cluster

Now, let's continue with deploying Kubernetes.
This process takes about ~20-30 minutes depending on your network.

#### From extracted binary release

```shell
cd kubernetes
```
For 1.4.0 and 1.4.1 to work around https://github.com/kubernetes/kubernetes/issues/34847 (1.3.x should be the same)
```
curl -OL https://raw.githubusercontent.com/vmware/kubernetes/fix-kube-vsphere.kerneltime/cluster/vsphere/templates/salt-master.sh
curl -OL https://raw.githubusercontent.com/vmware/kubernetes/fix-kube-vsphere.kerneltime/cluster/vsphere/templates/salt-minion.sh
mv salt-master.sh cluster/vsphere/templates/
mv salt-minion.sh cluster/vsphere/templates/
chmod u+x cluster/vsphere/templates/salt-master.sh
chmod u+x cluster/vsphere/templates/salt-minion.sh
```

```
KUBERNETES_PROVIDER=vsphere cluster/kube-up.sh
```

#### Build from source

```shell
cd kubernetes
make release
KUBERNETES_PROVIDER=vsphere cluster/kube-up.sh
```

Refer to the top level README and the getting started guide for Google Compute
Engine. Once you have successfully reached this point, your vSphere Kubernetes
deployment works just as any other one!

**Enjoy!**

### Extra: debugging deployment failure

The output of `kube-up.sh` displays the IP addresses of the VMs it deploys. You
can log into any VM as the `kube` user to poke around and figure out what is
going on (find yourself authorized with your SSH key, or use the password
`kube` otherwise).

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Vmware vSphere       | Saltstack    | Debian | flannel         | [docs](/docs/getting-started-guides/vsphere)                                |          | Community ([@imkin](https://github.com/imkin)), ([@abrarshivani](https://github.com/abrarshivani)), ([@kerneltime](https://github.com/kerneltime)))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

