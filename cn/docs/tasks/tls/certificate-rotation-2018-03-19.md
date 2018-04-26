---
reviewers:
- jcbsmpsn
- mikedanese
title: Certificate Rotation
---

{% capture overview %}
This page shows how to enable and configure certificate rotation for the kubelet.
{% endcapture %}

{% capture prerequisites %}

* Kubernetes version 1.8.0 or later is required

* Kubelet certificate rotation is beta in 1.8.0 which means it may change without notice.

{% endcapture %}

{% capture steps %}

## Overview

The kubelet uses certificates for authenticating to the Kubernetes API.  By
default, these certificates are issued with one year expiration so that they do
not need to be renewed too frequently.

Kubernetes 1.8 contains [kubelet certificate
rotation](/docs/tasks/administer-cluster/certificate-rotation/), a beta feature
that will automatically generate a new key and request a new certificate from
the Kubernetes API as the current certificate approaches expiration. Once the
new certificate is available, it will be used for authenticating connections to
the Kubernetes API.

## Enabling client certificate rotation

The `kubelet` process accepts an argument `--rotate-certificates` that controls
if the kubelet will automatically request a new certificate as the expiration of
the certificate currently in use approaches.  Since certificate rotation is a
beta feature, the feature flag must also be enabled with
`--feature-gates=RotateKubeletClientCertificate=true`.


The `kube-controller-manager` process accepts an argument
`--experimental-cluster-signing-duration` that controls how long certificates
will be issued for.

## Understanding the certificate rotation configuration

When a kubelet starts up, if it is configured to bootstrap (using the
`--bootstrap-kubeconfig` flag), it will use its initial certificate to connect
to the Kubernetes API and issue a certificate signing request. You can view the
status of certificate signing requests using:

```sh
kubectl get csr
```

Initially a certificate signing request from the kubelet on a node will have a
status of `Pending`. If the certificate signing requests meets specific
criteria, it will be auto approved by the controller manager, then it will have
a status of `Approved`. Next, the controller manager will sign a certificate,
issued for the duration specified by the
`--experimental-cluster-signing-duration` parameter, and the signed certificate
will be attached to the certificate signing requests.

The kubelet will retrieve the signed certificate from the Kubernetes API and
write that to disk, in the location specified by `--cert-dir`. Then the kubelet
will use the new certificate to connect to the Kubernetes API.

As the expiration of the signed certificate approaches, the kubelet will
automatically issue a new certificate signing request, using the Kubernetes
API. Again, the controller manager will automatically approve the certificate
request and attach a signed certificate to the certificate signing request. The
kubelet will retrieve the new signed certificate from the Kubernetes API and
write that to disk. Then it will update the connections it has to the
Kubernetes API to reconnect using the new certificate.

{% endcapture %}

{% include templates/task.md %}
