---
title: 使用 Kops 安装 Kubernetes
content_type: concept
weight: 20
---
<!--
title: Installing Kubernetes with kops
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
This quickstart shows you how to easily install a Kubernetes cluster on AWS.
It uses a tool called [`kops`](https://github.com/kubernetes/kops).
-->
本篇快速入门介绍了如何在 AWS 上轻松安装 Kubernetes 集群。
本篇使用了一个名为 [`kops`](https://github.com/kubernetes/kops) 的工具。

<!--
kops is an automated provisioning system:
-->
kops 是一个自动化的制备系统：

<!--
* Fully automated installation
* Uses DNS to identify clusters
* Self-healing: everything runs in Auto-Scaling Groups
* Multiple OS support (Debian, Ubuntu 16.04 supported, CentOS & RHEL, Amazon Linux and CoreOS) - see the [images.md](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md)
* High-Availability support - see the [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md)
* Can directly provision, or generate terraform manifests - see the [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)
-->
* 全自动安装流程
* 使用 DNS 识别集群
* 自我修复：一切都在自动扩缩组中运行
* 支持多种操作系统（如 Debian、Ubuntu 16.04、CentOS、RHEL、Amazon Linux 和 CoreOS） - 参考 [images.md](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md)
* 支持高可用 - 参考 [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md)
* 可以直接提供或者生成 terraform 清单 - 参考 [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)

## {{% heading "prerequisites" %}}

<!--
* You must have [kubectl](/docs/tasks/tools/) installed.

* You must [install](https://github.com/kubernetes/kops#installing) `kops` on a 64-bit (AMD64 and Intel 64) device architecture.

* You must have an [AWS account](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html), generate [IAM keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration) them. The IAM user will need [adequate permissions](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user).
-->
* 你必须安装 [kubectl](/zh/docs/tasks/tools/)。 
* 你必须安装[安装](https://github.com/kubernetes/kops#installing) `kops`
  到 64 位的（AMD64 和 Intel 64）设备架构上。
* 你必须拥有一个 [AWS 账户](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html)，
  生成 [IAM 秘钥](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)
  并[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration)
  该秘钥。IAM 用户需要[足够的权限许可](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user)。

<!-- steps -->

<!--
## Creating a cluster

### (1/5) Install kops

#### Installation

Download kops from the [releases page](https://github.com/kubernetes/kops/releases) (it is also convenient to build from source):
-->
## 创建集群

### (1/5) 安装 kops

#### 安装

从[下载页面](https://github.com/kubernetes/kops/releases)下载 kops
（从源代码构建也很方便）：

{{< tabs name="kops_installation" >}}
{{% tab name="macOS" %}}

<!--
Download the latest release with the command:
-->
使用下面的命令下载最新发布版本：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-darwin-amd64
```

<!--
To download a specific version, replace the following portion of the command with the specific kops version.
-->
要下载特定版本，使用特定的 kops 版本替换下面命令中的部分：

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

<!--
For example, to download kops version v1.20.0 type:
-->
例如，要下载 kops v1.20.0，输入：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-darwin-amd64
```

<!--
Make the kops binary executable.
-->
令 kops 二进制文件可执行：

```shell
chmod +x kops-darwin-amd64
```

<!--
Move the kops binary in to your PATH.
-->
将 kops 二进制文件移到你的 PATH 下：

```shell
sudo mv kops-darwin-amd64 /usr/local/bin/kops
```

你也可以使用 [Homebrew](https://brew.sh/) 安装 kops：

```shell
brew update && brew install kops
```
{{% /tab %}}
{{% tab name="Linux" %}}

<!--
Download the latest release with the command:
-->
使用命令下载最新发布版本：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
```

<!--
To download a specific version of kops, replace the following portion of the command with the specific kops version.
-->
要下载 kops 的特定版本，用特定的 kops 版本替换下面命令中的部分：

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

<!--
For example, to download kops version v1.20.0 type:
-->
例如，要下载 kops v1.20 版本，输入：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-linux-amd64
```

<!--
Make the kops binary executable
-->
令 kops 二进制文件可执行：

```shell
chmod +x kops-linux-amd64
```

<!--
Move the kops binary in to your PATH.
-->
将 kops 二进制文件移到 PATH 下：


```shell
sudo mv kops-linux-amd64 /usr/local/bin/kops
```

你也可以使用 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)
来安装 kops：

```shell
brew update && brew install kops
```

{{% /tab %}}
{{< /tabs >}}

<!--
### (2/5) Create a route53 domain for your cluster

kops uses DNS for discovery, both inside the cluster and outside, so that you can reach the kubernetes API server
from clients.
-->
### (2/5) 为你的集群创建一个 route53 域名

kops 在集群内部和外部都使用 DNS 进行发现操作，这样你可以从客户端访问
kubernetes API 服务器。

<!--
kops has a strong opinion on the cluster name: it should be a valid DNS name.  By doing so you will
no longer get your clusters confused, you can share clusters with your colleagues unambiguously,
and you can reach them without relying on remembering an IP address.
-->
kops 对集群名称有明显的要求：它应该是有效的 DNS 名称。这样一来，你就不会再使集群混乱，
可以与同事明确共享集群，并且无需依赖记住 IP 地址即可访问群集。

<!--
You can, and probably should, use subdomains to divide your clusters.  As our example we will use
`useast1.dev.example.com`.  The API server endpoint will then be `api.useast1.dev.example.com`.
-->
你可以，或许应该使用子域名来划分集群。作为示例，我们将使用域名 `useast1.dev.example.com`。
这样，API 服务器端点域名将为 `api.useast1.dev.example.com`。

<!--
A Route53 hosted zone can serve subdomains.  Your hosted zone could be `useast1.dev.example.com`,
but also `dev.example.com` or even `example.com`.  kops works with any of these, so typically
you choose for organization reasons (e.g. you are allowed to create records under `dev.example.com`,
but not under `example.com`).
-->
Route53 托管区域可以服务子域名。你的托管区域可能是 `useast1.dev.example.com`，还有 `dev.example.com` 甚至 `example.com`。
kops 可以与以上任何一种配合使用，因此通常你出于组织原因选择不同的托管区域。
例如，允许你在 `dev.example.com` 下创建记录，但不能在 `example.com` 下创建记录。

<!--
Let's assume you're using `dev.example.com` as your hosted zone.  You create that hosted zone using
the [normal process](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html), or
with a command such as `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`.
-->
假设你使用 `dev.example.com` 作为托管区域。你可以使用
[正常流程](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html)
或者使用诸如 `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`
之类的命令来创建该托管区域。

<!--
You must then set up your NS records in the parent domain, so that records in the domain will resolve.  Here,
you would create NS records in `example.com` for `dev`.  If it is a root domain name you would configure the NS
records at your domain registrar (e.g. `example.com` would need to be configured where you bought `example.com`).
-->
然后，你必须在父域名中设置你的 DNS 记录，以便该域名中的记录可以被解析。
在这里，你将在 `example.com` 中为 `dev` 创建 DNS 记录。
如果它是根域名，则可以在域名注册机构配置 DNS 记录。
例如，你需要在购买 `example.com` 的地方配置 `example.com`。

<!--
Verify your route53 domain setup (it is the #1 cause of problems!). You can double-check that
your cluster is configured correctly if you have the dig tool by running:
-->
检查你的 route53 域已经被正确设置（这是导致问题的最常见原因！）。
如果你安装了 dig 工具，则可以通过运行以下步骤再次检查集群是否配置正确：

```shell
dig DNS dev.example.com
```

<!--
You should see the 4 NS records that Route53 assigned your hosted zone.
-->
你应该看到 Route53 分配了你的托管区域的 4 条 DNS 记录。

<!--
### (3/5) Create an S3 bucket to store your clusters state

kops lets you manage your clusters even after installation.  To do this, it must keep track of the clusters
that you have created, along with their configuration, the keys they are using etc.  This information is stored
in an S3 bucket.  S3 permissions are used to control access to the bucket.
-->
### (3/5) 创建一个 S3 存储桶来存储集群状态

kops 使你即使在安装后也可以管理集群。为此，它必须跟踪已创建的集群及其配置、所使用的密钥等。
此信息存储在 S3 存储桶中。S3 权限用于控制对存储桶的访问。

<!--
Multiple clusters can use the same S3 bucket, and you can share an S3 bucket between your colleagues that
administer the same clusters - this is much easier than passing around kubecfg files.  But anyone with access
to the S3 bucket will have administrative access to all your clusters, so you don't want to share it beyond
the operations team.
-->
多个集群可以使用同一 S3 存储桶，并且你可以在管理同一集群的同事之间共享一个
S3 存储桶 - 这比传递 kubecfg 文件容易得多。
但是有权访问 S3 存储桶的任何人都将拥有对所有集群的管理访问权限，
因此你不想在运营团队之外共享它。

<!--
So typically you have one S3 bucket for each ops team (and often the name will correspond
to the name of the hosted zone above!)
-->
因此，通常每个运维团队都有一个 S3 存储桶（而且名称通常对应于上面托管区域的名称！）

<!--
In our example, we chose `dev.example.com` as our hosted zone, so let's pick `clusters.dev.example.com` as
the S3 bucket name.
-->
在我们的示例中，我们选择 `dev.example.com` 作为托管区域，因此我们选择
`clusters.dev.example.com` 作为 S3 存储桶名称。

<!--
* Export `AWS_PROFILE` (if you need to select a profile for the AWS CLI to work)
* Create the S3 bucket using `aws s3 mb s3://clusters.dev.example.com`
* You can `export KOPS_STATE_STORE=s3://clusters.dev.example.com` and then kops will use this location by default.
   We suggest putting this in your bash profile or similar.
-->
* 导出 `AWS_PROFILE` 文件（如果你需要选择一个配置文件用来使 AWS CLI 正常工作）
* 使用 `aws s3 mb s3://clusters.dev.example.com` 创建 S3 存储桶
* 你可以进行 `export KOPS_STATE_STORE=s3://clusters.dev.example.com` 操作，
  然后 kops 将默认使用此位置。
  我们建议将其放入你的 bash profile 文件或类似文件中。

<!--
### (4/5) Build your cluster configuration

Run `kops create cluster` to create your cluster configuration:
-->
### (4/5) 建立你的集群配置

运行 `kops create cluster` 以创建你的集群配置：

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

<!--
kops will create the configuration for your cluster.  Note that it _only_ creates the configuration, it does
not actually create the cloud resources - you'll do that in the next step with a `kops update cluster`.  This
give you an opportunity to review the configuration or change it.
-->
kops 将为你的集群创建配置。请注意，它_仅_创建配置，实际上并没有创建云资源 - 
你将在下一步中使用 `kops update cluster` 进行配置。
这使你有机会查看配置或进行更改。

<!--
It prints commands you can use to explore further:
-->
它打印出可用于进一步探索的命令：

<!--
* List your clusters with: `kops get cluster`
* Edit this cluster with: `kops edit cluster useast1.dev.example.com`
* Edit your node instance group: `kops edit ig --name=useast1.dev.example.com nodes`
* Edit your master instance group: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`
-->
* 使用以下命令列出集群：`kops get cluster`
* 使用以下命令编辑该集群：`kops edit cluster useast1.dev.example.com`
* 使用以下命令编辑你的节点实例组：`kops edit ig --name = useast1.dev.example.com nodes`
* 使用以下命令编辑你的主实例组：`kops edit ig --name = useast1.dev.example.com master-us-east-1c`

<!--
If this is your first time using kops, do spend a few minutes to try those out!  An instance group is a
set of instances, which will be registered as kubernetes nodes.  On AWS this is implemented via auto-scaling-groups.
You can have several instance groups, for example if you wanted nodes that are a mix of spot and on-demand instances, or
GPU and non-GPU instances.
-->
如果这是你第一次使用 kops，请花几分钟尝试一下！ 实例组是一组实例，将被注册为 kubernetes 节点。
在 AWS 上，这是通过 auto-scaling-groups 实现的。你可以有多个实例组。
例如，如果你想要的是混合实例和按需实例的节点，或者 GPU 和非 GPU 实例。

<!--
### (5/5) Create the cluster in AWS

Run "kops update cluster" to create your cluster in AWS:
-->
### (5/5) 在 AWS 中创建集群

运行 "kops update cluster" 以在 AWS 中创建集群：

```shell
kops update cluster useast1.dev.example.com --yes
```

<!--
That takes a few seconds to run, but then your cluster will likely take a few minutes to actually be ready.
`kops update cluster` will be the tool you'll use whenever you change the configuration of your cluster; it
applies the changes you have made to the configuration to your cluster - reconfiguring AWS or kubernetes as needed.
-->
这需要几秒钟的时间才能运行，但实际上集群可能需要几分钟才能准备就绪。
每当更改集群配置时，都会使用 `kops update cluster` 工具。
它将对配置进行的更改应用于你的集群 - 根据需要重新配置 AWS 或者 kubernetes。

<!--
For example, after you `kops edit ig nodes`, then `kops update cluster --yes` to apply your configuration, and
sometimes you will also have to `kops rolling-update cluster` to roll out the configuration immediately.
-->
例如，在你运行 `kops edit ig nodes` 之后，然后运行 `kops update cluster --yes`
应用你的配置，有时你还必须运行 `kops rolling-update cluster` 立即回滚更新配置。

<!--
Without `--yes`, `kops update cluster` will show you a preview of what it is going to do.  This is handy
for production clusters!
-->
如果没有 `--yes` 参数，`kops update cluster` 操作将向你显示其操作的预览效果。这对于生产集群很方便！

<!--
### Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp; control of your Kubernetes cluster.
-->
### 探索其他附加组件

请参阅[附加组件列表](/zh/docs/concepts/cluster-administration/addons/)探索其他附加组件，
包括用于 Kubernetes 集群的日志记录、监视、网络策略、可视化和控制的工具。

<!--
## Cleanup

* To delete your cluster: `kops delete cluster useast1.dev.example.com --yes`
-->
## 清理

* 删除集群：`kops delete cluster useast1.dev.example.com --yes`

## {{% heading "whatsnext" %}}

<!--
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/user-guide/kubectl-overview/).
* Learn about `kops` [advanced usage](https://github.com/kubernetes/kops)
* See the `kops` [docs](https://github.com/kubernetes/kops) section for tutorials, best practices and advanced configuration options.
-->
* 了解有关 Kubernetes 的[概念](/zh/docs/concepts/) 和
  [`kubectl`](/zh/docs/reference/kubectl/overview/) 有关的更多信息。
* 了解 `kops` [高级用法](https://github.com/kubernetes/kops)。
* 请参阅 `kops` [文档](https://github.com/kubernetes/kops) 获取教程、
  最佳做法和高级配置选项。

