---
assignees:
- mikedanese
- luxas
- errordeveloper
- jbeda

---


This document provides information on how to use kubeadm's advanced options.

Running `kubeadm init` bootstraps a Kubernetes cluster. This consists of the
following steps:

1. kubeadm runs a series of pre-flight checks to validate the system state
before making changes. Some checks only trigger warnings, others are
considered errors and will exit kubeadm until the problem is corrected or
the user specifies `--skip-preflight-checks`.

1. kubeadm generates a token that additional nodes can use to register
themselves with the master in future.  Optionally, the user can provide a token.

1. kubeadm generates a self-signed CA using openssl to provision identities
for each node in the cluster, and for the API server to secure communication
with clients.

1. Outputting a kubeconfig file for the kubelet to use to connect to the API
server, as well as an additional kubeconfig file for administration.

1. kubeadm generates Kubernetes resource manifests for the API server,
controller manager and scheduler, and placing them in
`/etc/kubernetes/manifests`. The kubelet watches this directory for static
resources to create on startup. These are the core components of Kubernetes, and
once they are up and running we can use `kubectl` to set up/manage any
additional components.

1. kubeadm installs any add-on components, such as DNS or discovery, via the API
server.

Running `kubeadm join` on each node in the cluster consists of the following steps:

1. Use the token to talk to the API server and securely get the root CA
certificate.

1. Creates a local key pair.  Prepares a certificate signing request (CSR) and
sends that off to the API server for signing.

1. Configures the local kubelet to connect to the API server

## Usage

Fields that support multiple values do so either with comma separation, or by specifying
the flag multiple times.

### `kubeadm init`

It is usually sufficient to run `kubeadm init` without any flags,
but in some cases you might like to override the default behaviour.
Here we specify all the flags that can be used to customise the Kubernetes
installation.

- `--api-advertise-addresses` (multiple values are allowed)
- `--api-external-dns-names` (multiple values are allowed)

By default, `kubeadm init` automatically detects IP addresses and uses
these to generate certificates for the API server. This uses the IP address
of the default network interface. If you would like to access the API server
through a different IP address, or through a hostname, you can override these
defaults with `--api-advertise-addresses` and `--api-external-dns-names`.
For example, to generate certificates that verify the API server at addresses
`10.100.245.1` and `100.123.121.1`, you could use
`--api-advertise-addresses=10.100.245.1,100.123.121.1`. To allow it to be accessed
with a hostname, `--api-external-dns-names=kubernetes.example.com,kube.example.com`
Specifying `--api-advertise-addresses` disables auto detection of IP addresses.

- `--cloud-provider`

Currently, `kubeadm init` does not provide autodetection of cloud provider.
This means that load balancing and persistent volumes are not supported out
of the box. You can specify a cloud provider using `--cloud-provider`.
Valid values are the ones supported by `controller-manager`, namely `"aws"`,
`"azure"`, `"cloudstack"`, `"gce"`, `"mesos"`, `"openstack"`, `"ovirt"`,
`"rackspace"`, `"vsphere"`. In order to provide additional configuration for
the cloud provider, you should create a `/etc/kubernetes/cloud-config.json`
file manually, before running `kubeadm init`. `kubeadm` automatically
picks those settings up and ensures other nodes are configured correctly.
You must also set the `--cloud-provider` and `--cloud-config` parameters
yourself by editing the `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`
file appropriately.

- `--external-etcd-cafile` etcd certificate authority file
- `--external-etcd-endpoints` (multiple values are allowed)
- `--external-etcd-certfile` etcd client certificate file
- `--external-etcd-keyfile` etcd client key file

By default, `kubeadm` deploys a single node etcd cluster on the master
to store Kubernetes state. This means that any failure on the master node
requires you to rebuild your cluster from scratch. Currently `kubeadm init`
does not support automatic deployment of a highly available etcd cluster.
If you would like to use your own etcd cluster, you can override this
behaviour with `--external-etcd-endpoints`. `kubeadm` supports etcd client
authentication using the `--external-etcd-cafile`, `--external-etcd-certfile`
and `--external-etcd-keyfile` flags.

- `--pod-network-cidr`

For certain networking solutions the Kubernetes master can also play a role in
allocating network ranges (CIDRs) to each node. This includes many cloud providers
and flannel. You can specify a subnet range that will be broken down and handed out
to each node with the `--pod-network-cidr` flag. This should be a minimum of a /16 so
controller-manager is able to assign /24 subnets to each node in the cluster.
If you are using flannel with [this manifest](https://github.com/coreos/flannel/blob/master/Documentation/kube-flannel.yml)
you should use `--pod-network-cidr=10.244.0.0/16`. Most CNI based networking solutions
do not require this flag.

- `--service-cidr` (default '10.96.0.0/12')

You can use the `--service-cidr` flag to override the subnet Kubernetes uses to
assign pods IP addresses. If you do, you will also need to update the
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file to reflect this change
else DNS will not function correctly.

- `--service-dns-domain` (default 'cluster.local')

By default, `kubeadm init` deploys a cluster that assigns services with DNS names
`<service_name>.<namespace>.svc.cluster.local`. You can use the `--service-dns-domain`
to change the DNS name suffix. Again, you will need to update the
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` file accordingly else DNS will
not function correctly.

- `--skip-preflight-checks`

By default, `kubeadm` runs a series of preflight checks to validate the system
before making any changes. Advanced users can use this flag to bypass these if
necessary.

- `--token`

By default, `kubeadm init` automatically generates the token used to initialise
each new node. If you would like to manually specify this token, you can use the
`--token` flag. The token must be of the format `<6 character string>.<16 character string>`.

- `--use-kubernetes-version` (default 'v1.4.4') the kubernetes version to initialise

`kubeadm` was originally built for Kubernetes version **v1.4.0**, older versions are not
supported. With this flag you can try any future version, e.g. **v1.5.0-beta.1**
whenever it comes out (check [releases page](https://github.com/kubernetes/kubernetes/releases)
for a full list of available versions).

### `kubeadm join`

When you use kubeadm join, you must supply the token used to secure cluster
boostrap as a mandatory flag, and the master IP address as a mandatory argument.

Here's an example on how to use it:

`kubeadm join --token=the_secret_token 192.168.1.1`

- `--skip-preflight-checks`

By default, `kubeadm` runs a series of preflight checks to validate the system
before making any changes. Advanced users can use this flag to bypass these if
necessary.

- `--token=<token>`

By default, when `kubeadm init` runs, a token is generated and revealed in the output.
That's the token you should use here.

## Automating kubeadm

Rather than copying the token you obtained from `kubeadm init` to each node, as
in the basic `kubeadm` tutorials, you can parallelize the token distribution for
easier automation. To implement this automation, you must know the IP address
that the master will have after it is started.

1.  Generate a token.  This token must have the form  `<6 character string>.<16
character string>`

    Here is a simple python one-liner for this:

    ```
    python -c 'import random; print "%0x.%0x" % (random.SystemRandom().getrandbits(3*8), random.SystemRandom().getrandbits(8*8))'
    ```

1. Start both the master node and the worker nodes concurrently with this token.  As they come up they should find each other and form the cluster.

Once the cluster is up, you can grab the admin credentials from the master node at `/etc/kubernetes/admin.conf` and use that to talk to the cluster.

## Environment variables

There are some environment variables that modify the way that `kubeadm` works.  Most users will have no need to set these.

| Variable | Default | Description |
| --- | --- | --- |
| `KUBE_KUBERNETES_DIR` | `/etc/kubernetes` | Where most configuration files are written to and read from |
| `KUBE_HOST_PKI_PATH` | `/etc/kubernetes/pki` | Directory for master PKI assets |
| `KUBE_HOST_ETCD_PATH` | `/var/lib/etcd` | Local etcd state for Kubernetes cluster |
| `KUBE_HYPERKUBE_IMAGE` | `` | If set, use a single hyperkube image with this name. If not set, individual images per server component will be used. |
| `KUBE_DISCOVERY_IMAGE` | `gcr.io/google_containers/kube-discovery-<arch>:1.0` | The bootstrap discovery helper image to use. |
| `KUBE_ETCD_IMAGE` | `gcr.io/google_containers/etcd-<arch>:2.2.5` | The etcd container image to use. |
| `KUBE_COMPONENT_LOGLEVEL` | `--v=4` | Logging configuration for all Kubernetes components |


## Releases and release notes

If you already have kubeadm installed and want to upgrade, run `apt-get update && apt-get upgrade` or `yum update` to get the latest version of kubeadm.

 - Second release between v1.4 and v1.5: `v1.5.0-alpha.2.421+a6bea3d79b8bba`
   - Switch to the 10.96.0.0/12 subnet: [#35290](https://github.com/kubernetes/kubernetes/pull/35290)
   - Fix kubeadm on AWS by including /etc/ssl/certs in the controller-manager [#33681](https://github.com/kubernetes/kubernetes/pull/33681)
   - The API was refactored and is now componentconfig: [#33728](https://github.com/kubernetes/kubernetes/pull/33728), [#34147](https://github.com/kubernetes/kubernetes/pull/34147) and [#34555](https://github.com/kubernetes/kubernetes/pull/34555)
   - Allow kubeadm to get config options from a file: [#34501](https://github.com/kubernetes/kubernetes/pull/34501), [#34885](https://github.com/kubernetes/kubernetes/pull/34885) and [#34891](https://github.com/kubernetes/kubernetes/pull/34891)
   - Implement preflight checks: [#34341](https://github.com/kubernetes/kubernetes/pull/34341) and [#35843](https://github.com/kubernetes/kubernetes/pull/35843)
   - Using kubernetes v1.4.4 by default: [#34419](https://github.com/kubernetes/kubernetes/pull/34419) and [#35270](https://github.com/kubernetes/kubernetes/pull/35270)
   - Make api and discovery ports configurable and default to 6443: [#34719](https://github.com/kubernetes/kubernetes/pull/34719)
   - Implement kubeadm reset: [#34807](https://github.com/kubernetes/kubernetes/pull/34807)
   - Make kubeadm poll/wait for endpoints instead of directly fail when the master isn't available [#34703](https://github.com/kubernetes/kubernetes/pull/34703) and [#34718](https://github.com/kubernetes/kubernetes/pull/34718)
   - Allow empty directories in the directory preflight check: [#35632](https://github.com/kubernetes/kubernetes/pull/35632)
   - Started adding unit tests: [#35231](https://github.com/kubernetes/kubernetes/pull/35231), [#35326](https://github.com/kubernetes/kubernetes/pull/35326) and [#35332](https://github.com/kubernetes/kubernetes/pull/35332)
   - Various enhancements: [#35075](https://github.com/kubernetes/kubernetes/pull/35075), [#35111](https://github.com/kubernetes/kubernetes/pull/35111), [#35119](https://github.com/kubernetes/kubernetes/pull/35119), [#35124](https://github.com/kubernetes/kubernetes/pull/35124), [#35265](https://github.com/kubernetes/kubernetes/pull/35265) and [#35777](https://github.com/kubernetes/kubernetes/pull/35777)
   - Bug fixes: [#34352](https://github.com/kubernetes/kubernetes/pull/34352), [#34558](https://github.com/kubernetes/kubernetes/pull/34558), [#34573](https://github.com/kubernetes/kubernetes/pull/34573), [#34834](https://github.com/kubernetes/kubernetes/pull/34834), [#34607](https://github.com/kubernetes/kubernetes/pull/34607), [#34907](https://github.com/kubernetes/kubernetes/pull/34907) and [#35796](https://github.com/kubernetes/kubernetes/pull/35796)
 - Initial v1.4 release: `v1.5.0-alpha.0.1534+cf7301f16c0363`


## Troubleshooting

* Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure `net.bridge.bridge-nf-call-iptables` is set to 1 in your sysctl config, eg.

```
# cat /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
```
