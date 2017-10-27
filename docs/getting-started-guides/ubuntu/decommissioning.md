---
title: Decommissioning
---

{% capture overview %}
This page shows you how to properly decommission a cluster.
{% endcapture %}


{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.

**Warning:** By the time you've reached this step you should have backed up your workloads and pertinent data; this section is for the complete destruction of a cluster.
{: .warning}

{% endcapture %}

{% capture steps %}
## Destroy the Juju model
It is recommended to deploy individual Kubernetes clusters in their own models, so that there is a clean separation between environments. To remove a cluster first find out which model it's in with `juju list-models`. The controller reserves an `admin` model for itself. If you have chosen to not name your model it might show up as `default`.

```
$ juju list-models
Controller: aws-us-east-2

Model       Cloud/Region   Status     Machines  Cores  Access  Last connection
controller  aws/us-east-2  available         1      2  admin   just now
my-kubernetes-cluster*    aws/us-east-2  available        12     22  admin   2 minutes ago
```

You can then destroy the model, which will in turn destroy the cluster inside of it:

    juju destroy-model my-kubernetes-cluster
    
```
$ juju destroy-model my-kubernetes-cluster
WARNING! This command will destroy the "my-kubernetes-cluster" model.
This includes all machines, applications, data and other resources.

Continue [y/N]? y
Destroying model
Waiting on model to be removed, 12 machine(s), 10 application(s)...
Waiting on model to be removed, 12 machine(s), 9 application(s)...
Waiting on model to be removed, 12 machine(s), 8 application(s)...
Waiting on model to be removed, 12 machine(s), 7 application(s)...
Waiting on model to be removed, 12 machine(s)...
Waiting on model to be removed...
$
```

This will destroy and decommission all nodes. You can confirm all nodes are destroyed by running `juju status`.

If you're using a public cloud this will terminate the instances. If you're on bare metal using MAAS this will release the nodes, optionally wipe the disk, power off the machines, and return them to available pool of machines to deploy from. 

## Cleaning up the Controller

If you're not using the controller for anything else, you will also need to remove the controller instance: 

```
$ juju list-controllers
Use --refresh flag with this command to see the latest information.

Controller      Model  User   Access     Cloud/Region   Models  Machines    HA  Version
aws-us-east-2*  -      admin  superuser  aws/us-east-2       2         1  none  2.0.1  

$ juju destroy-controller aws-us-east-2 
WARNING! This command will destroy the "aws-us-east-2" controller.
This includes all machines, applications, data and other resources.

Continue? (y/N):y
Destroying controller
Waiting for hosted model resources to be reclaimed
All hosted models reclaimed, cleaning up controller machines
$ 
```
{% endcapture %}

{% include templates/task.md %}
