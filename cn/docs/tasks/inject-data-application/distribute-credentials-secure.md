---
title: 使用 Secrets 安全地分发凭证
cn-approvers:
- lichuqiang
---
<!--
---
title: Distribute Credentials Securely Using Secrets
---
-->

{% capture overview %}
<!--
This page shows how to securely inject sensitive data, such as passwords and
encryption keys, into Pods.
-->
本文展示如何安全地将敏感数据（如密码和加密密钥）注入到 Pods 中。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## Convert your secret data to a base-64 representation

Suppose you want to have two pieces of secret data: a username `my-app` and a password
`39528$vdg7Jb`. First, use [Base64 encoding](https://www.base64encode.org/) to
convert your username and password to a base-64 representation. Here's a Linux
example:
-->
## 将 secret 数据转换为 base-64 形式

假设用户想要有两条 secret 数据：用户名 `my-app` 和密码
`39528$vdg7Jb`。 首先使用 [Base64 编码](https://www.base64encode.org/) 将用户名和密码转化为 base-64 形式。 这里是一个在 Linux 系统下进行转换的示例：

    echo -n 'my-app' | base64
    echo -n '39528$vdg7Jb' | base64

<!--
The output shows that the base-64 representation of your username is `bXktYXBw`,
and the base-64 representation of your password is `Mzk1MjgkdmRnN0pi`.
-->
结果显示 base-64 形式的用户名为 `bXktYXBw`，
base-64 形式的密码为 `Mzk1MjgkdmRnN0pi`。

<!--
## Create a Secret

Here is a configuration file you can use to create a Secret that holds your
username and password:
-->
## 创建 Secret

这里是一个配置文件，可以用来创建存有用户名和密码的 Secret:

{% include code.html language="yaml" file="secret.yaml" ghlink="/docs/tasks/inject-data-application/secret.yaml" %}

<!--
1. Create the Secret
-->
1. 创建 Secret

       kubectl create -f secret.yaml

<!--
    **Note:** If you want to skip the Base64 encoding step, you can create a Secret
    by using the `kubectl create secret` command:
    {: .note}
-->
    **注意：** 如果想要跳过 Base64 编码的步骤，可以使用 `kubectl create secret` 命令来创建 Secret：
    {: .note}

       kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'

<!--
1. View information about the Secret:
-->
1. 查看 Secret 相关信息：

       kubectl get secret test-secret

<!--
    Output:
-->
    输出：

        NAME          TYPE      DATA      AGE
        test-secret   Opaque    2         1m


<!--
1. View more detailed information about the Secret:
-->
1. 查看更多关于 Secret 的详细信息：

       kubectl describe secret test-secret

<!--
    Output:
-->
    输出：

        Name:       test-secret
        Namespace:  default
        Labels:     <none>
        Annotations:    <none>

        Type:   Opaque

        Data
        ====
        password:   13 bytes
        username:   7 bytes

<!--
## Create a Pod that has access to the secret data through a Volume

Here is a configuration file you can use to create a Pod:
-->
## 创建可以通过卷访问 secret 数据的 Pod

这里是一个可以用来创建 pod 的配置文件：

{% include code.html language="yaml" file="secret-pod.yaml" ghlink="/docs/tasks/inject-data-application/secret-pod.yaml" %}

<!--
1. Create the Pod:
-->
1. 创建 Pod：

       kubectl create -f secret-pod.yaml

<!--
1. Verify that your Pod is running:
-->
1. 确认 Pod 正在运行：

       kubectl get pod secret-test-pod

<!--
    Output:
-->
    输出：

        NAME              READY     STATUS    RESTARTS   AGE
        secret-test-pod   1/1       Running   0          42m


<!--
1. Get a shell into the Container that is running in your Pod:
-->
1. 为 Pod 中运行的容器打开一个 shell：

       kubectl exec -it secret-test-pod -- /bin/bash

<!--
1. The secret data is exposed to the Container through a Volume mounted under
`/etc/secret-volume`. In your shell, go to the directory where the secret data
is exposed:
-->
1. secret 数据通过挂载在 `/etc/secret-volume` 目录下的卷暴露在容器中。
在 shell 中，进入 secret 数据被暴露的目录：

       root@secret-test-pod:/# cd /etc/secret-volume

<!--
1. In your shell, list the files in the `/etc/secret-volume` directory:
-->
1. 在 shell 中，列出 `/etc/secret-volume` 目录的文件：

       root@secret-test-pod:/etc/secret-volume# ls

<!--
    The output shows two files, one for each piece of secret data:
-->
    输出显示了两个文件，每个对应一条 secret 数据：

        password username

<!--
1. In your shell, display the contents of the `username` and `password` files:
-->
1. 在 shell 中，显示 `username` 和 `password` 文件的内容：

       root@secret-test-pod:/etc/secret-volume# cat username; echo; cat password; echo

<!--
    The output is your username and password:
-->
    输出为用户名和密码：

        my-app
        39528$vdg7Jb

<!--
## Create a Pod that has access to the secret data through environment variables

Here is a configuration file you can use to create a Pod:
-->
## 创建通过环境变量访问 secret 数据的 Pod

这里是一个可以用来创建 pod 的配置文件：

{% include code.html language="yaml" file="secret-envars-pod.yaml" ghlink="/docs/tasks/inject-data-application/secret-envars-pod.yaml" %}

<!--
1. Create the Pod:
-->
1. 创建 Pod：

       kubectl create -f secret-envars-pod.yaml

<!--
1. Verify that your Pod is running:
-->
1. 确认 Pod 正在运行：

       kubectl get pod secret-envars-test-pod

<!--
    Output:
-->
    输出：

        NAME                     READY     STATUS    RESTARTS   AGE
        secret-envars-test-pod   1/1       Running   0          4m

<!--
1. Get a shell into the Container that is running in your Pod:
-->
1. 为 Pod 中运行的容器打开一个 shell：

       kubectl exec -it secret-envars-test-pod -- /bin/bash

<!--
1. In your shell, display the environment variables:
-->
1. 在 shell 中，显示环境变量：

        root@secret-envars-test-pod:/# printenv

<!--
    The output includes your username and password:
-->
    输出包括用户名和密码：

        ...
        SECRET_USERNAME=my-app
        ...
        SECRET_PASSWORD=39528$vdg7Jb

{% endcapture %}

{% capture whatsnext %}

<!--
* Learn more about [Secrets](/docs/concepts/configuration/secret/).
* Learn about [Volumes](/docs/concepts/storage/volumes/).
-->
* 了解更多关于 [Secrets](/docs/concepts/configuration/secret/)。
* 了解 [Volumes](/docs/concepts/storage/volumes/)。

<!--
### Reference
-->
### 参考

* [Secret](/docs/api-reference/{{page.version}}/#secret-v1-core)
* [Volume](/docs/api-reference/{{page.version}}/#volume-v1-core)
* [Pod](/docs/api-reference/{{page.version}}/#pod-v1-core)

{% endcapture %}

{% include templates/task.md %}
