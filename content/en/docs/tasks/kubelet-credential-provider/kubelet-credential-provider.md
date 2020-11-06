---
title: Kubelet Image Credential Provider
reviewers:
- liggitt
- cheftako
description: Configure the kubelet's image credential provider plugin
content_type: task
---

<!-- overview -->

Starting from Kubernetes v1.20, the kubelet can dynamically retrieve credentials for a container image registry
using exec plugins. The kubelet and the exec plugin communicate through stdio (stdin, stdout, and stderr) using
Kubernetes versioned APIs. These plugins allow the kubelet to request credentials for a container registry dynamically
as oppposed to storing static credentials on disk. For example, the plugin may talk to a local metadata server to retrieve
short-lived credentials for an image that is being pulled by the kubelet.

You may be interested in using this capabilitiy if any of the below are true:
1. API calls to a cloud provider service are required to retreive authentication information for a registry.
2. Credentials have short expiration times and requesting new credentials frequently is required.
3. Storing registry credentials on disk or in image pull Secrets is not acceptable.

This guide demonstrates how to configure the kubelet's image credential provider plugin mechanism.

{{< note >}}
This capabilitiy will eventually replace built-in logic in the kubelet to serve registry credentials for Azure, AWS and GCP.
{{< /note >}}

## {{% heading "prerequisites" %}}

* kubelet on v1.20 or later. If on v1.20, ensure the alpha feature gate `KubeletCredentialProviders` is on.
* A working implementation of a credential provider exec plugin. You can build your own plugin or use one provided by cloud providers.

<!-- steps -->

## Installing Plugins on Nodes

A credential provider plugin is an exectuable binary that will be run by the kubelet. Ensure that the plugin binary exists on
every node in your cluster and stored in a known directory. The directory will be required later when configuring kubelet flags.

## Configuring Kubelet

### Flags

In order to use this feature, the kubelet expects two flags to be set:
* `--image-credential-provider-config` - the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir` - the path to the directory where credential provider plugin binaries are located.

If you are on v1.20, ensure the feature gate `KubeletCredentialProviders` is enabled via the `--feature-gates` flag.

### Credential Provider Configuration File

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins
should be invoked for which container images. Here's an example configuration file you may end up using if you are using the ECR-based plugin:

```yaml
kind: CredentialProviderConfig
apiVersion: kubelet.config.k8s.io/v1alpha1
providers:
  - name: ecr
    matchImages:
    - "*.dkr.ecr.*.amazonaws.com"
    - "*.dkr.ecr.*.amazonaws.cn"
    - "*.dkr.ecr-fips.*.amazonaws.com"
    - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
    - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    defaultCacheDuration: 12h
    apiVersion: credentialprovider.kubelet.k8s.io/v1alpha1
```

The `providers` field is a list of enabled plugins used by the kubelet. Each entry has a few required fields:
* `name`: the name of the plugin which MUST match the name of the executable binary that exists in the directory passed into `--image-credential-provider-bin-dir`.
* `matchImages`: a list of strings used to match against images in order to determine if this provider should be invoked. More on this below.
* `defaultCacheDuration`: the default duration the kubelet will cache credentials in-memory if a cache duration was not specified by the plugin.
* `apiVersion`: the api version that the kubelet and the exec plugin will use when communicating.

Each credential provider can also be given optional args and environment variables like so:

```yaml
kind: CredentialProviderConfig
apiVersion: kubelet.config.k8s.io/v1alpha1
providers:
  - name: myplugin
    matchImages:
    - "*.example.com"
    defaultCacheDuration: 12h
    apiVersion: credentialprovider.kubelet.k8s.io/v1alpha1
    args:
    - get-credentials
    env:
    - name: EXAMPLE_ENV_VAR_NAME
      value: EXAMPLE_ENV_VAR_VALUE
```

Consult the plugin implementors to determine what set of arguments and environment variables are required for a given plugin.

#### Match Images

The `matchImages` field for each credenetial provider is used by the kubelet to determine whether a plugin should be invoked for a given image that a Pod is using.
Each entry in `matchImages` is a pattern which can optionally contain a port and a path. Globs can be used in the domain, but not in the port or the path. Globs are
supported as subdomains like '*.k8s.io' or 'k8s.*.io', and top-level domains such as 'k8s.*'. Matching partial subdomains like 'app*.k8s.io' is also supported. Each
glob can only match a single subdomain segment, so '*.io' does NOT match '*.k8s.io'.

A match exists between an image and a matchImage entry when all of the below are true:
* Both contain the same number of domain parts and each part matches.
* The URL path of an imageMatch must be a prefix of the target image URL path.
* If the imageMatch contains a port, then the port must match in the image as well.

Some example values of `matchImages` are:
* 123456789.dkr.ecr.us-east-1.amazonaws.com
* .azurecr.io
* gcr.io
* *.*.registry.io
* *.*.registry.io:8080/path
