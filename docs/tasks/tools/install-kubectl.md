---
assignees:
- bgrant0607
- mikedanese
title: Install and Set Up kubectl
redirect_from:
- "/docs/tasks/kubectl/install/"
- "/docs/tasks/kubectl/install.html"
- "/docs/user-guide/prereqs/"
- "/docs/user-guide/prereqs.html"
---
{% capture overview %}
Use the Kubernetes command-line tool, [kubectl](/docs/user-guide/kubectl), to deploy and manage applications on Kubernetes. Using kubectl, you can inspect cluster resources; create, delete, and update components; and look at your new cluster and bring up example apps.
{% endcapture %}

{% capture prerequisites %}
Use a version of kubectl that is the same version as your server or later. Using an older kubectl with a newer server might produce validation errors.
{% endcapture %}

Here are a few methods to install kubectl.
{% capture steps %}
## Install kubectl binary via curl

{% capture macos %}
1. Download the latest release with the command:

        curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl

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

    To find out the latest stable version (for example, for scripting), take a look at https://storage.googleapis.com/kubernetes-release/release/stable.txt

2. Add the binary in to your PATH.

{% endcapture %}

{% assign tab_names = "macOS,Linux,Windows" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: macos | push: linux | push: win %}

{% include tabs.md %}

## Download as part of the Google Cloud SDK

kubectl can be installed as part of the Google Cloud SDK.

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Run the following command to install `kubectl`:

        gcloud components install kubectl

3. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.

## Install with snap on Ubuntu

kubectl is available as a [snap](https://snapcraft.io/) application.

1. If you are on Ubuntu or one of other Linux distributions that support [snap](https://snapcraft.io/docs/core/install) package manager, you can install with:

        sudo snap install kubectl --classic

2. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.

## Install with Homebrew on macOS

1. If you are on macOS and using [Homebrew](https://brew.sh/) package manager, you can install with:

        brew install kubectl

2. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.

## Install with Chocolatey on Windows

1. If you are on Windows and using [Chocolatey](https://chocolatey.org) package manager, you can install with:

        choco install kubernetes-cli

2. Run `kubectl version` to verify that the verison you've installed is sufficiently up-to-date.
3. Configure kubectl to use a remote kubernetes cluster:

        cd C:\users\yourusername (Or wherever your %HOME% directory is)
        mkdir .kube
        cd .kube
        touch config

Edit the config file with a text editor of your choice, such as Notepad for example.

## Configure kubectl

In order for kubectl to find and access a Kubernetes cluster, it needs a [kubeconfig file](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/), which is created automatically when you create a cluster using kube-up.sh or successfully deploy a Minikube cluster. See the [getting started guides](/docs/getting-started-guides/) for more about creating clusters. If you need access to a cluster you didn't create, see the [Sharing Cluster Access document](/docs/tasks/administer-cluster/share-configuration/).
By default, kubectl configuration is located at `~/.kube/config`.

## Check the kubectl configuration
Check that kubectl is properly configured by getting the cluster state:

```shell
$ kubectl cluster-info
```
If you see a URL response, kubectl is correctly configured to access your cluster.

If you see a message similar to the following, kubectl is not correctly configured:

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
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

The Homebrew project is independent from kubernetes, so the bash-completion packages are not guaranteed to work.

{% endcapture %}
{% capture whatsnext %}
[Learn how to launch and expose your application.](/docs/user-guide/quick-start)
{% endcapture %}
{% include templates/task.md %}
