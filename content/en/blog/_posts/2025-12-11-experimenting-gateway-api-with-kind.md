---
layout: blog
title: "Experimenting with Gateway API using KinD"
date: 2025-12-11
draft: true
slug: experimenting-gateway-api-with-kind
evergreen: true
author: >
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
---

This document will guide you through setting up a local experimental environment with Gateway API on KinD. This setup is designed purely for learning and testing - helping you understand Gateway API concepts without the complexity of a production deployment.

{{< warning >}}
EXPERIMENTAL SETUP - NOT FOR PRODUCTION USE
This is a development and learning environment only. The configuration described 
here is not suitable for production deployments. 
Once you're ready to deploy Gateway API in a production environment, 
select an [implementation](https://gateway-api.sigs.k8s.io/implementations/) that suits your needs.
{{< /warning >}}

## Overview

In this guide, you will:
- Set up a local Kubernetes cluster using KinD (Kubernetes in Docker)
- Deploy cloud-provider-kind, which provides both LoadBalancer services and a Gateway API controller
- Create a Gateway and HTTPRoute to route traffic to a demo application
- Test your Gateway API configuration locally

This setup is ideal for learning, development, and experimentation with Gateway API concepts.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **[Docker](https://docs.docker.com/get-docker/)** - Required to run KinD and cloud-provider-kind
- **[kubectl](https://kubernetes.io/docs/tasks/tools/)** - The Kubernetes command-line tool
- **[KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)** - Kubernetes in Docker

### Create a KinD Cluster

Create a new KinD cluster by running:

```shell
kind create cluster
```

This will create a single-node Kubernetes cluster running in a Docker container.

### Install cloud-provider-kind

Next, you need [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind/), which provides two key components for this setup:
- A LoadBalancer controller that assigns addresses to LoadBalancer-type Services
- A Gateway API controller that implements the Gateway API specification

Cloud-provider-kind also automatically installs the Gateway API Custom Resource Definitions (CRDs) in your cluster.

Run cloud-provider-kind as a Docker container on the same host where you created the KinD cluster:

```shell
VERSION=$(basename $(curl -s -L -o /dev/null -w '%{url_effective}' https://github.com/kubernetes-sigs/cloud-provider-kind/releases/latest))
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

Cloud-provider-kind automatically provisions a `GatewayClass` called `cloud-provider-kind`. You'll use this class to create your Gateway.

### Deploy a Gateway

The following manifest will:
- Create a new namespace called `gateway-infra`
- Deploy a `Gateway` that listens on port 80
- Accept `HTTPRoutes` with hostnames matching the `*.example.tld` pattern
- Allow routes from any namespace to attach to the Gateway

Apply the following manifest:

```yaml
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
    hostname: "*.example.tld"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: All
```

Verify that your Gateway is properly programmed and has an address assigned:

```shell
kubectl get gateway -n gateway-infra gateway
```

Expected output:
```
NAME      CLASS                 ADDRESS      PROGRAMMED   AGE
gateway   cloud-provider-kind   172.18.0.3   True         5m6s
```

The `PROGRAMMED` column should show `True`, and the `ADDRESS` field should contain an IP address.

### Deploy a Demo Application

Next, deploy a simple echo application that will help you test your Gateway configuration. This application:
- Listens on port 3000
- Echoes back request details including path, headers, and environment variables
- Runs in a namespace called `user`

Apply the following manifest:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: user
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: echo
  name: echo
  namespace: user
spec:
  ports:
  - name: http
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app: echo
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: echo
  name: echo
  namespace: user
spec:
  selector:
    matchLabels:
      app: echo
  template:
    metadata:
      labels:
        app: echo
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

Now create an `HTTPRoute` to route traffic from your Gateway to the echo application. This HTTPRoute will:
- Respond to requests for the hostname `some.example.tld`
- Route traffic to the echo application
- Attach to the Gateway in the `gateway-infra` namespace

Apply the following manifest:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: echo
  namespace: user
spec:
  parentRefs:
  - name: gateway
    namespace: gateway-infra
  hostnames: ["some.example.tld"]
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: echo
      port: 3000
```

### Test Your Route

The final step is to test your route using [curl](https://curl.se/). You'll make a request to the Gateway's IP address with the hostname `some.example.tld`:

```shell
GW_ADDR=$(kubectl get gateway -n gateway-infra gateway -o jsonpath='{.status.addresses[0].value}')
curl --resolve some.example.tld:80:${GW_ADDR} http://some.example.tld
```

You should receive a JSON response similar to this:

```json
{
 "path": "/",
 "host": "some.example.tld",
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
 "namespace": "user",
 "ingress": "",
 "service": "",
 "pod": "echo-dc48d7cf8-vs2df"
}
```

If you see this response, congratulations! Your Gateway API setup is working correctly.

## Troubleshooting

If something isn't working as expected, you can troubleshoot by checking the status of your resources.

### Check the Gateway Status

First, inspect your Gateway resource:

```shell
kubectl get gateway -n gateway-infra gateway -o yaml
```

Look at the `status` section for conditions. Your Gateway should have:
- `Accepted=True` - The Gateway was accepted by the controller
- `Programmed=True` - The Gateway was successfully configured
- `.status.addresses` populated with an IP address

### Check the HTTPRoute Status

Next, inspect your HTTPRoute:

```shell
kubectl get httproute -n user echo -o yaml
```

Check the `status.parents` section for conditions. Common issues include:

- `ResolvedRefs=False` with reason `BackendNotFound` - The backend Service doesn't exist or has the wrong name
- `Accepted=False` - The route couldn't attach to the Gateway (check namespace permissions or hostname matching)

Example error when a backend is not found:
```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2025-12-09T22:13:35Z"
      message: backend not found
      observedGeneration: 2
      reason: BackendNotFound
      status: "False"
      type: ResolvedRefs
    controllerName: kind.sigs.k8s.io/gateway-controller
```

### Check Controller Logs

If the resource statuses don't reveal the issue, check the cloud-provider-kind logs:

```shell
docker logs -f cloud-provider-kind
```

This will show detailed logs from both the LoadBalancer and Gateway API controllers.

## Cleanup

When you're finished with your experiments, you can clean up the resources:

### Remove Kubernetes Resources

Delete the namespaces (this will remove all resources within them):

```shell
kubectl delete namespace gateway-infra
kubectl delete namespace user
```

### Stop cloud-provider-kind

Stop and remove the cloud-provider-kind container:

```shell
docker stop cloud-provider-kind
```

**Note:** The container was started with the `--rm` flag, so it will be automatically removed when stopped.

### Delete the KinD Cluster

Finally, delete the KinD cluster:

```shell
kind delete cluster
```

## Next Steps

Now that you've experimented with Gateway API locally, you're ready to explore production-ready implementations:

- **Production Deployments**: Review the [Gateway API implementations](https://gateway-api.sigs.k8s.io/implementations/) to find a controller that matches your production requirements
- **Learn More**: Explore the [Gateway API documentation](https://gateway-api.sigs.k8s.io/) to learn about advanced features like TLS, traffic splitting, and header manipulation
- **Advanced Routing**: Experiment with path-based routing, header matching, and request mirroring

**Remember:** This KinD setup is for development and learning only. Always use a production-grade Gateway API implementation for real workloads.
