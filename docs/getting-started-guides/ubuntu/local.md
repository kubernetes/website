---
title: Local Kubernetes development with LXD
---

{% capture overview %}
## Overview

Running Kubernetes locally has obvious development advantages, such as lower cost and faster iteration than constantly deploying and tearing down clusters on a public cloud. Ideally a Kubernetes developer can spawn all the instances locally and test code as they commit. This page will show you how to deploy a cluster on a local machine.
{% endcapture %}

The purpose of using [LXD](https://linuxcontainers.org/lxd/) on a local machine is to emulate the same deployment that a user would use in a cloud or bare metal. Each node is treated as a machine, with the same characteristics as production.

{% capture prerequisites %}
## Prerequisites

In order to simplify local deployment this method leverages the [Conjure Up tool](
http://conjure-up.io/). 

This will provide a pseudo-graphical set up in a terminal that is simple enough for developers to use without having to learn the complexities of operating Kubernetes. This will enable new developers to get started with a working cluster.
{% endcapture %}

{% capture steps %}
## Getting Started

First, you need to configure LXD to be able to host a large number of containers. To do this we need to update the [kernel parameters for inotify](https://github.com/lxc/lxd/blob/master/doc/production-setup.md#etcsysctlconf).

On your system open up `/etc/sysctl.conf` *(as root) and add the following lines:

```
    fs.inotify.max_user_instances = 1048576
    fs.inotify.max_queued_events = 1048576
    fs.inotify.max_user_watches = 1048576
    vm.max_map_count = 262144
```

_Note: This step may become unnecessary in the future_

Next, apply those kernel parameters (you should see the above options echoed back out to you):
    
    sudo sysctl -p
   
Now you're ready to install conjure-up and deploy Kubernetes.
    
```
    sudo apt-add-repository ppa:juju/stable
    sudo apt-add-repository ppa:conjure-up/next
    sudo apt update
    sudo apt install conjure-up
    
```

Note: During this set up phase cojure-up will ask you to "Setup an ipv6 subnet" with LXD, ensure you answer NO. ipv6 with Juju/LXD is currently unsupported.

### Walkthrough

Initiate the installation with:

    conjure-up kubernetes

For this walkthrough we are going to create a new controller, select the `localhost` Cloud type:

![Select Cloud](/images/docs/ubuntu/00-select-cloud.png)

Deploy the applications:

![Deploy Applications](/images/docs/ubuntu/01-deploy.png)

Wait for Juju bootstrap to finish:

![Bootstrap](/images/docs/ubuntu/02-bootstrap.png)

Wait for our Applications to be fully deployed:

![Waiting](/images/docs/ubuntu/03-waiting.png)

Run the final post processing steps to automatically configure your Kubernetes environment:

![Postprocessing](/images/docs/ubuntu/04-postprocessing.png)

Review the final summary screen:

![Final Summary](/images/docs/ubuntu/05-final-summary.png)

### Accessing the Cluster 

You can access your Kubernetes cluster by running the following:
    
    
    ~/kubectl --kubeconfig=~/.kube/config
    

Or if you've already run this once it'll create a new config file as shown in the summary screen.
    
    
    ~/kubectl --kubeconfig=~/.kube/config.conjure-up
    
{% endcapture %}

{% include templates/task.md %}

