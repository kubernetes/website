---
---

{% capture overview %}

This page shows you how to run a single-instance stateful application
in Kubernetes using a Persistent Volume and a Deployment object. The
application we will use is MySQL.

{% endcapture %}


{% capture objectives %}

* Create a Persistent Volume object referencing a disk in your environment.
* Create a MySQL Deployment.
* Expose MySQL to other pods in the cluster at a known DNS name.

{% endcapture %}


{% capture prerequisites %}

* To do this tutorial, you need a Kubernetes cluster, including a running
  Kubernetes API server. You can use an existing cluster, or you can create a
  new cluster. One way to create a new cluster is to use
  [Minikube](/docs/getting-started-guides/minikube).

* You also need to have `kubectl` installed on your local machine, and `kubectl`
  must be configured to communicate with your Kubernetes API server. This
  configuration is done automatically if you use Minikube.

* For data persistence we will create a Persistent Volume that
  references a disk in your
  environment. See
  [here](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes) for
  the types of environments supported. This Tutorial will demonstrate
  `GCEPersistentDisk` but any type will work. `GCEPersistentDisk`
  volumes only work on Google Compute Engine.

{% endcapture %}


{% capture lessoncontent %}

### Setup a disk in your environment

You can use any type of persistent volume for you stateful app. See
[here](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes) for
a list of supported environment disks. For Google Compute Engine, run:

```
gcloud compute disks create --size=20GB mysql-disk
```

Next create a Persistent Volume object that points to the `mysql-disk`
disk just created. Here is the config used for the GCE disk above:

{% include code.html language="yaml" file="gce-volume.yaml" ghlink="/docs/tutorials/stateful-application/gce-volume.yaml" %}

Notice that the `pdName: mysql-disk` line matches the name of the disk
in the GCE environment. See the
[PV Docs](/docs/user-guide/persistent-volumes/)
for details on writing a Persistent Volume config for other
environments.

Create with:

```
kubectl create -f http://k8s.io/docs/tutorials/stateful-application/gce-volume.yaml
```


### Deploy MySQL

You can run a stateful application by creating a Kubernetes Deployment
object, and connecting it to an existing Persistent Volume using a
Persistent Volume Claim.  For example, this YAML file describes a
Deployment that runs MySQL and references the PVC. Note that we've
defined a volume mount for /var/lib/mysql, and then created a
Persistent Volume Claim that looks for a 20G volume. This claim is
satisfied by any volume that meets the requirements, in our case the
volume we created above.

Note: The password is defined in the config yaml. This is insecure,
please look into
[Kubernetes Secrets](/docs/user-guide/secrets/)
for a secure solution.

{% include code.html language="yaml" file="mysql-deployment.yaml" ghlink="/docs/tutorials/stateful-application/mysql-deployment.yaml" %}

1. Deploy the contents of the YAML file:

        kubectl create -f http://k8s.io/docs/tutorials/stateful-application/mysql-deployment.yaml

1. Display information about the Deployment:

        kubectl describe deployment mysql

        Name:			mysql
        Namespace:		default
        CreationTimestamp:	Tue, 01 Nov 2016 11:18:45 -0700
        Labels:			app=mysql
        Selector:		app=mysql
        Replicas:		1 updated | 1 total | 0 available | 1 unavailable
        StrategyType:		Recreate
        MinReadySeconds:	0
        OldReplicaSets:		<none>
        NewReplicaSet:		mysql-63082529 (1/1 replicas created)
        Events:
          FirstSeen	LastSeen	Count	From				SubobjectPath	Type		Reason			Message
          ---------	--------	-----	----				-------------	--------	------			-------
          33s		33s		1	{deployment-controller }			Normal		ScalingReplicaSet	Scaled up replica set mysql-63082529 to 1

1. List the pods created by the deployment:

        kubectl get pods -l app=mysql

        NAME                   READY     STATUS    RESTARTS   AGE
        mysql-63082529-2z3ki   1/1       Running   0          3m
2. Inspect the PV and PVC:

        kubectl describe pv mysql-pv

        Name:		mysql-pv
        Labels:		<none>
        Status:		Bound
        Claim:		default/mysql-pv-claim
        Reclaim Policy:	Retain
        Access Modes:	RWO
        Capacity:	20Gi
        Message:	
        Source:
            Type:	GCEPersistentDisk (a Persistent Disk resource in Google Compute Engine)
            PDName:	mysql-disk
            FSType:	ext4
            Partition:	0
            ReadOnly:	false
        No events.

        kubectl describe pvc mysql-pv-claim

        Name:		mysql-pv-claim
        Namespace:	default
        Status:		Bound
        Volume:		mysql-pv
        Labels:		<none>
        Capacity:	20Gi
        Access Modes:	RWO
        No events.

### Accessing the MySQL instance

Look at the config yaml above. We have created a service that will
allow other cluster pods to access the database. The service option
`clusterIP: None` lets the service DNS name resolve directly to the
Pod's IP address. This is optimal when you will only ever have 1 Pod
behind a service.

Run a MySQL client to connect to the server:

```
kubectl run -it --rm --image=mysql:5.6 mysql-client -- mysql -h mysql -ppassword
```

This command creates a new pod in the cluster running a mysql client
and connects it to the server through the service. If it connects, you
know your stateful MySQL db is up and running.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql> 
```

### Updating

The image or any other part of the deployment can be updated as usual
with the `kubectl apply` command. Some precautions to take that are
specific to stateful apps are:

* Don't scale the app. This setup is for single-instance apps
  only. The underlying persistent volume can only be mounted to one
  pod. For clustered stateful apps, see the
  [StatefulSet documentation](/docs/user-guide/petset/).
* Use `strategy:` `type: Recreate` in the Deployment config
  yaml. This instructs Kubernetes to _not_ use rolling
  updates. Rolling updates will not work, as you cannot have more than
  one pod running at a time. The `Recreate` strategy will stop the
  first pod before creating a new one with the updated configuration.

### Deleting a deployment

Delete the deployed objects by name:

```
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv
```

Also, if you are using GCE disks:

```
gcloud compute disks delete mysql-disk
```

{% endcapture %}


{% capture whatsnext %}

* Learn more about [Deployment objects](/docs/user-guide/deployments/).

* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/)

* [kubectl run documentation](/docs/user-guide/kubectl/kubectl_run/)

* [Volumes](/docs/user-guide/volumes/) and [Persistent Volumes](/docs/user-guide/persistent-volumes/)

{% endcapture %}

{% include templates/tutorial.md %}
