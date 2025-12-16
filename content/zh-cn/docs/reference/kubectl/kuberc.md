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

{{< feature-state state="beta" for_k8s_version="1.34" >}}

<!--
A Kubernetes `kuberc` configuration file allows you to define preferences for
{{<glossary_tooltip text="kubectl" term_id="kubectl">}},
such as default options and command aliases. Unlike the kubeconfig file, a `kuberc`
configuration file does **not** contain cluster details, usernames or passwords.
-->
Kubernetes `kuberc` 配置文件允许你定义 {{<glossary_tooltip text="kubectl" term_id="kubectl">}}
的偏好设置，例如默认选项和命令别名。
与 kubeconfig 文件不同，`kuberc` 配置文件**不**包含集群详情、用户名或密码。

<!--
The default location of this configuration file is `$HOME/.kube/kuberc`.
To provide kubectl with a path to a custom kuberc file, use the `--kuberc` command line option,
or set the `KUBERC` environment variable. 
-->
此配置文件的默认位置是 `$HOME/.kube/kuberc`。
要提供路径指向自定义 kuberc 文件的 kubectl，使用 `--kuberc` 命令行选项，或设置 `KUBERC` 环境变量。

<!--
A `kuberc` using the `kubectl.config.k8s.io/v1beta1` format allows you to define
two types of user preferences:

1. [Aliases](#aliases) - allow you to create shorter versions of your favorite
   commands, optionally setting options and arguments.
2. [Defaults](#defaults) - allow you to configure default option values for your
   favorite commands.
-->
使用 `kubectl.config.k8s.io/v1beta1` 格式的 `kuberc` 文件允许你定义两种用户偏好设置：

1. [别名（Aliase）](#aliases) —— 允许你为常用命令创建更短的版本，可以选择设置选项和参数。
1. [默认值（Default）](#defaults) —— 允许你为常用命令配置默认的选项值。

<!--
## aliases

Within a `kuberc` configuration, the _aliases_ section allows you to define custom
shortcuts for kubectl commands, optionally with preset command line arguments
and flags.

This next example defines a `kubectl getn` alias for the `kubectl get` subcommand,
additionally specifying JSON output format: `--output=json`.
-->
## aliases

在 `kuberc` 配置中，**aliases（别名）** 部分允许你为 kubectl 命令定义自定义快捷方式，
并且可以带有预设的命令行参数。

下面这个例子为 `kubectl get` 子命令定义 `kubectl getn` 别名，
另外还指定输出格式为 JSON：`--output=json`。

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

<!--
In this example, the following settings were used:

1. `name` - Alias name must not collide with the built-in commands.
1. `command` - Specify the underlying built-in command that your alias will execute.
   This includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.
-->
在此示例中，使用了以下设置：

1. `name` —— 别名名称，不能与内置命令重名。
1. `command` —— 指定别名实际执行的内置命令。
   这包括支持 `create role` 这类子命令。
1. `options` —— 指定选项的默认值。若你在运行 `kubectl` 时显式指定某个选项，
   你提供的值要比 `kuberc` 中定义的默认值优先生效。

<!--
With this alias, running `kubectl getn pods` will default JSON output. However,
if you execute `kubectl getn pods -oyaml`, the output will be in YAML format.

Full `kuberc` schema is available [here](/docs/reference/config-api/kuberc.v1beta1/).
-->
使用此别名，运行 `kubectl getn pods` 将默认输出 JSON 格式。然而，
如果你执行 `kubectl getn pods -oyaml`，输出将会是 YAML 格式。

完整的 `kuberc` 模式说明参阅[此处](/zh-cn/docs/reference/config-api/kuberc.v1beta1/)。

### prependArgs

<!--
This next example, will expand the previous one, introducing `prependArgs` section,
which allows inserting arbitrary arguments immediately after the kubectl command
and its subcommand (if any).
-->
下一个示例将在前一个示例的基础上进行扩展，引入 `prependArgs` 部分。
允许在 `kubectl` 命令及其子命令（如果有）之后，插入任意参数。

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

<!--
In this example, the following settings were used:

1. `name` - Alias name must not collide with the built-in commands.
1. `command` - Specify the underlying built-in command that your alias will execute.
   This includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.
1. `prependArgs` - Specify explicit argument that will be placed right after the
   command. Here, this will be translated to `kubectl get namespace test-ns --output json`.
-->
在此示例中，使用了以下设置：

1. `name` —— 别名名称，不能与内置命令重名。
1. `command` —— 指定别名实际执行的内置命令。这包括支持 `create role` 这类子命令。
1. `options` —— 指定选项的默认值。若你在运行 `kubectl` 时显式指定某个选项，
   你提供的值要比 `kuberc` 中定义的默认值优先生效。
1. `prependArgs` —— 指定在命令后立即插入的显式参数。
   在此示例中，这将被转换为 `kubectl get namespace test-ns --output json`。

### appendArgs

<!--
This next example, will introduce a mechanism similar to prepending arguments,
this time, though, we will append arguments to the end of the kubectl command.
-->
下一个示例将介绍一种与前面 prependArgs 类似的机制，  
不同之处在于，这次我们会在 `kubectl` 命令的末尾追加参数。

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

<!--
In this example, the following settings were used:

1. `name` - Alias name must not collide with the built-in commands.
1. `command` - Specify the underlying built-in command that your alias will execute.
   This includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.
1. `appendArgs` - Specify explicit arguments that will be placed at the end of the
   command. Here, this will be translated to `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`.
-->
在此示例中，使用了以下设置：

1. `name` —— 别名名称，不能与内置命令重名。
1. `command` —— 指定别名实际执行的内置命令。这包括支持 `create role` 这类子命令。
1. `options` —— 指定选项的默认值。若你在运行 `kubectl` 时显式指定某个选项，
   你提供的值要比 `kuberc` 中定义的默认值优先生效。
1. `appendArgs` —— 指定在命令末尾追加的显式参数。
   在此示例中，这将被转换为 `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`。

<!--
## defaults

Within a `kuberc` configuration, `defaults` section lets you specify default values
for command line arguments.

This next example makes the interactive removal the default mode for invoking
`kubectl delete`:
-->
## defaults

在 `kuberc` 配置中，`defaults` 部分允许你为命令行参数指定默认值。

下一个示例将交互式移除调用 `kubectl delete` 的默认模式：

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
- command: delete
  options:
    - name: interactive
      default: "true"
```

<!--
In this example, the following settings were used:

1. `command` - Built-in command, this includes support for subcommands like `create role`.
1. `options` - Specify default values for options. If you explicitly specify an option
   when you run `kubectl`, the value you provide takes precedence over the default
   one defined in `kuberc`.
-->
在此示例中，使用了以下设置：

1. `command` —— 内置命令，这包括支持 `create role` 这类子命令。
1. `options` —— 指定选项的默认值。若你在运行 kubectl 时显式指定某个选项，
   你提供的值要比 kuberc 中定义的默认值优先生效。

<!--
With this setting, running `kubectl delete pod/test-pod` will default to prompting for confirmation.
However, `kubectl delete pod/test-pod --interactive=false` will bypass the confirmation.

## Suggested defaults

The kubectl maintainers encourage you to adopt kuberc with the following defaults:
-->
有了此设置，运行 `kubectl delete pod/test-pod` 将默认提示确认。
然而，执行 `kubectl delete pod/test-pod --interactive=false` 将跳过确认提示。

## 建议的默认值  {#suggested-defaults}

kubectl 维护者建议你使用以下默认值来启用 kuberc：

<!--
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
-->
```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
defaults:
  # (1) 默认启用服务端应用
  - command: apply
    options:
      - name: server-side
        default: "true"

  # (2) 默认启用交互式删除
  - command: delete
    options:
      - name: interactive
        default: "true"
```

<!--
In this example, the following settings are enforced:
1. Defaults to using [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
1. Defaults to interactive removal whenever invoking `kubectl delete` to prevent
   accidental removal of resources from the cluster.
-->
在此示例中，强制使用以下设置：

1. 默认使用[服务端应用](/zh-cn/docs/reference/using-api/server-side-apply/)。
1. 调用 `kubectl delete` 时默认进行交互式移除，以防止意外移除集群中的资源。

<!--
## Disable kuberc

To temporarily disable the `kuberc` functionality, set (and export) the environment
variable `KUBERC` with the value `off`:
-->
要临时禁用 `kuberc` 功能，只需导出环境变量 `KUBERC` 并将其值设置为 `off`：

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
