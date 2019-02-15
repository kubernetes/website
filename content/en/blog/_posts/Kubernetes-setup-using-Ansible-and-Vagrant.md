---
layout: blog
title: Kubernetes setup using Ansible and Vagrant
date: 2019-02-06
---

## Objective
This blog describes the steps required to setup multi node Kubernetes cluster for development purpose. This setup provides production like cluster that can be setup in local machine.  

## Why do we require multi node cluster setup?
Multi node Kubernetes cluster offers production like environment which in turn has various advantages. Even though Minikube provides an excellent platform for getting started it doesn't provide the opportunity to work with multi node cluster which can help solve problems or bugs that are related to application design and architecture. For instance, Ops can reproduce an issue in multi node cluster environment, Testers can deploy multiple version of application for executing test cases and verifying changes. These benefits enable teams to resolve issues faster which can contribute to being agile. 

## Why use Vagrant and Ansible?
Vagrant is a tool that will allow us to create a virtual environment easily and it eliminates pitfalls that cause the works-on-my-machine phenomenon. It can be used with multiple providers such as Oracle VirtualBox, VMware, Docker and so on. It allows us to create disposable environment by making use of configuration files. 

Ansible is Infrastructure automation engine that automates software configuration management. It is agent less and allows us to use ssh keys for connecting to remote machines. Ansible playbooks are written in yaml and it offers inventory management in simple text files.


### Pre-requisites
- Vagrant should be installed on your machine. Installation binaries can be found [here](https://www.vagrantup.com/downloads.html).
- Oracle VirtualBox can be used as Vagrant provider or make use of similar providers as described in official [documentation](https://www.vagrantup.com/docs/providers/) of Vagrant.
- Ansible should be installed in your machine. Refer Ansible installation [guide](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) for platform specific installation.

## Setup overview
We will be setting up a Kubernetes cluster that will consist of one master and two worker nodes. All the nodes will run Ubuntu Xenial 64-bit OS and Ansible playbooks will be used for provisioning.

#### Step 1: Creating a Vagrantfile
Use text editor of your choice and create a file with name Vagrantfile and insert the below code. The value of N denotes the no. of nodes present in the cluster, it can be modified accordingly. In the below example we are setting the value of N as 2.

```
IMAGE_NAME = "ubuntu/xenial64"
N = 2

Vagrant.configure("2") do |config|
    config.ssh.insert_key = false

    config.vm.define "k8s-master" do |master|
        master.vm.box = IMAGE_NAME
        master.network "private_network", ip: "192.168.50.10"
        master.vm.hostname = "k8s-master"
        master.vm.provision "ansible" do |ansible|
            ansible.playbook = "kubernetes-setup/master-playbook.yml"
        end
    end

    (1..N).each do |i|
        config.vm.define "node-#{i}" do |node|
            node.vm.box = IMAGE_NAME
            node.network :private_network, ip: "192.168.50.#{i + 10}"
            node.vm.hostname = "node-#{i}"
            node.vm.provision "ansible" do |ansible|
                ansible.playbook = "kubernetes-setup/node-playbook.yml"
            end
        end
    end  
end

```

#### Step 2: Creating Ansible playbook for Kubernetes master.
Create a directory with name kubernetes-setup adjacent to the Vagrantfile. Create files with name master-playbook.yml and node-playbook.yml in the directory kubernetes-setup.

In the file master-playbook.yml, start adding below code.
#### Step 2.1: Install Docker and its dependent components.
We will be installing the following packages and adding user with the name vagrant to docker group.
- docker-ce
- docker-ce-cli
- containerd.io

```
---
- hosts: master
  become_user: root
  vars:
    master-ip: "192.168.50.10"
    master-hostname: k8s-master
  tasks:
  - name: Install docker-ce and its components
    apt:
      name: "{{ packages }}"
      state: installed
      update_cache: yes
    vars:
      packages:
        - docker-ce
        - docker-ce-cli
        - containerd.io
    notify:
      - docker status
  
  - name: Add vagrant user to docker group
    user:
      name: vagrant
      group: docker
```

#### Step 2.2: Kubelet will not start if the system has swap enabled, so we are disabling swap using below code.

```
  - name: Remove swapfile from /etc/fstab
    mount:
      name: "{{ item }}"
      fstype: swap
      state: absent
    with_items:
      - swap
      - none

  - name: Disable swap
    command: swapoff -a
    when: ansible_swaptotal_mb > 0
```

#### Step 2.3: Installing kubelet, kubeadm and kubectl using below code.

```
  - name: Install curl
    apt: 
      name: "{{ packages }}"
      state: installed
      update_cache: yes
    vars:
      packages:
        - apt-transport-https 
        - curl
  
  - name: Add an Apt signing key
    apt_key:
      url: https://packages.cloud.google.com/apt/doc/apt-key.gpg
      state: present

  - name: Adding apt repository for Kubernetes
    apt_repository:
    repo: deb https://apt.kubernetes.io/ kubernetes-xenial main
    state: present
    filename: kubernetes.list

  - name: Install K8s binaries
    apt: 
      name: "{{ packages }}"
      state: installed
      update_cache: yes
    vars:
      packages:
        - kubelet 
        - kubeadm 
        - kubectl
```

#### Step 2.3: Initialize the Kubernetes cluster with kubeadm below code (applicable only on master node).

```
  - name: Initialize the Kubernetes cluster using kubeadm
    command: kubeadm init --apiserver-advertise-address="{{ master-ip }}" --apiserver-cert-extra-sans="{{ master-ip }}"  --node-name {{ master-hostname }} --pod-network-cidr=192.168.0.0/16

```

#### Step 2.4: Setup kube config file vagrant user to access Kubernetes cluster below code.

```
  - name: Setup kubeconfig for vagrant user
    command: "{{item}}"
    with_items:
     - mkdir -p /home/vagrant/.kube
     - cp -i /etc/kubernetes/admin.conf /home/vagrant/.kube/config
     - chown vagrant:vagrant /home/vagrant/.kube/config
```

#### Step 2.5: Setup container networking provider and network policy engine using below code.

```
  - name: Install calico pod network
    command: kubectl apply -f https://docs.projectcalico.org/v3.4/getting-started/kubernetes/installation/hosted/calico.yaml
```

#### Step 2.6: Setup a handler for checking Docker daemon using below code.

```
  handlers:
    - name: docker status
      service: name=docker state=started
```

#### Step 3: Creating Ansible playbook for Kubernetes node.
Create a file with name node-playbook.yml in the directory kubernetes-setup.

In the file node-playbook.yml, start adding below code.
#### Step 3.1: Generate kube join command for joining the node to Kubernetes cluster.

```
---
- hosts: master
  become_user: root
  gather_facts: false
  tasks:
  - name: Generate join command
    command: kubeadm token create --print-join-command
    register: join_command
    set_fact:
      join_command: "{{ join_command.stdout_lines[0] }}"

```

#### Step 3.2: Start adding the code from Steps 2.1 till 2.4 with making changes to host in yaml file. We need this Ansible playbook to be executed only on worker nodes.

```
- hosts: nodes
```

#### Step 3.3: Join the nodes to Kubernetes cluster using below code.

```
  - name: Joining the node to cluster
    command: "{{ hostvars['master'].join_command }}"
```

#### Step 3.4: Add the code from step 2.6 to finish with this playbook.

#### Step 4: Create inventory file for Ansible in kubernetes-setup directory and add below code in inventory file.
Node IPs depend on the value of N declared in Vagrantfile, in our case we have entered value of N as 2, hence we are creating two entries.

```
[master]
192.168.50.10

[nodes]
192.168.50.11
192.168.50.12
```

#### Step 5: Upon completing the Vagrantfile and playbooks follow below steps.

```
$ cd /path/to/Vagrantfile
$ vagrant up
```

Upon completion of all the above steps, Kubernetes cluster should be up and running.
We can login into master or worker nodes using vagrant as below.

```
$ ## Accessing master
$ vagrant ssh k8s-master

$ ## Accessing nodes
$ vagrant ssh node-1
$ vagrant ssh node-2
```
