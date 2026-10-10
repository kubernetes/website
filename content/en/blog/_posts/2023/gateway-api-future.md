---
layout: blog
title: "New Experimental Features in Gateway API v1.0"
date: 2023-11-28T10:00:00-08:00
slug: gateway-api-ga
author: >
  Candace Holman (Red Hat),
  Dave Protasowski (VMware),
  Gaurav K Ghildiyal (Google),
  John Howard (Google),
  Simone Rodigari (IBM)
---

Recently, the [Gateway API](https://gateway-api.sigs.k8s.io/) [announced its v1.0 GA release](/blog/2023/10/31/gateway-api-ga/), marking a huge milestone for the project.

Along with stabilizing some of the core functionality in the API, a number of exciting new *experimental* features have been added.

## Backend TLS Policy

`BackendTLSPolicy` is a new Gateway API type used for specifying the TLS configuration of the connection from the Gateway to backend Pods via the Service API object.
It is specified as a [Direct PolicyAttachment](https://gateway-api.sigs.k8s.io/geps/gep-713/#direct-policy-attachment) without defaults or overrides, applied to a Service that accesses a backend, where the BackendTLSPolicy resides in the same namespace as the Service to which it is applied.
All Gateway API Routes that point to a referenced Service should respect a configured `BackendTLSPolicy`.

While there were existing ways provided for [TLS to be configured for edge and passthrough termination](https://gateway-api.sigs.k8s.io/guides/tls/#tls-configuration), this new API object specifically addresses the configuration of TLS in order to convey HTTPS from the Gateway dataplane to the backend.
This is referred to as "backend TLS termination" and enables the Gateway to know how to connect to a backend Pod that has its own certificate.

![Termination Types](https://gateway-api.sigs.k8s.io/geps/images/1897-TLStermtypes.png) 

The specification of a `BackendTLSPolicy` consists of:
- `targetRef` - Defines the targeted API object of the policy.  Only Service is allowed.
- `tls` - Defines the configuration for TLS, including `hostname`, `caCertRefs`, and `wellKnownCACerts`. Either `caCertRefs` or `wellKnownCACerts` may be specified, but not both.
- `hostname` - Defines the Server Name Indication (SNI) that the Gateway uses to connect to the backend. The certificate served by the backend must match this SNI.
- `caCertRefs` - Defines one or more references to objects that contain PEM-encoded TLS certificates, which are used to establish a TLS handshake between the Gateway and backend.
- `wellKnownCACerts` - Specifies whether or not system CA certificates may be used in the TLS handshake between the Gateway and backend.

### Examples

#### Using System Certificates

In this example, the `BackendTLSPolicy` is configured to use system certificates to connect with a TLS-encrypted upstream connection where Pods backing the `dev` Service are expected to serve a valid certificate for `dev.example.com`.

```yaml
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: BackendTLSPolicy
metadata:
  name: tls-upstream-dev
spec:
  targetRef:
    kind: Service
    name: dev-service
    group: ""
  tls:
    wellKnownCACerts: "System"
    hostname: dev.example.com
```

#### Using Explicit CA Certificates

In this example, the `BackendTLSPolicy` is configured to use certificates defined in the configuration map `auth-cert` to connect with a TLS-encrypted upstream connection where Pods backing the `auth` Service are expected to serve a valid certificate for `auth.example.com`.

```yaml
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: BackendTLSPolicy
metadata:
  name: tls-upstream-auth
spec:
  targetRef:
    kind: Service
    name: auth-service
    group: ""
  tls:
    caCertRefs:
      - kind: ConfigMapReference
        name: auth-cert
        group: ""
    hostname: auth.example.com
```

The following illustrates a BackendTLSPolicy that configures TLS for a Service serving a backend:

{{< mermaid >}}
flowchart LR
    client(["client"])
    gateway["Gateway"]
    style gateway fill:#02f,color:#fff
    httproute["HTTP<BR>Route"]
    style httproute fill:#02f,color:#fff
    service["Service"]
    style service fill:#02f,color:#fff
    pod1["Pod"]
    style pod1 fill:#02f,color:#fff
    pod2["Pod"]
    style pod2 fill:#02f,color:#fff
    client -.->|HTTP <br> request| gateway
    gateway --> httproute
    httproute -.->|BackendTLSPolicy|service
    service --> pod1 & pod2
{{</ mermaid >}}

For more information, refer to the [documentation for TLS](https://gateway-api.sigs.k8s.io/guides/tls).

## HTTPRoute Timeouts

A key enhancement in Gateway API's latest release (v1.0) is the introduction of the `timeouts` field within HTTPRoute Rules. This feature offers a dynamic way to manage timeouts for incoming HTTP requests, adding precision and reliability to your gateway setups.

With Timeouts, developers can fine-tune their Gateway API's behavior in two fundamental ways:

1. **Request Timeout**:

   The request timeout is the duration within which the Gateway API implementation must send a response to a client's HTTP request.
   It allows flexibility in specifying when this timeout starts, either before or after the entire client request stream is received, making it implementation-specific.
   This timeout efficiently covers the entire request-response transaction, enhancing the responsiveness of your services.

1. **Backend Request Timeout**:

   The backendRequest timeout is a game-changer for those dealing with backends.
   It sets a timeout for a single request sent from the Gateway to a backend service.
   This timeout spans from the initiation of the request to the reception of the full response from the backend.
   This feature is particularly helpful in scenarios where the Gateway needs to retry connections to a backend, ensuring smooth communication under various conditions.

Notably, the `request` timeout encompasses the `backendRequest` timeout. Hence, the value of `backendRequest` should never exceed the value of the `request` timeout.

The ability to configure these timeouts adds a new layer of reliability to your Kubernetes services.
Whether it's ensuring client requests are processed within a specified timeframe or managing backend service communications, Gateway API's Timeouts offer the control and predictability you need.

To get started, you can define timeouts in your HTTPRoute Rules using the Timeouts field, specifying their type as Duration.
A zero-valued timeout (`0s`) disables the timeout, while a valid non-zero-valued timeout should be at least 1ms.

Here's an example of setting request and backendRequest timeouts in an HTTPRoute:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: timeout-example
spec:
  parentRefs:
  - name: example-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /timeout
    timeouts:
      request: 10s
      backendRequest: 2s
    backendRefs:
    - name: timeout-svc
      port: 8080
```

In this example, a `request` timeout of 10 seconds is defined, ensuring that client requests are processed within that timeframe.
Additionally, a 2-second `backendRequest` timeout is set for individual requests from the Gateway to a backend service called timeout-svc.

These new HTTPRoute Timeouts provide Kubernetes users with more control and flexibility in managing network communications, helping ensure a smoother and more predictable experience for both clients and backends.
For additional details and examples, refer to the [official timeouts API documentation](https://gateway-api.sigs.k8s.io/api-types/httproute/#timeouts-optional).

## Gateway Infrastructure Labels

While Gateway API providers a common API for different implementations, each implementation will have different resources created under-the-hood to apply users' intent.
This could be configuring cloud load balancers, creating in-cluster Pods and Services, or more.

While the API has always provided an extension point -- `parametersRef` in `GatewayClass` -- to customize implementation specific things, there was no common core way to express common infrastructure customizations.

Gateway API v1.0 paves the way for this with a new `infrastructure` field on the `Gateway` object, allowing customization of the underlying infrastructure.
For now, this starts small with two critical fields: labels and annotations.
When these are set, any generated infrastructure will have the provided labels and annotations set on them.

For example, I may want to group all my resources for one application together:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: hello-world
spec:
  infrastructure:
    labels:
      app.kubernetes.io/name: hello-world
```

In the future, we are looking into more common infrastructure configurations, such as resource sizing.

For more information, refer to the [documentation](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GatewayInfrastructure) for this feature.

## Support for Websockets, HTTP/2 and more!

Not all implementations of Gateway API support automatic protocol selection.
In some cases protocols are disabled without an explicit opt-in. 

When a Route's backend references a Kubernetes Service, application developers can specify the protocol using `ServicePort` [`appProtocol`][appProtocol] field.

For example the following `store` Kubernetes Service is indicating the port `8080` supports HTTP/2 Prior Knowledge.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: store
spec:
  selector:
    app: store
  ports:
  - protocol: TCP
    appProtocol: kubernetes.io/h2c
    port: 8080
    targetPort: 8080
```

Currently, Gateway API has conformance testing for:

- `kubernetes.io/h2c` - HTTP/2 Prior Knowledge
- `kubernetes.io/ws` - WebSocket over HTTP

For more information, refer to the documentation for [Backend Protocol Selection](https://gateway-api.sigs.k8s.io/guides/backend-protocol).

[appProtocol]: https://kubernetes.io/docs/concepts/services-networking/service/#application-protocol

## `gwctl`, our new Gateway API command line tool

`gwctl` is a command line tool that aims to be a `kubectl` replacement for viewing Gateway API resources.

The initial release of `gwctl` that comes bundled with Gateway v1.0 release includes helpful features for managing Gateway API Policies.
Gateway API Policies serve as powerful extension mechanisms for modifying the behavior of Gateway resources.
One challenge with using policies is that it may be hard to discover which policies are affecting which Gateway resources.
`gwctl` helps bridge this gap by answering questions like:

* Which policies are available for use in the Kubernetes cluster?
* Which policies are attached to a particular Gateway, HTTPRoute, etc?
* If policies are applied to multiple resources in the Gateway resource hierarchy, what is the effective policy that is affecting a particular resource? (For example, if an HTTP request timeout policy is applied to both an HTTPRoute and its parent Gateway, what is the effective timeout for the HTTPRoute?)

`gwctl` is still in the very early phases of development and hence may be a bit rough around the edges.
Follow the instructions in [the repository](https://github.com/kubernetes-sigs/gateway-api/tree/main/gwctl#try-it-out) to install and try out `gwctl`.

### Examples

Here are some examples of how `gwctl` can be used:

```bash
# List all policies in the cluster. This will also give the resource they bind
# to.
gwctl get policies -A
# List all available policy types.
gwctl get policycrds
# Describe all HTTPRoutes in namespace ns2. (Output includes effective policies)
gwctl describe httproutes -n ns2
# Describe a single HTTPRoute in the default namespace. (Output includes
# effective policies)
gwctl describe httproutes my-httproute-1
# Describe all Gateways across all namespaces. (Output includes effective
# policies)
gwctl describe gateways -A
# Describe a single GatewayClass. (Output includes effective policies)
gwctl describe gatewayclasses foo-com-external-gateway-class
```

## Get involved

These projects, and many more, continue to be improved in Gateway API.
There are lots of opportunities to get involved and help define the future of Kubernetes routing APIs for both Ingress and Mesh.

If this is interesting to you, please [join us in the community](https://gateway-api.sigs.k8s.io/contributing/) and help us build the future of Gateway API together!

