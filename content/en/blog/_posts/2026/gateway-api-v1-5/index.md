---
layout: blog
title: "Gateway API v1.5: Moving features to Stable"
date: 2026-04-21T08:30:00-08:00
slug: gateway-api-v1-5
authors: >
    [Katarzyna Łach](https://github.com/kl52752) (Google),
    [Nick Young](https://github.com/youngnick) (Isovalent),
    [Damian Sawicki](https://github.com/dsawicki) (Google),
    [Rostislav Bobrovsky](https://github.com/rostislavbobo) (Google),
    [Dave Protasowski](https://github.com/dprotaso),
---

![Gateway API logo](gateway-api-logo.svg)

The Kubernetes SIG Network community presents the release of Gateway API (v1.5)!
Released on February 27, 2026, version 1.5 is our biggest release yet, and concentrates on moving existing Experimental features to Standard (Stable).

The Gateway API [v1.5.1](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.5.1) patch release is already available.

The Gateway API v1.5 brings six widely-requested feature promotions to the Standard channel (Gateway API's GA release channel):
* ListenerSet
* TLSRoute
* HTTPRoute CORS Filter
* Client Certificate Validation
* Certificate Selection for Gateway TLS Origination
* ReferenceGrant

Special thanks for [Gateway API Contributors](https://github.com/kubernetes-sigs/gateway-api/blob/a811d174a406553006bbb9a3594b49380cb9069e/CHANGELOG/1.5-TEAM.md) for their efforts on this release.


## New release process


As of Gateway API v1.5, the project has moved to a release train model, where on a feature freeze date, any features that are ready are shipped in the release.

This applies to both Experimental and Standard, and also applies to documentation -- if the documentation isn't ready to ship, the feature isn't ready to ship.

We are aiming for this to produce a more reliable release cadence (since we are basing our work off the excellent work done by SIG Release on Kubernetes itself).
As part of this change, we've also introduced Release Manager and Release Shadow roles to our release team. Many thanks to Flynn (Buoyant) and Beka Modebadze (Google) for all the great work coordinating and filing the rough edges of our release process. They are both going to continue in this role for the next release as well.

## New standard features

### ListenerSet

Leads: [Dave Protasowski](https://github.com/dprotaso), [David Jumani](https://github.com/davidjumani)

[GEP-1713](https://gateway-api.sigs.k8s.io/geps/gep-1713/)

#### Why ListenerSet?

Prior to ListenerSet, all listeners had to be specified directly on the Gateway object.
While this worked well for simple use cases, it created challenges for more complex
or multi-tenant environments:

- Platform teams and application teams often needed to coordinate changes to the same Gateway
- Safely delegating ownership of individual listeners was difficult
- Extending existing Gateways required direct modification of the original resource

[ListenerSet](https://gateway-api.sigs.k8s.io/guides/listener-set/) addresses these limitations by allowing listeners to be defined independently and then merged onto a target Gateway.

ListenerSets also enable attaching more than 64 listeners to a single, shared Gateway. This is critical for large scale deployments and scenarios with multiple hostnames per listener.

> Even though the ListenerSet feature significantly enhances scalability, the **listener** field in Gateway **remains a mandatory requirement** and the Gateway must have at least one valid listener.

#### How it works

A ListenerSet attaches to a Gateway and contributes one or more listeners.
The Gateway controller is responsible for merging listeners from the Gateway resource itself and any attached ListenerSet resources.

In this example, a central infrastructure team defines a Gateway with a default HTTP listener,
while two different application teams define their own ListenerSet resources in separate namespaces.
Both ListenerSets attach to the same Gateway and contribute additional HTTPS listeners.

```yaml
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
  namespace: infra
spec:
  gatewayClassName: example-gateway-class
  allowedListeners:
    namespaces:
      from: All # A selector lets you fine tune this
  listeners:
  - name: http
    protocol: HTTP
    port: 80
---
apiVersion: gateway.networking.k8s.io/v1
kind: ListenerSet
metadata:
  name: team-a-listeners
  namespace: team-a
spec:
  parentRef:
    name: example-gateway
    namespace: infra
  listeners:
  - name: https-a
    protocol: HTTPS
    port: 443
    hostname: a.example.com
    tls:
      certificateRefs:
      - name: a-cert
---
apiVersion: gateway.networking.k8s.io/v1
kind: ListenerSet
metadata:
  name: team-b-listeners
  namespace: team-b
spec:
  parentRef:
    name: example-gateway
    namespace: infra
  listeners:
  - name: https-b
    protocol: HTTPS
    port: 443
    hostname: b.example.com
    tls:
      certificateRefs:
      - name: b-cert
```

### TLSRoute

Leads: [Rostislav Bobrovsky](https://github.com/rostislavbobo), [Ricardo Pchevuzinske Katz](https://github.com/rikatz)

[GEP-2643](https://gateway-api.sigs.k8s.io/geps/gep-2643/)

The [TLSRoute resource](https://gateway-api.sigs.k8s.io/api-types/tlsroute/) allows you to route requests by matching the Server Name Indication (SNI) presented by the client during the TLS handshake and directing the stream to the appropriate Kubernetes backends.

When working with TLSRoute, a Gateway's TLS listener can be configured in one of two modes: `Passthrough` or `Terminate`.

**If you install Gateway API v1.5 Standard over v1.4 or earlier Experimental, your existing
Experimental TLSRoutes will not be usable**. This is because they will be stored in the `v1alpha2` or `v1alpha3` version, which is **_not_** included in the v1.5 Standard YAMLs.
If this applies to you, either continue using Experimental for v1.5.1 and onward, or you'll need to download and migrate your TLSRoutes to `v1`, which _is_ present in the Standard YAMLs.

#### Passthrough mode
The Passthrough mode is designed for strict security requirements. It is ideal for scenarios where traffic must remain encrypted end-to-end until it reaches the destination backend, when the external client and backend need to authenticate directly with each other, or when you can’t store certificates on the Gateway. This configuration is also applicable when an encrypted TCP stream is required instead of standard HTTP traffic.

In this mode, the encrypted byte stream is proxied directly to the destination backend. The Gateway has zero access to private keys or unencrypted data.

The following TLSRoute is attached to a listener that is configured in `Passthrough` mode. It will match only TLS handshakes with the `foo.example.com` SNI hostname and apply its routing rules to pass the encrypted TCP stream to the configured backend:

```yaml
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
  - name: tls-passthrough
    protocol: TLS
    port: 8443
    tls:
      mode: Passthrough
---
apiVersion: gateway.networking.k8s.io/v1
kind: TLSRoute
metadata:
  name: foo-route
spec:
  parentRefs:
  - name: example-gateway
    sectionName: tls-passthrough
  hostnames:
  - "foo.example.com"
  rules:
  - backendRefs:
    - name: foo-svc
      port: 8443
```


#### Terminate mode
The Terminate mode provides the convenience of centralized TLS certificate management directly at the Gateway.

In this mode, the TLS session is fully terminated at the Gateway, which then
routes the decrypted payload to the destination backend as a plain text TCP stream.

The following TLSRoute is attached to a listener that is configured in Terminate mode.
It will match only TLS handshakes with the `bar.example.com` SNI hostname and apply its routing rules to pass the decrypted TCP stream to the configured backend:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
  - name: tls-terminate
    protocol: TLS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - name: tls-terminate-certificate
---
apiVersion: gateway.networking.k8s.io/v1
kind: TLSRoute
metadata:
  name: bar-route
spec:
  parentRefs:
  - name: example-gateway
    sectionName: tls-terminate
  hostnames:
  - "bar.example.com"
  rules:
  - backendRefs:
    - name: bar-svc
      port: 8080
```


### HTTPRoute CORS filter

Leads: [Damian Sawicki](https://github.com/DamianSawicki), [Ricardo Pchevuzinske Katz](https://github.com/rikatz), [Norwin Schnyder](https://github.com/snorwin), [Huabing (Robin) Zhao](https://github.com/zhaohuabing), [LiangLliu](https://github.com/LiangLliu),

[GEP-1767](https://gateway-api.sigs.k8s.io/geps/gep-1767/)

Cross-origin resource sharing (CORS) is an HTTP-header based security mechanism that allows (or denies) a web page to access resources from a server on an origin different from the domain that served the web page. See our [documentation page](https://gateway-api.sigs.k8s.io/guides/http-cors/) for more information.
The [HTTPRoute resource](https://gateway-api.sigs.k8s.io/api-types/httproute/) can be used to configure Cross-Origin Resource Sharing (CORS). The following HTTPRoute allows requests from https://app.example:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: cors
spec:
  parentRefs:
  - name: same-namespace
  rules:
  - matches:
    - path:
       type: PathPrefix
       value: /cors-behavior-creds-false
    backendRefs:
    - name: infra-backend-v1
       port: 8080
    filters:
    - cors:
      allowOrigins:
        - https://app.example
      type: CORS
```

Instead of specifying a list of specific origins, you can also specify a single wildcard ("\*"), which will allow any origin. It is also allowed to use semi-specified origins in the list, where the wildcard appears after the scheme and at the beginning of the hostname, e.g. https://*.bar.com:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: cors
spec:
  parentRefs:
  - name: same-namespace
  rules:
  - matches:
    - path:
      type: PathPrefix
      value: /cors-behavior-creds-false
    backendRefs:
    - name: infra-backend-v1
      port: 8080
    filters:
    - cors:
      allowOrigins:
        - https://www.baz.com
        - https://*.bar.com
        - https://*.foo.com
      type: CORS
```
HTTPRoute filters allow for the configuration of CORS settings. See a list of supported options below:

`allowCredentials`
: Specifies whether the browser is allowed to include credentials (such as cookies and HTTP authentication) in the CORS request.

`allowMethods`
: The HTTP methods that are allowed for CORS requests.

`allowHeaders`
: The HTTP headers that are allowed for CORS requests.

`exposeHeaders`
: The HTTP headers that are exposed to the client.

`maxAge`
: The maximum time in seconds that the browser should cache the preflight response.

A comprehensive example:
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: cors-allow-credentials
spec:
  parentRefs:
  - name: same-namespace
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /cors-behavior-creds-true
    backendRefs:
    - name: infra-backend-v1
      port: 8080
    filters:
    - cors:
        allowOrigins:
        - "https://www.foo.example.com"
        - "https://*.bar.example.com"
        allowMethods:
        - GET
        - OPTIONS
        allowHeaders:
        - "*"
        exposeHeaders:
        - "x-header-3"
        - "x-header-4"
        allowCredentials: true
        maxAge: 3600
      type: CORS
```

### Gateway client certificate validation
Leads: [Arko Dasgupta](https://github.com/arkodg), [Katarzyna Łach](https://github.com/kl52752), [Norwin Schnyder](https://github.com/snorwin)

[GEP-91](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Client certificate validation, also known as mutual TLS (mTLS), is a security mechanism where the client provides a certificate to the server to prove its identity. This is in contrast to standard TLS, where only the server presents a certificate to the client.
In the context of the Gateway API, frontend mTLS means that the Gateway validates the client's certificate before allowing the connection to proceed to a backend service. This validation is done by checking the client certificate against a set of trusted Certificate Authorities (CAs) configured on the Gateway. The API was shaped this way to address a critical security vulnerability related to connection reuse and still provide some level of flexibility.

#### Configuration overview
Client validation is defined using the frontendValidation struct, which specifies how the Gateway should verify the client's identity.

*   **caCertificateRefs**: A list of references to Kubernetes objects (typically ConfigMap's) containing PEM-encoded CA certificate bundles used as trust anchors to validate the client's certificate.
*   **mode**: Defines the validation behavior.
    *   **AllowValidOnly** (Default): The Gateway accepts connections only if the client presents a valid certificate that passes validation against the specified CA bundle.
    *   **AllowInsecureFallback**: The Gateway accepts connections even if the client certificate is missing or fails verification. This mode typically delegates authorization to the backend and should be used with caution.


Validation can be applied globally to the Gateway or overridden for specific ports:

1.  **Default Configuration**: This configuration applies to all HTTPS listeners on the Gateway, unless a per-port override is defined.
2.  **Per-Port Configuration**: This allows for fine-grained control, overriding the default configuration for all listeners handling traffic on a specific port.

Example:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: client-validation-basic
spec:
  gatewayClassName: acme-lb
  tls:
    frontend:
      default:
        validation:
          caCertificateRefs:
          - kind: ConfigMap
            group: ""
            name: foo-example-com-ca-cert
      perPort:
      - port: 8443
        tls:
          validation:
            caCertificateRefs:
            - kind: ConfigMap
              group: ""
              name: foo-example-com-ca-cert
            mode: "AllowInsecureFallback"
  listeners:
  - name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
    tls:
      certificateRefs:
      - kind: Secret
        group: ""
        name: foo-example-com-cert
  - name: bar-https
    protocol: HTTPS
    port: 8443
    hostname: bar.example.com
    tls:
      certificateRefs:
      - kind: Secret
        group: ""
        name: bar-example-com-cert
```

### Certificate selection for Gateway TLS origination
Leads: [Marcin Kosieradzki](https://github.com/mkosieradzki), [Rob Scott](https://github.com/robscott), [Norwin Schnyder](https://github.com/snorwin), [Lior Lieberman](https://github.com/LiorLieberman), [Katarzyna Lach](https://github.com/kl52752)

[GEP-3155](https://gateway-api.sigs.k8s.io/geps/gep-3155/)

Mutual TLS (mTLS) for upstream connections requires the Gateway to present a client certificate to the backend, in addition to verifying the backend's certificate. This ensures that the backend only accepts connections from authorized Gateways.

#### Gateway’s client certificate configuration
To configure the client certificate that the Gateway uses when connecting to backends,
use the **tls.backend.clientCertificateRef** field in the Gateway resource.
This configuration applies to the Gateway as a client for **all** upstream connections managed by that Gateway.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: backend-tls
spec:
  gatewayClassName: acme-lb
  tls:
    backend:
      clientCertificateRef:
        kind: Secret
        group: "" # empty string means core API group
        name: foo-example-cert
  listeners:
  - name: foo-http
    protocol: HTTP
    port: 80
    hostname: foo.example.com
```


### ReferenceGrant promoted to v1

The ReferenceGrant resource has not changed in more than a year, and we do not expect it to change further, so its version has been bumped to v1, and it is now officially in the Standard channel, and abides by the GA API contract (that is, no breaking changes).

## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.30 or later, you'll be able to get up and running with this version
of Gateway API.

To try out the API, follow the [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).

As of this writing, seven implementations are already fully conformant with Gateway API v1.5. In alphabetical order:
- [Agentgateway](https://github.com/agentgateway/agentgateway/releases/tag/v1.0.0)
- [Airlock Microgateway](https://github.com/airlock/microgateway/releases/tag/5.0.0)
- [GKE Gateway](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gateway-api)
- [HAProxy Ingress](https://github.com/jcmoraisjr/haproxy-ingress/releases/tag/v0.17.0-alpha.1)
- [kgateway](https://github.com/kgateway-dev/kgateway/releases/tag/v2.3.0-beta.3)
- [NGINX Gateway Fabric](https://github.com/nginx/nginx-gateway-fabric/releases/tag/v2.5.0)
- [Traefik Proxy](https://github.com/traefik/traefik/releases/tag/v3.7.0-rc.1)

## Get involved

Wondering when a feature will be added?  There are lots of opportunities to get
involved and help define the future of Kubernetes routing APIs for both ingress
and service mesh.
* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/) and help us build the future of Gateway API together!

The maintainers would like to thank **everyone** who's contributed to Gateway
API, whether in the form of commits to the repo, discussion, ideas, or general
support. We could never have made this kind of progress without the support of
this dedicated and active community.

_This article was edited in April 2026 to correct the release date for Gateway API 1.5.0._