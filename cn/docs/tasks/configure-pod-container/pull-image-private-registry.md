<!--
---
title: Pull an Image from a Private Registry
---

{% capture overview %}

This page shows how to create a Pod that uses a Secret to pull an image from a
private Docker registry or repository.

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* To do this exercise, you need a
[Docker ID](https://docs.docker.com/docker-id/) and password.

{% endcapture %}

{% capture steps %}
-->
---
title: 从私有仓库拉取镜像
---

{% capture overview %}

这个教程指导如何创建一个 Pod 使用 Secret 从私有镜像或者镜像源拉取镜像。

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* 要完成这个使用，您需要有一个
[Docker ID](https://docs.docker.com/docker-id/) 和密码.

{% endcapture %}

{% capture steps %}
<!--
## Log in to Docker

    docker login

When prompted, enter your Docker username and password.

The login process creates or updates a `config.json` file that holds an
authorization token.

View the `config.json` file:

    cat ~/.docker/config.json

The output contains a section similar to this:

    {
        "auths": {
            "https://index.docker.io/v1/": {
                "auth": "c3R...zE2"
            }
        }
    }

**Note:** If you use a Docker credentials store, you won't see that `auth` entry but a `credsStore` entry with the name of the store as value.
{: .note}
-->
## 登陆到Docker

    docker login

出现提示符时，输入你的 Docker 用户名和密码。

登陆过程会创建或者更新 `config.json` 文件，这个文件包含了验证口令。

查看 `config.json` 文件内容:

    cat ~/.docker/config.json

输出会有类似这样的一段内容：

    {
        "auths": {
            "https://index.docker.io/v1/": {
                "auth": "c3R...zE2"
            }
        }
    }

**注意:** 如果你使用了 Docker 的证书存储功能，您可能不会看到 'auth' 的字眼，而是 `credsStore` ， 而它的值就是存储的名字。
{: .note}
<!--
## Create a Secret that holds your authorization token

Create a Secret named `regsecret`:

    kubectl create secret docker-registry regsecret --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

where:

* `<your-registry-server>` is your Private Docker Registry FQDN.
* `<your-name>` is your Docker username.
* `<your-pword>` is your Docker password.
* `<your-email>` is your Docker email.
-->
## 创建一个 Secret 来保存您的验证口令

创建一个名为 `regsecret` 的 Secret :

    kubectl create secret docker-registry regsecret --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>

在这里:

* `<your-registry-server>` 是你的私有仓库的FQDN.
* `<your-name>` 是你的 Docker 用户名.
* `<your-pword>` 是你的 Docker  密码.
* `<your-email>` 是你的 Docker 邮箱.
<!--
## Understanding your Secret

To understand what's in the Secret you just created, start by viewing the
Secret in YAML format:

    kubectl get secret regsecret --output=yaml

The output is similar to this:

    apiVersion: v1
    data:
      .dockercfg: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
    kind: Secret
    metadata:
      ...
      name: regsecret
      ...
    type: kubernetes.io/dockercfg

The value of the `.dockercfg` field is a base64 representation of your secret data.

Copy the base64 representation of the secret data into a file named `secret64`.

-->
## 理解你的 Secret

想要知道你刚刚创建的 Secret 是什么东西，可以看看 YAML 格式的 Secret :

    kubectl get secret regsecret --output=yaml

输出类似这样:

    apiVersion: v1
    data:
      .dockercfg: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
    kind: Secret
    metadata:
      ...
      name: regsecret
      ...
    type: kubernetes.io/dockercfg

`.dockercfg` 的值是一个经过 base64 加密的数据。

把这串 base64 加密的数据复制到一个名为 `secret64` 的文件里.

<!--
**Important**: Make sure there are no line breaks in your `secret64` file.

To understand what is in the `.dockercfg` field, convert the secret data to a
readable format:

    base64 -d secret64

The output is similar to this:

    {"yourprivateregistry.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}

Notice that the secret data contains the authorization token from your
`config.json` file.
-->
**重要**: 确保你的 `secret64` 的文件内容没有任何换行。

想知道 `.dockercfg` 的内容是什么意思，只要将 secret 数据转换成可读格式即可：

    base64 -d secret64

输出类似这样:

    {"yourprivateregistry.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}

注意到 secret 数据其实包含了你的 `config.json` 文件里的验证口令。
<!--
## Create a Pod that uses your Secret

Here is a configuration file for a Pod that needs access to your secret data:

{% include code.html language="yaml" file="private-reg-pod.yaml" ghlink="/docs/tasks/configure-pod-container/private-reg-pod.yaml" %}

Copy the contents of `private-reg-pod.yaml` to your own file named
`my-private-reg-pod.yaml`. In your file, replace `<your-private-image>` with
the path to an image in a private repository.

Example Docker Hub private image:

    janedoe/jdoe-private:v1

To pull the image from the private repository, Kubernetes needs credentials. The
 `imagePullSecrets` field in the configuration file specifies that Kubernetes
 should get the credentials from a Secret named
`regsecret`.

Create a Pod that uses your Secret, and verify that the Pod is running:

    kubectl create -f my-private-reg-pod.yaml
    kubectl get pod private-reg

-->
## 创建一个 Pod 来使用你的 Secret

下面是一个需要读取你的 Secret 数据的 Pod 的配置文件：

{% include code.html language="yaml" file="private-reg-pod.yaml" ghlink="/docs/tasks/configure-pod-container/private-reg-pod.yaml" %}

把 `private-reg-pod.yaml` 的内容复制到你自己名为 `my-private-reg-pod.yaml` 的文件。
在你的文件里，将 `<your-private-image>` 覆盖为私有仓库里的镜像地址。

Docker Hub 的私有镜像例子：

    janedoe/jdoe-private:v1

要从私有镜像拉取镜像， Kubernetes 需要有验证口令。这里 `imagePullSecrets` 告诉 Kubernets 应该从名为
`regsecret` 的 Secret 里获取验证口令。

创建一个 Pod 来使用你的 Secret, 并验证是否运行成功：

    kubectl create -f my-private-reg-pod.yaml
    kubectl get pod private-reg

<!--
{% endcapture %}

{% capture whatsnext %}

* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn more about
[using a private registry](/docs/concepts/containers/images/#using-a-private-registry).
* See [kubectl create secret docker-registry](/docs/user-guide/kubectl/v1.6/#-em-secret-docker-registry-em-).
* See [Secret](/docs/api-reference/{{page.version}}/#secret-v1-core)
* See the `imagePullSecrets` field of
[PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core).

{% endcapture %}

{% include templates/task.md %}
-->
{% endcapture %}

{% capture whatsnext %}

* 了解更多关于 [Secrets](/docs/concepts/configuration/secret/).
* 了解更多关于
[如何使用私有仓库](/docs/concepts/containers/images/#using-a-private-registry).
* 查看 [kubectl 创建 secret docker 仓库](/docs/user-guide/kubectl/v1.6/#-em-secret-docker-registry-em-).
* 查看 [Secret](/docs/api-reference/{{page.version}}/#secret-v1-core)
* 查看 [PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core) 的 `imagePullSecrets` 段
.

{% endcapture %}

{% include templates/task.md %}