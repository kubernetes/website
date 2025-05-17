---
title: Kubectl user preferences (kuberc)
content_type: concept
weight: 70
---

kuberc allows users to define preferences such as default options, command aliases, and more, using a dedicated configuration file.
Default location of this configuration file is `$HOME/.kube/kuberc` and it can be customized via `--kuberc` flag similar to kubeconfig.  

## Aliases

Define custom shortcuts for kubectl commands with predefined flags and arguments.

### Name

Alias name must not collide with the built-in commands. 

### Command

Specify the underlying built-in command that your alias will execute. This includes support for subcommands like `create role`.

### Flags

Customize the defaults values of flags. If you explicitly specify a flag on your terminal, that value will always take precedence over the default one defined in kuberc. 

**Example:**

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

### PrependArgs

Insert arbitrary arguments immediately after the kubectl command and its subcommand (if any).

**Example:**

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

`kubectl getn test-ns` will be translated to `kubectl get namespace test-ns`.

### AppendArgs

Append arbitrary arguments to the end of the kubectl command.

**Example:**

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

`kubectl runx test-pod` will be translated to `kubectl run test-pod -- custom-arg`.

## Command Overrides

Customize the default settings of flags for built-in kubectl commands.

### Command

Specify the built-in command. This includes support for subcommands like `create role`.

### Flags

Customize the defaults values of flags. If you explicitly specify a flag on your terminal, explicit value will always take precedence over the default one defined in kuberc.

**Example:**

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

As kubectl maintainers, we strongly encourage you to adopt kuberc with the given overrides:

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

## Disable Kuberc

To temporarily disable the kuberc functionality, simply export the environment variable `KUBERC` with the value `off`:

```shell
export KUBERC=off
```