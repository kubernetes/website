---
approvers:
- erictune
- thockin
title: 镜像
cn-approvers:
- chentao1596
---
<!--
---
approvers:
- erictune
- thockin
title: Images
---
-->


{% capture overview %}

<!--
You create your Docker image and push it to a registry before referring to it in a Kubernetes pod.
-->
您可以创建您的 Docker 镜像并将其推送到仓库（registry）中，然后再在 Kubernetes pod 中引用它。

<!--
The `image` property of a container supports the same syntax as the `docker` command does, including private registries and tags.
-->
容器的 `image` 属性支持与 `Docker` 命令相同的语法，包括私有仓库和标签（tag）。
{% endcapture %}

{:toc}

{% capture body %}

<!--
## Updating Images
-->
## 更新镜像

<!--
The default pull policy is `IfNotPresent` which causes the Kubelet to skip
pulling an image if it already exists. If you would like to always force a pull,
you can do one of the following:
-->
默认的拉取策略是 `IfNotPresent` ，这将导致 Kubelet 在镜像已经存在的情况下跳过拉取动作。如果您希望始终强制拉取，可以执行下列操作之一：

<!--
- set the `imagePullPolicy` of the container to `Always`;
- use `:latest` as the tag for the image to use;
- enable the [AlwaysPullImages](/docs/admin/admission-controllers/#alwayspullimages) admission controller.
-->
- 设置容器的 `imagePullPolicy` 为 `Always`；
- 使用 `:latest` 作为镜像的标签去使用；
- 开启 [AlwaysPullImages](/docs/admin/admission-controllers/#alwayspullimages) 准入控制器。

<!--
If you did not specify tag of your image, it will be assumed as `:latest`, with
pull image policy of `Always` correspondingly.
-->
如果您没有指定镜像的标签，它将被假定为 `:latest`，相应的镜像拉取策略为 `Always`。

<!--
Note that you should avoid using `:latest` tag, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information.
-->
注意，您应该避免使用 `:latest` 标签，请查看 [配置最佳实践](/docs/concepts/configuration/overview/#container-images) 获取更多信息。

<!--
## Using a Private Registry
-->
## 使用私有仓库

<!--
Private registries may require keys to read images from them.
Credentials can be provided in several ways:
-->
私有仓库可能需要密钥才能从它们读取镜像。凭证可以通过下面几种方式提供：

<!--
  - Using Google Container Registry
    - Per-cluster
    - automatically configured on Google Compute Engine or Google Kubernetes Engine
    - all pods can read the project's private registry
-->
  - 使用 Google 容器仓库
    - 每个集群都可以配置
    - 在 GCE（Google Compute Engine 谷歌计算引擎）或者 GKE（Google Kubernetes Engine 谷歌 Kubernetes 引擎）上自动配置
    - 所有 pod 能够读取项目的私有仓库
<!--
  - Using AWS EC2 Container Registry (ECR)
    - use IAM roles and policies to control access to ECR repositories
    - automatically refreshes ECR login credentials
-->
  - 使用 AWS EC2 容器仓库（ECR）
    - 使用 IAM 角色和策略去控制对 ECR 存储库的访问
    - 自动刷新 ECR 登录凭证
<!--
  - Using Azure Container Registry (ACR)
-->
  - 使用 Azure 容器仓库（ACR）
<!--
  - Configuring Nodes to Authenticate to a Private Registry
    - all pods can read any configured private registries
    - requires node configuration by cluster administrator
-->
  - 配置节点以对私有仓库进行身份验证
    - 所有 pod 能够读取任何配置好的私有仓库
    - 要求 node 通过集群管理员配置
<!--
  - Pre-pulling Images
    - all pods can use any images cached on a node
    - requires root access to all nodes to setup
-->
  - 预先拉取镜像
    - 所有 pod 能够使用 node 上已经缓存的镜像
    - 需要能够对所有 node 都能 root 访问才去安装
<!--
  - Specifying ImagePullSecrets on a Pod
    - only pods which provide own keys can access the private registry
-->
  - 在 pod 中指定 ImagePullSecrets
    - 只有提供了自己密钥的 pod 才能访问私有仓库
<!--
Each option is described in more detail below.
-->
下面将详细介绍每个选项。


<!--
### Using Google Container Registry
-->
### 使用 Google 容器仓库

<!--
Kubernetes has native support for the [Google Container
Registry (GCR)](https://cloud.google.com/tools/container-registry/), when running on Google Compute
Engine (GCE).  If you are running your cluster on GCE or Google Kubernetes Engine, simply
use the full image name (e.g. gcr.io/my_project/image:tag).
-->
在 GCE 上运行的时候，Kubernetes 已经原生支持 [Google 容器仓库（GCR)](https://cloud.google.com/tools/container-registry/)。如果您的集群运行在 GCE 或者 GKE 上，只需简单的使用完整镜像名（例如 gcr.io/my_project/image:tag）。

<!--
All pods in a cluster will have read access to images in this registry.
-->
集群中的所有 pod 都可以读取此仓库中的镜像。

<!--
The kubelet will authenticate to GCR using the instance's
Google service account.  The service account on the instance
will have a `https://www.googleapis.com/auth/devstorage.read_only`,
so it can pull from the project's GCR, but not push.
-->
kubelet 将使用实例的 Google 服务帐户对 GCR 进行身份验证。实例上的服务帐户有一个 `https://www.googleapis.com/auth/devstorage.read_only`，所以它可以从项目的 GCR 中拉取，但是不能推送。

<!--
### Using AWS EC2 Container Registry
-->
### 使用 AWS EC2 容器仓库

<!--
Kubernetes has native support for the [AWS EC2 Container
Registry](https://aws.amazon.com/ecr/), when nodes are AWS EC2 instances.
-->
当节点是 AWS EC2 实例时，Kubernetes 已经在本地支持 [AWS EC2 容器仓库](https://aws.amazon.com/ecr/)。

<!--
Simply use the full image name (e.g. `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`)
in the Pod definition.
-->
只需在 pod 定义中使用完整的镜像名称（例如 `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`）即可。

<!--
All users of the cluster who can create pods will be able to run pods that use any of the
images in the ECR registry.
-->
集群中所有能够创建 pod 的用户都能够运行使用 ECR 仓库中任何镜像的 pod。

<!--
The kubelet will fetch and periodically refresh ECR credentials.  It needs the following permissions to do this:
-->
kubelet 将获取并定期刷新 ECR 凭证。它需要以下权限才能做到这一点：

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

- 您必须使用 kubelet `v1.2.0` 或更新的版本。（例如 运行 `/usr/bin/kubelet --version=true`）。
- 如果您的节点位于域 A，而您的仓库位于另一个域 B，则需要 `v1.3.0` 或更新的版本。
- ECR 必须在您的域提供

<!--
Troubleshooting:

- Verify all requirements above.
- Get $REGION (e.g. `us-west-2`) credentials on your workstation. SSH into the host and run Docker manually with those creds. Does it work?
- Verify kubelet is running with `--cloud-provider=aws`.
- Check kubelet logs (e.g. `journalctl -u kubelet`) for log lines like:
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`
-->
故障排查：
- 验证是否满足上面所有要求。
- 在您的工作站上获取 $Region（例如 `us-west-2`）凭证。通过 SSH 进入主机，并使用这些凭证手动运行 Docker。能用吗？
- 确定 kubelet 是用 `--cloud-provider=aws` 运行的。
- 查看 kubelet 日志（例如 `journalctl -u kubelet`）中类似下面这样的日志行：
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`

<!--
### Using Azure Container Registry (ACR)
-->
### 使用 Azure 容器仓库
<!--
When using [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)
you can authenticate using either an admin user or a service principal.
In either case, authentication is done via standard Docker authentication.  These instructions assume the
[azure-cli](https://github.com/azure/azure-cli) command line tool.
-->
使用 [Azure 容器仓库](https://azure.microsoft.com/en-us/services/container-registry/) 的时候，您可以使用管理用户或服务主体进行身份验证。任何情况下，认证都是通过标准的 Docker 认证完成的。这些指令假定为 [azure-cli](https://github.com/azure/azure-cli) 命令行工具。

<!--
You first need to create a registry and generate credentials, complete documentation for this can be found in
the [Azure container registry documentation](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli).
-->
您首先需要创建一个仓库并生成凭证，有关这方面的完整文档可以在 [Azure 容器仓库文档](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli) 中找到。

<!--
Once you have created your container registry, you will use the following credentials to login:

   * `DOCKER_USER`: service principal, or admin username
   * `DOCKER_PASSWORD`: service principal password, or admin user password
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`
-->
一旦完成容器仓库的创建，您就可以使用下面这些凭证去登录：

   * `DOCKER_USER` ：服务主体，或者管理用户
   * `DOCKER_PASSWORD`：服务主体密码，或者管理用户密码
   * `DOCKER_REGISTRY_SERVER`：`${某个仓库名}.azurecr.io`
   * `DOCKER_EMAIL`：`${某个 email 地址}`

<!--
Once you have those variables filled in you can
[configure a Kubernetes Secret and use it to deploy a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
填好了这些变量之后，您就可以 [配置一个 Kubernetes Secret 并使用它部署一个 Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)。


<!--
### Configuring Nodes to Authenticate to a Private Repository
-->
### 配置节点以对私有仓库进行身份验证

<!--
**Note:** if you are running on Google Kubernetes Engine, there will already be a `.dockercfg` on each node with credentials for Google Container Registry.  You cannot use this approach.
-->
**注：** 如果您在 GKE 运行，那么每个节点上都会有一个 `.dockercfg`，它具有 Google 容器仓库的凭证。您不能使用这种方法。

<!--
**Note:** if you are running on AWS EC2 and are using the EC2 Container Registry (ECR), the kubelet on each node will
manage and update the ECR login credentials. You cannot use this approach.
-->
**注：** 如果您在 AWS EC2 上运行，并且正在使用 ECR，每个节点上的 kubelet 将管理和更新 ECR 登录凭证。您不能使用这种方法。

<!--
**Note:** this approach is suitable if you can control node configuration.  It
will not work reliably on GCE, and any other cloud provider that does automatic
node replacement.
-->
**注：** 如果您可以控制节点配置，则此方法非常适合。它无法可靠地在 GCE 和任何其他云服务提供商上进行自动节点替换。

<!--
Docker stores keys for private registries in the `$HOME/.dockercfg` or `$HOME/.docker/config.json` file.  If you put this
in the `$HOME` of user `root` on a kubelet, then docker will use it.
-->
Docker 将私有仓库的密钥存储在在文件 `$HOME/.dockercfg` 或者 `$HOME/.docker/config.json` 中。如果您把这个文件放在 kubelet 所在节点的 `root` 用户的 `$HOME` 中，那么 docker 就会使用它。

<!--
Here are the recommended steps to configuring your nodes to use a private registry.  In this
example, run these on your desktop/laptop:

   1. Run `docker login [server]` for each set of credentials you want to use.  This updates `$HOME/.docker/config.json`.
   1. View `$HOME/.docker/config.json` in an editor to ensure it contains just the credentials you want to use.
   1. Get a list of your nodes, for example:
      - if you want the names: `nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - if you want to get the IPs: `nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1. Copy your local `.docker/config.json` to the home directory of root on each node.
      - for example: `for n in $nodes; do scp ~/.docker/config.json root@$n:/root/.docker/config.json; done`
-->
下面是配置节点使用私有仓库的推荐步骤。在这个示例中，在您的电脑上运行：

   1. 对于要使用的每一组凭证，请运行 `docker login [server]`。这将更新 `$HOME/.docker/config.json`。
   1. 在编辑器中查看 `$HOME/.docker/config.json`，确保它包含了您想要使用的凭证。
   1. 获取 node 列表，例如：
      - 如果想要获取名字：`nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - 如果想要获取IP：`nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1. 复制您本地的 `.docker/config.json` 文件到所有 node 的 root 用户 home 目录下。
      - 例如：`for n in $nodes; do scp ~/.docker/config.json root@$n:/root/.docker/config.json; done`

<!--
Verify by creating a pod that uses a private image, e.g.:
-->
通过创建一个使用私有镜像的 pod 进行验证，例如：

```yaml
$ cat <<EOF > /tmp/private-image-test-1.yaml
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
$ kubectl create -f /tmp/private-image-test-1.yaml
pod "private-image-test-1" created
$
```

<!--
If everything is working, then, after a few moments, you should see:
-->
如果一切正常，那么，过了一会儿，您应该看到：

```shell
$ kubectl logs private-image-test-1
SUCCESS
```

<!--
If it failed, then you will see:
-->
如果失败，您将看到：

```shell
$ kubectl describe pods/private-image-test-1 | grep "Failed"
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


<!--
You must ensure all nodes in the cluster have the same `.docker/config.json`.  Otherwise, pods will run on
some nodes and fail to run on others.  For example, if you use node autoscaling, then each instance
template needs to include the `.docker/config.json` or mount a drive that contains it.
-->
您必须确保集群中的所有节点都具有相同的 `.docker/config.json`。否则，pod 将能在一些节点上运行，而在另一些节点上运行失败。例如，如果使用节点自动伸缩，那么每个实例模板都需要包含 `.docker/config.json`，或者挂载包含它的驱动器。

<!--
All pods will have read access to images in any private registry once private
registry keys are added to the `.docker/config.json`.
-->
一旦私有仓库被添加到 `.docker/config.json`，所有的 pod 都可以读取私有仓库中的任何镜像。

<!--
**This was tested with a private docker repository as of 26 June with Kubernetes version v0.19.3.
It should also work for a private registry such as quay.io, but that has not been tested.**
-->
**这在 6 月 26 日用 Kubernetes 的 0.19.3 版本进行了测试，它也应该适用于 quay.io 这样的私有仓库，但还没有经过测试。**

<!--
### Pre-pulling Images
-->
### 预拉取镜像

<!--
**Note:** if you are running on Google Kubernetes Engine, there will already be a `.dockercfg` on each node with credentials for Google Container Registry.  You cannot use this approach.
-->
**注：** 如果您在 GKE 上运行，那么每个节点上都会有一个 `.dockercfg`，它包含 Google 容器仓库的凭证。您不能使用这种方法。

<!--
**Note:** this approach is suitable if you can control node configuration.  It
will not work reliably on GCE, and any other cloud provider that does automatic
node replacement.
-->
**注：** 如果您可以控制节点配置，则此方法是合适的。它不会可靠地在 GCE 和任何其他云服务提供商上进行自动节点替换。

<!--
By default, the kubelet will try to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).
-->
默认情况下，kubelet 将尝试从指定的仓库中拉取每个镜像。但是，如果容器的 `imagePullPolicy` 属性设置为 `IfNotPresent` 或者 `Never`，则使用本地镜像（分别为优先使用本地镜像或者只能使用本地镜像）。

<!--
If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.
-->
如果您希望依赖于预拉取镜像作为仓库身份验证的替代，则必须确保集群中的所有节点都具有相同的预拉取镜像。

<!--
This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.
-->
这可以用于预加载某些镜像以提高速度，或者作为对私有仓库进行身份验证的替代方法。

<!--
All pods will have read access to any pre-pulled images.
-->
所有 pod 都有读取预拉取镜像的权限。

<!--
### Specifying ImagePullSecrets on a Pod
-->
## 在 pod 中指定 ImagePullSecrets

<!--
**Note:** This approach is currently the recommended approach for Google Kubernetes Engine, GCE, and any cloud-providers
where node creation is automated.
-->
**注：** 这种方法目前是推荐用于 GKE、GCE 和任何自动创建节点的云服务提供商的方法。

<!--
Kubernetes supports specifying registry keys on a pod.
-->
Kubernetes 支持在 pod 上指定仓库密钥。

<!--
#### Creating a Secret with a Docker Config
-->
#### 使用 Docker 配置创建一个 Secret

<!--
Run the following command, substituting the appropriate uppercase values:
-->
运行以下命令，将大写值替换为适当的值：

```shell
$ kubectl create secret docker-registry myregistrykey --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
secret "myregistrykey" created.
```

<!--
If you need access to multiple registries, you can create one secret for each registry.
Kubelet will merge any `imagePullSecrets` into a single virtual `.docker/config.json`
when pulling images for your Pods.
-->
如果需要访问多个仓库，则可以为每个仓库创建一个 secret。Kubelet 在为您的 Pod 拉取镜像时，会将所有 `imagePullSecrets` 合并成一个虚拟的 `.docker/config.json`。

<!--
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
-->
Pod 只能引用它们自己命名空间中的镜像拉取 secret，因此，每个命名空间都需要完成一次此过程。

<!--
##### Bypassing kubectl create secrets
-->
##### 绕过 kubectl 创建 secret

<!--
If for some reason you need multiple items in a single `.docker/config.json` or need
control not given by the above command, then you can [create a secret using
json or yaml](/docs/user-guide/secrets/#creating-a-secret-manually).
-->
如果出于某种原因，您需要单个 `.docker/config.json` 中的多个项，或者需要上面命令没有提供的控制，那么您可以 [使用 json 或者 yaml 创建 secret](/docs/user-guide/secrets/#creating-a-secret-manually)。

<!--
Be sure to:

- set the name of the data item to `.dockerconfigjson`
- base64 encode the docker file and paste that string, unbroken
  as the value for field `data[".dockerconfigjson"]`
- set `type` to `kubernetes.io/dockerconfigjson`
-->
请确保：

- 将数据项的名称设置为 `.dockerconfigjson`
- 使用 base64 对 docker 文件进行编码，粘贴生成的字符串，将其作为字段 `data[".dockerconfigjson"]` 的值
- 将 `type` 设置为 `kubernetes.io/dockerconfigjson`

<!--
Example:
-->


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
the data was successfully un-base64 encoded, but could not be parsed as a `.docker/config.json` file.
-->
如果您收到错误消息 `error: no objects passed to create`，这可能意味着 base64 编码的字符串无效。如果您收到的错误类似 `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`，这意味着数据已成功地编码为 un-base64，但无法解析为一个 `.docker/config.json` 文件。

<!--
#### Referring to an imagePullSecrets on a Pod
-->
#### 在 pod 上引用 imagePullSecrets

<!--
Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a pod definition.
-->
现在，您可以通过在 pod 定义中添加一个 `imagePullSecrets` 部分来创建引用 secret 的 pod。

```yaml
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
```

<!--
This needs to be done for each pod that is using a private registry.
-->
这需要对每个使用私有仓库的 pod 进行操作。

<!--
However, setting of this field can be automated by setting the imagePullSecrets
in a [serviceAccount](/docs/user-guide/service-accounts) resource.
-->
但是，通过在 [serviceAccount](/docs/user-guide/service-accounts) 资源中设置 imagePullSecrets，可以自动设置此字段。

<!--
You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.  This approach will work on Google Kubernetes Engine.
-->
您可以将其与每个节点的 `.docker/config.json` 结合使用。凭证将会合并。这一方法适用于 GKE。

<!--
### Use Cases
-->
### 应用场景

<!--
There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.
-->
有许多配置私有仓库的解决方案。以下是一些常见的用例和建议的解决方案。

<!--
1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images on the Docker hub.
     - No configuration required.
     - On GCE/Google Kubernetes Engine, a local mirror is automatically used for improved speed and availability.
-->
1. 集群只运行非专有（例如，开放源码）镜像。不需要隐藏镜像。
   - 在 Docker hub 上使用公共镜像
     - 不需要配置。
     - 在 GCE 或 GKE 上，自动使用本地镜像来提高速度和可用性。
<!--
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private [Docker registry](https://docs.docker.com/registry/).
     - It may be hosted on the [Docker Hub](https://hub.docker.com/account/signup/), or elsewhere.
     - Manually configure .docker/config.json on each node as described above.
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Or, when on GCE/Google Kubernetes Engine, use the project's Google Container Registry.
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
-->
1. 集群运行一些私有镜像，这些镜像应该对公司以外用户进行隐藏，但对所有集群用户都是可见的。
   - 使用托管的 [Docker 仓库](https://docs.docker.com/registry/)。
     - 它可能托管在 [Docker Hub](https://hub.docker.com/account/signup/) 上，或其它地方。
     - 像上面描述的那样在每个节点上手动配置 .docker/config.json。
   - 或者，在防火墙后面运行内部私有仓库，并打开读取访问权限。
     - 不需要 Kubernetes 配置。
   - 或者，在 GCE 或 GKE 上，使用项目的 Google 容器仓库。
     - 与手动节点配置相比，集群自动伸缩会更好地工作。
   - 或者，在更改节点配置不方便的集群上，使用 `imagePullSecrets`。
<!--
1. Cluster with a proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/admin/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
-->
1. 拥有专有镜像的集群，其中一些需要更严格的访问控制。
   - 确保 [AlwaysPullImages 准入控制器](/docs/admin/admission-controllers/#alwayspullimages) 打开。否则，所有 pod 都可能访问所有的镜像。
   - 将敏感数据移动到 "Secret" 资源中，而不是将其打包到镜像中。
<!--
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/admin/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.
-->
1. 多租户集群，每个租户都需要自己的私有仓库。
   - 确保 [AlwaysPullImages 准入控制器](/docs/admin/admission-controllers/#alwayspullimages) 打开。否则，所有 pod 都可能访问所有的镜像。
   - 运行需要授权的私有仓库。
   - 为每个租户生成仓库凭证，将其转换为 secret，并将 secret 填充到每个租户命名空间。
   - 租户将该 secret 添加到每个命名空间的 imagePullSecrets 中。

{% endcapture %}

{% include templates/concept.md %}
