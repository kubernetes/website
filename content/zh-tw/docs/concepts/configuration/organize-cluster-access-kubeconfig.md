---
title: 使用 kubeconfig 檔案組織叢集訪問
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
使用 kubeconfig 檔案來組織有關叢集、使用者、名稱空間和身份認證機制的資訊。
`kubectl` 命令列工具使用 kubeconfig 檔案來查詢選擇叢集所需的資訊，並與叢集的 API 伺服器進行通訊。

<!--
{{< note >}}
A file that is used to configure access to clusters is called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
{{< /note >}}
-->
{{< note >}}
用於配置叢集訪問的檔案稱為“kubeconfig 檔案”。
這是引用配置檔案的通用方法，並不意味著有一個名為 `kubeconfig` 的檔案
{{< /note >}}

<!--
{{< warning >}}
Only use kubeconfig files from trusted sources. Using a specially-crafted kubeconfig file could result in malicious code execution or file exposure.
If you must use an untrusted kubeconfig file, inspect it carefully first, much as you would a shell script.
{{< /warning>}}
-->
{{< warning >}}
只使用來源可靠的 kubeconfig 檔案。使用特製的 kubeconfig 檔案可能會導致惡意程式碼執行或檔案暴露。
如果必須使用不受信任的 kubeconfig 檔案，請首先像檢查 shell 指令碼一樣仔細檢查它。
{{< /warning>}}

<!--
By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other kubeconfig files by setting the `KUBECONFIG` environment
variable or by setting the
[`-kubeconfig`](/docs/reference/generated/kubectl/kubectl/) flag.
-->
預設情況下，`kubectl` 在 `$HOME/.kube` 目錄下查詢名為 `config` 的檔案。
你可以透過設定 `KUBECONFIG` 環境變數或者設定
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/)引數來指定其他 kubeconfig 檔案。

<!--
For step-by-step instructions on creating and specifying kubeconfig files, see
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).
-->
有關建立和指定 kubeconfig 檔案的分步說明，請參閱
[配置對多叢集的訪問](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters)。

<!-- body -->

<!--
## Supporting multiple clusters, users, and authentication mechanisms
-->
## 支援多叢集、使用者和身份認證機制

<!--
Suppose you have several clusters, and your users and components authenticate
in a variety of ways. For example:
-->
假設你有多個叢集，並且你的使用者和元件以多種方式進行身份認證。比如：

<!--
- A running kubelet might authenticate using certificates.
- A user might authenticate using tokens.
- Administrators might have sets of certificates that they provide to individual users.
-->
- 正在執行的 kubelet 可能使用證書在進行認證。
- 使用者可能透過令牌進行認證。
- 管理員可能擁有多個證書集合提供給各使用者。

<!--
With kubeconfig files, you can organize your clusters, users, and namespaces.
You can also define contexts to quickly and easily switch between
clusters and namespaces.
-->
使用 kubeconfig 檔案，你可以組織叢集、使用者和名稱空間。你還可以定義上下文，以便在叢集和名稱空間之間快速輕鬆地切換。

<!--
## Context
-->
## 上下文（Context）

<!--
A *context* element in a kubeconfig file is used to group access parameters
under a convenient name. Each context has three parameters: cluster, namespace, and user.
By default, the `kubectl` command-line tool uses parameters from
the *current context* to communicate with the cluster.
-->
透過 kubeconfig 檔案中的 *context* 元素，使用簡便的名稱來對訪問引數進行分組。
每個 context 都有三個引數：cluster、namespace 和 user。
預設情況下，`kubectl` 命令列工具使用 **當前上下文** 中的引數與叢集進行通訊。

<!--
To choose the current context:
-->
選擇當前上下文

```shell
kubectl config use-context
```

<!--
## The KUBECONFIG environment variable
-->
## KUBECONFIG 環境變數

<!--
The `KUBECONFIG` environment variable holds a list of kubeconfig files.
For Linux and Mac, the list is colon-delimited. For Windows, the list
is semicolon-delimited. The `KUBECONFIG` environment variable is not
required. If the `KUBECONFIG` environment variable doesn't exist,
`kubectl` uses the default kubeconfig file, `$HOME/.kube/config`.
-->
`KUBECONFIG` 環境變數包含一個 kubeconfig 檔案列表。
對於 Linux 和 Mac，列表以冒號分隔。對於 Windows，列表以分號分隔。
`KUBECONFIG` 環境變數不是必要的。
如果 `KUBECONFIG` 環境變數不存在，`kubectl` 使用預設的 kubeconfig 檔案，`$HOME/.kube/config`。

<!--
If the `KUBECONFIG` environment variable does exist, `kubectl` uses
an effective configuration that is the result of merging the files
listed in the `KUBECONFIG` environment variable.
-->
如果 `KUBECONFIG` 環境變數存在，`kubectl` 使用 `KUBECONFIG` 環境變數中列舉的檔案合併後的有效配置。

<!--
## Merging kubeconfig files
-->
## 合併 kubeconfig 檔案

<!--
To see your configuration, enter this command:
-->
要檢視配置，輸入以下命令：

```shell
kubectl config view
```

<!--
As described previously, the output might be from a single kubeconfig file,
or it might be the result of merging several kubeconfig files.
-->
如前所述，輸出可能來自 kubeconfig 檔案，也可能是合併多個 kubeconfig 檔案的結果。

<!--
Here are the rules that `kubectl` uses when it merges kubeconfig files:
-->
以下是 `kubectl` 在合併 kubeconfig 檔案時使用的規則。

<!--
1. If the `-kubeconfig` flag is set, use only the specified file. Do not merge.
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
1. 如果設定了 `--kubeconfig` 引數，則僅使用指定的檔案。不進行合併。此引數只能使用一次。

   否則，如果設定了 `KUBECONFIG` 環境變數，將它用作應合併的檔案列表。根據以下規則合併 `KUBECONFIG` 環境變數中列出的檔案：

   * 忽略空檔名。
   * 對於內容無法反序列化的檔案，產生錯誤資訊。
   * 第一個設定特定值或者對映鍵的檔案將生效。
   * 永遠不會更改值或者對映鍵。示例：保留第一個檔案的上下文以設定 `current-context`。示例：如果兩個檔案都指定了 `red-user`，則僅使用第一個檔案的 `red-user` 中的值。即使第二個檔案在 `red-user` 下有非衝突條目，也要丟棄它們。

<!--
   For an example of setting the `KUBECONFIG` environment variable, see
   [Setting the KUBECONFIG environment variable](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).
-->
   有關設定 `KUBECONFIG` 環境變數的示例，請參閱
   [設定 KUBECONFIG 環境變數](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)。

<!--
   Otherwise, use the default kubeconfig file, `$HOME/.kube/config`, with no merging.
-->
   否則，使用預設的 kubeconfig 檔案， `$HOME/.kube/config`，不進行合併。

<!--
1. Determine the context to use based on the first hit in this chain:

    1. Use the `-context` command-line flag if it exists.
    2. Use the `current-context` from the merged kubeconfig files.
-->
1. 根據此鏈中的第一個匹配確定要使用的上下文。

    1. 如果存在，使用 `--context` 命令列引數。
    2. 使用合併的 kubeconfig 檔案中的 `current-context`。

<!--
   An empty context is allowed at this point.
-->
   這種場景下允許空上下文。

<!--
1. Determine the cluster and user. At this point, there might or might not be a context.
   Determine the cluster and user based on the first hit in this chain,
   which is run twice: once for user and once for cluster:

   1. Use a command-line flag if it exists: `--user` or `--cluster`.
   2. If the context is non-empty, take the user or cluster from the context.
-->
1. 確定叢集和使用者。此時，可能有也可能沒有上下文。根據此鏈中的第一個匹配確定叢集和使用者，這將執行兩次：一次用於使用者，一次用於叢集。

   1. 如果存在，使用命令列引數：`--user` 或者 `--cluster`。
   2. 如果上下文非空，從上下文中獲取使用者或叢集。

<!--
   The user and cluster can be empty at this point.
-->
   這種場景下使用者和叢集可以為空。

<!--
1. Determine the actual cluster information to use. At this point, there might or
   might not be cluster information.
   Build each piece of the cluster information based on this chain; the first hit wins:

   1. Use command line flags if they exist: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
   2. If any cluster information attributes exist from the merged kubeconfig files, use them.
   3. If there is no server location, fail.
-->
1. 確定要使用的實際叢集資訊。此時，可能有也可能沒有叢集資訊。基於此鏈構建每個叢集資訊；第一個匹配項會被採用：

   1. 如果存在：`--server`、`--certificate-authority` 和 `--insecure-skip-tls-verify`，使用命令列引數。
   2. 如果合併的 kubeconfig 檔案中存在叢集資訊屬性，則使用它們。
   3. 如果沒有 server 配置，則配置無效。

<!--
2. Determine the actual user information to use. Build user information using the same
   rules as cluster information, except allow only one authentication
   technique per user:

   1. Use command line flags if they exist: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
   2. Use the `user` fields from the merged kubeconfig files.
   3. If there are two conflicting techniques, fail.
-->
2. 確定要使用的實際使用者資訊。使用與叢集資訊相同的規則構建使用者資訊，但每個使用者只允許一種身份認證技術：

   1. 如果存在：`--client-certificate`、`--client-key`、`--username`、`--password` 和 `--token`，使用命令列引數。
   2. 使用合併的 kubeconfig 檔案中的 `user` 欄位。
   3. 如果存在兩種衝突技術，則配置無效。

<!--
3. For any information still missing, use default values and potentially
   prompt for authentication information.
-->
3. 對於仍然缺失的任何資訊，使用其對應的預設值，並可能提示輸入身份認證資訊。

<!--
## File references
-->
## 檔案引用

<!--
File and path references in a kubeconfig file are relative to the location of the kubeconfig file.
File references on the command line are relative to the current working directory.
In `$HOME/.kube/config`, relative paths are stored relatively, and absolute paths
are stored absolutely.
-->
kubeconfig 檔案中的檔案和路徑引用是相對於 kubeconfig 檔案的位置。
命令列上的檔案引用是相對於當前工作目錄的。
在 `$HOME/.kube/config` 中，相對路徑按相對路徑儲存，絕對路徑按絕對路徑儲存。

<!--
## Proxy

You can configure `kubectl` to use proxy by setting `proxy-url` in the kubeconfig file, like:
-->
## 代理

你可以在 `kubeconfig` 檔案中設定 `proxy-url` 來為 `kubectl` 使用代理，例如:

```yaml
apiVersion: v1
kind: Config

proxy-url: https://proxy.host:3128

clusters:
- cluster:
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
--->
* [配置對多叢集的訪問](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)
