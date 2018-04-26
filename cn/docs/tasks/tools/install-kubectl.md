---
approvers:
- bgrant0607
- mikedanese
title: Install and Set Up kubectl
---

{% capture overview %}
<!--Use the Kubernetes command-line tool, [kubectl](/docs/user-guide/kubectl), to deploy and manage applications on Kubernetes. Using kubectl, you can inspect cluster resources; create, delete, and update components; and look at your new cluster and bring up example apps.-->
利用 Kubernetes 命令行工具 [kubectl](/docs/user-guide/kubectl)，用户可以在 Kubernetes 集群中部署和管理应用程序。通过 kubectl，您可以探查集群的各种资源；创建、删除和更新集群中的各种组件以及浏览您新创建的集群并在其中创建样例应用程序。
{% endcapture %}

{% capture prerequisites %}
<!--Use a version of kubectl that is the same version as your server or later. Using an older kubectl with a newer server might produce validation errors.-->
请使用与您服务器端版本相同或者更高版本的 kubectl 与您的 Kubernetes 集群连接，使用低版本的 kubectl 连接较高版本的服务器可能引发验证错误。
{% endcapture %}

<!--Here are a few methods to install kubectl.-->
下文总结了几种可以在您的环境中安装 kubectl 的方法。
{% capture steps %}
<!--## Install kubectl binary via curl-->
## 通过 curl 命令安装 kubectl 可执行文件

{% capture macos %}
<!--1. Download the latest release with the command:-->
1. 通过以下命令下载 kubectl 的最新版本：

        curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl

    <!--To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.-->
    若需要下载特定版本的 kubectl，请将上述命令中的 `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` 部分替换成为需要下载的 kubectl 的具体版本即可。

    <!--For example, to download version {{page.fullversion}} on MacOS, type:-->
    例如，如果需要下载用于 MacOS 的 {{page.fullversion}} 版本，需要使用如下命令：

        curl -LO https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/darwin/amd64/kubectl

<!--2. Make the kubectl binary executable.-->
2. 修改所下载的 kubectl 二进制文件为可执行模式。

    ```
    chmod +x ./kubectl
    ```

<!--3. Move the binary in to your PATH.-->
3. 将 kubectl 可执行文件放置到系统 PATH 目录下。

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{% endcapture %}

{% capture linux %}
<!--1. Download the latest release with the command:-->
1. 通过以下命令下载 kubectl 的最新版本：

        curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl

    <!--To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.-->
    若需要下载特定版本的 kubectl，请将上述命令中的 `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)`部分替换成为需要下载的 kubectl 的具体版本即可。

    <!--For example, to download version {{page.fullversion}} on Linux, type:-->
    例如，如果需要下载用于 Linux 的 {{page.fullversion}} 版本，需要使用如下命令：

        curl -LO https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/linux/amd64/kubectl

<!--2. Make the kubectl binary executable.-->
2. 修改所下载的 kubectl 二进制文件为可执行模式。

    ```
    chmod +x ./kubectl
    ```

<!--3. Move the binary in to your PATH.-->
3. 将 kubectl 可执行文件放置到系统 PATH 目录下。

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{% endcapture %}

{% capture win %}
<!--1. Download the latest release {{page.fullversion}} from [this link](https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/windows/amd64/kubectl.exe).-->
从[本链接](https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/windows/amd64/kubectl.exe)下载 kubectl 的最新版本 {{page.fullversion}}。

    <!--Or if you have `curl` installed, use this command:-->
    或者，如果您已经在系统中安装了 `curl` 工具，也可以通过以下命令下载：

        curl -LO https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/windows/amd64/kubectl.exe

    <!--To find out the latest stable version (for example, for scripting), take a look at https://storage.googleapis.com/kubernetes-release/release/stable.txt-->
    若需要了解最新的稳定版本（例如脚本等），请查看 https://storage.googleapis.com/kubernetes-release/release/stable.txt

<!--2. Add the binary in to your PATH.-->
2. 将 kubectl 可执行文件添加到系统 PATH 目录。

{% endcapture %}

{% assign tab_names = "macOS,Linux,Windows" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: macos | push: linux | push: win %}

{% include tabs.md %}

<!--## Download as part of the Google Cloud SDK-->
## 将 kubectl 作为 Google Cloud SDK 的一部分下载

<!--kubectl can be installed as part of the Google Cloud SDK.-->
kubectl 可以作为 Google Cloud SDK 的一部分进行安装。

<!--1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Run the following command to install `kubectl`:-->
1. 安装 [Google Cloud SDK](https://cloud.google.com/sdk/)。
2. 运行以下命令安装 `kubectl`：

        gcloud components install kubectl

<!--3. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.-->
3. 运行 `kubectl version` 命令来验证所安装的 kubectl 版本是最新的。

<!--## Install with snap on Ubuntu-->
## 在 Ubuntu 上通过 snap 安装 kubectl

<!--kubectl is available as a [snap](https://snapcraft.io/) application.-->
kubectl 可作为 [snap](https://snapcraft.io/) 应用程序安装使用。

<!--1. If you are on Ubuntu or one of other Linux distributions that support [snap](https://snapcraft.io/docs/core/install) package manager, you can install with:-->
如果您使用的是 Ubuntu 系统或者其他支持 [snap](https://snapcraft.io/docs/core/install) 包管理器的 Linux 发行版，可以通过以下命令安装 kubectl：

        sudo snap install kubectl --classic

<!--2. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.-->
2. 运行 `kubectl version` 命令来验证所安装的 kubectl 版本是最新的。

<!--## Install with Homebrew on macOS-->
## 在 macOS 上通过 Homebrew 安装 kubectl

<!--1. If you are on macOS and using [Homebrew](https://brew.sh/) package manager, you can install with:-->
1. 如果您使用的是 macOS 系统并使用 [Homebrew](https://brew.sh/) 包管理器，可以通过以下命令安装 kubectl：

        brew install kubectl

<!--2. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.-->
2. 运行 `kubectl version` 命令来验证所安装的 kubectl 版本是最新的。

<!--## Install with Chocolatey on Windows-->
## 在 Windows 系统上通过 Chocolatey 安装 kubectl

<!--1. If you are on Windows and using [Chocolatey](https://chocolatey.org) package manager, you can install with:-->
1. 如果您使用的是 Windows 系统并使用 [Chocolatey](https://chocolatey.org) 包管理器，可以通过以下命令安装 kubectl：

        choco install kubernetes-cli

<!--2. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.
3. Configure kubectl to use a remote Kubernetes cluster:-->
2. 运行 `kubectl version` 命令来验证所安装的 kubectl 版本是最新的。
3. 使用以下命令配置 kubectl 连接到远程 Kubernetes 集群：

        <!--cd C:\users\yourusername (Or wherever your %HOME% directory is)-->
        cd C:\users\yourusername (请进入您环境中的 %HOME% 目录)
        mkdir .kube
        cd .kube
        touch config

<!--Edit the config file with a text editor of your choice, such as Notepad for example.-->
使用您环境中的文本编辑器编辑配置文件，例如 Notepad 等。

<!--## Configure kubectl-->
## 配置 kubectl

<!--In order for kubectl to find and access a Kubernetes cluster, it needs a [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/), which is created automatically when you create a cluster using kube-up.sh or successfully deploy a Minikube cluster. See the [getting started guides](/docs/getting-started-guides/) for more about creating clusters. If you need access to a cluster you didn't create, see the [Sharing Cluster Access document](/docs/tasks/administer-cluster/share-configuration/).
By default, kubectl configuration is located at `~/.kube/config`.-->
kubectl 需要一个 [kubectlconfig配置文件](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 配置其找到并访问 Kubernetes 集群。当您使用 kube-up.sh 脚本创建 Kubernetes 集群或者成功部署 Minikube 集群后，kubectlconfig 配置文件将自动产生。请参阅[入门指南](/docs/getting-started-guides/)以了解更多创建集群相关的信息。如果您需要访问一个并非由您创建的集群，请参阅[如何共享集群的访问](/docs/tasks/administer-cluster/share-configuration/)。
默认情况下，kubectl 配置文件位于 `~/.kube/config`

<!--## Check the kubectl configuration-->
## 检查 kubectl 的配置
<!--Check that kubectl is properly configured by getting the cluster state:-->
通过获取集群状态检查 kubectl 是否被正确配置：

```shell
$ kubectl cluster-info
```
<!--If you see a URL response, kubectl is correctly configured to access your cluster.-->
如果您看到一个 URL 被返回，那么 kubectl 已经被正确配置，能够正常访问您的 Kubernetes 集群。

<!--If you see a message similar to the following, kubectl is not correctly configured:-->
如果您看到类似以下的错误信息被返回，那么 kubectl 的配置存在问题：

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

<!--## Enabling shell autocompletion-->
## 启用 shell 自动补全功能

<!--kubectl includes autocompletion support, which can save a lot of typing!-->
kubectl 支持自动补全功能，可以节省大量输入！

<!--The completion script itself is generated by kubectl, so you typically just need to invoke it from your profile.-->
自动补全脚本由 kubectl 产生，您仅需要在您的 shell 配置文件中调用即可。

<!--Common examples are provided here. For more details, consult `kubectl completion -h`.-->
以下仅提供了使用命令补全的常用示例，更多详细信息，请查阅 `kubectl completion -h` 帮助命令的输出。

<!--### On Linux, using bash-->
### Linux 系统，使用 bash

<!--To add kubectl autocompletion to your current shell, run `source <(kubectl completion bash)`.-->
执行 `source <(kubectl completion bash)` 命令在您目前正在运行的 shell 中开启 kubectl 自动补全功能。

<!--To add kubectl autocompletion to your profile, so it is automatically loaded in future shells run:-->
可以将上述命令添加到 shell 配置文件中，这样在今后运行的 shell 中将自动开启 kubectl 自动补全：

```shell
echo "source <(kubectl completion bash)" >> ~/.bashrc
```

<!--### On macOS, using bash-->
### macOS 系统，使用 bash
<!--On macOS, you will need to install bash-completion support via [Homebrew](https://brew.sh/) first:-->
macOS 系统需要先通过 [Homebrew](https://brew.sh/) 安装 bash-completion：

<!--```shell
## If running Bash 3.2 included with macOS
brew install bash-completion
## or, if running Bash 4.1+
brew install bash-completion@2
```-->
```shell
## 如果您运行的是 macOS 自带的 Bash 3.2，请运行：
brew install bash-completion
## 如果您使用的是 Bash 4.1+，请运行：
brew install bash-completion@2
```

<!--Follow the "caveats" section of brew's output to add the appropriate bash completion path to your local .bashrc.-->
请根据 Homebrew 输出的"注意事项（caveats）"部分的内容将 bash-completion 的路径添加到本地 .bashrc 文件中。

<!--If you've installed kubectl using the [Homebrew instructions](#install-with-homebrew-on-macos) then kubectl completion should start working immediately.-->
如果您是按照[利用 Homebrew 安装 kubectl](#install-with-homebrew-on-macos) 中的步骤安装的 kubectl，那么无需其他配置，kubectl 的自动补全功能已经被启用。

<!--If you have installed kubectl manually, you need to add kubectl autocompletion to the bash-completion:-->
如果您是手工下载并安装的 kubectl，那么您需要将 kubectl 自动补全添加到 bash-completion：

```shell
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

<!--The Homebrew project is independent from Kubernetes, so the bash-completion packages are not guaranteed to work.-->
由于 Homebrew 项目与 Kubernetes 无关，所以并不能保证 bash-completion 总能够支持 kubectl 的自动补全功能。

<!--### Using Oh-My-Zsh-->
### 使用Oh-My-Zsh
<!--When using [Oh-My-Zsh](http://ohmyz.sh/), edit the ~/.zshrc file and update the `plugins=` line to include the kubectl plugin.-->
如果使用的是 [Oh-My-Zsh](http://ohmyz.sh/)，请编辑 ~/.zshrc 文件并配置 `plugins=` 属性包含 kubectl 插件。

```shell
plugins=(git zsh-completions kubectl)
```

{% endcapture %}
{% capture whatsnext %}
<!--[Learn how to launch and expose your application.](/docs/user-guide/quick-start)-->
[了解如何启动并对外暴露您的应用程序。](/docs/user-guide/quick-start)
{% endcapture %}
{% include templates/task.md %}
