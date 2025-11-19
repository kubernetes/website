---
title: kubectl 使用者偏好設置（kuberc）
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
Kubernetes `kuberc` 設定文件允許你定義 {{<glossary_tooltip text="kubectl" term_id="kubectl">}}
的偏好設置，例如默認選項和命令別名。
與 kubeconfig 文件不同，`kuberc` 設定文件**不**包含叢集詳情、使用者名或密碼。

<!--
The default location of this configuration file is `$HOME/.kube/kuberc`.
To provide kubectl with a path to a custom kuberc file, use the `--kuberc` command line option,
or set the `KUBERC` environment variable. 
-->
此設定文件的默認位置是 `$HOME/.kube/kuberc`。
要提供路徑指向自定義 kuberc 文件的 kubectl，使用 `--kuberc` 命令列選項，或設置 `KUBERC` 環境變量。

<!--
A `kuberc` using the `kubectl.config.k8s.io/v1beta1` format allows you to define
two types of user preferences:

1. [Aliases](#aliases) - allow you to create shorter versions of your favorite
   commands, optionally setting options and arguments.
2. [Defaults](#defaults) - allow you to configure default option values for your
   favorite commands.
-->
使用 `kubectl.config.k8s.io/v1beta1` 格式的 `kuberc` 文件允許你定義兩種使用者偏好設置：

1. [別名（Aliase）](#aliases) —— 允許你爲常用命令創建更短的版本，可以選擇設置選項和參數。
1. [默認值（Default）](#defaults) —— 允許你爲常用命令設定默認的選項值。

<!--
## aliases

Within a `kuberc` configuration, the _aliases_ section allows you to define custom
shortcuts for kubectl commands, optionally with preset command line arguments
and flags.

This next example defines a `kubectl getn` alias for the `kubectl get` subcommand,
additionally specifying JSON output format: `--output=json`.
-->
## aliases

在 `kuberc` 設定中，**aliases（別名）** 部分允許你爲 kubectl 命令定義自定義快捷方式，
並且可以帶有預設的命令列參數。

下面這個例子爲 `kubectl get` 子命令定義 `kubectl getn` 別名，
另外還指定輸出格式爲 JSON：`--output=json`。

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
在此示例中，使用了以下設置：

1. `name` —— 別名名稱，不能與內置命令重名。
1. `command` —— 指定別名實際執行的內置命令。
   這包括支持 `create role` 這類子命令。
1. `options` —— 指定選項的默認值。若你在運行 `kubectl` 時顯式指定某個選項，
   你提供的值要比 `kuberc` 中定義的默認值優先生效。

<!--
With this alias, running `kubectl getn pods` will default JSON output. However,
if you execute `kubectl getn pods -oyaml`, the output will be in YAML format.

Full `kuberc` schema is available [here](/docs/reference/config-api/kuberc.v1beta1/).
-->
使用此別名，運行 `kubectl getn pods` 將默認輸出 JSON 格式。然而，
如果你執行 `kubectl getn pods -oyaml`，輸出將會是 YAML 格式。

完整的 `kuberc` 模式說明參閱[此處](/zh-cn/docs/reference/config-api/kuberc.v1beta1/)。

### prependArgs

<!--
This next example, will expand the previous one, introducing `prependArgs` section,
which allows inserting arbitrary arguments immediately after the kubectl command
and its subcommand (if any).
-->
下一個示例將在前一個示例的基礎上進行擴展，引入 `prependArgs` 部分。
允許在 `kubectl` 命令及其子命令（如果有）之後，插入任意參數。

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
在此示例中，使用了以下設置：

1. `name` —— 別名名稱，不能與內置命令重名。
1. `command` —— 指定別名實際執行的內置命令。這包括支持 `create role` 這類子命令。
1. `options` —— 指定選項的默認值。若你在運行 `kubectl` 時顯式指定某個選項，
   你提供的值要比 `kuberc` 中定義的默認值優先生效。
1. `prependArgs` —— 指定在命令後立即插入的顯式參數。
   在此示例中，這將被轉換爲 `kubectl get namespace test-ns --output json`。

### appendArgs

<!--
This next example, will introduce a mechanism similar to prepending arguments,
this time, though, we will append arguments to the end of the kubectl command.
-->
下一個示例將介紹一種與前面 prependArgs 類似的機制，  
不同之處在於，這次我們會在 `kubectl` 命令的末尾追加參數。

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
在此示例中，使用了以下設置：

1. `name` —— 別名名稱，不能與內置命令重名。
1. `command` —— 指定別名實際執行的內置命令。這包括支持 `create role` 這類子命令。
1. `options` —— 指定選項的默認值。若你在運行 `kubectl` 時顯式指定某個選項，
   你提供的值要比 `kuberc` 中定義的默認值優先生效。
1. `appendArgs` —— 指定在命令末尾追加的顯式參數。
   在此示例中，這將被轉換爲 `kubectl run test-pod --namespace test-ns --image busybox -- custom-arg`。

<!--
## defaults

Within a `kuberc` configuration, `defaults` section lets you specify default values
for command line arguments.

This next example makes the interactive removal the default mode for invoking
`kubectl delete`:
-->
## defaults

在 `kuberc` 設定中，`defaults` 部分允許你爲命令列參數指定默認值。

下一個示例將交互式移除調用 `kubectl delete` 的默認模式：

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
在此示例中，使用了以下設置：

1. `command` —— 內置命令，這包括支持 `create role` 這類子命令。
1. `options` —— 指定選項的默認值。若你在運行 kubectl 時顯式指定某個選項，
   你提供的值要比 kuberc 中定義的默認值優先生效。

<!--
With this setting, running `kubectl delete pod/test-pod` will default to prompting for confirmation.
However, `kubectl delete pod/test-pod --interactive=false` will bypass the confirmation.

## Suggested defaults

The kubectl maintainers encourage you to adopt kuberc with the following defaults:
-->
有了此設置，運行 `kubectl delete pod/test-pod` 將默認提示確認。
然而，執行 `kubectl delete pod/test-pod --interactive=false` 將跳過確認提示。

## 建議的默認值  {#suggested-defaults}

kubectl 維護者建議你使用以下默認值來啓用 kuberc：

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
  # (1) 默認啓用服務端應用
  - command: apply
    options:
      - name: server-side
        default: "true"

  # (2) 默認啓用交互式刪除
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
在此示例中，強制使用以下設置：

1. 默認使用[服務端應用](/zh-cn/docs/reference/using-api/server-side-apply/)。
1. 調用 `kubectl delete` 時默認進行交互式移除，以防止意外移除叢集中的資源。

<!--
## Disable kuberc

To temporarily disable the `kuberc` functionality, set (and export) the environment
variable `KUBERC` with the value `off`:
-->
要臨時禁用 `kuberc` 功能，只需導出環境變量 `KUBERC` 並將其值設置爲 `off`：

```shell
export KUBERC=off
```

<!--
or disable the feature gate:
-->
或者禁用此特性門控：

```shell
export KUBECTL_KUBERC=false
```
