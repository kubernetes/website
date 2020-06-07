---
title: oVirt
content_template: templates/concept
---
<!--
---
reviewers:
- caesarxuchao
- erictune
title: oVirt
content_template: templates/concept
---
-->

{{% capture overview %}}

<!--
oVirt is a virtual datacenter manager that delivers powerful management of multiple virtual machines on multiple hosts. Using KVM and libvirt, oVirt can be installed on Fedora, CentOS, or Red Hat Enterprise Linux hosts to set up and manage your virtual data center.
-->
oVirt 是一个虚拟数据中心管理器，可以对多个主机上的多个虚拟机进行强大的管理。
使用 KVM 和 libvirt ，可以将 oVirt 安装在 Fedora、CentOS 或者 Red Hat Enterprise Linux 主机上，以部署和管理您的虚拟数据中心。

{{% /capture %}}

{{% capture body %}}

<!--
## oVirt Cloud Provider Deployment
-->
## oVirt 云驱动的部署

<!--
The oVirt cloud provider allows to easily discover and automatically add new VM instances as nodes to your Kubernetes cluster.
At the moment there are no community-supported or pre-loaded VM images including Kubernetes but it is possible to [import] or [install] Project Atomic (or Fedora) in a VM to [generate a template]. Any other distribution that includes Kubernetes may work as well.
-->
oVirt 云驱动可以轻松发现新 VM 实例并自动将其添加为 Kubernetes 集群的节点。
目前，包括 Kubernetes 在内，尚无社区支持或预加载的 VM 镜像，但可以在 VM 中 [导入] 或 [安装] Project Atomic（或 Fedora）来 [生成模版]。
包括 Kubernetes 的任何其他 Linux 发行版也可能可行。

<!--
It is mandatory to [install the ovirt-guest-agent] in the guests for the VM ip address and hostname to be reported to ovirt-engine and ultimately to Kubernetes.
-->
必须在寄宿系统中 [安装 ovirt-guest-agent]，才能将 VM 的 IP 地址和主机名报给 ovirt-engine 并最终报告给 Kubernetes。

<!--
Once the Kubernetes template is available it is possible to start instantiating VMs that can be discovered by the cloud provider.
-->
一旦 Kubernetes 模版可用，就可以开始创建可由云驱动发现的 VM。

<!--
[import]: https://ovedou.blogspot.it/2014/03/importing-glance-images-as-ovirt.html
[install]: https://www.ovirt.org/documentation/quickstart/quickstart-guide/#create-virtual-machines
[generate a template]: https://www.ovirt.org/documentation/quickstart/quickstart-guide/#using-templates
[install the ovirt-guest-agent]: https://www.ovirt.org/documentation/how-to/guest-agent/install-the-guest-agent-in-fedora/
-->
[导入]: https://ovedou.blogspot.it/2014/03/importing-glance-images-as-ovirt.html
[安装]: https://www.ovirt.org/documentation/quickstart/quickstart-guide/#create-virtual-machines
[生成模版]: https://www.ovirt.org/documentation/quickstart/quickstart-guide/#using-templates
[安装 ovirt-guest-agent]: https://www.ovirt.org/documentation/how-to/guest-agent/install-the-guest-agent-in-fedora/

<!--
## Using the oVirt Cloud Provider
-->
## 使用 oVirt 云驱动

<!--
The oVirt Cloud Provider requires access to the oVirt REST-API to gather the proper information, the required credential should be specified in the `ovirt-cloud.conf` file:
-->
oVirt 云驱动需要访问 oVirt REST-API 来收集正确的信息，所需的凭据应在 `ovirt-cloud.conf` 文件中设定：

```none
[connection]
uri = https://localhost:8443/ovirt-engine/api
username = admin@internal
password = admin
```

<!--
In the same file it is possible to specify (using the `filters` section) what search query to use to identify the VMs to be reported to Kubernetes:
-->
在同一文件中，可以指定（使用 `filters` 节区）搜索查询，用于辨识要报告给 Kubernetes 的 VM：

```none
[filters]
# Search query used to find nodes
vms = tag=kubernetes
```

<!--
In the above example all the VMs tagged with the `kubernetes` label will be reported as nodes to Kubernetes.
-->
在上面的示例中，所有带有 `kubernetes` 标签的虚拟机都将作为节点报告给 Kubernetes。

<!--
The `ovirt-cloud.conf` file then must be specified in kube-controller-manager:
-->
然后必须向 kube-controller-manager 提供 `ovirt-cloud.conf` 文件：

```shell
kube-controller-manager ... --cloud-provider=ovirt --cloud-config=/path/to/ovirt-cloud.conf ...
```

<!--
## oVirt Cloud Provider Screencast
-->
## oVirt 云驱动截屏视频

<!--
This short screencast demonstrates how the oVirt Cloud Provider can be used to dynamically add VMs to your Kubernetes cluster.
-->
这段简短的截屏视频演示了如何使用 oVirt 云提供商将 VM 动态添加到 Kubernetes 集群。

<!--
[![Screencast](https://img.youtube.com/vi/JyyST4ZKne8/0.jpg)](https://www.youtube.com/watch?v=JyyST4ZKne8)
-->
[![截屏视频](https://img.youtube.com/vi/JyyST4ZKne8/0.jpg)](https://www.youtube.com/watch?v=JyyST4ZKne8)

<!--
## Support Level
-->
## 支持级别


<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
oVirt                |              |        |             | [docs](/docs/setup/production-environment/on-premises-vm/ovirt/)                                  |          | Community ([@simon3z](https://github.com/simon3z))
-->
IaaS 提供商        | 配置管理 | OS     | 联网  | 文件                                              | 遵从性 | 支持级别
----------------- | ------- | ------ | ---- | ------------------------------------------------- |------| ---------------
oVirt | | | | [文件](/docs/setup/production-environment/on-premises-vm/ovirt/) | | 社区 ([@simon3z](https://github.com/simon3z))


{{% /capture %}}

