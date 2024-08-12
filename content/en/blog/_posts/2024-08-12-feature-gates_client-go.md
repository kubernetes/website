---
layout: blog
title: 'Introducing Feature Gates to Client-Go: Enhancing Flexibility and Control'
date: 2024-08-12
slug: feature-gates-in-client-go
author: >
 Ben Luddy (Red Hat),
 Lukasz Szaszkiewicz (Red Hat)
---

Kubernetes components use on-off switches called _feature gates_ to manage the risk of adding a new feature.
The feature gate mechanism is what enables incremental graduation of a feature through the stages Alpha, Beta, and GA.

Kubernetes components, such as kube-controller-manager and kube-scheduler, use the client-go library to interact with the API. 
The same library is used across the Kubernetes ecosystem to build controllers, tools, webhooks, and more. client-go now includes 
its own feature gating mechanism, giving developers and cluster administrators more control over how they adopt client features.

To learn more about feature gates in Kubernetes, visit [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).

## Motivation

In the absence of client-go feature gates, each new feature separated feature availability from enablement in its own way, if at all. 
Some features were enabled by updating to a newer version of client-go. Others needed to be actively configured in each program that used them. 
A few were configurable at runtime using environment variables. Consuming a feature-gated functionality exposed by the kube-apiserver sometimes 
required a client-side fallback mechanism to remain compatible with servers that don’t support the functionality due to their age or configuration. 
In cases where issues were discovered in these fallback mechanisms, mitigation required updating to a fixed version of client-go or rolling back.

None of these approaches offer good support for enabling a feature by default in some, but not all, programs that consume client-go. 
Instead of enabling a new feature at first only for a single component, a change in the default setting immediately affects the default 
for all Kubernetes components, which broadens the blast radius significantly.

## Feature gates in client-go

To address these challenges, substantial client-go features will be phased in using the new feature gate mechanism. 
It will allow developers and users to enable or disable features in a way that will be familiar to anyone who has experience 
with feature gates  in the Kubernetes components.

Out of the box, simply by using a recent version of client-go, this offers several benefits.

For people who use software built with client-go:


* Early adopters can enable a default-off client-go feature on a per-process basis.
* Misbehaving features can be disabled without building a new binary.
* The state of all known client-go feature gates is logged, allowing users to inspect it.

For people who develop software built with client-go:

* By default, client-go feature gate overrides are read from environment variables. 
  If a bug is found in a client-go feature, users will be able to disable it without waiting for a new release.
* Developers can replace the default environment-variable-based overrides in a program to change defaults, 
  read overrides from another source, or disable runtime overrides completely. 
  The Kubernetes components use this customizability to integrate client-go feature gates with 
  the existing `--feature-gates` command-line flag, feature enablement metrics, and logging.

## Overriding client-go feature gates

**Note**: This describes the default method for overriding client-go feature gates at runtime. 
It can be disabled or customized by the developer of a particular program. 
In Kubernetes components, client-go feature gate overrides are controlled by the `--feature-gates` flag.

Features of client-go can be enabled or disabled by setting environment variables prefixed with `KUBE_FEATURE`. 
For example, to enable a feature named `MyFeature`, set the environment variable as follows:

```
 KUBE_FEATURE_MyFeature=true
```

To disable the feature, set the environment variable to `false`:

```
 KUBE_FEATURE_MyFeature=false
```

**Note**: Environment variables are case-sensitive on some operating systems. 
Therefore, `KUBE_FEATURE_MyFeature` and `KUBE_FEATURE_MYFEATURE` would be considered two different variables.

## Customizing client-go feature gates

The default environment-variable based mechanism for feature gate overrides can be sufficient for many programs in the Kubernetes ecosystem, 
and requires no special integration. Programs that require different behavior can replace it with their own custom feature gate provider. 
This allows a program to do things like force-disable a feature that is known to work poorly, 
read feature gates directly from a remote configuration service, or accept feature gate overrides through command-line options.

The Kubernetes components replace client-go’s default feature gate provider with a shim to the existing Kubernetes feature gate provider. 
For all practical purposes, client-go feature gates are treated the same as other Kubernetes 
feature gates: they are wired to the `--feature-gates` command-line flag, included in feature enablement metrics, and logged on startup.

To replace the default feature gate provider, implement the Gates interface and call ReplaceFeatureGates 
at package initialization time, as in this simple example:

```go
import (
 “k8s.io/client-go/features”
)

type AlwaysEnabledGates struct{}

func (AlwaysEnabledGates) Enabled(features.Feature) bool {
 return true
}

func init() {
 features.ReplaceFeatureGates(AlwaysEnabledGates{})
}
```

Implementations that need the complete list of defined client-go features can get it by implementing the Registry interface 
and calling `AddFeaturesToExistingFeatureGates`. 
For a complete example, refer to [the usage within Kubernetes](https://github.com/kubernetes/kubernetes/blob/64ba17c605a41700f7f4c4e27dca3684b593b2b9/pkg/features/kube_features.go#L990-L997).

## Summary

With the introduction of feature gates in client-go v1.30, rolling out a new client-go feature has become safer and easier. 
Users and developers can control the pace of their own adoption of client-go features. 
The work of Kubernetes contributors is streamlined by having a common mechanism for graduating features that span both sides of the Kubernetes API boundary.

Special shoutout to [@sttts](https://github.com/sttts) and [@deads2k](https://github.com/deads2k) for their help in shaping this feature.