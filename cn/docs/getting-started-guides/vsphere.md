---
approvers:
- erictune
- jbeda
title: VMware vSphere
---

<!--
This page covers how to get started with deploying Kubernetes on vSphere and details for how to configure the vSphere Cloud Provider.

* TOC
{:toc}
-->
本页面涵盖了如何在vSphere上从头开始部署Kubernetes，以及如何配置vSphere云服务提供商的细节。

<!--
### Getting started with the vSphere Cloud Provider

Kubernetes comes with *vSphere Cloud Provider*, a cloud provider for vSphere that allows Kubernetes Pods to use enterprise grade vSphere Storage.
-->
### 让我们从vSphere云服务提供商开始

vSphere云服务提供商与kubernetes一起，可以允许Kubernetes pod使用企业级的vSphere存储。

<!--
### Deploy Kubernetes on vSphere

To deploy Kubernetes on vSphere and use the vSphere Cloud Provider, see [Kubernetes-Anywhere](https://github.com/kubernetes/kubernetes-anywhere). 

Detailed steps can be found at the [getting started with Kubernetes-Anywhere on vSphere](https://git.k8s.io/kubernetes-anywhere/phase1/vsphere/README.md) page.
-->
### 在vSphere上部署Kubernetes

关于在vSphere上部署Kubernetes以及对vSphere云服务提供商的使用，可以参考[Kubernetes-Anywhere](https://github.com/kubernetes/kubernetes-anywhere)。

详细的步骤可以在[在vSphere上使用Kubernetes-Anywhere](https://git.k8s.io/kubernetes-anywhere/phase1/vsphere/README.md)页面上找到。

<!--
### vSphere Cloud Provider

vSphere Cloud Provider allows Kubernetes to use vSphere managed enterprise grade storage. It supports:

- Enterprise class services such as de-duplication and encryption with vSAN, QoS, high availability and data reliability.
- Policy based management at granularity of container volumes.
- Volumes, Persistent Volumes, Storage Classes, dynamic provisioning of volumes, and scalable deployment of Stateful Apps with StatefulSets.

For more detail visit [vSphere Storage for Kubernetes Documentation](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/index.html).

Documentation for how to use vSphere managed storage can be found in the [persistent volumes user guide](/docs/concepts/storage/persistent-volumes/#vsphere) and the [volumes user guide](/docs/concepts/storage/volumes/#vspherevolume).

Examples can be found [here](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere).
-->
### vSphere云服务提供商

vSphere云服务提供商允许Kubernetes使用vSphere管理的企业级存储。它支持：

- 企业级服务，比如通过vSAN，QoS，高可用性和数据可靠性，实现去重和加密。
- 在容器卷粒度提供基于策略的管理
- 卷、持久卷、存储类、卷的动态配置、和使用StatefulSets为有状态的Apps提供可扩展的部署。

更多信息，请访问[vSphere Storage for Kubernetes Documentation](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/index.html).

关于如何使用vSphere管理的存储的相关文档可以在[持久卷用户指南](/docs/concepts/storage/persistent-volumes/#vsphere)和[卷用户指南](/docs/concepts/storage/persistent-volumes/#vsphere)中找到。

相关实例可以在【这里】(https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)找到。

<!--
#### Enable vSphere Cloud Provider

If a Kubernetes cluster has not been deployed using Kubernetes-Anywhere, follow the instructions below to enable the vSphere Cloud Provider. These steps are not needed when using Kubernetes-Anywhere, they will be done as part of the deployment.

**Step-1** [Create a VM folder](https://docs.vmware.com/en/VMware-vSphere/6.0/com.vmware.vsphere.vcenterhost.doc/GUID-031BDB12-D3B2-4E2D-80E6-604F304B4D0C.html) and move Kubernetes Node VMs to this folder.

**Step-2** Make sure Node VM names must comply with the regex `[a-z](([-0-9a-z]+)?[0-9a-z])?(\.[a-z0-9](([-0-9a-z]+)?[0-9a-z])?)*`. If Node VMs do not comply with this regex, rename them and make it compliant to this regex.

  Node VM names constraints:

  * VM names can not begin with numbers.
  * VM names can not have capital letters, any special characters except `.` and `-`.
  * VM names can not be shorter than 3 chars and longer than 63.
-->
#### 激活vSphere云服务提供商

如果Kubernetes集群不是通过Kubernetes-Anywhere部署的，请按照下面的方法来激活vSphere云服务提供商。如果你使用的是Kubernetes-Anywhere，就无需这些步骤了，因为这些步骤在部署过程中就已经完成了。

**步骤-1** 【创建一个VM目录】(https://docs.vmware.com/en/VMware-vSphere/6.0/com.vmware.vsphere.vcenterhost.doc/GUID-031BDB12-D3B2-4E2D-80E6-604F304B4D0C.html)，并把Kubernetes节点VM都移到这个目录下。

**步骤-2** 确保节点VM的名字必须满足正则表达式`[a-z](([-0-9a-z]+)?[0-9a-z])?(\.[a-z0-9](([-0-9a-z]+)?[0-9a-z])?)*`。如果节点VM的名字不满足该正则表达式，则需要把它重命名，确保满足该正则表达式。

  节点VM名字的限制：
  
  * VM的名字不能以数字开头。
  * VM的名字不能有大写字母、不能有除‘.’和‘-’以外的任何特殊字符。
  * VM的名字不能少于三个字符，也不能多过63个字符。

<!--
**Step-3** Enable disk UUID on Node virtual machines.

The disk.EnableUUID parameter must be set to "TRUE" for each Node VM. This step is necessary so that the VMDK always presents a consistent UUID to the VM, thus allowing the disk to be mounted properly. 

For each of the virtual machine nodes that will be participating in the cluster, follow the steps below using [GOVC tool](https://github.com/vmware/govmomi/tree/master/govc)

* Set up GOVC environment

        export GOVC_URL='vCenter IP OR FQDN'
        export GOVC_USERNAME='vCenter User'
        export GOVC_PASSWORD='vCenter Password'
        export GOVC_INSECURE=1

* Find Node VM Paths

        govc ls /datacenter/vm/<vm-folder-name>

* Set disk.EnableUUID to true for all VMs

        govc vm.change -e="disk.enableUUID=1" -vm='VM Path'

Note: If Kubernetes Node VMs are created from template VM then `disk.EnableUUID=1` can be set on the template VM. VMs cloned from this template, will automatically inherit this property.
-->
**步骤-3** 在节点VM上激活磁盘的UUID

每个节点VM的disk.EnableUUID参数必须设置为“TRUE”。这个步骤是需要的，这样保证VMDK对VM总是呈现相同的UUID，进而允许磁盘正确的挂载。

对即将加入集群中的所有VM节点，使用[GOVC工具](https://github.com/vmware/govmomi/tree/master/govc)执行以下步骤：

* 搭建GOVC环境

		export GOVC_URL='vCenter IP OR FQDN'
        export GOVC_USERNAME='vCenter User'
        export GOVC_PASSWORD='vCenter Password'
        export GOVC_INSECURE=1

* 找出节点VM的路径

		govc ls /datacenter/vm/<vm-folder-name>
		
* 将所有VM的disk.EnableUUID设置为true

		govc vm.change -e="disk.enableUUID=1" -vm='VM 路径'
		
注意： 如果Kubernetes的节点VM都是使用模板VM创建的，在模板VM里面设置`disk.EnableUUID=1`即可。从该模板克隆出来的VM自动继承该属性。

<!--
**Step-4** Create and assign Roles to the vSphere Cloud Provider user and vSphere entities.

Note: if you want to use Administrator account then this step can be skipped.

vSphere Cloud Provider requires the following minimal set of privileges to interact with vCenter. Please refer [vSphere Documentation Center](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html) to know about steps for creating a Custom Role, User and Role Assignment.
-->
**步骤-4** 为vSphere云服务提供商用户和vSphere实体创建并分配角色

注意： 如果你想使用管理员账号，可以略过此步。

vSphere云服务提供商要与vCenter进行交互，至少需要以下一组特权。请参考[vSphere文档中心](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html)了解创建客户角色、用户和角色分配的具体步骤。

<table>
<thead>
<tr>
  <th>Roles</th>
  <th>Privileges</th>
  <th>Entities</th>
  <th>Propagate to Children</th>
</tr>
</thead>
<tbody><tr>
  <td>manage-k8s-node-vms</td>
  <td>Resource.AssignVMToPool<br> System.Anonymous<br> System.Read<br> System.View<br> VirtualMachine.Config.AddExistingDisk<br> VirtualMachine.Config.AddNewDisk<br> VirtualMachine.Config.AddRemoveDevice<br> VirtualMachine.Config.RemoveDisk<br> VirtualMachine.Inventory.Create<br> VirtualMachine.Inventory.Delete</td>
  <td>Cluster,<br> Hosts,<br> VM Folder</td>
  <td>Yes</td>
</tr>
<tr>
  <td>manage-k8s-volumes</td>
  <td>Datastore.AllocateSpace<br> Datastore.FileManagement<br> System.Anonymous<br> System.Read<br> System.View</td>
  <td>Datastore</td>
  <td>No</td>
</tr>
<tr>
  <td>k8s-system-read-and-spbm-profile-view</td>
  <td>StorageProfile.View<br> System.Anonymous<br> System.Read<br> System.View</td>
  <td>vCenter</td>
  <td>No</td>
</tr>
<tr>
  <td>ReadOnly</td>
  <td>System.Anonymous<br>System.Read<br>System.View</td>
  <td>Datacenter,<br> Datastore Cluster,<br> Datastore Storage Folder</td>
  <td>No</td>
</tr>
</tbody>
</table>

<!--
**Step-5** Create the vSphere cloud config file (`vsphere.conf`). Cloud config template can be found [here](https://github.com/kubernetes/kubernetes-anywhere/blob/master/phase1/vsphere/vsphere.conf).

This config file needs to be placed in the shared directory which should be accessible from kubelet container, controller-manager pod, and API server pod.
-->
**步骤-5** 创建vSphere云配置文件(`vsphere.conf`)。云配置模板可以在【这里】(https://github.com/kubernetes/kubernetes-anywhere/blob/master/phase1/vsphere/vsphere.conf)找到。

**```vsphere.conf``` for Master Node:**

```
[Global]
        user = "vCenter username for cloud provider"
        password = "password"
        server = "IP/FQDN for vCenter"
        port = "443" #Optional
        insecure-flag = "1" #set to 1 if the vCenter uses a self-signed cert
        datacenter = "Datacenter name" 
        datastore = "Datastore name" #Datastore to use for provisioning volumes using storage classes/dynamic provisioning
        working-dir = "vCenter VM folder path in which node VMs are located"
        vm-name = "VM name of the Master Node" #Optional
        vm-uuid = "UUID of the Node VM" # Optional        
[Disk]
    scsicontrollertype = pvscsi
```
<!--
Note: **```vm-name``` parameter is introduced in 1.6.4 release.** Both ```vm-uuid``` and ```vm-name``` are optional parameters. If ```vm-name``` is specified then ```vm-uuid``` is not used. If both are not specified then kubelet will get vm-uuid from `/sys/class/dmi/id/product_serial` and query vCenter to find the Node VM's name. 

**```vsphere.conf``` for Worker Nodes:** (Only Applicable to 1.6.4 release and above. For older releases this file should have all the parameters specified in Master node's ```vSphere.conf``` file).

``` 
[Global]
        vm-name = "VM name of the Worker Node"
```
-->

注意：  **```vm-name```参数是在1.6.4发行版中引入的。** ```vm-uuid``` 和 ```vm-name```都是可选项。如果指定了```vm-name```，则```vm-uuid```会被忽略。如果两个参数都没有指定，那么kubelet会从`/sys/class/dmi/id/product_serial`中获取vm-uuid，然后查询vCenter得到节点VM的名字。

**```vsphere.conf```是工作节点的： ** （只适用于1.6.4及以上的版本。对老的版本而言，这个文件必须具有master节点```vSphere.conf```文件中指定的所有参数）。
``` 
[Global]
        vm-name = "工作节点的VM名字"
```

<!--
Below is summary of supported parameters in the `vsphere.conf` file

* ```user``` is the vCenter username for vSphere Cloud Provider.
* ```password``` is the password for vCenter user specified with `user`.
* ```server``` is the vCenter Server IP or FQDN
* ```port``` is the vCenter Server Port. Default is 443 if not specified.
* ```insecure-flag``` is set to 1 if vCenter used a self-signed certificate.
* ```datacenter``` is the name of the datacenter on which Node VMs are deployed.
* ```datastore``` is the default datastore to use for provisioning volumes using storage classes/dynamic provisioning.
* ```vm-name``` is recently added configuration parameter. This is optional parameter. When this parameter is present, ```vsphere.conf``` file on the worker node does not need vCenter credentials.

  **Note:** ```vm-name``` is added in the release 1.6.4. Prior releases does not support this parameter. 
-->
下面是`vsphere.conf` 文件中支持的一些参数

* ```user``` 是vSphere云服务提供商中vCenter的用户名。
* ```password``` 是vCenter用户`user`的密码。
* ```server``` 是vCenter server的IP或FQDN。
* ```port``` 是vCenter server的端口，如果没有指定，默认是443。
* ```insecure-flag``` 如果vCenter使用的是自签名的证书，则该值为1。
* ```datacenter``` 是部署节点VM的数据中心的名字。
* ```datastore``` 是使用存储类/动态配置提供卷时默认使用的datastore。
* ```vm-name``` 是最近新增的配置参数。这是一个可选参数。当这个参数出现时，工作节点上的```vsphere.conf```文件不需要vCenter的认证信息。

**注意:** ```vm-name```是版本1.6.4新增的。之前的版本不支持这个参数。

<!--
* ```working-dir``` can be set to empty ( working-dir = ""), if Node VMs are located in the root VM folder.
* ```vm-uuid``` is the VM Instance UUID of virtual machine. ```vm-uuid``` can be set to empty (```vm-uuid = ""```). If set to empty, this will be retrieved from /sys/class/dmi/id/product_serial file on virtual machine (requires root access).

  * ```vm-uuid``` needs to be set in this format - ```423D7ADC-F7A9-F629-8454-CE9615C810F1```

  * ```vm-uuid``` can be retrieved from Node Virtual machines using following command. This will be different on each node VM.

        cat /sys/class/dmi/id/product_serial | sed -e 's/^VMware-//' -e 's/-/ /' | awk '{ print toupper($1$2$3$4 "-" $5$6 "-" $7$8 "-" $9$10 "-" $11$12$13$14$15$16) }'

* `datastore` is the default datastore used for provisioning volumes using storage classes. If datastore is located in storage folder or datastore is member of datastore cluster, make sure to specify full datastore path. Make sure vSphere Cloud Provider user has Read Privilege set on the datastore cluster or storage folder to be able to find datastore.
  * For datastore located in the datastore cluster, specify datastore as mentioned below

        datastore = "DatastoreCluster/datastore1"

  * For datastore located in the storage folder, specify datastore as mentioned below

        datastore = "DatastoreStorageFolder/datastore1"

**Step-6** Add flags to controller-manager, API server and Kubelet to enable vSphere Cloud Provider.
* Add following flags to kubelet running on every node and to the controller-manager and API server pods manifest files. 
-->
* ```working-dir``` 如果节点VM位于根VM目录下，则该值可以设置为空 ( working-dir = "")。
* ```vm-uuid``` 是VM的VM实例UUID。```vm-uuid```可以设置为空 (```vm-uuid = ""```)。 如果设置为空，可以从VM的/sys/class/dmi/id/product_serial文件中重新获得 (需要root访问权限)。

  * ```vm-uuid``` 需要设置为这种格式 - ```423D7ADC-F7A9-F629-8454-CE9615C810F1```

  * ```vm-uuid``` 可以使用如下命令从节点VM中重新获得。每个节点VM的命令不同。

        cat /sys/class/dmi/id/product_serial | sed -e 's/^VMware-//' -e 's/-/ /' | awk '{ print toupper($1$2$3$4 "-" $5$6 "-" $7$8 "-" $9$10 "-" $11$12$13$14$15$16) }'

* `datastore` 指的是使用存储类提供卷时默认的datastore。如果datastore位于存储目录下，或者datastore是某个datastore集群的一部分，请确保指定完整的datastore路径。同时还需要确保vSphere云服务提供商拥有datastore集群或用于找到datastore的存储目录的读权限。

  * 对在datastore集群中的datastore而言，按照如下方式指定datastore

        datastore = "DatastoreCluster/datastore1"

  * 对位于存储目录下的datastore而言，按照如下方式指定
  
        datastore = "DatastoreStorageFolder/datastore1"

**步骤-6** 在controller-manager, API server和 Kubelet上添加标记，进而激活vSphere云服务提供商。
* 在每个节点上运行的kubelet，controller-manager和API pod manifest文件上加上如下标记。

```
--cloud-provider=vsphere
--cloud-config=<Path of the vsphere.conf file>
```

<!--
Manifest files for API server and controller-manager are generally located at `/etc/kubernetes/manifests`.

**Step-7** Restart Kubelet on all nodes.

* Reload kubelet systemd unit file using ```systemctl daemon-reload```
* Restart kubelet service using ```systemctl restart kubelet.service```

Note: After enabling the vSphere Cloud Provider, Node names will be set to the VM names from the vCenter Inventory.
-->
API server和Controller-manager的manifest文件一般都在`/etc/kubernetes/manifests`下。

**步骤-7** 在所有节点上重启kubelet

* 使用```systemctl daemon-reload```重新加载kubelet systemd unit文件
* 使用```systemctl restart kubelet.service```重启kubelet服务

<!--
#### Known issues
Please visit [known issues](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/known-issues.html) for the list of major known issues with Kubernetes vSphere Cloud Provider.
-->
#### 已知问题

请访问【已知问题】(https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/known-issues.html)查看kubernetes vSphere云供应商的主要已知问题列表。

<!--
## Support Level

For quick support please join VMware Code Slack ([#kubernetes](https://vmwarecode.slack.com/messages/kubernetes/)) and post your question.

IaaS Provider        | Config. Mgmt | OS     | Networking | Docs                                          | Conforms  | Support Level
-------------------- | ------------ | ------ | ---------- | --------------------------------------------- | --------- | ----------------------------
Vmware vSphere       | Kube-anywhere    | Photon OS | Flannel         | [docs](/docs/getting-started-guides/vsphere)                                |                | Community  ([@abrarshivani](https://github.com/abrarshivani)), ([@kerneltime](https://github.com/kerneltime)), ([@BaluDontu](https://github.com/BaluDontu)), ([@luomiao](https://github.com/luomiao)), ([@divyenpatel](https://github.com/divyenpatel))

If you identify any issues/problems using the vSphere cloud provider, you can create an issue in our repo - [VMware Kubernetes](https://github.com/vmware/kubernetes).


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
-->
## 支持等级

要想获得快速服务，请加入 VMware Code Slack ([#kubernetes](https://vmwarecode.slack.com/messages/kubernetes/))，并发布你的问题。

IaaS Provider        | Config. Mgmt | OS     | Networking | Docs                                          | Conforms  | Support Level
-------------------- | ------------ | ------ | ---------- | --------------------------------------------- | --------- | ----------------------------
Vmware vSphere       | Kube-anywhere    | Photon OS | Flannel         | [docs](/docs/getting-started-guides/vsphere)                                |                | Community  ([@abrarshivani](https://github.com/abrarshivani)), ([@kerneltime](https://github.com/kerneltime)), ([@BaluDontu](https://github.com/BaluDontu)), ([@luomiao](https://github.com/luomiao)), ([@divyenpatel](https://github.com/divyenpatel))

如果你在使用vSphere云服务提供商时发现了任何问题，请参考【解决方法表】(/docs/getting-started-guides/#table-of-solutions)部分。
