---
title: 镜像
content_type: concept
weight: 10
---
<!--
---
reviewers:
- erictune
- thockin
title: Images
content_type: concept
weight: 10
---
-->

<!-- overview -->

<!--
You create your Docker image and push it to a registry before referring to it in a Kubernetes pod.

The `image` property of a container supports the same syntax as the `docker` command does, including private registries and tags.
-->
创建 Docker 镜像并将其推送到仓库，然后在 Kubernetes pod 中引用它。

容器的 `image` 属性支持与 `docker` 命令相同的语法，包括私有仓库和标签。




<!-- body -->

<!--
## Updating Images
-->
## 更新镜像  {#updating-images}

<!--
The default pull policy is `IfNotPresent` which causes the Kubelet to skip
pulling an image if it already exists. If you would like to always force a pull,
you can do one of the following:
-->
默认的镜像拉取策略是 `IfNotPresent`，在镜像已经存在的情况下，kubelet 将不再去拉取镜像。如果总是想要拉取镜像，您可以执行以下操作：

<!--
- set the `imagePullPolicy` of the container to `Always`.
- omit the `imagePullPolicy` and use `:latest` as the tag for the image to use.
- omit the `imagePullPolicy` and the tag for the image to use.
- enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller.
-->
- 设置容器的 `imagePullPolicy` 为 `Always`。
- 省略 `imagePullPolicy`，并使用 `:latest` 作为要使用的镜像的标签。
- 省略 `imagePullPolicy` 和要使用的镜像标签。
- 启用 [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) 准入控制器（admission controller）。

<!--
Note that you should avoid using `:latest` tag, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information.
-->
注意应避免使用 `:latest` 标签，参见[配置镜像最佳实践](/docs/concepts/configuration/overview/#container-images) 获取更多信息。

<!--
## Building Multi-architecture Images with Manifests
-->
## 使用清单（manifest）构建多架构镜像

<!--
Docker CLI now supports the following command `docker manifest` with sub commands like `create`, `annotate` and `push`. These commands can be used to build and push the manifests. You can use `docker manifest inspect` to view the manifest.
-->
Docker CLI 现在支持以下命令 `docker manifest` 以及 `create`、`annotate`、`push` 等子命令。这些命令可用于构建和推送清单。您可以使用 `docker manifest inspect` 来查看清单。

<!--
Please see docker documentation here:
https://docs.docker.com/edge/engine/reference/commandline/manifest/
-->
请在此处查看 docker 清单文档：
https://docs.docker.com/edge/engine/reference/commandline/manifest/

<!--
See examples on how we use this in our build harness:
https://cs.k8s.io/?q=docker%20manifest%20(create%7Cpush%7Cannotate)&i=nope&files=&repos=
-->
查看有关如何在构建工具中使用清单的示例：
https://cs.k8s.io/?q=docker%20manifest%20(create%7Cpush%7Cannotate)&i=nope&files=&repos=

<!--
These commands rely on and are implemented purely on the Docker CLI. You will need to either edit the `$HOME/.docker/config.json` and set `experimental` key to `enabled` or you can just set `DOCKER_CLI_EXPERIMENTAL` environment variable to `enabled` when you call the CLI commands.
-->
这些命令依赖于 Docker CLI 并仅在 Docker CLI 上实现。需要编辑 `$HOME/.docker/config.json` 并将 `experimental` 设置为 `enabled`，或者仅在调用 CLI 命令时将 `DOCKER_CLI_EXPERIMENTAL` 环境变量设置为 `enabled`。

{{< note >}}
<!--
Please use Docker *18.06 or above*, versions below that either have bugs or do not support the experimental command line option. Example https://github.com/docker/cli/issues/1135 causes problems under containerd.
-->
请使用 Docker *18.06 或更高版本*，低版本存在错误或不支持实验性命令行选项。导致容器问题示例 https://github.com/docker/cli/issues/1135。
{{< /note >}}

<!--
If you run into trouble with uploading stale manifests, just clean up the older manifests in `$HOME/.docker/manifests` to start fresh.
-->
如果在上传旧清单时遇到麻烦，只需删除 `$HOME/.docker/manifests` 中旧的清单即可重新开始。

<!--
For Kubernetes, we have typically used images with suffix `-$(ARCH)`. For backward compatibility, please generate the older images with suffixes. The idea is to generate say `pause` image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards compatible for older configurations or YAML files which may have hard coded the images with suffixes.
-->
对于 Kubernetes，通常使用带有后缀 `-$(ARCH)` 的镜像。为了向后兼容，请生成带有后缀的旧镜像。想法是生成具有所有 arch(es) 清单的 `pause` 镜像，并生成 `pause-amd64` 镜像，该镜像向后兼容较早的配置或者可能已对带有后缀的镜像进行硬编码的 YAML 文件。

<!--
## Using a Private Registry
-->
## 使用私有仓库

<!--
Private registries may require keys to read images from them.
Credentials can be provided in several ways:
-->
从私有仓库读取镜像时可能需要密钥。
凭证可以用以下方式提供:

  <!--
  - Using Google Container Registry
    - Per-cluster
    - automatically configured on Google Compute Engine or Google Kubernetes Engine
    - all pods can read the project's private registry
  - Using Amazon Elastic Container Registry (ECR)
    - use IAM roles and policies to control access to ECR repositories
    - automatically refreshes ECR login credentials
  - Using Oracle Cloud Infrastructure Registry (OCIR)
    - use IAM roles and policies to control access to OCIR repositories
  - Using Azure Container Registry (ACR)
  - Using IBM Cloud Container Registry
  - Configuring Nodes to Authenticate to a Private Registry
    - all pods can read any configured private registries
    - requires node configuration by cluster administrator
  - Pre-pulled Images
    - all pods can use any images cached on a node
    - requires root access to all nodes to setup
  - Specifying ImagePullSecrets on a Pod
    - only pods which provide own keys can access the private registry
  -->
  - 使用 Google Container Registry
    - 每个集群
    - 在 Google Compute Engine 或 Google Kubernetes Engine 上自动配置
    - 所有 Pod 均可读取项目的私有仓库
  - 使用 Amazon Elastic Container Registry（ECR）
    - 使用 IAM 角色和策略来控制对 ECR 仓库的访问
    - 自动刷新 ECR 登录凭据
  - 使用 Oracle Cloud Infrastructure Registry（OCIR）
    - 使用 IAM 角色和策略来控制对 OCIR 仓库的访问
  - 使用 Azure Container Registry (ACR)
  - 使用 IBM Cloud Container Registry
  - 配置节点用于私有仓库进行身份验证
    - 所有 Pod 均可读取任何已配置的私有仓库
    - 需要集群管理员配置节点
  - 预拉镜像
    - 所有 Pod 都可以使用节点上缓存的任何镜像
    - 需要所有节点的 root 访问权限才能进行设置
  - 在 Pod 上指定 ImagePullSecrets
    - 只有提供自己密钥的 Pod 才能访问私有仓库

<!--
Each option is described in more detail below.
-->
下面将详细描述每一项。


<!--
### Using Google Container Registry
-->
### 使用 Google Container Registry

<!--
Kubernetes has native support for the [Google Container
Registry (GCR)](https://cloud.google.com/tools/container-registry/), when running on Google Compute
Engine (GCE).  If you are running your cluster on GCE or Google Kubernetes Engine, simply
use the full image name (e.g. gcr.io/my_project/image:tag).
-->
Kuberetes 运行在 Google Compute Engine (GCE) 时原生支持 [Google Container
Registry (GCR)](https://cloud.google.com/tools/container-registry/)。如果 kubernetes 集群运行在 GCE 或者 Google Kubernetes Engine，使用镜像全名(例如 gcr.io/my_project/image:tag) 即可。

<!--
All pods in a cluster will have read access to images in this registry.
-->
集群中所有 pod 都会有读取这个仓库镜像的权限。

<!--
The kubelet will authenticate to GCR using the instance's
Google service account.  The service account on the instance
will have a `https://www.googleapis.com/auth/devstorage.read_only`,
so it can pull from the project's GCR, but not push.
-->
kubelet 将使用实例的 Google service account 向 GCR 认证。实例的 Google service account 拥有 `https://www.googleapis.com/auth/devstorage.read_only`，所以它可以从项目的 GCR 拉取，但不能推送。

<!--
### Using Amazon Elastic Container Registry
-->
### 使用 Amazon Elastic Container Registry

<!--
Kubernetes has native support for the [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/), when nodes are AWS EC2 instances.

Simply use the full image name (e.g. `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`)
in the Pod definition.
-->
当 Node 是 AWS EC2 实例时，Kubernetes 原生支持 [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/)。

在 pod 定义中，使用镜像全名即可 (例如 `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`)

<!--
All users of the cluster who can create pods will be able to run pods that use any of the
images in the ECR registry.

The kubelet will fetch and periodically refresh ECR credentials.  It needs the following permissions to do this:
-->
集群中所有可以创建 Pod 的用户都将能够运行使用 ECR 仓库中任何镜像的 Pod。

kubelet 将获取并定期刷新 ECR 凭据。它需要以下权限才能执行此操作：

- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:GetRepositoryPolicy`
- `ecr:DescribeRepositories`
- `ecr:ListImages`
- `ecr:BatchGetImage`

<!--
Requirements:

- You must be using kubelet version `v1.2.0` or newer.  (e.g. run `/usr/bin/kubelet --version=true`).
- If your nodes are in region A and your registry is in a different region B, you need version `v1.3.0` or newer.
- ECR must be offered in your region
-->
要求：

- 必须使用 kubelet `v1.2.0` 及以上版本。（例如 运行 `/usr/bin/kubelet --version=true`）。
- 如果 Node 在区域 A，而镜像仓库在另一个区域 B，需要 `v1.3.0` 及以上版本。
- 区域中必须提供 ECR。

<!--
Troubleshooting:

- Verify all requirements above.
- Get $REGION (e.g. `us-west-2`) credentials on your workstation. SSH into the host and run Docker manually with those creds. Does it work?
- Verify kubelet is running with `--cloud-provider=aws`.
- Check kubelet logs (e.g. `journalctl -u kubelet`) for log lines like:
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`
-->
故障排除：

- 验证是否满足以上要求。
- 获取工作站的 $REGION (例如 `us-west-2`) 凭证，使用凭证 SSH 到主机手动运行 Docker。它行得通吗？
- 验证 kubelet 是否使用参数 `--cloud-provider=aws` 运行。
- 检查 kubelet 日志(例如 `journalctl -u kubelet`)是否有类似的行：
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`

<!--
### Using Azure Container Registry (ACR)
-->
### 使用 Azure Container Registry (ACR)

<!--
When using [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)
you can authenticate using either an admin user or a service principal.
In either case, authentication is done via standard Docker authentication.  These instructions assume the
[azure-cli](https://github.com/azure/azure-cli) command line tool.
-->
当使用 [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/) 时，可以使用管理员用户或者 service principal 进行身份验证。任何一种情况，认证都通过标准的 Docker 授权完成。本指南假设使用 [azure-cli](https://github.com/azure/azure-cli) 命令行工具。

<!--
You first need to create a registry and generate credentials, complete documentation for this can be found in
the [Azure container registry documentation](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli).
-->
首先，需要创建仓库并获取凭证，完整的文档请参考 [Azure container registry 文档](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)。

<!--
Once you have created your container registry, you will use the following credentials to login:

   * `DOCKER_USER` : service principal, or admin username
   * `DOCKER_PASSWORD`: service principal password, or admin user password
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`
-->
创建好容器仓库后，可以使用以下凭证登录：

   * `DOCKER_USER` : service principal，或管理员用户名称
   * `DOCKER_PASSWORD`: service principal 密码，或管理员用户密码
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`

<!--
Once you have those variables filled in you can
[configure a Kubernetes Secret and use it to deploy a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
填写以上变量后，就可以
[配置 Kubernetes Secret 并使用它来部署 Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)。

<!--
### Using IBM Cloud Container Registry
IBM Cloud Container Registry provides a multi-tenant private image registry that you can use to safely store and share your Docker images. By default, images in your private registry are scanned by the integrated Vulnerability Advisor to detect security issues and potential vulnerabilities. Users in your IBM Cloud account can access your images, or you can create a token to grant access to registry namespaces.
-->
### 使用 IBM Cloud Container Registry
IBM Cloud Container Registry 提供了一个多租户私有镜像仓库，可以使用它来安全地存储和共享 Docker 仓库。默认情况下，集成的 Vulnerability Advisor 会扫描私有仓库中的镜像，以检测安全问题和潜在的漏洞。IBM Cloud 帐户中的用户可以访问您的镜像，也可以创建令牌来授予对仓库命名空间的访问权限。

<!--
To install the IBM Cloud Container Registry CLI plug-in and create a namespace for your images, see [Getting started with IBM Cloud Container Registry](https://cloud.ibm.com/docs/services/Registry?topic=registry-index#index).
-->
要安装 IBM Cloud Container Registry CLI 插件并为镜像创建命名空间，请参阅 [IBM Cloud Container Registry 入门](https://cloud.ibm.com/docs/services/Registry?topic=registry-index#index)。

<!--
You can use the IBM Cloud Container Registry to deploy containers from [IBM Cloud public images](https://cloud.ibm.com/docs/services/Registry?topic=registry-public_images#public_images) and your private images into the `default` namespace of your IBM Cloud Kubernetes Service cluster. To deploy a container into other namespaces, or to use an image from a different IBM Cloud Container Registry region or IBM Cloud account, create a Kubernetes `imagePullSecret`. For more information, see [Building containers from images](https://cloud.ibm.com/docs/containers?topic=containers-images#images).
-->
可以使用 IBM Cloud Container Registry 将容器从 [IBM Cloud 公共镜像](https://cloud.ibm.com/docs/services/Registry?topic=registry-public_images#public_images) 和私有镜像部署到 IBM Cloud Kubernetes Service 集群的默认命名空间。要将容器部署到其他命名空间，或使用来自其他 IBM Cloud Container 的仓库区域或 IBM Cloud 帐户的镜像，请创建 Kubernetes `imagePullSecret`。有关更多信息，请参阅[从镜像构建容器](https://cloud.ibm.com/docs/containers?topic=containers-images#images)。

<!--
### Configuring Nodes to Authenticate to a Private Registry
-->
### 配置 Node 对私有仓库认证

{{< note >}}
<!--
If you are running on Google Kubernetes Engine, there will already be a `.dockercfg` on each node with credentials for Google Container Registry.  You cannot use this approach.
-->
如果在 Google Kubernetes Engine 上运行集群，每个节点上都会有 `.dockercfg` 文件，它包含 Google Container Registry 的凭证。不需要使用以下方法。
{{< /note >}}

{{< note >}}
<!--
If you are running on AWS EC2 and are using the EC2 Container Registry (ECR), the kubelet on each node will
manage and update the ECR login credentials. You cannot use this approach.
-->
如果在 AWS EC2 上运行集群且准备使用 EC2 Container Registry (ECR)，每个 node 上的 kubelet 会管理和更新 ECR 的登录凭证。不需要使用以下方法。
{{< /note >}}

{{< note >}}
<!--
This approach is suitable if you can control node configuration.  It
will not work reliably on GCE, and any other cloud provider that does automatic
node replacement.
-->
该方法适用于能够对节点进行配置的情况。该方法在 GCE 及在其它能自动配置节点的云平台上并不适合。
{{< /note >}}

{{< note >}}
<!--
Kubernetes as of now only supports the `auths` and `HttpHeaders` section of docker config. This means credential helpers (`credHelpers` or `credsStore`) are not supported.
-->
截至目前，Kubernetes 仅支持 docker config 的 `auths` 和 `HttpHeaders` 部分。这意味着不支持凭据助手（`credHelpers` 或 `credsStore`）。
{{< /note >}}

<!--
Docker stores keys for private registries in the `$HOME/.dockercfg` or `$HOME/.docker/config.json` file.  If you put the same file
in the search paths list below, kubelet uses it as the credential provider when pulling images.

*   `{--root-dir:-/var/lib/kubelet}/config.json`
*   `{cwd of kubelet}/config.json`
*   `${HOME}/.docker/config.json`
*   `/.docker/config.json`
*   `{--root-dir:-/var/lib/kubelet}/.dockercfg`
*   `{cwd of kubelet}/.dockercfg`
*   `${HOME}/.dockercfg`
*   `/.dockercfg`
-->
Docker 将私有仓库的密钥存放在 `$HOME/.dockercfg` 或 `$HOME/.docker/config.json` 文件中。Kubelet 上，docker 会使用 root 用户 `$HOME` 路径下的密钥。

*   `{--root-dir:-/var/lib/kubelet}/config.json`
*   `{cwd of kubelet}/config.json`
*   `${HOME}/.docker/config.json`
*   `/.docker/config.json`
*   `{--root-dir:-/var/lib/kubelet}/.dockercfg`
*   `{cwd of kubelet}/.dockercfg`
*   `${HOME}/.dockercfg`
*   `/.dockercfg`

{{< note >}}
<!--
You may have to set `HOME=/root` explicitly in your environment file for kubelet.
-->
可能必须在环境变量文件中为 kubelet 显式设置 `HOME=/root`。
{{< /note >}}

<!--
Here are the recommended steps to configuring your nodes to use a private registry.  In this
example, run these on your desktop/laptop:

   1. Run `docker login [server]` for each set of credentials you want to use.  This updates `$HOME/.docker/config.json`.
   1. View `$HOME/.docker/config.json` in an editor to ensure it contains just the credentials you want to use.
   1. Get a list of your nodes, for example:
      - if you want the names: `nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - if you want to get the IPs: `nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1. Copy your local `.docker/config.json` to one of the search paths list above.
      - for example: `for n in $nodes; do scp ~/.docker/config.json root@$n:/var/lib/kubelet/config.json; done`
-->
推荐如下步骤来为 node 配置私有仓库。以下示例在 PC 或笔记本电脑中操作：

   1. 对于想要使用的每一种凭证，运行 `docker login [server]`，它会更新 `$HOME/.docker/config.json`。
   2. 使用编辑器查看 `$HOME/.docker/config.json`，保证文件中包含了想要使用的凭证。
   3. 获取 node 列表，例如
      - 如果想要 node 名称，`nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - 如果想要 node IP ，`nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   4. 将本地的 `.docker/config.json` 拷贝到每个节点 root 用户目录下
      - 例如： `for n in $nodes; do scp ~/.docker/config.json root@$n:/root/.docker/config.json; done`

<!--
Verify by creating a pod that uses a private image, e.g.:
-->
创建使用私有仓库的 pod 来验证，例如：

```yaml
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
pod/private-image-test-1 created
```

<!--
If everything is working, then, after a few moments, you should see:
-->
如果一切正常，一段时间后，可以看到:

```shell
kubectl logs private-image-test-1
SUCCESS
```

<!--
If it failed, then you will see:
-->
如果失败，则可以看到：

```shell
kubectl describe pods/private-image-test-1 | grep "Failed"
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```

<!--
You must ensure all nodes in the cluster have the same `.docker/config.json`.  Otherwise, pods will run on
some nodes and fail to run on others.  For example, if you use node autoscaling, then each instance
template needs to include the `.docker/config.json` or mount a drive that contains it.
-->
必须保证集群中所有的节点都有相同的 `.docker/config.json` 文件。否则, pod 会在一些节点上正常运行而在另一些节点上无法启动。例如，如果使用 node 自动缩放，那么每个实例模板都需要包含 `.docker/config.json`，或者挂载一个包含这个文件的驱动器。

<!--
All pods will have read access to images in any private registry once private
registry keys are added to the `.docker/config.json`.
-->
在 `.docker/config.json` 中配置了私有仓库密钥后，所有 pod 都会能读取私有仓库中的镜像。

<!--
### Pre-pulled Images
-->
### 提前拉取镜像

{{< note >}}
<!--
If you are running on Google Kubernetes Engine, there will already be a `.dockercfg` on each node with credentials for Google Container Registry.  You cannot use this approach.
-->
如果在 Google Kubernetes Engine 上运行集群，每个节点上都会有 `.dockercfg` 文件，它包含 Google Container Registry 的凭证。不需要使用以下方法。
{{< /note >}}

{{< note >}}
<!--
This approach is suitable if you can control node configuration.  It
will not work reliably on GCE, and any other cloud provider that does automatic
node replacement.
-->
该方法适用于能够对节点进行配置的情况。该方法在 GCE 及在其它能自动配置节点的云平台上并不适合。
{{< /note >}}

<!--
By default, the kubelet will try to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).
-->
默认情况下，kubelet 会尝试从指定的仓库拉取每一个镜像。但是，如果容器属性 `imagePullPolicy` 设置为 `IfNotPresent `或者 `Never`，则会使用本地镜像（优先、唯一、分别）。

<!--
If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.

All pods will have read access to any pre-pulled images.
-->
如果依赖提前拉取镜像代替仓库认证，必须保证集群所有的节点提前拉取的镜像是相同的。

可以用于提前载入指定的镜像以提高速度，或者作为私有仓库认证的一种替代方案。

所有的 pod 都可以使用 node 上缓存的镜像。

<!--
### Specifying ImagePullSecrets on a Pod
-->
### 在 pod 上指定 ImagePullSecrets

{{< note >}}
<!--
This approach is currently the recommended approach for Google Kubernetes Engine, GCE, and any cloud-providers
where node creation is automated.
-->
Google Kubernetes Engine、GCE 及其他自动创建 node 的云平台上，推荐使用本方法。
{{< /note >}}

<!--
Kubernetes supports specifying registry keys on a pod.
-->
Kubernetes 支持在 pod 中指定仓库密钥。

<!--
#### Creating a Secret with a Docker Config
-->
#### 使用 Docker Config 创建 Secret

<!--
Run the following command, substituting the appropriate uppercase values:
-->
运行以下命令，将大写字母代替为合适的值：

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

<!--
If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes secret.
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) explains how to set this up.
This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that will
only work with a single private registry.
-->
如果已经有 Docker 凭证文件，则可以将凭证文件作为 Kubernetes secret 导入而不是使用上面的命令。[根据现有 Docker 凭证创建 Secret](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) 解释了如何安装。如果使用多个私有容器仓库，这将特别有用，因为 `kubectl create secret docker-registry` 创建了一个仅适用于单个私有仓库的 Secret。

{{< note >}}
<!--
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
-->
Pod 只能引用和它相同命名空间的 ImagePullSecrets，所以需要为每一个命名空间做配置。
{{< /note >}}

<!--
#### Referring to an imagePullSecrets on a Pod
-->
#### 引用 Pod 上的 imagePullSecrets

<!--
Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a pod definition.
-->
现在，在创建 pod 时，可以在 pod 定义中增加 `imagePullSecrets` 部分来引用 secret。

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

<!--
This needs to be done for each pod that is using a private registry.

However, setting of this field can be automated by setting the imagePullSecrets
in a [serviceAccount](/docs/user-guide/service-accounts) resource.
Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for detailed instructions.
-->
对每一个使用私有仓库的 pod，都需要做以上操作。

但是，可以通过在 [serviceAccount](/docs/user-guide/service-accounts) 资源中设置 imagePullSecrets 来自动设置 `imagePullSecrets`。检查 [将 ImagePullSecrets 添加 Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) 以获取详细说明。

<!--
You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.  This approach will work on Google Kubernetes Engine.
-->
可以将其与每个节点 `.docker/config.json` 结合使用。凭据将被合并。这种方法适用于 Google Kubernetes Engine。

<!--
### Use Cases
-->
### 使用场景

<!--
There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.
-->
配置私有仓库有多种方案，以下是一些常用场景和建议的解决方案。

<!--
1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images on the Docker hub.
     - No configuration required.
     - On GCE/Google Kubernetes Engine, a local mirror is automatically used for improved speed and availability.
-->
1. 集群运行非专有（例如 开源镜像）镜像。镜像不需要隐藏。
   - 使用 Docker hub 上的公有镜像
    - 无需配置
    - 在 GCE/GKE 上会自动使用高稳定性和高速的 Docker hub 的本地 mirror

<!--
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private [Docker registry](https://docs.docker.com/registry/).
     - It may be hosted on the [Docker Hub](https://hub.docker.com/signup), or elsewhere.
     - Manually configure .docker/config.json on each node as described above.
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Or, when on GCE/Google Kubernetes Engine, use the project's Google Container Registry.
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
-->
2. 集群运行一些专有镜像，这些镜像对外部公司需要隐藏，对集群用户可见
   - 使用自主的私有 [Docker registry](https://docs.docker.com/registry/)。
     - 可以放置在 [Docker Hub](https://hub.docker.com/account/signup/),或者其他地方。
	   - 按照上面的描述，在每个节点手动配置 .docker/config.json。
   - 或者，在防火墙内运行一个内置的私有仓库，并开放读取权限。
     - 不需要配置 Kubenretes。
   - 或者，在 GCE/GKE 上时，使用项目的 Google Container Registry。
     - 使用集群自动伸缩比手动配置 node 工作的更好。
   - 或者，在更改集群 node 配置不方便时，使用 `imagePullSecrets`。

<!--
3. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
-->
3. 使用专有镜像的集群，有更严格的访问控制。
   - 保证开启 [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。否则，所有的 pod 都可以使用镜像。
   - 将敏感数据存储在 "Secret" 资源中，而不是打包在镜像里。

<!--
4. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.
-->
4. 多租户集群下，每个租户需要自己的私有仓库。
   - 开启保证 [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。否则，所有租户的所有的 pod 都可以使用镜像。
   - 私有仓库开启认证。
   - 为每个租户获取仓库凭证，放置在 secret 中，并发布到每个租户的命名空间下。
   - 租户将 secret 增加到每个命名空间下的 imagePullSecrets 中。



<!--
If you need access to multiple registries, you can create one secret for each registry.
Kubelet will merge any `imagePullSecrets` into a single virtual `.docker/config.json`
-->
如果需要访问多个仓库，则可以为每个仓库创建一个 secret。Kubelet 将任何 `imagePullSecrets` 合并为单个虚拟 `.docker/config.json` 文件。
