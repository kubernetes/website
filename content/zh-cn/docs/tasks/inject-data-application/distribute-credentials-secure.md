---
title: 使用 Secret 安全地分发凭据
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
本文展示如何安全地将敏感数据（如密码和加密密钥）注入到 Pod 中。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
### Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use a base64 encoding tool to convert your username and password to a base64 representation. Here's an example using the commonly available base64 program:
-->
### 将 Secret 数据转换为 base-64 形式   {#convert-your-secret-data-to-a-base64-representation}

假设用户想要有两条 Secret 数据：用户名 `my-app` 和密码 `39528$vdg7Jb`。
首先使用 [Base64 编码](https://www.base64encode.org/)将用户名和密码转化为 base-64 形式。
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

{{< caution >}}
<!--
Use a local tool trusted by your OS to decrease the security risks of external tools.
-->
使用你的操作系统所能信任的本地工具以降低使用外部工具的风险。
{{< /caution >}}

<!-- steps -->

<!--
## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:
-->
## 创建 Secret   {#create-a-secret}

这里是一个配置文件，可以用来创建存有用户名和密码的 Secret：

{{% code_sample file="pods/inject/secret.yaml" %}}

<!--
1. Create the Secret
-->
1. 创建 Secret：

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

   <!--
   Output:
   -->
   输出：

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

<!--
1. View more detailed information about the Secret:
-->
3. 查看 Secret 相关的更多详细信息：

   ```shell
   kubectl describe secret test-secret
   ```

   <!--
   Output:
   -->
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
### 直接用 kubectl 创建 Secret   {#create-a-secret-directly-with-kubectl}

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
## 创建一个可以通过卷访问 Secret 数据的 Pod   {#create-a-pod-that-has-access-to-the-secret-data-through-a-volume}

这里是一个可以用来创建 Pod 的配置文件：

{{% code_sample file="pods/inject/secret-pod.yaml" %}}

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
   获取一个 Shell 进入 Pod 中运行的容器：

   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. <!-- The secret data is exposed to the Container through a Volume mounted under
   `/etc/secret-volume`.

   In your shell, list the files in the `/etc/secret-volume` directory:
   -->
   Secret 数据通过挂载在 `/etc/secret-volume` 目录下的卷暴露在容器中。

   在 Shell 中，列举 `/etc/secret-volume` 目录下的文件：

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
Modify your image or command line so that the program looks for files in the
`mountPath` directory. Each key in the Secret `data` map becomes a file name
in this directory.
-->
修改你的镜像或命令行，使程序在 `mountPath` 目录下查找文件。
Secret `data` 映射中的每个键都成为该目录中的文件名。

<!--
### Project Secret keys to specific file paths

You can also control the paths within the volume where Secret keys are projected. Use the
`.spec.volumes[].secret.items` field to change the target path of each key:
-->
### 映射 Secret 键到特定文件路径    {#project-secret-keys-to-specific-file-paths}

你还可以控制卷内 Secret 键的映射路径。
使用 `.spec.volumes[].secret.items` 字段来改变每个键的目标路径。

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
当你部署此 Pod 时，会发生以下情况：

<!--
- The `username` key from `mysecret` is available to the container at the path
  `/etc/foo/my-group/my-username` instead of at `/etc/foo/username`.
- The `password` key from that Secret object is not projected.
-->
- 来自 `mysecret` 的键 `username` 可以在路径 `/etc/foo/my-group/my-username`
  下供容器使用，而不是路径 `/etc/foo/username`。
- 来自该 Secret 的键 `password` 没有映射到任何路径。

<!--
If you list keys explicitly using `.spec.volumes[].secret.items`, consider the
following:
-->

如果你使用 `.spec.volumes[].secret.items` 明确地列出键，请考虑以下事项：

<!--
- Only keys specified in `items` are projected.
- To consume all keys from the Secret, all of them must be listed in the
  `items` field.
- All listed keys must exist in the corresponding Secret. Otherwise, the volume
  is not created.
-->
- 只有在 `items` 字段中指定的键才会被映射。
- 要使用 Secret 中全部的键，那么全部的键都必须列在 `items` 字段中。
- 所有列出的键必须存在于相应的 Secret 中。否则，该卷不被创建。

<!--
### Set POSIX permissions for Secret keys

You can set the POSIX file access permission bits for a single Secret key.
If you don't specify any permissions, `0644` is used by default.
You can also set a default POSIX file mode for the entire Secret volume, and
you can override per key if needed.
-->
### 为 Secret 键设置 POSIX 权限

你可以为单个 Secret 键设置 POSIX 文件访问权限位。
如果不指定任何权限，默认情况下使用 `0644`。
你也可以为整个 Secret 卷设置默认的 POSIX 文件模式，需要时你可以重写单个键的权限。

<!--
For example, you can specify a default mode like this:
-->
例如，可以像这样指定默认模式：

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
Secret 被挂载在 `/etc/foo` 目录下；所有由 Secret 卷挂载创建的文件的访问许可都是 `0400`。

{{< note >}}
<!--
If you're defining a Pod or a Pod template using JSON, beware that the JSON
specification doesn't support octal literals for numbers because JSON considers
`0400` to be the _decimal_ value `400`. In JSON, use decimal values for the
`defaultMode` instead. If you're writing YAML, you can write the `defaultMode`
in octal.
-->
如果使用 JSON 定义 Pod 或 Pod 模板，请注意 JSON 规范不支持数字的八进制形式，
因为 JSON 将 `0400` 视为**十进制**的值 `400`。
在 JSON 中，要改为使用十进制的 `defaultMode`。
如果你正在编写 YAML，则可以用八进制编写 `defaultMode`。
{{< /note >}}

<!--
## Define container environment variables using Secret data
-->
## 使用 Secret 数据定义容器变量   {#define-container-environment-variables-using-secret-data}

<!--
You can consume the data in Secrets as environment variables in your
containers.

If a container already consumes a Secret in an environment variable,
a Secret update will not be seen by the container unless it is
restarted. There are third party solutions for triggering restarts when
secrets change.
-->
在你的容器中，你可以以环境变量的方式使用 Secret 中的数据。

如果容器已经使用了在环境变量中的 Secret，除非容器重新启动，否则容器将无法感知到 Secret 的更新。
有第三方解决方案可以在 Secret 改变时触发容器重启。

<!--
### Define a container environment variable with data from a single Secret
-->

### 使用来自 Secret 中的数据定义容器变量   {#define-a-container-env-var-with-data-from-a-single-secret}

<!--
- Define an environment variable as a key-value pair in a Secret:
-->
- 定义环境变量为 Secret 中的键值偶对：

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  ```

<!--
- Assign the `backend-username` value defined in the Secret to the `SECRET_USERNAME` environment variable in the Pod specification.
-->
- 在 Pod 规约中，将 Secret 中定义的值 `backend-username` 赋给 `SECRET_USERNAME` 环境变量。

  {{% code_sample file="pods/inject/pod-single-secret-env-variable.yaml" %}}

<!--
- Create the Pod:
-->
- 创建 Pod：

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
  ```

<!--
- In your shell, display the content of `SECRET_USERNAME` container environment variable.
-->
- 在 Shell 中，显示容器环境变量 `SECRET_USERNAME` 的内容：

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  <!--
  The output is similar to:
  -->
  输出类似于：

  ```
  backend-admin
  ```

<!--
### Define container environment variables with data from multiple Secrets
-->
### 使用来自多个 Secret 的数据定义环境变量   {#define-container-env-var-with-data-from-multi-secrets}

<!--
- As with the previous example, create the Secrets first.
-->
- 和前面的例子一样，先创建 Secret：

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  kubectl create secret generic db-user --from-literal=db-username='db-admin'
  ```

<!--
- Define the environment variables in the Pod specification.
-->
- 在 Pod 规约中定义环境变量：

  {{% code_sample file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

<!--
- Create the Pod:
-->
- 创建 Pod：

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
  ```

<!--
- In your shell, display the container environment variables.
-->
- 在你的 Shell 中，显示容器环境变量的内容：

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```

  <!--
  The output is similar to:
  -->
  输出类似于：

  ```
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

<!--
## Configure all key-value pairs in a Secret as container environment variables
-->
## 将 Secret 中的所有键值偶对定义为环境变量   {#configure-all-key-value-pairs-in-a-secret-as-container-env-var}

{{< note >}}
<!--
This functionality is available in Kubernetes v1.6 and later.
-->
此功能在 Kubernetes 1.6 版本之后可用。
{{< /note >}}

<!--
- Create a Secret containing multiple key-value pairs
-->
- 创建包含多个键值偶对的 Secret：

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

<!--
- Use envFrom to define all of the Secret's data as container environment variables.
  The key from the Secret becomes the environment variable name in the Pod.
-->
- 使用 `envFrom` 来将 Secret 中的所有数据定义为环境变量。
  Secret 中的键名成为容器中的环境变量名：

  {{% code_sample file="pods/inject/pod-secret-envFrom.yaml" %}}

<!--
- Create the Pod:
-->
- 创建 Pod：

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ```

<!--
- In your shell, display `username` and `password` container environment variables.
-->
- 在 Shell 中，显示环境变量 `username` 和 `password` 的内容：

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```
  
  <!--
  The output is similar to:
  -->
  输出类似于：

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

<!--
## Example: Provide prod/test credentials to Pods using Secrets {#provide-prod-test-creds}

This example illustrates a Pod which consumes a secret containing production credentials and
another Pod which consumes a secret with test environment credentials.
-->
## 示例：使用 Secret 为 Pod 提供生产环境或测试环境的凭据   {#provide-prod-test-creds}

此示例展示的是一个使用了包含生产环境凭据的 Secret 的 Pod 和一个使用了包含测试环境凭据的 Secret 的 Pod。

<!--
1. Create a secret for prod environment credentials:
-->
1. 创建用于生产环境凭据的 Secret：

   ```shell
   kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

   ```
   secret "prod-db-secret" created
   ```

<!--
1. Create a secret for test environment credentials.
-->
2. 为测试环境凭据创建 Secret。

   ```shell
   kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
   ```

   <!--
   The output is similar to:
   -->
   输出类似于：

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
   `$`、`\`、`*`、`=` 和 `!` 这类特殊字符会被你的 [Shell](https://en.wikipedia.org/wiki/Shell_(computing))
   解释，需要进行转义。

   在大多数 Shell 中，最简单的密码转义方法是使用单引号（`'`）将密码包起来。
   例如，如果你的实际密码是 `S!B\*d$zDsb=`，则应执行以下命令：

   ```shell
   kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
   ```

   <!--
   You do not need to escape special characters in passwords from files (`--from-file`).
   -->
   你无需转义来自文件（`--from-file`）的密码中的特殊字符。
   {{< /note >}}

<!--
1. Create the Pod manifests:
-->
3. 创建 Pod 清单：

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
   这两个 Pod 的规约只在一个字段上有所不同；这样便于从一个通用的 Pod 模板创建具有不同权能的 Pod。
   {{< /note >}}

<!--
1. Apply all those objects on the API server by running:
-->
4. 通过运行以下命令将所有这些对象应用到 API 服务器：

   ```shell
   kubectl create -f pod.yaml
   ```

<!--
Both containers will have the following files present on their filesystems with the values
for each container's environment:
-->
两个容器的文件系统中都将存在以下文件，其中包含每个容器环境的值：

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
你可以通过使用两个服务账号进一步简化基础 Pod 规约：

1. 带有 `prod-db-secret` 的 `prod-user`
1. 带有 `test-db-secret` 的 `test-user`

Pod 规约精简为：

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
### 参考   {#references}

- [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Secrets](/docs/concepts/configuration/secret/).
- Learn about [Volumes](/docs/concepts/storage/volumes/).
-->
- 进一步了解 [Secret](/zh-cn/docs/concepts/configuration/secret/)。
- 了解[卷](/zh-cn/docs/concepts/storage/volumes/)。
