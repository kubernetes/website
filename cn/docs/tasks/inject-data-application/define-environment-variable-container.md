---
title: 为容器设置环境变量
---

{% capture overview %}

本页将展示如何为kubernetes Pod下的容器设置环境变量。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## 为容器设置一个环境变量

创建Pod时，可以为其下的容器设置环境变量。通过配置文件的`env`或者`envFrom` 字段来设置环境变量。

本示例中，将创建一个只包含单个容器的Pod。Pod的配置文件中设置环境变量的名称为`DEMO_GREETING`，
其值为`"Hello from the environment"`。下面是Pod的配置文件内容:

{% include code.html language="yaml" file="envars.yaml" ghlink="/docs/tasks/inject-data-application/envars.yaml" %}

1. 基于YAML文件创建一个Pod:

       kubectl create -f https://k8s.io/docs/tasks/inject-data-application/envars.yaml

1. 获取一下当前正在运行的Pods信息:

       kubectl get pods -l purpose=demonstrate-envars

    查询结果应为:

        NAME            READY     STATUS    RESTARTS   AGE
        envar-demo      1/1       Running   0          9s

1. 进入该Pod下的容器并打开一个命令终端:

       kubectl exec -it envar-demo -- /bin/bash

1. 在命令终端中通过执行`printenv`打印出环境变量。

       root@envar-demo:/# printenv

    打印结果应为:

        NODE_VERSION=4.4.2
        EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
        HOSTNAME=envar-demo
        ...
        DEMO_GREETING=Hello from the environment

1. 通过键入`exit`退出命令终端。

{% endcapture %}

{% capture whatsnext %}

* 有关环境变量的更多信息，请参阅[这里](/docs/tasks/configure-pod-container/environment-variable-expose-pod-information/)。
* 有关如何通过环境变量来使用Secret，请参阅[这里](/docs/user-guide/secrets/#using-secrets-as-environment-variables)。
* 关于[EnvVarSource](/docs/api-reference/{{page.version}}/#envvarsource-v1-core)资源的信息。

{% endcapture %}


{% include templates/task.md %}
