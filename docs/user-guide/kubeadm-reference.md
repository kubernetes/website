# kubeadm reference

This document specifies the advanced options of kubeadm.

## Usage

Fields that support multiple values will do so either with comma
separation, or by specifying the flag multiple times.

### `kubeadm init`

It is usually sufficient to run `kubeadm init` without any flags,
but in some cases you might like to override the default behaviour.
Here we specify all the flags that can be used to customise the Kubernetes
installation.

- `--api-advertise-addresses` (multiple values are allowed)
- `--api-external-dns-names` (multiple values are allowed)

By default, `kubeadm init` will automatically detect IP addresses and use
these to generate certificates for the API server. This uses the IP address
of the default network interface. If you would like to access the API server
through a different IP address, or through a hostname, you can override these
defaults with `--api-advertise-addresses` and `--api-external-dns-names`.
Specifying `--api-advertise-addresses` will disable auto detection.

- `--cloud-provider`

Currently, `kubeadm init` does not provide autodetection of cloud provider.
This means that load balancing and persistent volumes are not supported out
of the box. You can specify a cloud provider using `--cloud-provider`.
Valid values are the ones supported by `controller-manager`, namely `"aws"`,
`"azure"`, `"cloudstack"`, `"gce"`, `"mesos"`, `"openstack"`, `"ovirt"`,
`"rackspace"`, `"vsphere"`. In order to provide additional configuration for
the cloud provider, you should create a `/etc/kubernetes/cloud-config.json`
file manually, before running `kubeadm init`. `kubeadm` will then automatically
pick those settings up and ensure other nodes are configured correctly.

- `--external-etcd-cafile` etcd certificate authority file
- `--external-etcd-endpoints` (multiple values are allowed)
- `--external-etcd-certfile` etcd client certificate file
- `--external-etcd-keyfile` etcd client key file

By default, `kubeadm` will deploy a single node etcd cluster on the master
to store Kubernetes state. This means that any failure on the master node
will require you to rebuild your cluster from scratch. Currently `kubeadm init`
does not support automatic deployment of a highly available etcd cluster.
If you would like to use your own etcd cluster, you can override this
behaviour with `--external-etcd-endpoints`. `kubeadm` supports etcd client
authentication using the `--external-etcd-cafile`, `--external-etcd-certfile`
and `--external-etcd-keyfile` flags.

- `--pod-network-cidr`

By default, `kubeadm init` does not set node CIDR's for pods and allows you to
bring your own networking configuration through a CNI compatible network
controller addon such as [Weave Net](https://github.com/weaveworks/weave-kube),
[Calico](https://github.com/projectcalico/calico-containers/tree/master/docs/cni/kubernetes/manifests/kubeadm)
or [Canal](https://github.com/tigera/canal/tree/master/k8s-install/kubeadm).
If you are using a compatible cloud provider or flannel, you can specify a
subnet to use for each pod on the cluster with the `--pod-network-cidr` flag.
This should be a minimum of a /16 so that kubeadm is able to assign /24 subnets
to each node in the cluster.

- `--service-cidr` (default '10.12.0.0/12')

You can use the `--service-cidr` flag to override the subnet Kubernetes uses to
assign pods IP addresses. By default, the chosen subnet is reserved for carrier
grade NAT and is highly unlikely to cause a collision.

- `--service-dns-domain` (default 'cluster.local')

By default, `kubeadm init` will deploy a cluster that assigns services with DNS names
`<service_name>.<namespace>.cluster.local`. You can use the `--service-dns-domain`
to change the DNS name suffix.

- `--token`

By default, `kubeadm init` will automatically generate the token used to initialise
each new node. If you would like to manually specify this token, you can use the
`--token` flag. The token must be of the format '<6 character string>.<16 character string>'.

- `--use-kubernetes-version` (default 'v1.4.0') the kubernetes version to initialise

`kubeadm` supports a minimum Kubernetes version of v1.4.0

`kubeadm` was originally built for Kubernetes version **v1.4.0**, older versions are not
supported. With this flag you can try any future version, e.g. **v1.5.0-beta.1**
whenever it comes out (check [releases page](https://github.com/kubernetes/kubernetes/releases)
for a full list of available versions).

### `kubeadm join`

`kubeadm join` has one mandatory flag, the token used to secure cluster bootstrap,
and one mandatory argument, the master IP address.

Here's an example on how to use it:

`kubeadm join --token=the_secret_token 192.168.1.1`

- `--token=<token>`

By default, when `kubeadm init` runs, a token is generated and revealed in the output.
That's the token you should use here.
