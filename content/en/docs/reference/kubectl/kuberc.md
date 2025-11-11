---
title: Kubectl user preferences (kuberc)
content_type: concept
weight: 70
---

{{< feature-state state="beta" for_k8s_version="1.34" >}}

A Kubernetes `kuberc` configuration file allows you to define preferences for
{{<glossary_tooltip text="kubectl" term_id="kubectl">}},
such as default options and command aliases. Unlike the kubeconfig file, a `kuberc`
configuration file does **not** contain cluster details, usernames or passwords.

The default location of this configuration file is `$HOME/.kube/kuberc`.
To provide kubectl with a path to a custom kuberc file, use the `--kuberc` command line option,
or set the `KUBERC` environment variable.

A `kuberc` using the `kubectl.config.k8s.io/v1beta1` format allows you to define
two types of user preferences:

1. [Aliases](#aliases) - allow you to create shorter versions of your favorite
   commands, optionally setting options and arguments.
2. [Defaults](#defaults) - allow you to configure default option values for your
   favorite commands.

## aliases

Within a `kuberc` configuration, the _aliases_ section allows you to define custom
shortcuts for kubectl commands, optionally with preset command line arguments
and flags.

This next example defines a `kubectl getn` alias for the `kubectl get` subcommand,
additionally specifying JSON output format: `--output=json`.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
- name: getn
  command: get
  options:
   - name: output
     default: json
```

In this example, the following settings were used:

1. `name` - Alias name must not collide with the built-in commands.
1. `command` - Specify the underlying built-in command that your alias will execute.
   This includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.

With this alias, running `kubectl getn pods` will default JSON output. However,
if you execute `kubectl getn pods -oyaml`, the output will be in YAML format.

Full `kuberc` schema is available [here](/docs/reference/config-api/kuberc.v1beta1/).

### prependArgs

This next example, will expand the previous one, introducing `prependArgs` section,
which allows inserting arbitrary arguments immediately after the kubectl command
and its subcommand (if any).

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
  - name: getn
    command: get
    options:
      - name: output
        default: json
    prependArgs:
      - namespace
```

In this example, the following settings were used:

1. `name` - Alias name must not collide with the built-in commands.
1. `command` - Specify the underlying built-in command that your alias will execute.
   This includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.
1. `prependArgs` - Specify explicit argument that will be placed right after the
   command. Here, this will be translated to `kubectl get namespace test-ns --output json`.

### appendArgs

This next example, will introduce a mechanism similar to prepending arguments,
this time, though, we will append arguments to the end of the kubectl command.

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
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

In this example, the following settings were used:

1. `name` - Alias name must not collide with the built-in commands.
1. `command` - Specify the underlying built-in command that your alias will execute.
   This includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.
1. `appendArgs` - Specify explicit arguments that will be placed at the end of the
   command. Here, this will be translated to `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## defaults

Within a `kuberc` configuration, `defaults` section lets you specify default values
for command line arguments.

This next example makes the interactive removal the default mode for invoking
`kubectl delete`:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
- command: delete
  options:
    - name: interactive
      default: "true"
```

In this example, the following settings were used:

1. `command` - Built-in command, this includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.

With this setting, running `kubectl delete pod/test-pod` will default to prompting for confirmation.
However, `kubectl delete pod/test-pod --interactive=false` will bypass the confirmation.

## Suggested defaults

The kubectl maintainers encourage you to adopt kuberc with the following defaults:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
  # (1) default server-side apply
  - command: apply
    options:
      - name: server-side
        default: "true"

  # (2) default interactive deletion
  - command: delete
    options:
      - name: interactive
        default: "true"
```

In this example, the following settings are enforced:
1. Defaults to using [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
1. Defaults to interactive removal whenever invoking `kubectl delete` to prevent
   accidental removal of resources from the cluster.


## Disable kuberc

To temporarily disable the `kuberc` functionality, set (and export) the environment
variable `KUBERC` with the value `off`:

```shell
export KUBERC=off
```

or disable the feature gate:

```shell
export KUBECTL_KUBERC=false
```
