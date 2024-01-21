---
title: Good practices for Kubernetes Secrets
description: >
  Principles and practices for good Secret management for cluster administrators and application developers.
content_type: concept
weight: 70
---

<!-- overview -->

{{<glossary_definition prepend="In Kubernetes, a Secret is an object that"
term_id="secret" length="all">}}

The following good practices are intended for both cluster administrators and
application developers. Use these guidelines to improve the security of your
sensitive information in Secret objects, as well as to more effectively manage
your Secrets.

<!-- body -->

## Cluster administrators

This section provides good practices that cluster administrators can use to
improve the security of confidential information in the cluster.

### Configure encryption at rest

By default, Secret objects are stored unencrypted in {{<glossary_tooltip
term_id="etcd" text="etcd">}}. You should configure encryption of your Secret
data in `etcd`. For instructions, refer to
[Encrypt Secret Data at Rest](/docs/tasks/administer-cluster/encrypt-data/).

### Configure least-privilege access to Secrets {#least-privilege-secrets}

When planning your access control mechanism, such as Kubernetes
{{<glossary_tooltip term_id="rbac" text="Role-based Access Control">}} [(RBAC)](/docs/reference/access-authn-authz/rbac/),
consider the following guidelines for access to `Secret` objects. You should
also follow the other guidelines in
[RBAC good practices](/docs/concepts/security/rbac-good-practices).

- **Components**: Restrict `watch` or `list` access to only the most
  privileged, system-level components. Only grant `get` access for Secrets if
  the component's normal behavior requires it.
- **Humans**: Restrict `get`, `watch`, or `list` access to Secrets. Only allow
  cluster administrators to access `etcd`. This includes read-only access. For
  more complex access control, such as restricting access to Secrets with
  specific annotations, consider using third-party authorization mechanisms.

{{< caution >}}
Granting `list` access to Secrets implicitly lets the subject fetch the
contents of the Secrets.
{{< /caution >}}

A user who can create a Pod that uses a Secret can also see the value of that
Secret. Even if cluster policies do not allow a user to read the Secret
directly, the same user could have access to run a Pod that then exposes the
Secret. You can detect or limit the impact caused by Secret data being exposed,
either intentionally or unintentionally, by a user with this access. Some
recommendations include:

*  Use short-lived Secrets
*  Implement audit rules that alert on specific events, such as concurrent
   reading of multiple Secrets by a single user

#### Additional ServiceAccount annotations for Secret management

You can also use the `kubernetes.io/enforce-mountable-secrets` annotation on
a ServiceAccount to enforce specific rules on how Secrets are used in a Pod.
For more details, see the [documentation on this annotation](/docs/reference/labels-annotations-taints/#enforce-mountable-secrets).

### Improve etcd management policies

Consider wiping or shredding the durable storage used by `etcd` once it is
no longer in use.

If there are multiple `etcd` instances, configure encrypted SSL/TLS
communication between the instances to protect the Secret data in transit.

### Configure access to external Secrets

{{% thirdparty-content %}}

You can use third-party Secrets store providers to keep your confidential data
outside your cluster and then configure Pods to access that information.
The [Kubernetes Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/)
is a DaemonSet that lets the kubelet retrieve Secrets from external stores, and
mount the Secrets as a volume into specific Pods that you authorize to access
the data.

For a list of supported providers, refer to
[Providers for the Secret Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).

## Developers

This section provides good practices for developers to use to improve the
security of confidential data when building and deploying Kubernetes resources.

### Restrict Secret access to specific containers

If you are defining multiple containers in a Pod, and only one of those
containers needs access to a Secret, define the volume mount or environment
variable configuration so that the other containers do not have access to that
Secret.

### Protect Secret data after reading

Applications still need to protect the value of confidential information after
reading it from an environment variable or volume. For example, your
application must avoid logging the secret data in the clear or transmitting it
to an untrusted party.

### Avoid sharing Secret manifests

If you configure a Secret through a
{{< glossary_tooltip text="manifest" term_id="manifest" >}}, with the secret
data encoded as base64, sharing this file or checking it in to a source
repository means the secret is available to everyone who can read the manifest.

{{< caution >}}
Base64 encoding is _not_ an encryption method, it provides no additional
confidentiality over plain text.
{{< /caution >}}
