---
assignees:
- bgrant0607
- erictune
- lavalamp

---

This document describes how access to the Kubernetes API is controlled.

## Overview

Users [access the API](/docs/user-guide/accessing-the-cluster) using `kubectl`,
client libraries, or by making REST requests.  Both human users and
[Kubernetes service accounts](/docs/user-guide/service-accounts/) can be
authorized for API access.
When a request reaches the API, it goes through several stages, illustrated in the
following diagram:

![Diagram of request handling steps for Kubernetes API request](/images/docs/admin/access-control-overview.svg)

## Transport Security

In a typical Kubernetes cluster, the API served on port 443.  A TLS connection is
established.  The API server presents a certificate.  This certificate is
often self-signed, so `$USER/.kube/config` on the user's machine typically
contains the root certficate for the API server's certificate, which when specified
is used in place of the system default root certificates.  This certificate is typically
automatically written into your `$USER/.kube/config` when you create a cluster yourself
using `kube-up.sh`.  If the cluster has multiple users, then the creator needs to share
the certificate with other users.

## Authentication

Once TLS is established, the HTTP request moves to the Authentication step.
This is shown as step **1** in the diagram.
The cluster creation script or cluster admin configures the API server to run
one or more Authenticator Modules.
Authenticators are described in more detail [here](/docs/admin/authentication/).

The input to the authentication step is the entire HTTP request, however, it typically
just examines the headers and/or client certificate.

Authentication modules include Client Certificates, Password, and Plain Tokens,
and JWT Tokens (used for service accounts).

Multiple authentication modules can be specified, in which case each one is tried in sequence,
until one of them succeeds.

On GCE, Client Certificates, Password, Plain Tokens, and JWT Tokens are all enabled.

If the request cannot be authenticated, it is rejected with HTTP status code 401.
Otherwise, the user is authenticated as a specific `username`, and the user name
is available to subsequent steps to use in their decisions.  Some authenticators
may also provide the group memberships of the user, while other authenticators
do not (and expect the authorizer to determine these).

While Kubernetes uses "usernames" for access control decisions and in request logging,
it does not have a `user` object nor does it store usernames or other information about
users in its object store.

## Authorization

Once the request is authenticated as coming from a specific user,
it moves to a generic authorization step.  This is shown as step **2** in the
diagram. 

The input to the Authorization step are attributes of the REST request, including:
  - the username determined by the Authentication step.
  - a `verb` associated with the API request.  Most object support these common operations: `list, watch, create, update, patch, delete`.  Some objects have "special verbs"; for example pods and services can be `proxy`-ed.
  - any subresource associated with the API request (e.g. `status`).
  - the Group, Version, and Kind of the API resource (e.g. `v1 pod`, or `batch/v1 job`) being
    operated on.
  - the name and namespace of the object.

There are multiple supported Authorization Modules.  The cluster creator configures the API
server with which Authorization Modules should be used.  When multiple Authorization Modules
are configured, each is checked in sequence, and if any Module authorizes the request, 
then the request can proceed.  If all deny the request, then the request is denied (HTTP status
code 403).

The [Authorization Modules](/docs/admin/authorization) page describes what authorization modules
are available and how to configure them.    

For version 1.2, clusters created by `kube-up.sh` are configured so that no authorization is
required for any request.

As of version 1.3, clusters created by `kube-up.sh` are configured so that the ABAC authorization
modules is enabled.  However, its input file is initially set to allow all users to do all
operations.  The cluster administrator needs to edit that file, or configure a different authorizer
to restrict what users can do.


The Authorization step is designed to operate on attributes that are likely to be common to most
REST requests, such as object name, kind, etc.  This is intended to facilitate interation with
existing organization-wide or cloud-provider-wide access control systems (which may handle
other APIs besides the Kubernetes API.

Access controls and policies that depend on specific fields of specific Kinds of objects
are handled by Admission Controllers.

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

The available Admission Control Modules are described [here](docs/admin/admission-controllers/).

Once a request passes all admission controllers, it is validated using the validation routines
for the corresponding API object, and then written to the object store (shown as step **4**).


## API Server Ports and IPs 

The previous discussion applies to requests sent to the secure port of the API server
(the typical case).  The API server can actually serve on 2 ports:

By default the Kubernetes APIserver serves HTTP on 2 ports:

  1. `Localhost Port`:

          - is intended for testing and bootstrap, and for other components of the master node
	    (scheduler, controller-manager) to talk to the API
          - no TLS
          - default is port 8080, change with `--insecure-port` flag.
          - defaults IP is localhost, change with `--insecure-bind-address` flag.
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
          - authentication and authoriation modules run.

When the cluster is created by `kube-up.sh`, on Google Compute Engine (GCE),
and on several other cloud providers, the API server serves on port 443.  On
GCE, a firewall rule is configured on the project to allow external HTTPS
access to the API. Other cluster setup methods vary.

