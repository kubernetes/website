---
layout: docwithnav
title: Kubernetes PKI certificates and requirements
permalink: /certs/
approvers:
- efrost
---

# Introduction

A tool like [kubeadm][kubeadm] can be used to generate your certificates for you.
But there are also reasons to generate these certificates yourself.
This allows you to keep your private keys off of the api server, for enhanced security.

# Certificates in Kubernetes

Kuberentes uses TLS extensively for authentication.

## Where they're used

Kubernetes uses PKI for the following operations:
1. Client certificates for the kubelet to authenticate to the API server
2. Server certificate for the API server endpoint
3. Client certificates for administrators of the cluster authenticating to the API server
4. Client certificates for the API server to talk to the kubelets
5. Client certificate for the API server to talk to etcd
6. Client certificate/kubeconfig for the controller manager to talk to the API server
7. Client certificate/kubeconfig for the scheduler to talk to the API server.
8. Client and server certificates for the [front-proxy][proxy]


In addition, etcd uses mutual TLS for authenticating clients and peers (in an HA cluster).

## Where to find them

Kubernetes stores certificates by default in `/etc/kubernetes/pki`. All paths in this documentation are relative to that directory.

## Certificate configuration

There are multiple levels of control for kubernetes certificates. 
At the basic level, a tool like [kubeadm][kubeadm] can generate all required certificates.
If that isn't desireable, a single root CA, controlled by an adminstrator, can create multiple _intermediate CAs_, and delegate all further creation to Kubernetes itself. 


The CAs needed for this to work are:

| path                   | Default CN                | description                      |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | the kubernetes general CA        |
| etcd/ca.crt,key        | kubernetes-front-proxy-ca | For all ETCD-related functions   |
| front-proxy-ca.crt,key | etcd-ca                   | for the [front-end proxy][proxy] |

If you don't wish to copy these private keys to your API servers, you can generate all certificates yourself. 
In that case, you will also need to make all of these:



[2]: For a liveness probe, if self-hosted

| Default CN                    | Parent CA                 | O (in Subject) | kind   | hosts (SAN)                                 |
|-------------------------------|---------------------------|----------------|--------|---------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server | localhost, 127.0.0.1                        |
| kube-etcd-peer                | etcd-ca                   |                | peer   | <hostname>, <Host IP>, localhost, 127.0.0.1 |
| kube-etcd-healthcheck-client  | etcd-ca                   | system:masters | peer   |                                             |
| kube-apiserver-etcd-client    | etcd-ca                   | system:masters | client |                                             |
| kube-apiserver                | kubernetes-ca             |                | server | <hostname>, <Host IP>, <advertise IP> , [1] |
| kube-apiserver-client         | kubernetes-ca             | system:master  | client |                                             |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client |                                             |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client |                                             |

1: "kubernetes", "kubernetes.default", "kubernetes.default.svc", "kubernetes.default.svc.cluster", "kubernetes.default.svc.cluster.local"

where "kind" is are the [x509 key usage][usage] types:

| kind   | TLS role                                                                                          |
|--------|---------------------------------------------------------------------------------------------------|
| server | Digital Signature, Key Encipherment, TLS Web Server Authentication                                |
| peer   | Digital Signature, Key Encipherment, TLS Web Server Authentication, TLS Web Client Authentication |
| client | Digital Signature, Key Encipherment, TLS Web Client Authentication                                |

### Cert paths

Certificates should either be placed in a recommended path (as used by [kubeadm][kubeadm]). Paths should be specified using the given argument regardless of location.

| Default CN                   | recommend key path           | recommended cert path       | command        | key argument                 | cert argument                             |
|------------------------------|------------------------------|-----------------------------|----------------|------------------------------|-------------------------------------------|
| etcd-ca                      |                              | etcd/ca.crt                 | kube-apiserver |                              | --etcd-cafile                             |
| etcd-client                  | apiserver-etcd-client.crt    | apiserver-etcd-client.crt   | kube-apiserver | --etcd-certfile              | --etcd-keyfile                            |
| kubernetes-ca                |                              | ca.crt                      | kube-apiserver | --client-ca-file             |                                           |
| kube-apiserver               | apiserver.crt                | apiserver.key               | kube-apiserver | --tls-cert-file              | --tls-private-key                         |
| apiserver-kubelet-client     | apiserver-kubelet-client.crt |                             | kube-apiserver | --kubelet-client-certificate |                                           |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver | --proxy-client-cert-file     | --proxy-client-key-file                   |
|                              |                              |                             |                |                              |                                           |
| etcd-ca                      |                              | etcd/ca.crt                 | etcd           |                              | --trusted-ca-file, --peer-trusted-ca-file |
| kube-etcd                    |                              | etcd/server.crt             | etcd           |                              | --cert-file                               |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd           | --peer-key-file              | --peer-cert-file                          |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl[2]     |                              | --cacert                                  |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl[2]     | --key                        | --cert                                    |

## User configuration

The administrator account and service accounts will need to be manually configured. 

| filename                | credential name            | Default CN                     | O (in Subject) |
|-------------------------|----------------------------|--------------------------------|----------------|
| admin.conf              | default-admin              | kubernetes-admin               | system:masters |
| kubelet.conf            | default-auth               | system:node:<hostname>         | system:nodes   |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                |
| scheduler.conf          | default-manager            | system:kube-scheduler          |                |

The first step is to generate an x509 cert/key pair with the given CN and O. Then, `kubectl` can be used to generate a config (one per line):

```shell
KUBECONFIG=<path> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path to kubernetes ca> --embed-certs
KUBECONFIG=<path> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<path> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<path> kubectl config use-context default-system
```

All these kubeconfigs should be copied to locations where they can be used. They should be provided with `--kubeconfig`.

| name                       | path                    | command                 | comment                                                     |
|----------------------------|-------------------------|-------------------------|-------------------------------------------------------------|
| default-admin              | admin.conf              | kubectl                 | used by a user to administer the cluster                    |
| default-auth               | kubelet.conf            | kubelet                 | one will be needed for every node in the cluster.           |
| default-controller-manager | controller-manager.conf | kube-controller-manager | add to manifest in `manifests/kube-controller-manager.yaml` |
| default-scheduler          | scheduler.conf          | kube-scheduler          | add to manifest in `manifests/kube-scheduler.yaml`          |

[usage]: https://tools.ietf.org/html/rfc5280#section-4.2.1.3
[kubeadm]: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/ 
[proxy]: https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/
