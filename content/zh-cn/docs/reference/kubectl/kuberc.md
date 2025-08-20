---
title: kubectl 用户偏好设置（kuberc）
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
-->
Kubernetes `kuberc` 配置文件允许你定义 kubectl 的偏好设置，例如默认选项和命令别名。
与 kubeconfig 文件不同，`kuberc` 配置文件**不**包含集群详情、用户名或密码。

<!--
The default location of this configuration file is `$HOME/.kube/kuberc`. 
You can instruct `kubectl` to look at a custom path for this configuration using the `--kuberc` command line argument.  
-->
此配置文件的默认位置是 `$HOME/.kube/kuberc`。
你可以使用 `--kuberc` 命令行参数指示 `kubectl` 查找此配置的自定义路径。

<!--
## aliases

Within a `kuberc` configuration, _aliases_ allow you to define custom shortcuts
for kubectl commands, optionally with preset command line arguments.
-->
## aliases

在 `kuberc` 配置中，**别名（aliases）** 允许你为 kubectl 命令定义自定义快捷方式，
并且可以带有预设的命令行参数。

<!--
### name

Alias name must not collide with the built-in commands. 
-->
### name

别名名称不能与内置命令冲突。

<!--
### command

Specify the underlying built-in command that your alias will execute. This includes support for subcommands like `create role`.
-->
### command

指定你的别名将执行的底层内置命令。这包括对如 `create role` 等子命令的支持。

<!--
### flags

Specify default values for command line arguments (which the kuberc format terms _flags_). 
If you explicitly specify a command line argument when you run kubectl, the value you provide takes precedence over the default one defined in kuberc. 
-->
### flags

为命令行参数指定默认值（kuberc 格式中称为 **标志（flags）**）。
如果你在运行 kubectl 时明确指定了命令行参数，那么你提供的值将优先于 kuberc 中定义的默认值。

<!--
#### Example  {#flags-example}
-->
#### 示例  {#flags-example}

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
-->
使用此别名，运行 `kubectl getn pods` 将默认输出 JSON 格式。然而，
如果你执行 `kubectl getn pods -oyaml`，输出将会是 YAML 格式。

<!--
### prependArgs

Insert arbitrary arguments immediately after the kubectl command and its subcommand (if any).

#### Example {#prependArgs-example}
-->
### prependArgs

在 kubectl 命令及其子命令（如果有）之后立即插入任意参数。

#### 示例 {#prependArgs-example}

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

### appendArgs

将任意参数添加到 kubectl 命令的末尾。

#### 示例 {#appendArgs-example}

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
-->
`kubectl runx test-pod` 将被翻译为
`kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.

<!--
## Command overrides

Within a `kuberc` configuration, _command overrides_ let you specify custom values for command line arguments.

### command

Specify the built-in command. This includes support for subcommands like `create role`.
-->
## 命令覆盖

在 `kuberc` 配置中，**命令覆盖**允许你为命令行参数指定自定义值。

### command

指定内置命令。这包括对如 `create role` 等子命令的支持。

<!--
### flags

Within a `kuberc`, configuration, command line arguments are termed _flags_ (even if they do not represent a boolean type).
You can use `flags` to set the default value of a command line argument.
-->
### flags

在 `kuberc` 配置中，命令行参数被称为 **标志（flags）**（即使它们不代表布尔类型）。
你可以使用 `flags` 来设置命令行参数的默认值。

<!--
If you explicitly specify a flag on your terminal, explicit value will always take precedence over
the value you defined in kuberc using `overrides`.
-->
如果你在终端中显式地指定了一个**标志**，那么显式指定的值将始终优先于你在
`kuberc` 中使用 `overrides` 定义的值。

{{< note >}}
<!--
You cannot use `kuberc` to override the value of a command line argument to take precedence over
what the user specifies on the command line. The term `overrides`
in this context refers to specifying a default value that is different from the
compiled-in default value.
-->
你不能使用 `kuberc` 来覆盖命令行参数的值，以使其优先于用户在命令行中指定的值。
这里的 **`overrides`** 指的是指定一个与编译时默认值不同的默认值。
{{< /note >}}

<!--
#### Example
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
通过此覆盖，运行 `kubectl delete pod/test-pod` 将默认提示确认。
然而，`kubectl delete pod/test-pod --interactive=false` 将绕过确认。

kubectl 维护者鼓励你采用具有给定默认值的 kuberc：

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
## 禁用 kuberc

要临时禁用 kuberc 特性，只需导出环境变量 `KUBERC` 并将其值设置为 `off`：

```shell
export KUBERC=off
```

<!--
or disable the feature gate:
-->
或者禁用此特性门控：

```shell
export KUBECTL_KUBERC=false
```
