---
title: Run a Single-Instance Stateful Application
---

{% capture overview %}

This page shows you how to run a single-instance stateful application
in Kubernetes using a PersistentVolume and a Deployment. The
application is MySQL.

{% endcapture %}


{% capture objectives %}

* Create a PersistentVolume referencing a disk in your environment.
* Create a MySQL Deployment.
* Expose MySQL to other pods in the cluster at a known DNS name.

{% endcapture %}


{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* For data persistence we will create a Persistent Volume that
  references a disk in your
  environment. See
  [here](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes) for
  the types of environments supported. This Tutorial will demonstrate
  `GCEPersistentDisk` but any type will work. `GCEPersistentDisk`
  volumes only work on Google Compute Engine.

{% endcapture %}


{% capture lessoncontent %}

## Set up a disk in your environment

You can use any type of persistent volume for your stateful app. See
[Types of Persistent Volumes](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes)
for a list of supported environment disks. For Google Compute Engine, run:

```
gcloud compute disks create --size=20GB mysql-disk
```

Next create a PersistentVolume that points to the `mysql-disk`
disk just created. Here is a configuration file for a PersistentVolume
that points to the Compute Engine disk above:

{% include code.html language="yaml" file="gce-volume.yaml" ghlink="/docs/tasks/run-application/gce-volume.yaml" %}

Notice that the `pdName: mysql-disk` line matches the name of the disk
in the Compute Engine environment. See the
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
for details on writing a PersistentVolume configuration file for other
environments.

Create the persistent volume:

```
kubectl create -f https://k8s.io/docs/tasks/run-application/gce-volume.yaml
```


## Deploy MySQL

You can run a stateful application by creating a Kubernetes Deployment
and connecting it to an existing PersistentVolume using a
PersistentVolumeClaim.  For example, this YAML file describes a
Deployment that runs MySQL and references the PersistentVolumeClaim. The file
defines a volume mount for /var/lib/mysql, and then creates a
PersistentVolumeClaim that looks for a 20G volume. This claim is
satisfied by any volume that meets the requirements, in this case, the
volume created above.

Note: The password is defined in the config yaml, and this is insecure. See
[Kubernetes Secrets](/docs/concepts/configuration/secret/)
for a secure solution.

{% include code.html language="yaml" file="mysql-deployment.yaml" ghlink="/docs/tasks/run-application/mysql-deployment.yaml" %}

1. Deploy the contents of the YAML file:

        kubectl create -f https://k8s.io/docs/tasks/run-application/mysql-deployment.yaml

1. Display information about the Deployment:

        kubectl describe deployment mysql

        Name:                 mysql
        Namespace:            default
        CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
        Labels:               app=mysql
        Selector:             app=mysql
        Replicas:             1 updated | 1 total | 0 available | 1 unavailable
        StrategyType:         Recreate
        MinReadySeconds:      0
        OldReplicaSets:       <none>
        NewReplicaSet:        mysql-63082529 (1/1 replicas created)
        Events:
          FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
          ---------    --------    -----    ----                -------------    --------    ------            -------
          33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1

1. List the pods created by the Deployment:

        kubectl get pods -l app=mysql

        NAME                   READY     STATUS    RESTARTS   AGE
        mysql-63082529-2z3ki   1/1       Running   0          3m

1. Inspect the Persistent Volume:

        kubectl describe pv mysql-pv

        Name:            mysql-pv
        Labels:          <none>
        Status:          Bound
        Claim:           default/mysql-pv-claim
        Reclaim Policy:  Retain
        Access Modes:    RWO
        Capacity:        20Gi
        Message:
        Source:
            Type:        GCEPersistentDisk (a Persistent Disk resource in Google Compute Engine)
            PDName:      mysql-disk
            FSType:      ext4
            Partition:   0
            ReadOnly:    false
        No events.

1. Inspect the PersistentVolumeClaim:

        kubectl describe pvc mysql-pv-claim

        Name:         mysql-pv-claim
        Namespace:    default
        Status:       Bound
        Volume:       mysql-pv
        Labels:       <none>
        Capacity:     20Gi
        Access Modes: RWO
        No events.

## Accessing the MySQL instance

The preceding YAML file creates a service that
allows other Pods in the cluster to access the database. The Service option
`clusterIP: None` lets the Service DNS name resolve directly to the
Pod's IP address. This is optimal when you have only one Pod
behind a Service and you don't intend to increase the number of Pods.

Run a MySQL client to connect to the server:

```
kubectl run -it --rm --image=mysql:5.6 mysql-client -- mysql -h <pod-ip> -ppassword
```

This command creates a new Pod in the cluster running a mysql client
and connects it to the server through the Service. If it connects, you
know your stateful MySQL database is up and running.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## Updating

The image or any other part of the Deployment can be updated as usual
with the `kubectl apply` command. Here are some precautions that are
specific to stateful apps:

* Don't scale the app. This setup is for single-instance apps
  only. The underlying PersistentVolume can only be mounted to one
  Pod. For clustered stateful apps, see the
  [StatefulSet documentation](/docs/concepts/workloads/controllers/petset/).
* Use `strategy:` `type: Recreate` in the Deployment configuration
  YAML file. This instructs Kubernetes to _not_ use rolling
  updates. Rolling updates will not work, as you cannot have more than
  one Pod running at a time. The `Recreate` strategy will stop the
  first pod before creating a new one with the updated configuration.

## Deleting a deployment

Delete the deployed objects by name:

```
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv
```

Also, if you are using Compute Engine disks:

```
gcloud compute disks delete mysql-disk
```

{% endcapture %}


{% capture whatsnext %}

* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

* Learn more about [Deploying applications](/docs/user-guide/deploying-applications/)

* [kubectl run documentation](/docs/user-guide/kubectl/v1.6/#run)

* [Volumes](/docs/concepts/storage/volumes/) and [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

{% endcapture %}

{% include templates/tutorial.md %}
