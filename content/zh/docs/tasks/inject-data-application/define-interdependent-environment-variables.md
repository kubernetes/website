---
title: 定义相互依赖的环境变量
content_type: task
weight: 20
---

<!-- overview -->
<!--
This page shows how to define dependent environment variables for a container
in a Kubernetes Pod.
-->
本页展示了如何给 Kubernetes 集群 Pod 中的容器定义环境依赖变量。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->
<!--
## Define an environment dependent variable for a container

When you create a Pod, you can set dependent environment variables for the containers that run in the Pod. To set dependent environment variables, you can use $(VAR_NAME) in the `value` of `env` in the configuration file.

In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an dependent environment variable with common usage defined. Here is the configuration manifest for the
Pod:
-->
## 给容器定义一个环境依赖变量

当你创建一个 Pod 时，可以给运行在这个 Pod 中的容器设置依赖的环境变量，
你可以在配置文件中设置 `env` 的 `value` 为 `$(VAR_NAME)` 格式内容。

在这个练习中，你会创建一个只运行一个容器的 Pod。这个 Pod 的配置文件
定义了一个具有常用用法的环境依赖变量，下面就是这个 Pod 的配置清单：

{{< codenew file="pods/inject/dependent-envars.yaml" >}}

<!--
1. Create a Pod based on that manifest:
-->
1. 基于这个清单创建一个 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
    ```
    ```
    pod/dependent-envars-demo created
    ```

<!--
2. List the running Pods:
-->
2. 列出运行中的 Pod：

    ```shell
    kubectl get pods dependent-envars-demo
    ```
    ```
    NAME                      READY     STATUS    RESTARTS   AGE
    dependent-envars-demo     1/1       Running   0          9s
    ```

<!--
3. Check the logs for the container running in your Pod:
-->
3. 检查你的 Pod 中运行的容器打印出来的日志：

    ```shell
    kubectl logs pod/dependent-envars-demo
    ```
    ```

    UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
    SERVICE_ADDRESS=https://172.17.0.1:80
    ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
    ```

<!--
As shown above, you have defined the correct dependency reference of `SERVICE_ADDRESS`, bad dependency reference of `UNCHANGED_REFERENCE` and skip dependent references of `ESCAPED_REFERENCE`.

When an environment variable is already defined when being referenced,
the reference can be correctly resolved, such as in the `SERVICE_ADDRESS` case.

When the environment variable is undefined or only includes some variables, the undefined environment variable is treated as a normal string, such as `UNCHANGED_REFERENCE`. Note that incorrectly parsed environment variables, in general, will not block the container from starting.

The `$(VAR_NAME)` syntax can be escaped with a double `$`, ie: `$$(VAR_NAME)`.
Escaped references are never expanded, regardless of whether the referenced variable
is defined or not. This can be seen from the `ESCAPED_REFERENCE` case above.
-->
如上所示，你已经定义了正确的依赖引用 `SERVICE_ADDRESS`，错误的依赖
引用 `UNCHANGED_REFERENCE` 以及被忽略的依赖引用 `ESCAPED_REFERENCE`。

当引用一个已经被定义的环境变量时，这个引用就可以被正确解析，比如这个例子中的 `SERVICE_ADDRESS`。

当一个环境变量没有被定义，或者仅仅包含几个变量，这个未定义的环境变量就会被当做一个普通的字符串解析，
比如 `UNCHANGED_REFERENCE`。请注意，错误地解析环境变量通常不会阻止容器启动。

`$(VAR_NAME)` 语法可以使用双 `$` 来转义，比如：`$$(VAR_NAME)`。转义的引用永远都不会被扩展，
无论这个引用的变量是否被定义。这可以从上面的 `ESCAPED_REFERENCE` 案例中看出。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* See [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
-->
* 进一步了解[环境变量](/zh/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)。
* 查看 [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)。
