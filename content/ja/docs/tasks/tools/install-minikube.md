---
title: Minikubeのインストール
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

このページでは[Minikube](/ja/docs/tutorials/hello-minikube)のインストール方法を説明し、コンピューターの仮想マシン上で単一ノードのKubernetesクラスターを実行します。

{{% /capture %}}

{{% capture prerequisites %}}

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
Linuxで仮想化がサポートされているかどうかを確認するには、次のコマンドを実行して、出力が空でないことを確認します:
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
仮想化がmacOSでサポートされているかどうかを確認するには、ターミナルで次のコマンドを実行します。
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```
出力に`VMX`が表示されている場合（色付けされているはずです）、VT-x機能がマシンで有効になっています。
{{% /tab %}}

{{% tab name="Windows" %}}
Windows 8以降で仮想化がサポートされているかどうかを確認するには、Windowsターミナルまたはコマンドプロンプトで次のコマンドを実行します。
```
systeminfo
```
次の出力が表示される場合、仮想化はWindowsでサポートされています。
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

次の出力が表示される場合、システムにはすでにHypervisorがインストールされており、次の手順をスキップできます。
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture steps %}}

# minikubeのインストール

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### kubectlのインストール

kubectlがインストールされていることを確認してください。
[kubectlのインストールとセットアップ](/ja/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)の指示に従ってkubectlをインストールできます。

### ハイパーバイザーのインストール

ハイパーバイザーがまだインストールされていない場合は、これらのいずれかをインストールしてください:

• [KVM](https://www.linux-kvm.org/)、ただしQEMUも使っているもの

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
minikubeは、VMではなくホストでKubernetesコンポーネントを実行する`--vm-driver=none`オプションもサポートしています。
このドライバーを使用するには、[Docker](https://www.docker.com/products/docker-desktop)とLinux環境が必要ですが、ハイパーバイザーは不要です。
noneドライバーを使用する場合は、[Docker](https://www.docker.com/products/docker-desktop)からdockerのaptインストールを使用することをおすすめします。
dockerのsnapインストールは、minikubeでは機能しません。
{{< /note >}}

### パッケージを利用したMinikubeのインストール

Minikubeの*Experimental*パッケージが利用可能です。
GitHubのMinikubeの[リリース](https://github.com/kubernetes/minikube/releases)ページからLinux(AMD64)パッケージを見つけることができます。

Linuxのディストリビューションのパッケージツールを使用して、適切なパッケージをインストールしてください。

### 直接ダウンロードによるMinikubeのインストール

パッケージ経由でインストールしない場合は、スタンドアロンバイナリをダウンロードして使用できます。

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Minikube実行可能バイナリをパスに追加する簡単な方法を次に示します:

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

{{% /tab %}}
{{% tab name="macOS" %}}
### kubectlのインストール

kubectlがインストールされていることを確認してください。
[kubectlのインストールとセットアップ](/ja/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos)の指示に従ってkubectlをインストールできます。

### ハイパーバイザーのインストール

ハイパーバイザーがまだインストールされていない場合は、これらのいずれかをインストールしてください:

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Minikubeのインストール
[Homebrew](https://brew.sh)を使うことでmacOSにMinikubeを簡単にインストールできます:

```shell
brew install minikube
```

スタンドアロンのバイナリをダウンロードして、macOSにインストールすることもできます:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Minikube実行可能バイナリをパスに追加する簡単な方法を次に示します:

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### kubectlのインストール

kubectlがインストールされていることを確認してください。
[kubectlのインストールとセットアップ](/ja/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)の指示に従ってkubectlをインストールできます。

### ハイパーバイザーのインストール

ハイパーバイザーがまだインストールされていない場合は、これらのいずれかをインストールしてください:

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-Vは、Windows 10 Enterprise、Windows 10 Professional、Windows 10 Educationの3つのバージョンのWindows 10で実行できます。
{{< /note >}}

### Chocolateyを使用したMinikubeのインストール

[Chocolatey](https://chocolatey.org/)を使うことでWindowsにMinikubeを簡単にインストールできます(管理者権限で実行する必要があります)。

```shell
choco install minikube
```

Minikubeのインストールが終わったら、現在のCLIのセッションを終了して再起動します。Minikubeは自動的にパスに追加されます。

### インストーラーを使用したMinikubeのインストール

[Windowsインストーラー](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal)を使用してWindowsにMinikubeを手動でインストールするには、[`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe)をダウンロードしてインストーラーを実行します。

### 直接ダウンロードによるMinikubeのインストール

WindowsにMinikubeを手動でインストールするには、[`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest)をダウンロードし、名前を`minikube.exe`に変更して、パスに追加します。

{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [Minikubeを使ってローカルでKubernetesを実行する](/ja/docs/setup/learning-environment/minikube/)

{{% /capture %}}

## ローカル状態のクリーンアップ {#cleanup-local-state}

もし以前に　Minikubeをインストールしていたら、以下のコマンドを実行します。
```shell
minikube start
```

`minikube start`はエラーを返します。
```shell
machine does not exist
```

minikubeのローカル状態をクリアする必要があります:
```shell
minikube delete
```
