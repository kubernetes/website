---
layout: blog
title: "Best Practices for Securing Production Debugging in Kubernetes"
draft: true
# slug: securing-production-debugging-in-kubernetes
author: >
  Shridivya Sharma
---

Production debugging is both an SRE reliability problem and a security problem. When debugging access is built on long-lived SSH keys, shared bastions, or broad `cluster-admin` rights, you get hidden failure modes:

- **Unbounded blast radius:** a “temporary” permission quietly becomes permanent.
- **Hard-to-trust postmortems:** you can’t confidently answer who did what.
- **Operational drag:** on-call workarounds become the normal path.

This post offers a practical mental model and a small checklist you can apply to your existing Kubernetes environments with minimal tooling changes:

- Least privilege with Kubernetes RBAC (scoped to namespaces, resources, and subresources)
- Short-lived, identity-bound credentials (no shared secrets; private keys stay local)
- An SSH-style handshake model for cloud-native debugging (clear separation of authentication vs authorization, plus automatic expiration)

## A mental model: treat debugging like an SSH handshake

SSH got a lot right for human access:

- Authenticate strongly
- Authorize narrowly
- Expire automatically
- Log everything

For Kubernetes debugging, map that same structure to a cluster-native workflow:

- **Authentication:** identity-bound, short-lived credentials
- **Authorization:** RBAC Roles/RoleBindings scoped to the smallest set of namespaces, resources, and verbs needed
- **Auditability:** Kubernetes audit logs + your access broker/gateway logs (if you use one)

You don’t need a new “debugging platform” to get most of the benefits; you need sharper boundaries.

### Implementation note: just-in-time SSH pod/gateway (optional pattern)

If you already use (or are considering) a JIT-SSH pod/gateway for production debugging, treat it as an SSH-style “front door” that makes temporary access actually temporary. Engineers authenticate with short-lived, identity-bound credentials, establish a session to the gateway, and the gateway maps that identity to tightly-scoped Kubernetes RBAC for actions like `pods/log`, `pods/exec`, and `pods/portforward`. Sessions expire automatically, and both the gateway logs and Kubernetes audit logs capture who accessed what and when—without shared bastion accounts or long-lived keys.


## 1) Use RBAC to scope debugging to the minimum required

A common anti-pattern is granting `cluster-admin` to “fix it fast.” That’s fast once, and expensive forever.

Instead, create a namespace-scoped Role for on-call debugging. For many teams, the minimal set includes:

- Read-only discovery: `get/list/watch` on pods, events, and relevant controllers
- Controlled interactive actions:
  - `pods/log` (`get`)
  - `pods/exec` (`create`)
  - `pods/portforward` (`create`)
- Optional (if you use `kubectl debug` with ephemeral containers): `pods/ephemeralcontainers` (`update`)

### Example: a namespaced on-call debug Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: oncall-debug
  namespace: payments
rules:
  # Discover what’s running
  - apiGroups: [""]
    resources: ["pods", "events"]
    verbs: ["get", "list", "watch"]

  # Read logs
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]

  # Interactive debugging actions
  - apiGroups: [""]
    resources: ["pods/exec", "pods/portforward"]
    verbs: ["create"]

  # Understand rollout/controller state
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]

  # Optional: allow kubectl debug ephemeral containers
  - apiGroups: [""]
    resources: ["pods/ephemeralcontainers"]
    verbs: ["update"]
````

Bind that Role to a group (not to individuals), so you can manage membership via your identity provider:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: oncall-debug
  namespace: payments
subjects:
  - kind: Group
    name: oncall-payments
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: oncall-debug
  apiGroup: rbac.authorization.k8s.io
```

Practical tips:

* Prefer Role + RoleBinding (namespace-scoped) over ClusterRole for debugging
* Be explicit about subresources (`pods/exec`, `pods/log`, `pods/portforward`)
* Don’t grant writes unless you intend to change production

## 2) Short-lived, identity-bound credentials (private keys stay local)

The goal is: engineers should never share secrets and never copy private keys around.

Two pragmatic options commonly used today:

### Option A (common): short-lived OIDC tokens via exec credentials

Many managed clusters already issue short-lived tokens. Ensure your kubeconfigs use an exec flow that refreshes automatically, rather than embedding long-lived tokens.

Conceptually, the kubeconfig looks like:

```yaml
users:
- name: oncall
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1
      command: oncall-credential-helper
      args: ["--cluster=prod", "--ttl=30m"]
```

### Option B (when you use X.509 client cert auth): short-lived client certificates

If your API server is configured to trust a client CA for user authentication, you can issue short-lived client certificates where:

* The private key is generated and kept on the engineer’s machine (preferably hardware-backed, such as a non-exportable key stored in a YubiKey / PIV token)
* The cluster (or an approval controller) signs a certificate with a tight `expirationSeconds`
* RBAC ties the authenticated identity (CN / groups) to a minimal Role

This is easiest to operationalize using the Kubernetes CSR API.

Generate a key and CSR locally:

```bash
openssl genpkey -algorithm Ed25519 -out oncall.key
openssl req -new -key oncall.key -out oncall.csr \
  -subj "/CN=alice/O=oncall-payments"
```

Create a CertificateSigningRequest with a short expiration:

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: oncall-alice-20260218
spec:
  request: <base64-encoded oncall.csr>
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 1800  # 30 minutes
  usages:
    - client auth
```

Important guardrails:

* Don’t allow engineers to approve their own CSRs
* Use an approval controller with clear policy (identity, group membership, ticket/incident reference, TTL caps)

## 3) Separate authentication from authorization (and keep both auditable)

A secure debugging workflow is easiest to reason about when the layers are clean:

**Authentication layer answers:** “Who is this?”

* OIDC token identity
* Short-lived X.509 client cert identity

**Authorization layer (RBAC) answers:** “What can they do, where?”

* Namespace scope
* Resource + subresource scope
* Verb scope

This separation is how you avoid the classic bastion failure mode: “SSH access means you can do anything.”

## 4) Time-bound access: make the safe path the easy path

Kubernetes RBAC objects don’t expire by default, so teams often leave permissions in place “just in case.”

Two practical patterns to add time bounds without a major rebuild:

1. **Short-lived credentials** (token/cert TTL) so authentication naturally expires
2. **Ephemeral RoleBindings** created for an incident and removed automatically

If you create incident-scoped RoleBindings, add an annotation you can enforce/garbage-collect:

```yaml
metadata:
  annotations:
    debugging.kubernetes.io/expires-at: "2026-02-18T23:10:00Z"
    debugging.kubernetes.io/incident: "INC-12345"
```

Then run a small controller or scheduled job that deletes expired bindings. The key is not the implementation detail; it’s making “temporary” actually mean temporary.

The fastest incident response is the one you can trust afterward. By treating production debugging as an SRE workflow built on least privilege, short-lived credentials, and strong audit trails, you reduce blast radius without slowing down the on-call path.

