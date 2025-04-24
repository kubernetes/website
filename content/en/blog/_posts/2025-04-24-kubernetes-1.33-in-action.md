---
layout: blog
title: "Kubernetes 1.33 in Action: Hands-On Implementation Insights"
slug: exploring-kubernetes-1-33-hands-on
date: 2025-04-24T14:00:00-08:00
author: >
  Abhinav Sharma (KodeKloud)
categories:
- feature
tags:
- kubernetes
- release
- v1.33
---

## Introduction

While the official release notes cover what's new in Kubernetes 1.33, this article takes a different approach. Instead of just listing features, I'll share my hands-on implementation experience and practical insights gained from testing Kubernetes 1.33 in real scenarios. You'll discover not just what's possible, but how these features actually work in practice, complete with configuration examples and observed behaviors. For all the examples in this blog post, I've used KodeKloud Free Playground, which recently added support for Kubernetes 1.33.

## Sidecar Containers: Finally Stable

One of the most anticipated features in Kubernetes 1.33 is the graduation of sidecar containers to stable. Sidecar containers are implemented as init containers with `restartPolicy: Always`, ensuring they start before application containers, remain running throughout the pod's lifecycle, and terminate automatically after the main containers exit.

Let's see a practical example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-demo
spec:
  containers:
  - name: main
    image: nginx
    volumeMounts:
    - name: shared-data
      mountPath: /usr/share/nginx/html
  initContainers:
  - name: content-generator
    image: busybox
    command: ["/bin/sh", "-c"]
    args:
    - while true; do
        echo "<p>The time is $(date)</p>" > /data/index.html;
        sleep 10;
      done
    restartPolicy: Always
    volumeMounts:
    - name: shared-data
      mountPath: /data
  volumes:
  - name: shared-data
    emptyDir: {}
```

The sidecar container starts first and remains running alongside the main container. They share data through a common volume, allowing the sidecar to continuously update content served by the main Nginx container.

## Multiple Service CIDRs: Dynamic IP Management

For large-scale clusters, Kubernetes 1.33 brings the ability to manage multiple Service CIDR ranges dynamically. This feature, now in beta, helps prevent IP exhaustion in growing clusters.

If you have cluster admin privileges, you can add a new Service CIDR range:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: ServiceCIDR
metadata:
  name: additional-cidr
spec:
  cidr: "10.97.0.0/16"
```

This allows the cluster to use an additional range of IP addresses for Services, preventing IP exhaustion in large clusters.

### Traffic Distribution for Services

Kubernetes 1.33 introduces the `trafficDistribution` field for Services as a beta feature. This enables more efficient routing based on topology, which is particularly valuable in multi-zone deployments.

Here's how to create a service with topology-aware traffic distribution:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: topology-service
spec:
  selector:
    app: hello
  ports:
  - port: 80
    targetPort: 80
  trafficDistribution: PreferClose
```

The `PreferClose` value tells Kubernetes to prefer routing traffic to endpoints in the same topological domain (such as zone or region), reducing latency and cross-zone data transfer costs.

### New kubectl Configuration with `.kuberc`

Kubernetes 1.33 introduces a new alpha feature with an opt-in configuration file `.kuberc` for user preferences. This file can contain kubectl aliases and overrides (e.g., defaulting to server-side apply), while leaving cluster credentials and host information in kubeconfig.

To enable this alpha feature, set the environment variable `KUBECTL_KUBERC=true` and create a `.kuberc` configuration file in the following format:

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference

aliases:
  - name: getpods
    command: get
    prependArgs:
    - pods

overrides:
  - command: apply
    flags:
      - name: server-side
        default: "true"
```

As an alpha feature, this functionality may require additional configuration or may not be fully implemented in all environments.

## Conclusion

Kubernetes 1.33 continues to evolve with features that enhance security, performance, and operational efficiency. 

By leveraging these new features, you can build more secure, efficient, and manageable Kubernetes workloads. Whether you're running a small development cluster or a large-scale production environment, Kubernetes 1.33 offers improvements that benefit every use case.

If you'd like to test these features yourself, the [KodeKloud Free Playground](https://kodekloud.com/public-playgrounds) provides an excellent environment for experimenting with Kubernetes 1.33. I found it to be a straightforward way to explore these new capabilities without needing to set up a complex infrastructure.
