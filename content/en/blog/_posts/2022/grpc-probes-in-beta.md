---
layout: blog
title: "Kubernetes 1.24: gRPC container probes in beta"
date: 2022-05-13
slug: grpc-probes-now-in-beta
author: >
  Sergey Kanzhelev (Google)
---

_Update: Since this article was posted, the feature was graduated to GA in v1.27 and doesn't require any feature gates to be enabled.

With Kubernetes 1.24 the gRPC probes functionality entered beta and is available by default.
Now you can configure startup, liveness, and readiness probes for your gRPC app
without exposing any HTTP endpoint, nor do you need an executable. Kubernetes can natively connect to your workload via gRPC and query its status.

## Some history

It's useful to let the system managing your workload check that the app is
healthy, has started OK, and whether the app considers itself good to accept
traffic. Before the gRPC support was added, Kubernetes already allowed you to
check for health based on running an executable from inside the container image,
by making an HTTP request, or by checking whether a TCP connection succeeded.

For most apps, those checks are enough. If your app provides a gRPC endpoint
for a health (or readiness) check, it is easy
to repurpose the `exec` probe to use it for gRPC health checking.
In the blog article [Health checking gRPC servers on Kubernetes](/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/),
Ahmet Alp Balkan described how you can do that — a mechanism that still works today.

There is a commonly used tool to enable this that was [created](https://github.com/grpc-ecosystem/grpc-health-probe/commit/2df4478982e95c9a57d5fe3f555667f4365c025d)
on August 21, 2018, and with
the first release at [Sep 19, 2018](https://github.com/grpc-ecosystem/grpc-health-probe/releases/tag/v0.1.0-alpha.1).

This approach for gRPC apps health checking is very popular. There are [3,626 Dockerfiles](https://github.com/search?l=Dockerfile&q=grpc_health_probe&type=code)
with the `grpc_health_probe` and [6,621 yaml](https://github.com/search?l=YAML&q=grpc_health_probe&type=Code) files that are discovered with the
basic search on GitHub (at the moment of writing). This is a good indication of the tool popularity
and the need to support this natively.

Kubernetes v1.23 introduced an alpha-quality implementation of native support for
querying a workload status using gRPC. Because it was an alpha feature,
this was disabled by default for the v1.23 release.

## Using the feature

We built gRPC health checking in similar way with other probes and believe
it will be [easy to use](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
if you are familiar with other probe types in Kubernetes.
The natively supported health probe has many benefits over the workaround involving `grpc_health_probe` executable.

With the native gRPC support you don't need to download and carry `10MB` of an additional executable with your image.
Exec probes are generally slower than a gRPC call as they require instantiating a new process to run an executable.
It also makes the checks less sensible for edge cases when the pod is running at maximum resources and has troubles
instantiating new processes.

There are a few limitations though. Since configuring a client certificate for probes is hard,
services that require client authentication are not supported. The built-in probes are also
not checking the server certificates and ignore related problems.

Built-in checks also cannot be configured to ignore certain types of errors
(`grpc_health_probe` returns different exit codes for different errors),
and cannot be "chained" to run the health check on multiple services in a single probe.

But all these limitations are quite standard for gRPC and there are easy workarounds
for those.

## Try it for yourself

### Cluster-level setup

You can try this feature today. To try native gRPC probes, you can spin up a Kubernetes cluster
yourself with the `GRPCContainerProbe` feature gate enabled, there are many [tools available](/docs/tasks/tools/).

Since the feature gate `GRPCContainerProbe` is enabled by default in 1.24,
many vendors will have this functionality working out of the box.
So you may just create an 1.24 cluster on platform of your choice. Some vendors
allow to enable alpha features on 1.23 clusters.

For example, at the moment of writing, you can spin up the test cluster on GKE for a quick test.
Other vendors may also have similar capabilities, especially if you
are reading this blog post long after the Kubernetes 1.24 release.

On GKE use the following command (note, version is `1.23` and `enable-kubernetes-alpha` are specified).

```shell
gcloud container clusters create test-grpc \
    --enable-kubernetes-alpha \
    --no-enable-autorepair \
    --no-enable-autoupgrade \
    --release-channel=rapid \
    --cluster-version=1.23
```

You will also need to configure `kubectl` to access the cluster:

```shell
gcloud container clusters get-credentials test-grpc
```

### Trying the feature out

Let's create the pod to test how gRPC probes work. For this test we will use the `agnhost` image.
This is a k8s maintained image with that can be used for all sorts of workload testing.
For example, it has a useful [grpc-health-checking](https://github.com/kubernetes/kubernetes/blob/b2c5bd2a278288b5ef19e25bf7413ecb872577a4/test/images/agnhost/README.md#grpc-health-checking) module
that exposes two ports - one is serving health checking service,
another - http port to react on commands `make-serving` and `make-not-serving`.

Here is an example pod definition. It starts the `grpc-health-checking` module,
exposes ports `5000` and `8080`, and configures gRPC readiness probe:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: test-grpc
spec:
  containers:
  - name: agnhost
    # image changed since publication (previously used registry "k8s.gcr.io")
    image: registry.k8s.io/e2e-test-images/agnhost:2.35
    command: ["/agnhost", "grpc-health-checking"]
    ports:
    - containerPort: 5000
    - containerPort: 8080
    readinessProbe:
      grpc:
        port: 5000
```

In the manifest file called `test.yaml`, you can create the pod and check its status.
The pod will be in ready state as indicated by the snippet of the output.

```shell
kubectl apply -f test.yaml
kubectl describe test-grpc
```

The output will contain something like this:

```
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

Now let's change the health checking endpoint status to NOT_SERVING.
In order to call the http port of the Pod, let's create a port forward:

```shell
kubectl port-forward test-grpc 8080:8080
```

You can `curl` to call the command...

```shell
curl http://localhost:8080/make-not-serving
```

... and in a few seconds the port status will switch to not ready.

```shell
kubectl describe pod test-grpc
```

The output now will have:

```
Conditions:
  Type              Status
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True

...

  Warning  Unhealthy  2s (x6 over 42s)  kubelet            Readiness probe failed: service unhealthy (responded with "NOT_SERVING")
```

Once it is switched back, in about one second the Pod will get back to ready status:

```bash
curl http://localhost:8080/make-serving
kubectl describe test-grpc
```

The output indicates that the Pod went back to being `Ready`:

```
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

This new built-in gRPC health probing on Kubernetes makes implementing a health-check via gRPC
much easier than the older approach that relied on using a separate `exec` probe. Read through
the official
[documentation](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
to learn more and provide feedback before the feature will be promoted to GA.

## Summary

Kubernetes is a popular workload orchestration platform and we add features based on feedback and demand.
Features like gRPC probes support is a minor improvement that will make life of many app developers
easier and apps more resilient. Try it today and give feedback, before the feature went into GA.
