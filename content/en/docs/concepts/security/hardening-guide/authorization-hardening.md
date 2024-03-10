---
title: Hardening Guide - Authorization 
description: >
  Information on authorization options in Kubernetes and their security properties.
content_type: concept
weight: 90
---

<!-- overview -->

Authorization in the Kubernetes ecosystem means specifying the privileges/permissions for a particular Kubernetes resource. Defining a proper authorization policy is an important step in preventing unauthorized access to clusters or privilege escalation attacks.

Kubernetes offers multiple ways to enforce permissions which are represented by various authorization modes and modules - [ Node authorization](/docs/reference/access-authn-authz/node/), [ABAC](/docs/reference/access-authn-authz/abac/), [Webhook](/docs/reference/access-authn-authz/webhook/), [RBAC](/docs/reference/access-authn-authz/rbac/). Using the RBAC mode is the most standard way of designing permissions for cluster users and the workloads. We can set the authorization mode using the `--authorization-mode` flag in the API server.

A proper authorization design helps in reducing the blast radius of any kind of attack.

<!-- body -->

### Role based access control(RBAC)

RBAC mode is a way to control access to cluster resources based on the roles of individuals within anorganization. It is the most important authorization method for both developers and admins in Kubernetes. 

It is used to restrict access for user accounts and service accounts. To check if RBAC is enabled in a cluster using `kubectl`, execute `kubectl api-version`. Enable the RBAC mode by setting `--authorization-mode` flag to RBAC in the `kube-apiserver` command line.

```
kube-apiserver --authorization-mode=RBAC
```

### Least privilege principle
 
When designing authorization policies, it is imperative to adhere to the principle of least privilege. This principle states that every user or entity should only possess the essential privileges or rights necessary to access a specific resource. This principle can be implemented effectly by following measures :- 

- Each group should be granted access only to the resources essential for its operations. Groups must not have permission to view or modify resources belonging to other groups.
- Users, user groups, and service accounts should be limited to interacting with and accessing resources within predefined namespaces. This ensures a focused and controlled access scope.
- It is crucial to refrain from using the AlwaysAllow value in the --authorization-mode flag. This value effectively disables all authorization modes, compromising the ability to enforce the principle of least privilege.
- Assigning rights using the `system:masters` group should always be avoided, as it possesses hardcoded cluster-admin rights. These rights cannot be revoked due to their hardcoded nature in the source code. Users with `system:masters` rights will always have administrative privileges. The groups who genuinely require cluster-admin rights should be provided a binding to the cluster-admin clusterrole.

### Resources to restrict to prevent privilege escalation

To prevent privilege escalation, specific measures should be taken to restrict access to critical resources within the Kubernetes environment:

- *etcd*: A crucial component storing state information and cluster Secrets, requires careful access control. Roles should be defined for users with access limited to specific keys to prevent unauthorized access, safeguarding the entire cluster.

- *kubelet*: The primary node agent operating on every node, necessitates secure configuration. The kubelet service should run with --anonymous-auth=false to enhance security. The node/proxy right should be granted judiciously, ensuring only necessary users have access to the Kubelet API and preventing evasion of Kubernetes admission control.

- *Kubernetes Dashboard* : a web-based UI for cluster interaction, poses a security risk if accessed by attackers. Users with elevated access to the dashboard can exploit vulnerabilities, including opening shell connections to pods and viewing Secrets. In the cluster role, grant users read-only permission to the dashboard, minimizing write access to mitigate the risk of cryptojacking attacks.

- *Kubernetes Secret* : An object containing sensitive information like passwords and tokens, demand controlled access. Unrestricted access to Secrets should be avoided to limit exposure to potential attackers. Admission controllers should be used to restrict access to only for necessary components.

- *Kubernetes API* : It is an HTTP API for querying and modifying cluster objects, is critical for communication. Unrestricted access to the API poses risks, including resource modifications, data breaches, and potential cluster takeovers. Implement RBAC policies with minimal verbs, ensuring that users have only the necessary permissions to interact with the Kubernetes API securely.

### Admission controllers

You can extend the built-in RBAC policies using the validation admission webhooks to strengthen the authorization design. 
A Kubernetes admission controller is a component of code that analyzes requests made to the Kubernetes API server and decides whether to approve them or deny them. The request gets evaluated after it has been verified and authorized by the API server before it is granted and implemented. 
This is an optional feature that may only be required for  large-scale clusters or where complex security is required. They can be adjustable for many different user-specific scenarios and environments. There are many open source and commercial implementations from which organizations can choose and enforce their specific restrictions.

### Auditing RBAC policies

As the application grows, the scope of the components expands, and the required permissions for certain resources also change. There is a high chance that any admin or developer might unknowingly give extra permission to any of the defined roles at any time. Regular reviews of the existing RBAC policies are required to check for and prevent such mistakes. There are open source tools available to audit the cluster's RBAC policies.
