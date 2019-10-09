---
approvers:
- erictune
- thockin
title: 镜像
content_template: templates/concept
---

{{% capture overview %}}

在Kubernetes pod中引用镜像前，请创建Docker镜像，并将之推送到镜像仓库中。
容器的“image”属性支持和Docker命令行相同的语法，包括私有仓库和标签。

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## 升级镜像
默认的镜像拉取策略是“IfNotPresent”，在镜像已经存在的情况下，kubelet将不在去拉取镜像。
如果总是想要拉取镜像，必须设置拉取策略为“Always”或者设置镜像标签为“:latest”。

如果没有指定镜像的标签，它会被假定为“:latest”,同时拉取策略为“Always”。

注意应避免使用“:latest”标签，参见 [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) 获取更多信息。

## 使用私有仓库

从私有仓库读取镜像时可能需要密钥。
凭证可以用以下方式提供:

  - 使用Google Container Registry
    - 每个集群分别配置
	- 在Google Compute Engine 或者 Google Kubernetes Engine上自动配置
	- 所有的pod都能读取项目的私有仓库
  - 使用 AWS EC2 Container Registry (ECR)
    - 使用IAM角色和策略来控制对ECR仓库的访问
	- 自动刷新ECR的登录凭证
  - 使用 Azure Container Registry (ACR)
  - 配置节点对私有仓库认证
    - 所有的pod都可以读取已配置的私有仓库
	- 需要集群管理员提供node的配置
  - 提前拉取镜像
	- 所有的pod都可以使用node上缓存的镜像
	- 需要以root进入node操作
  - pod上指定 ImagePullSecrets
    - 只有提供了密钥的pod才能接入私有仓库
下面将详细描述每一项


### 使用 Google Container Registry
Kuberetes运行在Google Compute Engine (GCE)时原生支持[Google ContainerRegistry (GCR)]
(https://cloud.google.com/tools/container-registry/)。如果kubernetes集群运行在GCE
或者Google Kubernetes Engine 上，使用镜像全名(e.g. gcr.io/my_project/image:tag)即可。

集群中的所有pod都会有读取这个仓库中镜像的权限。

Kubelet将使用实例的Google service account向GCR认证。实例的service account拥有
`https://www.googleapis.com/auth/devstorage.read_only`，所以它可以从项目的GCR拉取，但不能推送。
	
### 使用 AWS EC2 Container Registry

当Node是AWS EC2实例时，Kubernetes原生支持[AWS EC2 ContainerRegistry](https://aws.amazon.com/ecr/)。

在pod定义中，使用镜像全名即可 (例如 `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`)

集群中可以创建pod的用户都可以使用ECR中的任意镜像运行pod。

Kubelet会获取并且定期刷新ECR的凭证。它需要以下权限

- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:GetRepositoryPolicy`
- `ecr:DescribeRepositories`
- `ecr:ListImages`
- `ecr:BatchGetImage`

要求：

- 必须使用kubelet 1.2.0及以上版本
- 如果node在区域A，而镜像仓库在另一个区域B，需要1.3.0及以上版本
- 区域中必须提供ECR

诊断

- 验证是否满足以上要求
- 获取工作站的$REGION (例如 `us-west-2`)凭证，使用凭证SSH到主机手动运行docker，检查是否运行
- 验证kubelet是否使用参数`--cloud-provider=aws`运行
- 检查kubelet日志(例如 `journalctl -u kubelet`)，是否有类似的行
  - `plugins.go:56] Registering credential provider: aws-ecr-key`
  - `provider.go:91] Refreshing cache for provider: *aws_credentials.ecrProvider`

### 使用 Azure Container Registry (ACR)
当使用[Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)时，可以使用admin user或者service principal认证。
任何一种情况，认证都通过标准的Docker authentication完成。本指南假设使用[azure-cli](https://github.com/azure/azure-cli)
命令行工具。

首先，需要创建仓库并获取凭证，完整的文档请参考
[Azure container registry documentation](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli)。

创建好容器仓库后，可以使用以下凭证登录：

   * `DOCKER_USER` : service principal, or admin username
   * `DOCKER_PASSWORD`: service principal password, or admin user password
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`

填写以上变量后，就可以
[configure a Kubernetes Secret and use it to deploy a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)。


### 配置Nodes对私有仓库认证

**注意：** 如果在Google Kubernetes Engine 上运行集群，每个节点上都会有`.dockercfg`文件，它包含对Google Container Registry的凭证。
不需要使用以下方法。

**注意：** 如果在AWS EC2上运行集群且准备使用EC2 Container Registry (ECR)，每个node上的kubelet会管理和更新ECR的登录凭证。不需要使用以下方法。

**注意：** 该方法适用于能够对节点进行配置的情况。该方法在GCE及在其它能自动配置节点的云平台上并不适合。

Docker将私有仓库的密钥存放在`$HOME/.dockercfg`或`$HOME/.docker/config.json`文件中。Kubelet上，docker会使用root用户`$HOME`路径下的密钥。

推荐如下步骤来为node配置私有仓库。以下示例在PC或笔记本电脑中操作

   1.对于想要使用的每一种凭证，运行 `docker login [server]`，它会更新`$HOME/.docker/config.json`。
   1.使用编辑器查看`$HOME/.docker/config.json`，保证文件中包含了想要使用的凭证
   1.获取node列表，例如
     - 如果使用node名称，`nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
	 - 如果使用node IP ，`nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1.将本地的`.docker/config.json`拷贝到每个节点root用户目录下
     - 例如： `for n in $nodes; do scp ~/.docker/config.json root@$n:/root/.docker/config.json; done`
	 
创建使用私有仓库的pod来验证，例如：

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

如果一切正常，一段时间后，可以看到:

```shell
$ kubectl logs private-image-test-1
SUCCESS
```

如果失败，则可以看到：

```shell
$ kubectl describe pods/private-image-test-1 | grep "Failed"
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


必须保证集群中所有的节点都有相同的`.docker/config.json`文件。否则,pod会在一些节点上正常运行而在另一些节点上无法启动
例如，如果使用node自动弹缩，那么每个实例模板都需要包含`.docker/config.json`，或者挂载一个包含这个文件的驱动器。

在`.docker/config.json`中配置了私有仓库密钥后，所有pod都会能读取私有仓库中的镜像。

**该方法已在6月26日的docker私有仓库和kubernetes v0.19.3上测试通过，其他私有仓库，如quay.io应该也可以运行，但未测试过。**

### 提前拉取镜像

**注意：** 如果在Google Kubernetes Engine 上运行集群，每个节点上都会有`.dockercfg`文件，它包含对Google Container Registry的凭证。
不需要使用以下方法。

**注意：** 该方法适用于能够对节点进行配置的情况。该方法在GCE及在其它能自动配置节点的云平台上并不适合。

默认情况下，kubelet会尝试从指定的仓库拉取每一个镜像
但是，如果容器属性`imagePullPolicy`设置为`IfNotPresent`或者`Never`，
则会使用本地镜像（优先、唯一、分别）。

如果依赖提前拉取镜像代替仓库认证，
必须保证集群所有的节点提前拉取的镜像是相同的。

可以用于提前载入指定的镜像以提高速度，或者作为私有仓库认证的一种替代方案

所有的pod都可以使用node上缓存的镜像

### 在pod上指定ImagePullSecrets

**注意:** Google Kubernetes Engine,GCE及其他自动创建node的云平台上，推荐使用本方法。

Kubernetes支持在pod中指定仓库密钥。

#### 使用Docker Config创建Secret

运行以下命令，将大写字母代替为合适的值

```shell
$ kubectl create secret docker-registry myregistrykey --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
secret "myregistrykey" created.
```

如果需要接入多个仓库，可以为每个仓库创建一个secret。
当为pod拉取镜像时，kubelet会将`imagePullSecrets`合入一个独立虚拟的`.docker/config.json`。

Pod只能引用和它相同namespace的ImagePullSecrets，
所以需要为每一个namespace做配置

#### 通过kubectl创建secret

由于某种原因在一个`.docker/config.json`中需要多个项或者需要非上述命令给出的secret，可以[create a secret using
json or yaml](/docs/user-guide/secrets/#creating-a-secret-manually)。

请保证：

- 设置data项的名称为`.dockerconfigjson`
- 使用base64对docker文件编码，并将字符准确黏贴到`data[".dockerconfigjson"]`里
- 设置`type`为`kubernetes.io/dockerconfigjson`

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

如果收到错误消息`error: no objects passed to create`，可能是 base64 编码后的字符串非法。
如果收到错误消息类似`Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`,
说明数据已经解码成功，但是不满足`.docker/config.json`文件的语法。

#### 在pod中引用imagePullSecrets

现在，在创建pod时，可以在pod定义中增加`imagePullSecrets`小节来引用secret

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

对每一个使用私有仓库的pod，都需要做以上操作。

也可以在[serviceAccount](/docs/user-guide/service-accounts) 资源中设置imagePullSecrets自动设置`imagePullSecrets`

`imagePullSecrets`可以和每个node上的`.docker/config.json`一起使用，他们将共同生效。本方法在Google Kubernetes Engine
也能正常工作。

### 使用场景

配置私有仓库有多种方案，以下是一些常用场景和建议的解决方案。

1. 集群运行非专有（例如 开源镜像）镜像。镜像不需要隐藏。
   - 使用Docker hub上的公有镜像
    - 无需配置
    - 在GCE/GKE上会自动使用高稳定性和高速的Docker hub的本地mirror
1. 集群运行一些专有镜像，这些镜像对外部公司需要隐藏，对集群用户可见
   - 使用自主的私有[Docker registry](https://docs.docker.com/registry/).
     - 可以放置在[Docker Hub](https://hub.docker.com/account/signup/),或者其他地方。
	 - 按照上面的描述，在每个节点手动配置.docker/config.json
   - 或者，在防火墙内运行一个内置的私有仓库，并开放读取权限
     - 不需要配置Kubenretes
   - 或者，在GCE/GKE上时，使用项目的Google Container Registry
     - 使用集群自动伸缩比手动配置node工作的更好
   - 或者，在更改集群node配置不方便时，使用`imagePullSecrets`
1. 使用专有镜像的集群，有更严格的访问控制
   - 保证[AlwaysPullImages admission controller](/docs/admin/admission-controllers/#alwayspullimages)开启。否则，所有的pod都可以使用镜像
   - 将敏感数据存储在"Secret"资源中，而不是打包在镜像里
1. 多租户集群下，每个租户需要自己的私有仓库
   - 保证[AlwaysPullImages admission controller](/docs/admin/admission-controllers/#alwayspullimages)开启。否则，所有租户的所有的pod都可以使用镜像
   - 私有仓库开启认证
   - 为每个租户获取仓库凭证，放置在secret中，并发布到每个租户的namespace下
   - 租户将secret增加到每个namespace下的imagePullSecrets中

{{% /capture %}}


