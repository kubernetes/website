---
reviewers:
- jcbsmpsn
- mikedanese
title: Certificate Rotation
content_template: templates/task
---

{{% capture overview %}}
This page shows how to enable and configure certificate rotation for the kubelet.
{{% /capture %}}

{{% capture prerequisites %}}

* Kubernetes version 1.8.0 or later is required

* Kubelet certificate rotation is beta in 1.8.0 which means it may change without notice.

{{% /capture %}}

{{% capture steps %}}

## Overview

The kubelet uses certificates for authenticating to the Kubernetes API and for TLS connections
serving its clients. By default, these certificates are issued with one year expiration
so that they do not need to be renewed too frequently.

Kubernetes contains kubelet client and server certificate rotation, features
that will automatically request a new certificate from
the Kubernetes `certificates` API as the current certificate approaches expiration. Once the
new certificate is available, it will be used for authenticating connections to
the Kubernetes API or serving the clients.

## Enabling client certificate rotation

The `kubelet` client certificate rotation can be enabled via the `RotateCertificates`
field in the kubelet's [configuration file](/docs/tasks/administer-cluster/kubelet-config-file)
(the `--rotate-certificates` flag is now deprecated and will be removed in the future releases).
When enabled, the kubelet will automatically request a new certificate as the expiration of
the certificate currently in use approaches.

## Enabling server certificate rotation

The server certificate rotation is disabled by default and must be enabled
first via `RotateKubeletServerCertificate` feature gate by adding

```
--feature-gates=RotateKubeletServerCertificate=true
```

to the kubelet's parameters.

Next, the feature can be toggled via the `ServerTLSBootstrap`
field in the kubelet's [configuration file](/docs/tasks/administer-cluster/kubelet-config-file).
When enabled, the kubelet will automatically request a certificate from the `certificates`
API instead of using a self-signed certificate. The rotation also ensures a new certificate
is requested as the expiration of the certificate currently in use approaches.

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

{{% /capture %}}


