---
reviewers:
- thockin
title: Cloudstack
content_template: templates/concept
---

<!--
---
reviewers:
- thockin
title: Cloudstack
content_template: templates/concept
---
-->


{{% capture overview %}}

<!--
[CloudStack](https://cloudstack.apache.org/) is a software to build public and private clouds based on hardware virtualization principles (traditional IaaS). 
To deploy Kubernetes on CloudStack there are several possibilities depending on the Cloud being used and what images are made available. 
CloudStack also has a vagrant plugin available, hence Vagrant could be used to deploy Kubernetes either using the existing shell provisioner or using new Salt based recipes.
-->

[CloudStack](https://cloudstack.apache.org/) 是一种基于硬件虚拟化原则(传统 IaaS 概念)用来构建公有云和私有云的软件。要在 CloudStack 上部署 Kubernetes，
有几种可能性取决于正在使用的云以及可用的镜像。CloudStack 还提供了一个 vagrant 插件，因此 vagrant 可以使用现有的 shell 创建程序，或新的基于 Salt 的方法来部署 Kubernetes。

<!--
[CoreOS](http://coreos.com) templates for CloudStack are built [nightly](http://stable.release.core-os.net/amd64-usr/current/). 
CloudStack operators need to [register](http://docs.cloudstack.apache.org/projects/cloudstack-administration/en/latest/templates.html) this template in their cloud before proceeding with these Kubernetes deployment instructions.
-->
CloudStack 的 [CoreOS](http://coreos.com) 模板会[每夜](http://stable.release.core-os.net/amd64-usr/current/)构建。
CloudStack operators 需要在他们的云中 [注册](http://docs.cloudstack.apache.org/projects/cloudstack-administration/en/latest/templates.html)这个模板，然后才能继续执行 Kubernetes 部署的命令。

<!--
This guide uses a single [Ansible playbook](https://github.com/apachecloudstack/k8s), which is completely automated and can deploy Kubernetes on a CloudStack based Cloud using CoreOS images. The playbook, creates an ssh key pair, creates a security group and associated rules and finally starts coreOS instances configured via cloud-init.
-->

本指南只用到一个 [Ansible playbook](https://github.com/apachecloudstack/k8s)，完全自动化，可以使用 CoreOS 镜像在基于 CloudStack 的云上部署 Kubernetes。playbook 会创建 ssh 密钥对、创建安全组和相关规则，最后启动通过 cloud-init 配置的 CoreOS 实例。

{{% /capture %}}

{{% capture body %}}

<!--
## Prerequisites
-->

## 先决条件

```shell
sudo apt-get install -y python-pip libssl-dev
sudo pip install cs
sudo pip install sshpubkeys
sudo apt-get install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```
    
<!--    
On CloudStack server you also have to install libselinux-python :
-->
在 CloudStack 服务器上，您还必须安装 libselinux-python：

```shell
yum install libselinux-python
```

<!--
[_cs_](https://github.com/exoscale/cs) is a python module for the CloudStack API.
-->
[_cs_](https://github.com/exoscale/cs) 是 CloudStack API 的 python 模块。

<!--
Set your CloudStack endpoint, API keys and HTTP method used.
-->
设置所使用的 CloudStack 端点、API 键和 HTTP 方法。

<!--
You can define them as environment variables: `CLOUDSTACK_ENDPOINT`, `CLOUDSTACK_KEY`, `CLOUDSTACK_SECRET` and `CLOUDSTACK_METHOD`.
-->
你可以将它们定义为环境变量：`CLOUDSTACK_ENDPOINT`、`CLOUDSTACK_KEY`、`CLOUDSTACK_SECRET` 和 `CLOUDSTACK_METHOD`。

<!--
Or create a `~/.cloudstack.ini` file:
-->
或者创建一个 `~/.cloudstack.ini` 文件：

```none
[cloudstack]
endpoint = <your cloudstack api endpoint>
key = <your api access key>
secret = <your api secret key>
method = post
```

<!--
We need to use the http POST method to pass the _large_ userdata to the coreOS instances.
-->
我们需要使用 http POST 方法将 _large_ userdata 传递给 coreOS 实例。

<!--
### Clone the playbook
-->

### 复制 playbook

```shell
git clone https://github.com/apachecloudstack/k8s
cd kubernetes-cloudstack
```

<!--
### Create a Kubernetes cluster
-->

### 创建一个 Kubernetes 集群

<!--
You simply need to run the playbook.
-->
你只需要运行 playbook 即可。

```shell
ansible-playbook k8s.yml
```

<!--
Some variables can be edited in the `k8s.yml` file.
-->
可以在 `k8s.yml` 文件中编辑某些变量。

```none
vars:
  ssh_key: k8s
  k8s_num_nodes: 2
  k8s_security_group_name: k8s
  k8s_node_prefix: k8s2
  k8s_template: <templatename>
  k8s_instance_type: <serviceofferingname>
```

<!--
This will start a Kubernetes master node and a number of compute nodes (by default 2).
The `instance_type` and `template` are specific, edit them to specify your CloudStack cloud specific template and instance type (i.e. service offering).
-->
这将启动一个 Kubernetes 主节点和一些计算节点(默认情况下为 2)。
`instance_type` 和`模板`是特定的，编辑它们可以指定特定于 CloudStack 云的模板和实例类型(即服务提供)。

<!--
Check the tasks and templates in `roles/k8s` if you want to modify anything.
-->
如果您想修改任何内容，请检查 `roles/k8s` 中的任务和模板。

<!--
Once the playbook as finished, it will print out the IP of the Kubernetes master:
-->
一旦副本完成，它将打印出 Kubernetes 主节点的IP:

```none
TASK: [k8s | debug msg='k8s master IP is {{ k8s_master.default_ip }}'] ********
```

<!--
SSH to it using the key that was created and using the _core_ user.
-->
使用创建的密钥和 _core_ 用户 SSH 到它。

```shell
ssh -i ~/.ssh/id_rsa_k8s core@<master IP>
```

<!--
And you can list the machines in your cluster:
-->
您可以列出群集中的计算机：

```shell
fleetctl list-machines
```

```none
MACHINE        IP             METADATA
a017c422...    <node #1 IP>   role=node
ad13bf84...    <master IP>    role=master
e9af8293...    <node #2 IP>   role=node
```

<!--
## Support Level
-->

## 支持级别

<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
CloudStack           | Ansible      | CoreOS | flannel     | [docs](/docs/setup/on-premises-vm/cloudstack/)                             |          | Community ([@Guiques](https://github.com/ltupin/))
-->

IaaS 供应商        | 配置管理 | 操作系统     | 网络  | 文档                                              | 合规 | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
CloudStack           | Ansible      | CoreOS | flannel     | [文档](/docs/setup/on-premises-vm/cloudstack/)                             |          | 社区 ([@Guiques](https://github.com/ltupin/))


<!--
For support level information on all solutions, see the [Table of solutions](/docs/setup/pick-right-solution/#table-of-solutions) chart.
-->
有关所有解决方案的支持级别信息，请查看[解决方案](/docs/setup/pick-right-solution/# Table -of-solutions)图表。

{{% /capture %}}
