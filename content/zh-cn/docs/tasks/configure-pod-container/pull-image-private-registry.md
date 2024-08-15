---
title: 从私有仓库拉取镜像
content_type: task
weight: 130
---
<!--
title: Pull an Image from a Private Registry
content_type: task
weight: 130
-->

<!-- overview -->

<!--
This page shows how to create a Pod that uses a
{{< glossary_tooltip text="Secret" term_id="secret" >}} to pull an image
from a private container image registry or repository. There are many private
registries in use. This task uses [Docker Hub](https://www.docker.com/products/docker-hub)
as an example registry.
-->
本文介绍如何使用 {{< glossary_tooltip text="Secret" term_id="secret" >}}
从私有的镜像仓库或代码仓库拉取镜像来创建 Pod。
有很多私有镜像仓库正在使用中。这个任务使用的镜像仓库是
[Docker Hub](https://www.docker.com/products/docker-hub)。

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* To do this exercise, you need the `docker` command line tool, and a
  [Docker ID](https://docs.docker.com/docker-id/) for which you know the password.
* If you are using a different private container registry, you need the command
  line tool for that registry and any login information for the registry.
-->
* 要进行此练习，你需要 `docker` 命令行工具和一个知道密码的
  [Docker ID](https://docs.docker.com/docker-id/)。
* 如果你要使用不同的私有的镜像仓库，你需要有对应镜像仓库的命令行工具和登录信息。

<!-- steps -->

<!--
## Log in to Docker Hub

On your laptop, you must authenticate with a registry in order to pull a private image.
-->
## 登录 Docker 镜像仓库  {#log-in-to-docker-hub}

在个人电脑上，要想拉取私有镜像必须在镜像仓库上进行身份验证。

<!--
Use the `docker` tool to log in to Docker Hub. See the _log in_ section of
[Docker ID accounts](https://docs.docker.com/docker-id/#log-in) for more information.
-->
使用 `docker` 命令工具来登录到 Docker Hub。
更多详细信息，请查阅
[Docker ID accounts](https://docs.docker.com/docker-id/#log-in) 中的 **log in** 部分。

```shell
docker login
```

<!--
When prompted, enter your Docker ID, and then the credential you want to use (access token,
or the password for your Docker ID).

The login process creates or updates a `config.json` file that holds an authorization token.
Review [how Kubernetes interprets this file](/docs/concepts/containers/images#config-json).

View the `config.json` file:
-->
当出现提示时，输入你的 Docker ID 和登录凭据（访问令牌或 Docker ID 的密码）。

登录过程会创建或更新保存有授权令牌的 `config.json` 文件。
查看 [Kubernetes 如何解析这个文件](/zh-cn/docs/concepts/containers/images#config-json)。

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

{{< note >}}
<!--
If you use a Docker credentials store, you won't see that `auth` entry but a `credsStore` entry with the name of the store as value.
In that case, you can create a secret directly. 
See [Create a Secret by providing credentials on the command line](#create-a-secret-by-providing-credentials-on-the-command-line).

-->
如果使用 Docker 凭据仓库，则不会看到 `auth` 条目，看到的将是以仓库名称作为值的 `credsStore` 条目。
在这种情况下，你可以直接创建一个 Secret。
请参阅[在命令行上提供凭据来创建 Secret](#create-a-secret-by-providing-credentials-on-the-command-line)。
{{< /note >}}

<!--
## Create a Secret based on existing credentials {#registry-secret-existing-credentials}

A Kubernetes cluster uses the Secret of `kubernetes.io/dockerconfigjson` type to authenticate with
a container registry to pull a private image.

If you already ran `docker login`, you can copy
that credential into Kubernetes:
-->
## 创建一个基于现有凭据的 Secret  {#registry-secret-existing-credentials}

Kubernetes 集群使用 `kubernetes.io/dockerconfigjson` 类型的
Secret 来通过镜像仓库的身份验证，进而提取私有镜像。

如果你已经运行了 `docker login` 命令，你可以复制该镜像仓库的凭据到 Kubernetes:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

<!--
If you need more control (for example, to set a namespace or a label on the new
secret) then you can customise the Secret before storing it.
Be sure to:

- set the name of the data item to `.dockerconfigjson`
- base64 encode the Docker configuration file and then paste that string, unbroken
  as the value for field `data[".dockerconfigjson"]`
- set `type` to `kubernetes.io/dockerconfigjson`

Example:
-->
如果你需要更多的设置（例如，为新 Secret 设置名字空间或标签），
则可以在存储 Secret 之前对它进行自定义。
请务必：

- 将 data 项中的名称设置为 `.dockerconfigjson`
- 使用 base64 编码方法对 Docker 配置文件进行编码，然后粘贴该字符串的内容，作为字段
  `data[".dockerconfigjson"]` 的值
- 将 `type` 设置为 `kubernetes.io/dockerconfigjson`

示例：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

<!--
If you get the error message `error: no objects passed to create`, it may mean the base64 encoded string is invalid.
If you get an error message like `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`, it means
the base64 encoded string in the data was successfully decoded, but could not be parsed as a `.docker/config.json` file.
-->
如果你收到错误消息：`error: no objects passed to create`，
这可能意味着 base64 编码的字符串是无效的。如果你收到类似
`Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`
的错误消息，则表示数据中的 base64 编码字符串已成功解码，
但无法解析为 `.docker/config.json` 文件。

<!--
## Create a Secret by providing credentials on the command line

Create this Secret, naming it `regcred`:
-->
## 在命令行上提供凭据来创建 Secret  {#create-a-secret-by-providing-credentials-on-the-command-line}

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

{{< note >}}
<!--
Typing secrets on the command line may store them in your shell history unprotected, and
those secrets might also be visible to other users on your PC during the time that
`kubectl` is running.
-->
在命令行上键入 Secret 可能会将它们存储在你的 Shell 历史记录中而不受保护，
并且这些 Secret 信息也可能在 `kubectl` 运行期间对你 PC 上的其他用户可见。
{{< /note >}}

<!--
## Inspecting the Secret `regcred`

To understand the contents of the `regcred` Secret you created, start by viewing the Secret in YAML format:
-->
## 检查 Secret `regcred`  {#inspecting-the-secret-regcred}

要了解你创建的 `regcred` Secret 的内容，可以用 YAML 格式进行查看：

```shell
kubectl get secret regcred --output=yaml
```

<!--
The output is similar to this:
-->
输出和下面类似：

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
  name: regcred
  ...
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
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

<!--
The output is similar to this:
-->
输出和下面类似：

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
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

Here is a manifest for an example Pod that needs access to your Docker credentials in `regcred`:
-->
## 创建一个使用你的 Secret 的 Pod  {#create-a-pod-that-uses-your-secret}

下面是一个 Pod 配置清单示例，该示例中 Pod 需要访问你的 Docker 凭据 `regcred`：

{{% code_sample file="pods/private-reg-pod.yaml" %}}

<!-- 
Download the above file onto your computer:
-->

将上述文件下载到你的计算机中：

```shell
curl -L -o my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

<!--
In file `my-private-reg-pod.yaml`, replace `<your-private-image>` with the path to an image in a private registry such as:
-->
在 `my-private-reg-pod.yaml` 文件中，使用私有仓库的镜像路径替换 `<your-private-image>`，例如：

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

<!--
To pull the image from the private registry, Kubernetes needs credentials.
The `imagePullSecrets` field in the configuration file specifies that
Kubernetes should get the credentials from a Secret named `regcred`.

Create a Pod that uses your Secret, and verify that the Pod is running:
-->
要从私有仓库拉取镜像，Kubernetes 需要凭据。
配置文件中的 `imagePullSecrets` 字段表明 Kubernetes 应该通过名为 `regcred` 的 Secret 获取凭据。

创建使用了你的 Secret 的 Pod，并检查它是否正常运行：

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

{{< note >}}
<!--
To use image pull secrets for a Pod (or a Deployment, or other object that
has a pod template that you are using), you need to make sure that the appropriate
Secret does exist in the right namespace. The namespace to use is the same
namespace where you defined the Pod.
-->
要为 Pod（或 Deployment，或其他有 Pod 模板的对象）使用镜像拉取 Secret，
你需要确保合适的 Secret 确实存在于正确的名字空间中。
要使用的是你定义 Pod 时所用的名字空间。
{{< /note >}}

<!--
Also, in case the Pod fails to start with the status `ImagePullBackOff`, view the Pod events:
-->
此外，如果 Pod 启动失败，状态为 `ImagePullBackOff`，查看 Pod 事件：

```shell
kubectl describe pod private-reg
```

<!--
If you then see an event with the reason set to `FailedToRetrieveImagePullSecret`,
Kubernetes can't find a Secret with name (`regcred`, in this example).
If you specify that a Pod needs image pull credentials, the kubelet checks that it can
access that Secret before attempting to pull the image.
-->
如果你看到一个原因设为 `FailedToRetrieveImagePullSecret` 的事件，
那么 Kubernetes 找不到指定名称（此例中为 `regcred`）的 Secret。
如果你指定 Pod 需要拉取镜像凭据，kubelet 在尝试拉取镜像之前会检查是否可以访问该 Secret。

<!--
Make sure that the Secret you have specified exists, and that its name is spelled properly.
-->
确保你指定的 Secret 存在，并且其名称拼写正确。

```shell
Events:
  ...  Reason                           ...  Message
       ------                                -------
  ...  FailedToRetrieveImagePullSecret  ...  Unable to retrieve some image pull secrets (<regcred>); attempting to pull the image may not succeed.
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Secrets](/docs/concepts/configuration/secret/)
  * or read the API reference for {{< api-reference page="config-and-storage-resources/secret-v1" >}}
* Learn more about [using a private registry](/docs/concepts/containers/images/#using-a-private-registry).
* Learn more about [adding image pull secrets to a service account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* See [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* See the `imagePullSecrets` field within the [container definitions](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers) of a Pod
-->
* 进一步了解 [Secret](/zh-cn/docs/concepts/configuration/secret/)
  * 或阅读 {{< api-reference page="config-and-storage-resources/secret-v1" >}} 的 API 参考
* 进一步了解[使用私有仓库](/zh-cn/docs/concepts/containers/images/#using-a-private-registry)
* 进一步了解[为服务账户添加拉取镜像凭据](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
* 查看 [kubectl 创建 docker-registry 凭据](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-)
* 查看 Pod [容器定义](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers)中的 `imagePullSecrets` 字段
