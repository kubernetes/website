---
title: Kubectl user preferences (kuberc)
content_type: concept
weight: 70
---

{{< feature-state state="alpha" for_k8s_version="1.33" >}}

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

### flags

Specify default values for command line arguments (which the kuberc format terms _flags_). 
If you explicitly specify a command line argument when you run kubectl, the value you provide takes precedence over the default one defined in kuberc. 

#### Example  {#flags-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
aliases:
- name: getn
  command: get
  flags:
   - name: output
     default: json
```

With this alias, running `kubectl getn pods` will default JSON output. However, if you execute `kubectl getn pods -oyaml`, the output will be in YAML format.

### prependArgs

Insert arbitrary arguments immediately after the kubectl command and its subcommand (if any).

#### Example {#prependArgs-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
aliases:
  - name: getn
    command: get
    prependArgs:
      - namespace
    flags:
      - name: output
        default: json
```

`kubectl getn test-ns` will be translated to `kubectl get namespace test-ns --output json`.

### appendArgs

Append arbitrary arguments to the end of the kubectl command.

#### Example {#appendArgs-example}

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
aliases:
- name: runx
  command: run
  flags:
    - name: image
      default: busybox
    - name: namespace
      default: test-ns
  appendArgs:
    - --
    - custom-arg
```

`kubectl runx test-pod` will be translated to `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## Command overrides

Within a `kuberc` configuration, _command overrides_ let you specify custom values for command line arguments.

### command

Specify the built-in command. This includes support for subcommands like `create role`.

### flags

Within a `kuberc`, configuration, command line arguments are termed _flags_ (even if they do not represent a boolean type).
You can use `flags` to set the default value of a command line argument.

If you explicitly specify a flag on your terminal, explicit value will always take precedence over
the value you defined in kuberc using `overrides`.

{{< note >}}
You cannot use `kuberc` to override the value of a command line argument to take precedence over
what the user specifies on the command line. The term `overrides`
in this context refers to specifying a default value that is different from the
compiled-in default value.
{{< /note >}}

#### Example

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
overrides:
- command: delete
  flags:
    - name: interactive
      default: "true"
```

With this override, running `kubectl delete pod/test-pod` will default to prompting for confirmation. 
However, `kubectl delete pod/test-pod --interactive=false` will bypass the confirmation.

The kubectl maintainers encourage you to adopt kuberc with the given defaults:

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
overrides:
  - command: apply
    flags:
      - name: server-side
        default: "true"
  - command: delete
    flags:
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
