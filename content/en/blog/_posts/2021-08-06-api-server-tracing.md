

---
layout: blog
title: 'API Server Tracing'
date: 2021-08-06
slug: api-server-tracing
---

**Authors:** David Ashpole (Google)

In distributed systems, it can be hard to figure out where problems are. You grep through one components' logs just to discover that the source of your problem is in another component.  You search there only to discover that you need to enable debug logs to figure out what really went wrong... And it goes on. The more complex the path your request takes, the harder it is to answer questions about where it went.  I've personally spent many hours doing this dance with a variety of kubernetes components.

## What is Tracing?

Tracing is supposed to help with these cases.  Whereas logs are grouped together for a given component, traces are grouped together by the request that caused them.  Logging limits the amount of data ingested by using log levels, which means details are often missing.  Tracing uses sampling to collect fewer, but generally more detailed traces. My favorite aspect, though, are how useful the visualisations of traces are.  As we will see, even if you don't understand the inner workings of the API Server, or don't have a clue what an Etcd "Transaction" is, I'd wager you can interpret the trace below (Spoiler!), and would have a pretty good guess for where the problem lies.

## Why OpenTelemetry?

The some of the Kubernetes community's core values are portability, openness, and vendor neutrality. It's important that Kubernetes works well for everyone, regardless of who manages your infrastructure, or which vendors you choose to integrate with -- that goes doubly for telemetry solutions.  OpenTelemetry, being a CNCF project, shares these core values, and is creating exactly what we need in Kubernetes: A set of open standards for Tracing client library APIs and a standard trace format. By using OpenTelemetry, we can ensure users have the freedom to choose their backend, and ensure vendors have a level playing-field. The timing is right, as well: the OpenTelemetry golang API and SDK are very close their 1.0 release.

## Why instrument the API Server?

The Kubernetes API Server is a great candidate for tracing for a few reasons:

* It follows the standard "RPC" model (serve a request by making requests to downstream components), which makes it easy to integrate.
* Users are latency-sensitive: If a request takes more than 10 seconds to complete, many clients will time-out.
* It has a complex service topology: A single request could require consulting a dozen webhooks, or involve multiple requests to etcd.

## Examples

### Enabling API Server Tracing

1. Turn on the APIServerTracing feature-gate.

2. Set our configuration for tracing by pointing `--tracing-config-file` on the kube-apiserver at our config file, containing:

```yaml
apiVersion: apiserver.config.k8s.io/v1alpha1
kind: TracingConfiguration
samplingRatePerMillion: 10000
```

### Enabling Etcd Tracing

Add `--experimental-enable-distributed-tracing`,  `--experimental-distributed-tracing-address=0.0.0.0:4317`, `--experimental-distributed-tracing-service-name=etcd` flags to etcd to enable tracing.  Note that this traces every request, so it will probably generate more traces than you want.

### Putting it together

If I run an OpenTelemetry collector on my control-plane node ([example](https://github.com/dashpole/dashpole_demos/tree/master/otel/controlplane)), I get:

![APIServer_Etcd](https://user-images.githubusercontent.com/3262098/128613151-91cb925c-4886-4f05-a12a-771c6cbe9807.png)


Example trace of [example webhook](https://github.com/kubernetes-sigs/controller-runtime/tree/master/examples/builtins)
<img width="1440" alt="APIServer_webhook_etcd" src="https://user-images.githubusercontent.com/3262098/128613167-e7a14cdf-5635-422f-9fd8-f32744ce639d.png">
