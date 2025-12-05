---
title: 爲指標生成參考文檔
content_type: task
weight: 100
---
<!--
title: Generating reference documentation for metrics
content_type: task
weight: 100
-->

<!-- overview -->

<!--
This page demonstrates the generation of metrics reference documentation.
-->
本頁演示如何生成指標參考文檔。

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!--
## Clone the Kubernetes repository

The metric generation happens in the Kubernetes repository.
To clone the repository, change directories to where you want the clone to exist.

Then, execute the following command:
-->
## 克隆 Kubernetes 倉庫   {#cloning-the-kubernetes-repository}

指標的生成發生在 Kubernetes 倉庫中。
要克隆此倉庫，請將目錄更改爲你要克隆到的目標位置。

然後，執行以下命令：

```shell
git clone https://www.github.com/kubernetes/kubernetes 
```

<!--
This creates a `kubernetes` folder in your current working directory.
-->
這將在當前工作目錄中創建一個 `kubernetes` 檔案夾。

<!--
## Generate the metrics

Inside the cloned Kubernetes repository, locate the
`test/instrumentation/documentation` directory.
The metrics documentation is generated in this directory.
-->
## 生成指標  {#generate-the-metrics}

在克隆的 Kubernetes 倉庫中，找到 `test/instrumentation/documentation` 目錄。
指標文檔將在此目錄中生成。

<!--
With each release, new metrics are added.
After you run the metrics documentation generator script, copy the
metrics documentation to the Kubernetes website and
publish the updated metrics documentation.

To generate the latest metrics, make sure you are in the root of the cloned Kubernetes directory.
Then, execute the following command:
-->
每次發佈都會添加新的指標。你在運行指標文檔生成腳本之後，
將指標文檔複製到 Kubernetes 網站併發布更新的指標文檔。

要生成最新的指標，請確保你位於已克隆的 Kubernetes 倉庫的根目錄中。
然後，執行以下命令：

```shell
./test/instrumentation/update-documentation.sh
```

<!--
To check for changes, execute:
-->
要檢查變更，執行以下命令：

```shell
git status
```

<!--
The output is similar to:
-->
輸出類似於：

```
./test/instrumentation/documentation/documentation.md
./test/instrumentation/documentation/documentation-list.yaml
```

<!--
## Copy the generated metrics documentation file to the Kubernetes website repository

1. Set the Kubernetes website root environment variable.

   Execute the following command to set the website root:
-->
## 將生成的指標文檔檔案複製到 Kubernetes 網站倉庫   {#copy-the-generated-metrics-documentation-file-to-the-kubernetes-website-repository}

1. 設置 Kubernetes 網站根環境變量

   執行以下命令設置網站根目錄：

   ```shell
   export WEBSITE_ROOT=<path to website root>
   ```

<!--
2. Copy the generated metrics file to the Kubernetes website repository.
-->
2. 將生成的指標檔案複製到 Kubernetes 網站倉庫。

   ```shell
   cp ./test/instrumentation/documentation/documentation.md "${WEBSITE_ROOT}/content/en/docs/reference/instrumentation/metrics.md"
   ```

   {{< note >}}
   <!--
   If you get an error, check that you have permission to copy the file.
   You can use `chown` to change the file ownership back to your own user.
   -->
   如果出現錯誤，請檢查你是否有權限複製檔案。
   你可以使用 `chown` 命令將檔案所有權更改回你自己的使用者。
   {{< /note >}}

<!--
## Create a pull request

To create a pull request, follow the instructions in [Opening a pull request](/docs/contribute/new-content/open-a-pr/).
-->
## 創建 PR   {#creating-a-pull-request}

要創建 PR，請按照[提 PR](/zh-cn/docs/contribute/new-content/open-a-pr/) 中的說明操作。

## {{% heading "whatsnext" %}}

<!--
* [Contribute-upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
-->
* [貢獻上游](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)
* [爲 Kubernetes 組件和工具生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [爲 kubectl 命令生成參考文檔](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)
