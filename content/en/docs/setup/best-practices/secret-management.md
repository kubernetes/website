---
reviewers:
- Random-Liu
title: Kubernetes Secrets Management
weight: 60
---


Kubernetes `Secret` objects are designed to store sensitive information such as passwords, tokens, and SSH keys. However, they are **base64-encoded**, not encrypted by default, and require careful handling to ensure confidentiality, integrity, and availability.

## Why Secret Management Matters

Secrets are often a target for attackers. Mismanaged secrets can lead to serious security breaches. Following best practices helps prevent:

- Unauthorized access to confidential data
- Accidental exposure through version control
- Compromise of entire application infrastructure

---

## 1. Avoid Committing Secrets to Git.

**Bad Example:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
stringData:
  password: mydbpass123
```
This might accidentally be pushed to a Git repo.

**Best Practice:**
Use `External Secrets` or reference secrets from secure vaults, and avoid storing them in the codebase.

---

## 2. Use External Secrets Managers.

Integrate Kubernetes with:

- **HashiCorp Vault**: With Vault Agent injector
- **AWS Secrets Manager**: Using `Secrets Store CSI driver`
- **Azure Key Vault**: With pod identity integration

**Use Case:**
For dynamic secrets that expire, Vault provides short-lived DB credentials that automatically rotate.

---

## 3. Enable Encryption at Rest.

By default, secrets are stored unencrypted in etcd. Enable encryption using a Key Management System (KMS):

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - kms:
          name: myKMS
          endpoint: unix:///tmp/socketfile
```

Ensure your cloud provider’s KMS is enabled (e.g., AWS KMS, Azure Key Vault).

---

## 4. Use RBAC to Control Access.

Limit which users and service accounts can access secrets:
```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
```

---

## 5. Avoid Using Environment Variables for Secrets.

**Why:** Environment variables are exposed in process listings and logs.

**Better Approach:** Mount secrets as volumes:
```yaml
volumes:
- name: secret-volume
  secret:
    secretName: db-secret
```

---

## 6. Automate Secret Rotation.

Use tools like **Vault**, **cert-manager**, or **AWS Secrets Manager** to:
- Rotate API keys and DB credentials
- Trigger Kubernetes updates via sidecar injectors or controllers

**Example:** Vault auto-renews tokens and notifies your app through volume mounts or shared paths.

---

## 7. Audit Secret Access.

- Enable Kubernetes Audit Logs
- Use `opa-gatekeeper` or Kyverno to enforce policies
- Monitor who accesses and modifies secrets

---

## 8. Use Namespace Isolation.

Keep secrets scoped to namespaces, and limit cross-namespace access using `RoleBinding` or `NetworkPolicies`.

---

## Summary Checklist

| Practice                         | Recommended? |
|----------------------------------|--------------|
| Secrets in Git                  | ❌ No         |
| External Secret Managers        | ✅ Yes        |
| Encryption at Rest              | ✅ Yes        |
| RBAC Restrictions               | ✅ Yes        |
| Mounted Secrets (vs env vars)   | ✅ Yes        |
| Automated Rotation              | ✅ Yes        |
| Audit Access & Alerts           | ✅ Yes        |
| Namespaced Isolation            | ✅ Yes        |

---

By following these best practices, you ensure secrets in Kubernetes are managed securely, minimizing risk and aligning with zero-trust and compliance standards.
