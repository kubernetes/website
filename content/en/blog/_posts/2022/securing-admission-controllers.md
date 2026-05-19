---
layout: blog
title: "Securing Admission Controllers"
date: 2022-01-19
slug: secure-your-admission-controllers-and-webhooks
author: >
   Rory McCune (Aqua Security)
---

[Admission control](/docs/reference/access-authn-authz/admission-controllers/) is a key part of Kubernetes security, alongside authentication and authorization. Webhook admission controllers are extensively used to help improve the security of Kubernetes clusters in a variety of ways including restricting the privileges of workloads and ensuring that images deployed to the cluster meet organization’s security requirements.

However, as with any additional component added to a cluster, security risks can present themselves. A security risk example is if the deployment and management of the admission controller are not handled correctly. To help admission controller users and designers manage these risks appropriately, the [security documentation](https://github.com/kubernetes/community/tree/master/sig-security#security-docs) subgroup of SIG Security has spent some time developing a [threat model for admission controllers](https://github.com/kubernetes/sig-security/tree/main/sig-security-docs/papers/admission-control). This threat model looks at likely risks which may arise from the incorrect use of admission controllers, which could allow security policies to be bypassed, or even allow an attacker to get unauthorised access to the cluster.

From the threat model, we developed a set of security best practices that should be adopted to ensure that cluster operators can get the security benefits of admission controllers whilst avoiding any risks from using them.

## Admission controllers and good practices for security

From the threat model, a couple of themes emerged around how to ensure the security of admission controllers.

### Secure webhook configuration

It’s important to ensure that any security component in a cluster is well configured and admission controllers are no different here. There are a couple of security best practices to consider when using admission controllers

* **Correctly configured TLS for all webhook traffic**. Communications between the API server and the admission controller webhook should be authenticated and encrypted to ensure that attackers who may be in a network position to view or modify this traffic cannot do so. To achieve this access the API server and webhook must be using certificates from a trusted certificate authority so that they can validate their mutual identities
* **Only authenticated access allowed**. If an attacker can send an admission controller large numbers of requests, they may be able to overwhelm the service causing it to fail. Ensuring all access requires strong authentication should mitigate that risk.
* **Admission controller fails closed**. This is a security practice that has a tradeoff, so whether a cluster operator wants to configure it will depend on the cluster’s threat model. If an admission controller fails closed, when the API server can’t get a response from it, all deployments will fail. This stops attackers bypassing the admission controller by disabling it, but, can disrupt the cluster’s operation. As clusters can have multiple webhooks, one approach to hit a middle ground might be to have critical controls on a fail closed setups and less critical controls allowed to fail open.
* **Regular reviews of webhook configuration**. Configuration mistakes can lead to security issues, so it’s important that the admission controller webhook configuration is checked to make sure the settings are correct. This kind of review could be done automatically by an Infrastructure As Code scanner or manually by an administrator.


### Secure cluster configuration for admission control

In most cases, the admission controller webhook used by a cluster will be installed as a workload in the cluster. As a result, it’s important to ensure that Kubernetes' security features that could impact its operation are well configured.

* **Restrict [RBAC](/docs/reference/access-authn-authz/rbac/) rights**. Any user who has rights which would allow them to modify the configuration of the webhook objects or the workload that the admission controller uses could disrupt its operation. So it’s important to make sure that only cluster administrators have those rights.
* **Prevent privileged workloads**. One of the realities of container systems is that if a workload is given certain privileges, it will be possible to break out to the underlying cluster node and impact other containers on that node. Where admission controller services run in the cluster they’re protecting, it’s important to ensure that any requirement for privileged workloads is carefully reviewed and restricted as much as possible.
* **Strictly control external system access**. As a security service in a cluster admission controller systems will have access to sensitive information like credentials. To reduce the risk of this information being sent outside the cluster, [network policies](/docs/concepts/services-networking/network-policies/) should be used to restrict the admission controller services access to external networks.
* **Each cluster has a dedicated webhook**. Whilst it may be possible to have admission controller webhooks that serve multiple clusters, there is a risk when using that model that an attack on the webhook service would have a larger impact where it’s shared. Also where multiple clusters use an admission controller there will be increased complexity and access requirements, making it harder to secure.


### Admission controller rules

A key element of any admission controller used for Kubernetes security is the rulebase it uses. The rules need to be able to accurately meet their goals avoiding false positive and false negative results. 

* **Regularly test and review rules**. Admission controller rules need to be tested to ensure their accuracy. They also need to be regularly reviewed as the Kubernetes API will change with each new version, and rules need to be assessed with each Kubernetes release to understand any changes that may be required to keep them up to date.
