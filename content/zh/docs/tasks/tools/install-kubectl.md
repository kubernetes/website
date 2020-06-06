---
reviewers:
- mikedanese
title: 安装并设置 kubectl
content_template: templates/task
weight: 10
---
<!--
---
reviewers:
- bgrant0607
- mikedanese
title: Install and Set Up kubectl
content_template: templates/task
weight: 10
---
-->
{{% capture overview %}}
<!--
 Use the Kubernetes command-line tool, [kubectl](/docs/user-guide/kubectl/), to deploy and manage applications on Kubernetes. Using kubectl, you can inspect cluster resources; create, delete, and update components; look at your new cluster; and bring up example apps.
 -->
 在 Kubernetes 上使用 Kubernetes 命令行工具 [kubectl](/docs/user-guide/kubectl/) 部署和管理应用程序。使用 kubectl，您可以检查集群资源；创建、删除和更新组件；查看您的新集群；并启动实例应用程序。
{{% /capture %}}

{{% capture prerequisites %}}
<!--
You must use a kubectl version that is within one minor version difference of your cluster. For example, a v1.2 client should work with v1.1, v1.2, and v1.3 master. Using the latest version of kubectl helps avoid unforeseen issues.
-->
您必须使用与集群小版本号差别为一的 kubectl 版本。例如，1.2版本的客户端应该与1.1版本、1.2版本和1.3版本的主节点一起使用。使用最新版本的 kubectl 有助于避免无法预料的问题。
{{% /capture %}}


{{% capture steps %}}

<!--
## Install kubectl

Here are a few methods to install kubectl.
-->
## 安装 kubectl

以下是一些安装 kubectl 的方法。

<!--
## Install kubectl binary using native package management

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}
-->
## 使用本地软件包管理软件安装 kubectl 二进制文件

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}


<!--
## Install with snap on Ubuntu

If you are on Ubuntu or one of other Linux distributions that support [snap](https://snapcraft.io/docs/core/install) package manager, kubectl is available as a [snap](https://snapcraft.io/) application.

1. Switch to the snap user and run the installation command:

    ```
    sudo snap install kubectl --classic
    ```

2. Test to ensure the version you installed is sufficiently up-to-date:

    ```
    kubectl version
    ```
-->
## 在 Ubuntu 上使用 snap 安装 kubectl

如果您使用的是 Ubuntu 或其他支持 [snap](https://snapcraft.io/docs/core/install) 软件包管理器的Linux发行版，kubectl 可以作为一个 [snap](https://snapcraft.io/) 应用程序使用。

1. 切换到 snap 用户并运行安装命令：

    ```
    sudo snap install kubectl --classic
    ```

2. 测试以确保您安装的版本是最新的：

    ```
    kubectl version
    ```

<!--
## Install with Homebrew on macOS

If you are on macOS and using [Homebrew](https://brew.sh/) package manager, you can install kubectl with Homebrew.

1. Run the installation command:

    ```
    brew install kubernetes-cli
    ```

2. Test to ensure the version you installed is sufficiently up-to-date:

    ```
    kubectl version
    ```
-->
## <span id = "jump"> 在 macOS 上用 Homebrew 安装 kubectl </span>

如果您使用的是 macOS 系统并使用 [Homebrew](https://brew.sh/) 包管理器，您可以通过 Homebrew 安装 kubectl。

1. 运行安装命令：
   
    ```
    brew install kubernetes-cli
    ```

2. 测试以确保您安装的版本是最新的：
   
    ```
    kubectl version
    ```
    

<!--
## Install with Macports on macOS

If you are on macOS and using [Macports](https://macports.org/) package manager, you can install kubectl with Macports.

1. Run the installation command:

    ```
    port install kubectl
    ```

2. Test to ensure the version you installed is sufficiently up-to-date:

    ```
    kubectl version
    ```
-->

## 在 macOS 上用 Macports 安装 kubectl

如果您使用的是 macOS 系统并使用 [Macports](https://macports.org/) 包管理器，您可以通过 Macports 安装 kubectl。

1. 运行安装命令：
   
    ```
    port install kubectl
    ```

2. 测试以确保您安装的版本是最新的：

     ```
    kubectl version
    ```

<!--
## Install with Powershell from PSGallery

If you are on Windows and using [Powershell Gallery](https://www.powershellgallery.com/) package manager, you can install and update kubectl with Powershell.

1. Run the installation commands (making sure to specify a `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```

    {{< note >}}
    If you do not specify a `DownloadLocation`, `kubectl` will be installed in the user's temp Directory.
    {{< /note >}}

    The installer creates `$HOME/.kube` and instructs it to create a config file

2. Test to ensure the version you installed is sufficiently up-to-date:

    ```
    kubectl version
    ```

    {{< note >}}
    Updating the installation is performed by rerunning the two commands listed in step 1.
    {{< /note >}}
-->
## 从 PSGallery 通过 Powershell 安装 kubectl

如果您使用的是 Windows 系统并使用 [Powershell Gallery](https://www.powershellgallery.com/) 软件包管理器，您可以使用 Powershell 安装和更新 kubectl。

1. 运行安装命令（确保指定 `DownloadLocation`）：

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```

    {{< note >}}
    如果你没有指定 `DownloadLocation`，那么 `kubectl` 将安装在用户的临时目录中。
    {{< /note >}}

    安装程序创建 `$ HOME/.kube` 并指示它创建配置文件

2. 测试以确保您安装的版本是最新的：
    ```
    kubectl version
    ```

    {{< note >}}
    通过重新运行步骤1中列出的两个命令来执行更新安装。
    {{< /note >}}

<!--
## Install with Chocolatey on Windows

If you are on Windows and using [Chocolatey](https://chocolatey.org) package manager, you can install kubectl with Chocolatey.

1. Run the installation command:

    ```
    choco install kubernetes-cli
    ```

2. Test to ensure the version you installed is sufficiently up-to-date:

    ```
    kubectl version
    ```
3. Change to your %HOME% directory:

    For example: `cd C:\users\yourusername`

4. Create the .kube directory:

    ```
    mkdir .kube
    ```

5. Change to the .kube directory you just created:

    ```
    cd .kube
    ```

6. Configure kubectl to use a remote Kubernetes cluster:

    ```
    New-Item config -type file
    ```

    {{< note >}}
    Edit the config file with a text editor of your choice, such as Notepad.
    {{< /note >}}
-->
## 在 Windows 上用 Chocolatey 安装 kubectl

如果您使用的是 Windows 系统并使用 [Chocolatey](https://chocolatey.org) 包管理器，您可以使用 Chocolatey 安装 kubectl。

1. 运行安装命令：

    ```
    choco install kubernetes-cli
    ```

2. 测试以确保您安装的版本是最新的：

    ```
    kubectl version
    ```
3. 切换到 %HOME% 目录：

    例如：`cd C:\users\yourusername`

4. 创建 .kube 目录：

    ```
    mkdir .kube
    ```

5. 切换到刚刚创建的 .kube 目录：

    ```
    cd .kube
    ```

6. 配置 kubectl 以使用远程 Kubernetes 集群：

    ```
    New-Item config -type file
    ```

    {{< note >}}
    使用您偏爱的编辑器编辑配置文件，例如 Notepad。
    {{< /note >}}

<!--
## Download as part of the Google Cloud SDK

You can install kubectl as part of the Google Cloud SDK.

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Run the `kubectl` installation command:

    ```
    gcloud components install kubectl
    ```

3. Test to ensure the version you installed is sufficiently up-to-date:

    ```
    kubectl version
    ```
-->
## 将 kubectl 作为 Google Cloud SDK 的一部分下载

kubectl 可以作为 Google Cloud SDK 的一部分进行安装。

1. 安装 [Google Cloud SDK](https://cloud.google.com/sdk/).
2. 运行以下命令安装 `kubectl`：

    ```
    gcloud components install kubectl
    ```

3. 测试以确保您安装的版本是最新的：

    ```
    kubectl version
    ```

<!--
## Install kubectl binary using curl

{{< tabs name="kubectl_install_curl" >}}
{{% tab name="macOS" %}}
1. Download the latest release:

    ```		 
    	curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
    ```

    To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.

    For example, to download version {{< param "fullversion" >}} on macOS, type:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

2. Make the kubectl binary executable.

    ```
    chmod +x ./kubectl
    ```

3. Move the binary in to your PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{{% /tab %}}
{{% tab name="Linux" %}}

1. Download the latest release with the command:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    ```

    To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.

    For example, to download version {{< param "fullversion" >}} on Linux, type:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. Make the kubectl binary executable.

    ```
    chmod +x ./kubectl
    ```

3. Move the binary in to your PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{{% /tab %}}
{{% tab name="Windows" %}}
1. Download the latest release {{< param "fullversion" >}} from [this link](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

    Or if you have `curl` installed, use this command:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

    To find out the latest stable version (for example, for scripting), take a look at [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. Add the binary in to your PATH.
{{% /tab %}}
{{< /tabs >}}
-->
## 通过 curl 命令安装 kubectl 可执行文件

{{< tabs name="kubectl_install_curl" >}}
{{% tab name="macOS" %}}
1. 通过以下命令下载 kubectl 的最新版本：

    ```		 
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl
    ```

    若需要下载特定版本的 kubectl，请将上述命令中的 `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` 部分替换成为需要下载的 kubectl 的具体版本即可。

     例如，如果需要下载 {{< param "fullversion" >}} 版本在 macOS 系统上,需要使用如下命令：

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

2. 修改所下载的 kubectl 二进制文件为可执行模式。

    ```
    chmod +x ./kubectl
    ```

3. 将 kubectl 可执行文件放置到你的 PATH 目录下。


    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{{% /tab %}}
{{% tab name="Linux" %}}

1. 通过以下命令下载 kubectl 的最新版本：

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    ```

    若需要下载特定版本的 kubectl，请将上述命令中的 `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` 部分替换成为需要下载的 kubectl 的具体版本即可。

    例如，如果需要下载用于 Linux 的 {{< param "fullversion" >}} 版本，需要使用如下命令：

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. 修改所下载的 kubectl 二进制文件为可执行模式。

    ```
    chmod +x ./kubectl
    ```

3. 将 kubectl 可执行文件放置到你的 PATH 目录下。

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{{% /tab %}}
{{% tab name="Windows" %}}
1. 从[本链接](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe)下载 kubectl 的最新版 {{< param "fullversion" >}}。

    或者如果您已经在系统中安装了 `curl` 工具，也可以通过以下命令下载：

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

若要查找最新的稳定版本（例如脚本等），请查看 [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. 将 kubectl 可执行文件添加到你的 PATH 目录。
{{% /tab %}}
{{< /tabs >}}



<!--
## Configure kubectl

In order for kubectl to find and access a Kubernetes cluster, it needs a [kubeconfig file](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), which is created automatically when you create a cluster using kube-up.sh or successfully deploy a Minikube cluster. See the [getting started guides](/docs/setup/) for more about creating clusters. If you need access to a cluster you didn't create, see the [Sharing Cluster Access document](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
By default, kubectl configuration is located at `~/.kube/config`.
-->
## 配置 kubectl 

kubectl 需要一个 [kubeconfig 配置文件](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)使其找到并访问 Kubernetes 集群。当您使用 kube-up.sh 脚本创建 Kubernetes 集群或者部署 Minikube 集群时，会自动生成 kubeconfig 配置文件。请参阅[入门指南](/docs/setup/)以了解更多创建集群相关的信息。如果您需要访问一个并非由您创建的集群，请参阅[如何共享集群的访问](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。默认情况下，kubectl 配置文件位于 `~/.kube/config`。

<!--
## Check the kubectl configuration
Check that kubectl is properly configured by getting the cluster state:

```shell
kubectl cluster-info
```
If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not correctly configured or not able to connect to a Kubernetes cluster.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

For example, if you are intending to run a Kubernetes cluster on your laptop (locally), you will need a tool like minikube to be installed first and then re-run the commands stated above.

If kubectl cluster-info returns the url response but you can't access your cluster, to check whether it is configured properly, use:

```shell
kubectl cluster-info dump
```
-->
## 检查 kubectl 的配置
通过获取集群状态检查 kubectl 是否被正确配置：

```shell
kubectl cluster-info
```
如果您看到一个 URL 被返回，那么 kubectl 已经被正确配置，能够正常访问您的 Kubernetes 集群。

如果您看到类似以下的信息被返回，那么 kubectl 没有被正确配置，无法正常访问您的 Kubernetes 集群。

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

例如，如果您打算在笔记本电脑（本地）上运行 Kubernetes 集群，则需要首先安装 minikube 等工具，然后重新运行上述命令。

如果 kubectl cluster-info 能够返回 url 响应，但您无法访问您的集群，可以使用下面的命令检查配置是否正确：

```shell
kubectl cluster-info dump
```

<!--
## Enabling shell autocompletion

kubectl includes autocompletion support, which can save a lot of typing!

The completion script itself is generated by kubectl, so you typically just need to invoke it from your profile.

Common examples are provided here. For more details, consult `kubectl completion -h`.
-->
## 启用 shell 自动补全功能

kubectl 支持自动补全功能，可以节省大量输入！

自动补全脚本由 kubectl 产生，您仅需要在您的 shell 配置文件中调用即可。

以下仅提供了使用命令补全的常用示例，更多详细信息，请查阅 `kubectl completion -h` 帮助命令的输出。

<!--
### On Linux, using bash
On CentOS Linux, you may need to install the bash-completion package which is not installed by default.

```shell
yum install bash-completion -y
```

To add kubectl autocompletion to your current shell, run `source <(kubectl completion bash)`.

To add kubectl autocompletion to your profile, so it is automatically loaded in future shells run:

```shell
echo "source <(kubectl completion bash)" >> ~/.bashrc
```
-->
### Linux 系统，使用 bash
在 CentOS Linux系统上，您可能需要安装默认情况下未安装的 bash-completion 软件包。

```shell
yum install bash-completion -y
```

执行 `source <(kubectl completion bash)` 命令在您目前正在运行的 shell 中开启 kubectl 自动补全功能。

可以将上述命令添加到 shell 配置文件中，这样在今后运行的 shell 中将自动开启 kubectl 自动补全：

```shell
echo "source <(kubectl completion bash)" >> ~/.bashrc
```

<!--
### On macOS, using bash
On macOS, you will need to install bash-completion support via [Homebrew](https://brew.sh/) first:

```shell
## If running Bash 3.2 included with macOS
brew install bash-completion
## or, if running Bash 4.1+
brew install bash-completion@2
```

Follow the "caveats" section of brew's output to add the appropriate bash completion path to your local .bashrc.

If you installed kubectl using the [Homebrew instructions](#install-with-homebrew-on-macos) then kubectl completion should start working immediately.

If you have installed kubectl manually, you need to add kubectl autocompletion to the bash-completion:

```shell
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

The Homebrew project is independent from Kubernetes, so the bash-completion packages are not guaranteed to work.
-->
### macOS 系统，使用 bash
macOS 系统需要先通过 [Homebrew](https://brew.sh/) 安装 bash-completion：

```shell
## 如果您运行的是 macOS 自带的 Bash 3.2，请运行：
brew install bash-completion
## 如果您使用的是 Bash 4.1+，请运行：
brew install bash-completion@2
```

请根据 Homebrew 输出的”注意事项（caveats）”部分的内容将 bash-completion 的路径添加到本地 .bashrc 文件中。

如果您是按照 [Homebrew 指示](#jump)中的步骤安装的 kubectl，那么无需其他配置，kubectl 的自动补全功能已经被启用。

如果您是手工下载并安装的 kubectl，那么您需要将 kubectl 自动补全添加到 bash-completion：

```shell
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

由于 Homebrew 项目与 Kubernetes 无关，所以并不能保证 bash-completion 总能够支持 kubectl 的自动补全功能。

<!--
### Using Zsh
If you are using zsh edit the ~/.zshrc file and add the following code to enable kubectl autocompletion:

```shell
if [ $commands[kubectl] ]; then
  source <(kubectl completion zsh)
fi
```

Or when using [Oh-My-Zsh](http://ohmyz.sh/), edit the ~/.zshrc file and update the `plugins=` line to include the kubectl plugin.

```shell
plugins=(kubectl)
```
-->
### 使用 Zsh
如果您使用的是 zsh,请编辑 ~/.zshrc 文件并添加以下代码以启用 kubectl 自动补全功能。


```shell
if [ $commands[kubectl] ]; then
  source <(kubectl completion zsh)
fi
```

如果您使用的是 [Oh-My-Zsh](http://ohmyz.sh/)，请编辑 ~/.zshrc 文件并更新 `plugins=` 行以包含 kubectl 插件。

```shell
plugins=(kubectl)
```
{{% /capture %}}

{{% capture whatsnext %}}
<!--
[Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
-->
[了解如何启动并对外暴露您的应用程序](/docs/tasks/access-application-cluster/service-access-application-cluster/)
{{% /capture %}}

