---
reviewers:
- bgrant0607
- mikedanese
title: Install and Set Up kubectl
---

{% capture overview %}
Use the Kubernetes command-line tool, [kubectl](/docs/user-guide/kubectl/), to deploy and manage applications on Kubernetes. Using kubectl, you can inspect cluster resources; create, delete, and update components; and look at your new cluster and bring up example apps.
{% endcapture %}

{% capture prerequisites %}
Use a version of kubectl that is the same version as your server or later. Using an older kubectl with a newer server might produce validation errors.
{% endcapture %}

## Install kubectl

Here are a few methods to install kubectl.
Pick the one that suits your environment best.

{% capture steps %}
### Install kubectl binary via curl

{% capture macos %}
1. Download the latest release with the command:

       curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/darwin/amd64/kubectl

    To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.

    For example, to download version {{page.fullversion}} on MacOS, type:

       curl -LO https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/darwin/amd64/kubectl

2. Make the kubectl binary executable.

    ```
    chmod +x ./kubectl
    ```

3. Move the binary in to your PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{% endcapture %}

{% capture linux %}
1. Download the latest release with the command:

       curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl

    To download a specific version, replace the `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` portion of the command with the specific version.

    For example, to download version {{page.fullversion}} on Linux, type:

       curl -LO https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/linux/amd64/kubectl

2. Make the kubectl binary executable.

    ```
    chmod +x ./kubectl
    ```

3. Move the binary in to your PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{% endcapture %}

{% capture win %}
1. Download the latest release {{page.fullversion}} from [this link](https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/windows/amd64/kubectl.exe).

    Or if you have `curl` installed, use this command:

       curl -LO https://storage.googleapis.com/kubernetes-release/release/{{page.fullversion}}/bin/windows/amd64/kubectl.exe

    To find out the latest stable version (for example, for scripting), take a look at [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. Add the binary in to your PATH.

{% endcapture %}

{% assign tab_names = "macOS,Linux,Windows" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: macos | push: linux | push: win %}

{% include tabs.md %}

### Download as part of the Google Cloud SDK

kubectl can be installed as part of the Google Cloud SDK.

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Run the following command to install `kubectl`:

       gcloud components install kubectl

3. Run `kubectl version` to verify that the version you've installed is sufficiently up-to-date.

### Install with snap on Ubuntu

kubectl is available as a [snap](https://snapcraft.io/) application.

1. If you are on Ubuntu or one of other Linux distributions that support [snap](https://snapcraft.io/docs/core/install) package manager, you can install with:

       sudo snap install kubectl --classic

2. Run `kubectl version` to verify that the version you've installed is sufficiently up-to-date.

### Install with Homebrew on macOS

1. If you are on macOS and using [Homebrew](https://brew.sh/) package manager, you can install with:

       brew install kubectl

2. Run `kubectl version` to verify that the version you've installed is sufficiently up-to-date.

### Install with Powershell from PSGallery

1. If you are on Windows and using [Powershell Gallery](https://www.powershellgallery.com/) package manager, you can install and update with:

       Install-Script -Name install-kubectl -Scope CurrentUser -Force     
       install-kubectl.ps1 [-DownloadLocation <path>]
       
If no Downloadlocation is specified, kubectl will be installed in users temp Directory   
2. The installer creates $HOME/.kube and instructs it to create a config file  
3. Updating
re-run Install-Script to update the installer
re-run install-kubectl.ps1 to install latest binaries

### Install with Chocolatey on Windows

1. If you are on Windows and using [Chocolatey](https://chocolatey.org) package manager, you can install with:

       choco install kubernetes-cli

2. Run `kubectl version` to verify that the version you've installed is sufficiently up-to-date.
3. Configure kubectl to use a remote Kubernetes cluster:

       cd C:\users\yourusername (Or wherever your %HOME% directory is)
       mkdir .kube
       cd .kube
       New-Item config -type file

Edit the config file with a text editor of your choice, such as Notepad for example.

## Configure kubectl

In order for kubectl to find and access a Kubernetes cluster, it needs a [kubeconfig file](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), which is created automatically when you create a cluster using kube-up.sh or successfully deploy a Minikube cluster. See the [getting started guides](/docs/setup/) for more about creating clusters. If you need access to a cluster you didn't create, see the [Sharing Cluster Access document](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
By default, kubectl configuration is located at `~/.kube/config`.

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

## Enabling shell autocompletion

kubectl includes autocompletion support, which can save a lot of typing!

The completion script itself is generated by kubectl, so you typically just need to invoke it from your profile.

Common examples are provided here. For more details, consult `kubectl completion -h`.

### On Linux, using bash

To add kubectl autocompletion to your current shell, run `source <(kubectl completion bash)`.

To add kubectl autocompletion to your profile, so it is automatically loaded in future shells run:

```shell
echo "source <(kubectl completion bash)" >> ~/.bashrc
```

### On macOS, using bash
On macOS, you will need to install bash-completion support via [Homebrew](https://brew.sh/) first:

```shell
## If running Bash 3.2 included with macOS
brew install bash-completion
## or, if running Bash 4.1+
brew install bash-completion@2
```

Follow the "caveats" section of brew's output to add the appropriate bash completion path to your local .bashrc.

If you've installed kubectl using the [Homebrew instructions](#install-with-homebrew-on-macos) then kubectl completion should start working immediately.

If you have installed kubectl manually, you need to add kubectl autocompletion to the bash-completion:

```shell
kubectl completion bash > $(brew --prefix)/etc/bash_completion.d/kubectl
```

The Homebrew project is independent from Kubernetes, so the bash-completion packages are not guaranteed to work.

### Using Zsh
If you are using zsh edit the ~/.zshrc file and add the following code to enable kubectl autocompletion:

```shell
if [ $commands[kubectl] ]; then
  source <(kubectl completion zsh)
fi
```

Or when using [Oh-My-Zsh](http://ohmyz.sh/), edit the ~/.zshrc file and update the `plugins=` line to include the kubectl plugin.


```shell
source <(kubectl completion zsh)
```

{% endcapture %}
{% capture whatsnext %}
[Learn how to launch and expose your application.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
{% endcapture %}
{% include templates/task.md %}
