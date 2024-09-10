---
title: PKI certificates and requirements
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes requires PKI certificates for authentication over TLS.
If you install Kubernetes with [kubeadm](/docs/reference/setup-tools/kubeadm/), the certificates
that your cluster requires are automatically generated.
You can also generate your own certificates -- for example, to keep your private keys more secure
by not storing them on the API server.
This page explains the certificates that your cluster requires.

<!-- body -->

## How certificates are used by your cluster

Kubernetes requires PKI for the following operations:

### Server certificates

* Server certificate for the API server endpoint
* Server certificate for the etcd server
* [Server certificates](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  for each kubelet (every {{< glossary_tooltip text="node" term_id="node" >}} runs a kubelet)
* Optional server certificate for the [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Client certificates

* Client certificates for each kubelet, used to authenticate to the API server as a client of
  the Kubernetes API
* Client certificate for each API server, used to authenticate to etcd
* Client certificate for the controller manager to securely communicate with the API server
* Client certificate for the scheduler to securely communicate with the API server
* Client certificates, one for each node, for kube-proxy to authenticate to the API server
* Optional client certificates for administrators of the cluster to authenticate to the API server
* Optional client certificate for the [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Kubelet's server and client certificates

To establish a secure connection and authenticate itself to the kubelet, the API Server 
requires a client certificate and key pair. 

In this scenario, there are two approaches for certificate usage: 
using shared certificates or separate certificates;

* Shared Certificates: The kube-apiserver can utilize the same certificate and key pair it uses to authenticate its clients. This means that the existing certificates, such as `apiserver.crt`  and `apiserver.key`, can be used for communicating with the kubelet servers.

* Separate Certificates: Alternatively, the kube-apiserver can generate a new client certificate and key pair to authenticate its communication with the kubelet servers. In this case, a distinct certificate named `kubelet-client.crt` and its corresponding private key, `kubelet-client.key` are created.

{{< note >}}
`front-proxy` certificates are required only if you run kube-proxy to support
[an extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd also implements mutual TLS to authenticate clients and peers.

## Where certificates are stored

If you install Kubernetes with kubeadm, most certificates are stored in `/etc/kubernetes/pki`.
All paths in this documentation are relative to that directory, with the exception of user account
certificates which kubeadm places in `/etc/kubernetes`.

## Configure certificates manually

If you don't want kubeadm to generate the required certificates, you can create them using a
single root CA or by providing all certificates. See [Certificates](/docs/tasks/administer-cluster/certificates/)
for details on creating your own certificate authority. See
[Certificate Management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
for more on managing certificates.

### Single root CA

You can create a single root CA, controlled by an administrator. This root CA can then create
multiple intermediate CAs, and delegate all further creation to Kubernetes itself.

Required CAs:

| path                   | Default CN                | description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes general CA            |
| etcd/ca.crt,key        | etcd-ca                   | For all etcd-related functions   |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

On top of the above CAs, it is also necessary to get a public/private key pair for service account
management, `sa.key` and `sa.pub`.
The following example illustrates the CA key and certificate files shown in the previous table:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### All certificates

If you don't wish to copy the CA private keys to your cluster, you can generate all certificates yourself.

Required certificates:

| Default CN                    | Parent CA                 | O (in Subject) | kind             | hosts (SAN)                                         |
|-------------------------------|---------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`, `[1]`  |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client           |                                                     |

{{< note >}}
Instead of using the super-user group `system:masters` for `kube-apiserver-kubelet-client`
a less privileged group can be used. kubeadm uses the `kubeadm:cluster-admins` group for
that purpose.
{{< /note >}}

[1]: any other IP or DNS name you contact your cluster on (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)
the load balancer stable IP and/or DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

where `kind` maps to one or more of the x509 key usage, which is also documented in the
`.spec.usages` of a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
type:

| kind   | Key usage                                                                       |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
Hosts/SAN listed above are the recommended ones for getting a working cluster; if required by a
specific setup, it is possible to add additional SANs on all the server certificates.
{{< /note >}}

{{< note >}}
For kubeadm users only:

* The scenario where you are copying to your cluster CA certificates without private keys is
  referred as external CA in the kubeadm documentation.
* If you are comparing the above list with a kubeadm generated PKI, please be aware that
  `kube-etcd`, `kube-etcd-peer` and `kube-etcd-healthcheck-client` certificates are not generated
  in case of external etcd.

{{< /note >}}

### Certificate paths

Certificates should be placed in a recommended path (as used by [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Paths should be specified using the given argument regardless of location.

| Default CN                   | recommended key path         | recommended cert path       | command                 | key argument                 | cert argument                             |
|------------------------------|------------------------------|-----------------------------|-------------------------|------------------------------|-------------------------------------------|
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | kube-apiserver          |                              | --etcd-cafile                             |
| kube-apiserver-etcd-client   | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver          | --etcd-keyfile               | --etcd-certfile                           |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-apiserver          |                              | --client-ca-file                          |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-controller-manager | --cluster-signing-key-file   | --client-ca-file, --root-ca-file, --cluster-signing-cert-file |
| kube-apiserver               | apiserver.key                | apiserver.crt               | kube-apiserver          | --tls-private-key-file       | --tls-cert-file                           |
| kube-apiserver-kubelet-client| apiserver-kubelet-client.key | apiserver-kubelet-client.crt| kube-apiserver          | --kubelet-client-key         | --kubelet-client-certificate              |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-apiserver          |                              | --requestheader-client-ca-file            |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-controller-manager |                              | --requestheader-client-ca-file            |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver          | --proxy-client-key-file      | --proxy-client-cert-file                  |
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | etcd                    |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    | etcd/server.key              | etcd/server.crt             | etcd                    | --key-file                   | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd                    | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl                 |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl                 | --key                        | --cert                                    |

Same considerations apply for the service account key pair:

| private key path  | public key path  | command                 | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

The following example illustrates the file paths [from the previous tables](#certificate-paths)
you need to provide if you are generating all of your own keys and certificates:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```
## Configure certificates for user accounts

You must manually configure these administrator account and service accounts:

| filename                | credential name            | Default CN                          | O (in Subject)         |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
The value of `<nodeName>` for `kubelet.conf` **must** match precisely the value of the node name
provided by the kubelet as it registers with the apiserver. For further details, read the
[Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
In the above example `<admin-group>` is implementation specific. Some tools sign the
certificate in the default `admin.conf` to be part of the `system:masters` group.
`system:masters` is a break-glass, super user group can bypass the authorization
layer of Kubernetes, such as RBAC. Also some tools do not generate a separate
`super-admin.conf` with a certificate bound to this super user group.

kubeadm generates two separate administrator certificates in kubeconfig files.
One is in `admin.conf` and has `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` is a custom group bound to the `cluster-admin` ClusterRole.
This file is generated on all kubeadm managed control plane machines.

Another is in `super-admin.conf` that has `Subject: O = system:masters, CN = kubernetes-super-admin`.
This file is generated only on the node where `kubeadm init` was called.
{{< /note >}}

1. For each config, generate an x509 cert/key pair with the given CN and O.

1. Run `kubectl` as follows for each config:

```
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

These files are used as follows:

| filename                | command                 | comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configures administrator user for the cluster                         |
| super-admin.conf        | kubectl                 | Configures super administrator user for the cluster                   |
| kubelet.conf            | kubelet                 | One required for each node in the cluster.                            |
| controller-manager.conf | kube-controller-manager | Must be added to manifest in `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Must be added to manifest in `manifests/kube-scheduler.yaml`          |

The following files illustrate full paths to the files listed in the previous table:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
