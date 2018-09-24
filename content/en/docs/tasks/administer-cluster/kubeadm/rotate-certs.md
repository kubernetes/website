---
reviewers:
- sig-cluster-lifecycle
title: Certificate rotations under Kubeadm
content_template: templates/task
---

{{% capture overview %}}

This page explains how to rotate the various certificates associated with a kubeadm k8s installation.

{{% /capture %}}

{{% capture steps %}}

As part of upgrades, `kubeadm` will check all certificates it manages for expiration.
If they are expiring within the next month, they will be replaced.

Alternatively, the following commands can be used to granularly rotate individual certificates.

{{< warning >}}

Kubernetes CAs do not support OCSP.
This means there is no mechanism for certificates to be invalidated before their expiration date.
In the case of credential leaks, best practices are to create a new, uncompromised cluster.
{{</ warning >}}

## Cluster CA

The cluster CA is initialised with a lifetime of [10 years][cacreation]. This is unlikely to require a reset.

[ca creation]: https://github.com/kubernetes/kubernetes/blob/release-1.11/staging/src/k8s.io/client-go/util/cert/cert.go#L72

## Kubelet client certificates

On the master: 

```
$ kubeadm phase certs renew master
certs bootstrap created. Run `kubeadm phase certs renew kubelet --token <some token>
```

Run the provided command on all kubelet nodes. This re-bootstraps the trust from the master to the nodes. 

<!-- TODO: is this necessary? Are there security implications to transmitting a new cert using the existing certs --> 

## API Server

```
kubeadm phase certs renew api
```

This command will run all of the following:

### Server Certs

```
kubeadm phase certs renew api server
```

### etcd Client Certs

```
kubeadm phase certs renew api etcd-client
```

### kubelet Client Certs

```
kubeadm phase certs renew api kubelet-client
```

## Rotating Client Certificates



## Etcd 

```
kubeadm phase certs renew etcd 
```

This command will run all of the following:

### CA

The CA has a lifetime of 10 years.

### Healthcheck Certs

```
kubeadm phase certs renew etcd healthcheck
```

### Peer Certs

```
kubeadm phase certs renew etcd peer
```

### Server Certs

```
kubeadm phase certs renew etcd healthcheck
```

## Front Proxy

### CA

The CA has a lifetime of 10 years.

### Client 

```
kubeadm phase certs renew front-proxy client
```
