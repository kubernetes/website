---
layout: blog
title: "Experimenting with Gateway API using kind"
date: 2025-12-11
draft: true
slug: experimenting-gateway-api-with-kind
evergreen: true
author: >
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
---

This document will guide you through setting up a local experimental environment with [Gateway API](https://gateway-api.sigs.k8s.io/) on [kind](https://kind.sigs.k8s.io/). This setup is designed for learning and testing. It helps you understand Gateway API concepts without production complexity.

{{< caution >}}
This is an experimentation learning setup, and should not be used for production. The components used on this document are not suited for production usage.
Once you're ready to deploy Gateway API in a production environment, 
select an [implementation](https://gateway-api.sigs.k8s.io/implementations/) that suits your needs.
{{< /caution >}}

## Overview

In this guide, you will:
- Set up a local Kubernetes cluster using kind (Kubernetes in Docker)
- Deploy [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind), which provides both LoadBalancer Services and a Gateway API controller
- Create a Gateway and HTTPRoute to route traffic to a demo application
- Test your Gateway API configuration locally

This setup is ideal for learning, development, and experimentation with Gateway API concepts.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **[Docker](https://docs.docker.com/get-docker/)** - Required to run kind and cloud-provider-kind
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** - The Kubernetes command-line tool
- **[kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)** - Kubernetes in Docker
- **[curl](https://curl.se/)** - Required to test the routes

### Create a kind cluster

Create a new kind cluster by running:

```shell
kind create cluster
```

This will create a single-node Kubernetes cluster running in a Docker container.

### Install cloud-provider-kind

Next, you need [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind/), which provides two key components for this setup:
- A LoadBalancer controller that assigns addresses to LoadBalancer-type Services
- A Gateway API controller that implements the Gateway API specification

It also automatically installs the Gateway API Custom Resource Definitions (CRDs) in your cluster.

Run cloud-provider-kind as a Docker container on the same host where you created the kind cluster:

```shell
VERSION="$(basename $(curl -s -L -o /dev/null -w '%{url_effective}' https://github.com/kubernetes-sigs/cloud-provider-kind/releases/latest))"
docker run -d --name cloud-provider-kind --rm --network host -v /var/run/docker.sock:/var/run/docker.sock registry.k8s.io/cloud-provider-kind/cloud-controller-manager:${VERSION}
```

**Note:** On some systems, you may need elevated privileges to access the Docker socket.

Verify that cloud-provider-kind is running:

```shell
docker ps --filter name=cloud-provider-kind
```

You should see the container listed and in a running state. You can also check the logs:

```shell
docker logs cloud-provider-kind
```

## Experimenting with Gateway API

Now that your cluster is set up, you can start experimenting with Gateway API resources.

cloud-provider-kind automatically provisions a GatewayClass called `cloud-provider-kind`. You'll use this class to create your Gateway.

It is worth noticing that while kind is not a cloud provider, the project is named as `cloud-provider-kind` as it provides features that simulate a cloud-enabled environment.

### Deploy a Gateway

The following manifest will:
- Create a new namespace called `gateway-infra`
- Deploy a Gateway that listens on port 80
- Accept HTTPRoutes with hostnames matching the `*.exampledomain.example` pattern
- Allow routes from any namespace to attach to the Gateway. 
  **Note**: In real clusters, prefer Same or Selector values on the [`allowedRoutes` namespace selector](https://gateway-api.sigs.k8s.io/reference/spec/#fromnamespaces) field to limit attachments.

Apply the following manifest:

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: gateway-infra
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway
  namespace: gateway-infra
spec:
  gatewayClassName: cloud-provider-kind
  listeners:
  - name: default
    hostname: "*.exampledomain.example"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: All
```

Then verify that your Gateway is properly programmed and has an address assigned:

```shell
kubectl get gateway -n gateway-infra gateway
```

Expected output:
```
NAME      CLASS                 ADDRESS      PROGRAMMED   AGE
gateway   cloud-provider-kind   172.18.0.3   True         5m6s
```

The PROGRAMMED column should show True, and the ADDRESS field should contain an IP address.

### Deploy a demo application

Next, deploy a simple echo application that will help you test your Gateway configuration. This application:
- Listens on port 3000
- Echoes back request details including path, headers, and environment variables
- Runs in a namespace called `demo`

Apply the following manifest:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: demo
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  ports:
  - name: http
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app.kubernetes.io/name: echo
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: echo
  name: echo
  namespace: demo
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: echo
  template:
    metadata:
      labels:
        app.kubernetes.io/name: echo
    spec:
      containers:
      - env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.name
        - name: NAMESPACE
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
        image: registry.k8s.io/gateway-api/echo-basic:v20251204-v1.4.1
        name: echo-basic
```

### Create an HTTPRoute

Now create an HTTPRoute to route traffic from your Gateway to the echo application.
This HTTPRoute will:
- Respond to requests for the hostname `some.exampledomain.example`
- Route traffic to the echo application
- Attach to the Gateway in the `gateway-infra` namespace

Apply the following manifest:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: echo
  namespace: demo
spec:
  parentRefs:
  - name: gateway
    namespace: gateway-infra
  hostnames: ["some.exampledomain.example"]
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: echo
      port: 3000
```

### Test your route

The final step is to test your route using curl. You'll make a request to the Gateway's IP address with the hostname `some.exampledomain.example`. The command below is for POSIX shell only, and may need to be adjusted for your environment:

```shell
GW_ADDR=$(kubectl get gateway -n gateway-infra gateway -o jsonpath='{.status.addresses[0].value}')
curl --resolve some.exampledomain.example:80:${GW_ADDR} http://some.exampledomain.example
```

You should receive a JSON response similar to this:

```json
{
 "path": "/",
 "host": "some.exampledomain.example",
 "method": "GET",
 "proto": "HTTP/1.1",
 "headers": {
  "Accept": [
   "*/*"
  ],
  "User-Agent": [
   "curl/8.15.0"
  ]
 },
 "namespace": "demo",
 "ingress": "",
 "service": "",
 "pod": "echo-dc48d7cf8-vs2df"
}
```

If you see this response, congratulations! Your Gateway API setup is working correctly.

## Troubleshooting

If something isn't working as expected, you can troubleshoot by checking the status of your resources.

### Check the Gateway status

First, inspect your Gateway resource:

```shell
kubectl get gateway -n gateway-infra gateway -o yaml
```

Look at the `status` section for conditions. Your Gateway should have:
- `Accepted: True` - The Gateway was accepted by the controller
- `Programmed: True` - The Gateway was successfully configured
- `.status.addresses` populated with an IP address

### Check the HTTPRoute status

Next, inspect your HTTPRoute:

```shell
kubectl get httproute -n demo echo -o yaml
```

Check the `status.parents` section for conditions. Common issues include:

- ResolvedRefs set to False with reason `BackendNotFound`; this means that the backend Service doesn't exist or has the wrong name
- Accepted set to False; this means that the route couldn't attach to the Gateway (check namespace permissions or hostname matching)

Example error when a backend is not found:
```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2026-01-19T17:13:35Z"
      message: backend not found
      observedGeneration: 2
      reason: BackendNotFound
      status: "False"
      type: ResolvedRefs
    controllerName: kind.sigs.k8s.io/gateway-controller
```

### Check controller logs

If the resource statuses don't reveal the issue, check the cloud-provider-kind logs:

```shell
docker logs -f cloud-provider-kind
```

This will show detailed logs from both the LoadBalancer and Gateway API controllers.

## Cleanup

When you're finished with your experiments, you can clean up the resources:

### Remove Kubernetes resources

Delete the namespaces (this will remove all resources within them):

```shell
kubectl delete namespace gateway-infra
kubectl delete namespace demo
```

### Stop cloud-provider-kind

Stop and remove the cloud-provider-kind container:

```shell
docker stop cloud-provider-kind
```

Because the container was started with the `--rm` flag, it will be automatically removed when stopped.

### Delete the kind cluster

Finally, delete the kind cluster:

```shell
kind delete cluster
```

## Next steps

Now that you've experimented with Gateway API locally, you're ready to explore production-ready implementations:

- **Production Deployments**: Review the [Gateway API implementations](https://gateway-api.sigs.k8s.io/implementations/) to find a controller that matches your production requirements
- **Learn More**: Explore the [Gateway API documentation](https://gateway-api.sigs.k8s.io/) to learn about advanced features like TLS, traffic splitting, and header manipulation
- **Advanced Routing**: Experiment with path-based routing, header matching, request mirroring and other features following [Gateway API user guides](https://gateway-api.sigs.k8s.io/guides/getting-started/)

### A final word of caution
This _kind_ setup is for development and learning only.
Always use a production-grade Gateway API implementation for real workloads.
