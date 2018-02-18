---
title: "Example: Deploying WordPress and MySQL with Persistent Volumes"
reviewers:
- ahmetb
---

{% capture overview %}
This tutorial shows you how to deploy a WordPress site and a MySQL database using Minikube. Both applications use PersistentVolumes and PersistentVolumeClaims to store data. 

A [PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) is a piece of storage in the cluster that has been manually provisioned by an administrator, or dynamically provisioned by Kubernetes using a [StorageClass](/docs/concepts/storage/storage-classes).  A [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) is a request for storage by a user that can be fulfilled by a PV. PersistentVolumes and PersistentVolumeClaims are independent from Pod lifecycles and preserve data through restarting, rescheduling, and even deleting Pods.

**Warning:**  This deployment is not suitable for production use cases, as it uses single instance WordPress and MySQL Pods. Consider using [WordPress Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/wordpress) to deploy WordPress in production.
{: .warning}

**Note:** The files provided in this tutorial are using GA Deployment APIs and are specific to kubernetes version 1.9 and later. If you wish to use this tutorial with an earlier version of Kubernetes, please update the API version appropriately, or reference earlier versions of this tutorial.
{: .note}

{% endcapture %}

{% capture objectives %}
* Create PersistentVolumeClaims and PersistentVolumes
* Create a Secret
* Deploy MySQL
* Deploy WordPress
* Clean up

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %} 

Download the following configuration files:

1. [mysql-deployment.yaml](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/wordpress-deployment.yaml)

{% endcapture %}

{% capture lessoncontent %} 

## Create PersistentVolumeClaims and PersistentVolumes

MySQL and Wordpress each require a PersistentVolume to store data.  Their PersistentVolumeClaims will be created at the deployment step.

Many cluster environments have a default StorageClass installed.  When a StorageClass is not specified in the PersistentVolumeClaim, the cluster's default StorageClass is used instead.

When a PersistentVolumeClaim is created, a PersistentVolume is dynamically provisioned based on the StorageClass configuration.

**Warning:** In local clusters, the default StorageClass uses the `hostPath` provisioner.  `hostPath` volumes are only suitable for development and testing. With `hostPath` volumes, your data lives in `/tmp` on the node the Pod is scheduled onto and does not move between nodes. If a Pod dies and gets scheduled to another node in the cluster, or the node is rebooted, the data is lost.
{: .warning}

**Note:** If you are bringing up a cluster that needs to use the `hostPath` provisioner, the `--enable-hostpath-provisioner` flag must be set in the `controller-manager` component.
{: .note}

**Note:** If you have a Kubernetes cluster running on Google Kubernetes Engine, please follow [this guide](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk).
{: .note}

## Create a Secret for MySQL Password

A [Secret](/docs/concepts/configuration/secret/) is an object that stores a piece of sensitive data like a password or key. The manifest files are already configured to use a Secret, but you have to create your own Secret.

1. Create the Secret object from the following command:

       kubectl create secret generic mysql-pass --from-literal=password=YOUR_PASSWORD
       
   **Note:** Replace `YOUR_PASSWORD` with the password you want to apply.     
   {: .note}
   
2. Verify that the Secret exists by running the following command:

       kubectl get secrets

   The response should be like this:

       NAME                  TYPE                                  DATA      AGE
       mysql-pass                 Opaque                                1         42s

   **Note:** To protect the Secret from exposure, neither `get` nor `describe` show its contents. 
   {: .note}

## Deploy MySQL

The following manifest describes a single-instance MySQL Deployment. The MySQL container mounts the PersistentVolume at /var/lib/mysql. The `MYSQL_ROOT_PASSWORD` environment variable sets the database password from the Secret. 

{% include code.html language="yaml" file="mysql-wordpress-persistent-volume/mysql-deployment.yaml" ghlink="/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/mysql-deployment.yaml" %}

1. Deploy MySQL from the `mysql-deployment.yaml` file:

       kubectl create -f mysql-deployment.yaml

2. Verify that a PersistentVolume got dynamically provisioned:

       kubectl get pvc

   **Note:** It can take up to a few minutes for the PVs to be provisioned and bound.
   {: .note}

   The response should be like this:

       NAME             STATUS    VOLUME                                     CAPACITY ACCESS MODES   STORAGECLASS   AGE
       mysql-pv-claim   Bound     pvc-91e44fbf-d477-11e7-ac6a-42010a800002   20Gi     RWO            standard       29s

3. Verify that the Pod is running by running the following command:

       kubectl get pods

   **Note:** It can take up to a few minutes for the Pod's Status to be `RUNNING`.
   {: .note}

   The response should be like this:

       NAME                               READY     STATUS    RESTARTS   AGE
       wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s

## Deploy WordPress

The following manifest describes a single-instance WordPress Deployment and Service. It uses many of the same features like a PVC for persistent storage and a Secret for the password. But it also uses a different setting: `type: NodePort`. This setting exposes WordPress to traffic from outside of the cluster.

{% include code.html language="yaml" file="mysql-wordpress-persistent-volume/wordpress-deployment.yaml" ghlink="/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/wordpress-deployment.yaml" %}

1. Create a WordPress Service and Deployment from the `wordpress-deployment.yaml` file:

       kubectl create -f wordpress-deployment.yaml

2. Verify that a PersistentVolume got dynamically provisioned:

       kubectl get pvc

   **Note:** It can take up to a few minutes for the PVs to be provisioned and bound.
   {: .note}

   The response should be like this:

       NAME             STATUS    VOLUME                                     CAPACITY ACCESS MODES   STORAGECLASS   AGE
       wp-pv-claim      Bound     pvc-e69d834d-d477-11e7-ac6a-42010a800002   20Gi     RWO            standard       7s

3. Verify that the Service is running by running the following command:

       kubectl get services wordpress

   The response should be like this:

       NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
       wordpress   10.0.0.89    <pending>     80:32406/TCP   4m

   **Note:** Minikube can only expose Services through `NodePort`. <br/><br/>The `EXTERNAL-IP` is always `<pending>`.
   {: .note}

4. Run the following command to get the IP Address for the WordPress Service:

       minikube service wordpress --url

   The response should be like this:

       http://1.2.3.4:32406

5. Copy the IP address, and load the page in your browser to view your site.

   You should see the WordPress set up page similar to the following screenshot.

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

   **Warning:** Do not leave your WordPress installation on this page. If another user finds it, they can set up a website on your instance and use it to serve malicious content. <br/><br/>Either install WordPress by creating a username and password or delete your instance.
   {: .warning}

{% endcapture %}

{% capture cleanup %}

1. Run the following command to delete your Secret:

       kubectl delete secret mysql-pass

2. Run the following commands to delete all Deployments and Services:

       kubectl delete deployment -l app=wordpress
       kubectl delete service -l app=wordpress

3. Run the following commands to delete the PersistentVolumeClaims.  The dynamically provisioned PersistentVolumes will be automatically deleted.

       kubectl delete pvc -l app=wordpress

{% endcapture %}

{% capture whatsnext %}

* Learn more about [Introspection and Debugging](/docs/tasks/debug-application-cluster/debug-application-introspection/)
* Learn more about [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* Learn more about [Port Forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Learn how to [Get a Shell to a Container](/docs/tasks/debug-application-cluster/get-shell-running-container/)

{% endcapture %}

{% include templates/tutorial.md %}
