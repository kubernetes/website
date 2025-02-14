---
layout: blog
title: "Kubernetes 1.30: Structured Authentication Configuration Moves to Beta"
date: 2024-04-25
slug: structured-authentication-moves-to-beta
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
---

With Kubernetes 1.30, we (SIG Auth) are moving Structured Authentication Configuration to beta.

Today's article is about _authentication_: finding out who's performing a task, and checking
that they are who they say they are. Check back in tomorrow to find about what's new in
Kubernetes v1.30 around _authorization_ (deciding what someone can and can't access).

## Motivation
Kubernetes has had a long-standing need for a more flexible and extensible
authentication system. The current system, while powerful, has some limitations
that make it difficult to use in certain scenarios. For example, it is not
possible to use multiple authenticators of the same type (e.g., multiple JWT
authenticators) or to change the configuration without restarting the API server. The
Structured Authentication Configuration feature is the first step towards
addressing these limitations and providing a more flexible and extensible way
to configure authentication in Kubernetes.

## What is structured authentication configuration?
Kubernetes v1.30 builds on the experimental support for configurating authentication based on
a file, that was added as alpha in Kubernetes v1.30. At this beta stage, Kubernetes only supports configuring JWT
authenticators, which serve as the next iteration of the existing OIDC
authenticator. JWT authenticator is an authenticator to
authenticate Kubernetes users using JWT compliant tokens. The authenticator
will attempt to parse a raw ID token, verify it's been signed by the configured 
issuer.

The Kubernetes project added configuration from a file so that it can provide more
flexibility than using command line options (which continue to work, and are still supported).
Supporting a configuration file also makes it easy to deliver further improvements in upcoming
releases.

### Benefits of structured authentication configuration
Here's why using a configuration file to configure cluster authentication is a benefit:
1. **Multiple JWT authenticators**: You can configure multiple JWT authenticators
   simultaneously. This allows you to use multiple identity providers (e.g.,
   Okta, Keycloak, GitLab) without needing to use an intermediary like Dex
   that handles multiplexing between multiple identity providers.
2. **Dynamic configuration**: You can change the configuration without
   restarting the API server. This allows you to add, remove, or modify
   authenticators without disrupting the API server.
3. **Any JWT-compliant token**: You can use any JWT-compliant token for
   authentication. This allows you to use tokens from any identity provider that
   supports JWT. The minimum valid JWT payload must contain the claims documented 
   in [structured authentication configuration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)
   page in the Kubernetes documentation.
4. **CEL (Common Expression Language) support**: You can use [CEL](/docs/reference/using-api/cel/) 
   to determine whether the token's claims match the user's attributes in Kubernetes (e.g.,
   username, group). This allows you to use complex logic to determine whether a
   token is valid.
5. **Multiple audiences**: You can configure multiple audiences for a single
   authenticator. This allows you to use the same authenticator for multiple
   audiences, such as using a different OAuth client for `kubectl` and dashboard.
6. **Using identity providers that don't support OpenID connect discovery**: You
   can use identity providers that don't support [OpenID Connect 
   discovery](https://openid.net/specs/openid-connect-discovery-1_0.html). The only
   requirement is to host the discovery document at a different location than the
   issuer (such as locally in the cluster) and specify the `issuer.discoveryURL` in
   the configuration file.

## How to use Structured Authentication Configuration
To use structured authentication configuration, you specify
the path to the authentication configuration using the `--authentication-config`
command line argument in the API server. The configuration file is a YAML file
that specifies the authenticators and their configuration. Here is an example
configuration file that configures two JWT authenticators:

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
# Someone with a valid token from either of these issuers could authenticate
# against this cluster.
jwt:
- issuer:
    url: https://issuer1.example.com
    audiences:
    - audience1
    - audience2
    audienceMatchPolicy: MatchAny
  claimValidationRules:
    expression: 'claims.hd == "example.com"'
    message: "the hosted domain name must be example.com"
  claimMappings:
    username:
      expression: 'claims.username'
    groups:
      expression: 'claims.groups'
    uid:
      expression: 'claims.uid'
    extra:
    - key: 'example.com/tenant'
      expression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')"
    message: "username cannot use reserved system: prefix"
# second authenticator that exposes the discovery document at a different location
# than the issuer
- issuer:
    url: https://issuer2.example.com
    discoveryURL: https://discovery.example.com/.well-known/openid-configuration
    audiences:
    - audience3
    - audience4
    audienceMatchPolicy: MatchAny
  claimValidationRules:
    expression: 'claims.hd == "example.com"'
    message: "the hosted domain name must be example.com"
  claimMappings:
    username:
      expression: 'claims.username'
    groups:
      expression: 'claims.groups'
    uid:
      expression: 'claims.uid'
    extra:
    - key: 'example.com/tenant'
      expression: 'claims.tenant'
  userValidationRules:
  - expression: "!user.username.startsWith('system:')"
    message: "username cannot use reserved system: prefix"
```

## Migration from command line arguments to configuration file
The Structured Authentication Configuration feature is designed to be
backwards-compatible with the existing approach, based on command line options, for 
configuring the JWT authenticator. This means that you can continue to use the existing
command-line options to configure the JWT authenticator. However, we (Kubernetes SIG Auth) 
recommend migrating to the new configuration file-based approach, as it provides more
flexibility and extensibility.

{{% alert title="Note" color="primary" %}}
If you specify `--authentication-config` along with any of the `--oidc-*` command line arguments, this is
a misconfiguration. In this situation, the API server reports an error and then immediately exits.

If you want to switch to using structured authentication configuration, you have to remove the `--oidc-*`
command line arguments, and use the configuration file instead.
{{% /alert %}}

Here is an example of how to migrate from the command-line flags to the
configuration file:

### Command-line arguments
```bash
--oidc-issuer-url=https://issuer.example.com
--oidc-client-id=example-client-id
--oidc-username-claim=username
--oidc-groups-claim=groups
--oidc-username-prefix=oidc:
--oidc-groups-prefix=oidc:
--oidc-required-claim="hd=example.com"
--oidc-required-claim="admin=true"
--oidc-ca-file=/path/to/ca.pem
```

There is no equivalent in the configuration file for the `--oidc-signing-algs`. 
For Kubernetes v1.30, the authenticator supports all the asymmetric algorithms listed in
[`oidc.go`](https://github.com/kubernetes/kubernetes/blob/b4935d910dcf256288694391ef675acfbdb8e7a3/staging/src/k8s.io/apiserver/plugin/pkg/authenticator/token/oidc/oidc.go#L222-L233).

### Configuration file
```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
jwt:
- issuer:
    url: https://issuer.example.com
    audiences:
    - example-client-id
    certificateAuthority: <value is the content of file /path/to/ca.pem>
  claimMappings:
    username:
      claim: username
      prefix: "oidc:"
    groups:
      claim: groups
      prefix: "oidc:"
  claimValidationRules:
  - claim: hd
    requiredValue: "example.com"
  - claim: admin
    requiredValue: "true"
```

## What's next?
For Kubernetes v1.31, we expect the feature to stay in beta while we get more
feedback. In the coming releases, we want to investigate:
- Making distributed claims work via CEL expressions.
- Egress selector configuration support for calls to `issuer.url` and
  `issuer.discoveryURL`.

You can learn more about this feature on the [structured authentication
configuration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)
page in the Kubernetes documentation. You can also follow along on the
[KEP-3331](https://kep.k8s.io/3331) to track progress across the coming
Kubernetes releases.

## Try it out
In this post, I have covered the benefits the Structured Authentication
Configuration feature brings in Kubernetes v1.30. To use this feature, you must specify the path to the
authentication configuration using the `--authentication-config` command line
argument. From Kubernetes v1.30, the feature is in beta and enabled by default.
If you want to keep using command line arguments instead of a configuration file,
those will continue to work as-is. 

We would love to hear your feedback on this feature. Please reach out to us on the
[#sig-auth-authenticators-dev](https://kubernetes.slack.com/archives/C04UMAUC4UA)
channel on Kubernetes Slack (for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).

## How to get involved
If you are interested in getting involved in the development of this feature,
share feedback, or participate in any other ongoing SIG Auth projects, please
reach out on the [#sig-auth](https://kubernetes.slack.com/archives/C0EN96KUY)
channel on Kubernetes Slack.

You are also welcome to join the bi-weekly [SIG Auth
meetings](https://github.com/kubernetes/community/blob/master/sig-auth/README.md#meetings)
held every-other Wednesday.
