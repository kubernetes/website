---
approvers:
- erictune
- jbeda
title: VMware vSphere
---

This page covers how to get started with deploying Kubernetes on vSphere and details for how to configure the vSphere Cloud Provider.

* TOC
{:toc}

### Getting started with the vSphere Cloud Provider

Kubernetes comes with a cloud provider for vSphere. A quick and easy way to try out the cloud provider is to deploy Kubernetes using [Kubernetes-Anywhere](https://github.com/kubernetes/kubernetes-anywhere).

This page also describes how to configure and get started with the cloud provider if deploying using custom install scripts.

### Deploy Kubernetes on vSphere

To start using Kubernetes on top of vSphere and use the vSphere Cloud Provider use Kubernetes-Anywhere. Kubernetes-Anywhere will deploy and configure a cluster from scratch.

Detailed steps can be found at the [getting started with Kubernetes-Anywhere on vSphere](https://git.k8s.io/kubernetes-anywhere/phase1/vsphere/README.md) page

### vSphere Cloud Provider

vSphere Cloud Provider allows using vSphere managed storage within Kubernetes. It supports:

1. Volumes
2. Persistent Volumes
3. Storage Classes and provisioning of volumes.
4. vSphere Storage Policy Based Management for Containers orchestrated by Kubernetes.

Documentation for how to use vSphere managed storage can be found in the [persistent volumes user guide](/docs/concepts/storage/persistent-volumes/#vsphere) and the [volumes user guide](/docs/concepts/storage/volumes/#vspherevolume)

Examples can be found [here](https://git.k8s.io/kubernetes/examples/volumes/vsphere)

#### Enable vSphere Cloud Provider

If a Kubernetes cluster has not been deployed using Kubernetes-Anywhere, follow the instructions below to enable the vSphere Cloud Provider. These steps are not needed when using Kubernetes-Anywhere, they will be done as part of the deployment.

**Step-1** [Create a VM folder](https://docs.vmware.com/en/VMware-vSphere/6.0/com.vmware.vsphere.vcenterhost.doc/GUID-031BDB12-D3B2-4E2D-80E6-604F304B4D0C.html) and move Kubernetes Node VMs to this folder.

**Step-2** Make sure Node VM names must comply with the regex `[a-z](([-0-9a-z]+)?[0-9a-z])?(\.[a-z0-9](([-0-9a-z]+)?[0-9a-z])?)*` If Node VMs does not comply with this regex, rename them and make it compliant to this regex.

  Node VM names constraints:

  * VM names can not begin with numbers.
  * VM names can not have capital letters, any special characters except `.` and `-`.
  * VM names can not be shorter than 3 chars and longer than 63

**Step-3** Enable disk UUID on Node virtual machines

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

**Step-4** Create and assign Roles to the vSphere Cloud Provider user and vSphere entities.

Note: if you want to use Administrator account then this step can be skipped.

vSphere Cloud Provider requires the following minimal set of privileges to interact with vCenter. Please refer [vSphere Documentation Center](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html) to know about steps for creating a Custom Role, User and Role Assignment.

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

**Step-5** Create the vSphere cloud config file (`vsphere.conf`). Cloud config template can be found [here](https://github.com/kubernetes/kubernetes-anywhere/blob/master/phase1/vsphere/vsphere.conf)

This config file needs to be placed in the shared directory which should be accessible from kubelet container, controller-manager pod, and API server pod.

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

Note: **```vm-name``` parameter is introduced in 1.6.4 release.** Both ```vm-uuid``` and ```vm-name``` are optional parameters. If ```vm-name``` is specified then ```vm-uuid``` is not used. If both are not specified then kubelet will get vm-uuid from `/sys/class/dmi/id/product_serial` and query vCenter to find the Node VM's name. 

**```vsphere.conf``` for Worker Nodes:** (Only Applicable to 1.6.4 release and above. For older releases this file should have all the parameters specified in Master node's ```vSphere.conf``` file)
 
``` 
[Global]
        vm-name = "VM name of the Worker Node"
```

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

```
--cloud-provider=vsphere
--cloud-config=<Path of the vsphere.conf file>
```

Manifest files for API server and controller-manager are generally located at `/etc/kubernetes`

**Step-7** Restart Kubelet on all nodes.
* Reload kubelet systemd unit file using ```systemctl daemon-reload```
* Restart kubelet service using ```systemctl restart kubelet.service```

Note: After enabling the vSphere Cloud Provider, Node names will be set to the VM names from the vCenter Inventory.

#### Known issues
[vmware#220](https://github.com/vmware/kubernetes/issues/220) :
vSphere Cloud Provider can not be used on the Kubernetes Cluster when vCenter port is configured other than the default port 443. Fix for this issue is already out (Kubernetes PR# [49689](https://github.com/kubernetes/kubernetes/pull/49689)). We will make sure that, PR 49689 is cherry picked to 1.7, 1.6 and 1.5 branches. 

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking | Docs                                          | Conforms  | Support Level
-------------------- | ------------ | ------ | ---------- | --------------------------------------------- | --------- | ----------------------------
Vmware vSphere       | Kube-anywhere    | Photon OS | Flannel         | [docs](/docs/getting-started-guides/vsphere)                                |                | Community  ([@abrarshivani](https://github.com/abrarshivani)), ([@kerneltime](https://github.com/kerneltime)), ([@BaluDontu](https://github.com/BaluDontu)), ([@luomiao](https://github.com/luomiao)), ([@divyenpatel](https://github.com/divyenpatel))

If you identify any issues/problems using the vSphere cloud provider, you can create an issue in our repo - [VMware Kubernetes](https://github.com/vmware/kubernetes).

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
