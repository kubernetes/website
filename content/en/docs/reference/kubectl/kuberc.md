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

On Linux / POSIX computers, the default location of this configuration file is `$HOME/.kube/kuberc`.
The default path on Windows is similar: `%USERPROFILE%\.kube\kuberc`.
To provide kubectl with a path to a custom kuberc file, use the `--kuberc` command line option,
or set the `KUBERC` environment variable.

A `kuberc` using the `kubectl.config.k8s.io/v1beta1` format allows you to define
the following types of user preferences:

1. [Aliases](#aliases) - allow you to create shorter versions of your favorite
   commands, optionally setting options and arguments.
2. [Defaults](#defaults) - allow you to configure default option values for your
   favorite commands.
3. [Credential Plugin Policy](#credential-plugin-policy) - allow you to configure
   a policy for exec credential plugins.

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

## Credential plugin policy

{{< feature-state for_k8s_version="v1.35" state="beta" >}}

Editors of a `kubeconfig` can specify an executable plugin that will be used to
acquire credentials to authenticate the client to the cluster. Within a `kuberc`
confguration, you can set the execution policy for such plugins by the use of
two top-level fields. Both fields are optional.

### credentialPluginPolicy

You can configure a policy for credentials plugins, using the optional
`credentialPluginPolicy` field. There are three valid values for this field:

1. `"AllowAll"`

When the policy is set to `"AllowAll"`, there will be no restrictions on which
plugins may run. This behavior is identical to that of Kubernetes versions prior
to 1.35.

2. `"DenyAll"`

When the policy is set to `"DenyAll"`, no exec plugins will be permitted to run.

3. `"Allowlist"`

When the policy is set to `"Allowlist"`, the user can selectively allow
execution of credential plugins. When the policy is `"Allowlist"`, you **must**
also provide the `credentialPluginAllowlist` field (also in the top-level). That
field is described below.

{{< note >}}
In order to maintain backward compatibility, an unspecified or empty
`credentialPluginPolicy` is identical to explicitly setting the policy to
`"AllowAll"`.
{{< /note >}}

### credentialPluginAllowlist

{{< note >}}
Setting this field when `credentialPluginPolicy` is not `Allowlist` (including
when that field is missing or empty) is considered a configuration error.
{{< /note >}}

The `credentialPluginAllowlist` field specifies a list of criteria-sets (sets of
*requirements*) for permission to execute credential plugins. Each set of
requirements will be attempted in turn; once the plugin meets all requirements
in at least one set, the plugin will be permitted to execute. That is, the
overall result of an application of the allowlist to plugin `my-binary-plugin`
is the _logical OR_ of the decisions rendered by each item in the list.

As an example, consider the following allowlist configuration:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: foo
  - name: bar
  - name: baz
```

In the above example, the allowlist will allow plugins that have the name "foo",
"bar", _OR_ "baz".

{{< note >}}
For a set of requirements to be valid it **must** have at least one field that is
nonempty and explicitly specified. If all fields are empty or unspecified, it is
considered a configuration error and the plugin will not be allowed to execute.
Likewise if the `credentialPluginAllowlist` field is unspecified, or if it is
specified explicitly as the empty list. This is in order to prevent scenarios
where the user misspells the `credentialPluginAllowlist` key -- thinking they
have specified an allowlist when they actually haven't.

For example, the following is invalid:
```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: ""
```
{{< /note >}}

##### name

`name` names a credential plugin which may be executed. It can be specified as
either the basename of the desired plugin, or the full path. If specified as a
basename, the decision rendered by this field is "allow" if one of the following
two conditions is met:

1. The `name` field is exactly equal to the plugin's `command` field.
1. Full path resolution is performed on both the `name` and the `command`, and
   the results are equal.

If specified as a full path, the decision rendered by this field is "allow" if
one of the following conditions is met:

1. The `name` field is exactly equal to the plugin's `command` field (i.e. the
   `command` is also a full path).
1. Full path resolution is performed on the `command` and the `name` field is an
   exact match.

With regard to _full path resolution_ mentioned earlier in this page,
neither symlinks nor shell globs are resolved.

For example, consider an allowlist entry with the `name` `/usr/local/bin/my-binary`,
where `/usr/local/bin/my-binary` is a symlink to `/this/is/a/target`. If `command`
specified in the kubeconfig is `/this/is/a/target`, it will not be allowed. In
order to make that work, you would need to add `/this/is/a/target` to the
allowlist explicitly. On the other hand, if the kubeconfig has the `command` as
`/usr/local/bin/my-binary`, then the allowlist would permit it to run.

### Example {#credential-plugin-policy-example}

The following example shows an `"Allowlist"` policy with its allowlist:

{{< tabs name="tab_with_code" >}}
{{< tab name="POSIX" codelang="yaml" >}}
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: my-trusted-binary
  - name: /usr/local/bin/my-other-trusted-binary
{{< /tab >}}
{{< tab name="Windows" codelang="yaml" >}}
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - name: my-trusted-binary
  - name: "C:\my-other-trusted-binary"
{{< /tab >}}
{{< /tabs >}}

## Suggested defaults

The kubectl maintainers encourage you to adopt kuberc with the following defaults:

{{< caution >}}
If you are using a managed Kubernetes provider, check your provider's
documentation about what exec plugins are needed in your environment, and use
the ["Allowlist"](#credentialPluginPolicy) policy instead.

If you encounter problems after setting the ["DenyAll"](#credentialPluginPolicy)
policy as illustrated below, observe `kubectl`'s error messages to discover
which plugins have been prevented from running and cross-reference them with
your provider's documentation. Finally, change the policy to "Allowlist" and add
the necessary plugins in the
[credentialPluginAllowlist](#credentialPluginAllowlist) field.
{{< /caution >}}

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

# See the above note about managed providers before selecting DenyAll
credentialPluginPolicy: DenyAll
```

In this example, the following settings are enforced:
1. Defaults to using [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
1. Defaults to interactive removal whenever invoking `kubectl delete` to prevent
   accidental removal of resources from the cluster.
1. No executable credential plugins will be permitted to execute.

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

This might be useful for troubleshooting whether your `kuberc` is causing a problem.
