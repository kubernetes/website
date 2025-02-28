---
reviewers:
- liggitt
- mikedanese
- munnerz
- enj
title: Authenticating to the Kubernetes API with Client Certificates  
content_type: concept
weight: 60
---

<!-- overview -->

The Kubernetes API supports optional client certificate authentication.  To make use of it, you must:
* Ensure that `kube-apiserver` has client certificate authentication enabled,
* Generate a private key and request a client certificate using the Kubernetes API.
* Configure your client to use the private key and certificate for authentication.

Before you begin, [read about the mechanisms for requesting certificates](/docs/concepts/security/certificates).

<!-- body -->


## Configuring client certificate authentication on kube-apiserver

TODO: List flags


## Requesting a client certificate.
