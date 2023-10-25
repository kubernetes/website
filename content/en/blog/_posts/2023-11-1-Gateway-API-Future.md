---
layout: blog
title: "Gateway API Improvements"
date: 2023-10-19T10:00:00-08:00
slug: gateway-api-ga
---

***Authors:*** John Howard (Google), ... TODO

## Backend TLS Policy

## HTTPRoute Timeouts

A key enhancement in Gateway API's latest release (v1.0.0) is the introduction of the `timeouts` field within HTTPRoute Rules. This feature offers a dynamic way to manage timeouts for incoming HTTP requests, adding precision and reliability to your gateway setups.

With Timeouts, developers can fine-tune their Gateway API's behaviour in two fundamental ways:

1. **Request Timeout**:

  The request timeout is the duration within which the Gateway API implementation must send a response to a client's HTTP request. It allows flexibility in specifying when this timeout starts, either before or after the entire client request stream is received, making it implementation-specific. This timeout efficiently covers the entire request-response transaction, enhancing the responsiveness of your services.

1. **Backend Request Timeout**:

  The backendRequest timeout is a game-changer for those dealing with backends. It sets a timeout for a single request sent from the Gateway to a backend service. This timeout spans from the initiation of the request to the reception of the full response from the backend. This feature is particularly helpful in scenarios where the Gateway needs to retry connections to a backend, ensuring smooth communication under various conditions.

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

These new HTTPRoute Timeouts provide Kubernetes users with more control and flexibility in managing network communications, helping ensure a smoother and more predictable experience for both clients and backends. For additional details and examples, refer to the official timeouts API documentation.

## Gateway Infrastructure Labels

While Gateway API providers a common API for different implementations, each implementation will have different resources created under-the-hood to apply users intent.
This could be configuring cloud load balancers, creating in cluster Pods and Services, or more.

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

## Support for Websockets, HTTP/2 and more!

## `gwctl`, our new Gateway API command line tool
