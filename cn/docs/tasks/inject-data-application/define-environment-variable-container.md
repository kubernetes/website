<!--
---
title: Define Environment Variables for a Container
---
-->
---
title：为容器设置环境变量
---


{% capture overview %}

<!--
This page shows how to define environment variables when you run a container
in a Kubernetes Pod.
-->
本页将展示如何为kubernetes Pod下的容器设置环境变量。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--
## Define an environment variable for a container
-->
## 为容器设置一个环境变量

<!--
When you create a Pod, you can set environment variables for the containers
that run in the Pod. To set environment variables, include the `env` or
`envFrom` field in the configuration file.
-->
创建Pod时，可以为其下的容器设置环境变量。通过配置文件的`env`或者`envFrom`字段
来设置环境变量。

<!--
In this exercise, you create a Pod that runs one container. The configuration
file for the Pod defines an environment variable with name `DEMO_GREETING` and
value `"Hello from the environment"`. Here is the configuration file for the
Pod:
-->
本示例中，将创建一个只包含单个容器的Pod。Pod的配置文件中设置环境变量的名称
为`DEMO_GREETING`,其值为`"Hello from the environment"`。下面是Pod的配置文件内容：

{% include code.html language="yaml" file="envars.yaml" ghlink="/docs/tasks/inject-data-application/envars.yaml" %}

<!--
1. Create a Pod based on the YAML configuration file:
-->
1. 基于YAML文件创建一个Pod:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/envars.yaml

<!--
1. List the running Pods:
-->
1. 获取一下当前正在运行的Pods信息：

       kubectl get pods -l purpose=demonstrate-envars

    <!--
    The output is similar to this:
    -->
    查询结果应为：

        NAME            READY     STATUS    RESTARTS   AGE
        envar-demo      1/1       Running   0          9s

<!--
1. Get a shell to the container running in your Pod:
-->
1. 进入该Pod下的容器并打开一个shell

       kubectl exec -it envar-demo -- /bin/bash

<!--
1. In your shell, run the `printenv` command to list the environment variables.
-->
1. 在shell中通过执行`printenv`打印出环境变量。
       root@envar-demo:/# printenv

    <!--
    The output is similar to this:
    -->
    打印结果应为：

        NODE_VERSION=4.4.2
        EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
        HOSTNAME=envar-demo
        ...
        DEMO_GREETING=Hello from the environment

<!--
1. To exit the shell, enter `exit`.
-->
1. 通过键入`exit`退出shell。

{% endcapture %}

{% capture whatsnext %}

<!--
* Learn more about [environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/).
-->
* 获取更多资讯可参考 [environment variables](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/).
<!--
* Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
-->
* 获取更多资讯可参考 Learn about [using secrets as environment variables](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
<!--
* See [EnvVarSource](/docs/api-reference/{{page.version}}/#envvarsource-v1-core).
-->
* 参考 [EnvVarSource](/docs/api-reference/{{page.version}}/#envvarsource-v1-core).

{% endcapture %}


{% include templates/task.md %}
