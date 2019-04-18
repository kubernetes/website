---
title: "Example: Add logging and monitoring to the sample PHP / Redis Guestbook application with ELK"
reviewers:
content_template: templates/tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "Logging and Monitoring Example: PHP / Redis Guestbook with ELK"
---

{{% capture overview %}}
This tutorial builds upon the [PHP Guestbook with Redis](../guestbook) tutorial. Lightweight log, metric, and network data open source shippers, or *Beats*, from Elastic are deployed in the same Kubernetes cluster as the guestbook. The Beats collect, parse, and index the data into Elasticsearch so that you can view and analyze the resulting operational information in Kibana. This example consists of the following components:

* A running instance of the [PHP Guestbook with Redis tutorial](../guestbook)
* Elasticsearch and Kibana
* Filebeat
* Metricbeat
* Packetbeat

{{% /capture %}}

{{% capture objectives %}}
* Start up the PHP Guestbook with Redis.
* Install kube-state-metrics.
* Create a Kubernetes secret.
* Deploy the Beats.
* View dashboards of your logs and metrics.
* Understand how to gather logs and metrics from other applications.
* Clean up.
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}
{{< version-check >}}

Additionally you need:

* A running deployment of the [PHP Guestbook with Redis](../guestbook) tutorial.

* A running Elasticsearch and Kibana deployment.  You can use [Elasticsearch Service in Elastic Cloud](https://cloud.elastic.co), run the [download files](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html) on your workstation or servers, or the [Elastic Helm Charts](https://github.com/elastic/helm-charts).  

{{% /capture %}}

{{% capture lessoncontent %}}

## Start up the  PHP Guestbook with Redis
This tutorial builds on the [PHP Guestbook with Redis](../guestbook) tutorial.  If you have the guestbook application running, then you can monitor that.  If you do not have it running then follow the instructions to deploy the guestbook and do not perform the **Cleanup** steps.  Come back to this page when you have the guestbook running.

## Add a Cluster role binding

## Install kube-state-metrics

Kubernetes [*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics) is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.  Metricbeat reports these metrics.  Add kube-state-metrics to the Kubernetes cluster that the guestbook is running in.

### Check to see if kube-state-metrics is running
```
kubectl get pods --namespace=kube-system | grep kube-state
```
### Install it if needed (by default it will not be there)

```
git clone https://github.com/kubernetes/kube-state-metrics.git kube-state-metrics
kubectl create -f kube-state-metrics/kubernetes
kubectl get pods --namespace=kube-system | grep kube-state
```
Verify that kube-state-metrics is running and ready
```
kubectl get pods -n kube-system -l k8s-app=kube-state-metrics
```

Output:
```
NAME                                 READY   STATUS    RESTARTS   AGE
kube-state-metrics-89d656bf8-vdthm   2/2     Running     0          21s
```

## Create a Kubernetes secret
A [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/) is an object that contains a small amount of sensitive data such as a password, a token, or a key. Such information might otherwise be put in a Pod specification or in an image; putting it in a Secret object allows for more control over how it is used, and reduces the risk of accidental exposure.

{{< note >}}
There are two sets of steps here, one for *self managed* Elasticsearch and Kibana (running on your servers or using the Elastic Helm Charts), and a second separate set for the *managed service* Elasticsearch Service in Elastic Cloud.  Only create the secret for the type of Elasticsearch and Kibana system that you will use for this tutorial.
{{< /note >}}

### Self managed
Skip to the [**Managed service**](#managed-service) section if you are connecting to Elasticsearch Service in Elastic Cloud.

### Set the credentials
There are four files to edit to create a k8s secret when you are connecting to self managed Elasticsearch and Kibana (self managed is effectively anything other than the managed Elasticsearch Service in Elastic Cloud).  The files are:

1. ELASTICSEARCH_HOSTS
1. ELASTICSEARCH_PASSWORD
1. ELASTICSEARCH_USERNAME
1. KIBANA_HOST

Set these with the information for your Elasticsearch cluster and your Kibana host.  Here are some examples

#### `ELASTICSEARCH_HOSTS`
1. A nodeGroup from the Elastic Elasticseach Helm Chart:

    ```
    ["http://elasticsearch-master.default.svc.cluster.local:9200"]
    ```
1. A single Elasticsearch node running on a Mac where your Beats are running in Docker for Mac:

    ```
    ["http://host.docker.internal:9200"]
    ```
1. Two Elasticsearch nodes running in VMs or on physical hardware:

    ```
    ["http://host1.example.com:9200", "http://host2.example.com:9200"]
    ```
Edit `ELASTICSEARCH_HOSTS`
```
vi ELASTICSEARCH_HOSTS
```

#### `ELASTICSEARCH_PASSWORD`
Just the password, no whitespace or quotes:

    changeme

Edit `ELASTICSEARCH_PASSWORD`
```
vi ELASTICSEARCH_PASSWORD
```

#### `ELASTICSEARCH_USERNAME`
Just the username, no whitespace or quotes:

    elastic

Edit `ELASTICSEARCH_USERNAME`
```
vi ELASTICSEARCH_USERNAME
```

#### `KIBANA_HOST`

1. The Kibana instance from the Elastic Kibana Helm Chart.  The subdomain `default` refers to the default namespace.  If you have deployed the Helm Chart using a different namespace, then your subdomain will be different:

    ```
    "kibana-kibana.default.svc.cluster.local:5601"
    ```
1. A Kibana instance running on a Mac where your Beats are running in Docker for Mac:

    ```
    "host.docker.internal:5601"
    ```
1. Two Elasticsearch nodes running in VMs or on physical hardware:

    ```
    "host1.example.com:5601"
    ```
Edit `KIBANA_HOST`
```
vi KIBANA_HOST
```

### Create a Kubernetes secret
This command creates a secret in the Kubernetes system level namespace (kube-system) based on the files you just edited:

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTICSEARCH_HOSTS \
      --from-file=./ELASTICSEARCH_PASSWORD \
      --from-file=./ELASTICSEARCH_USERNAME \
      --from-file=./KIBANA_HOST \
      --namespace=kube-system

## Managed service
This section is for Elasticsearch Service in Elastic Cloud only, if you have already created a secret for a self managed Elasticsearch and Kibana deployment, then skip this section and continue with [Deploy the Beats](#deploy-the-beats).
### Set the credentials
There are two files to edit to create a k8s secret when you are connecting to the managed Elasticsearch Service in Elastic Cloud.  The files are:

1. ELASTIC_CLOUD_AUTH
1. ELASTIC_CLOUD_ID

Set these with the information provided to you from the Elasticsearch Service console when you created the deployment.  Here are some examples:

#### ELASTIC_CLOUD_ID
```
devk8s:ABC123def456ghi789jkl123mno456pqr789stu123vwx456yza789bcd012efg345hijj678klm901nop345zEwOTJjMTc5YWQ0YzQ5OThlN2U5MjAwYTg4NTIzZQ==
```

#### ELASTIC_CLOUD_AUTH
Just the username, a colon (`:`), and the password, no whitespace or quotes:
```
elastic:VFxJJf9Tjwer90wnfTghsn8w
```

### Edit the required files:
```
vi ELASTIC_CLOUD_ID
vi ELASTIC_CLOUD_AUTH
```
### Create a Kubernetes secret
This command creates a secret in the Kubernetes system level namespace (kube-system) based on the files you just edited:

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTIC_CLOUD_ID \
      --from-file=./ELASTIC_CLOUD_AUTH \
      --namespace=kube-system

## Deploy the Beats
Manifest files are provided for each Beat.  These manifest files use the secret created earlier to configure the Beats to connect to your Elasticsearch and Kibana servers.

### About Filebeat
Filebeat will collect logs from the Kubernetes nodes and the containers running in each pod running on those nodes.  Filebeat is deployed as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).  Filebeat can autodiscover applications running in your Kubernetes cluster. At startup Filebeat scans existing containers and launches the proper configurations for them, then it will watch for new start/stop events.

Here is the autodiscover configuration that enables Filebeat to locate and parse Redis logs from the Redis containers deployed with the guestbook application:

```
- condition.contains:
    kubernetes.labels.app: redis
  config:
    - module: redis
      log:
        input:
          type: docker
          containers.ids:
            - ${data.kubernetes.container.id}
      slowlog:
        enabled: true
        var.hosts: ["${data.host}:${data.port}"]
```
This configures Filebeat to apply the Filebeat module `redis` when a container is detected with a label `app` containing the string `redis`.  The redis module has the ability to collect the `log` stream from the container by using the docker input type (reading the file on the Kubernetes node associated with the STDOUT stream from this Redis container).  Additionally, the module has the ability to collect Redis `slowlog` entries by connecting to the proper pod host and port, which is provided in the container metadata.

### Deploy Filebeat:
```
kubectl create -f filebeat-kubernetes.yaml
```

### Verify
```
kubectl get pods -n kube-system -l k8s-app=filebeat-dynamic
```

### Deploy Metricbeat
```
kubectl create -f metricbeat-kubernetes.yaml
```
### Verify
```
kubectl get pods -n kube-system -l k8s-app=metricbeat
```

### Deploy Packetbeat
```
kubectl create -f packetbeat-kubernetes.yaml
```

### Verify
```
kubectl get pods -n kube-system -l k8s-app=packetbeat-dynamic
```

## View in Kibana

Open Kibana in your browser and then open the **Dashboard** application.  In the search bar type Kubernetes and click on the Metricbeat dashboard for Kubernetes.  This dashboard reports on the state of your Nodes, deployments, etc.


## Scale your deployments and see new pods being monitored
List the existing deployments:
```
kubectl get deployments

NAME           DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
frontend       3         3         3            3           3m
redis-master   1         1         1            1           3m
redis-slave    2         2         2            2           3m
```

Scale the frontend down to two pods:
```
kubectl scale --replicas=2 deployment/frontend

deployment "frontend" scaled
```

Check the frontend deployment:
```
kubectl get deployment frontend

NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
frontend   2         2         2            2           5m
```

# View the changes in Kibana
See the screenshot, add the indicated filters and then add the columns to the view.  You can see the ScalingReplicaSet entry that is marked, following from there to the top of the list of events shows the image being pulled, the volumes mounted, the pod starting, etc.
![Kibana Discover](https://raw.githubusercontent.com/elastic/examples/master/MonitoringKubernetes/scaling-discover.png)
## View dashboards of your logs and metrics

## Understand how to gather logs and metrics from other applications

The guestbook application uses Redis to store its data. It writes its data to a Redis master instance and reads data from multiple Redis slave instances.

### Creating the Redis Master Deployment

The manifest file, included below, specifies a Deployment controller that runs a single replica Redis master Pod.

{{< codenew file="application/nginx-app.yaml" >}}

1. Launch a terminal window in the directory you downloaded the manifest files.
1. Apply the Redis Master Deployment from the `redis-master-deployment.yaml` file:

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
      ```

1. Query the list of Pods to verify that the Redis Master Pod is running:

      ```shell
      kubectl get pods
      ```

      The response should be similar to this:

      ```shell
      NAME                            READY     STATUS    RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running   0          28s
      ```

1. Run the following command to view the logs from the Redis Master Pod:

     ```shell
     kubectl logs -f POD-NAME
     ```

{{< note >}}
Replace POD-NAME with the name of your Pod.
{{< /note >}}

### Creating the Redis Master Service

The guestbook applications needs to communicate to the Redis master to write its data. You need to apply a [Service](/docs/concepts/services-networking/service/) to proxy the traffic to the Redis master Pod. A Service defines a policy to access the Pods.

{{< codenew file="application/guestbook/redis-master-service.yaml" >}}

1. Apply the Redis Master Service from the following `redis-master-service.yaml` file:

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
      ```

1. Query the list of Services to verify that the Redis Master Service is running:

      ```shell
      kubectl get service
      ```

      The response should be similar to this:

      ```shell
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   8s
      ```

{{< note >}}
This manifest file creates a Service named `redis-master` with a set of labels that match the labels previously defined, so the Service routes network traffic to the Redis master Pod.   
{{< /note >}}


### Start up the Redis Slaves

Although the Redis master is a single pod, you can make it highly available to meet traffic demands by adding replica Redis slaves.

### Creating the Redis Slave Deployment

Deployments scale based off of the configurations set in the manifest file. In this case, the Deployment object specifies two replicas.

If there are not any replicas running, this Deployment would start the two replicas on your container cluster. Conversely, if there are more than two replicas are running, it would scale down until two replicas are running.

{{< codenew file="application/guestbook/redis-slave-deployment.yaml" >}}

1. Apply the Redis Slave Deployment from the `redis-slave-deployment.yaml` file:

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-deployment.yaml
      ```

1. Query the list of Pods to verify that the Redis Slave Pods are running:

      ```shell
      kubectl get pods
      ```

      The response should be similar to this:

      ```shell
      NAME                            READY     STATUS              RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running             0          1m
      redis-slave-2005841000-fpvqc    0/1       ContainerCreating   0          6s
      redis-slave-2005841000-phfv9    0/1       ContainerCreating   0          6s
      ```

### Creating the Redis Slave Service

The guestbook application needs to communicate to Redis slaves to read data. To make the Redis slaves discoverable, you need to set up a Service. A Service provides transparent load balancing to a set of Pods.

{{< codenew file="application/guestbook/redis-slave-service.yaml" >}}

1. Apply the Redis Slave Service from the following `redis-slave-service.yaml` file:

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-service.yaml
      ```

1. Query the list of Services to verify that the Redis slave service is running:

      ```shell
      kubectl get services
      ```

      The response should be similar to this:

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    2m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   1m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP   6s
      ```

### Set up and Expose the Guestbook Frontend

The guestbook application has a web frontend serving the HTTP requests written in PHP. It is configured to connect to the `redis-master` Service for write requests and the `redis-slave` service for Read requests.

### Creating the Guestbook Frontend Deployment

{{< codenew file="application/guestbook/frontend-deployment.yaml" >}}

1. Apply the frontend Deployment from the `frontend-deployment.yaml` file:

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
      ```

1. Query the list of Pods to verify that the three frontend replicas are running:

      ```shell
      kubectl get pods -l app=guestbook -l tier=frontend
      ```

      The response should be similar to this:

      ```
      NAME                        READY     STATUS    RESTARTS   AGE
      frontend-3823415956-dsvc5   1/1       Running   0          54s
      frontend-3823415956-k22zn   1/1       Running   0          54s
      frontend-3823415956-w9gbt   1/1       Running   0          54s
      ```

### Creating the Frontend Service

The `redis-slave` and `redis-master` Services you applied are only accessible within the container cluster because the default type for a Service is [ClusterIP](/docs/concepts/services-networking/service/#publishing-services---service-types). `ClusterIP` provides a single IP address for the set of Pods the Service is pointing to. This IP address is accessible only within the cluster.

If you want guests to be able to access your guestbook, you must configure the frontend Service to be externally visible, so a client can request the Service from outside the container cluster. Minikube can only expose Services through `NodePort`.  

{{< note >}}
Some cloud providers, like Google Compute Engine or Google Kubernetes Engine, support external load balancers. If your cloud provider supports load balancers and you want to use it, simply delete or comment out `type: NodePort`, and uncomment `type: LoadBalancer`.
{{< /note >}}



1. Apply the frontend Service from the `frontend-service.yaml` file:

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
      ```

1. Query the list of Services to verify that the frontend Service is running:

      ```shell
      kubectl get services
      ```

      The response should be similar to this:

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      frontend       NodePort    10.0.0.112   <none>       80:31323/TCP   6s
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP        4m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP       2m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP       1m
      ```

### Viewing the Frontend Service via `NodePort`

If you deployed this application to Minikube or a local cluster, you need to find the IP address to view your Guestbook.

1. Run the following command to get the IP address for the frontend Service.

      ```shell
      minikube service frontend --url
      ```

      The response should be similar to this:

      ```
      http://192.168.99.100:31323
      ```

1. Copy the IP address, and load the page in your browser to view your guestbook.

### Viewing the Frontend Service via `LoadBalancer`

If you deployed the `frontend-service.yaml` manifest with type: `LoadBalancer` you need to find the IP address to view your Guestbook.

1. Run the following command to get the IP address for the frontend Service.

      ```shell
      kubectl get service frontend
      ```

      The response should be similar to this:

      ```
      NAME       TYPE        CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
      frontend   ClusterIP   10.51.242.136   109.197.92.229     80:32372/TCP   1m
      ```

1. Copy the external IP address, and load the page in your browser to view your guestbook.

### Scale the Web Frontend

Scaling up or down is easy because your servers are defined as a Service that uses a Deployment controller.

1. Run the following command to scale up the number of frontend Pods:

      ```shell
      kubectl scale deployment frontend --replicas=5
      ```

1. Query the list of Pods to verify the number of frontend Pods running:

      ```shell
      kubectl get pods
      ```

      The response should look similar to this:

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-70qj5       1/1       Running   0          5s
      frontend-3823415956-dsvc5       1/1       Running   0          54m
      frontend-3823415956-k22zn       1/1       Running   0          54m
      frontend-3823415956-w9gbt       1/1       Running   0          54m
      frontend-3823415956-x2pld       1/1       Running   0          5s
      redis-master-1068406935-3lswp   1/1       Running   0          56m
      redis-slave-2005841000-fpvqc    1/1       Running   0          55m
      redis-slave-2005841000-phfv9    1/1       Running   0          55m
      ```

1. Run the following command to scale down the number of frontend Pods:

      ```shell
      kubectl scale deployment frontend --replicas=2
      ```

1. Query the list of Pods to verify the number of frontend Pods running:

      ```shell
      kubectl get pods
      ```

      The response should look similar to this:

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-k22zn       1/1       Running   0          1h
      frontend-3823415956-w9gbt       1/1       Running   0          1h
      redis-master-1068406935-3lswp   1/1       Running   0          1h
      redis-slave-2005841000-fpvqc    1/1       Running   0          1h
      redis-slave-2005841000-phfv9    1/1       Running   0          1h
      ```

{{% /capture %}}

{{% capture cleanup %}}
Deleting the Deployments and Services also deletes any running Pods. Use labels to delete multiple resources with one command.

1. Run the following commands to delete all Pods, Deployments, and Services.

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      ```

      The responses should be:

      ```
      deployment.apps "redis-master" deleted
      deployment.apps "redis-slave" deleted
      service "redis-master" deleted
      service "redis-slave" deleted
      deployment.apps "frontend" deleted    
      service "frontend" deleted
      ```

1. Query the list of Pods to verify that no Pods are running:

      ```shell
      kubectl get pods
      ```

      The response should be this:

      ```
      No resources found.
      ```

{{% /capture %}}

{{% capture whatsnext %}}
* Complete the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) Interactive Tutorials
* Use Kubernetes to create a blog using [Persistent Volumes for MySQL and Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* Read more about [connecting applications](/docs/concepts/services-networking/connect-applications-service/)
* Read more about [Managing Resources](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)
{{% /capture %}}
