---
reviewers:
- erictune
- lavalamp
title: Controlling Access to the Kubernetes API
content_template: templates/concept
weight: 5
---

{{% capture overview %}}
This page provides an overview of controlling access to the Kubernetes API.
{{% /capture %}}

{{% capture body %}}
Users [access the API](/docs/tasks/access-application-cluster/access-cluster/) using `kubectl`,
client libraries, or by making REST requests.  Both human users and
[Kubernetes service accounts](/docs/tasks/configure-pod-container/configure-service-account/) can be
authorized for API access.
When a request reaches the API, it goes through several stages, illustrated in the
following diagram:

![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)

## Transport Security

In a typical Kubernetes cluster, the API serves on port 443.
The API server presents a certificate. This certificate is
often self-signed, so `$USER/.kube/config` on the user's machine typically
contains the root certificate for the API server's certificate, which when specified
is used in place of the system default root certificate.  This certificate is typically
automatically written into your `$USER/.kube/config` when you create a cluster yourself
using `kube-up.sh`.  If the cluster has multiple users, then the creator needs to share
the certificate with other users.

## Authentication

Once TLS is established, the HTTP request moves to the Authentication step.
This is shown as step **1** in the diagram.
The cluster creation script or cluster admin configures the API server to run
one or more Authenticator Modules.
Authenticators are described in more detail [here](/docs/reference/access-authn-authz/authentication/).

The input to the authentication step is the entire HTTP request, however, it typically
just examines the headers and/or client certificate.

Authentication modules include Client Certificates, Password, and Plain Tokens,
Bootstrap Tokens, and JWT Tokens (used for service accounts).

Multiple authentication modules can be specified, in which case each one is tried in sequence,
until one of them succeeds.

On GCE, Client Certificates, Password, Plain Tokens, and JWT Tokens are all enabled.

If the request cannot be authenticated, it is rejected with HTTP status code 401.
Otherwise, the user is authenticated as a specific `username`, and the user name
is available to subsequent steps to use in their decisions.  Some authenticators
also provide the group memberships of the user, while other authenticators
do not.

While Kubernetes uses `usernames` for access control decisions and in request logging,
it does not have a `user` object nor does it store usernames or other information about
users in its object store.

## Authorization

After the request is authenticated as coming from a specific user, the request must be authorized. This is shown as step **2** in the diagram. 

A request must include the username of the requester, the requested action, and the object affected by the action. The request is authorized if an existing policy declares that the user has permissions to complete the requested action. 

For example, if Bob has the policy below, then he can read pods only in the namespace `projectCaribou`:

```json
{
    "apiVersion": "abac.authorization.kubernetes.io/v1beta1",
    "kind": "Policy",
    "spec": {
        "user": "bob",
        "namespace": "projectCaribou",
        "resource": "pods",
        "readonly": true
    }
}
```
If Bob makes the following request, the request is authorized because he is allowed to read objects in the `projectCaribou` namespace:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "projectCaribou",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    }
  }
}
```
If Bob makes a request to write (`create` or `update`) to the objects in the `projectCaribou` namespace, his authorization is denied. If Bob makes a request to read (`get`) objects in a different namespace such as `projectFish`, then his authorization is denied. 

Kubernetes authorization requires that you use common REST attributes to interact with existing organization-wide or cloud-provider-wide access control systems. It is important to use REST formatting because these control systems might interact with other APIs besides the Kubernetes API.

Kubernetes supports multiple authorization modules, such as ABAC mode, RBAC Mode, and Webhook mode. When an administrator creates a cluster, they configured the authorization modules that should be used in the API server. If more than one authorization modules are configured, Kubernetes checks each module, and if any module authorizes the request, then the request can proceed. If all of the modules deny the request, then the request is denied (HTTP status code 403).

To learn more about Kubernetes authorization, including details about creating policies using the supported authorization modules, see [Authorization Overview](/docs/reference/access-authn-authz/authorization/).


## Admission Control

Admission Control Modules are software modules that can modify or reject requests.
In addition to the attributes available to Authorization Modules, Admission
Control Modules can access the contents of the object that is being created or updated.
They act on objects being created, deleted, updated or connected (proxy), but not reads.

Multiple admission controllers can be configured.  Each is called in order.

This is shown as step **3** in the diagram.

Unlike Authentication and Authorization Modules, if any admission controller module
rejects, then the request is immediately rejected.

In addition to rejecting objects, admission controllers can also set complex defaults for
fields.

The available Admission Control Modules are described [here](/docs/reference/access-authn-authz/admission-controllers/).

Once a request passes all admission controllers, it is validated using the validation routines
for the corresponding API object, and then written to the object store (shown as step **4**).


## API Server Ports and IPs

The previous discussion applies to requests sent to the secure port of the API server
(the typical case).  The API server can actually serve on 2 ports:

By default the Kubernetes API server serves HTTP on 2 ports:

  1. `Localhost Port`:

      - is intended for testing and bootstrap, and for other components of the master node
        (scheduler, controller-manager) to talk to the API
      - no TLS
      - default is port 8080, change with `--insecure-port` flag.
      - default IP is localhost, change with `--insecure-bind-address` flag.
      - request **bypasses** authentication and authorization modules.
      - request handled by admission control module(s).
      - protected by need to have host access

  2. `Secure Port`:

      - use whenever possible
      - uses TLS.  Set cert with `--tls-cert-file` and key with `--tls-private-key-file` flag.
      - default is port 6443, change with `--secure-port` flag.
      - default IP is first non-localhost network interface, change with `--bind-address` flag.
      - request handled by authentication and authorization modules.
      - request handled by admission control module(s).
      - authentication and authorization modules run.

When the cluster is created by `kube-up.sh`, on Google Compute Engine (GCE),
and on several other cloud providers, the API server serves on port 443.  On
GCE, a firewall rule is configured on the project to allow external HTTPS
access to the API. Other cluster setup methods vary.
{{% /capture %}}
