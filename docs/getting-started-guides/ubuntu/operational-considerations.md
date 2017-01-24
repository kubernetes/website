---
title: Operational Considerations
---

{% capture overview %}
This page gives recommendations and hints for people managing long lived clusters 
{% endcapture %}
{% capture prerequisites %}
This page assumes you understand the basics of Juju and Kubernetes.
{% endcapture %}

{% capture steps %}

## Managing Juju 

### Sizing your controller node

The Juju Controller: 

* requires about 2 to 2.5GB RAM to operate. 
* uses a MongoDB database as a storage backend for the configuration and state of the cluster. This database can grow significantly, and can also be the biggest consumer of CPU cycles on the instance
* aggregates and stores the log data of all services and units. Therefore, significant storage is needed for long lived models. If your intention is to keep the cluster running, make sure to provision at least 64GB for the logs. 

To bootstrap a controller with constraints run the following command: 

```
juju bootstrap --contraints "mem=8GB cpu-cores=4 root-disk=128G"
```

Juju will select the cheapest instance type matching your constraints on your target cloud. You can also use the ```instance-type``` constraint in conjunction with ```root-disk``` for strict control. For more information about the constraints available, refer to the [official documentation](https://jujucharms.com/docs/stable/reference-constraints)

Additional information about logging can be found in the [logging section](/docs/getting-started-guides/ubuntu/logging)

### SSHing into the Controller Node

By default, Juju will create a pair of SSH keys that it will use to automate the connection to units. They are stored on the client node in ```~/.local/share/juju/ssh/```

After deployment, Juju Controller is a "silent unit" that acts as a proxy between the client and the deployed applications. Nevertheless it can be useful to SSH into it. 

First you need to understand your environment, especially if you run several Juju models and controllers. Run

```
juju list-models --all
$ juju models --all
Controller: k8s

Model             Cloud/Region   Status     Machines  Cores  Access  Last connection
admin/controller  lxd/localhost  available         1      -  admin   just now
admin/default     lxd/localhost  available         0      -  admin   2017-01-23
admin/whale*      lxd/localhost  available         6      -  admin   3 minutes ago

```

The first line ```Controller: k8s``` refers to how you bootstrapped. 

Then you will see 2, 3 or more models listed below. 

* admin/controller is the default model that hosts all controller units of juju
* admin/default is created by default as the primary model to host the user application, such as the Kubernetes cluster
* admin/whale is an additional model created if you use conjure-up as an overlay on top of Juju. 

Now to ssh into a controller node, you first ask Juju to switch context, then ssh as you would with a normal unit: 

```
juju switch controller
```

At this stage, you can query the controller model as well: 

```
juju status
Model       Controller  Cloud/Region   Version
controller  k8s		   lxd/localhost  2.0.2

App  Version  Status  Scale  Charm  Store  Rev  OS  Notes

Unit  Workload  Agent  Machine  Public address  Ports  Message

Machine  State    DNS           Inst id        Series  AZ
0        started  10.191.22.15  juju-2a5ed8-0  xenial  
```

Note that if you had bootstrapped in HA mode, you would see several machines listed. 

Now ssh-ing into the controller follows the same semantic as classic Juju commands: 

```
$ juju ssh 0
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.8.0-34-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.


Last login: Tue Jan 24 16:38:13 2017 from 10.191.22.1
ubuntu@juju-2a5ed8-0:~$ 
```

When you are done and want to come back to your initial model, exit the controller and


Then if you need to switch back to your cluster and ssh into the units, run

```
juju switch default
```

## Managing your Kubernetes cluster

### Running privileged containers

By default juju-deployed clusters do not support running privileged containers. If you need them, you have to edit ```/etc/default/kube-apiserver``` on the master nodes, and ```/etc/default/kubelet``` on your worker nodes. 

On Kubernetes Core or on small deployment, run the following commands from the Juju client: 

#### Manually 

1. Update the Master

```
juju ssh kubernetes-master/0 "sudo sed -i 's/KUBE_API_ARGS=\"/KUBE_API_ARGS=\"--allow-privileged\ /' /etc/default/kube-apiserver && sudo systemctl restart kube-apiserver.service"
```

2. Update the Worker(s)

```
juju ssh kubernetes-worker/0 "sudo sed -i 's/KUBELET_ARGS=\"/KUBELET_ARGS=\"--allow-privileged\ /' /etc/default/kubelet && sudo systemctl restart kubelet.service"
```

#### Programmatically

If the deployment is larger the following commands will run on all units successively: 

1. Update all Masters

```
juju show-status kubernetes-master --format json | \
	jq --raw-output '.applications."kubernetes-master".units | keys[]' | \
	xargs -I UNIT juju ssh UNIT "sudo sed -i 's/KUBE_API_ARGS=\"/KUBE_API_ARGS=\"--allow-privileged\ /' /etc/default/kube-apiserver && sudo systemctl restart kube-apiserver.service"
```

2. Update all workers

```
juju show-status kubernetes-worker --format json | \
	jq --raw-output '.applications."kubernetes-worker".units | keys[]' | \
	xargs -I UNIT juju ssh UNIT "sudo sed -i 's/KUBELET_ARGS=\"/KUBELET_ARGS=\"--allow-privileged\ /' /etc/default/kubelet && sudo systemctl restart kubelet.service"
```


{% endcapture %}

{% include templates/task.md %}