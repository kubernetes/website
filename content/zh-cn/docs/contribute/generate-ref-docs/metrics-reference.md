---
title: 为指标生成参考文档
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
本页演示如何生成指标参考文档。

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

<!--
## Clone the Kubernetes repository

The metric generation happens in the Kubernetes repository.
To clone the repository, change directories to where you want the clone to exist.

Then, execute the following command:
-->
## 克隆 Kubernetes 仓库   {#cloning-the-kubernetes-repository}

指标的生成发生在 Kubernetes 仓库中。
要克隆此仓库，请将目录更改为你要克隆到的目标位置。

然后，执行以下命令：

```shell
git clone https://www.github.com/kubernetes/kubernetes 
```

<!--
This creates a `kubernetes` folder in your current working directory.
-->
这将在当前工作目录中创建一个 `kubernetes` 文件夹。

<!--
## Generate the metrics

Inside the cloned Kubernetes repository, locate the
`test/instrumentation/documentation` directory.
The metrics documentation is generated in this directory.
-->
## 生成指标  {#generate-the-metrics}

在克隆的 Kubernetes 仓库中，找到 `test/instrumentation/documentation` 目录。
指标文档将在此目录中生成。

<!--
With each release, new metrics are added.
After you run the metrics documentation generator script, copy the
metrics documentation to the Kubernetes website and
publish the updated metrics documentation.

To generate the latest metrics, make sure you are in the root of the cloned Kubernetes directory.
Then, execute the following command:
-->
每次发布都会添加新的指标。你在运行指标文档生成脚本之后，
将指标文档复制到 Kubernetes 网站并发布更新的指标文档。

要生成最新的指标，请确保你位于已克隆的 Kubernetes 仓库的根目录中。
然后，执行以下命令：

```shell
./test/instrumentation/update-documentation.sh
```

<!--
To check for changes, execute:
-->
要检查变更，执行以下命令：

```shell
git status
```

<!--
The output is similar to:
-->
输出类似于：

```
./test/instrumentation/documentation/documentation.md
./test/instrumentation/documentation/documentation-list.yaml
```

<!--
## Copy the generated metrics documentation file to the Kubernetes website repository

1. Set the Kubernetes website root environment variable.

   Execute the following command to set the website root:
-->
## 将生成的指标文档文件复制到 Kubernetes 网站仓库   {#copy-the-generated-metrics-documentation-file-to-the-kubernetes-website-repository}

1. 设置 Kubernetes 网站根环境变量

   执行以下命令设置网站根目录：

   ```shell
   export WEBSITE_ROOT=<path to website root>
   ```

<!--
2. Copy the generated metrics file to the Kubernetes website repository.
-->
2. 将生成的指标文件复制到 Kubernetes 网站仓库。

   ```shell
   cp ./test/instrumentation/documentation/documentation.md "${WEBSITE_ROOT}/content/en/docs/reference/instrumentation/metrics.md"
   ```

   {{< note >}}
   <!--
   If you get an error, check that you have permission to copy the file.
   You can use `chown` to change the file ownership back to your own user.
   -->
   如果出现错误，请检查你是否有权限复制文件。
   你可以使用 `chown` 命令将文件所有权更改回你自己的用户。
   {{< /note >}}

<!--
## Create a pull request

To create a pull request, follow the instructions in [Opening a pull request](/docs/contribute/new-content/open-a-pr/).
-->
## 创建 PR   {#creating-a-pull-request}

要创建 PR，请按照[提 PR](/zh-cn/docs/contribute/new-content/open-a-pr/) 中的说明操作。

## {{% heading "whatsnext" %}}

<!--
* [Contribute-upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
-->
* [贡献上游](/zh-cn/docs/contribute/generate-ref-docs/contribute-upstream/)
* [为 Kubernetes 组件和工具生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubernetes-components/)
* [为 kubectl 命令生成参考文档](/zh-cn/docs/contribute/generate-ref-docs/kubectl/)
