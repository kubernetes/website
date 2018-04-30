---
title: 使用 Secret 安全地分发凭证
---

{% capture overview %}
本文展示如何安全地将敏感数据（如密码和加密密钥）注入到 Pods 中。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## 将 secret 数据转换为 base-64 形式

假设用户想要有两条 secret 数据：用户名 `my-app` 和密码
`39528$vdg7Jb`。 首先使用 [Base64 编码](https://www.base64encode.org/) 将用户名和密码转化为 base-64 形式。 这里是一个 Linux 示例：

    echo -n 'my-app' | base64
    echo -n '39528$vdg7Jb' | base64

结果显示 base-64 形式的用户名为 `bXktYXBw`，
base-64 形式的密码为 `Mzk1MjgkdmRnN0pi`。

## 创建 Secret

这里是一个配置文件，可以用来创建存有用户名和密码的 Secret:

{% include code.html language="yaml" file="secret.yaml" ghlink="/docs/tasks/inject-data-application/secret.yaml" %}

1. 创建 Secret

       kubectl create -f secret.yaml

    **注意：** 如果想要跳过 Base64 编码的步骤，可以使用 `kubectl create secret` 命令来创建 Secret：
    {: .note}

       kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'

1. 查看 Secret 相关信息：

       kubectl get secret test-secret

    输出：

        NAME          TYPE      DATA      AGE
        test-secret   Opaque    2         1m

1. 查看 Secret 相关的更多详细信息：

       kubectl describe secret test-secret

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

## 创建可以通过卷访问 secret 数据的 Pod

这里是一个可以用来创建 pod 的配置文件：

{% include code.html language="yaml" file="secret-pod.yaml" ghlink="/docs/tasks/inject-data-application/secret-pod.yaml" %}

1. 创建 Pod：

       kubectl create -f secret-pod.yaml

1. 确认 Pod 正在运行：

       kubectl get pod secret-test-pod

    输出：

        NAME              READY     STATUS    RESTARTS   AGE
        secret-test-pod   1/1       Running   0          42m


1. 在 Pod 中运行的容器中获取一个 shell：

       kubectl exec -it secret-test-pod -- /bin/bash

1. secret 数据通过挂载在 `/etc/secret-volume` 目录下的卷暴露在容器中。
在 shell 中，进入 secret 数据被暴露的目录：

       root@secret-test-pod:/# cd /etc/secret-volume

1. 在 shell 中，列出 `/etc/secret-volume` 目录的文件：

       root@secret-test-pod:/etc/secret-volume# ls

    输出显示了两个文件，每个对应一条 secret 数据：

        password username

1. 在 shell 中，显示 `username` 和 `password` 文件的内容：

       root@secret-test-pod:/etc/secret-volume# cat username; echo; cat password; echo

    输出为用户名和密码：

        my-app
        39528$vdg7Jb

## 创建通过环境变量访问 secret 数据的 Pod

这里是一个可以用来创建 pod 的配置文件：

{% include code.html language="yaml" file="secret-envars-pod.yaml" ghlink="/docs/tasks/inject-data-application/secret-envars-pod.yaml" %}

1. 创建 Pod：

       kubectl create -f secret-envars-pod.yaml

1. 确认 Pod 正在运行：

       kubectl get pod secret-envars-test-pod

    输出：

        NAME                     READY     STATUS    RESTARTS   AGE
        secret-envars-test-pod   1/1       Running   0          4m

1. 在 Pod 中运行的容器中获取一个 shell：

       kubectl exec -it secret-envars-test-pod -- /bin/bash

1. 在 shell 中，显示环境变量：

        root@secret-envars-test-pod:/# printenv

    输出包括用户名和密码：

        ...
        SECRET_USERNAME=my-app
        ...
        SECRET_PASSWORD=39528$vdg7Jb

{% endcapture %}

{% capture whatsnext %}

* 了解更多关于 [Secrets](/docs/concepts/configuration/secret/)。
* 了解 [Volumes](/docs/concepts/storage/volumes/)。

### 参考

* [Secret](/docs/api-reference/{{page.version}}/#secret-v1-core)
* [Volume](/docs/api-reference/{{page.version}}/#volume-v1-core)
* [Pod](/docs/api-reference/{{page.version}}/#pod-v1-core)

{% endcapture %}

{% include templates/task.md %}
