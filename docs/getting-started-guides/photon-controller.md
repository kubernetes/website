---
assignees:
- bprashanth

---

The example below creates a Kubernetes cluster using VMware's Photon
Controller. The cluster will have one Kubernetes master and three
Kubernetes nodes.

* TOC
{:toc}

### Prerequisites

1. You need administrator access to a [VMware Photon
Controller](http://vmware.github.io/photon-controller/)
deployment. (Administrator access is only required for the initial
setup: the actual creation of the cluster can be done by anyone.)

2. The [Photon Controller CLI](https://github.com/vmware/photon-controller-cli)
needs to be installed on the machine on which you'll be running kube-up. If you
have go installed, this can be easily installed with:

```shell
go get github.com/vmware/photon-controller-cli/photon
```

3. `mkisofs` needs to be installed. The installation process creates a
CD-ROM ISO image to bootstrap the VMs with cloud-init. If you are on a
Mac, you can install this with [brew](http://brew.sh/):

```shell
brew install cdrtools
```

4. Several common tools need to be installed: `ssh`, `scp`, `openssl`

5. You should have an ssh public key installed. This will be used to
give you access to the VM's user account, `kube`.

6. Get or build a [binary release](/docs/getting-started-guides/binary_release)

### Download VM Image

Download a prebuilt Debian 8.2 VMDK that we'll use as a base image:

```shell
curl --remote-name-all https://s3.amazonaws.com/photon-platform/artifacts/OS/debian/debian-8.2.vmdk
```

This is a base Debian 8.2 image with the addition of:

* openssh-server
* open-vm-tools
* cloud-init

### Configure Photon Controller:

In order to deploy Kubernetes, you need to configure Photon Controller
with:

* A tenant, with associated resource ticket
* A project within that tenant
* VM and disk flavors, to describe the VM characteristics
* An image: we'll use the one above

When you do this, you'll need to configure the
`cluster/photon-controller/config-common.sh` file with the names of
the tenant, project, flavors, and image.

If you prefer, you can  use the provided `cluster/photon-controller/setup-prereq.sh`
script to create these. Assuming the IP address of your Photon
Controller is 192.0.2.2 (change as appropriate) and the downloaded image is
kube.vmdk, you can run:

```shell
photon target set https://192.0.2.2
photon target login ...credentials...
cluster/photon-controller/setup-prereq.sh https://192.0.2.2 kube.vmdk
```

The `setup-prereq.sh` script will create the tenant, project, flavors,
and image based on the same configuration file used by kube-up:
`cluster/photon-controller/config-common.sh`. Note that it will create
a resource ticket which limits how many VMs a tenant can create. You
will want to change the resource ticket configuration in
`config-common.sh` based on your actual Photon Controller deployment.

### Configure kube-up

There are two files used to configure kube-up's interaction with
Photon Controller:

1. `cluster/photon-controller/config-common.sh` has the most common
parameters, including the names of the tenant, project, and image.

2. `cluster/photon-controller/config-default.sh` has more advanced
parameters including the IP subnets to use, the number of nodes to
create and which Kubernetes components to configure.

Both files have documentation to explain the different parameters.

### Creating your Kubernetes cluster

To create your Kubernetes cluster we will run the standard `kube-up`
command. As described above, the parameters that control kube-up's
interaction with Photon Controller are specified in files, not on the
command-line.

The time to deploy varies based on the number of nodes you create as
well as the specifications of your Photon Controller hosts and
network. Times vary from 10 - 30 minutes for a ten node cluster.

```shell
KUBERNETES_PROVIDER=photon-controller cluster/kube-up.sh
```

Once you have successfully reached this point, your Kubernetes cluster
works just like any other.

Note that kube-up created a Kubernetes configuration file for you in
`~/.kube/config`. This file will allow you to use the `kubectl`
command. It contains the IP address of the Kubernetes master as well
as the password for the `admin` user. If you wish to use the
Kubernetes web-based user interface you will need this password. In
the config file you'll see a section that look like the following: you
use the password there. (Note that the output has been trimmed: the
certificate data is much lengthier)

```yaml
- name: photon-kubernetes
  user:
    client-certificate-data: Q2Vyd...
    client-key-data: LS0tL...
    password: PASSWORD-HERE
    username: admin
```

### Removing your Kubernetes cluster

The recommended way to remove your Kubernetes cluster is with the
`kube-down` command:

```shell
KUBERNETES_PROVIDER=photon-controller cluster/kube-down.sh
```

Your Kubernetes cluster is just a set of VMs: you can manually remove
them if you need to.

### Making services publicly accessible

There are multiple ways to make services publicly accessible in Kubernetes.
Currently, the photon-controller support does not yet include built-in
support for the LoadBalancer option.

#### Option 1: NodePort

One option is to use the NodePort option with a manually deployed
balancer. Specifically:

Configure your service with the NodePort option. For example, this
service uses the NodePort option. All Kubernetes nodes will listen on
a port and forward network traffic to any pods in the service. In this
case, Kubernets will choose a random port, but it will be the same
port on all nodes.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-demo-service
  labels:
    app: nginx-demo
spec:
  type: NodePort
  ports:
  - port: 80
    protocol: TCP
    name: http
  selector:
    app: nginx-demo
```

Next, create a new standalone VM (or VMs, for high availability) to act
as a load balancer. For example, if you use haproxy, you could make a
configuration similar to the one below. Note that this example assumes there
are three Kubernetes nodes: you would adjust the configuration to reflect the
actual nodes you have. Also note that port 30144 should be replaced
with whatever NodePort was assigned by Kubernetes.

```yaml
frontend nginx-demo
    bind *:30144
    mode http
    default_backend nodes
backend nodes
    mode http
    balance roundrobin
    option forwardfor
    http-request set-header X-Forwarded-Port %[dst_port]
    http-request add-header X-Forwarded-Proto https if { ssl_fc }
    option httpchk HEAD / HTTP/1.1\r\nHost:localhost
    server web0 192.0.2.2:30144 check
    server web1 192.0.2.3:30144 check
    server web2 192.0.2.4:30144 check
```

#### Option 2: Ingress Controller

Using an [ingress controller](docs/user-guide/ingress) may also be an
appropriate solution. Note that it in a production environment it will
also require an external load balancer. However, it may be simpler to
manage because it will not require you to manually update the load
balancer configuration, as above.

### Details

#### Logging into VMs

When the VMs are created, a `kube` user is created (using
cloud-init). The password for the kube user is the same as the
administrator password for your Kubernetes master and can be found in
your Kubernetes configuration file: see above to find it. The kube user
will also authorize your ssh public key to log in. This is used during
installation to avoid the need for passwords.

The VMs do have a root user, but ssh to the root user is disabled.

### Networking

The Kubernetes cluster uses `kube-proxy` to configure the overlay
network with iptables. Currently we do not support other overlay
networks such as Weave or Calico.

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Vmware Photon        | Saltstack    | Debian | OVS         | [docs](/docs/getting-started-guides/photon-controller)                      |          | Community ([@alainroy](https://github.com/alainroy))
