---
title: 使用 Secret 安全地分發憑據
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---
<!--
title: Distribute Credentials Securely Using Secrets
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
-->

<!-- overview -->
<!--
This page shows how to securely inject sensitive data, such as passwords and
encryption keys, into Pods.
-->
本文展示如何安全地將敏感數據（如密碼和加密密鑰）注入到 Pod 中。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
### Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use a base64 encoding tool to convert your username and password to a base64 representation. Here's an example using the commonly available base64 program:
-->
### 將 Secret 數據轉換爲 base-64 形式   {#convert-your-secret-data-to-a-base64-representation}

假設使用者想要有兩條 Secret 數據：使用者名 `my-app` 和密碼 `39528$vdg7Jb`。
首先使用 [Base64 編碼](https://www.base64encode.org/)將使用者名和密碼轉化爲 base-64 形式。
下面是一個使用常用的 base64 程序的示例：

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

<!--
The output shows that the base-64 representation of your username is `bXktYXBw`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0pi`.
-->
結果顯示 base-64 形式的使用者名爲 `bXktYXBw`，
base-64 形式的密碼爲 `Mzk1MjgkdmRnN0pi`。

{{< caution >}}
<!--
Use a local tool trusted by your OS to decrease the security risks of external tools.
-->
使用你的操作系統所能信任的本地工具以降低使用外部工具的風險。
{{< /caution >}}

<!-- steps -->

<!--
## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:
-->
## 創建 Secret   {#create-a-secret}

這裏是一個設定文件，可以用來創建存有使用者名和密碼的 Secret：

{{% code_sample file="pods/inject/secret.yaml" %}}

<!--
1. Create the Secret
-->
1. 創建 Secret：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

<!--
1. View information about the Secret:
-->
2. 查看 Secret 相關信息：

   ```shell
   kubectl get secret test-secret
   ```

   <!--
   Output:
   -->
   輸出：

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

<!--
1. View more detailed information about the Secret:
-->
3. 查看 Secret 相關的更多詳細信息：

   ```shell
   kubectl describe secret test-secret
   ```

   <!--
   Output:
   -->
   輸出：

   ```
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7 bytes
   ```

<!--
### Create a Secret directly with kubectl

If you want to skip the Base64 encoding step, you can create the
same Secret using the `kubectl create secret` command. For example:
-->
### 直接用 kubectl 創建 Secret   {#create-a-secret-directly-with-kubectl}

如果你希望略過 Base64 編碼的步驟，你也可以使用 `kubectl create secret`
命令直接創建 Secret。例如：

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

<!--
This is more convenient. The detailed approach shown earlier runs
through each step explicitly to demonstrate what is happening.
-->
這是一種更爲方便的方法。
前面展示的詳細分解步驟有助於瞭解究竟發生了什麼事情。

<!--
## Create a Pod that has access to the secret data through a Volume

Here is a configuration file you can use to create a Pod:
-->
## 創建一個可以通過卷訪問 Secret 數據的 Pod   {#create-a-pod-that-has-access-to-the-secret-data-through-a-volume}

這裏是一個可以用來創建 Pod 的設定文件：

{{% code_sample file="pods/inject/secret-pod.yaml" %}}

1. <!-- Create the Pod:-->
   創建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. <!-- Verify that your Pod is running: -->
   確認 Pod 正在運行：

   ```shell
   kubectl get pod secret-test-pod
   ```

   <!-- Output: -->
   輸出：

   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. <!-- Get a shell into the Container that is running in your Pod:-->
   獲取一個 Shell 進入 Pod 中運行的容器：

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. <!-- The secret data is exposed to the Container through a Volume mounted under
   `/etc/secret-volume`.

   In your shell, list the files in the `/etc/secret-volume` directory:
   -->
   Secret 數據通過掛載在 `/etc/secret-volume` 目錄下的卷暴露在容器中。

   在 Shell 中，列舉 `/etc/secret-volume` 目錄下的文件：

   ```shell
   # 在容器中 Shell 運行下面命令
   ls /etc/secret-volume
   ```

   <!--
   The output shows two files, one for each piece of secret data:
   -->
   輸出包含兩個文件，每個對應一個 Secret 數據條目：

   ```
   password username
   ```

1. <!--
   In your shell, display the contents of the `username` and `password` files:
   -->
   在 Shell 中，顯示 `username` 和 `password` 文件的內容：

   ```shell
   # 在容器中 Shell 運行下面命令
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```

   <!--
   The output is your username and password:
   -->
   輸出爲使用者名和密碼：

   ```
   my-app
   39528$vdg7Jb
   ```
<!--
Modify your image or command line so that the program looks for files in the
`mountPath` directory. Each key in the Secret `data` map becomes a file name
in this directory.
-->
修改你的映像檔或命令列，使程序在 `mountPath` 目錄下查找文件。
Secret `data` 映射中的每個鍵都成爲該目錄中的文件名。

<!--
### Project Secret keys to specific file paths

You can also control the paths within the volume where Secret keys are projected. Use the
`.spec.volumes[].secret.items` field to change the target path of each key:
-->
### 映射 Secret 鍵到特定文件路徑    {#project-secret-keys-to-specific-file-paths}

你還可以控制卷內 Secret 鍵的映射路徑。
使用 `.spec.volumes[].secret.items` 字段來改變每個鍵的目標路徑。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

<!--
When you deploy this Pod, the following happens:
-->
當你部署此 Pod 時，會發生以下情況：

<!--
- The `username` key from `mysecret` is available to the container at the path
  `/etc/foo/my-group/my-username` instead of at `/etc/foo/username`.
- The `password` key from that Secret object is not projected.
-->
- 來自 `mysecret` 的鍵 `username` 可以在路徑 `/etc/foo/my-group/my-username`
  下供容器使用，而不是路徑 `/etc/foo/username`。
- 來自該 Secret 的鍵 `password` 沒有映射到任何路徑。

<!--
If you list keys explicitly using `.spec.volumes[].secret.items`, consider the
following:
-->

如果你使用 `.spec.volumes[].secret.items` 明確地列出鍵，請考慮以下事項：

<!--
- Only keys specified in `items` are projected.
- To consume all keys from the Secret, all of them must be listed in the
  `items` field.
- All listed keys must exist in the corresponding Secret. Otherwise, the volume
  is not created.
-->
- 只有在 `items` 字段中指定的鍵纔會被映射。
- 要使用 Secret 中全部的鍵，那麼全部的鍵都必須列在 `items` 字段中。
- 所有列出的鍵必須存在於相應的 Secret 中。否則，該卷不被創建。

<!--
### Set POSIX permissions for Secret keys

You can set the POSIX file access permission bits for a single Secret key.
If you don't specify any permissions, `0644` is used by default.
You can also set a default POSIX file mode for the entire Secret volume, and
you can override per key if needed.
-->
### 爲 Secret 鍵設置 POSIX 權限

你可以爲單個 Secret 鍵設置 POSIX 文件訪問權限位。
如果不指定任何權限，默認情況下使用 `0644`。
你也可以爲整個 Secret 卷設置默認的 POSIX 文件模式，需要時你可以重寫單個鍵的權限。

<!--
For example, you can specify a default mode like this:
-->
例如，可以像這樣指定默認模式：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

<!--
The Secret is mounted on `/etc/foo`; all the files created by the
secret volume mount have permission `0400`.
-->
Secret 被掛載在 `/etc/foo` 目錄下；所有由 Secret 卷掛載創建的文件的訪問許可都是 `0400`。

{{< note >}}
<!--
If you're defining a Pod or a Pod template using JSON, beware that the JSON
specification doesn't support octal literals for numbers because JSON considers
`0400` to be the _decimal_ value `400`. In JSON, use decimal values for the
`defaultMode` instead. If you're writing YAML, you can write the `defaultMode`
in octal.
-->
如果使用 JSON 定義 Pod 或 Pod 模板，請注意 JSON 規範不支持數字的八進制形式，
因爲 JSON 將 `0400` 視爲**十進制**的值 `400`。
在 JSON 中，要改爲使用十進制的 `defaultMode`。
如果你正在編寫 YAML，則可以用八進制編寫 `defaultMode`。
{{< /note >}}

<!--
## Define container environment variables using Secret data
-->
## 使用 Secret 數據定義容器變量   {#define-container-environment-variables-using-secret-data}

<!--
You can consume the data in Secrets as environment variables in your
containers.

If a container already consumes a Secret in an environment variable,
a Secret update will not be seen by the container unless it is
restarted. There are third party solutions for triggering restarts when
secrets change.
-->
在你的容器中，你可以以環境變量的方式使用 Secret 中的數據。

如果容器已經使用了在環境變量中的 Secret，除非容器重新啓動，否則容器將無法感知到 Secret 的更新。
有第三方解決方案可以在 Secret 改變時觸發容器重啓。

<!--
### Define a container environment variable with data from a single Secret
-->

### 使用來自 Secret 中的數據定義容器變量   {#define-a-container-env-var-with-data-from-a-single-secret}

<!--
- Define an environment variable as a key-value pair in a Secret:
-->
- 定義環境變量爲 Secret 中的鍵值偶對：

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  ```

<!--
- Assign the `backend-username` value defined in the Secret to the `SECRET_USERNAME` environment variable in the Pod specification.
-->
- 在 Pod 規約中，將 Secret 中定義的值 `backend-username` 賦給 `SECRET_USERNAME` 環境變量。

  {{% code_sample file="pods/inject/pod-single-secret-env-variable.yaml" %}}

<!--
- Create the Pod:
-->
- 創建 Pod：

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
  ```

<!--
- In your shell, display the content of `SECRET_USERNAME` container environment variable.
-->
- 在 Shell 中，顯示容器環境變量 `SECRET_USERNAME` 的內容：

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  <!--
  The output is similar to:
  -->
  輸出類似於：

  ```
  backend-admin
  ```

<!--
### Define container environment variables with data from multiple Secrets
-->
### 使用來自多個 Secret 的數據定義環境變量   {#define-container-env-var-with-data-from-multi-secrets}

<!--
- As with the previous example, create the Secrets first.
-->
- 和前面的例子一樣，先創建 Secret：

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  kubectl create secret generic db-user --from-literal=db-username='db-admin'
  ```

<!--
- Define the environment variables in the Pod specification.
-->
- 在 Pod 規約中定義環境變量：

  {{% code_sample file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

<!--
- Create the Pod:
-->
- 創建 Pod：

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
  ```

<!--
- In your shell, display the container environment variables.
-->
- 在你的 Shell 中，顯示容器環境變量的內容：

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```

  <!--
  The output is similar to:
  -->
  輸出類似於：

  ```
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

<!--
## Configure all key-value pairs in a Secret as container environment variables
-->
## 將 Secret 中的所有鍵值偶對定義爲環境變量   {#configure-all-key-value-pairs-in-a-secret-as-container-env-var}

{{< note >}}
<!--
This functionality is available in Kubernetes v1.6 and later.
-->
此功能在 Kubernetes 1.6 版本之後可用。
{{< /note >}}

<!--
- Create a Secret containing multiple key-value pairs
-->
- 創建包含多個鍵值偶對的 Secret：

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

<!--
- Use envFrom to define all of the Secret's data as container environment variables.
  The key from the Secret becomes the environment variable name in the Pod.
-->
- 使用 `envFrom` 來將 Secret 中的所有數據定義爲環境變量。
  Secret 中的鍵名成爲容器中的環境變量名：

  {{% code_sample file="pods/inject/pod-secret-envFrom.yaml" %}}

<!--
- Create the Pod:
-->
- 創建 Pod：

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ```

<!--
- In your shell, display `username` and `password` container environment variables.
-->
- 在 Shell 中，顯示環境變量 `username` 和 `password` 的內容：

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```
  
  <!--
  The output is similar to:
  -->
  輸出類似於：

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

<!--
## Example: Provide prod/test credentials to Pods using Secrets {#provide-prod-test-creds}

This example illustrates a Pod which consumes a secret containing production credentials and
another Pod which consumes a secret with test environment credentials.
-->
## 示例：使用 Secret 爲 Pod 提供生產環境或測試環境的憑據   {#provide-prod-test-creds}

此示例展示的是一個使用了包含生產環境憑據的 Secret 的 Pod 和一個使用了包含測試環境憑據的 Secret 的 Pod。

<!--
1. Create a secret for prod environment credentials:
-->
1. 創建用於生產環境憑據的 Secret：

   ```shell
   kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   secret "prod-db-secret" created
   ```

<!--
1. Create a secret for test environment credentials.
-->
2. 爲測試環境憑據創建 Secret。

   ```shell
   kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   secret "test-db-secret" created
   ```

   {{< note >}}
   <!--
   Special characters such as `$`, `\`, `*`, `=`, and `!` will be interpreted by your
   [shell](https://en.wikipedia.org/wiki/Shell_(computing)) and require escaping.

   In most shells, the easiest way to escape the password is to surround it with single quotes (`'`).
   For example, if your actual password is `S!B\*d$zDsb=`, you should execute the command as follows:
   -->
   `$`、`\`、`*`、`=` 和 `!` 這類特殊字符會被你的 [Shell](https://en.wikipedia.org/wiki/Shell_(computing))
   解釋，需要進行轉義。

   在大多數 Shell 中，最簡單的密碼轉義方法是使用單引號（`'`）將密碼包起來。
   例如，如果你的實際密碼是 `S!B\*d$zDsb=`，則應執行以下命令：

   ```shell
   kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
   ```

   <!--
   You do not need to escape special characters in passwords from files (`--from-file`).
   -->
   你無需轉義來自文件（`--from-file`）的密碼中的特殊字符。
   {{< /note >}}

<!--
1. Create the Pod manifests:
-->
3. 創建 Pod 清單：

   ```shell
   cat <<EOF > pod.yaml
   apiVersion: v1
   kind: List
   items:
   - kind: Pod
     apiVersion: v1
     metadata:
       name: prod-db-client-pod
       labels:
         name: prod-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: prod-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   - kind: Pod
     apiVersion: v1
     metadata:
       name: test-db-client-pod
       labels:
         name: test-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: test-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   EOF
   ```

   {{< note >}}
   <!--
   How the specs for the two Pods differ only in one field; this facilitates creating Pods
   with different capabilities from a common Pod template.
   -->
   這兩個 Pod 的規約只在一個字段上有所不同；這樣便於從一個通用的 Pod 模板創建具有不同權能的 Pod。
   {{< /note >}}

<!--
1. Apply all those objects on the API server by running:
-->
4. 通過運行以下命令將所有這些對象應用到 API 伺服器：

   ```shell
   kubectl create -f pod.yaml
   ```

<!--
Both containers will have the following files present on their filesystems with the values
for each container's environment:
-->
兩個容器的文件系統中都將存在以下文件，其中包含每個容器環境的值：

```
/etc/secret-volume/username
/etc/secret-volume/password
```

<!--
You could further simplify the base Pod specification by using two service accounts:

1. `prod-user` with the `prod-db-secret`
1. `test-user` with the `test-db-secret`

The Pod specification is shortened to:
-->
你可以通過使用兩個服務賬號進一步簡化基礎 Pod 規約：

1. 帶有 `prod-db-secret` 的 `prod-user`
1. 帶有 `test-db-secret` 的 `test-user`

Pod 規約精簡爲：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

<!--
### References
-->
### 參考   {#references}

- [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Secrets](/docs/concepts/configuration/secret/).
- Learn about [Volumes](/docs/concepts/storage/volumes/).
-->
- 進一步瞭解 [Secret](/zh-cn/docs/concepts/configuration/secret/)。
- 瞭解[卷](/zh-cn/docs/concepts/storage/volumes/)。
