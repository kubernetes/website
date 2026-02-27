---
layout: blog
title: "Securing Production Debugging in Kubernetes"
draft: true
slug: securing-production-debugging-in-kubernetes
author: >
  Shridivya Sharma
---

During production debugging, the fastest route is often broad access such as `cluster-admin` (very high-level admin access to a Kubernetes cluster, similar to how Contributor in Azure or PowerUser-style access in AWS gives broad access to resources), shared bastions/jump boxes, or long-lived SSH keys. It works in the moment, but it comes with two common problems: auditing becomes difficult, and temporary exceptions have a way of becoming routine.

This post offers my recommendations for good practices applicable to existing Kubernetes environments with minimal tooling changes:

- Least privilege with RBAC 
- Short-lived, identity-bound credentials
- An SSH-style handshake model for cloud-native debugging 

A good architecture for securing production debugging workflows is to use a just-in-time secure shell gateway
(often deployed as an on demand pod in the cluster).
It acts as an SSH-style “front door” that makes temporary access actually temporary. You can 
authenticate with short-lived, identity-bound credentials, establish a session to the gateway,
and the gateway uses the Kubernetes API and RBAC to control what they can do such as `pods/log`, `pods/exec`, and `pods/portforward`.
Sessions expire automatically, and both the gateway logs and Kubernetes audit logs capture who accessed what and when without shared bastion accounts or long-lived keys.


## 1) Using an access broker on top of Kubernetes RBAC

RBAC is about control: who can do what. Many Kubernetes environments rely primarily on RBAC for authorization, although Kubernetes also supports other authorization modes such as Webhook authorization. You can enforce it directly with Kubernetes RBAC, or put an access broker/gateway in front of the cluster that still relies on Kubernetes permissions under the hood. That access broker is useful for decisions RBAC does not cover well, like whether a request should be auto-approved or require manual approval, can a user run a command or not, and what kind of commands are allowed for sessions. This access broker will also be responsible for managing group membership, so permissions are granted at the group level rather than to individual users. Kubernetes RBAC can decide whether someone is allowed to use actions like `pods/exec`, but it can not limit which commands run inside an exec session. An access broker can add those extra guardrails, while RBAC remains the source of truth for what the Kubernetes API will allow and at what scope.

With that model, Kubernetes RBAC defines the allowed actions for a group (for example, an on-call team in a single namespace). The broker or identity provider then adds or removes users from that group as needed. The broker can also enforce extra policy on top, like which commands are permitted in an interactive session and which requests can be auto-approved versus require manual approval. That policy can live in a JSON or XML file and be maintained through code review, so updates go through a formal pull request and are reviewed like any other production change.

### Example: a namespaced on-call debug Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: oncall-debug
  namespace: <namespace>
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
```

Bind the Role to a group (rather than individual users) so membership can be managed through your identity provider:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: oncall-debug
  namespace: <namespace>
subjects:
  - kind: Group
    name: oncall-<team-name>
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: oncall-debug
  apiGroup: rbac.authorization.k8s.io
```

## 2) Short-lived, identity-bound credentials

The goal is to use short-lived, identity-bound credentials that clearly tie a session to a real person and expire quickly. These credentials can include the user’s identity and the scope of what they’re allowed to do. They’re typically signed using a private key that stays with the engineer, such as a hardware-backed key (for example, a YubiKey), so they can not be forged without access to that key.

You can implement this with Kubernetes-native auth (for example, client certificates or an OIDC-based flow), or have the access broker from the previous section issue short-lived credentials on the user’s behalf. In many setups, Kubernetes still uses RBAC to enforce permissions based on the authenticated identity and groups/claims. If you use an access broker, it can also encode additional scope constraints in the credential and enforce them during the session, such as which cluster or namespace the session applies to and which actions (or approved commands) are allowed against pods or nodes. In either case, the credentials should be signed by a certificate authority (CA), and that CA should be rotated on a regular schedule (for example, quarterly) to limit long-term risk.

### Option A: short-lived OIDC tokens

A lot of managed Kubernetes clusters already give you short-lived tokens. The main thing is to make sure your kubeconfig refreshes them automatically  instead of copying a long-lived token into the file.

For example:

```yaml
users:
- name: oncall
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1
      command: cred-helper
      args: ["--cluster=prod", "--ttl=30m"]
```

### Option B: Short-lived client certificates (X.509)

If your API server (or your access broker from the previous session) is set up to trust a client CA, you can use short-lived client certificates for debugging access. The idea is:

* The private key is created and kept under the engineer’s machine (ideally hardware-backed, like a non-exportable key in a YubiKey/PIV token)
* A short-lived certificate is issued (often via the
  [CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests) API, or your access broker from the previous session with a TTL)
* RBAC maps the authenticated identity to a minimal Role

This is pretty straightforward to operationalize with the Kubernetes CertificateSigningRequest API.

Generate a key and CSR locally:

```bash
# Generate a private key.
# This could instead be generated within a hardware token;
# OpenSSL and several similar tools include support for that.
openssl genpkey -algorithm Ed25519 -out oncall.key

openssl req -new -key oncall.key -out oncall.csr \
  -subj "/CN=user/O=oncall-payments"
```

Create a CertificateSigningRequest with a short expiration:

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: oncall-<user>-20260218
spec:
  request: <base64-encoded oncall.csr>
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 1800  # 30 minutes
  usages:
    - client auth
```
After the CSR is approved and signed, you extract the issued certificate and use it together with the private key to authenticate, for example via kubectl.

## 3) Use a Just-in-time access gateway to run debugging commands

Once you have short-lived credentials, you can use them to open a secure shell session to a just-in-time access gateway, often exposed over SSH and created on demand. If the gateway is exposed over SSH, a common pattern is to issue the engineer a short-lived OpenSSH user certificate for the session. The gateway trusts your SSH user CA, authenticates the engineer at connection time, and then applies the approved session policy before making Kubernetes API calls on the user’s behalf. OpenSSH certificates are separate from Kubernetes X.509 client certificates, so these are usually treated as distinct layers.

The resulting session should also be scoped so it cannot be reused outside of what was approved. For example, the gateway or broker can limit it to a specific cluster and namespace, and optionally to a narrower target such as a pod or node. That way, even if someone tries to reuse the access, it will not work outside the intended scope. After the session is established, the gateway executes only the allowed actions and records what happened for auditing.



### Example: Namespace-scoped role bindings
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: jit-debug
  namespace: <namespace>
  annotations:
    kubernetes.io/description: >
      Colleagues performing semi-privileged debugging, with access provided
      just in time and on demand.
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: jit-debug
  namespace: <namespace>
subjects:
  - kind: Group
    name: jit:oncall:<namespace>   # mapped from the short-lived credential (cert/OIDC)
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: jit-debug
  apiGroup: rbac.authorization.k8s.io
```
This RBAC policy allows debugging only within the specified namespace; attempts to access other namespaces are denied by RBAC.
### Example: Cluster-scoped role binding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: jit-cluster-read
rules:
  - apiGroups: [""]
    resources: ["nodes", "namespaces"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: jit-cluster-read
subjects:
  - kind: Group
    name: jit:oncall:cluster
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: jit-cluster-read
  apiGroup: rbac.authorization.k8s.io

```
This RBAC policy grants cluster-wide read access (for example, to nodes and namespaces) and should be used only for workflows that truly require cluster-scoped resources.

Finer-grained restrictions like “only this pod/node” or “only these commands” are typically enforced by the access gateway/broker during the session, but Kubernetes also offers other options, such as ValidatingAdmissionPolicy for restricting writes and webhook authorization for custom authorization across verbs.

In environments with stricter access controls, you can add an extra, short-lived session mediation layer to separate session establishment from privileged actions. Both layers are ephemeral, use identity-bound expiring credentials, and produce independent audit trails. The mediation layer handles session setup/forwarding, while the execution layer performs only RBAC-authorized Kubernetes actions. This separation can reduce exposure by narrowing responsibilities, scoping credentials per step, and enforcing end-to-end session expiry.

## References

- [Authorization](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)
- [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [Authenticating](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)
- [Certificates and Certificate Signing Requests](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/)
- [Issue a Certificate for a Kubernetes API Client Using a CertificateSigningRequest](https://kubernetes.io/docs/tasks/tls/certificate-issue-client-csr/)
- [Role Based Access Control Good Practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/)


Disclaimer: The views expressed in this post are solely those of the author and do not reflect the views of the author’s employer or any other organization.
