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

コンピューターのBIOS上でVT-xもしくはAMD-vの仮想化が使用可能でなければなりません。Linux上で確認するために以下のコマンドを実行し、出力されることを確認してください。
```shell
egrep --color 'vmx|svm' /proc/cpuinfo
```

{{% /capture %}}

{{% capture steps %}}

## ハイパーバイザーのインストール

ハイパーバイザーがインストールされていなかったら、OSにいずれかをインストールしてください。

Operating system | サポートしているハイパーバイザー
:----------------|:---------------------
macOS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
Linux | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
Windows | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
MinikubeはVMの中ではなくホスト上のKubernetesのコンポーネントの一部として実行する`--vm-driver=none`をサポートしています。このドライバーはハイパーバイザーではなく、DockerやLinuxの環境を必要とします。
{{< /note >}}

## kubectlのインストール

* kubectlのインストールは[kubectlのインストールと設定](/ja/docs/tasks/tools/install-kubectl/)を確認してください。

## Minikubeのインストール

### macOS

[Homebrew](https://brew.sh)を使うことでmacOSにMinikubeを簡単にインストールできます。

```shell
brew cask install minikube
```

バイナリファイルを使用してmacOSにインストールすることも可能です。

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

以下のコマンドを入力して、Minikubeを実行可能にしてください。

```shell
sudo mv minikube /usr/local/bin
```

### Linux

{{< note >}}
ここではバイナリを使ってLinux上にMinikubeをインストールする方法を示します。
{{< /note >}}

バイナリファイルを使用してLinuxにインストールできます。

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

以下のコマンドを入力して、Minikubeを実行可能にしてください。

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### Windows

{{< note >}}
MinikubeをWindowsで実行するために、[Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)もしくは[VirtualBox](https://www.virtualbox.org/)をインストールする必要があります。Hyper-VはWindows 10 Enterprise、Windows 10 Professional、Windows 10 Educationで実行できます。より詳しいインストールについてのドキュメントはMinikube公式の[GitHub](https://github.com/kubernetes/minikube/#installation)のリポジトリを参照してください。
{{< /note >}}

[Chocolatey](https://chocolatey.org/)を使うことでWindowsにMinikubeを簡単にインストールできます(管理者権限で実行する必要があります)。

```shell
choco install minikube kubernetes-cli
```

Minikubeのインストールが終わったら、現在のCLIのセッションを終了して再起動します。Minikubeは自動的にパスに追加されます。

#### 手動でWindowsにインストールする方法

Windowsに手動でMinikubeをダウンロードする場合、[`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest)をダウンロードし、名前を`minikube.exe`に変更してこれをパスに加えます。

#### Windowsのインストーラー

[Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal)を使ってWindowsに手動でインストールする場合、[`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest)をインストールし、インストーラーを実行します。

{{% /capture %}}

{{% capture whatsnext %}}

* [Minikubeを使ってローカルでKubernetesを実行する](/ja/docs/setup/minikube/)

{{% /capture %}}

## クリーンアップし、新たに始める場合

もし以前に　Minikubeをインストールしていたら、以下のコマンドを実行します。
```shell
minikube start
```

このエラーが返ってきます。
```shell
machine does not exist
```

以下のファイルを消去する必要があります。
```shell
rm -rf ~/.minikube
```