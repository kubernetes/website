---
layout: blog
title: 'Kubernetes v1.26: GA Support for Kubelet Credential Providers'
date: 2022-12-22
slug: kubelet-credential-providers
author: >
  Andrew Sy Kim (Google),
  Dixita Narang (Google)
---

Kubernetes v1.26 introduced generally available (GA) support for [_kubelet credential
provider plugins_]( /docs/tasks/kubelet-credential-provider/kubelet-credential-provider/),
offering an extensible plugin framework to dynamically fetch credentials
for any container image registry.

## Background

Kubernetes supports the ability to dynamically fetch credentials for a container registry service.
Prior to Kubernetes v1.20, this capability was compiled into the kubelet and only available for
Amazon Elastic Container Registry, Azure Container Registry, and Google Cloud Container Registry.

{{< figure src="kubelet-credential-providers-in-tree.png" caption="Figure 1: Kubelet built-in credential provider support for Amazon Elastic Container Registry, Azure Container Registry, and Google Cloud Container Registry." >}}

Kubernetes v1.20 introduced alpha support for kubelet credential providers plugins,
which provides a mechanism for the kubelet to dynamically authenticate and pull images
for arbitrary container registries - whether these are public registries, managed services,
or even a self-hosted registry.
In Kubernetes v1.26, this feature is now GA

{{< figure src="kubelet-credential-providers-plugin.png" caption="Figure 2: Kubelet credential provider overview" >}}

## Why is it important?

Prior to Kubernetes v1.20,  if you wanted to dynamically fetch credentials for image registries
other than ACR (Azure Container Registry), ECR (Elastic Container Registry), or GCR
(Google Container Registry), you needed to modify the kubelet code.
The new plugin mechanism can be used in any cluster, and lets you authenticate to new registries without
any changes to Kubernetes itself. Any cloud provider or vendor can publish a plugin that lets you authenticate with their image registry.

## How it works

The kubelet and the exec plugin binary communicate through stdio (stdin, stdout, and stderr) by sending and receiving
json-serialized api-versioned types. If the exec plugin is enabled and the kubelet requires authentication information for an image
that matches against a plugin, the kubelet will execute the plugin binary, passing the `CredentialProviderRequest` API via stdin. Then
the exec plugin communicates with the container registry to dynamically fetch the credentials and returns the credentials in an
encoded response of the `CredentialProviderResponse` API to the kubelet via stdout.

{{< figure src="kubelet-credential-providers-how-it-works.png" caption="Figure 3: Kubelet credential provider plugin flow" >}}

On receiving credentials from the kubelet, the plugin can also indicate how long credentials can be cached for, to prevent unnecessary
execution of the plugin by the kubelet for subsequent image pull requests to the same registry. In cases where the cache duration
is not specified by the plugin, a default cache duration can be specified by the kubelet (more details below).

```json
{
  "apiVersion": "kubelet.k8s.io/v1",
  "kind": "CredentialProviderResponse",
  "auth": {
    "cacheDuration": "6h",
    "private-registry.io/my-app": {
      "username": "exampleuser",
      "password": "token12345"
    }
  }
}
```

In addition, the plugin can specify the scope in which cached credentials are valid for. This is specified through the `cacheKeyType` field
in `CredentialProviderResponse`. When the value is `Image`, the kubelet will only use cached credentials for future image pulls that exactly
match the image of the first request. When the value is `Registry`, the kubelet will use cached credentials for any subsequent image pulls
destined for the same registry host but using different paths (for example, `gcr.io/foo/bar` and `gcr.io/bar/foo` refer to different images
from the same registry). Lastly, when the value is `Global`, the kubelet will use returned credentials for all images that match against
the plugin, including images that can map to different registry hosts (for example, gcr.io vs registry.k8s.io (previously k8s.gcr.io)). The `cacheKeyType` field is required by plugin
implementations.

```json
{
  "apiVersion": "kubelet.k8s.io/v1",
  "kind": "CredentialProviderResponse",
  "auth": {
    "cacheKeyType": "Registry",
    "private-registry.io/my-app": {
      "username": "exampleuser",
      "password": "token12345"
    }
  }
}
```

## Using kubelet credential providers

You can configure credential providers by installing the exec plugin(s) into
a local directory accessible by the kubelet on every node. Then you set two command line arguments for the kubelet:
* `--image-credential-provider-config`: the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir`: the path to the directory where credential provider plugin binaries are located.

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins should be invoked for a container image used by a Pod.
Note that the name of each _provider_ must match the name of the binary located in the local directory specified in `--image-credential-provider-bin-dir`, otherwise the kubelet
cannot locate the path of the plugin to invoke.

```yaml
kind: CredentialProviderConfig
apiVersion: kubelet.config.k8s.io/v1
providers:
- name: auth-provider-gcp
  apiVersion: credentialprovider.kubelet.k8s.io/v1
  matchImages:
  - "container.cloud.google.com"
  - "gcr.io"
  - "*.gcr.io"
  - "*.pkg.dev"
  args:
  - get-credentials
  - --v=3
  defaultCacheDuration: 1m
```

Below is an overview of how the Kubernetes project is using kubelet credential providers for end-to-end testing.

{{< figure src="kubelet-credential-providers-enabling.png" caption="Figure 4: Kubelet credential provider configuration used for Kubernetes e2e testing" >}}

For more configuration details, see [Kubelet Credential Providers](/docs/tasks/kubelet-credential-provider/kubelet-credential-provider/).

## Getting Involved

Come join SIG Node if you want to report bugs or have feature requests for the Kubelet Credential Provider. You can reach us through the following ways:
* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
* [Biweekly meetings](https://github.com/kubernetes/community/tree/master/sig-node#meetings)
