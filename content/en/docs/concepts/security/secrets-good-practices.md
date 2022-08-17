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

### Security recommendations for cluster administrators

{{< caution >}}
A user who can create a Pod that uses a Secret can also see the value of that Secret. Even
if cluster policies do not allow a user to read the Secret directly, the same user could
have access to run a Pod that then exposes the Secret.
{{< /caution >}}

- Reserve the ability to `watch` or `list` all secrets in a cluster (using the Kubernetes
  API), so that only the most privileged, system-level components can perform this action.
- When deploying applications that interact with the Secret API, you should
  limit access using
  [authorization policies](/docs/reference/access-authn-authz/authorization/) such as
  [RBAC](/docs/reference/access-authn-authz/rbac/).
- In the API server, objects (including Secrets) are persisted into
  {{< glossary_tooltip term_id="etcd" >}}; therefore:
  - only allow cluster admistrators to access etcd (this includes read-only access);
  - enable [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
    for Secret objects, so that the data of these Secrets are not stored in the clear
    into {{< glossary_tooltip term_id="etcd" >}};
  - consider wiping / shredding the durable storage used by etcd once it is
    no longer in use;
  - if there are multiple etcd instances, make sure that etcd is
    using SSL/TLS for communication between etcd peers.