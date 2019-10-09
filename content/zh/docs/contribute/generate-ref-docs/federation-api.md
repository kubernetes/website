---
title: 为 Kubernetes 联邦 API 生成参考文档
content_template: templates/task
---

<!--
---
title: Generating Reference Documentation for Kubernetes Federation API
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page shows how to automatically generate reference pages for the
Kubernetes Federation API.
-->

本节介绍如何为 Kubernetes 联邦 API 自动生成参考文档。

{{% /capture %}}


{{% capture prerequisites %}}

<!--
* You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.
-->

* 你需要安装 [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。

<!--
* You need to have
[Golang](https://golang.org/doc/install) version 1.9.1 or later installed,
and your `$GOPATH` environment variable must be set.
-->

* 你需要安装 1.9.1 或更高版本的 [Golang](https://golang.org/doc/install)，并在环境变量中设置你的 `$GOPATH`。

<!--
* You need to have
[Docker](https://docs.docker.com/engine/installation/) installed.
-->

* 你需要安装 [Docker](https://docs.docker.com/engine/installation/)。

<!--
* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).
-->

* 你需要知道如何在一个 GitHub 项目仓库中创建一个 PR。一般来说，这涉及到创建仓库的一个分支。想了解更多信息，请参见[创建一个文档 PR](/docs/home/contribute/create-pull-request/)。

{{% /capture %}}


{{% capture steps %}}

<!--
## Running the update-federation-api-docs.sh script
-->

## 运行 update-federation-api-docs.sh 脚本

<!--
If you don't already have the Kubernetes federation source code, get it now:
-->

如果你还没有 Kubernetes 联邦的源码，现在下载：

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/federation
```

<!--
Determine the base directory of your local
[kubernetes/federation](https://github.com/kubernetes/federation) repository.
For example, if you followed the preceding step to get the federation source
code, your base directory is `$GOPATH/src/github.com/kubernetes/federation.`
The remaining steps refer to your base directory as `<fed-base>`.
-->

确定本地 [kubernetes/federation](https://github.com/kubernetes/federation) 仓库的主目录。
例如，如果按照前面的步骤获取联邦的源码，则主目录是 `$GOPATH/src/github.com/kubernetes/federation`。
下文将该目录称为 `<fed-base>`。

<!--
Run the doc generation script:
-->

运行文档生成脚本：

```shell
cd <fed-base>
hack/update-federation-api-reference-docs.sh
```

<!--
The script runs the
[k8s.gcr.io/gen-swagger-docs](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/gen-swagger-docs?gcrImageListquery=%255B%255D&gcrImageListpage=%257B%2522t%2522%253A%2522%2522%252C%2522i%2522%253A0%257D&gcrImageListsize=50&gcrImageListsort=%255B%257B%2522p%2522%253A%2522uploaded%2522%252C%2522s%2522%253Afalse%257D%255D)
image to generate this set of reference docs:
-->

脚本运行 [k8s.gcr.io/gen-swagger-docs](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/gen-swagger-docs?gcrImageListquery=%255B%255D&gcrImageListpage=%257B%2522t%2522%253A%2522%2522%252C%2522i%2522%253A0%257D&gcrImageListsize=50&gcrImageListsort=%255B%257B%2522p%2522%253A%2522uploaded%2522%252C%2522s%2522%253Afalse%257D%255D) 镜像来生成以下参考文档：

* /docs/api-reference/extensions/v1beta1/operations.html
* /docs/api-reference/extensions/v1beta1/definitions.html
* /docs/api-reference/v1/operations.html
* /docs/api-reference/v1/definitions.html

<!--
The generated files do not get published automatically. They have to be manually copied to the
[kubernetes/website](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/generated)
repository.
-->

生成的文件不会被自动发布。你必须手工将它们复制到 [kubernetes/website](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/generated) 仓库。

<!--
These files are published at
[kubernetes.io/docs/reference](/docs/reference/):
-->

以下文件发布在 [kubernetes.io/docs/reference](/docs/reference/)：

* [Federation API v1 Operations](/docs/reference/federation/v1/operations/)
* [Federation API v1 Definitions](/docs/reference/federation/v1/definitions/)
* [Federation API extensions/v1beta1 Operations](/docs/reference/federation/extensions/v1beta1/operations/)
* [Federation API extensions/v1beta1 Definitions](/docs/reference/federation/extensions/v1beta1/definitions/)

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
-->

* [为 Kubernetes API 生成参考文档](/docs/home/contribute/generated-reference/kubernetes-api/)
* [为 kubectl 命令集生成参考文档](/docs/home/contribute/generated-reference/kubectl/)
* [为 Kubernetes 组件和工具生成参考页](/docs/home/contribute/generated-reference/kubernetes-components/)

{{% /capture %}}
