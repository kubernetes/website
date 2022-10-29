---
title: 使用 Kustomize 管理 Secret
content_type: task
weight: 30
description: 使用 kustomization.yaml 文件创建 Secret 对象。
---
<!-- 
title: Managing Secrets using Kustomize
content_type: task
weight: 30
description: Creating Secret objects using kustomization.yaml file.
-->

<!-- overview -->

<!--  
Since Kubernetes v1.14, `kubectl` supports
[managing objects using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).
Kustomize provides resource Generators to create Secrets and ConfigMaps. The
Kustomize generators should be specified in a `kustomization.yaml` file inside
a directory. After generating the Secret, you can create the Secret on the API
server with `kubectl apply`.
-->
从 kubernetes v1.14 开始，`kubectl` 支持[使用 Kustomize 管理对象](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/)。
Kustomize 提供了资源生成器（Generators）来创建 Secret 和 ConfigMap。
Kustomize 生成器应该在某个目录的 `kustomization.yaml` 文件中指定。
生成 Secret 后，你可以使用 `kubectl apply` 在 API 服务器上创建该 Secret。
## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- ## Create the Kustomization file -->
## 创建 Kustomization 文件    {#create-the-kustomization-file}

<!--  
You can generate a Secret by defining a `secretGenerator` in a
`kustomization.yaml` file that references other existing files.
For example, the following kustomization file references the
`./username.txt` and the `./password.txt` files:
-->
你可以在 `kustomization.yaml` 中定义 `secreteGenerator` 字段，并在定义中引用其它本地文件生成 Secret。
例如：下面的 kustomization 文件 引用了 `./username.txt` 和 `./password.txt` 文件：

```yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
```

<!--  
You can also define the `secretGenerator` in the `kustomization.yaml`
file by providing some literals.
For example, the following `kustomization.yaml` file contains two literals
for `username` and `password` respectively:
-->
你也可以在 `kustomization.yaml` 文件中指定一些字面量定义 `secretGenerator` 字段。
例如：下面的 `kustomization.yaml` 文件中包含了 `username` 和 `password` 两个字面量：

```yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=1f2d1e2e67df
```

<!-- 
You can also define the `secretGenerator` in the `kustomization.yaml`
file by providing `.env` files.
For example, the following `kustomization.yaml` file pulls in data from
`.env.secret` file:
-->
你也可以使用 `.env` 文件在 `kustomization.yaml` 中定义 `secretGenerator`。
例如：下面的 `kustomization.yaml` 文件从 `.env.secret` 文件获取数据。

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```

<!--
Note that in all cases, you don't need to base64 encode the values.
-->
注意，上面两种情况，你都不需要使用 base64 编码。

<!-- ## Create the Secret -->
## 创建 Secret    {#create-the-secret}

<!-- Apply the directory containing the `kustomization.yaml` to create the Secret. -->
在包含 `kustomization.yaml` 文件的目录下使用 `kubectl apply` 命令创建 Secret。

```shell
kubectl apply -k .
```

<!-- The output is similar to: -->
输出类似于：

```
secret/db-user-pass-96mffmfh4k created
```

<!-- 
Note that when a Secret is generated, the Secret name is created by hashing
the Secret data and appending the hash value to the name. This ensures that
a new Secret is generated each time the data is modified. 
-->
请注意，生成 Secret 时，Secret 的名称最终是由 `name` 字段和数据的哈希值拼接而成。
这将保证每次修改数据时生成一个新的 Secret。

<!-- ## Check the Secret created -->
## 检查创建的 Secret    {#check-the-secret-created}

<!-- You can check that the secret was created: -->
你可以检查刚才创建的 Secret：

```shell
kubectl get secrets
```

<!-- The output is similar to: -->
输出类似于：

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s
```

<!-- You can view a description of the secret: -->
你可以看到 Secret 的描述：

```shell
kubectl describe secrets/db-user-pass-96mffmfh4k
```

<!-- The output is similar to: -->
输出类似于：

```
Name:            db-user-pass-96mffmfh4k
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

<!-- 
The commands `kubectl get` and `kubectl describe` avoid showing the contents of a `Secret` by
default. This is to protect the `Secret` from being exposed accidentally to an onlooker,
or from being stored in a terminal log.
To check the actual content of the encoded data, please refer to
[decoding secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret). 
-->
`kubectl get` 和 `kubectl describe` 命令默认不显示 `Secret` 的内容。
这是为了防止 `Secret` 被意外暴露给旁观者或存储在终端日志中。
检查编码后的实际内容，请参考[解码 secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)。 


<!-- ## Clean Up -->
## 清理    {#clean-up}

<!-- To delete the Secret you have created: -->
删除你创建的 Secret：

```shell
kubectl delete secret db-user-pass-96mffmfh4k
```

<!-- Optional section; add links to information related to this topic. -->
## {{% heading "whatsnext" %}}

<!-- 
- Read more about the [Secret concept](/docs/concepts/configuration/secret/)
- Learn how to [manage Secrets with the `kubectl` command](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/) 
-->
- 进一步阅读 [Secret 概念](/zh-cn/docs/concepts/configuration/secret/)
- 了解如何[使用 `kubectl` 命令管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- 了解如何[使用配置文件管理 Secret](/zh-cn/docs/tasks/configmap-secret/managing-secret-using-config-file/)
