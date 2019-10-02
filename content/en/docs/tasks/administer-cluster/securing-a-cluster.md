---
reviewers:
- smarterclayton
- liggitt
- ericchiang
- destijl
title: Securing a Cluster
content_template: templates/task
---

{{% capture overview %}}

This document covers topics related to protecting a cluster from accidental or malicious access
and provides recommendations on overall security.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Controlling access to the Kubernetes API

As Kubernetes is entirely API driven, controlling and limiting who can access the cluster and what actions
they are allowed to perform is the first line of defense.

### Use Transport Layer Security (TLS) for all API traffic

Kubernetes expects that all API communication in the cluster is encrypted by default with TLS, and the
majority of installation methods will allow the necessary certificates to be created and distributed to 
the cluster components. Note that some components and installation methods may enable local ports over 
HTTP and administrators should familiarize themselves with the settings of each component to identify 
potentially unsecured traffic.

### API Authentication

Choose an authentication mechanism for the API servers to use that matches the common access patterns 
when you install a cluster. For instance, small single user clusters may wish to use a simple certificate 
or static Bearer token approach. Larger clusters may wish to integrate an existing OIDC or LDAP server that
allow users to be subdivided into groups. 

All API clients must be authenticated, even those that are part of the infrastructure like nodes,
proxies, the scheduler, and volume plugins. These clients are typically [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/) or use x509 client certificates, and they are created automatically at cluster startup or are setup as part of the cluster installation.

Consult the [authentication reference document](/docs/reference/access-authn-authz/authentication/) for more information.

### API Authorization

Once authenticated, every API call is also expected to pass an authorization check. Kubernetes ships
an integrated [Role-Based Access Control (RBAC)](/docs/reference/access-authn-authz/rbac/) component that matches an incoming user or group to a
set of permissions bundled into roles. These permissions combine verbs (get, create, delete) with
resources (pods, services, nodes) and can be namespace or cluster scoped. A set of out of the box
roles are provided that offer reasonable default separation of responsibility depending on what
actions a client might want to perform. It is recommended that you use the [Node](/docs/reference/access-authn-authz/node/) and [RBAC](/docs/reference/access-authn-authz/rbac/) authorizers together, in combination with the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) admission plugin.

As with authentication, simple and broad roles may be appropriate for smaller clusters, but as
more users interact with the cluster, it may become necessary to separate teams into separate
namespaces with more limited roles.

With authorization, it is important to understand how updates on one object may cause actions in 
other places. For instance, a user may not be able to create pods directly, but allowing them to 
create a deployment, which creates pods on their behalf, will let them create those pods 
indirectly. Likewise, deleting a node from the API will result in the pods scheduled to that node 
being terminated and recreated on other nodes. The out of the box roles represent a balance
between flexibility and the common use cases, but more limited roles should be carefully reviewed
to prevent accidental escalation. You can make roles specific to your use case if the out-of-box ones don't meet your needs.

Consult the [authorization reference section](/docs/reference/access-authn-authz/authorization/) for more information.

## Controlling access to the Kubelet

Kubelets expose HTTPS endpoints which grant powerful control over the node and containers. By default Kubelets allow unauthenticated access to this API.

Production clusters should enable Kubelet authentication and authorization.

Consult the [Kubelet authentication/authorization reference](/docs/admin/kubelet-authentication-authorization) for more information.

## Controlling the capabilities of a workload or user at runtime

Authorization in Kubernetes is intentionally high level, focused on coarse actions on resources.
More powerful controls exist as **policies** to limit by use case how those objects act on the 
cluster, themselves, and other resources.

### Limiting resource usage on a cluster

[Resource quota](/docs/concepts/policy/resource-quotas/) limits the number or capacity of
resources granted to a namespace. This is most often used to limit the amount of CPU, memory,
or persistent disk a namespace can allocate, but can also control how many pods, services, or
volumes exist in each namespace. 

[Limit ranges](/docs/tasks/administer-cluster/memory-default-namespace/) restrict the maximum or minimum size of some of the
resources above, to prevent users from requesting unreasonably high or low values for commonly
reserved resources like memory, or to provide default limits when none are specified.


### Controlling what privileges containers run with

A pod definition contains a [security context](/docs/tasks/configure-pod-container/security-context/)
that allows it to request access to running as a specific Linux user on a node (like root),
access to run privileged or access the host network, and other controls that would otherwise
allow it to run unfettered on a hosting node. [Pod security policies](/docs/concepts/policy/pod-security-policy/) 
can limit which users or service accounts can provide dangerous security context settings. For example, pod security policies can limit volume mounts, especially `hostPath`, which are aspects of a pod that should be controlled.

Generally, most application workloads need limited access to host resources so they can 
successfully run as a root process (uid 0) without access to host information. However, 
considering the privileges associated with the root user, you should write application 
containers to run as a non-root user. Similarly, administrators who wish to prevent 
client applications from escaping their containers should use a restrictive pod security 
policy.


### Restricting network access

The [network policies](/docs/tasks/administer-cluster/declare-network-policy/) for a namespace 
allows application authors to restrict which pods in other namespaces may access pods and ports 
within their namespaces. Many of the supported [Kubernetes networking providers](/docs/concepts/cluster-administration/networking/)
now respect network policy.

Quota and limit ranges can also be used to control whether users may request node ports or
load balanced services, which on many clusters can control whether those users applications
are visible outside of the cluster.

Additional protections may be available that control network rules on a per plugin or per
environment basis, such as per-node firewalls, physically separating cluster nodes to 
prevent cross talk, or advanced networking policy.

### Restricting cloud metadata API access

Cloud platforms (AWS, Azure, GCE, etc.) often expose metadata services locally to instances.
By default these APIs are accessible by pods running on an instance and can contain cloud
credentials for that node, or provisioning data such as kubelet credentials. These credentials
can be used to escalate within the cluster or to other cloud services under the same account.

When running Kubernetes on a cloud platform limit permissions given to instance credentials, use
[network policies](/docs/tasks/administer-cluster/declare-network-policy/) to restrict pod access
to the metadata API, and avoid using provisioning data to deliver secrets.

### Controlling which nodes pods may access

By default, there are no restrictions on which nodes may run a pod.  Kubernetes offers a 
[rich set of policies for controlling placement of pods onto nodes](/docs/concepts/configuration/assign-pod-node/)
and the [taint based pod placement and eviction](/docs/concepts/configuration/taint-and-toleration/)
that are available to end users. For many clusters use of these policies to separate workloads
can be a convention that authors adopt or enforce via tooling.

As an administrator, a beta admission plugin `PodNodeSelector` can be used to force pods 
within a namespace to default or require a specific node selector, and if end users cannot 
alter namespaces, this can strongly limit the placement of all of the pods in a specific workload.


## Protecting cluster components from compromise

This section describes some common patterns for protecting clusters from compromise.

### Restrict access to etcd

Write access to the etcd backend for the API is equivalent to gaining root on the entire cluster,
and read access can be used to escalate fairly quickly. Administrators should always use strong
credentials from the API servers to their etcd server, such as mutual auth via TLS client certificates,
and it is often recommended to isolate the etcd servers behind a firewall that only the API servers
may access. 

{{< caution >}}
Allowing other components within the cluster to access the master etcd instance with
read or write access to the full keyspace is equivalent to granting cluster-admin access. Using
separate etcd instances for non-master components or using etcd ACLs to restrict read and write
access to a subset of the keyspace is strongly recommended.
{{< /caution >}}

### Enable audit logging

The [audit logger](/docs/tasks/debug-application-cluster/audit/) is a beta feature that records actions taken by the
API for later analysis in the event of a compromise. It is recommended to enable audit logging 
and archive the audit file on a secure server.

### Restrict access to alpha or beta features

Alpha and beta Kubernetes features are in active development and may have limitations or bugs
that result in security vulnerabilities. Always assess the value an alpha or beta feature may
provide against the possible risk to your security posture. When in doubt, disable features you
do not use.

### Rotate infrastructure credentials frequently

The shorter the lifetime of a secret or credential the harder it is for an attacker to make
use of that credential. Set short lifetimes on certificates and automate their rotation. Use
an authentication provider that can control how long issued tokens are available and use short
lifetimes where possible. If you use service account tokens in external integrations, plan to
rotate those tokens frequently. For example, once the bootstrap phase is complete, a bootstrap token used for setting up nodes should be revoked or its authorization removed.

### Review third party integrations before enabling them

Many third party integrations to Kubernetes may alter the security profile of your cluster. When
enabling an integration, always review the permissions that an extension requests before granting
it access. For example, many security integrations may request access to view all secrets on
your cluster which is effectively making that component a cluster admin. When in doubt, 
restrict the integration to functioning in a single namespace if possible. 

Components that create pods may also be unexpectedly powerful if they can do so inside namespaces
like the `kube-system` namespace, because those pods can gain access to service account secrets
or run with elevated permissions if those service accounts are granted access to permissive
[pod security policies](/docs/concepts/policy/pod-security-policy/).

### Encrypt secrets at rest

In general, the etcd database will contain any information accessible via the Kubernetes API
and may grant an attacker significant visibility into the state of your cluster. Always encrypt
your backups using a well reviewed backup and encryption solution, and consider using full disk
encryption where possible.

Kubernetes 1.7 contains [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/), an alpha feature that will encrypt `Secret` resources in etcd, preventing
parties that gain access to your etcd backups from viewing the content of those secrets. While
this feature is currently experimental, it may offer an additional level of defense when backups
are not encrypted or an attacker gains read access to etcd.

### Receiving alerts for security updates and reporting vulnerabilities

Join the [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce) 
group for emails about security announcements. See the [security reporting](/security/)
page for more on how to report vulnerabilities.

{{% /capture %}}


