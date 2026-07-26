---
layout: blog
title:  'Health checking gRPC servers on Kubernetes'
date: 2018-10-01
author: >
  [Ahmet Alp Balkan](https://twitter.com/ahmetb) (Google)
---

**Update (December 2021):** _Kubernetes now has built-in gRPC health probes starting in v1.23.
To learn more, see [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
This article was originally written about an external tool to achieve the same task._

[gRPC](https://grpc.io) is on its way to becoming the lingua franca for
communication between cloud-native microservices. If you are deploying gRPC
applications to Kubernetes today, you may be wondering about the best way to
configure health checks. In this article, we will talk about
[grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/), a
Kubernetes-native way to health check gRPC apps.

If you're unfamiliar, Kubernetes [health
checks](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
(liveness and readiness probes) is what's keeping your applications available
while you're sleeping. They detect unresponsive pods, mark them unhealthy, and
cause these pods to be restarted or rescheduled.

Kubernetes [does not
support](https://github.com/kubernetes/kubernetes/issues/21493) gRPC health
checks natively. This leaves the gRPC developers with the following three
approaches when they deploy to Kubernetes:

[![options for health checking grpc on kubernetes today](/images/blog/2019-09-30-health-checking-grpc/options.png)](/images/blog/2019-09-30-health-checking-grpc/options.png)


1.  **httpGet probe:** Cannot be natively used with gRPC. You need to refactor
    your app to serve both gRPC and HTTP/1.1 protocols (on different port
    numbers).
2.  **tcpSocket probe:** Opening a socket to gRPC server is not meaningful,
    since it cannot read the response body.
3.  **exec probe:** This invokes a program in a container's ecosystem
    periodically. In the case of gRPC, this means you implement a health RPC
    yourself, then write and ship a client tool with your container.

Can we do better? Absolutely.

## Introducing “grpc-health-probe”

To standardize the "exec probe" approach mentioned above, we need:

- a **standard** health check "protocol" that can be implemented in any gRPC
  server easily.
- a **standard** health check "tool" that can query the health protocol easily.

Thankfully, gRPC has a [standard health checking
protocol](https://github.com/grpc/grpc/blob/v1.15.0/doc/health-checking.md). It
can be used easily from any language. Generated code and the utilities for
setting the health status are shipped in nearly all language implementations of
gRPC.

If you
[implement](https://github.com/grpc/grpc/blob/v1.15.0/src/proto/grpc/health/v1/health.proto)
this health check protocol in your gRPC apps, you can then use a standard/common
tool to invoke this `Check()` method to determine server status.

The next thing you need is the "standard tool", and it's the
[**grpc-health-probe**](https://github.com/grpc-ecosystem/grpc-health-probe/).

<a href='/images/blog/2019-09-30-health-checking-grpc/grpc_health_probe.png'>
    <img width="768"  title='grpc-health-probe on kubernetes'
        src='/images/blog/2019-09-30-health-checking-grpc/grpc_health_probe.png'/>
</a>

With this tool, you can use the same health check configuration in all your gRPC
applications. This approach requires you to:

1.  Find the gRPC "health" module in your favorite language and start using it
    (example [Go library](https://godoc.org/github.com/grpc/grpc-go/health)).
2.  Ship the
    [grpc_health_probe](https://github.com/grpc-ecosystem/grpc-health-probe/)
    binary in your container.
3.  [Configure](https://github.com/grpc-ecosystem/grpc-health-probe/tree/1329d682b4232c102600b5e7886df8ffdcaf9e26#example-grpc-health-checking-on-kubernetes)
    Kubernetes "exec" probe to invoke the "grpc_health_probe" tool in the
    container.

In this case, executing "grpc_health_probe" will call your gRPC server over
`localhost`, since they are in the same pod.

## What's next

**grpc-health-probe** project is still in its early days and it needs your
feedback. It supports a variety of features like communicating with TLS servers
and configurable connection/RPC timeouts.

If you are running a gRPC server on Kubernetes today, try using the gRPC Health
Protocol and try the grpc-health-probe in your deployments, and [give
feedback](https://github.com/grpc-ecosystem/grpc-health-probe/).

## Further reading

- Protocol: [GRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/v1.15.0/doc/health-checking.md) ([health.proto](https://github.com/grpc/grpc/blob/v1.15.0/src/proto/grpc/health/v1/health.proto))
- Documentation: [Kubernetes liveness and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
- Article: [Advanced Kubernetes Health Check Patterns](https://ahmet.im/blog/advanced-kubernetes-health-checks/)
