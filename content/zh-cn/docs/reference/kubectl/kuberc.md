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
On Linux / POSIX computers, the default location of this configuration file is `$HOME/.kube/kuberc`.
The default path on Windows is similar: `%USERPROFILE%\.kube\kuberc`.
To provide kubectl with a path to a custom kuberc file, use the `--kuberc` command line option,
or set the `KUBERC` environment variable. 
-->
在 Linux/POSIX 计算机上，此配置文件的默认位置是 `$HOME/.kube/kuberc`。
在 Windows 上的默认路径是 `%USERPROFILE%\.kube\kuberc`。
要提供路径指向自定义 kuberc 文件的 kubectl，使用 `--kuberc` 命令行选项，或设置 `KUBERC` 环境变量。

<!--
A `kuberc` using the `kubectl.config.k8s.io/v1beta1` format allows you to define
the following types of user preferences:

1. [Aliases](#aliases) - allow you to create shorter versions of your favorite
   commands, optionally setting options and arguments.
2. [Defaults](#defaults) - allow you to configure default option values for your
   favorite commands.
3. [Credential Plugin Policy](#credential-plugin-policy) - allow you to configure
   a policy for exec credential plugins.
-->
使用 `kubectl.config.k8s.io/v1beta1` 格式的 `kuberc` 文件允许你定义以下类别的用户偏好设置：

1. [别名（Aliase）](#aliases) —— 允许你为常用命令创建更短的版本，可以选择设置选项和参数。
2. [默认值（Default）](#defaults) —— 允许你为常用命令配置默认的选项值。
3. [凭证插件策略（Credential Plugin Policy）](#credential-plugin-policy) -
   允许你为 exec 凭证插件配置一个策略。

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
-->
有了此设置，运行 `kubectl delete pod/test-pod` 将默认提示确认。
然而，执行 `kubectl delete pod/test-pod --interactive=false` 将跳过确认提示。

<!--
## Credential plugin policy
-->
## 凭证插件策略 {#credential-plugin-policy}

{{< feature-state for_k8s_version="v1.35" state="beta" >}}

<!--
Editors of a `kubeconfig` can specify an executable plugin that will be used to
acquire credentials to authenticate the client to the cluster. Within a `kuberc`
configuration, you can set the execution policy for such plugins by the use of
two top-level fields. Both fields are optional.
-->
`kubeconfig` 的编辑者可以指定一个可执行插件，用来获取向集群验证客户端身份所需的凭证。
在 `kuberc` 配置中，你可以通过两个顶层字段设置此类插件的执行策略。两个字段都是可选的。

### credentialPluginPolicy

<!--
You can configure a policy for credentials plugins, using the optional
`credentialPluginPolicy` field. There are three valid values for this field:
-->
你可以使用可选的 `credentialPluginPolicy` 字段配置凭证插件策略。
该字段有三个有效值：

1. `"AllowAll"`

   <!--
   When the policy is set to `"AllowAll"`, there will be no restrictions on which
   plugins may run. This behavior is identical to that of Kubernetes versions prior
   to 1.35.
   -->
   当策略设置为 `"AllowAll"` 时，对可运行的插件没有任何限制。
   其行为与 Kubernetes 1.35 之前的版本相同。

2. `"DenyAll"`

   <!--
   When the policy is set to `"DenyAll"`, no exec plugins will be permitted to run.
   -->
   当策略设置为 `"DenyAll"` 时，不允许任何 exec 插件运行。

3. `"Allowlist"`

   <!--
   When the policy is set to `"Allowlist"`, the user can selectively allow
   execution of credential plugins. When the policy is `"Allowlist"`, you **must**
   also provide the `credentialPluginAllowlist` field (also in the top-level). That
   field is described below.
   -->
   当策略设置为 `"Allowlist"` 时，用户可以选择性地允许凭证插件执行。
   当策略为 `"Allowlist"` 时，你**必须**同时提供顶层的 `credentialPluginAllowlist` 字段。
   下文将介绍该字段。

{{< note >}}
<!--
In order to maintain backward compatibility, an unspecified or empty
`credentialPluginPolicy` is identical to explicitly setting the policy to
`"AllowAll"`.
-->
为了保持向后兼容，未指定或为空的 `credentialPluginPolicy`
与显式将策略设置为 `"AllowAll"` 的效果相同。
{{< /note >}}

### credentialPluginAllowlist

{{< note >}}
<!--
Setting this field when `credentialPluginPolicy` is not `Allowlist` (including
when that field is missing or empty) is considered a configuration error.
-->
当 `credentialPluginPolicy` 不是 `Allowlist`（包括该字段缺失或为空）时，
设置此字段将被视为配置错误。
{{< /note >}}

<!--
The `credentialPluginAllowlist` field specifies a list of criteria-sets (sets of
*requirements*) for permission to execute credential plugins. Each set of
requirements will be attempted in turn; once the plugin meets all requirements
in at least one set, the plugin will be permitted to execute. That is, the
overall result of an application of the allowlist to plugin `my-binary-plugin`
is the _logical OR_ of the decisions rendered by each item in the list.
-->
`credentialPluginAllowlist` 字段指定一组准则集合（即*要求*集合）的列表，
用于授予执行凭证插件的权限。系统将依次尝试每个要求集合；一旦插件满足至少一个集合中的所有要求，
该插件就被允许执行。也就是说，对插件 `my-binary-plugin` 应用允许列表的总体结果，
是列表中每个条目所作决策的**逻辑或**。

<!--
As an example, consider the following allowlist configuration:
-->
例如，考虑以下允许列表配置：

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: foo
  - command: bar
  - command: baz
```

<!--
In the above example, the allowlist will allow plugins that have the command "foo",
"bar", _OR_ "baz".
-->
在上述示例中，允许列表允许 `command` 为 "foo"、"bar" **或** "baz" 的插件。

{{< note >}}
<!--
For a set of requirements to be valid it **must** have at least one field that is
nonempty and explicitly specified. If all fields are empty or unspecified, it is
considered a configuration error and the plugin will not be allowed to execute.
Likewise if the `credentialPluginAllowlist` field is unspecified, or if it is
specified explicitly as the empty list. This is in order to prevent scenarios
where the user misspells the `credentialPluginAllowlist` key -- thinking they
have specified an allowlist when they actually haven't.

For example, the following is invalid:
-->
一个要求集合要有效，**必须**至少有一个明确指定且非空的字段。
如果所有字段均为空或未指定，则被视为配置错误，并且不允许该插件执行。
同样，如果未指定 `credentialPluginAllowlist` 字段，或显式将其指定为空列表，也会被视为配置错误。
这样做是为了防止用户拼错 `credentialPluginAllowlist` 键——
误以为自己指定了允许列表，实际上却没有。

例如，以下配置无效：

```yaml
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: ""
```
{{< /note >}}

##### command

<!--
`command` names a credential plugin which may be executed. It can be specified as
either the basename of the desired plugin, or the full path. If specified as a
basename, the decision rendered by this field is "allow" if one of the following
two conditions is met:
-->
`command` 用于指定可执行的凭证插件名称。它可以指定为目标插件的基本名称或完整路径。
如果指定为基本名称，则当满足以下两个条件之一时，该字段作出的决策为“允许”：

<!--
1. The `command` field is exactly equal to the plugin's `command` field.
1. Full path resolution is performed on both the allowlist `command` and the
   plugin's `command`, and the results are equal.
-->
1. `command` 字段与插件的 `command` 字段完全相等。
1. 对允许列表的 `command` 和插件的 `command` 都执行完整路径解析，且结果相等。

<!--
If specified as a full path, the decision rendered by this field is "allow" if
one of the following conditions is met:
-->
如果指定为完整路径，则当满足以下条件之一时，该字段作出的决策为“允许”：

<!--
1. The `command` field is exactly equal to the plugin's `command` field (i.e. the
   plugin's `command` is also a full path).
1. Full path resolution is performed on the plugin's `command` and the allowlist
   `command` field is an exact match.
-->
1. `command` 字段与插件的 `command` 字段完全相等（即插件的 `command` 也是完整路径）。
1. 对插件的 `command` 执行完整路径解析，且结果与允许列表中的 `command` 字段完全匹配。

<!--
With regard to _full path resolution_ mentioned earlier in this page,
neither symlinks nor shell globs are resolved.
-->
对于本页前面提到的*完整路径解析*，不会解析符号链接或 Shell 通配符。

<!--
For example, consider an allowlist entry with the `command` `/usr/local/bin/my-binary`,
where `/usr/local/bin/my-binary` is a symlink to `/this/is/a/target`. If `command`
specified in the kubeconfig is `/this/is/a/target`, it will not be allowed. In
order to make that work, you would need to add `/this/is/a/target` to the
allowlist explicitly. On the other hand, if the kubeconfig has the `command` as
`/usr/local/bin/my-binary`, then the allowlist would permit it to run.
-->
例如，考虑一个 `command` 为 `/usr/local/bin/my-binary` 的允许列表条目，
其中 `/usr/local/bin/my-binary` 是指向 `/this/is/a/target` 的符号链接。
如果 kubeconfig 中指定的 `command` 为 `/this/is/a/target`，则不允许其执行。
要使其可执行，你需要显式将 `/this/is/a/target` 添加到允许列表中。
另一方面，如果 kubeconfig 中的 `command` 为 `/usr/local/bin/my-binary`，允许列表将允许其运行。

{{< note >}}
<!--
While kuberc is in beta, `name` may be used as an alias for `command` in
allowlist entries. From Kubernetes 1.36 onward, `name` is deprecated in favor
of `command`. Supplying **both** `name` and `command` in the same allowlist
entry is considered an error, because these are security-sensitive settings.
The `name` field will be removed entirely when kuberc reaches GA.
-->
在 kuberc 处于 Beta 阶段期间，允许列表条目中可使用 `name` 作为 `command` 的别名。
从 Kubernetes 1.36 开始，`name` 已被弃用，应改用 `command`。
在同一允许列表条目中同时提供 `name` 和 `command` 将被视为错误，
因为这些设置与安全相关。当 kuberc 达到 GA 时，`name` 字段将被完全移除。
{{< /note >}}

<!--
### Example {#credential-plugin-policy-example}
-->
### 示例 {#credential-plugin-policy-example}

<!--
The following example shows an `"Allowlist"` policy with its allowlist:
-->
以下示例展示了一个 `"Allowlist"` 策略及其允许列表：

{{< tabs name="tab_with_code" >}}
{{< tab name="POSIX" codelang="yaml" >}}
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: my-trusted-binary
  - command: /usr/local/bin/my-other-trusted-binary
{{< /tab >}}
{{< tab name="Windows" codelang="yaml" >}}
apiVersion: kubectl.config.k8s.io/v1beta1
kind: Preference
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
  - command: my-trusted-binary
  - command: "C:\my-other-trusted-binary"
{{< /tab >}}
{{< /tabs >}}

<!--
### Managing credential plugin policy with `kubectl kuberc set`
-->
### 使用 `kubectl kuberc set` 管理凭证插件策略

<!--
Rather than editing the kuberc file directly, you can use `kubectl kuberc set` to
configure the credential plugin policy from the command line.
-->
你可以使用 `kubectl kuberc set` 从命令行配置凭证插件策略，
而不必直接编辑 kuberc 文件。

<!--
```shell
# Set the policy to deny all credential plugins
kubectl kuberc set --section credentialplugin --policy DenyAll

# Set the policy to allow all credential plugins
kubectl kuberc set --section credentialplugin --policy AllowAll

# Allow only specific credential plugins
kubectl kuberc set --section credentialplugin \
    --policy Allowlist \
    --allowlist-entry command=my-trusted-binary \
    --allowlist-entry command=my-other-trusted-binary
```
-->
```shell
# 将策略设置为拒绝所有凭证插件
kubectl kuberc set --section credentialplugin --policy DenyAll

# 将策略设置为允许所有凭证插件
kubectl kuberc set --section credentialplugin --policy AllowAll

# 仅允许特定的凭证插件
kubectl kuberc set --section credentialplugin \
    --policy Allowlist \
    --allowlist-entry command=my-trusted-binary \
    --allowlist-entry command=my-other-trusted-binary
```

<!--
In this example, the following flags were used:
-->
在此示例中，使用了以下参数：

<!--
1. `--section credentialplugin` - Select the credential plugin configuration section.
1. `--policy` - Required. Set the policy to `AllowAll`, `DenyAll`, or `Allowlist`.
1. `--allowlist-entry` - Required when `--policy=Allowlist`. Specify a plugin to allow
   using comma-separated `key=value` pairs. Currently `command` is the only
   supported key (for example, `command=<binary-name>`), but the format
   anticipates future additions such as digest or public-key verification.
   Repeat this flag to allow multiple plugins.
-->
1. `--section credentialplugin` —— 选择凭证插件配置节。
1. `--policy` —— 必需。将策略设置为 `AllowAll`、`DenyAll` 或 `Allowlist`。
1. `--allowlist-entry` —— 当 `--policy=Allowlist` 时必需。使用逗号分隔的
   `key=value` 对指定要允许的插件。目前仅支持 `command` 键
   （例如 `command=<binary-name>`），但该格式为将来添加摘要或公钥验证等能力预留了空间。
   重复使用此参数可允许多个插件。

<!--
## Suggested defaults

The kubectl maintainers encourage you to adopt kuberc with the following defaults:
-->
## 建议的默认值  {#suggested-defaults}

kubectl 维护者建议你使用以下默认值来启用 kuberc：

{{< caution >}}
<!--
If you are using a managed Kubernetes provider, check your provider's
documentation about what exec plugins are needed in your environment, and use
the ["Allowlist"](#credentialPluginPolicy) policy instead.

If you encounter problems after setting the ["DenyAll"](#credentialPluginPolicy)
policy as illustrated below, observe `kubectl`'s error messages to discover
which plugins have been prevented from running and cross-reference them with
your provider's documentation. Finally, change the policy to "Allowlist" and add
the necessary plugins in the
[credentialPluginAllowlist](#credentialPluginAllowlist) field.
-->
如果你使用托管 Kubernetes 提供商，请查阅提供商的文档，了解你的环境所需的 exec 插件，
并改用 ["Allowlist"](#credentialPluginPolicy) 策略。

如果按照下文所示将策略设置为 ["DenyAll"](#credentialPluginPolicy) 后遇到问题，
请查看 `kubectl` 的错误信息，以了解哪些插件被阻止运行，并对照提供商的文档进行确认。
最后，将策略改为 `"Allowlist"`，并在
[credentialPluginAllowlist](#credentialPluginAllowlist) 字段中添加必需的插件。
{{< /caution >}}

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

# See the above note about managed providers before selecting DenyAll
credentialPluginPolicy: DenyAll
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

# 先查看上述有关托管提供商的注释，再选择 DenyAll
credentialPluginPolicy: DenyAll
```

<!--
In this example, the following settings are enforced:
1. Defaults to using [Server-Side Apply](/docs/reference/using-api/server-side-apply/).
1. Defaults to interactive removal whenever invoking `kubectl delete` to prevent
   accidental removal of resources from the cluster.
1. No executable credential plugins will be permitted to execute.
-->
在此示例中，强制使用以下设置：

1. 默认使用[服务端应用](/zh-cn/docs/reference/using-api/server-side-apply/)。
1. 调用 `kubectl delete` 时默认进行交互式移除，以防止意外移除集群中的资源。
1. 将不允许执行任何可执行的凭证插件。

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

<!--
This might be useful for troubleshooting whether your `kuberc` is causing a problem.
-->
这可能有助于排查你的 `kuberc` 是否造成了某个问题。
