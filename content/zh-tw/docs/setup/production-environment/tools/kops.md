---
title: 使用 Kops 安裝 Kubernetes
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
本篇快速入門介紹瞭如何在 AWS 上輕鬆安裝 Kubernetes 叢集。
本篇使用了一個名為 [`kops`](https://github.com/kubernetes/kops) 的工具。

<!--
kops is an automated provisioning system:
-->
kops 是一個自動化的製備系統：

<!--
* Fully automated installation
* Uses DNS to identify clusters
* Self-healing: everything runs in Auto-Scaling Groups
* Multiple OS support (Debian, Ubuntu 16.04 supported, CentOS & RHEL, Amazon Linux and CoreOS) - see the [images.md](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md)
* High-Availability support - see the [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md)
* Can directly provision, or generate terraform manifests - see the [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)
-->
* 全自動安裝流程
* 使用 DNS 識別叢集
* 自我修復：一切都在自動擴縮組中執行
* 支援多種作業系統（如 Debian、Ubuntu 16.04、CentOS、RHEL、Amazon Linux 和 CoreOS） - 參考 [images.md](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md)
* 支援高可用 - 參考 [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md)
* 可以直接提供或者生成 terraform 清單 - 參考 [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)

## {{% heading "prerequisites" %}}

<!--
* You must have [kubectl](/docs/tasks/tools/) installed.

* You must [install](https://github.com/kubernetes/kops#installing) `kops` on a 64-bit (AMD64 and Intel 64) device architecture.

* You must have an [AWS account](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html), generate [IAM keys](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) and [configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration) them. The IAM user will need [adequate permissions](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user).
-->
* 你必須安裝 [kubectl](/zh-cn/docs/tasks/tools/)。 
* 你必須安裝[安裝](https://github.com/kubernetes/kops#installing) `kops`
  到 64 位的（AMD64 和 Intel 64）裝置架構上。
* 你必須擁有一個 [AWS 賬戶](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html)，
  生成 [IAM 秘鑰](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)
  並[配置](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration)
  該秘鑰。IAM 使用者需要[足夠的許可權許可](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user)。

<!-- steps -->

<!--
## Creating a cluster

### (1/5) Install kops

#### Installation

Download kops from the [releases page](https://github.com/kubernetes/kops/releases) (it is also convenient to build from source):
-->
## 建立叢集

### (1/5) 安裝 kops

#### 安裝

從[下載頁面](https://github.com/kubernetes/kops/releases)下載 kops
（從原始碼構建也很方便）：

{{< tabs name="kops_installation" >}}
{{% tab name="macOS" %}}

<!--
Download the latest release with the command:
-->
使用下面的命令下載最新發布版本：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-darwin-amd64
```

<!--
To download a specific version, replace the following portion of the command with the specific kops version.
-->
要下載特定版本，使用特定的 kops 版本替換下面命令中的部分：

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

<!--
For example, to download kops version v1.20.0 type:
-->
例如，要下載 kops v1.20.0，輸入：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-darwin-amd64
```

<!--
Make the kops binary executable.
-->
令 kops 二進位制檔案可執行：

```shell
chmod +x kops-darwin-amd64
```

<!--
Move the kops binary in to your PATH.
-->
將 kops 二進位制檔案移到你的 PATH 下：

```shell
sudo mv kops-darwin-amd64 /usr/local/bin/kops
```

你也可以使用 [Homebrew](https://brew.sh/) 安裝 kops：

```shell
brew update && brew install kops
```
{{% /tab %}}
{{% tab name="Linux" %}}

<!--
Download the latest release with the command:
-->
使用命令下載最新發布版本：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
```

<!--
To download a specific version of kops, replace the following portion of the command with the specific kops version.
-->
要下載 kops 的特定版本，用特定的 kops 版本替換下面命令中的部分：

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

<!--
For example, to download kops version v1.20.0 type:
-->
例如，要下載 kops v1.20 版本，輸入：

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-linux-amd64
```

<!--
Make the kops binary executable
-->
令 kops 二進位制檔案可執行：

```shell
chmod +x kops-linux-amd64
```

<!--
Move the kops binary in to your PATH.
-->
將 kops 二進位制檔案移到 PATH 下：


```shell
sudo mv kops-linux-amd64 /usr/local/bin/kops
```

你也可以使用 [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)
來安裝 kops：

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
### (2/5) 為你的叢集建立一個 route53 域名

kops 在叢集內部和外部都使用 DNS 進行發現操作，這樣你可以從客戶端訪問
kubernetes API 伺服器。

<!--
kops has a strong opinion on the cluster name: it should be a valid DNS name.  By doing so you will
no longer get your clusters confused, you can share clusters with your colleagues unambiguously,
and you can reach them without relying on remembering an IP address.
-->
kops 對叢集名稱有明顯的要求：它應該是有效的 DNS 名稱。這樣一來，你就不會再使叢集混亂，
可以與同事明確共享叢集，並且無需依賴記住 IP 地址即可訪問叢集。

<!--
You can, and probably should, use subdomains to divide your clusters.  As our example we will use
`useast1.dev.example.com`.  The API server endpoint will then be `api.useast1.dev.example.com`.
-->
你可以，或許應該使用子域名來劃分叢集。作為示例，我們將使用域名 `useast1.dev.example.com`。
這樣，API 伺服器端點域名將為 `api.useast1.dev.example.com`。

<!--
A Route53 hosted zone can serve subdomains.  Your hosted zone could be `useast1.dev.example.com`,
but also `dev.example.com` or even `example.com`.  kops works with any of these, so typically
you choose for organization reasons (e.g. you are allowed to create records under `dev.example.com`,
but not under `example.com`).
-->
Route53 託管區域可以服務子域名。你的託管區域可能是 `useast1.dev.example.com`，還有 `dev.example.com` 甚至 `example.com`。
kops 可以與以上任何一種配合使用，因此通常你出於組織原因選擇不同的託管區域。
例如，允許你在 `dev.example.com` 下建立記錄，但不能在 `example.com` 下建立記錄。

<!--
Let's assume you're using `dev.example.com` as your hosted zone.  You create that hosted zone using
the [normal process](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html), or
with a command such as `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`.
-->
假設你使用 `dev.example.com` 作為託管區域。你可以使用
[正常流程](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html)
或者使用諸如 `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`
之類的命令來建立該託管區域。

<!--
You must then set up your NS records in the parent domain, so that records in the domain will resolve.  Here,
you would create NS records in `example.com` for `dev`.  If it is a root domain name you would configure the NS
records at your domain registrar (e.g. `example.com` would need to be configured where you bought `example.com`).
-->
然後，你必須在父域名中設定你的 DNS 記錄，以便該域名中的記錄可以被解析。
在這裡，你將在 `example.com` 中為 `dev` 建立 DNS 記錄。
如果它是根域名，則可以在域名註冊機構配置 DNS 記錄。
例如，你需要在購買 `example.com` 的地方配置 `example.com`。

<!--
Verify your route53 domain setup (it is the #1 cause of problems!). You can double-check that
your cluster is configured correctly if you have the dig tool by running:
-->
檢查你的 route53 域已經被正確設定（這是導致問題的最常見原因！）。
如果你安裝了 dig 工具，則可以透過執行以下步驟再次檢查叢集是否配置正確：

```shell
dig DNS dev.example.com
```

<!--
You should see the 4 NS records that Route53 assigned your hosted zone.
-->
你應該看到 Route53 分配了你的託管區域的 4 條 DNS 記錄。

<!--
### (3/5) Create an S3 bucket to store your clusters state

kops lets you manage your clusters even after installation.  To do this, it must keep track of the clusters
that you have created, along with their configuration, the keys they are using etc.  This information is stored
in an S3 bucket.  S3 permissions are used to control access to the bucket.
-->
### (3/5) 建立一個 S3 儲存桶來儲存叢集狀態

kops 使你即使在安裝後也可以管理叢集。為此，它必須跟蹤已建立的叢集及其配置、所使用的金鑰等。
此資訊儲存在 S3 儲存桶中。S3 許可權用於控制對儲存桶的訪問。

<!--
Multiple clusters can use the same S3 bucket, and you can share an S3 bucket between your colleagues that
administer the same clusters - this is much easier than passing around kubecfg files.  But anyone with access
to the S3 bucket will have administrative access to all your clusters, so you don't want to share it beyond
the operations team.
-->
多個叢集可以使用同一 S3 儲存桶，並且你可以在管理同一叢集的同事之間共享一個
S3 儲存桶 - 這比傳遞 kubecfg 檔案容易得多。
但是有權訪問 S3 儲存桶的任何人都將擁有對所有叢集的管理訪問許可權，
因此你不想在運營團隊之外共享它。

<!--
So typically you have one S3 bucket for each ops team (and often the name will correspond
to the name of the hosted zone above!)
-->
因此，通常每個運維團隊都有一個 S3 儲存桶（而且名稱通常對應於上面託管區域的名稱！）

<!--
In our example, we chose `dev.example.com` as our hosted zone, so let's pick `clusters.dev.example.com` as
the S3 bucket name.
-->
在我們的示例中，我們選擇 `dev.example.com` 作為託管區域，因此我們選擇
`clusters.dev.example.com` 作為 S3 儲存桶名稱。

<!--
* Export `AWS_PROFILE` (if you need to select a profile for the AWS CLI to work)
* Create the S3 bucket using `aws s3 mb s3://clusters.dev.example.com`
* You can `export KOPS_STATE_STORE=s3://clusters.dev.example.com` and then kops will use this location by default.
   We suggest putting this in your bash profile or similar.
-->
* 匯出 `AWS_PROFILE` 檔案（如果你需要選擇一個配置檔案用來使 AWS CLI 正常工作）
* 使用 `aws s3 mb s3://clusters.dev.example.com` 建立 S3 儲存桶
* 你可以進行 `export KOPS_STATE_STORE=s3://clusters.dev.example.com` 操作，
  然後 kops 將預設使用此位置。
  我們建議將其放入你的 bash profile 檔案或類似檔案中。

<!--
### (4/5) Build your cluster configuration

Run `kops create cluster` to create your cluster configuration:
-->
### (4/5) 建立你的叢集配置

執行 `kops create cluster` 以建立你的叢集配置：

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

<!--
kops will create the configuration for your cluster.  Note that it _only_ creates the configuration, it does
not actually create the cloud resources - you'll do that in the next step with a `kops update cluster`.  This
give you an opportunity to review the configuration or change it.
-->
kops 將為你的叢集建立配置。請注意，它_僅_建立配置，實際上並沒有建立雲資源 - 
你將在下一步中使用 `kops update cluster` 進行配置。
這使你有機會檢視配置或進行更改。

<!--
It prints commands you can use to explore further:
-->
它打印出可用於進一步探索的命令：

<!--
* List your clusters with: `kops get cluster`
* Edit this cluster with: `kops edit cluster useast1.dev.example.com`
* Edit your node instance group: `kops edit ig --name=useast1.dev.example.com nodes`
* Edit your master instance group: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`
-->
* 使用以下命令列出叢集：`kops get cluster`
* 使用以下命令編輯該叢集：`kops edit cluster useast1.dev.example.com`
* 使用以下命令編輯你的節點例項組：`kops edit ig --name = useast1.dev.example.com nodes`
* 使用以下命令編輯你的主例項組：`kops edit ig --name = useast1.dev.example.com master-us-east-1c`

<!--
If this is your first time using kops, do spend a few minutes to try those out!  An instance group is a
set of instances, which will be registered as kubernetes nodes.  On AWS this is implemented via auto-scaling-groups.
You can have several instance groups, for example if you wanted nodes that are a mix of spot and on-demand instances, or
GPU and non-GPU instances.
-->
如果這是你第一次使用 kops，請花幾分鐘嘗試一下！ 例項組是一組例項，將被註冊為 kubernetes 節點。
在 AWS 上，這是透過 auto-scaling-groups 實現的。你可以有多個例項組。
例如，如果你想要的是混合例項和按需例項的節點，或者 GPU 和非 GPU 例項。

<!--
### (5/5) Create the cluster in AWS

Run "kops update cluster" to create your cluster in AWS:
-->
### (5/5) 在 AWS 中建立叢集

執行 "kops update cluster" 以在 AWS 中建立叢集：

```shell
kops update cluster useast1.dev.example.com --yes
```

<!--
That takes a few seconds to run, but then your cluster will likely take a few minutes to actually be ready.
`kops update cluster` will be the tool you'll use whenever you change the configuration of your cluster; it
applies the changes you have made to the configuration to your cluster - reconfiguring AWS or kubernetes as needed.
-->
這需要幾秒鐘的時間才能執行，但實際上叢集可能需要幾分鐘才能準備就緒。
每當更改叢集配置時，都會使用 `kops update cluster` 工具。
它將對配置進行的更改應用於你的叢集 - 根據需要重新配置 AWS 或者 kubernetes。

<!--
For example, after you `kops edit ig nodes`, then `kops update cluster --yes` to apply your configuration, and
sometimes you will also have to `kops rolling-update cluster` to roll out the configuration immediately.
-->
例如，在你執行 `kops edit ig nodes` 之後，然後執行 `kops update cluster --yes`
應用你的配置，有時你還必須執行 `kops rolling-update cluster` 立即回滾更新配置。

<!--
Without `--yes`, `kops update cluster` will show you a preview of what it is going to do.  This is handy
for production clusters!
-->
如果沒有 `--yes` 引數，`kops update cluster` 操作將向你顯示其操作的預覽效果。這對於生產叢集很方便！

<!--
### Explore other add-ons

See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp; control of your Kubernetes cluster.
-->
### 探索其他附加元件

請參閱[附加元件列表](/zh-cn/docs/concepts/cluster-administration/addons/)探索其他附加元件，
包括用於 Kubernetes 叢集的日誌記錄、監視、網路策略、視覺化和控制的工具。

<!--
## Cleanup

* To delete your cluster: `kops delete cluster useast1.dev.example.com --yes`
-->
## 清理

* 刪除叢集：`kops delete cluster useast1.dev.example.com --yes`

## {{% heading "whatsnext" %}}

<!--
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/).
* Learn about `kops` [advanced usage](https://github.com/kubernetes/kops)
* See the `kops` [docs](https://github.com/kubernetes/kops) section for tutorials, best practices and advanced configuration options.
-->
* 瞭解有關 Kubernetes 的[概念](/zh-cn/docs/concepts/) 和
  [`kubectl`](/zh-cn/docs/reference/kubectl/) 有關的更多資訊。
* 瞭解 `kops` [高階用法](https://github.com/kubernetes/kops)。
* 請參閱 `kops` [文件](https://github.com/kubernetes/kops) 獲取教程、
  最佳做法和高階配置選項。

