---
assignees:
- erictune
- jbeda

---

The example below creates a Kubernetes cluster with 4 worker node Virtual
Machines and a master Virtual Machine (i.e. 5 VMs in your cluster). This
cluster is set up and controlled from your workstation (or wherever you find
convenient).

* TOC
{:toc}

### Prerequisites

1. You need administrator credentials to an ESXi machine or vCenter instance with write mode api access enabled (not available on the free ESXi license).
2. You must have Go (see [here](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/development.md#go-versions) for supported versions) installed: [www.golang.org](http://www.golang.org).
3. You must have your `GOPATH` set up and include `$GOPATH/bin` in your `PATH`.

```shell
export GOPATH=$HOME/src/go
mkdir -p $GOPATH
export PATH=$PATH:$GOPATH/bin
```

4. Install the govc tool to interact with ESXi/vCenter:

```shell
go get github.com/vmware/govmomi/govc
```

5. Get or build a [binary release](/docs/getting-started-guides/binary_release)

### Setup

Download a prebuilt Debian 8.2 VMDK that we'll use as a base image:

```shell
curl --remote-name-all https://storage.googleapis.com/govmomi/vmdk/2016-01-08/kube.vmdk.gz{,.md5}
md5sum -c kube.vmdk.gz.md5
gzip -d kube.vmdk.gz
```

Import this VMDK into your vSphere datastore:

```shell
export GOVC_URL='hostname' # hostname of the vc
export GOVC_USERNAME='username' # username for logging into the vsphere.
export GOVC_PASSWORD='password' # password for the above username
export GOVC_NETWORK='Network Name' # Name of the network the vms should join. Many times it could be "VM Network"
export GOVC_INSECURE=1 # If the host above uses a self-signed cert
export GOVC_DATASTORE='target datastore'
export GOVC_RESOURCE_POOL='resource pool or cluster with access to datastore'
export GOVC_GUEST_LOGIN='kube:kube' # Used for logging into kube.vmdk during deployment.

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
Vmware vSphere       | Saltstack    | Debian | OVS         | [docs](/docs/getting-started-guides/vsphere)                                |          | Community ([@imkin](https://github.com/imkin))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

