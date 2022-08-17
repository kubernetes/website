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

### Security recommendations for developers

- Applications still need to protect the value of confidential information after reading it
  from an environment variable or volume. For example, your application must avoid logging
  the secret data in the clear or transmitting it to an untrusted party.
- If you are defining multiple containers in a Pod, and only one of those
  containers needs access to a Secret, define the volume mount or environment
  variable configuration so that the other containers do not have access to that
  Secret.
- If you configure a Secret through a {{< glossary_tooltip text="manifest" term_id="manifest" >}},
  with the secret data encoded as base64, sharing this file or checking it in to a
  source repository means the secret is available to everyone who can read the manifest.
  Base64 encoding is _not_ an encryption method, it provides no additional confidentiality
  over plain text.
- When deploying applications that interact with the Secret API, you should
  limit access using
  [authorization policies](/docs/reference/access-authn-authz/authorization/) such as
  [RBAC](/docs/reference/access-authn-authz/rbac/).
- In the Kubernetes API, `watch` and `list` requests for Secrets within a namespace
  are extremely powerful capabilities. Avoid granting this access where feasible, since
  listing Secrets allows the clients to inspect the values of every Secret in that
  namespace.

## Cluster administrators

### Configure encryption at rest

By default, Secret objects are stored unencrypted in {{<glossary_tooltip
term_id="etcd" text="etcd">}}. You should configure encryption of your Secret
data in `etcd`. For instructions, refer to [Encrypt Secret data at
rest](/docs/tasks/administer-cluster/encrypt-data/).

### Configure RBAC policies for Secrets

When planning your {{<glossary_tooltip term_id="rbac" text="Role-based Access Control">}} [(RBAC)](/docs/reference/access-authn-authz/rbac/) policies,
consider the following guidelines for `Secret` objects. You should also follow the other guidelines in [RBAC good practices](/docs/concepts/security/rbac-good-practices).

{{< caution >}}
A user who can create a Pod that uses a Secret can also see the value of that Secret. Even
if cluster policies do not allow a user to read the Secret directly, the same user could
have access to run a Pod that then exposes the Secret.
{{< /caution >}}

- Restrict `watch` or `list` access to only the most privileged, system-level
  components.
- In the API server, objects (including Secrets) are persisted into
  {{< glossary_tooltip term_id="etcd" >}}; therefore:
- Only allow cluster admistrators to access `etcd`. This includes read-only access.

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
