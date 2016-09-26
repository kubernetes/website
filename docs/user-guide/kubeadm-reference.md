# kubeadm reference

This document specifies the advanced options of kubeadm.

## Usage

### `kubeadm init`

It is usually sufficient to run `kubeadm init` with the default parameters,
but in some cases you might like to override the default behaviour.
Here we specify all the flags that can be used to customise the Kubernetes
installation.

- `--api-advertise-addresses` (multiple values are allowed by having multiple
flag declarations or multiple values separated by commas)
- `--api-external-dns-names` (multiple values are allowed by having multiple
flag declarations or multiple values separated by commas)

By default, `kubeadm` will automatically detect IP addresses and use
these to generate certificates for the API server. If you would like
to access the API server through an IP address that can't be automatically
detected, or through a hostname, you can override these defaults with
`--api-advertise-addresses` and `--api-external-dns-names`.

- `--cloud-provider`

Currently, `kubeadm` does not provide autodetection of cloud provider.
This means that networking and persistant volumes are not supported out
of the box. You can specify a cloud provider using `--cloud-provider`.
Valid values are the ones support by `controller-manager`, namely `"aws"`,
`"azure"`, `"cloudstack"`, `"gce"`, `"mesos"`, `"openstack"`, `"ovirt"`,
`"rackspace"`, `"vsphere"`.

- `--external-etcd-cafile` etcd certificate authority certificate file
- `--external-etcd-certfile` etcd client certificate file
- `--external-etcd-endpoints` comma separated list of etcd endpoints to use
for an external cluster
- `--external-etcd-keyfile` etcd client key file

By default, `kubeadm` will deploy a single node etcd cluster on the master
to store Kubernetes state. This means that any failure on the master node
will require you to rebuild your cluster from scratch. Currently `kubeadm`
does not support automatic deployment of a highly available etcd cluster.
If you would like to use your own etcd cluster, you can override this
behaviour with `--external-etcd-endpoints`. `kubeadm` supports etcd client
authentication using the `--external-etcd-cafile`, `--external-etcd-certfile`
and `--external-etcd-keyfile` flags.

- `--pod-network-cidr`

By default, `kubeadm` does not set node CIDR's for pods and allows you to
bring your own networking configuration through a CNI compatible network
controller addon such as [Weave Net](https://github.com/weaveworks/weave-kube),
[Calico](https://github.com/projectcalico/calico-containers/tree/master/docs/cni/kubernetes/manifests/kubeadm)
or [Canal](https://github.com/tigera/canal/tree/master/k8s-install/kubeadm).
If you are using a compatible cloud provider or flannel, you can specify a
subnet to use for each pod on the cluster with the `--pod-network-cidr` flag.
This should be a minimum of a /16 so that kubeadm is able to assign /24 subnets
to each node in the cluster.

- `--service-cidr` (default '100.64.0.0/12')

You can use the `--service-cidr` flag to override the subnet Kubernetes uses to
assign pods IP addresses. By default, the chosen subnet is reserved for carrier
grade NAT and is highly unlikely to cause a collision.

- `--service-dns-domain` (default 'cluster.local')

By default, `kubeadm` will deploy a cluster that assigns services with DNS names
`<service_name>.<namespace>.cluster.local>. You can use the `--service-dns-domain`
to change the DNS name suffix.

- `--token`

By default, `kubeadm` will automatically generate the token used to initialise
each new node. If you would like to manually specify this token, you can use the
`--token` flag. The token must be of the format '<6 character string>.<16 character string>'.

- `--use-kubernetes-version` (default 'v1.4.0') the kubernetes version to initialise

`kubeadm` supports a minimum Kubernetes version of v1.4.0

### `kubeadm join`

`kubeadm join` has one mandatory flag, the token used to secure cluster bootstrap,
and one mandatory argument, the master IP address.

Here's an example on how to use it:

`kubeadm join --token=the_secret_token 192.168.1.1`

- `--token=<token>`

By default, when `kubeadm init` runs, a token is generated and revealed in the output.
That's the token you should use here.
