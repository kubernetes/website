---
title: 使用 Secret 安全地分发凭证
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->
<!--
This page shows how to securely inject sensitive data, such as passwords and
encryption keys, into Pods.
-->
本文展示如何安全地将敏感数据（如密码和加密密钥）注入到 Pods 中。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!--
### Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use a base64 encoding tool to convert your username and password to a base64 representation. Here's an example using the commonly available base64 program:
-->
### 将 secret 数据转换为 base-64 形式

假设用户想要有两条 Secret 数据：用户名 `my-app` 和密码 `39528$vdg7Jb`。
首先使用 [Base64 编码](https://www.base64encode.org/) 将用户名和密码转化为 base-64 形式。 
下面是一个使用常用的 base64 程序的示例：

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

<!--
The output shows that the base-64 representation of your username is `bXktYXBw`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0pi`.
-->
结果显示 base-64 形式的用户名为 `bXktYXBw`，
base-64 形式的密码为 `Mzk1MjgkdmRnN0pi`。

<!--
Use a local tool trusted by your OS to decrease the security risks of external tools.
-->
{{< caution >}}
使用你的操作系统所能信任的本地工具以降低使用外部工具的风险。
{{< /caution >}}

<!-- steps -->

<!--
## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:
-->
## 创建 Secret

这里是一个配置文件，可以用来创建存有用户名和密码的 Secret:

{{< codenew file="pods/inject/secret.yaml" >}}

1. <!--Create the Secret -->
   创建 Secret：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

<!--
1. View information about the Secret:
-->
2. 查看 Secret 相关信息：

   ```shell
   kubectl get secret test-secret
   ``` 

   <!-- Output: -->
    输出：
	
   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

1. <!-- View more detailed information about the Secret:-->
   查看 Secret 相关的更多详细信息：

   ```shell
   kubectl describe secret test-secret
   ```

   <!-- Output: -->
   输出：

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
### 直接用 kubectl 创建 Secret

如果你希望略过 Base64 编码的步骤，你也可以使用 `kubectl create secret`
命令直接创建 Secret。例如：

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

<!--
This is more convenient. The detailed approach shown earlier runs
through each step explicitly to demonstrate what is happening.
-->
这是一种更为方便的方法。
前面展示的详细分解步骤有助于了解究竟发生了什么事情。


<!--
## Create a Pod that has access to the secret data through a Volume

Here is a configuration file you can use to create a Pod:
-->
## 创建一个可以通过卷访问 secret 数据的 Pod

这里是一个可以用来创建 pod 的配置文件：

{{< codenew file="pods/inject/secret-pod.yaml" >}}

1. <!-- Create the Pod:-->
   创建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. <!-- Verify that your Pod is running: -->
   确认 Pod 正在运行：

   ```shell
   kubectl get pod secret-test-pod
   ```

   <!-- Output: -->
   输出：
   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. <!-- Get a shell into the Container that is running in your Pod:-->
   获取一个 shell 进入 Pod 中运行的容器：

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. <!-- The secret data is exposed to the Container through a Volume mounted under
   `/etc/secret-volume`.

   In your shell, list the files in the `/etc/secret-volume` directory:
   -->
   Secret 数据通过挂载在 `/etc/secret-volume` 目录下的卷暴露在容器中。

   在 shell 中，列举 `/etc/secret-volume` 目录下的文件：

   ```shell
   # 在容器中 Shell 运行下面命令
   ls /etc/secret-volume
   ```

   <!--
   The output shows two files, one for each piece of secret data:
   -->
   输出包含两个文件，每个对应一个 Secret 数据条目：

   ```
   password username
   ```

1. <!--
   In your shell, display the contents of the `username` and `password` files:
   -->
   在 Shell 中，显示 `username` 和 `password` 文件的内容：
   ```shell
   # 在容器中 Shell 运行下面命令
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```

   <!--
   The output is your username and password:
   -->
   输出为用户名和密码：

   ```
   my-app
   39528$vdg7Jb
   ```

<!--
## Define container environment variables using Secret data

### Define a container environment variable with data from a single Secret

-->
## 使用 Secret 数据定义容器变量

### 使用来自 Secret 中的数据定义容器变量

<!--
*  Define an environment variable as a key-value pair in a Secret:
-->
*  定义环境变量为 Secret 中的键值偶对：

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   ```

<!--
*  Assign the `backend-username` value defined in the Secret to the `SECRET_USERNAME` environment variable in the Pod specification.
-->
*  在 Pod 规约中，将 Secret 中定义的值 `backend-username` 赋给 `SECRET_USERNAME` 环境变量

   {{< codenew file="pods/inject/pod-single-secret-env-variable.yaml" >}}

<!--
*  Create the Pod:
-->
*  创建 Pod：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
   ```

<!--
*  In your shell, display the content of `SECRET_USERNAME` container environment variable
-->
*  在 Shell 中，显示容器环境变量 `SECRET_USERNAME` 的内容：

   ```shell
   kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
   ```

   <!--
   The output is
   -->
   输出为：
   ```
   backend-admin
   ```
   
<!--
### Define container environment variables with data from multiple Secrets
-->
### 使用来自多个 Secret 的数据定义环境变量

<!--
*  As with the previous example, create the Secrets first.
-->
*  和前面的例子一样，先创建 Secret：

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   kubectl create secret generic db-user --from-literal=db-username='db-admin'
   ```

<!--
*  Define the environment variables in the Pod specification.
-->
*  在 Pod 规约中定义环境变量：

   {{< codenew file="pods/inject/pod-multiple-secret-env-variable.yaml" >}}

<!--
*  Create the Pod:
-->
*  创建 Pod：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
   ```

<!--
*  In your shell, display the container environment variables
-->
*  在你的 Shell 中，显示容器环境变量的内容：

   ```shell
   kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
   ```
   <!--
   The output is
   -->
   输出：
   ```
   DB_USERNAME=db-admin
   BACKEND_USERNAME=backend-admin
   ```


<!--
## Configure all key-value pairs in a Secret as container environment variables
-->
## 将 Secret 中的所有键值偶对定义为环境变量

<!--
This functionality is available in Kubernetes v1.6 and later.
-->
{{< note >}}
此功能在 Kubernetes 1.6 版本之后可用。
{{< /note >}}

<!--
*  Create a Secret containing multiple key-value pairs
-->
*  创建包含多个键值偶对的 Secret：

   ```shell
   kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
   ```

<!--
*  Use envFrom to define all of the Secret's data as container environment variables. The key from the Secret becomes the environment variable name in the Pod.
-->
*  使用 `envFrom` 来将 Secret 中的所有数据定义为环境变量。
   Secret 中的键名成为容器中的环境变量名：

   {{< codenew file="pods/inject/pod-secret-envFrom.yaml" >}}

<!--
*  Create the Pod:
-->
*  创建 Pod：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
   ```

<!--
* In your shell, display `username` and `password` container environment variables
-->
* 在 Shell 中，显示环境变量 `username` 和 `password` 的内容：

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```
  
   <!--
   The output is
   -->
  输出为：

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

<!-- ### References -->
### 参考

* [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn about [Volumes](/docs/concepts/storage/volumes/).
-->
* 进一步了解 [Secret](/zh-cn/docs/concepts/configuration/secret/)。
* 了解 [Volumes](/zh-cn/docs/concepts/storage/volumes/)。


