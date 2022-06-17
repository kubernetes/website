---
title: 映象
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
容器映象（Image）所承載的是封裝了應用程式及其所有軟體依賴的二進位制資料。
容器映象是可執行的軟體包，可以單獨執行；該軟體包對所處的執行時環境具有
良定（Well Defined）的假定。

你通常會建立應用的容器映象並將其推送到某倉庫（Registry），然後在
{{< glossary_tooltip text="Pod" term_id="pod" >}} 中引用它。

本頁概要介紹容器映象的概念。

<!-- body -->

<!--
## Image names

Container images are usually given a name such as `pause`, `example/mycontainer`, or `kube-apiserver`.
Images can also include a registry hostname; for example: `fictional.registry.example/imagename`,
and possibly a port number as well; for example: `fictional.registry.example:10443/imagename`.

If you don't specify a registry hostname, Kubernetes assumes that you mean the Docker public registry.

After the image name part you can add a _tag_ (in the same way you would when using with commands like `docker` or `podman`).
Tags let you identify different versions of the same series of images.
-->
## 映象名稱    {#image-names}

容器映象通常會被賦予 `pause`、`example/mycontainer` 或者 `kube-apiserver` 這類的名稱。
映象名稱也可以包含所在倉庫的主機名。例如：`fictional.registry.example/imagename`。
還可以包含倉庫的埠號，例如：`fictional.registry.example:10443/imagename`。

如果你不指定倉庫的主機名，Kubernetes 認為你在使用 Docker 公共倉庫。

在映象名稱之後，你可以新增一個標籤（Tag）（與使用 `docker` 或 `podman` 等命令時的方式相同）。
使用標籤能讓你辨識同一映象序列中的不同版本。

<!--
Image tags consist of lowercase and uppercase letters, digits, underscores (`_`),
periods (`.`), and dashes (`-`).  
There are additional rules about where you can place the separator
characters (`_`, `-`, and `.`) inside an image tag.  
If you don't specify a tag, Kubernetes assumes you mean the tag `latest`.
-->
映象標籤可以包含小寫字母、大寫字母、數字、下劃線（`_`）、句點（`.`）和連字元（`-`）。
關於在映象標籤中何處可以使用分隔字元（`_`、`-` 和 `.`）還有一些額外的規則。
如果你不指定標籤，Kubernetes 認為你想使用標籤 `latest`。

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
## 更新映象  {#updating-images}

當你最初建立一個 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}、
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}、Pod
或者其他包含 Pod 模板的物件時，如果沒有顯式設定的話，Pod 中所有容器的預設映象
拉取策略是 `IfNotPresent`。這一策略會使得
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
在映象已經存在的情況下直接略過拉取映象的操作。

<!--
### Image pull policy

The `imagePullPolicy` for a container and the tag of the image affect when the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) attempts to pull (download) the specified image.

Here's a list of the values you can set for `imagePullPolicy` and the effects
these values have:
-->
### 映象拉取策略   {#image-pull-policy}

容器的 `imagePullPolicy` 和映象的標籤會影響 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 嘗試拉取（下載）指定的映象。

以下列表包含了 `imagePullPolicy` 可以設定的值，以及這些值的效果：

<!--
`IfNotPresent`
: the image is pulled only if it is not already present locally.

`Always`
: every time the kubelet launches a container, the kubelet queries the container
  image registry to resolve the name to an image
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier). If the kubelet has a
  container image with that exact digest cached locally, the kubelet uses its cached
  image; otherwise, the kubelet pulls the image with the resolved digest,
  and uses that image to launch the container.

`Never`
: the kubelet does not try fetching the image. If the image is somehow already present
  locally, the kubelet attempts to start the container; otherwise, startup fails.
  See [pre-pulled images](#pre-pulled-images) for more details.
-->
`IfNotPresent`
: 只有當映象在本地不存在時才會拉取。

`Always`
: 每當 kubelet 啟動一個容器時，kubelet 會查詢容器的映象倉庫，
  將名稱解析為一個映象[摘要](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)。
  如果 kubelet 有一個容器映象，並且對應的摘要已在本地快取，kubelet 就會使用其快取的映象；
  否則，kubelet 就會使用解析後的摘要拉取映象，並使用該映象來啟動容器。

`Never`
: Kubelet 不會嘗試獲取映象。如果映象已經以某種方式存在本地，
  kubelet 會嘗試啟動容器；否則，會啟動失敗。
  更多細節見[提前拉取映象](#pre-pulled-images)。

<!--
The caching semantics of the underlying image provider make even
`imagePullPolicy: Always` efficient, as long as the registry is reliably accessible.
Your container runtime can notice that the image layers already exist on the node
so that they don't need to be downloaded again.
-->
只要能夠可靠地訪問映象倉庫，底層映象提供者的快取語義甚至可以使 `imagePullPolicy: Always` 高效。
你的容器執行時可以注意到節點上已經存在的映象層，這樣就不需要再次下載。

<!--
You should avoid using the `:latest` tag when deploying containers in production as
it is harder to track which version of the image is running and more difficult to
roll back properly.

Instead, specify a meaningful tag such as `v1.42.0`.

To make sure the Pod always uses the same version of a container image, you can specify
the image's digest;
replace `<image-name>:<tag>` with `<image-name>@<digest>`
(for example, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).
-->
{{< note >}}
在生產環境中部署容器時，你應該避免使用 `:latest` 標籤，因為這使得正在執行的映象的版本難以追蹤，並且難以正確地回滾。

相反，應指定一個有意義的標籤，如 `v1.42.0`。
{{< /note >}}

為了確保 Pod 總是使用相同版本的容器映象，你可以指定映象的摘要；
將 `<image-name>:<tag>` 替換為 `<image-name>@<digest>`，例如 `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`。

<!--
When using image tags, if the image registry were to change the code that the tag on that image represents, you might end up with a mix of Pods running the old and new code. An image digest uniquely identifies a specific version of the image, so Kubernetes runs the same code every time it starts a container with that image name and digest specified. Specifying an image by digest fixes the code that you run so that a change at the registry cannot lead to that mix of versions.

There are third-party [admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
that mutate Pods (and pod templates) when they are created, so that the
running workload is defined based on an image digest rather than a tag.
That might be useful if you want to make sure that all your workload is
running the same code no matter what tag changes happen at the registry.
-->
當使用映象標籤時，如果映象倉庫修改了程式碼所對應的映象標籤，可能會出現新舊程式碼混雜在 Pod 中執行的情況。
映象摘要唯一標識了映象的特定版本，因此 Kubernetes 每次啟動具有指定映象名稱和摘要的容器時，都會執行相同的程式碼。
透過摘要指定映象可固定你執行的程式碼，這樣映象倉庫的變化就不會導致版本的混雜。

有一些第三方的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
在建立 Pod（和 Pod 模板）時產生變更，這樣執行的工作負載就是根據映象摘要，而不是標籤來定義的。
無論映象倉庫上的標籤發生什麼變化，你都想確保你所有的工作負載都執行相同的程式碼，那麼指定映象摘要會很有用。

<!-- 
#### Default image pull policy {#imagepullpolicy-defaulting}

When you (or a controller) submit a new Pod to the API server, your cluster sets the
`imagePullPolicy` field when specific conditions are met:
-->
#### 預設映象拉取策略    {#imagepullpolicy-defaulting}

當你（或控制器）向 API 伺服器提交一個新的 Pod 時，你的叢集會在滿足特定條件時設定 `imagePullPolicy `欄位：

<!--
- if you omit the `imagePullPolicy` field, and the tag for the container image is
  `:latest`, `imagePullPolicy` is automatically set to `Always`;
- if you omit the `imagePullPolicy` field, and you don't specify the tag for the
  container image, `imagePullPolicy` is automatically set to `Always`;
- if you omit the `imagePullPolicy` field, and you specify the tag for the
  container image that isn't `:latest`, the `imagePullPolicy` is automatically set to
  `IfNotPresent`.
-->
- 如果你省略了 `imagePullPolicy` 欄位，並且容器映象的標籤是 `:latest`，
  `imagePullPolicy` 會自動設定為 `Always`。
- 如果你省略了 `imagePullPolicy` 欄位，並且沒有指定容器映象的標籤，
  `imagePullPolicy` 會自動設定為 `Always`。
- 如果你省略了 `imagePullPolicy` 欄位，並且為容器映象指定了非 `:latest` 的標籤，
  `imagePullPolicy` 就會自動設定為 `IfNotPresent`。

{{< note >}}
<!--
The value of `imagePullPolicy` of the container is always set when the object is
first _created_, and is not updated if the image's tag later changes.

For example, if you create a Deployment with an image whose tag is _not_
`:latest`, and later update that Deployment's image to a `:latest` tag, the
`imagePullPolicy` field will _not_ change to `Always`. You must manually change
the pull policy of any object after its initial creation.
-->
容器的 `imagePullPolicy` 的值總是在物件初次 _建立_ 時設定的，如果後來映象的標籤發生變化，則不會更新。

例如，如果你用一個 _非_ `:latest` 的映象標籤建立一個 Deployment，
並在隨後更新該 Deployment 的映象標籤為 `:latest`，則 `imagePullPolicy` 欄位 _不會_ 變成 `Always`。
你必須手動更改已經建立的資源的拉取策略。
{{< /note >}}

<!--
#### Required image pull

If you would like to always force a pull, you can do one of the following:

- Set the `imagePullPolicy` of the container to `Always`.
- Omit the `imagePullPolicy` and use `:latest` as the tag for the image to use;
  Kubernetes will set the policy to `Always` when you submit the Pod.
- Omit the `imagePullPolicy` and the tag for the image to use;
  Kubernetes will set the policy to `Always` when you submit the Pod.
- Enable the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller.
-->
#### 必要的映象拉取   {#required-image-pull}

如果你想總是強制執行拉取，你可以使用下述的一中方式：

- 設定容器的 `imagePullPolicy` 為 `Always`。
- 省略 `imagePullPolicy`，並使用 `:latest` 作為映象標籤；
  當你提交 Pod 時，Kubernetes 會將策略設定為 `Always`。
- 省略 `imagePullPolicy` 和映象的標籤；
  當你提交 Pod 時，Kubernetes 會將策略設定為 `Always`。
- 啟用准入控制器 [AlwaysPullImages](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。


<!--
### ImagePullBackOff

When a kubelet starts creating containers for a Pod using a container runtime,
it might be possible the container is in [Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)
state because of `ImagePullBackOff`.
-->
### ImagePullBackOff

當 kubelet 使用容器執行時建立 Pod 時，容器可能因為 `ImagePullBackOff` 導致狀態為
[Waiting](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting)。

<!--
The status `ImagePullBackOff` means that a container could not start because Kubernetes
could not pull a container image (for reasons such as invalid image name, or pulling
from a private registry without `imagePullSecret`). The `BackOff` part indicates
that Kubernetes will keep trying to pull the image, with an increasing back-off delay.

Kubernetes raises the delay between each attempt until it reaches a compiled-in limit,
which is 300 seconds (5 minutes).
-->
`ImagePullBackOff` 狀態意味著容器無法啟動，
因為 Kubernetes 無法拉取容器映象（原因包括無效的映象名稱，或從私有倉庫拉取而沒有 `imagePullSecret`）。
 `BackOff` 部分表示 Kubernetes 將繼續嘗試拉取映象，並增加回退延遲。

Kubernetes 會增加每次嘗試之間的延遲，直到達到編譯限制，即 300 秒（5 分鐘）。

<!--
## Multi-architecture images with image indexes

As well as providing binary images, a container registry can also serve a [container image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md). An image index can point to multiple [image manifests](https://github.com/opencontainers/image-spec/blob/master/manifest.md) for architecture-specific versions of a container. The idea is that you can have a name for an image (for example: `pause`, `example/mycontainer`, `kube-apiserver`) and allow different systems to fetch the right binary image for the machine architecture they are using.

Kubernetes itself typically names container images with a suffix `-$(ARCH)`. For backward compatibility, please generate the older images with suffixes. The idea is to generate say `pause` image which has the manifest for all the arch(es) and say `pause-amd64` which is backwards compatible for older configurations or YAML files which may have hard coded the images with suffixes.
-->
## 帶映象索引的多架構映象  {#multi-architecture-images-with-image-indexes}

除了提供二進位制的映象之外，容器倉庫也可以提供
[容器映象索引](https://github.com/opencontainers/image-spec/blob/master/image-index.md)。
映象索引可以根據特定於體系結構版本的容器指向映象的多個
[映象清單](https://github.com/opencontainers/image-spec/blob/master/manifest.md)。
這背後的理念是讓你可以為映象命名（例如：`pause`、`example/mycontainer`、`kube-apiserver`）
的同時，允許不同的系統基於它們所使用的機器體系結構取回正確的二進位制映象。

Kubernetes 自身通常在命名容器映象時新增字尾 `-$(ARCH)`。
為了向前相容，請在生成較老的映象時也提供字尾。
這裡的理念是為某映象（如 `pause`）生成針對所有平臺都適用的清單時，
生成 `pause-amd64` 這類映象，以便較老的配置檔案或者將映象字尾影編碼到其中的
YAML 檔案也能相容。

<!--
## Using a private registry

Private registries may require keys to read images from them.  
Credentials can be provided in several ways:
-->
## 使用私有倉庫   {#using-a-private-registry}

從私有倉庫讀取映象時可能需要金鑰。
憑證可以用以下方式提供:

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
- 配置節點向私有倉庫進行身份驗證
  - 所有 Pod 均可讀取任何已配置的私有倉庫
  - 需要叢集管理員配置節點
- 預拉映象
  - 所有 Pod 都可以使用節點上快取的所有映象
  - 需要所有節點的 root 訪問許可權才能進行設定
- 在 Pod 中設定 ImagePullSecrets
  - 只有提供自己金鑰的 Pod 才能訪問私有倉庫
- 特定於廠商的擴充套件或者本地擴充套件
  - 如果你在使用定製的節點配置，你（或者雲平臺提供商）可以實現讓節點
    向容器倉庫認證的機制

<!--
These options are explained in more detail below.
-->
下面將詳細描述每一項。

<!--
### Configuring nodes to authenticate to a private registry

Specific instructions for setting credentials depends on the container runtime and registry you chose to use. You should refer to your solution's documentation for the most accurate information.
-->
### 配置 Node 對私有倉庫認證

設定憑據的具體說明取決於你選擇使用的容器執行時和倉庫。
你應該參考解決方案的文件來獲取最準確的資訊。

<!--
Default Kubernetes only supports the `auths` and `HttpHeaders` section in Docker configuration.
Docker credential helpers (`credHelpers` or `credsStore`) are not supported.
-->
{{< note >}}
Kubernetes 預設僅支援 Docker 配置中的 `auths` 和 `HttpHeaders` 部分，
不支援 Docker 憑據輔助程式（`credHelpers` 或 `credsStore`）。
{{< /note >}}

<!--
For an example of configuring a private container image registry, see the
[Pull an Image from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry)
task. That example uses a private registry in Docker Hub.
-->
有關配置私有容器映象倉庫的示例，請參閱任務
[從私有映象庫中提取影象](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry)。
該示例使用 Docker Hub 中的私有登錄檔。

<!--
### Interpretation of config.json {#config-json}
-->
### config.json 說明 {#config-json}

<!--
The interpretation of `config.json` varies between the original Docker
implementation and the Kubernetes interpretation. In Docker, the `auths` keys
can only specify root URLs, whereas Kubernetes allows glob URLs as well as
prefix-matched paths. This means that a `config.json` like this is valid:
-->
對於 `config.json` 的解釋在原始 Docker 實現和 Kubernetes 的解釋之間有所不同。
在 Docker 中，`auths` 鍵只能指定根 URL ，而 Kubernetes 允許 glob URLs 以及
字首匹配的路徑。這意味著，像這樣的 `config.json` 是有效的：
```json
{
    "auths": {
        "*my-registry.io/images": {
            "auth": "…"
        }
    }
}
```

<!--
The root URL (`*my-registry.io`) is matched by using the following syntax:

```
pattern:
    { term }

term:
    '*'         matches any sequence of non-Separator characters
    '?'         matches any single non-Separator character
    '[' [ '^' ] { character-range } ']'
                character class (must be non-empty)
    c           matches character c (c != '*', '?', '\\', '[')
    '\\' c      matches character c

character-range:
    c           matches character c (c != '\\', '-', ']')
    '\\' c      matches character c
    lo '-' hi   matches character c for lo <= c <= hi
```
-->
使用以下語法匹配根 URL （`*my-registry.io`）：
```
pattern:
    { term }

term:
    '*'         匹配任何無分隔符字元序列
    '?'         匹配任意單個非分隔符
    '[' [ '^' ] 字元範圍
                  字符集（必須非空）
    c           匹配字元 c （c 不為 '*','?','\\','['）
    '\\' c      匹配字元 c

字元範圍: 
    c           匹配字元 c （c 不為 '\\','?','-',']'）
    '\\' c      匹配字元 c
    lo '-' hi   匹配字元範圍在 lo 到 hi 之間字元
```

<!--
Image pull operations would now pass the credentials to the CRI container
runtime for every valid pattern. For example the following container image names
would match successfully:

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`
- `a.sub.my-registry.io/images/my-image`
-->
現在映象拉取操作會將每種有效模式的憑據都傳遞給 CRI 容器執行時。例如下面的容器映象名稱會匹配成功：

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`
- `a.sub.my-registry.io/images/my-image`

<!--
The kubelet performs image pulls sequentially for every found credential. This
means, that multiple entries in `config.json` are possible, too:
-->
kubelet 為每個找到的憑證的映象按順序拉取。 這意味著在 `config.json` 中可能有多項：

```json
{
    "auths": {
        "my-registry.io/images": {
            "auth": "…"
        },
        "my-registry.io/images/subpath": {
            "auth": "…"
        }
    }
}
```

<!--
If now a container specifies an image `my-registry.io/images/subpath/my-image`
to be pulled, then the kubelet will try to download them from both
authentication sources if one of them fails.
-->
如果一個容器指定了要拉取的映象 `my-registry.io/images/subpath/my-image`，
並且其中一個失敗，kubelet 將嘗試從另一個身份驗證源下載映象。

<!--
### Pre-pulled images
-->
### 提前拉取映象   {#pre-pulled-images}

<!--
This approach is suitable if you can control node configuration.  It
will not work reliably if your cloud provider manages nodes and replaces
them automatically.
-->
{{< note >}}
該方法適用於你能夠控制節點配置的場合。
如果你的雲供應商負責管理節點並自動置換節點，這一方案無法可靠地工作。
{{< /note >}}

<!--
By default, the kubelet tries to pull each image from the specified registry.
However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`,
then a local image is used (preferentially or exclusively, respectively).
-->
預設情況下，`kubelet` 會嘗試從指定的倉庫拉取每個映象。
但是，如果容器屬性 `imagePullPolicy` 設定為 `IfNotPresent` 或者 `Never`，
則會優先使用（對應 `IfNotPresent`）或者一定使用（對應 `Never`）本地映象。

<!--
If you want to rely on pre-pulled images as a substitute for registry authentication,
you must ensure all nodes in the cluster have the same pre-pulled images.

This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.

All pods will have read access to any pre-pulled images.
-->
如果你希望使用提前拉取映象的方法代替倉庫認證，就必須保證叢集中所有節點提前拉取的映象是相同的。

這一方案可以用來提前載入指定的映象以提高速度，或者作為向私有倉庫執行身份認證的一種替代方案。

所有的 Pod 都可以使用節點上提前拉取的映象。

<!--
### Specifying imagePullSecrets on a Pod
-->
### 在 Pod 上指定 ImagePullSecrets   {#specifying-imagepullsecrets-on-a-pod}

<!--
This is the recommended approach to run containers based on images
in private registries.
-->
{{< note >}}
執行使用私有倉庫中映象的容器時，建議使用這種方法。
{{< /note >}}

<!--
Kubernetes supports specifying container image registry keys on a Pod.
-->
Kubernetes 支援在 Pod 中設定容器映象倉庫的金鑰。

<!--
#### Creating a Secret with a Docker config

You need to know the username, registry password and client email address for authenticating
to the registry, as well as its hostname.
Run the following command, substituting the appropriate uppercase values:
-->
#### 使用 Docker Config 建立 Secret   {#creating-a-secret-with-docker-config}

你需要知道用於向倉庫進行身份驗證的使用者名稱、密碼和客戶端電子郵件地址，以及它的主機名。
執行以下命令，注意替換適當的大寫值：

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

<!--
If you already have a Docker credentials file then, rather than using the above
command, you can import the credentials file as a Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.  
[Create a Secret based on existing Docker credentials](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) explains how to set this up.
-->
如果你已經有 Docker 憑據檔案，則可以將憑據檔案匯入為 Kubernetes
{{< glossary_tooltip text="Secret" term_id="secret" >}}，
而不是執行上面的命令。
[基於已有的 Docker 憑據建立 Secret](/zh-cn/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)
解釋瞭如何完成這一操作。

<!--
This is particularly useful if you are using multiple private container
registries, as `kubectl create secret docker-registry` creates a Secret that
only works with a single private registry.
-->
如果你在使用多個私有容器倉庫，這種技術將特別有用。
原因是 `kubectl create secret docker-registry` 建立的是僅適用於某個私有倉庫的 Secret。

<!--
Pods can only reference image pull secrets in their own namespace,
so this process needs to be done one time per namespace.
-->
{{< note >}}
Pod 只能引用位於自身所在名字空間中的 Secret，因此需要針對每個名字空間
重複執行上述過程。
{{< /note >}}

<!--
#### Referring to an imagePullSecrets on a Pod

Now, you can create pods which reference that secret by adding an `imagePullSecrets`
section to a Pod definition.

For example:
-->
#### 在 Pod 中引用 ImagePullSecrets

現在，在建立 Pod 時，可以在 Pod 定義中增加 `imagePullSecrets` 部分來引用該 Secret。

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
你需要對使用私有倉庫的每個 Pod 執行以上操作。
不過，設定該欄位的過程也可以透過為
[服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
資源設定 `imagePullSecrets` 來自動完成。
有關詳細指令可參見
[將 ImagePullSecrets 新增到服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)。

你也可以將此方法與節點級別的 `.docker/config.json` 配置結合使用。
來自不同來源的憑據會被合併。

<!--
## Use cases

There are a number of solutions for configuring private registries.  Here are some
common use cases and suggested solutions.
-->
## 使用案例  {#use-cases}

配置私有倉庫有多種方案，以下是一些常用場景和建議的解決方案。

<!--
1. Cluster running only non-proprietary (e.g. open-source) images.  No need to hide images.
   - Use public images on the Docker hub.
     - No configuration required.
     - Some cloud providers automatically cache or mirror public images, which improves availability and reduces the time to pull images.
-->
1. 叢集執行非專有映象（例如，開源映象）。映象不需要隱藏。
   - 使用 Docker hub 上的公開映象
     - 無需配置
     - 某些雲廠商會自動為公開映象提供快取記憶體，以便提升可用性並縮短拉取映象所需時間

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
2. 叢集執行一些專有映象，這些映象需要對公司外部隱藏，對所有叢集使用者可見
   - 使用託管的私有 [Docker 倉庫](https://docs.docker.com/registry/)。
     - 可以託管在 [Docker Hub](https://hub.docker.com/account/signup/) 或者其他地方
     - 按照上面的描述，在每個節點上手動配置 `.docker/config.json` 檔案
   - 或者，在防火牆內執行一個組織內部的私有倉庫，並開放讀取許可權
     - 不需要配置 Kubenretes
   - 使用控制映象訪問的託管容器映象倉庫服務
     - 與手動配置節點相比，這種方案能更好地處理叢集自動擴縮容
   - 或者，在不方便更改節點配置的叢集中，使用 `imagePullSecrets`

<!--
1. Cluster with proprietary images, a few of which require stricter access control.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods potentially have access to all images.
   - Move sensitive data into a "Secret" resource, instead of packaging it in an image.
-->
3. 叢集使用專有映象，且有些映象需要更嚴格的訪問控制
   - 確保 [AlwaysPullImages 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)被啟用。否則，所有 Pod 都可以使用所有映象。
   - 確保將敏感資料儲存在 Secret 資源中，而不是將其打包在映象裡

<!--
1. A multi-tenant cluster where each tenant needs own private registry.
   - Ensure [AlwaysPullImages admission controller](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) is active. Otherwise, all Pods of all tenants potentially have access to all images.
   - Run a private registry with authorization required.
   - Generate registry credential for each tenant, put into secret, and populate secret to each tenant namespace.
   - The tenant adds that secret to imagePullSecrets of each namespace.
-->
4. 叢集是多租戶的並且每個租戶需要自己的私有倉庫
   - 確保 [AlwaysPullImages 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)。否則，所有租戶的所有的 Pod 都可以使用所有映象。
   - 為私有倉庫啟用鑑權
   - 為每個租戶生成訪問倉庫的憑據，放置在 Secret 中，並將 Secrert 釋出到各租戶的名稱空間下。
   - 租戶將 Secret 新增到每個名字空間中的 imagePullSecrets

<!--
If you need access to multiple registries, you can create one secret for each registry.
Kubelet will merge any `imagePullSecrets` into a single virtual `.docker/config.json`
-->
如果你需要訪問多個倉庫，可以為每個倉庫建立一個 Secret。
`kubelet` 將所有 `imagePullSecrets` 合併為一個虛擬的 `.docker/config.json` 檔案。


## {{% heading "whatsnext" %}}

<!--
* Read the [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md).
* Learn about [container image garbage collection](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
-->
* 閱讀 [OCI Image Manifest 規範](https://github.com/opencontainers/image-spec/blob/master/manifest.md)。
* 瞭解[容器映象垃圾收集](/zh-cn/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)。
