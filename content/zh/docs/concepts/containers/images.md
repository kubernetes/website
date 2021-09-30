---
title: 镜像
content_type: concept
weight: 10
---
<!--
reviewers:
- erictune
- thockin
title: Images
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
A container image represents binary data that encapsulates an application and all its
software dependencies. Container images are executable software bundles that can run
standalone and that make very well defined assumptions about their runtime environment.

You typically create a container image of your application and push it to a registry
before referring to it in a
{{< glossary_tooltip text="Pod" term_id="pod" >}}

This page provides an outline of the container image concept.
-->
容器镜像（Image）所承载的是封装了应用程序及其所有软件依赖的二进制数据。
容器镜像是可执行的软件包，可以单独运行；该软件包对所处的运行时环境具有
良定（Well Defined）的假定。

你通常会创建应用的容器镜像并将其推送到某仓库，然后在
{{< glossary_tooltip text="Pod" term_id="pod" >}} 中引用它。

本页概要介绍容器镜像的概念。

<!-- body -->

<!--
## Image names

Container images are usually given a name such as `pause`, `example/mycontainer`, or `kube-apiserver`.
Images can also include a registry hostname; for example: `fictional.registry.example/imagename`,
and possible a port number as well; for example: `fictional.registry.example:10443/imagename`.

If you don't specify a registry hostname, Kubernetes assumes that you mean the Docker public registry.

After the image name part you can add a _tag_ (as also using with commands such
as `docker` and `podman`).
Tags let you identify different versions of the same series of images.
-->
## 镜像名称    {#image-names}

容器镜像通常会被赋予 `pause`、`example/mycontainer` 或者 `kube-apiserver` 这类的名称。
镜像名称也可以包含所在仓库的主机名。例如：`fictional.registry.example/imagename`。
还可以包含仓库的端口号，例如：`fictional.registry.example:10443/imagename`。

如果你不指定仓库的主机名，Kubernetes 认为你在使用 Docker 公共仓库。

在镜像名称之后，你可以添加一个 _标签（Tag）_ （就像在 `docker` 或 `podman`
中也在用的那样）。
使用标签能让你辨识同一镜像序列中的不同版本。

<!--
Image tags consist of lowercase and uppercase letters, digits, underscores (`_`),
periods (`.`), and dashes (`-`).  
There are additional rules about where you can place the separator
characters (`_`, `-`, and `.`) inside an image tag.  
If you don't specify a tag, Kubernetes assumes you mean the tag `latest`.
-->
镜像标签可以包含小写字母、大写字符、数字、下划线（`_`）、句点（`.`）和连字符（`-`）。
关于在镜像标签中何处可以使用分隔字符（`_`、`-` 和 `.`）还有一些额外的规则。
如果你不指定标签，Kubernetes 认为你想使用标签 `latest`。

<!--
You should avoid using the `latest` tag when deploying containers in production,
as it is harder to track which version of the image is running and more difficult
to roll back to a working version.

Instead, specify a meaningful tag such as `v1.42.0`.
-->
{{< caution >}}
你要避免在生产环境中使用 `latest` 标签，因为这会使得跟踪所运行的镜像版本变得
非常困难，同时也很难回滚到之前运行良好的版本。

正确的做法恰恰相反，你应该指定一个有意义的标签，如 `v1.42.0`。
{{< /caution >}}

<!--
## Updating images

When you first create a {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod, or other
object that includes a Pod template, then by default the pull policy of all
containers in that pod will be set to `IfNotPresent` if it is not explicitly
specified. This policy causes the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} to skip pulling an
image if it already exists.
-->
## 更新镜像  {#updating-images}

当你最初创建一个 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}、
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}、Pod
或者其他包含 Pod 模板的对象时，如果没有显式设定的话，Pod 中所有容器的默认镜像
拉取策略是 `IfNotPresent`。这一策略会使得
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
在镜像已经存在的情况下直接略过拉取镜像的操作。

<!--
If you would like to always force a pull, you can do one of the following:

- set the `imagePullPolicy` of the container to `Always`.
- omit the `imagePullPolicy` and use `:latest` as the tag for the image to use;
  Kubernetes will set the policy to `Always`.
- omit the `imagePullPolicy` and the tag for the image to use.
- enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller.
-->
如果你希望强制总是拉取镜像，你可以执行以下操作之一：

- 设置容器的 `imagePullPolicy` 为 `Always`。
- 省略 `imagePullPolicy`，并使用 `:latest` 作为要使用的镜像的标签；
  Kubernetes 会将策略设置为 `Always`。
- 省略 `imagePullPolicy` 和要使用的镜像标签。
- 启用 [AlwaysPullImages](/zh/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  准入控制器（Admission Controller）。

{{< note >}}
<!--
The value of `imagePullPolicy` of the container is always set when the object is
first _created_, and is not updated if the image's tag later changes.

For example, if you create a Deployment with an image whose tag is _not_
`:latest`, and later update that Deployment's image to a `:latest` tag, the
`imagePullPolicy` field will _not_ change to `Always`. You must manually change
the pull policy of any object after its initial creation.
-->
对象被 *创建* 时，容器的 `imagePullPolicy` 总是被设置为某值，如果镜像的标签
后来发生改变，镜像拉取策略也不会被改变。

例如，如果你创建了一个 Deployment 对象，其中的镜像标签不是 `:latest`，
后来 Deployment 的镜像被改为 `:latest`，则 `imagePullPolicy` 不会被改变为
`Always`。你必须在对象被初始创建之后手动改变拉取策略。
{{< /note >}}

<!--
When `imagePullPolicy` is defined without a specific value, it is also set to `Always`.
-->
如果 `imagePullPolicy` 未被定义为特定的值，也会被设置为 `Always`。

<!--
## Multi-architecture images with image indexes

As well as providing binary images, a container registry can also serve a [container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md). An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md) for architecture-specific versions of a container. The idea is that you can have a name for an image (for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to fetch the right binary image for the machine architecture they are using.

Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward compatibility, please generate the older images with suffixes. The idea is to generate say `pause` image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards compatible for older configurations or YAML files which may have hard coded the images with suffixes.
-->
## 带镜像索引的多架构镜像  {#multi-architecture-images-with-image-indexes}

除了提供二进制的镜像之外，容器仓库也可以提供
[容器镜像索引](https://github.com/opencontainers/image-spec/blob/master/image-index.md)。
镜像索引可以根据特定于体系结构版本的容器指向镜像的多个
[镜像清单](https://github.com/opencontainers/image-spec/blob/master/manifest.md)。
这背后的理念是让你可以为镜像命名（例如：`pause`、`example/mycontainer`、`kube-apiserver`）
的同时，允许不同的系统基于它们所使用的机器体系结构取回正确的二进制镜像。

Kubernetes 自身通常在命名容器镜像时添加后缀 `-$(ARCH)`。
为了向前兼容，请在生成较老的镜像时也提供后缀。
这里的理念是为某镜像（如 `pause`）生成针对所有平台都适用的清单时，
生成 `pause-amd64` 这类镜像，以便较老的配置文件或者将镜像后缀影编码到其中的
YAML 文件也能兼容。

<!--
## Using a private registry

Private registries may require keys to read images from them.  
Credentials can be provided in several ways:
-->
## 使用私有仓库   {#using-a-private-registry}

从私有仓库读取镜像时可能需要密钥。
凭证可以用以下方式提供:

<!--
  - Configuring Nodes to Authenticate to a Private Registry
    - all pods can read any configured private registries
    - requires node configuration by cluster administrator
  - Pre-pulled Images
    - all pods can use any images cached on a node
    - requires root access to all nodes to setup
  - Specifying ImagePullSecrets on a Pod
    - only pods which provide own keys can access the private registry
  - Vendor-specific or local extensions
    - if you're using a custom node configuration, you (or your cloud
      provider) can implement your mechanism for authenticating the node
      to the container registry.
-->
- 配置节点向私有仓库进行身份验证
  - 所有 Pod 均可读取任何已配置的私有仓库
  - 需要集群管理员配置节点
- 预拉镜像
  - 所有 Pod 都可以使用节点上缓存的所有镜像
  - 需要所有节点的 root 访问权限才能进行设置
- 在 Pod 中设置 ImagePullSecrets
  - 只有提供自己密钥的 Pod 才能访问私有仓库
- 特定于厂商的扩展或者本地扩展
  - 如果你在使用定制的节点配置，你（或者云平台提供商）可以实现让节点
    向容器仓库认证的机制

<!--
These options are explained in more detail below.
-->
下面将详细描述每一项。

<!--
### Configuring nodes to authenticate to a private registry

If you run Docker on your nodes, you can configure the Docker container
runtime to authenticate to a private container registry.

This approach is suitable if you can control node configuration.
-->
### 配置 Node 对私有仓库认证

如果你在节点上运行的是 Docker，你可以配置 Docker
容器运行时来向私有容器仓库认证身份。

此方法适用于能够对节点进行配置的场合。

<!--
Default Kubernetes only supports the `auths` and `HttpHeaders` section in Docker configuration.
Docker credential helpers (`credHelpers` or `credsStore`) are not supported.
-->
{{< note >}}
Kubernetes 默认仅支持 Docker 配置中的 `auths` 和 `HttpHeaders` 部分，
不支持 Docker 凭据辅助程序（`credHelpers` 或 `credsStore`）。
{{< /note >}}

<!--
Docker stores keys for private registries in the `$HOME/.dockercfg` or `$HOME/.docker/config.json` file.  If you put the same file
in the search paths list below, kubelet uses it as the credential provider when pulling images.
-->
Docker 将私有仓库的密钥保存在 `$HOME/.dockercfg` 或 `$HOME/.docker/config.json`
文件中。如果你将相同的文件放在下面所列的搜索路径中，`kubelet` 会在拉取镜像时将其用作凭据
数据来源：

<!--
* `{--root-dir:-/var/lib/kubelet}/config.json`
* `{cwd of kubelet}/config.json`
* `${HOME}/.docker/config.json`
* `/.docker/config.json`
* `{--root-dir:-/var/lib/kubelet}/.dockercfg`
* `{cwd of kubelet}/.dockercfg`
* `${HOME}/.dockercfg`
* `/.dockercfg`
-->
* `{--root-dir:-/var/lib/kubelet}/config.json`
* `{kubelet 当前工作目录}/config.json`
* `${HOME}/.docker/config.json`
* `/.docker/config.json`
* `{--root-dir:-/var/lib/kubelet}/.dockercfg`
* `{kubelet 当前工作目录}/.dockercfg`
* `${HOME}/.dockercfg`
* `/.dockercfg`

<!--
You may have to set `HOME=/root` explicitly in the environment of the kubelet process.
-->
{{< note >}}
你可能不得不为 `kubelet` 进程显式地设置 `HOME=/root` 环境变量。
{{< /note >}}

<!--
Here are the recommended steps to configuring your nodes to use a private registry.  In this
example, run these on your desktop/laptop:
-->
推荐采用如下步骤来配置节点以便访问私有仓库。以下示例中，在 PC 或笔记本电脑中操作：

<!--
1. Run `docker login [server]` for each set of credentials you want to use.  This updates `$HOME/.docker/config.json` on your PC.
1. View `$HOME/.docker/config.json` in an editor to ensure it contains only the credentials you want to use.
1. Get a list of your nodes; for example:
      - if you want the names: `nodes=$( kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}' )`
      - if you want to get the IP addresses: `nodes=$( kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}' )`
1. Copy your local `.docker/config.json` to one of the search paths list above.
      - for example, to test this out: `for n in $nodes; do scp ~/.docker/config.json root@"$n":/var/lib/kubelet/config.json; done`
-->
1. 针对你要使用的每组凭据，运行 `docker login [服务器]` 命令。这会更新
   你本地环境中的 `$HOME/.docker/config.json` 文件。
1. 在编辑器中打开查看 `$HOME/.docker/config.json` 文件，确保其中仅包含你要
   使用的凭据信息。
1. 获得节点列表；例如：

   - 如果想要节点名称：`nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`

   - 如果想要节点 IP ，`nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`

1. 将本地的 `.docker/config.json` 拷贝到所有节点，放入如上所列的目录之一：
   - 例如，可以试一下：`for n in $nodes; do scp ~/.docker/config.json root@"$n":/var/lib/kubelet/config.json; done`

<!--
For production clusters, use a configuration management tool so that you can apply this
setting to all the nodes where you need it.
-->
{{< note >}}
对于产品环境的集群，可以使用配置管理工具来将这些设置应用到
你所期望的节点上。
{{< /note >}}

<!--
Verify by creating a Pod that uses a private image; for example:
-->
创建使用私有镜像的 Pod 来验证。例如：

```shell
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
```

输出类似于：

```
pod/private-image-test-1 created
```

<!--
If everything is working, then, after a few moments, you can run:

```shell
kubectl logs private-image-test-1
```
and see that the command outputs:
```
SUCCESS
```
-->
如果一切顺利，那么一段时间后你可以执行：
```shell
kubectl logs private-image-test-1
```
然后可以看到命令的输出：
```
SUCCESS
```

<!--
If you suspect that the command failed, you can run:
-->
如果你怀疑命令失败了，你可以运行：

```shell
kubectl describe pods/private-image-test-1 | grep 'Failed'
```

<!--
In case of failure, the output is similar to:
-->
如果命令确实失败，输出类似于：

```
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```

<!--
You must ensure all nodes in the cluster have the same `.docker/config.json`.  Otherwise, pods will run on
some nodes and fail to run on others.  For example, if you use node autoscaling, then each instance
template needs to include the `.docker/config.json` or mount a drive that contains it.

All pods will have read access to images in any private registry once private
registry keys are added to the `.docker/config.json`.
-->
你必须确保集群中所有节点的 `.docker/config.json` 文件内容相同。
否则，Pod 会能在一些节点上正常运行而无法在另一些节点上启动。
例如，如果使用节点自动扩缩，那么每个实例模板都需要包含 `.docker/config.json`，
或者挂载一个包含该文件的驱动器。

在 `.docker/config.json` 中配置了私有仓库密钥后，所有 Pod 都将能读取私有仓库中的镜像。

<!--
### Pre-pulled images
-->
### 提前拉取镜像   {#pre-pulled-images}

<!--
This approach is suitable if you can control node configuration.  It
will not work reliably if your cloud provider manages nodes and replaces
them automatically.
-->
{{< note >}}
该方法适用于你能够控制节点配置的场合。
如果你的云供应商负责管理节点并自动置换节点，这一方案无法可靠地工作。
{{< /note >}}

<!--
By default, the kubelet tries to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).
-->
默认情况下，`kubelet` 会尝试从指定的仓库拉取每个镜像。
但是，如果容器属性 `imagePullPolicy` 设置为 `IfNotPresent` 或者 `Never`，
则会优先使用（对应 `IfNotPresent`）或者一定使用（对应 `Never`）本地镜像。

<!--
If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.

All pods will have read access to any pre-pulled images.
-->
如果你希望使用提前拉取镜像的方法代替仓库认证，就必须保证集群中所有节点提前拉取的镜像是相同的。

这一方案可以用来提前载入指定的镜像以提高速度，或者作为向私有仓库执行身份认证的一种替代方案。

所有的 Pod 都可以使用节点上提前拉取的镜像。

<!--
### Specifying imagePullSecrets on a Pod
-->
### 在 Pod 上指定 ImagePullSecrets   {#specifying-imagepullsecrets-on-a-pod}

<!--
This is the recommended approach to run containers based on images
in private registries.
-->
{{< note >}}
运行使用私有仓库中镜像的容器时，建议使用这种方法。
{{< /note >}}

<!--
Kubernetes supports specifying container image registry keys on a Pod.
-->
Kubernetes 支持在 Pod 中设置容器镜像仓库的密钥。

<!--
#### Creating a Secret with a Docker config

Run the following command, substituting the appropriate uppercase values:
-->
#### 使用 Docker Config 创建 Secret   {#creating-a-secret-with-docker-config}

运行以下命令，将大写字母代替为合适的值：

```shell
kubectl create secret docker-registry <名称> \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-password=DOCKER_PASSWORD \
  --docker-email=DOCKER_EMAIL
```

<!--
If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) explains how to set this up.
-->
如果你已经有 Docker 凭据文件，则可以将凭据文件导入为 Kubernetes
{{< glossary_tooltip text="Secret" term_id="secret" >}}，
而不是执行上面的命令。
[基于已有的 Docker 凭据创建 Secret](/zh/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
解释了如何完成这一操作。

<!--
This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.
-->
如果你在使用多个私有容器仓库，这种技术将特别有用。
原因是 `kubectl create secret docker-registry` 创建的是仅适用于某个私有仓库的 Secret。

<!--
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
-->
{{< note >}}
Pod 只能引用位于自身所在名字空间中的 Secret，因此需要针对每个名字空间
重复执行上述过程。
{{< /note >}}

<!--
#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a Pod definition.

For example:
-->
#### 在 Pod 中引用 ImagePullSecrets

现在，在创建 Pod 时，可以在 Pod 定义中增加 `imagePullSecrets` 部分来引用该 Secret。

例如：

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
in a [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/) resource.

Check [Add ImagePullSecrets to a Service Account](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) for detailed instructions.

You can use this in conjunction with a per-node `.docker/config.json`.  The credentials
will be merged.
-->
你需要对使用私有仓库的每个 Pod 执行以上操作。
不过，设置该字段的过程也可以通过为
[服务账号](/zh/docs/tasks/configure-pod-container/configure-service-account/)
资源设置 `imagePullSecrets` 来自动完成。
有关详细指令可参见
[将 ImagePullSecrets 添加到服务账号](/zh/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)。

你也可以将此方法与节点级别的 `.docker/config.json` 配置结合使用。
来自不同来源的凭据会被合并。

<!--
## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.
-->
## 使用案例  {#use-cases}

配置私有仓库有多种方案，以下是一些常用场景和建议的解决方案。

<!--
1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images on the Docker hub.
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves availability and reduces the time to pull images.
-->
1. 集群运行非专有镜像（例如，开源镜像）。镜像不需要隐藏。
   - 使用 Docker hub 上的公开镜像
     - 无需配置
     - 某些云厂商会自动为公开镜像提供高速缓存，以便提升可用性并缩短拉取镜像所需时间

<!--
1. Cluster running some proprietary images which should be hidden to those outside the company, but
   visible to all cluster users.
   - Use a hosted private [Docker registry](https://docs.docker.com/registry/).
     - It may be hosted on the [Docker Hub](https://hub.docker.com/signup), or elsewhere.
     - Manually configure .docker/config.json on each node as described above.
   - Or, run an internal private registry behind your firewall with open read access.
     - No Kubernetes configuration is required.
   - Use a hosted container image registry service that controls image access
     - It will work better with cluster autoscaling than manual node configuration.
   - Or, on a cluster where changing the node configuration is inconvenient, use `imagePullSecrets`.
-->
2. 集群运行一些专有镜像，这些镜像需要对公司外部隐藏，对所有集群用户可见
   - 使用托管的私有 [Docker 仓库](https://docs.docker.com/registry/)。
     - 可以托管在 [Docker Hub](https://hub.docker.com/account/signup/) 或者其他地方
     - 按照上面的描述，在每个节点上手动配置 `.docker/config.json` 文件
   - 或者，在防火墙内运行一个组织内部的私有仓库，并开放读取权限
     - 不需要配置 Kubenretes
   - 使用控制镜像访问的托管容器镜像仓库服务
     - 与手动配置节点相比，这种方案能更好地处理集群自动扩缩容
   - 或者，在不方便更改节点配置的集群中，使用 `imagePullSecrets`

<!--
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
-->
3. 集群使用专有镜像，且有些镜像需要更严格的访问控制
   - 确保 [AlwaysPullImages 准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)被启用。否则，所有 Pod 都可以使用所有镜像。
   - 确保将敏感数据存储在 Secret 资源中，而不是将其打包在镜像里

<!--
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.
-->
4. 集群是多租户的并且每个租户需要自己的私有仓库
   - 确保 [AlwaysPullImages 准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。否则，所有租户的所有的 Pod 都可以使用所有镜像。
   - 为私有仓库启用鉴权
   - 为每个租户生成访问仓库的凭据，放置在 Secret 中，并将 Secrert 发布到各租户的命名空间下。
   - 租户将 Secret 添加到每个名字空间中的 imagePullSecrets

<!--
If you need access to multiple registries, you can create one secret for each registry.
Kubelet will merge any `imagePullSecrets` into a single virtual `.docker/config.json`
-->
如果你需要访问多个仓库，可以为每个仓库创建一个 Secret。
`kubelet` 将所有 `imagePullSecrets` 合并为一个虚拟的 `.docker/config.json` 文件。


## {{% heading "whatsnext" %}}

<!--
* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
-->
* 阅读 [OCI Image Manifest 规范](https://github.com/opencontainers/image-spec/blob/master/manifest.md)

