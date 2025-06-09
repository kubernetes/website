---
title: kubectl 用户偏好（kuberc）
content_type: concept
weight: 70
---
<!--
title: Kubectl user preferences (kuberc)
content_type: concept
weight: 70
-->

{{< feature-state state="alpha" for_k8s_version="1.33" >}}

<!--
A Kubernetes `kuberc` configuration file allows you to define preferences for kubectl, such as default options and command aliases.
Unlike the kubeconfig file, a `kuberc` configuration file does **not** contain cluster details, usernames or passwords.

The default location of this configuration file is `$HOME/.kube/kuberc`. 
You can instruct `kubectl` to look at a custom path for this configuration using the `--kuberc` command line argument.
-->
Kubernetes 的 `kuberc` 配置文件允许你为 `kubectl` 定义使用偏好，比如默认选项和命令别名。
与 kubeconfig 文件不同，`kuberc` 配置文件**不**包含集群细节、用户名或密码。

这一配置文件的默认位置是 `$HOME/.kube/kuberc`。
你可以使用 `--kuberc` 命令行参数，指示 `kubectl` 查看某个自定义路径下的这个配置。

<!--
## aliases

Within a `kuberc` configuration, _aliases_ allow you to define custom shortcuts
for kubectl commands, optionally with preset command line arguments.

### name

Alias name must not collide with the built-in commands.
-->
## 命令别名   {#aliases}

在 `kuberc` 配置中，**别名**允许你为 kubectl 命令定义自定义快捷方式，并可以选择预设的命令行参数。

### 名称   {#name}

别名的名称不能与内置命令冲突。

<!--
### command

Specify the underlying built-in command that your alias will execute. This includes support for subcommands like `create role`.

### flags

Specify default values for command line arguments (which the kuberc format terms _flags_). 
If you explicitly specify a command line argument when you run kubectl, the value you provide takes precedence over the default one defined in kuberc.
-->
### 命令

指定你的别名将执行的基础内置命令。这包括对 `create role` 这类子命令的支持。

### 标志

为命令行参数指定默认值（在 kuberc 格式中这个术语名为**标志**）。
如果你在运行 kubectl 命令时显式指定某命令行参数，则你提供的值将优先于 kuberc 中定义的默认值。

<!--
#### Example  {#flags-example}
-->
#### 示例   {#flags-example}

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

<!--
With this alias, running `kubectl getn pods` will default JSON output. However, if you execute `kubectl getn pods -oyaml`, the output will be in YAML format.

### prependArgs

Insert arbitrary arguments immediately after the kubectl command and its subcommand (if any).

#### Example {#prependArgs-example}
-->
使用这个别名时，运行 `kubectl getn pods` 将默认输出 JSON。
但如果你执行 `kubectl getn pods -oyaml`，则输出格式为 YAML。

### prependArgs（前置参数）

在 kubectl 命令及其子命令（如有）之后立即插入任意参数。

#### 示例   {#prependArgs-example}

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

<!--
`kubectl getn test-ns` will be translated to `kubectl get namespace test-ns --output json`.

### appendArgs

Append arbitrary arguments to the end of the kubectl command.

#### Example {#appendArgs-example}
-->
`kubectl getn test-ns` 将被翻译为 `kubectl get namespace test-ns --output json`。

### appendArgs（追加参数）

在 kubectl 命令末尾追加任意参数。

#### 示例   {#appendArgs-example}

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

<!--
`kubectl runx test-pod` will be translated to `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

## Command overrides

Within a `kuberc` configuration, _command overrides_ let you specify custom values for command line arguments.

### command

Specify the built-in command. This includes support for subcommands like `create role`.
-->
`kubectl runx test-pod` 将被翻译为 `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`。

## 命令覆盖

在 `kuberc` 配置中，**命令覆盖（command overrides）**允许你为命令行参数设置自定义值。

### 命令

指定内置命令。这包括对 `create role` 这类子命令的支持。

<!--
### flags

Within a `kuberc`, configuration, command line arguments are termed _flags_ (even if they do not represent a boolean type).
You can use `flags` to set the default value of a command line argument.

	If you explicitly specify a flag on your terminal, explicit value will always take precedence over the value you defined in kuberc using `overrides`.
-->
### 标志

在 `kuberc` 配置中，命令行参数被称为**标志**（即使它们并不是布尔类型）。
你可以使用 `flags` 为命令行参数设置默认值。

如果你在终端上显式指定某个标志，则显式指定的值将始终优先于你使用 `overrides` 在 kuberc 中定义的值。

{{< note >}}
<!--
You cannot use `kuberc` to override the value of a command line argument to take precedence over what the user specifies on the command line. The term `overrides`
in this context refers to specifying a default value that is different from the
compiled-in default value.
-->
你**不能**使用 `kuberc` 覆盖用户在命令行上指定的命令行参数。
此处的 `overrides`（覆盖）指的是设置不同于编译时默认值的默认值。
{{< /note >}}

<!--
#### Example:
-->
#### 示例

```yaml
apiVersion: kubectl.config.k8s.io/v1alpha1
kind: Preference
overrides:
- command: delete
  flags:
    - name: interactive
      default: "true"
```

<!--
With this override, running `kubectl delete pod/test-pod` will default to prompting for confirmation. 
However, `kubectl delete pod/test-pod --interactive=false` will bypass the confirmation.

The kubectl maintainers encourage you to adopt kuberc with the given defaults:
-->
使用这个 override 字段，运行 `kubectl delete pod/test-pod` 时会默认提示确认。
但如果你运行 `kubectl delete pod/test-pod --interactive=false`，则不会提示确认。

kubectl 的维护者建议你使用以下默认设置来采用 kuberc：

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

<!--
## Disable kuberc

To temporarily disable the kuberc functionality, simply export the environment variable `KUBERC` with the value `off`:
-->
## 禁用 kuberc    {#disable-kuberc}

若要临时禁用 `kuberc` 功能，只需导出值为 `off` 的环境变量 `KUBERC`：

```shell
export KUBERC=off
```

<!--
or disable the feature gate:
-->
或者禁用特性门控：

```shell
export KUBECTL_KUBERC=false
```
