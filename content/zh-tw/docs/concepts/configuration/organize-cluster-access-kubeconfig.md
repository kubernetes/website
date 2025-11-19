---
title: 使用 kubeconfig 文件組織叢集訪問
content_type: concept
weight: 60
---
<!--
title: Organizing Cluster Access Using kubeconfig Files
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
Use kubeconfig files to organize information about clusters, users, namespaces, and
authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to
find the information it needs to choose a cluster and communicate with the API server
of a cluster.
-->
使用 kubeconfig 文件來組織有關叢集、使用者、命名空間和身份認證機制的信息。
`kubectl` 命令列工具使用 kubeconfig 文件來查找選擇叢集所需的信息，並與叢集的 API 伺服器進行通信。

{{< note >}}
<!--
A file that is used to configure access to clusters is called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
-->
用於設定叢集訪問的文件稱爲 **kubeconfig 文件**。
這是引用到設定文件的通用方法，並不意味着有一個名爲 `kubeconfig` 的文件。
{{< /note >}}

{{< warning >}}
<!--
Only use kubeconfig files from trusted sources. Using a specially-crafted kubeconfig file could result in malicious code execution or file exposure.
If you must use an untrusted kubeconfig file, inspect it carefully first, much as you would a shell script.
-->
請務必僅使用來源可靠的 kubeconfig 文件。使用特製的 kubeconfig 文件可能會導致惡意代碼執行或文件暴露。
如果必須使用不受信任的 kubeconfig 文件，請首先像檢查 Shell 腳本一樣仔細檢查此文件。
{{< /warning>}}

<!--
By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other kubeconfig files by setting the `KUBECONFIG` environment
variable or by setting the
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/) flag.
-->
默認情況下，`kubectl` 在 `$HOME/.kube` 目錄下查找名爲 `config` 的文件。
你可以通過設置 `KUBECONFIG` 環境變量或者設置
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/)參數來指定其他 kubeconfig 文件。

<!--
For step-by-step instructions on creating and specifying kubeconfig files, see
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).
-->
有關創建和指定 kubeconfig 文件的分步說明，
請參閱[設定對多叢集的訪問](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters)。

<!-- body -->

<!--
## Supporting multiple clusters, users, and authentication mechanisms
-->
## 支持多叢集、使用者和身份認證機制   {#support-clusters-users-and-authn}

<!--
Suppose you have several clusters, and your users and components authenticate
in a variety of ways. For example:
-->
假設你有多個叢集，並且你的使用者和組件以多種方式進行身份認證。比如：

<!--
- A running kubelet might authenticate using certificates.
- A user might authenticate using tokens.
- Administrators might have sets of certificates that they provide to individual users.
-->
- 正在運行的 kubelet 可能使用證書在進行認證。
- 使用者可能通過令牌進行認證。
- 管理員可能擁有多個證書集合提供給各使用者。

<!--
With kubeconfig files, you can organize your clusters, users, and namespaces.
You can also define contexts to quickly and easily switch between
clusters and namespaces.
-->
使用 kubeconfig 文件，你可以組織叢集、使用者和命名空間。你還可以定義上下文，以便在叢集和命名空間之間快速輕鬆地切換。

<!--
## Context
-->
## 上下文（Context）   {#context}

<!--
A *context* element in a kubeconfig file is used to group access parameters
under a convenient name. Each context has three parameters: cluster, namespace, and user.
By default, the `kubectl` command-line tool uses parameters from
the *current context* to communicate with the cluster.
-->
通過 kubeconfig 文件中的 *context* 元素，使用簡便的名稱來對訪問參數進行分組。
每個 context 都有三個參數：cluster、namespace 和 user。
默認情況下，`kubectl` 命令列工具使用 **當前上下文** 中的參數與叢集進行通信。

<!--
To choose the current context:
-->
選擇當前上下文：

```shell
kubectl config use-context
```

<!--
## The KUBECONFIG environment variable
-->
## KUBECONFIG 環境變量   {#kubeconfig-env-var}

<!--
The `KUBECONFIG` environment variable holds a list of kubeconfig files.
For Linux and Mac, the list is colon-delimited. For Windows, the list
is semicolon-delimited. The `KUBECONFIG` environment variable is not
required. If the `KUBECONFIG` environment variable doesn't exist,
`kubectl` uses the default kubeconfig file, `$HOME/.kube/config`.
-->
`KUBECONFIG` 環境變量包含一個 kubeconfig 文件列表。
對於 Linux 和 Mac，此列表以英文冒號分隔。對於 Windows，此列表以英文分號分隔。
`KUBECONFIG` 環境變量不是必需的。
如果 `KUBECONFIG` 環境變量不存在，`kubectl` 將使用默認的 kubeconfig 文件：`$HOME/.kube/config`。

<!--
If the `KUBECONFIG` environment variable does exist, `kubectl` uses
an effective configuration that is the result of merging the files
listed in the `KUBECONFIG` environment variable.
-->
如果 `KUBECONFIG` 環境變量存在，`kubectl` 將使用 `KUBECONFIG` 環境變量中列舉的文件合併後的有效設定。

<!--
## Merging kubeconfig files
-->
## 合併 kubeconfig 文件   {#merge-kubeconfig-files}

<!--
To see your configuration, enter this command:
-->
要查看設定，輸入以下命令：

```shell
kubectl config view
```

<!--
As described previously, the output might be from a single kubeconfig file,
or it might be the result of merging several kubeconfig files.
-->
如前所述，輸出可能來自單個 kubeconfig 文件，也可能是合併多個 kubeconfig 文件的結果。

<!--
Here are the rules that `kubectl` uses when it merges kubeconfig files:
-->
以下是 `kubectl` 在合併 kubeconfig 文件時使用的規則。

<!--
1. If the `--kubeconfig` flag is set, use only the specified file. Do not merge.
   Only one instance of this flag is allowed.

   Otherwise, if the `KUBECONFIG` environment variable is set, use it as a
   list of files that should be merged.
   Merge the files listed in the `KUBECONFIG` environment variable
   according to these rules:

   * Ignore empty filenames.
   * Produce errors for files with content that cannot be deserialized.
   * The first file to set a particular value or map key wins.
   * Never change the value or map key.
     Example: Preserve the context of the first file to set `current-context`.
     Example: If two files specify a `red-user`, use only values from the first file's `red-user`.
     Even if the second file has non-conflicting entries under `red-user`, discard them.
-->
1. 如果設置了 `--kubeconfig` 參數，則僅使用指定的文件。不進行合併。此參數只能使用一次。

   否則，如果設置了 `KUBECONFIG` 環境變量，將它用作應合併的文件列表。根據以下規則合併 `KUBECONFIG` 環境變量中列出的文件：

   * 忽略空文件名。
   * 對於內容無法反序列化的文件，產生錯誤信息。
   * 第一個設置特定值或者映射鍵的文件將生效。
   * 永遠不會更改值或者映射鍵。示例：保留第一個文件的上下文以設置 `current-context`。
     示例：如果兩個文件都指定了 `red-user`，則僅使用第一個文件的 `red-user` 中的值。
     即使第二個文件在 `red-user` 下有非衝突條目，也要丟棄它們。

   <!--
   For an example of setting the `KUBECONFIG` environment variable, see
   [Setting the KUBECONFIG environment variable](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).
   -->
   有關設置 `KUBECONFIG` 環境變量的示例，
   請參閱[設置 KUBECONFIG 環境變量](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)。

   <!--
   Otherwise, use the default kubeconfig file, `$HOME/.kube/config`, with no merging.
   -->
   否則，使用默認的 kubeconfig 文件（`$HOME/.kube/config`），不進行合併。

<!--
1. Determine the context to use based on the first hit in this chain:

    1. Use the `--context` command-line flag if it exists.
    1. Use the `current-context` from the merged kubeconfig files.
-->
2. 根據此鏈中的第一個匹配確定要使用的上下文。

    1. 如果存在上下文，則使用 `--context` 命令列參數。
    2. 使用合併的 kubeconfig 文件中的 `current-context`。

   <!--
   An empty context is allowed at this point.
   -->
   這種場景下允許空上下文。

<!--
1. Determine the cluster and user. At this point, there might or might not be a context.
   Determine the cluster and user based on the first hit in this chain,
   which is run twice: once for user and once for cluster:

   1. Use a command-line flag if it exists: `--user` or `--cluster`.
   1. If the context is non-empty, take the user or cluster from the context.
-->
3. 確定叢集和使用者。此時，可能有也可能沒有上下文。根據此鏈中的第一個匹配確定叢集和使用者，
   這將運行兩次：一次用於使用者，一次用於叢集。

   1. 如果存在使用者或叢集，則使用命令列參數：`--user` 或者 `--cluster`。
   2. 如果上下文非空，則從上下文中獲取使用者或叢集。

   <!--
   The user and cluster can be empty at this point.
   -->
   這種場景下使用者和叢集可以爲空。

<!--
1. Determine the actual cluster information to use. At this point, there might or
   might not be cluster information.
   Build each piece of the cluster information based on this chain; the first hit wins:

   1. Use command line flags if they exist: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
   1. If any cluster information attributes exist from the merged kubeconfig files, use them.
   1. If there is no server location, fail.
-->
4. 確定要使用的實際叢集信息。此時，可能有也可能沒有叢集信息。
   基於此鏈構建每個叢集信息；第一個匹配項會被採用：

   1. 如果存在叢集信息，則使用命令列參數：`--server`、`--certificate-authority` 和 `--insecure-skip-tls-verify`。
   2. 如果合併的 kubeconfig 文件中存在叢集信息屬性，則使用這些屬性。
   3. 如果沒有 server 設定，則設定無效。

<!--
1. Determine the actual user information to use. Build user information using the same
   rules as cluster information, except allow only one authentication
   technique per user:

   1. Use command line flags if they exist: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
   1. Use the `user` fields from the merged kubeconfig files.
   1. If there are two conflicting techniques, fail.
-->
5. 確定要使用的實際使用者信息。使用與叢集信息相同的規則構建使用者信息，但對於每個使用者只允許使用一種身份認證技術：

   1. 如果存在使用者信息，則使用命令列參數：`--client-certificate`、`--client-key`、`--username`、`--password` 和 `--token`。
   2. 使用合併的 kubeconfig 文件中的 `user` 字段。
   3. 如果存在兩種衝突技術，則設定無效。

<!--
1. For any information still missing, use default values and potentially
   prompt for authentication information.
-->
6. 對於仍然缺失的任何信息，使用其對應的默認值，並可能提示輸入身份認證信息。

<!--
## File references
-->
## 文件引用   {#file-reference}

<!--
File and path references in a kubeconfig file are relative to the location of the kubeconfig file.
File references on the command line are relative to the current working directory.
In `$HOME/.kube/config`, relative paths are stored relatively, and absolute paths
are stored absolutely.
-->
kubeconfig 文件中的文件和路徑引用是相對於 kubeconfig 文件的位置。
命令列上的文件引用是相對於當前工作目錄的。
在 `$HOME/.kube/config` 中，相對路徑按相對路徑存儲，而絕對路徑按絕對路徑存儲。

<!--
## Proxy

You can configure `kubectl` to use a proxy per cluster using `proxy-url` in your kubeconfig file, like this:
-->
## 代理   {#proxy}

你可以在 `kubeconfig` 文件中，爲每個叢集設定 `proxy-url` 來讓 `kubectl` 使用代理，例如：

```yaml
apiVersion: v1
kind: Config

clusters:
- cluster:
    proxy-url: http://proxy.example.org:3128
    server: https://k8s.example.org/k8s/clusters/c-xxyyzz
  name: development

users:
- name: developer

contexts:
- context:
  name: development
```

## {{% heading "whatsnext" %}}

<!--
* [Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)
-->
* [設定對多叢集的訪問](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)
