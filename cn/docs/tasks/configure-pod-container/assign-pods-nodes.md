<!--
---
title: Assign Pods to Nodes
---

{% capture overview %}
This page shows how to assign a Kubernetes Pod to a particular node in a
Kubernetes cluster.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}
-->

---
title: 向节点分配 Pod
---

{% capture overview %}
这篇教程指导如何将Kubernetes的Pod分配给集群里指定的节点。
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## Add a label to a node

1. List the nodes in your cluster:

       kubectl get nodes

    The output is similar to this:

        NAME      STATUS    AGE     VERSION
        worker0   Ready     1d      v1.6.0+fff5156
        worker1   Ready     1d      v1.6.0+fff5156
        worker2   Ready     1d      v1.6.0+fff5156

1. Chose one of your nodes, and add a label to it:

       kubectl label nodes <your-node-name> disktype=ssd

    where `<your-node-name>` is the name of your chosen node.

1. Verify that your chosen node has a `disktype=ssd` label:

       kubectl get nodes --show-labels


    The output is similar to this:

        NAME      STATUS    AGE     VERSION            LABELS
        worker0   Ready     1d      v1.6.0+fff5156     ...,disktype=ssd,kubernetes.io/hostname=worker0
        worker1   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker1
        worker2   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker2

    In the preceding output, you can see that the `worker0` node has a
    `disktype=ssd` label.
-->

## 给节点添加标签

1. 列出集群里的节点:

       kubectl get nodes

    输出类似这样:

        NAME      STATUS    AGE     VERSION
        worker0   Ready     1d      v1.6.0+fff5156
        worker1   Ready     1d      v1.6.0+fff5156
        worker2   Ready     1d      v1.6.0+fff5156

1. 选择你的节点并添加一个标签：

       kubectl label nodes <your-node-name> disktype=ssd

    这里`<your-node-name>`就是你选择的节点名字.

1. 检查你选择的节点是否拥有标签`disktype=ssd`:

       kubectl get nodes --show-labels


    输出类似这样:

        NAME      STATUS    AGE     VERSION            LABELS
        worker0   Ready     1d      v1.6.0+fff5156     ...,disktype=ssd,kubernetes.io/hostname=worker0
        worker1   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker1
        worker2   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker2

    在前面的输出里，我们可以看到`worker0`有这样一个标签`disktype=ssd`。

<!--
## Create a pod that gets scheduled to your chosen node

This pod configuration file describes a pod that has a node selector,
`disktype: ssd`. This means that the pod will get scheduled on a node that has
a `disktype=ssd` label.

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/tasks/configure-pod-container/pod.yaml" %}

1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:

       kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/pod.yaml

1. Verify that the pod is running on your chosen node:

       kubectl get pods --output=wide

    The output is similar to this:

        NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
        nginx    1/1       Running   0          13s    10.200.0.4   worker0

{% endcapture %}

{% capture whatsnext %}
Learn more about
[labels and selectors](/docs/user-guide/labels/).
{% endcapture %}

{% include templates/task.md %}
-->

## 创建一个Pod并调度给所选的节点

这个Pod的配置文件描述了Pod有一个节点选择器，`disktype: ssd`。表示这个Pod将会
安排到拥有`disktype: ssd`标签的节点上。

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/tasks/configure-pod-container/pod.yaml" %}

1. 使用这个配置文件来创建Pod并分配给所选的节点。

       kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/pod.yaml

1. 验证这个Pod是否运行在选择的节点上：

       kubectl get pods --output=wide

    输出类似这样：
	
        NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
        nginx    1/1       Running   0          13s    10.200.0.4   worker0

{% endcapture %}

{% capture whatsnext %}
这里可以获取更详细信息
[标签和标签选择器](/docs/user-guide/labels/).
{% endcapture %}

{% include templates/task.md %}
