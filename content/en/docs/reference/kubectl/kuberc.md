---
title: Kubectl user preferences (kuberc)
content_type: concept
weight: 70
---

{{< note >}}
You cannot use `kuberc` to override the value of a command line argument to take precedence over
what the user specifies on the command line. The term `overrides`
in this context refers to specifying a default value that is different from the
compiled-in default value.
{{< /note >}}

{{< feature-state state="beta" for_k8s_version="1.34" >}}

A Kubernetes `kuberc` configuration file allows you to define preferences for kubectl, such as default options and command aliases.
Unlike the kubeconfig file, a `kuberc` configuration file does **not** contain cluster details, usernames or passwords.

The default location of this configuration file is `$HOME/.kube/kuberc`. 
You can instruct `kubectl` to look at a custom path for this configuration using the `--kuberc` command line argument.  

## aliases

Within a `kuberc` configuration, _aliases_ allow you to define custom shortcuts
for kubectl commands, optionally with preset command line arguments.

### name

Alias name must not collide with the built-in commands. 

### command

Specify the underlying built-in command that your alias will execute. This includes support for subcommands like `create role`.

### options

You can use `options` to specify default command line arguments for an alias.
If you explicitly specify a command line option when you run kubectl, the value you provide takes precedence over the default one defined in kuberc.

{{< note >}}
In kuberc v1alpha1, these were called `flags`. For v1beta1, they are called `options`.
{{< /note >}} 

#### Example  {#options-example}

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

With this alias, running `kubectl getn pods` will default JSON output. However, if you execute `kubectl getn pods -oyaml`, the output will be in YAML format.

### prependArgs

Insert arbitrary arguments immediately after the kubectl command and its subcommand (if any).

#### Example {#prependArgs-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
aliases:
  - name: getn
    command: get
    prependArgs:
      - namespace
    options:
      - name: output
        default: json
```

`kubectl getn test-ns` will be translated to `kubectl get namespace test-ns --output json`.

### appendArgs

Append arbitrary arguments to the end of the kubectl command.

#### Example {#appendArgs-example}

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

`kubectl runx test-pod` will be translated to `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## Command defaults

Within a `kuberc` configuration, _command defaultss_ let you specify custom values for command line arguments.

### command

Specify the built-in command. This includes support for subcommands like `create role`.

### options

You can use `options` to specify default values for command line options.

If you explicitly specify a `options` on your terminal, explicit value will always take precedence over
the value you defined in kuberc using `defaults`.

{{< note >}}
You cannot use `kuberc` to override the value of a command line argument to take precedence over
what the user specifies on the command line. The term `defaults`
in this context refers to specifying a default value that is different from the
compiled-in default value.
{{< /note >}}

#### Example

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
- command: plugin list
  options:
    - name: name-only
      default: "true"
```

With this override, running `kubectl plugin list` will default to showing only plugin names without their full paths. 
However, `kubectl plugin list --name-only=false` will display the full paths to each plugin.

The kubectl maintainers encourage you to adopt kuberc with the given defaults:

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
  - command: apply
    options:
      - name: server-side
        default: "true"
  - command: delete
    options:
      - name: interactive
        default: "true"
```

## Disable kuberc

To temporarily disable the kuberc functionality, simply export the environment variable `KUBERC` with the value `off`:

```shell
export KUBERC=off
```

or disable the feature gate:

```shell
export KUBECTL_KUBERC=false
```
