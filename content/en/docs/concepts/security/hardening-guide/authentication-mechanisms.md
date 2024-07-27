---
title: Hardening Guide - Authentication Mechanisms
description: >
  Information on authentication options in Kubernetes and their security properties.
content_type: concept
weight: 90
---

<!-- overview -->

Selecting the appropriate authentication mechanism(s) is a crucial aspect of securing your cluster.
Kubernetes provides several built-in mechanisms, each with its own strengths and weaknesses that 
should be carefully considered when choosing the best authentication mechanism for your cluster.

In general, it is recommended to enable as few authentication mechanisms as possible to simplify 
user management and prevent cases where users retain access to a cluster that is no longer required.

It is important to note that Kubernetes does not have an in-built user database within the cluster. 
Instead, it takes user information from the configured authentication system and uses that to make 
authorization decisions. Therefore, to audit user access, you need to review credentials from every 
configured authentication source.

For production clusters with multiple users directly accessing the Kubernetes API, it is 
recommended to use external authentication sources such as OIDC. The internal authentication 
mechanisms, such as client certificates and service account tokens, described below, are not 
suitable for this use-case.

<!-- body -->

## X.509 client certificate authentication {#x509-client-certificate-authentication}

Kubernetes leverages [X.509 client certificate](/docs/reference/access-authn-authz/authentication/#x509-client-certificates) 
authentication for system components, such as when the Kubelet authenticates to the API Server. 
While this mechanism can also be used for user authentication, it might not be suitable for 
production use due to several restrictions:

- Client certificates cannot be individually revoked. Once compromised, a certificate can be used 
  by an attacker until it expires. To mitigate this risk, it is recommended to configure short 
  lifetimes for user authentication credentials created using client certificates.
- If a certificate needs to be invalidated, the certificate authority must be re-keyed, which 
can introduce availability risks to the cluster.
- There is no permanent record of client certificates created in the cluster. Therefore, all 
issued certificates must be recorded if you need to keep track of them.
- Private keys used for client certificate authentication cannot be password-protected. Anyone 
who can read the file containing the key will be able to make use of it.
- Using client certificate authentication requires a direct connection from the client to the 
API server with no intervening TLS termination points, which can complicate network architectures.
- Group data is embedded in the `O` value of the client certificate, which means the user's group 
memberships cannot be changed for the lifetime of the certificate.

## Static token file {#static-token-file}

Although Kubernetes allows you to load credentials from a 
[static token file](/docs/reference/access-authn-authz/authentication/#static-token-file) located 
on the control plane node disks, this approach is not recommended for production servers due to 
several reasons:

- Credentials are stored in clear text on control plane node disks, which can be a security risk.
- Changing any credential requires a restart of the API server process to take effect, which can 
impact availability.
- There is no mechanism available to allow users to rotate their credentials. To rotate a 
credential, a cluster administrator must modify the token on disk and distribute it to the users.
- There is no lockout mechanism available to prevent brute-force attacks.

## Bootstrap tokens {#bootstrap-tokens}

[Bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) are used for joining 
nodes to clusters and are not recommended for user authentication due to several reasons:

- They have hard-coded group memberships that are not suitable for general use, making them 
unsuitable for authentication purposes.
- Manually generating bootstrap tokens can lead to weak tokens that can be guessed by an attacker, 
which can be a security risk.
- There is no lockout mechanism available to prevent brute-force attacks, making it easier for 
attackers to guess or crack the token.

## ServiceAccount secret tokens {#serviceaccount-secret-tokens}

[Service account secrets](/docs/reference/access-authn-authz/service-accounts-admin/#manual-secret-management-for-serviceaccounts) 
are available as an option to allow workloads running in the cluster to authenticate to the 
API server. In Kubernetes < 1.23, these were the default option, however, they are being replaced 
with TokenRequest API tokens. While these secrets could be used for user authentication, they are 
generally unsuitable for a number of reasons:

- They cannot be set with an expiry and will remain valid until the associated service account is deleted.
- The authentication tokens are visible to any cluster user who can read secrets in the namespace 
that they are defined in.
- Service accounts cannot be added to arbitrary groups complicating RBAC management where they are used.

## TokenRequest API tokens {#tokenrequest-api-tokens}

The TokenRequest API is a useful tool for generating short-lived credentials for service 
authentication to the API server or third-party systems. However, it is not generally recommended 
for user authentication as there is no revocation method available, and distributing credentials 
to users in a secure manner can be challenging.

When using TokenRequest tokens for service authentication, it is recommended to implement a short 
lifespan to reduce the impact of compromised tokens.

## OpenID Connect token authentication {#openid-connect-token-authentication}

Kubernetes supports integrating external authentication services with the Kubernetes API using 
[OpenID Connect (OIDC)](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens). 
There is a wide variety of software that can be used to integrate Kubernetes with an identity 
provider. However, when using OIDC authentication for Kubernetes, it is important to consider the 
following hardening measures:

- The software installed in the cluster to support OIDC authentication should be isolated from 
general workloads as it will run with high privileges.
- Some Kubernetes managed services are limited in the OIDC providers that can be used.
- As with TokenRequest tokens, OIDC tokens should have a short lifespan to reduce the impact of 
compromised tokens.

## Webhook token authentication {#webhook-token-authentication}

[Webhook token authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) 
is another option for integrating external authentication providers into Kubernetes. This mechanism 
allows for an authentication service, either running inside the cluster or externally, to be 
contacted for an authentication decision over a webhook. It is important to note that the suitability 
of this mechanism will likely depend on the software used for the authentication service, and there 
are some Kubernetes-specific considerations to take into account.

To configure Webhook authentication, access to control plane server filesystems is required. This 
means that it will not be possible with Managed Kubernetes unless the provider specifically makes it 
available. Additionally, any software installed in the cluster to support this access should be 
isolated from general workloads, as it will run with high privileges.

## Authenticating proxy {#authenticating-proxy}

Another option for integrating external authentication systems into Kubernetes is to use an 
[authenticating proxy](/docs/reference/access-authn-authz/authentication/#authenticating-proxy). 
With this mechanism, Kubernetes expects to receive requests from the proxy with specific header 
values set, indicating the username and group memberships to assign for authorization purposes. 
It is important to note that there are specific considerations to take into account when using 
this mechanism.

Firstly, securely configured TLS must be used between the proxy and Kubernetes API server to 
mitigate the risk of traffic interception or sniffing attacks. This ensures that the communication 
between the proxy and Kubernetes API server is secure.

Secondly, it is important to be aware that an attacker who is able to modify the headers of the 
request may be able to gain unauthorized access to Kubernetes resources. As such, it is important 
to ensure that the headers are properly secured and cannot be tampered with.