---
title: 使用 Secret 安全地分發憑證
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->
<!--
This page shows how to securely inject sensitive data, such as passwords and
encryption keys, into Pods.
-->
本文展示如何安全地將敏感資料（如密碼和加密金鑰）注入到 Pods 中。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}


<!--
### Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use a base64 encoding tool to convert your username and password to a base64 representation. Here's an example using the commonly available base64 program:
-->
### 將 secret 資料轉換為 base-64 形式

假設使用者想要有兩條 Secret 資料：使用者名稱 `my-app` 和密碼 `39528$vdg7Jb`。
首先使用 [Base64 編碼](https://www.base64encode.org/) 將使用者名稱和密碼轉化為 base-64 形式。 
下面是一個使用常用的 base64 程式的示例：

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

<!--
The output shows that the base-64 representation of your username is `bXktYXBw`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0pi`.
-->
結果顯示 base-64 形式的使用者名稱為 `bXktYXBw`，
base-64 形式的密碼為 `Mzk1MjgkdmRnN0pi`。

<!--
Use a local tool trusted by your OS to decrease the security risks of external tools.
-->
{{< caution >}}
使用你的作業系統所能信任的本地工具以降低使用外部工具的風險。
{{< /caution >}}

<!-- steps -->

<!--
## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:
-->
## 建立 Secret

這裡是一個配置檔案，可以用來建立存有使用者名稱和密碼的 Secret:

{{< codenew file="pods/inject/secret.yaml" >}}

1. <!--Create the Secret -->
   建立 Secret：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

1. <!-- View information about the Secret -->
   檢視 Secret 相關資訊：

   ```shell
   kubectl get secret test-secret
   ``` 

   <!-- Output: -->
    輸出：
	
   ```shell
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. <!-- View more detailed information about the Secret -->
   檢視 Secret 相關的更多詳細資訊：

   ```shell
   kubectl describe secret test-secret
   ```

   <!-- Output: -->
   輸出：

   ```shell
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7  bytes
   ```

<!--
### Create a Secret directly with kubectl

If you want to skip the Base64 encoding step, you can create the
same Secret using the `kubectl create secret` command. For example:
-->
### 直接用 kubectl 建立 Secret

如果你希望略過 Base64 編碼的步驟，你也可以使用 `kubectl create secret`
命令直接建立 Secret。例如：

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

<!--
This is more convenient. The detailed approach shown earlier runs
through each step explicitly to demonstrate what is happening.
-->
這是一種更為方便的方法。
前面展示的詳細分解步驟有助於瞭解究竟發生了什麼事情。

<!--
## Create a Pod that has access to the secret data through a Volume

Here is a configuration file you can use to create a Pod:
-->
## 建立一個可以透過卷訪問 secret 資料的 Pod

這裡是一個可以用來建立 pod 的配置檔案：

{{< codenew file="pods/inject/secret-pod.yaml" >}}

1. <!-- Create the Pod:-->
   建立 Pod：

   ```shell
   kubectl create -f secret-pod.yaml
   ```

1. <!-- Verify that your Pod is running: -->
   確認 Pod 正在執行：

   ```shell
   kubectl get pod secret-test-pod
   ```

   輸出：

   ```shell
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. <!-- Get a shell into the Container that is running in your Pod:-->
   獲取一個 shell 進入 Pod 中執行的容器：

   ```shell
   kubectl exec -it secret-test-pod -- /bin/bash
   ```

1. <!-- The secret data is exposed to the Container through a Volume mounted under
   `/etc/secret-volume`.

   In your shell, list the files in the `/etc/secret-volume` directory:
   -->
   Secret 資料透過掛載在 `/etc/secret-volume` 目錄下的卷暴露在容器中。

   在 shell 中，列舉 `/etc/secret-volume` 目錄下的檔案：

   ```shell
   ls /etc/secret-volume
   ```

   <!--
   The output shows two files, one for each piece of secret data:
   -->
   輸出包含兩個檔案，每個對應一個 Secret 資料條目：

   ```
   password username
   ```

1. <!--
   In your shell, display the contents of the `username` and `password` files:
   -->
   在 Shell 中，顯示 `username` 和 `password` 檔案的內容：

   ```shell
   # 在容器中 Shell 執行下面命令
   echo "$(cat /etc/secret-volume/username)"
   echo "$(cat /etc/secret-volume/password)"
   ```

   <!--
   The output is your username and password:
   -->
   輸出為使用者名稱和密碼：

   ```shell
   my-app
   39528$vdg7Jb
   ```

<!--
## Define container environment variables using Secret data

### Define a container environment variable with data from a single Secret

-->
## 使用 Secret 資料定義容器變數

### 使用來自 Secret 中的資料定義容器變數

<!--
*  Define an environment variable as a key-value pair in a Secret:
-->
*  定義環境變數為 Secret 中的鍵值偶對：

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   ```

<!--
*  Assign the `backend-username` value defined in the Secret to the `SECRET_USERNAME` environment variable in the Pod specification.
-->
*  在 Pod 規約中，將 Secret 中定義的值 `backend-username` 賦給 `SECRET_USERNAME` 環境變數

   {{< codenew file="pods/inject/pod-single-secret-env-variable.yaml" >}}

<!--
*  Create the Pod:
-->
*  建立 Pod：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
   ```

<!--
*  In your shell, display the content of `SECRET_USERNAME` container environment variable
-->
*  在 Shell 中，顯示容器環境變數 `SECRET_USERNAME` 的內容：

   ```shell
   kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
   ```

   輸出為：

   ```
   backend-admin
   ```
<!--
### Define container environment variables with data from multiple Secrets
-->
### 使用來自多個 Secret 的資料定義環境變數

<!--
*  As with the previous example, create the Secrets first.
-->
*  和前面的例子一樣，先建立 Secret：

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   kubectl create secret generic db-user --from-literal=db-username='db-admin'
   ```

<!--
*  Define the environment variables in the Pod specification.
-->
*  在 Pod 規約中定義環境變數：

   {{< codenew file="pods/inject/pod-multiple-secret-env-variable.yaml" >}}

<!--
*  Create the Pod:
-->
*  建立 Pod：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
   ```

<!--
*  In your shell, display the container environment variables
-->
*  在你的 Shell 中，顯示容器環境變數的內容：

   ```shell
   kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
   ```

   輸出：
   ```
   DB_USERNAME=db-admin
   BACKEND_USERNAME=backend-admin
   ```

<!--
## Configure all key-value pairs in a Secret as container environment variables
-->
## 將 Secret 中的所有鍵值偶對定義為環境變數

<!--
This functionality is available in Kubernetes v1.6 and later.
-->
{{< note >}}
此功能在 Kubernetes 1.6 版本之後可用。
{{< /note >}}

<!--
*  Create a Secret containing multiple key-value pairs
-->
*  建立包含多個鍵值偶對的 Secret：

   ```shell
   kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
   ```

<!--
*  Use envFrom to define all of the Secret's data as container environment variables. The key from the Secret becomes the environment variable name in the Pod.
-->
*  使用 `envFrom` 來將 Secret 中的所有資料定義為環境變數。
   Secret 中的鍵名成為容器中的環境變數名：

   {{< codenew file="pods/inject/pod-secret-envFrom.yaml" >}}

<!--
*  Create the Pod:
-->
*  建立 Pod：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
   ```

<!--
* In your shell, display `username` and `password` container environment variables
-->
* 在 Shell 中，顯示環境變數 `username` 和 `password` 的內容：

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  輸出為：

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

<!-- ### References -->
### 參考

* [Secret](/docs/api-reference/{{< param "version" >}}/#secret-v1-core)
* [Volume](/docs/api-reference/{{< param "version" >}}/#volume-v1-core)
* [Pod](/docs/api-reference/{{< param "version" >}}/#pod-v1-core)


## {{% heading "whatsnext" %}}

<!--
* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn about [Volumes](/docs/concepts/storage/volumes/).
-->
* 進一步瞭解 [Secret](/zh-cn/docs/concepts/configuration/secret/)。
* 瞭解 [Volumes](/zh-cn/docs/concepts/storage/volumes/)。


