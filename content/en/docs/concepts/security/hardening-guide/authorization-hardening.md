---
title: Hardening Guide - Authorization 
description: >
  Information on authorization options in Kubernetes and their security properties.
content_type: concept
weight: 90
---

<!-- overview -->

# Authorization

Authorization in Kubernetes ecosystem means specifying the privileges/permissions for a particular kubernetes resource. Defining a proper
authorization policy is an important step in preventing unauthorized access to the clusters or privilege escalation attacks. Kubernetes offers
multiple ways to enforce permissions which are represented by various authorization modes and modules - Node authorization, ABAC, Webhook,
RBAC. Using the RBAC mode is the most standard way of designing permissions for cluster users and the workloads. We can set the authorization
mode using the `--authorization-mode` flag in kube api server. A proper Authorization design helps in reducing the blast radius of any kind of
attack.

<!-- body -->

### RBAC (Role Based Access Control)

RBAC mode is enabled by default and is one method to control access to cluster resources based on the roles of individuals within an
organization. It is the most important authorization method for both developers and admins in Kubernetes. It is used to restrict access for
user accounts and service accounts. To check if RBAC is enabled in a cluster using kubectl, execute `kubectl api-version`. The RBAC mode can be
enabled by setting the RBAC value with --authorizationmode flag in kube api server command.

> `kube-apiserver --authorization-mode=RBAC`

### Least Privilege Principal

- The principal of least privilege should always be followed while designing the authorization policies. This principle states that any user or
  entity should have only the required privileges/rights to access any particular resource.

- Each group should only have access to the resources that they need and should not be allowed to view or alter the resources of other groups.
  Users, user groups, and service accounts should only be able to interact with and access resources within certain namespaces.

- We should never use _AlwaysAllow_ value in the authorization-mode flags, since it basically disables all the authorization modes, limiting
  the ability to enforce the least privilege for access.

- Using the _system:masters_ group for assigning rights should always be avoided, since this group has hard-coded cluster-admin rights which
  cannot be revoked (it’s hardcoded in the source code). Any user having this right will always be admin. A recommendation would be that if
  people really need cluster-admin, then just provide a binding to the cluster-admin clusterrole.

### Resources to Restrict to prevent Privilege Escalation

- **_Etcd_** is a critical component which stores state information and cluster-secrets in key-value pairs in the database. Unauthorized access
  to Etcd can compromise the entire cluster. Roles for the users with only the required access to certain keys should be set.

- **_Kubelet_** is a primary node agent which operates on every node. The kubelet service should be run with `--anonymous-auth=false`. The
  `node/proxy` right should only be given to required users, since any user with that right can access to the Kubelet API directly by evading the
  Kubernetes admission control.

- **_Kubernetes Dashboard_** is a web-based UI to interact with applications running in the cluster. Attackers with elevated access to the
  dashboard can open a shell connection to any pod, view secrets and can also use the existing resources for cryptojacking attacks. In the
  cluster role, users should only be provided with the read-only permission to the dashboard and write access should be minimized at all costs.

- **_Kubernetes Secret_** is an object that contains sensitive information, such as a password, token, or key, which is used in the Pod
  configuration or container image. Unrestricted access of secrets to the components, which doesn't require them expands the attack surface. We
  can use admission controllers to define policies to restrict the use of secrets only to the required components.

- **_Kubernetes API_** is an HTTP API used to query and modify the status of Kubernetes objects. It also facilitates communication between
  users, various components inside cluster and external parties. Unrestricted access to this API may lead to resource modifications, data
  breaches or even a cluster takeover. RBAC policies with minimum verbs should be assigned to any user.

### Auditing RBAC Policies

As the application grows, the scope of the components expands and the required permissions of certain resources also changes. There is a very
high chance that any admin or developer might unknowingly give extra permission to any of the defined roles any time. Regular reviews of the
existing RBAC policies are required to check and prevent any such. We can use the below tools to audit and make a check for risky permissions
in the existing RBAC policies defined in the cluster.

- [K8s-rbac-audit](https://github.com/cyberark/kubernetes-rbac-audit)
- [Krane](https://github.com/appvia/krane)
- [Kubiscan](https://github.com/cyberark/KubiScan)

### Admission Controllers

We can extend the in built RBAC policies using the Validation Webhook of Admission Controllers to strengthen the authorization design. There
can be situations when we require more policy features or granularity which RBAC or network policies provide. Kubernetes admission controllers
can help in such a scenario.

A Kubernetes admission controller is a component of code that analyzes requests made to the Kubernetes API server and decides whether to
approve them or deny them. The request gets evaluated after it has been verified and authorized by the API server before it is granted and
implemented. This is an optional feature, which may be only be required for large scale clusters or where complex security is required. They
can be adjustable for many different user-specific scenarios and environments. There are many open source and commercial implementations from
which organizations can choose and enforce their specific restrictions.
