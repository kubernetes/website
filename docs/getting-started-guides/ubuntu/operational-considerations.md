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

Juju will elect the cheapest instance type matching your constraints on your target cloud. You can also use the ```instance-type``` constraint in conjunction with ```root-disk``` for strict control. For more information about the constraints available, refer to the [official documentation](https://jujucharms.com/docs/stable/reference-constraints)

Additional information about logging can be found in the [logging section](/docs/getting-started-guides/ubuntu/logging)

### Connecting on the Controller Node

By default, Juju will create a pair of SSH key that it will use to automate the connection to units. They are stored on the client node in ```~/.local/share/juju/ssh/```

After deployment, Juju Controller is a "silent unit" that acts as a proxy between the client and the deployed applications. Nevertheless it can be useful to SSH into it. To do so run the following command from your client node: 

```
ssh -i ./.local/share/juju/ssh/juju_id_rsa ubuntu@<public-ip-of-juju-controller>
```

where ```public-ip-of-juju-controller``` can be found in ```~/.local/share/juju/controllers.yaml``` in the ```api-endpoints``` section. 

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