---
title: 为容器定义环境变量
cn-approvers:
- pigletfly
---
<!--
---
title: Define Environment Variables for a Container
---
-->
{% capture overview %}

<!--
This page shows how to define environment variables when you run a container
in a Kubernetes Pod.
-->
本文展示了当您在 Kubernetes Pod 中运行一个容器时如何定义环境变量。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}
<!--
## Define an environment variable for a container
-->

## 为容器定义一个环境变量
<!--
When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.
-->
当您创建了一个 Pod，您可以给运行在这个 Pod 中的容器设置环境变量。要设置环境变量，在配置文件中包含 `env` 或者 `envFrom` 字段。

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration file for the
Pod:
-->
在本练习中，您创建一个 Pod，里面运行了一个容器。这个 Pod 的配置文件中定义了一个名字为 `DEMO_GREETING`，值为 `"Hello from the environment"` 的环境变量。这是这个 Pod 的配置文件：


{% include code.html language="yaml" file="envars.yaml" ghlink="/docs/tasks/inject-data-application/envars.yaml" %}

<!--
1. Create a Pod based on the YAML configuration file:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/envars.yaml
-->
1. 基于这个 YAML 文件创建一个 Pod：

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/envars.yaml

<!--
2. List the running Pods:

       kubectl get pods -l purpose=demonstrate-envars

    The output is similar to this:

        NAME            READY     STATUS    RESTARTS   AGE
        envar-demo      1/1       Running   0          9s
-->
2. 列出运行的 Pod：

       kubectl get pods -l purpose=demonstrate-envars

    输出和下面的相似：

        NAME            READY     STATUS    RESTARTS   AGE
        envar-demo      1/1       Running   0          9s

<!--
3. Get a shell to the container running in your Pod:

       kubectl exec -it envar-demo -- /bin/bash
-->
3. 获取您 Pod 中运行的容器的 shell:

       kubectl exec -it envar-demo -- /bin/bash

<!--
4. In your shell, run the `printenv` command to list the environment variables.

       root@envar-demo:/# printenv

    The output is similar to this:

        NODE_VERSION=4.4.2
        EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
        HOSTNAME=envar-demo
        ...
        DEMO_GREETING=Hello from the environment
-->
4. 在您的 shell 中，运行 `printenv` 命令列出环境环境变量。

       root@envar-demo:/# printenv

    输出和下面的相似：

        NODE_VERSION=4.4.2
        EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
        HOSTNAME=envar-demo
        ...
        DEMO_GREETING=Hello from the environment

<!--
5. To exit the shell, enter `exit`.
-->
5. 输入 `exit`，退出 shell。

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn more about [environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/).
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* See [EnvVarSource](/docs/api-reference/{{page.version}}/#envvarsource-v1-core).
-->

* 学习更多关于 [环境变量](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/).
* 学习 [使用 secrets 作为环境变量](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* 查看 [EnvVarSource](/docs/api-reference/{{page.version}}/#envvarsource-v1-core).

{% endcapture %}


{% include templates/task.md %}
