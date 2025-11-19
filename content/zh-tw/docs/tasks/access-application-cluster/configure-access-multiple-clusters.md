---
title: 配置對多集羣的訪問
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: 配置對集羣的訪問
---
<!--
title: Configure Access to Multiple Clusters
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: Configure access to clusters
-->

<!-- overview -->

<!--
This page shows how to configure access to multiple clusters by using
configuration files. After your clusters, users, and contexts are defined in
one or more configuration files, you can quickly switch between clusters by using the
`kubectl config use-context` command.
-->
本文展示如何使用配置文件來配置對多個集羣的訪問。
在將集羣、用戶和上下文定義在一個或多個配置文件中之後，用戶可以使用
`kubectl config use-context` 命令快速地在集羣之間進行切換。

{{< note >}}
<!--
A file that is used to configure access to a cluster is sometimes called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
-->
用於配置集羣訪問的文件有時被稱爲 **kubeconfig 文件**。
這是一種引用配置文件的通用方式，並不意味着存在一個名爲 `kubeconfig` 的文件。
{{< /note >}}

{{< warning >}}
<!--
Only use kubeconfig files from trusted sources. Using a specially-crafted kubeconfig
file could result in malicious code execution or file exposure. 
If you must use an untrusted kubeconfig file, inspect it carefully first, much as you would a shell script.
-->
只使用來源可靠的 kubeconfig 文件。使用特製的 kubeconfig 文件可能會導致惡意代碼執行或文件暴露。
如果必須使用不受信任的 kubeconfig 文件，請首先像檢查 shell 腳本一樣仔細檢查它。
{{< /warning>}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
To check that {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} is installed,
run `kubectl version --client`. The kubectl version should be
[within one minor version](/releases/version-skew-policy/#kubectl) of your
cluster's API server.
-->
要檢查 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 是否安裝，
執行 `kubectl version --client` 命令。kubectl 的版本應該與集羣的 API
服務器[使用同一次版本號](/zh-cn/releases/version-skew-policy/#kubectl)。

<!-- steps -->

<!--
## Define clusters, users, and contexts

Suppose you have two clusters, one for development work and one for test work.
In the `development` cluster, your frontend developers work in a namespace called `frontend`,
and your storage developers work in a namespace called `storage`. In your `test` cluster,
developers work in the default namespace, or they create auxiliary namespaces as they
see fit. Access to the development cluster requires authentication by certificate. Access
to the test cluster requires authentication by username and password.

Create a directory named `config-exercise`. In your
`config-exercise` directory, create a file named `config-demo` with this content:
-->
## 定義集羣、用戶和上下文    {#define-clusters-users-and-contexts}

假設用戶有兩個集羣，一個用於開發工作（development），一個用於測試工作（test）。
在 `development` 集羣中，前端開發者在名爲 `frontend` 的名字空間下工作，
存儲開發者在名爲 `storage` 的名字空間下工作。在 `test` 集羣中，
開發人員可能在默認名字空間下工作，也可能視情況創建附加的名字空間。
訪問開發集羣需要通過證書進行認證。
訪問測試集羣需要通過用戶名和密碼進行認證。

創建名爲 `config-exercise` 的目錄。在
`config-exercise` 目錄中，創建名爲 `config-demo` 的文件，其內容爲：

```yaml
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: test

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-test
```

<!--
A configuration file describes clusters, users, and contexts. Your `config-demo` file
has the framework to describe two clusters, two users, and three contexts.

Go to your `config-exercise` directory. Enter these commands to add cluster details to
your configuration file:
-->
配置文件描述了集羣、用戶名和上下文。`config-demo` 文件中含有描述兩個集羣、
兩個用戶和三個上下文的框架。

進入 `config-exercise` 目錄。輸入以下命令，將集羣詳細信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster test --server=https://5.6.7.8 --insecure-skip-tls-verify
```

<!--
Add user details to your configuration file:
-->
將用戶詳細信息添加到配置文件中：

{{< caution >}}
<!--
Storing passwords in Kubernetes client config is risky. A better alternative would be to use a credential plugin and store them separately. See: [client-go credential plugins](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
-->
將密碼保存到 Kubernetes 客戶端配置中有風險。
一個較好的替代方式是使用憑據插件並單獨保存這些憑據。
參閱 [client-go 憑據插件](/zh-cn/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
{{< /caution >}}

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< note >}}
<!--
- To delete a user you can run `kubectl --kubeconfig=config-demo config unset users.<name>`
- To remove a cluster, you can run `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- To remove a context, you can run `kubectl --kubeconfig=config-demo config unset contexts.<name>`
-->
- 要刪除用戶，可以運行 `kubectl --kubeconfig=config-demo config unset users.<name>`
- 要刪除集羣，可以運行 `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- 要刪除上下文，可以運行 `kubectl --kubeconfig=config-demo config unset contexts.<name>`
{{< /note >}}

<!--
Add context details to your configuration file:
-->
將上下文詳細信息添加到配置文件中：

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-test --cluster=test --namespace=default --user=experimenter
```

<!--
Open your `config-demo` file to see the added details. As an alternative to opening the
`config-demo` file, you can use the `config view` command.
-->
打開 `config-demo` 文件查看添加的詳細信息。也可以使用 `config view`
命令進行查看：

```shell
kubectl config --kubeconfig=config-demo view
```

<!--
The output shows the two clusters, two users, and three contexts:
-->
輸出展示了兩個集羣、兩個用戶和三個上下文：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # 文檔說明（本註釋不屬於命令輸出）。
    # 將密碼保存到 Kubernetes 客戶端配置有風險。
    # 一個較好的替代方式是使用憑據插件並單獨保存這些憑據。
    # 參閱 https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
    password: some-password
    username: exp
```

<!--
The `fake-ca-file`, `fake-cert-file` and `fake-key-file` above are the placeholders
for the pathnames of the certificate files. You need to change these to the actual pathnames
of certificate files in your environment.

Sometimes you may want to use Base64-encoded data embedded here instead of separate
certificate files; in that case you need to add the suffix `-data` to the keys, for example,
`certificate-authority-data`, `client-certificate-data`, `client-key-data`.
-->
其中的 `fake-ca-file`、`fake-cert-file` 和 `fake-key-file` 是證書文件路徑名的佔位符。
你需要更改這些值，使之對應你的環境中證書文件的實際路徑名。

有時你可能希望在這裏使用 BASE64 編碼的數據而不是一個個獨立的證書文件。
如果是這樣，你需要在鍵名上添加 `-data` 後綴。例如，
`certificate-authority-data`、`client-certificate-data` 和 `client-key-data`。

<!--
Each context is a triple (cluster, user, namespace). For example, the
`dev-frontend` context says, "Use the credentials of the `developer`
user to access the `frontend` namespace of the `development` cluster".

Set the current context:
-->
每個上下文包含三部分（集羣、用戶和名字空間），例如，
`dev-frontend` 上下文表明：使用 `developer` 用戶的憑證來訪問 `development` 集羣的
`frontend` 名字空間。

設置當前上下文：

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

<!--
Now whenever you enter a `kubectl` command, the action will apply to the cluster,
and namespace listed in the `dev-frontend` context. And the command will use
the credentials of the user listed in the `dev-frontend` context.

To see only the configuration information associated with
the current context, use the `--minify` flag.
-->
現在當輸入 `kubectl` 命令時，相應動作會應用於 `dev-frontend` 上下文中所列的集羣和名字空間，
同時，命令會使用 `dev-frontend` 上下文中所列用戶的憑證。

使用 `--minify` 參數，來查看與當前上下文相關聯的配置信息。

```shell
kubectl config --kubeconfig=config-demo view --minify
```

<!--
The output shows configuration information associated with the `dev-frontend` context:
-->
輸出結果展示了 `dev-frontend` 上下文相關的配置信息：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

<!--
Now suppose you want to work for a while in the test cluster.

Change the current context to `exp-test`:
-->
現在假設用戶希望在測試集羣中工作一段時間。

將當前上下文更改爲 `exp-test`：

```shell
kubectl config --kubeconfig=config-demo use-context exp-test
```

<!--
Now any `kubectl` command you give will apply to the default namespace of
the `test` cluster. And the command will use the credentials of the user
listed in the `exp-test` context.

View configuration associated with the new current context, `exp-test`.
-->
現在你發出的所有 `kubectl` 命令都將應用於 `test` 集羣的默認名字空間。
同時，命令會使用 `exp-test` 上下文中所列用戶的憑證。

查看更新後的當前上下文 `exp-test` 相關的配置：

```shell
kubectl config --kubeconfig=config-demo view --minify
```

<!--
Finally, suppose you want to work for a while in the `storage` namespace of the
`development` cluster.

Change the current context to `dev-storage`:
-->
最後，假設用戶希望在 `development` 集羣中的 `storage` 名字空間下工作一段時間。

將當前上下文更改爲 `dev-storage`：

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

<!--
View configuration associated with the new current context, `dev-storage`.
-->
查看更新後的當前上下文 `dev-storage` 相關的配置：

```shell
kubectl config --kubeconfig=config-demo view --minify
```

<!--
## Create a second configuration file

In your `config-exercise` directory, create a file named `config-demo-2` with this content:
-->
## 創建第二個配置文件    {#create-a-second-configuration-file}

在 `config-exercise` 目錄中，創建名爲 `config-demo-2` 的文件，其中包含以下內容：

```yaml
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

<!--
The preceding configuration file defines a new context named `dev-ramp-up`.
-->
上述配置文件定義了一個新的上下文，名爲 `dev-ramp-up`。

<!--
## Set the KUBECONFIG environment variable

See whether you have an environment variable named `KUBECONFIG`. If so, save the
current value of your `KUBECONFIG` environment variable, so you can restore it later.
For example:
-->
## 設置 KUBECONFIG 環境變量    {#set-the-kubeconfig-environment-variable}

查看是否有名爲 `KUBECONFIG` 的環境變量。
如有，保存 `KUBECONFIG` 環境變量當前的值，以便稍後恢復。
例如：

### Linux

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

<!--
The `KUBECONFIG` environment variable is a list of paths to configuration files. The list is
colon-delimited for Linux and Mac, and semicolon-delimited for Windows. If you have
a `KUBECONFIG` environment variable, familiarize yourself with the configuration files
in the list.

Temporarily append two paths to your `KUBECONFIG` environment variable. For example:
-->
`KUBECONFIG` 環境變量是配置文件路徑的列表，該列表在 Linux 和 Mac 中以冒號分隔，
在 Windows 中以分號分隔。
如果有 `KUBECONFIG` 環境變量，請熟悉列表中的配置文件。

臨時添加兩條路徑到 `KUBECONFIG` 環境變量中。例如：

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:config-demo:config-demo-2"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

<!--
In your `config-exercise` directory, enter this command:
-->
在 `config-exercise` 目錄中輸入以下命令：

```shell
kubectl config view
```

<!--
The output shows merged information from all the files listed in your `KUBECONFIG`
environment variable. In particular, notice that the merged information has the
`dev-ramp-up` context from the `config-demo-2` file and the three contexts from
the `config-demo` file:
-->
輸出展示了 `KUBECONFIG` 環境變量中所列舉的所有文件合併後的信息。
特別地，注意合併信息中包含來自 `config-demo-2` 文件的 `dev-ramp-up` 上下文和來自
`config-demo` 文件的三個上下文：

```yaml
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
```

<!--
For more information about how kubeconfig files are merged, see
[Organizing Cluster Access Using kubeconfig Files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
-->
關於 kubeconfig 文件如何合併的更多信息，
請參考[使用 kubeconfig 文件組織集羣訪問](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

<!--
## Explore the $HOME/.kube directory

If you already have a cluster, and you can use `kubectl` to interact with
the cluster, then you probably have a file named `config` in the `$HOME/.kube`
directory.

Go to `$HOME/.kube`, and see what files are there. Typically, there is a file named
`config`. There might also be other configuration files in this directory. Briefly
familiarize yourself with the contents of these files.
-->
## 探索 $HOME/.kube 目錄    {#explore-the-home-kube-directory}

如果用戶已經擁有一個集羣，可以使用 `kubectl` 與集羣進行交互，
那麼很可能在 `$HOME/.kube` 目錄下有一個名爲 `config` 的文件。

進入 `$HOME/.kube` 目錄，看看那裏有什麼文件。通常會有一個名爲
`config` 的文件，目錄中可能還有其他配置文件。請簡單地熟悉這些文件的內容。

<!--
## Append $HOME/.kube/config to your KUBECONFIG environment variable

If you have a `$HOME/.kube/config` file, and it's not already listed in your
`KUBECONFIG` environment variable, append it to your `KUBECONFIG` environment variable now.
For example:
-->
## 將 $HOME/.kube/config 追加到 KUBECONFIG 環境變量中    {#append-home-kube-config-to-your-kubeconfig-environment-variable}

如果有 `$HOME/.kube/config` 文件，並且還未列在 `KUBECONFIG` 環境變量中，
那麼現在將它追加到 `KUBECONFIG` 環境變量中。例如：

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:${HOME}/.kube/config"
```

### Windows Powershell

```powershell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

<!--
View configuration information merged from all the files that are now listed
in your `KUBECONFIG` environment variable. In your config-exercise directory, enter:
-->
在配置練習目錄中輸入以下命令，查看當前 `KUBECONFIG` 環境變量中列舉的所有文件合併後的配置信息：

```shell
kubectl config view
```

<!--
## Clean up

Return your `KUBECONFIG` environment variable to its original value. For example:<br>
-->
## 清理    {#clean-up}

將 `KUBECONFIG` 環境變量還原爲原始值。例如：

### Linux

```shell
export KUBECONFIG="$KUBECONFIG_SAVED"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

<!--
## Check the subject represented by the kubeconfig

It is not always obvious what attributes (username, groups) you will get after authenticating to the cluster. 
It can be even more challenging if you are managing more than one cluster at the same time.
-->
## 檢查 kubeconfig 所表示的主體   {#check-the-subject}

你在通過集羣的身份驗證後將獲得哪些屬性（用戶名、組），這一點並不總是很明顯。
如果你同時管理多個集羣，這可能會更具挑戰性。

<!--
There is a `kubectl` subcommand to check subject attributes, such as username, for your selected Kubernetes 
client context: `kubectl auth whoami`.

Read [API access to authentication information for a client](/docs/reference/access-authn-authz/authentication/#self-subject-review)
to learn about this in more detail.
-->
對於你所選擇的 Kubernetes 客戶端上下文，有一個 `kubectl` 子命令可以檢查用戶名等主體屬性：
`kubectl alpha auth whoami`。

更多細節請參閱[通過 API 訪問客戶端的身份驗證信息](/zh-cn/docs/reference/access-authn-authz/authentication/#self-subject-review)。

## {{% heading "whatsnext" %}}

<!--
* [Organizing Cluster Access Using kubeconfig Files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)
-->
* [使用 kubeconfig 文件組織集羣訪問](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)

