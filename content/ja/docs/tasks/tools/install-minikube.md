---
title: Minikubeのインストール
content_type: task
weight: 20
card:
  name: tasks
  weight: 10
---

<!-- overview -->

このページでは[Minikube](/ja/docs/tutorials/hello-minikube)のインストール方法を説明し、コンピューターの仮想マシン上で単一ノードのKubernetesクラスターを実行します。



## {{% heading "prerequisites" %}}


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
出力に`VMX`が表示されている場合(色付けされているはずです)、VT-x機能がマシンで有効になっています。
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



<!-- steps -->

## minikubeのインストール

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### kubectlのインストール

kubectlがインストールされていることを確認してください。
[kubectlのインストールとセットアップ](/ja/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)の指示に従ってkubectlをインストールできます。

### ハイパーバイザーのインストール

ハイパーバイザーがまだインストールされていない場合は、これらのいずれかをインストールしてください:

• [KVM](https://www.linux-kvm.org/)、ただしQEMUも使っているもの

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

Minikubeは、VMではなくホストでKubernetesコンポーネントを実行する`--driver=none`オプションもサポートしています。
このドライバーを使用するには、[Docker](https://www.docker.com/products/docker-desktop)とLinux環境が必要ですが、ハイパーバイザーは不要です。

Debian系のLinuxで`none`ドライバーを使用する場合は、snapパッケージではなく`.deb`パッケージを使用してDockerをインストールしてください。snapパッケージはMinikubeでは機能しません。
[Docker](https://www.docker.com/products/docker-desktop)から`.deb`パッケージをダウンロードできます。

{{< caution >}}
`none` VMドライバーは、セキュリティとデータ損失の問題を引き起こす可能性があります。
`--driver=none`を使用する前に、詳細について[このドキュメント](https://minikube.sigs.k8s.io/docs/reference/drivers/none/) を参照してください。
{{< /caution >}}

MinikubeはDockerドライバーと似たような`vm-driver=podman`もサポートしています。Podmanを特権ユーザー権限(root user)で実行することは、コンテナがシステム上の利用可能な機能へ完全にアクセスするための最もよい方法です。

{{< caution >}}
`podman` ドライバーは、rootでコンテナを実行する必要があります。これは、通常のユーザーアカウントが、コンテナの実行に必要とされるすべてのOS機能への完全なアクセスを持っていないためです。
{{< /caution >}}

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

### Homebrewを利用したMinikubeのインストール

別の選択肢として、Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux)を利用してインストールできます。

```shell
brew install minikube
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



## インストールの確認

ハイパーバイザーとMinikube両方のインストール成功を確認するため、以下のコマンドをローカルKubernetesクラスターを起動するために実行してください:

{{< note >}}

`minikube start`で`--driver`の設定をするため、次の`<driver_name>`の部分では、インストールしたハイパーバイザーの名前を小文字で入力してください。サポートされているドライバーとプラグインのインストールの詳細についてはDRIVERSを参照してください。[DRIVERS](https://minikube.sigs.k8s.io/docs/drivers/)

{{< /note >}}

{{< caution >}}
KVMを使用する場合、Debianおよび他の一部のシステムでのlibvirtのデフォルトのQEMU URIは`qemu:///session`であるのに対し、MinikubeのデフォルトのQEMU URIは`qemu:///system`であることに注意してください。これがあなたのシステムに当てはまる場合、`--kvm-qemu-uri qemu:///session`を`minikube start`に渡す必要があります。
{{< /caution >}}

```shell
minikube start --driver=<driver_name>
```

`minikube start`が完了した場合、次のコマンドを実行してクラスターの状態を確認します。

```shell
minikube status
```

クラスターが起動していると、`minikube status`の出力はこのようになります。

```
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

選択したハイパーバイザーでMinikubeが動作しているか確認した後は、そのままMinikubeを使い続けることもできます。また、クラスターを停止することもできます。クラスターを停止するためには、次を実行してください。

```shell
minikube stop
```

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


## {{% heading "whatsnext" %}}


* [Minikubeを使ってローカルでKubernetesを実行する](/ja/docs/setup/learning-environment/minikube/)

