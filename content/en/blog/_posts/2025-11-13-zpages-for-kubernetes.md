---
layout: blog
title: "Kubernetes 1.35: Enhanced Debugging with Versioned z-pages APIs"
draft: true
slug: kubernetes-1-35-structured-zpages
author: >
  [Richa Banker](https://github.com/richabanker),
  [Han Kang](https://github.com/cncf/memorials/blob/main/han-kang.md)
---

Debugging Kubernetes control plane components can be challenging, especially when you need to quickly understand the runtime state of a component or verify its configuration. With Kubernetes 1.35, we're enhancing the z-pages debugging endpoints with structured, machine-parseable responses that make it easier to build tooling and automate troubleshooting workflows.

## What are z-pages?

z-pages are special debugging endpoints exposed by Kubernetes control plane components. Introduced as an alpha feature in Kubernetes 1.32, these endpoints provide runtime diagnostics for components like `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `kubelet` and `kube-proxy`. The name "z-pages" comes from the convention of using `/*z` paths for debugging endpoints.

Currently, Kubernetes supports two primary z-page endpoints:

`/statusz`
: Displays high-level component information including version information, start time, uptime, and available debug paths

`/flagz`
: Shows all command-line arguments and their values used to start the component (with confidential values redacted for security)

These endpoints are valuable for human operators who need to quickly inspect component state, but until now, they only returned plain text output that was difficult to parse programmatically.

## What's new in Kubernetes 1.35?

Kubernetes 1.35 introduces structured, versioned responses for both `/statusz` and `/flagz` endpoints. This enhancement maintains backward compatibility with the existing plain text format while adding support for machine-readable JSON responses.

### Backward compatible design

The new structured responses are opt-in. Without specifying an `Accept` header, the endpoints continue to return the familiar plain text format:

```
$ curl --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  https://localhost:6443/statusz

kube-apiserver statusz
Warning: This endpoint is not meant to be machine parseable, has no formatting compatibility guarantees and is for debugging purposes only.

Started: Wed Oct 16 21:03:43 UTC 2024
Up: 0 hr 00 min 16 sec
Go version: go1.23.2
Binary version: 1.35.0-alpha.0.1595
Emulation version: 1.35
Paths: /healthz /livez /metrics /readyz /statusz /version
```

### Structured JSON responses

To receive a structured response, include the appropriate `Accept` header:

```
Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Statusz
```

This returns a versioned JSON response:

```json
{
  "kind": "Statusz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "startTime": "2025-10-29T00:30:01Z",
  "uptimeSeconds": 856,
  "goVersion": "go1.23.2",
  "binaryVersion": "1.35.0",
  "emulationVersion": "1.35",
  "paths": [
    "/healthz",
    "/livez",
    "/metrics",
    "/readyz",
    "/statusz",
    "/version"
  ]
}
```

Similarly, `/flagz` supports structured responses with the header:

```
Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Flagz
```

Example response:

```json
{
  "kind": "Flagz",
  "apiVersion": "config.k8s.io/v1alpha1",
  "metadata": {
    "name": "kube-apiserver"
  },
  "flags": {
    "advertise-address": "192.168.8.4",
    "allow-privileged": "true",
    "authorization-mode": "[Node,RBAC]",
    "enable-priority-and-fairness": "true",
    "profiling": "true"
  }
}
```

## Why structured responses matter

The addition of structured responses opens up several new possibilities:

### 1. **Automated health checks and monitoring**

Instead of parsing plain text, monitoring tools can now easily extract specific fields. For example, you can programmatically check if a component has been running with an unexpected emulated version or verify that critical flags are set correctly.

### 2. **Better debugging tools**

Developers can build sophisticated debugging tools that compare configurations across multiple components or track configuration drift over time. The structured format makes it trivial to `diff` configurations or validate that components are running with expected settings.

### 3. **API versioning and stability**

By introducing versioned APIs (starting with `v1alpha1`), we provide a clear path to stability. As the feature matures, we'll introduce `v1beta1` and eventually `v1`, giving you confidence that your tooling won't break with future Kubernetes releases.

## How to use structured z-pages

### Prerequisites

Both endpoints require feature gates to be enabled:

- `/statusz`: Enable the `ComponentStatusz` feature gate
- `/flagz`: Enable the `ComponentFlagz` feature gate

### Example: Getting structured responses

Here's an example using `curl` to retrieve structured JSON responses from the kube-apiserver:

```bash
# Get structured statusz response
curl \
  --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  -H "Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Statusz" \
  https://localhost:6443/statusz | jq .

# Get structured flagz response
curl \
  --cert /etc/kubernetes/pki/apiserver-kubelet-client.crt \
  --key /etc/kubernetes/pki/apiserver-kubelet-client.key \
  --cacert /etc/kubernetes/pki/ca.crt \
  -H "Accept: application/json;v=v1alpha1;g=config.k8s.io;as=Flagz" \
  https://localhost:6443/flagz | jq .
```

{{< note >}}
The examples above use client certificate authentication and verify the server's certificate using `--cacert`. 
If you need to bypass certificate verification in a test environment, you can use `--insecure` (or `-k`), 
but this should never be done in production as it makes you vulnerable to man-in-the-middle attacks.
{{< /note >}}

## Important considerations

### Alpha feature status

The structured z-page responses are an **alpha** feature in Kubernetes 1.35. This means:

- The API format may change in future releases
- These endpoints are intended for debugging, not production automation
- You should avoid relying on them for critical monitoring workflows until they reach beta or stable status

### Security and access control

z-pages expose internal component information and require proper access controls. Here are the key security considerations:

**Authorization**: Access to z-page endpoints is restricted to members of the `system:monitoring` group, which follows the same authorization model as other debugging endpoints like `/healthz`, `/livez`, and `/readyz`. This ensures that only authorized users and service accounts can access debugging information. If your cluster uses RBAC, you can manage access by granting appropriate permissions to this group.

**Authentication**: The authentication requirements for these endpoints depend on your cluster's configuration. Unless anonymous authentication is enabled for your cluster, you typically need to use authentication mechanisms (such as client certificates) to access these endpoints.

**Information disclosure**: These endpoints reveal configuration details about your cluster components, including:
- Component versions and build information
- All command-line arguments and their values (with confidential values redacted)
- Available debug endpoints

Only grant access to trusted operators and debugging tools. Avoid exposing these endpoints to unauthorized users or automated systems that don't require this level of access.

### Future evolution

As the feature matures, we (Kubernetes SIG Instrumentation) expect to:

- Introduce `v1beta1` and eventually `v1` versions of the API
- Gather community feedback on the response schema
- Potentially add additional z-page endpoints based on user needs

## Try it out

We encourage you to experiment with structured z-pages in a test environment:

1. Enable the `ComponentStatusz` and `ComponentFlagz` feature gates on your control plane components
2. Try querying the endpoints with both plain text and structured formats
3. Build a simple tool or script that uses the structured data
4. Share your feedback with the community

## Learn more

- [z-pages documentation](/docs/reference/instrumentation/zpages/)
- [KEP-4827: Component Statusz](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/4827-component-statusz/README.md)
- [KEP-4828: Component Flagz](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/4828-component-flagz/README.md)
- Join the discussion in the [#sig-instrumentation](https://kubernetes.slack.com/archives/C20HH14P7) channel on Kubernetes Slack

## Get involved

We'd love to hear your feedback! The structured z-pages feature is designed to make Kubernetes easier to debug and monitor. Whether you're building internal tooling, contributing to open source projects, or just exploring the feature, your input helps shape the future of Kubernetes observability.

If you have questions, suggestions, or run into issues, please reach out to SIG Instrumentation. You can find us on Slack or at our regular [community meetings](https://github.com/kubernetes/community/tree/master/sig-instrumentation).

Happy debugging!