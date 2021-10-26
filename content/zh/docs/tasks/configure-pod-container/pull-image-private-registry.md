---
title: 从私有仓库拉取镜像
content_type: task
weight: 100
---

<!--
title: Pull an Image from a Private Registry
content_type: task
weight: 100
-->

<!-- overview -->

<!--
This page shows how to create a Pod that uses a Secret to pull an image from a
private Docker registry or repository.
-->
本文介绍如何使用 Secret 从私有的 Docker 镜像仓库或代码仓库拉取镜像来创建 Pod。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* To do this exercise, you need a
[Docker ID](https://docs.docker.com/docker-id/) and password.
-->
你需要 [Docker ID](https://docs.docker.com/docker-id/) 和密码来进行本练习。

<!-- steps -->

<!--
## Log in to Docker

On your laptop, you must authenticate with a registry in order to pull a private image:
-->
## 登录 Docker 镜像仓库

在个人电脑上，要想拉取私有镜像必须在镜像仓库上进行身份验证。

```shell
docker login
```

<!--
When prompted, enter your Docker username and password.

The login process creates or updates a `config.json` file that holds an authorization token.

View the `config.json` file:
-->
当出现提示时，输入 Docker 用户名和密码。

登录过程会创建或更新保存有授权令牌的 `config.json` 文件。

查看 `config.json` 文件：

```shell
cat ~/.docker/config.json
```

<!--
The output contains a section similar to this:
-->
输出结果包含类似于以下内容的部分：

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}
```

<!--
If you use a Docker credentials store, you won't see that `auth` entry but a `credsStore` entry with the name of the store as value.
-->
{{< note >}}
如果使用 Docker 凭证仓库，则不会看到 `auth` 条目，看到的将是以仓库名称作为值的 `credsStore` 条目。
{{< /note >}}

<!--
## Create a Secret in the cluster that holds your authorization token

A Kubernetes cluster uses the Secret of `docker-registry` type to authenticate with a container registry to pull a private image.

Create this Secret, naming it `regcred`:
-->
## 在集群中创建保存授权令牌的 Secret

Kubernetes 集群使用 `docker-registry` 类型的 Secret 来通过容器仓库的身份验证，进而提取私有映像。

创建 Secret，命名为 `regcred`：

<!--
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
-->
```shell
kubectl create secret docker-registry regcred \
  --docker-server=<你的镜像仓库服务器> \
  --docker-username=<你的用户名> \
  --docker-password=<你的密码> \
  --docker-email=<你的邮箱地址>
```

<!--
where:

* `<your-registry-server>` is your Private Docker Registry FQDN.
  Use `https://index.docker.io/v1/` for DockerHub.
* `<your-name>` is your Docker username.
* `<your-pword>` is your Docker password.
* `<your-email>` is your Docker email.

You have successfully set your Docker credentials in the cluster as a Secret called `regcred`.
-->
在这里：

* `<your-registry-server>` 是你的私有 Docker 仓库全限定域名（FQDN）。
  DockerHub 使用 `https://index.docker.io/v1/`。
* `<your-name>` 是你的 Docker 用户名。
* `<your-pword>` 是你的 Docker 密码。
* `<your-email>` 是你的 Docker 邮箱。

这样你就成功地将集群中的 Docker 凭据设置为名为 `regcred` 的 Secret。

<!--
## Inspecting the Secret `regcred`

To understand the contents of the `regcred` Secret you created, start by viewing the Secret in YAML format:
-->
## 检查 Secret `regcred`

要了解你创建的 `regcred` Secret 的内容，可以用 YAML 格式进行查看：

```shell
kubectl get secret regcred --output=yaml
```

<!-- The output is similar to this: -->
输出和下面类似：

```yaml
apiVersion: v1
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
kind: Secret
metadata:
  ...
  name: regcred
  ...
type: kubernetes.io/dockerconfigjson
```

<!--
The value of the `.dockerconfigjson` field is a base64 representation of your Docker credentials.

To understand what is in the `.dockerconfigjson` field, convert the secret data to a
readable format:
-->
`.dockerconfigjson` 字段的值是 Docker 凭据的 base64 表示。

要了解 `dockerconfigjson` 字段中的内容，请将 Secret 数据转换为可读格式：

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

<!-- The output is similar to this: -->
输出和下面类似：

```json
{"auths":{"yourprivateregistry.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

<!--
To understand what is in the `auth` field, convert the base64-encoded data to a readable format:
-->
要了解 `auth` 字段中的内容，请将 base64 编码过的数据转换为可读格式：

```shell
echo "c3R...zE2" | base64 --decode
```

<!--
The output, username and password concatenated with a `:`, is similar to this:
-->
输出结果中，用户名和密码用 `:` 链接，类似下面这样：

```none
janedoe:xxxxxxxxxxx
```

<!--
Notice that the Secret data contains the authorization token similar to your local `~/.docker/config.json` file.

You have successfully set your Docker credentials as a Secret called `regcred` in the cluster.
-->
注意，Secret 数据包含与本地 `~/.docker/config.json` 文件类似的授权令牌。

这样你就已经成功地将 Docker 凭据设置为集群中的名为 `regcred` 的 Secret。

<!--
## Create a Pod that uses your Secret

Here is a configuration file for a Pod that needs access to your Docker credentials in `regcred`:
-->
## 创建一个使用你的 Secret 的 Pod

下面是一个 Pod 配置文件，它需要访问 `regcred` 中的 Docker 凭据：

{{< codenew file="pods/private-reg-pod.yaml" >}}

<!-- Download the above file: -->
下载上述文件：

```shell
wget -O my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

<!--
In file `my-private-reg-pod.yaml`, replace `<your-private-image>` with the path to an image in a private registry such as:
-->
在`my-private-reg-pod.yaml` 文件中，使用私有仓库的镜像路径替换 `<your-private-image>`，例如：

```none
janedoe/jdoe-private:v1
```

<!--
To pull the image from the private registry, Kubernetes needs credentials.
The `imagePullSecrets` field in the configuration file specifies that
Kubernetes should get the credentials from a Secret named `regcred`.

Create a Pod that uses your Secret, and verify that the Pod is running:
-->
要从私有仓库拉取镜像，Kubernetes 需要凭证。
配置文件中的 `imagePullSecrets` 字段表明 Kubernetes 应该通过名为 `regcred` 的 Secret 获取凭证。

创建使用了你的 Secret 的 Pod，并检查它是否正常运行：

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn more about [using a private registry](/docs/concepts/containers/images/#using-a-private-registry).
* See [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* See [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core).
* See the `imagePullSecrets` field of [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
-->

* 进一步了解 [Secret](/zh/docs/concepts/configuration/secret/)
* 进一步了解 [使用私有仓库](/zh/docs/concepts/containers/images/#using-a-private-registry)
* 参考 [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-)
* 参考 [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
* 参考 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 中的 `imagePullSecrets` 字段


