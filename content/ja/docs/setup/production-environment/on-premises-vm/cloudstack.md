---
title: Cloudstack
content_type: concept
---

<!-- overview -->

[CloudStack](https://cloudstack.apache.org/) is a software to build public and private clouds based on hardware virtualization principles (traditional IaaS). To deploy Kubernetes on CloudStack there are several possibilities depending on the Cloud being used and what images are made available. CloudStack also has a vagrant plugin available, hence Vagrant could be used to deploy Kubernetes either using the existing shell provisioner or using new Salt based recipes.

[CoreOS](https://coreos.com) templates for CloudStack are built [nightly](https://stable.release.core-os.net/amd64-usr/current/). CloudStack operators need to [register](https://docs.cloudstack.apache.org/projects/cloudstack-administration/en/latest/templates.html) this template in their cloud before proceeding with these Kubernetes deployment instructions.

This guide uses a single [Ansible playbook](https://github.com/apachecloudstack/k8s), which is completely automated and can deploy Kubernetes on a CloudStack based Cloud using CoreOS images. The playbook, creates an ssh key pair, creates a security group and associated rules and finally starts coreOS instances configured via cloud-init.



<!-- body -->

## 前提条件

```shell
sudo apt-get install -y python-pip libssl-dev
sudo pip install cs
sudo pip install sshpubkeys
sudo apt-get install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```

On CloudStack server you also have to install libselinux-python :

```shell
yum install libselinux-python
```

[_cs_](https://github.com/exoscale/cs) is a python module for the CloudStack API.

Set your CloudStack endpoint, API keys and HTTP method used.

You can define them as environment variables: `CLOUDSTACK_ENDPOINT`, `CLOUDSTACK_KEY`, `CLOUDSTACK_SECRET` and `CLOUDSTACK_METHOD`.

Or create a `~/.cloudstack.ini` file:

```none
[cloudstack]
endpoint = <your cloudstack api endpoint>
key = <your api access key>
secret = <your api secret key>
method = post
```

We need to use the http POST method to pass the _large_ userdata to the coreOS instances.

### playbookのクローン

```shell
git clone https://github.com/apachecloudstack/k8s
cd kubernetes-cloudstack
```

### Kubernetesクラスターの作成

You simply need to run the playbook.

```shell
ansible-playbook k8s.yml
```

Some variables can be edited in the `k8s.yml` file.

```none
vars:
  ssh_key: k8s
  k8s_num_nodes: 2
  k8s_security_group_name: k8s
  k8s_node_prefix: k8s2
  k8s_template: <templatename>
  k8s_instance_type: <serviceofferingname>
```

This will start a Kubernetes master node and a number of compute nodes (by default 2).
The `instance_type` and `template` are specific, edit them to specify your CloudStack cloud specific template and instance type (i.e. service offering).

Check the tasks and templates in `roles/k8s` if you want to modify anything.

Once the playbook as finished, it will print out the IP of the Kubernetes master:

```none
TASK: [k8s | debug msg='k8s master IP is {{ k8s_master.default_ip }}'] ********
```

SSH to it using the key that was created and using the _core_ user.

```shell
ssh -i ~/.ssh/id_rsa_k8s core@<master IP>
```

And you can list the machines in your cluster:

```shell
fleetctl list-machines
```

```none
MACHINE        IP             METADATA
a017c422...    <node #1 IP>   role=node
ad13bf84...    <master IP>    role=master
e9af8293...    <node #2 IP>   role=node
```

## サポートレベル


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
CloudStack           | Ansible      | CoreOS | flannel     | [docs](/docs/setup/production-environment/on-premises-vm/cloudstack/)                             |          | Community ([@Guiques](https://github.com/ltupin/))


