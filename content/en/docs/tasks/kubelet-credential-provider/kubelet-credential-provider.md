---
title: Configure a kubelet image credential provider
reviewers:
- liggitt
- cheftako
description: Configure the kubelet's image credential provider plugin
content_type: task
---

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

<!-- overview -->

Starting from Kubernetes v1.20, the kubelet can dynamically retrieve credentials for a container image registry
using exec plugins. The kubelet and the exec plugin communicate through stdio (stdin, stdout, and stderr) using
Kubernetes versioned APIs. These plugins allow the kubelet to request credentials for a container registry dynamically
as opposed to storing static credentials on disk. For example, the plugin may talk to a local metadata server to retrieve
short-lived credentials for an image that is being pulled by the kubelet.

You may be interested in using this capability if any of the below are true:

* API calls to a cloud provider service are required to retrieve authentication information for a registry.
* Credentials have short expiration times and requesting new credentials frequently is required.
* Storing registry credentials on disk or in imagePullSecrets is not acceptable.

This guide demonstrates how to configure the kubelet's image credential provider plugin mechanism.

## {{% heading "prerequisites" %}}

* The kubelet image credential provider is introduced in v1.20 as an alpha feature. As with other alpha features,
a feature gate `KubeletCredentialProviders` must be enabled on only the kubelet for the feature to work.
* A working implementation of a credential provider exec plugin. You can build your own plugin or use one provided by cloud providers.

<!-- steps -->

## Installing Plugins on Nodes

A credential provider plugin is an executable binary that will be run by the kubelet. Ensure that the plugin binary exists on
every node in your cluster and stored in a known directory. The directory will be required later when configuring kubelet flags.

## Configuring the Kubelet

In order to use this feature, the kubelet expects two flags to be set:
* `--image-credential-provider-config` - the path to the credential provider plugin config file.
* `--image-credential-provider-bin-dir` - the path to the directory where credential provider plugin binaries are located.

### Configure a kubelet credential provider

The configuration file passed into `--image-credential-provider-config` is read by the kubelet to determine which exec plugins
should be invoked for which container images. Here's an example configuration file you may end up using if you are using the [ECR](https://aws.amazon.com/ecr/)-based plugin:

```yaml
kind: CredentialProviderConfig
apiVersion: kubelet.config.k8s.io/v1alpha1
# providers is a list of credential provider plugins that will be enabled by the kubelet.
# Multiple providers may match against a single image, in which case credentials
# from all providers will be returned to the kubelet. If multiple providers are called
# for a single image, the results are combined. If providers return overlapping
# auth keys, the value from the provider earlier in this list is used.
providers:
  # name is the required name of the credential provider. It must match the name of the
  # provider executable as seen by the kubelet. The executable must be in the kubelet's
  # bin directory (set by the --image-credential-provider-bin-dir flag).
  - name: ecr
    # matchImages is a required list of strings used to match against images in order to
    # determine if this provider should be invoked. If one of the strings matches the
    # requested image from the kubelet, the plugin will be invoked and given a chance
    # to provide credentials. Images are expected to contain the registry domain
    # and URL path.
    #
    # Each entry in matchImages is a pattern which can optionally contain a port and a path.
    # Globs can be used in the domain, but not in the port or the path. Globs are supported
    # as subdomains like '*.k8s.io' or 'k8s.*.io', and top-level-domains such as 'k8s.*'.
    # Matching partial subdomains like 'app*.k8s.io' is also supported. Each glob can only match
    # a single subdomain segment, so *.io does not match *.k8s.io.
    #
    # A match exists between an image and a matchImage when all of the below are true:
    # - Both contain the same number of domain parts and each part matches.
    # - The URL path of an imageMatch must be a prefix of the target image URL path.
    # - If the imageMatch contains a port, then the port must match in the image as well.
    #
    # Example values of matchImages:
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
    - "*.dkr.ecr.*.amazonaws.com"
    - "*.dkr.ecr.*.amazonaws.cn"
    - "*.dkr.ecr-fips.*.amazonaws.com"
    - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
    - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDuration is the default duration the plugin will cache credentials in-memory
    # if a cache duration is not provided in the plugin response. This field is required.
    defaultCacheDuration: "12h"
    # Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
    # MUST use the same encoding version as the input. Current supported values are:
    # - credentialprovider.kubelet.k8s.io/v1alpha1
    apiVersion: credentialprovider.kubelet.k8s.io/v1alpha1
    # Arguments to pass to the command when executing it.
    # +optional
    args:
    - get-credentials
    # Env defines additional environment variables to expose to the process. These
    # are unioned with the host's environment, as well as variables client-go uses
    # to pass argument to the plugin.
    # +optional
    env:
    - name: AWS_PROFILE
      value: example_profile
```

The `providers` field is a list of enabled plugins used by the kubelet. Each entry has a few required fields:
* `name`: the name of the plugin which MUST match the name of the executable binary that exists in the directory passed into `--image-credential-provider-bin-dir`.
* `matchImages`: a list of strings used to match against images in order to determine if this provider should be invoked. More on this below.
* `defaultCacheDuration`: the default duration the kubelet will cache credentials in-memory if a cache duration was not specified by the plugin.
* `apiVersion`: the api version that the kubelet and the exec plugin will use when communicating.

Each credential provider can also be given optional args and environment variables as well. Consult the plugin implementors to determine what set of arguments and environment variables are required for a given plugin.

#### Configure image matching

The `matchImages` field for each credential provider is used by the kubelet to determine whether a plugin should be invoked
for a given image that a Pod is using. Each entry in `matchImages` is an image pattern which can optionally contain a port and a path.
Globs can be used in the domain, but not in the port or the path. Globs are supported as subdomains like `*.k8s.io` or `k8s.*.io`,
and top-level domains such as `k8s.*`. Matching partial subdomains like `app*.k8s.io` is also supported. Each glob can only match
a single subdomain segment, so `*.io` does NOT match `*.k8s.io`.

A match exists between an image name and a `matchImage` entry when all of the below are true:

* Both contain the same number of domain parts and each part matches.
* The URL path of match image must be a prefix of the target image URL path.
* If the imageMatch contains a port, then the port must match in the image as well.

Some example values of `matchImages` patterns are:
* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`


## {{% heading "whatsnext" %}}

* Read the details about `CredentialProviderConfig` in the
  [kubelet configuration API (v1alpha1) reference](/docs/reference/config-api/kubelet-config.v1alpha1/).
