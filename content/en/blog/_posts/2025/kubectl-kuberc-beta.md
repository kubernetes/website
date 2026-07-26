---
layout: blog
title: "Kubernetes v1.34: User preferences (kuberc) are available for testing in kubectl 1.34"
date: 2025-08-28T10:30:00-08:00
slug: kubernetes-v1-34-kubectl-kuberc-beta
Author: >
  [Maciej Szulik](https://github.com/soltysh) (Defense Unicorns, Inc.)
---

Have you ever wished you could enable [interactive delete](https://kep.k8s.io/3895),
by default, in `kubectl`? Or maybe, you'd like to have custom aliases defined,
but not necessarily [generate hundreds of them manually](https://github.com/ahmetb/kubectl-aliases)?
Look no further. [SIG-CLI](https://git.k8s.io/community/sig-cli/)
has been working hard to add [user preferences to kubectl](https://kep.k8s.io/3104),
and we are happy to announce that this functionality is reaching beta as part
of the Kubernetes v1.34 release.

## How it works

A full description of this functionality is available [in our official documentation](/docs/reference/kubectl/kuberc/),
but this blog post will answer both of the questions from the beginning of this
article.

Before we dive into details, let's quickly cover what the user preferences file
looks like and where to place it. By default, `kubectl` will look for `kuberc`
file in your default [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
directory, which is `$HOME/.kube`. Alternatively, you can specify this location
using `--kuberc` option or the `KUBERC` environment variable.

Just like every Kubernetes manifest, `kuberc` file will start with an `apiVersion`
and `kind`:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
# the user preferences will follow here
```

### Defaults

Let's start by setting default values for `kubectl` command options. Our goal
is to always use interactive delete, which means we want the `--interactive`
option for `kubectl delete` to always be set to `true`. This can be achieved
with the following addition to our `kuberc` file:

```yaml
defaults:
- command: delete
  options:
  - name: interactive
    default: "true"
```

In the above example, I'm introducing `defaults` section, which allows users to
define default values for `kubectl` options. In this case, we're setting the
interactive option for `kubectl delete` to be `true` by default. This default
can be overridden if a user explicitly provides a different value such as
`kubectl delete --interactive=false`, in which case the explicit option takes
precedence.

Another highly encouraged default from SIG-CLI, is using [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
To do so, you can add the following snippet to your preferences:

```yaml
# continuing defaults section
- command: apply
  options:
  - name: server-side
    default: "true"
```

### Aliases

The ability to define aliases allows us to save precious seconds when typing
commands. I bet that you most likely have one defined for `kubectl`, because
typing seven letters is definitely longer than just pressing `k`.

For this reason, the ability to define aliases was a must-have when we decided
to implement user preferences, alongside defaulting. To define an alias for any
of the built-in commands, expand your `kuberc` file with the following addition:

```yaml
aliases:
- name: gns
  command: get
  prependArgs:
   - namespace
  options:
   - name: output
     default: json
```

There's a lot going on above, so let me break this down. First, we're introducing
a new section: `aliases`. Here, we're defining a new alias `gns`, which is mapped
to the command `get` command. Next, we're defining arguments (`namespace` resource)
that will be inserted right after the command name. Additionally, we're setting
`--output=json` option for this alias. The structure of `options` block is identical
to the one in the `defaults` section.

You probably noticed that we've introduced a mechanism for prepending arguments,
and you might wonder if there is a complementary setting for appending them (in
other words, adding to the end of the command, after user-provided arguments).
This can be achieved through `appendArgs` block, which is presented below:

```yaml
# continuing aliases section
- name: runx
  command: run
  options:
    - name: image
      default: busybox
    - name: namespace
      default: test-ns
  appendArgs:
    - --
    - custom-arg
```

Here, we're introducing another alias: `runx`, which invokes `kubectl run` command,
passing `--image` and `--namespace` options with predefined values, and also
appending `--` and `custom-arg` at the end of the invocation.

## Debugging

We hope that `kubectl` user preferences will open up new possibilities for our users.
Whenever you're in doubt, feel free to run `kubectl` with increased verbosity.
At `-v=5`, you should get all the possible debugging information from this feature,
which will be crucial when reporting issues.

To learn more, I encourage you to read through [our official documentation](/docs/reference/kubectl/kuberc/)
and the [actual proposal](https://git.k8s.io/enhancements/keps/sig-cli/3104-introduce-kuberc/README.md).

## Get involved

Kubectl user preferences feature has reached beta, and we are very interested
in your feedback. We'd love to hear what you like about it and what problems
you'd like to see it solve. Feel free to join [SIG-CLI slack channel](https://kubernetes.slack.com/archives/C2GL57FJ4),
or open an issue against [kubectl repository](https://git.k8s.io/kubectl/).
You can also join us at our [community meetings](https://git.k8s.io/community/sig-cli/#meetings),
which happen every other Wednesday, and share your stories with us.
