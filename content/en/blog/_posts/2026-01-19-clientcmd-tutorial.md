---
layout: blog
title: 'Uniform API server access using clientcmd'
date: 2026-01-19T10:00:00-08:00
slug: clientcmd-apiserver-access
author: >
  [Stephen Kitt](https://github.com/skitt) (Red Hat)
---

If you've ever wanted to develop a command line client for a Kubernetes API,
especially if you've considered making your client usable as a `kubectl` plugin,
you might have wondered how to make your client feel familiar to users of `kubectl`.
A quick glance at the output of `kubectl options` might put a damper on that:
"Am I really supposed to implement all those options?"

Fear not, others have done a lot of the work involved for you.
In fact, the Kubernetes project provides two libraries to help you handle
`kubectl`-style command line arguments in Go programs:
[`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd) and
[`cli-runtime`](https://pkg.go.dev/k8s.io/cli-runtime)
(which uses `clientcmd`).
This article will show how to use the former.

## General philosophy

As might be expected since it's part of `client-go`,
`clientcmd`'s ultimate purpose is to provide an instance of
[`restclient.Config`](https://pkg.go.dev/k8s.io/client-go/rest#Config)
that can issue requests to an API server.

It follows `kubectl` semantics:
* defaults are taken from `~/.kube` or equivalent;
* files can be specified using the `KUBECONFIG` environment variable;
* all of the above settings can be further overridden using command line arguments.

It doesn't set up a `--kubeconfig` command line argument,
which you might want to do to align with `kubectl`;
you'll see how to do this
in the ["Bind the flags"](#bind-the-flags) section.

## Available features

`clientcmd` allows programs to handle

* `kubeconfig` selection (using `KUBECONFIG`);
* context selection;
* namespace selection;
* client certificates and private keys;
* user impersonation;
* HTTP Basic authentication support (username/password).

## Configuration merging

In various scenarios, `clientcmd` supports _merging_ configuration settings:
`KUBECONFIG` can specify multiple files whose contents are combined.
This can be confusing, because settings are merged in different directions
depending on how they are implemented.
If a setting is defined in a map, the first definition wins,
subsequent definitions are ignored.
If a setting is not defined in a map, the last definition wins.

When settings are retrieved using `KUBECONFIG`,
missing files result in warnings only.
If the user explicitly specifies a path (in `--kubeconfig` style),
there must be a corresponding file.

If `KUBECONFIG` isn't defined,
the default configuration file, `~/.kube/config`, is used instead,
if present.

### Overall process

The general usage pattern is succinctly expressed in
the [`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd) package documentation:

```go
loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
// if you want to change the loading rules (which files in which order), you can do so here

configOverrides := &clientcmd.ConfigOverrides{}
// if you want to change override values or bind them to flags, there are methods to help you

kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)
config, err := kubeConfig.ClientConfig()
if err != nil {
	// Do something
}
client, err := metav1.New(config)
// ...
```

In the context of this article, there are six steps:

1. [Configure the loading rules](#configure-the-loading-rules).
1. [Configure the overrides](#configure-the-overrides).
1. [Build a set of flags](#build-a-set-of-flags).
1. [Bind the flags](#bind-the-flags).
1. [Build the merged configuration](#build-the-merged-configuration).
1. [Obtain an API client](#obtain-an-api-client).

### Configure the loading rules

`clientcmd.NewDefaultClientConfigLoadingRules()` builds loading rules which will use either the contents of the `KUBECONFIG` environment variable,
or the default configuration file name (`~/.kube/config`).
In addition, if the default configuration file is used,
it is able to migrate settings from the (very) old default configuration file
(`~/.kube/.kubeconfig`).

You can build your own `ClientConfigLoadingRules`,
but in most cases the defaults are fine.

### Configure the overrides

`clientcmd.ConfigOverrides` is a `struct` storing overrides which will be applied over the settings loaded from the configuration derived using the loading rules.
In the context of this article,
its primary purpose is to store values obtained from command line arguments.
These are handled using the [pflag](https://github.com/spf13/pflag) library,
which is a drop-in replacement for Go's [`flag`](https://pkg.go.dev/flag) package,
adding support for double-hyphen arguments with long names.

In most cases there's nothing to set in the overrides;
I will only bind them to flags.

### Build a set of flags

In this context, a flag is a representation of a command line argument,
specifying its long name (such as `--namespace`),
its short name if any (such as `-n`),
its default value,
and a description shown in the usage information.
Flags are stored in instances of
the [`FlagInfo`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#FlagInfo) struct.

Three sets of flags are available,
representing the following command line arguments:

* authentication arguments (certificates, tokens, impersonations, username/password);
* cluster arguments (API server, certificate authority, TLS configuration, proxy, compression)
* context arguments (cluster name, `kubeconfig` user name, namespace)

The recommended selection includes all three with a named context selection argument and a timeout argument.

These are all available using the `Recommended…Flags` functions.
The functions take a prefix, which is prepended to all the argument long names.

So calling
[`clientcmd.RecommendedConfigOverrideFlags("")`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#RecommendedConfigOverrideFlags)
results in command line arguments such as `--context`, `--namespace`, and so on.
The `--timeout` argument is given a default value of 0,
and the `--namespace` argument has a corresponding short variant, `-n`.
Adding a prefix, such as `"from-"`, results in command line arguments such as
`--from-context`, `--from-namespace`, etc.
This might not seem particularly useful on commands involving a single API server,
but they come in handy when multiple API servers are involved,
such as in multi-cluster scenarios.

There's a potential gotcha here: prefixes don't modify the short name,
so `--namespace` needs some care if multiple prefixes are used:
only one of the prefixes can be associated with the `-n` short name.
You'll have to clear the short names associated with the other prefixes'
`--namespace` , or perhaps all prefixes if there's no sensible
`-n` association.
Short names can be cleared as follows:

```go
kflags := clientcmd.RecommendedConfigOverrideFlags(prefix)
kflags.ContextOverrideFlags.Namespace.ShortName = ""
```

In a similar fashion, flags can be disabled entirely by clearing their long name:

```go
kflags.ContextOverrideFlags.Namespace.LongName = ""
```

### Bind the flags

Once a set of flags has been defined,
it can be used to bind command line arguments to overrides using
[`clientcmd.BindOverrideFlags`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#BindOverrideFlags).
This requires a
[`pflag`](https://pkg.go.dev/github.com/spf13/pflag) `FlagSet`
rather than one from Go's `flag` package.

If you also want to bind `--kubeconfig`, you should do so now,
by binding `ExplicitPath` in the loading rules:

```go
flags.StringVarP(&loadingRules.ExplicitPath, "kubeconfig", "", "", "absolute path(s) to the kubeconfig file(s)")
```

### Build the merged configuration

Two functions are available to build a merged configuration:

* [`clientcmd.NewInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewInteractiveDeferredLoadingClientConfig)
* [`clientcmd.NewNonInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewNonInteractiveDeferredLoadingClientConfig)

As the names suggest, the difference between the two is that the first
can ask for authentication information interactively,
using a provided reader,
whereas the second only operates on the information given to it by the caller.

The "deferred" mention in these function names refers to the fact that
the final configuration will be determined as late as possible.
This means that these functions can be called before the command line arguments are parsed,
and the resulting configuration will use whatever values have been parsed
by the time it's actually constructed.

### Obtain an API client

The merged configuration is returned as a
[`ClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#ClientConfig) instance.
An API client can be obtained from that by calling the `ClientConfig()` method.

If no configuration is given
(`KUBECONFIG` is empty or points to non-existent files,
`~/.kube/config` doesn't exist,
and no configuration is given using command line arguments),
the default setup will return an obscure error referring to `KUBERNETES_MASTER`.
This is legacy behaviour;
several attempts have been made to get rid of it,
but it is preserved for the `--local` and `--dry-run` command line arguments in `--kubectl`.
You should check for "empty configuration" errors by calling `clientcmd.IsEmptyConfig()`
and provide a more explicit error message.

The `Namespace()` method is also useful:
it returns the namespace that should be used.
It also indicates whether the namespace was overridden by the user
(using `--namespace`).

## Full example

Here's a complete example.

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/pflag"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func main() {
	// Loading rules, no configuration
	loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()

	// Overrides and flag (command line argument) setup
	configOverrides := &clientcmd.ConfigOverrides{}
	flags := pflag.NewFlagSet("clientcmddemo", pflag.ExitOnError)
	clientcmd.BindOverrideFlags(configOverrides, flags,
		clientcmd.RecommendedConfigOverrideFlags(""))
	flags.StringVarP(&loadingRules.ExplicitPath, "kubeconfig", "", "", "absolute path(s) to the kubeconfig file(s)")
	flags.Parse(os.Args)

	// Client construction
	kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)
	config, err := kubeConfig.ClientConfig()
	if err != nil {
		if clientcmd.IsEmptyConfig(err) {
			panic("Please provide a configuration pointing to the Kubernetes API server")
		}
		panic(err)
	}
	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	// How to find out what namespace to use
	namespace, overridden, err := kubeConfig.Namespace()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Chosen namespace: %s; overridden: %t\n", namespace, overridden)

	// Let's use the client
	nodeList, err := client.CoreV1().Nodes().List(context.TODO(), v1.ListOptions{})
	if err != nil {
		panic(err)
	}
	for _, node := range nodeList.Items {
		fmt.Println(node.Name)
	}
}
```

Happy coding, and thank you for your interest in implementing tools with
familiar usage patterns!
