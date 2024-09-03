---
reviewers:
- timstclair
- deads2k
- liggitt
title: Using Node Authorization
content_type: concept
weight: 34
---

<!-- overview -->
Node authorization is a special-purpose authorization mode that specifically
authorizes API requests made by kubelets.


<!-- body -->
## Overview

The Node authorizer allows a kubelet to perform API operations. This includes:

Read operations:

* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims and persistent volumes related
  to pods bound to the kubelet's node

{{< feature-state feature_gate_name="AuthorizeNodeWithSelectors" >}}

When the `AuthorizeNodeWithSelectors` feature is enabled
(along with the pre-requisite `AuthorizeWithSelectors` feature),
kubelets are only allowed to read their own Node objects,
and are only allowed to read pods bound to their node.

Write operations:

* nodes and node status (enable the `NodeRestriction` admission plugin to limit
  a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a
  kubelet to modify pods bound to itself)
* events

Auth-related operations:

* read/write access to the
  [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/)
  for TLS bootstrapping
* the ability to create TokenReviews and SubjectAccessReviews for delegated
  authentication/authorization checks

In future releases, the node authorizer may add or remove permissions to ensure
kubelets have the minimal set of permissions required to operate correctly.

In order to be authorized by the Node authorizer, kubelets must use a credential
that identifies them as being in the `system:nodes` group, with a username of
`system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of 
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).

The value of `<nodeName>` **must** match precisely the name of the node as
registered by the kubelet. By default, this is the host name as provided by
`hostname`, or overridden via the
[kubelet option](/docs/reference/command-line-tools-reference/kubelet/)
`--hostname-override`. However, when using the `--cloud-provider` kubelet
option, the specific hostname may be determined by the cloud provider, ignoring
the local `hostname` and the `--hostname-override` option. 
For specifics about how the kubelet determines the hostname, see the
[kubelet options reference](/docs/reference/command-line-tools-reference/kubelet/).

To enable the Node authorizer, start the apiserver with `--authorization-mode=Node`.

To limit the API objects kubelets are able to write, enable the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)
admission plugin by starting the apiserver with
`--enable-admission-plugins=...,NodeRestriction,...`

## Migration considerations

### Kubelets outside the `system:nodes` group

Kubelets outside the `system:nodes` group would not be authorized by the `Node`
authorization mode, and would need to continue to be authorized via whatever
mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets.

### Kubelets with undifferentiated usernames

In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.

The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity.

