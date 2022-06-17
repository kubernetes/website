---
title: 從私有倉庫拉取映象
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
This page shows how to create a Pod that uses a
{{< glossary_tooltip text="Secret" term_id="secret" >}} to pull an image 
from a private container image registry or repository. There are many private 
registries in use. This task uses [Docker Hub](https://www.docker.com/products/docker-hub)
-->
本文介紹如何使用 {{< glossary_tooltip text="Secret" term_id="secret" >}} 
從私有的映象倉庫或程式碼倉庫拉取映象來建立 Pod。
有很多私有映象倉庫正在使用中。這個任務使用的映象倉庫是
[Docker Hub](https://www.docker.com/products/docker-hub)

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!--
* To do this exercise, you need the `docker` command line tool, and a
  [Docker ID](https://docs.docker.com/docker-id/) for which you know the password.
* If you are using a different private container registry, you need the command 
  line tool for that registry and any login information for the registry. 
-->

* 要進行此練習，你需要 `docker` 命令列工具和一個知道密碼的 
[Docker ID](https://docs.docker.com/docker-id/)。
* 如果你要使用不同的私有的映象倉庫，你需要有對應映象倉庫的命令列工具和登入資訊。

<!-- steps -->

<!--
## Log in to Docker

On your laptop, you must authenticate with a registry in order to pull a private image:
-->
## 登入 Docker 映象倉庫  {#log-in-to-docker}

在個人電腦上，要想拉取私有映象必須在映象倉庫上進行身份驗證。

```shell
docker login
```

<!--
When prompted, enter your Docker ID, and then the credential you want to use (access token,
or the password for your Docker ID).

The login process creates or updates a `config.json` file that holds an authorization token. Review [how Kubernetes interprets this file](/docs/concepts/containers/images#config-json). 

View the `config.json` file:
-->
當出現提示時，輸入你的 Docker ID 和登入憑證（訪問令牌、
或 Docker ID 的密碼）。

登入過程會建立或更新儲存有授權令牌的 `config.json` 檔案。
檢視 [Kubernetes 中如何解析這個檔案](/zh-cn/docs/concepts/containers/images#config-json)。

檢視 `config.json` 檔案：

```shell
cat ~/.docker/config.json
```

<!--
The output contains a section similar to this:
-->
輸出結果包含類似於以下內容的部分：

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
如果使用 Docker 憑證倉庫，則不會看到 `auth` 條目，看到的將是以倉庫名稱作為值的 `credsStore` 條目。
{{< /note >}}

<!--
## Create a Secret based on existing credentials {#registry-secret-existing-credentials}

A Kubernetes cluster uses the Secret of `kubernetes.io/dockerconfigjson` type to authenticate with
a container registry to pull a private image.

If you already ran `docker login`, you can copy
that credential into Kubernetes:
-->
## 建立一個基於現有憑證的 Secret  {#registry-secret-existing-credentials}

Kubernetes 叢集使用 `kubernetes.io/dockerconfigjson` 型別的
Secret 來透過映象倉庫的身份驗證，進而提取私有映象。

如果你已經運行了 `docker login` 命令，你可以複製該映象倉庫的憑證到 Kubernetes:

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
如果你需要更多的設定（例如，為新 Secret 設定名字空間或標籤），
則可以在儲存 Secret 之前對它進行自定義。
請務必：

- 將 data 項中的名稱設定為 `.dockerconfigjson`
- 使用 base64 編碼方法對 Docker 配置檔案進行編碼，然後貼上該字串的內容，作為欄位
  `data[".dockerconfigjson"]` 的值
- 將 `type` 設定為 `kubernetes.io/dockerconfigjson`

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
如果你收到錯誤訊息：`error: no objects passed to create`，
這可能意味著 base64 編碼的字串是無效的。 如果你收到類似
`Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`
的錯誤訊息，則表示資料中的 base64 編碼字串已成功解碼，但無法解析為 `.docker/config.json` 檔案。

<!--
## Create a Secret by providing credentials on the command line

Create this Secret, naming it `regcred`:
-->
## 在命令列上提供憑證來建立 Secret  {#create-a-secret-by-providing-credentials-on-the-command-line}

建立 Secret，命名為 `regcred`：

<!--
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
-->
```shell
kubectl create secret docker-registry regcred \
  --docker-server=<你的映象倉庫伺服器> \
  --docker-username=<你的使用者名稱> \
  --docker-password=<你的密碼> \
  --docker-email=<你的郵箱地址>
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
在這裡：

* `<your-registry-server>` 是你的私有 Docker 倉庫全限定域名（FQDN）。
  DockerHub 使用 `https://index.docker.io/v1/`。
* `<your-name>` 是你的 Docker 使用者名稱。
* `<your-pword>` 是你的 Docker 密碼。
* `<your-email>` 是你的 Docker 郵箱。

這樣你就成功地將叢集中的 Docker 憑證設定為名為 `regcred` 的 Secret。

<!--
Typing secrets on the command line may store them in your shell history unprotected, and
those secrets might also be visible to other users on your PC during the time that
`kubectl` is running.
-->
{{< note >}}
在命令列上鍵入 Secret 可能會將它們儲存在你的 shell 歷史記錄中而不受保護，
並且這些 Secret 資訊也可能在 `kubectl` 執行期間對你 PC 上的其他使用者可見。
{{< /note >}}

<!--
## Inspecting the Secret `regcred`

To understand the contents of the `regcred` Secret you created, start by viewing the Secret in YAML format:
-->
## 檢查 Secret `regcred`  {#inspecting-the-secret-regcred}

要了解你建立的 `regcred` Secret 的內容，可以用 YAML 格式進行檢視：

```shell
kubectl get secret regcred --output=yaml
```

<!-- The output is similar to this: -->
輸出和下面類似：

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
`.dockerconfigjson` 欄位的值是 Docker 憑證的 base64 表示。

要了解 `dockerconfigjson` 欄位中的內容，請將 Secret 資料轉換為可讀格式：

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

<!-- The output is similar to this: -->
輸出和下面類似：

```json
{"auths":{"yourprivateregistry.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

<!--
To understand what is in the `auth` field, convert the base64-encoded data to a readable format:
-->
要了解 `auth` 欄位中的內容，請將 base64 編碼過的資料轉換為可讀格式：

```shell
echo "c3R...zE2" | base64 --decode
```

<!--
The output, username and password concatenated with a `:`, is similar to this:
-->
輸出結果中，使用者名稱和密碼用 `:` 連結，類似下面這樣：

```none
janedoe:xxxxxxxxxxx
```

<!--
Notice that the Secret data contains the authorization token similar to your local `~/.docker/config.json` file.

You have successfully set your Docker credentials as a Secret called `regcred` in the cluster.
-->
注意，Secret 資料包含與本地 `~/.docker/config.json` 檔案類似的授權令牌。

這樣你就已經成功地將 Docker 憑證設定為叢集中的名為 `regcred` 的 Secret。

<!--
## Create a Pod that uses your Secret

Here is a manifest for an example Pod that needs access to your Docker credentials in `regcred`:
-->
## 建立一個使用你的 Secret 的 Pod  {#create-a-pod-that-uses-your-secret}

下面是一個 Pod 配置清單示例，該示例中 Pod 需要訪問你的 Docker 憑證 `regcred`：

{{< codenew file="pods/private-reg-pod.yaml" >}}

<!-- 
Download the above file onto your computer:
-->

將上述檔案下載到你的計算機中：

```shell
curl -L -O my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

<!--
In file `my-private-reg-pod.yaml`, replace `<your-private-image>` with the path to an image in a private registry such as:
-->
在`my-private-reg-pod.yaml` 檔案中，使用私有倉庫的映象路徑替換 `<your-private-image>`，例如：

```none
janedoe/jdoe-private:v1
```

<!--
To pull the image from the private registry, Kubernetes needs credentials.
The `imagePullSecrets` field in the configuration file specifies that
Kubernetes should get the credentials from a Secret named `regcred`.

Create a Pod that uses your Secret, and verify that the Pod is running:
-->
要從私有倉庫拉取映象，Kubernetes 需要憑證。
配置檔案中的 `imagePullSecrets` 欄位表明 Kubernetes 應該透過名為 `regcred` 的 Secret 獲取憑證。

建立使用了你的 Secret 的 Pod，並檢查它是否正常執行：

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
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

* 進一步瞭解 [Secrets](/zh-cn/docs/concepts/configuration/secret/)
  * 或閱讀 {{< api-reference page="config-and-storage-resources/secret-v1" >}} 的 API 參考
* 進一步瞭解 [使用私有倉庫](/zh-cn/docs/concepts/containers/images/#using-a-private-registry)
* 進一步瞭解 [為服務賬戶新增拉取映象憑證](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)
* 檢視 [kubectl 建立 docker-registry 憑證](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-)
* 檢視 Pod [容器定義](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers)中的 `imagePullSecrets` 欄位。
