---
title: " Building Globally Distributed Services using Kubernetes Cluster Federation "
date: 2016-10-14
slug: globally-distributed-services-kubernetes-cluster-federation
url: /blog/2016/10/Globally-Distributed-Services-Kubernetes-Cluster-Federation
author: >
  Allan Naim (Google),
  Quinton Hoole (Google)
---

In Kubernetes 1.3, we announced Kubernetes Cluster Federation and introduced the concept of Cross Cluster Service Discovery, enabling developers to deploy a service that was sharded across a federation of clusters spanning different zones, regions or cloud providers. This enables developers to achieve higher availability for their applications, without sacrificing quality of service, as detailed in our [previous](https://kubernetes.io/blog/2016/07/cross-cluster-services) blog post.   

In the latest release, [Kubernetes 1.4](https://kubernetes.io/blog/2016/09/kubernetes-1-4-making-it-easy-to-run-on-kuberentes-anywhere/), we've extended Cluster Federation to support Replica Sets, Secrets, Namespaces and Ingress objects. This means that you no longer need to deploy and manage these objects individually in each of your federated clusters. Just create them once in the federation, and have its built-in controllers automatically handle that for you.

[**Federated Replica Sets**](/docs/user-guide/federation/replicasets/) leverage the same configuration as non-federated Kubernetes Replica Sets and automatically distribute Pods across one or more federated clusters. By default, replicas are evenly distributed across all clusters, but for cases where that is not the desired behavior, we've introduced Replica Set preferences, which allow replicas to be distributed across only some clusters, or in non-equal proportions ([define annotations](https://github.com/kubernetes/kubernetes/blob/master/federation/apis/federation/types.go#L114)).   

Starting with Google Cloud Platform (GCP), we’ve introduced [**Federated Ingress**](/docs/user-guide/federation/federated-ingress/) as a Kubernetes 1.4 alpha feature which enables external clients point to a single IP address and have requests sent to the closest cluster with usable capacity in any region, zone of the Federation.   

[**Federated Secrets**](/docs/user-guide/federation/secrets/) automatically create and manage secrets across all clusters in a Federation, automatically ensuring that these are kept globally consistent and up-to-date, even if some clusters are offline when the original updates are applied.  

[**Federated Namespaces**](/docs/user-guide/federation/namespaces/) are similar to the traditional [Kubernetes Namespaces](/docs/user-guide/namespaces/) providing the same functionality. Creating them in the Federation control plane ensures that they are synchronized across all the clusters in Federation.  

[**Federated Events**](/docs/user-guide/federation/events/) are similar to the traditional Kubernetes Events providing the same functionality. Federation Events are stored only in Federation control plane and are not passed on to the underlying kubernetes clusters.  

Let’s walk through how all this stuff works. We’re going to provision 3 clusters per region, spanning 3 continents (Europe, North America and Asia).   



[![](https://2.bp.blogspot.com/-Gj83DdcKqTI/WAE8pwAEZYI/AAAAAAAAAwI/9dbyBFipvDIGkPQWRB1dRxNwkrvzlcYMwCLcB/s400/k8s%2Bfed%2Bmap.png)](https://2.bp.blogspot.com/-Gj83DdcKqTI/WAE8pwAEZYI/AAAAAAAAAwI/9dbyBFipvDIGkPQWRB1dRxNwkrvzlcYMwCLcB/s1600/k8s%2Bfed%2Bmap.png)



The next step is to federate these clusters. Kelsey Hightower developed a [tutorial](https://github.com/kelseyhightower/kubernetes-cluster-federation) for setting up a Kubernetes Cluster Federation. Follow the tutorial to configure a Cluster Federation with clusters in 3 zones in each of the 3 GCP regions, us-central1, europe-west1 and asia-east1. For the purpose of this blog post, we’ll provision the Federation Control Plane in the us-central1-b zone. Note that more highly available, multi-cluster deployments are also available, but not used here in the interests of simplicity.



The rest of the blog post assumes that you have a running Kubernetes Cluster Federation provisioned.



Let’s verify that we have 9 clusters in 3 regions running.



 ```
$ kubectl --context=federation-cluster get clusters


NAME              STATUS    AGE  
gce-asia-east1-a     Ready     17m  
gce-asia-east1-b     Ready     15m  
gce-asia-east1-c     Ready     10m  
gce-europe-west1-b   Ready     7m  
gce-europe-west1-c   Ready     7m  
gce-europe-west1-d   Ready     4m  
gce-us-central1-a    Ready     1m  
gce-us-central1-b    Ready     53s  
gce-us-central1-c    Ready     39s
  ```



|You can download the source used in this blog post [here](https://github.com/allannaim/federated-ingress-sample). The source consists of the following files:|
|---|---|
|configmaps/zonefetch.yaml| retrieves the zone from the instance metadata server and concatenates into volume mount path|
|replicasets/nginx-rs.yaml | deploys a Pod consisting of an nginx and busybox container|
|ingress/ingress.yaml | creates a load balancer with a global VIP  that distributes requests to the closest nginx backend|
|services/nginx.yaml| exposes the nginx backend as an external service|




In our example, we’ll be deploying the service and ingress object using the federated control plane. The [ConfigMap](/docs/user-guide/configmap/) object isn’t currently supported by Federation, so we’ll be deploying it manually in each of the underlying Federation clusters. Our cluster deployment will look as follows:



We’re going to deploy a Service that is sharded across our 9 clusters. The backend deployment will consist of a Pod with 2 containers:

- busybox container that fetches the zone and outputs an HTML with the zone embedded in it into a Pod volume mount path
- nginx container that reads from that Pod volume mount path and serves an HTML containing the zone it’s running in


Let’s start by creating a federated service object in the federation-cluster context.



```
$ kubectl --context=federation-cluster create -f services/nginx.yaml
 ```



It will take a few minutes for the service to propagate across the 9 clusters.




```
$ kubectl --context=federation-cluster describe services nginx


Name:                   nginx  
Namespace:              default  
Labels:                 app=nginx  
Selector:               app=nginx  
Type:                   LoadBalancer  
IP:  
LoadBalancer Ingress:   108.59.xx.xxx, 104.199.xxx.xxx, ...  
Port:                   http    80/TCP

NodePort:               http    30061/TCP  
Endpoints:              <none>  
Session Affinity:       None
 ```



Let’s now create a Federated Ingress. Federated Ingresses are created in much that same way as traditional [Kubernetes Ingresses](/docs/user-guide/ingress/): by making an API call which specifies the desired properties of your logical ingress point. In the case of Federated Ingress, this API call is directed to the Federation API endpoint, rather than a Kubernetes cluster API endpoint. The API for Federated Ingress is 100% compatible with the API for traditional Kubernetes Services.




```
$ cat ingress/ingress.yaml   

apiVersion: extensions/v1beta1  
kind: Ingress  
metadata:  
  name: nginx  
spec:  
  backend:  
    serviceName: nginx  
    servicePort: 80
 ```




```
$ kubectl --context=federation-cluster create -f ingress/ingress.yaml   
ingress "nginx" created
 ```



Once created, the Federated Ingress controller automatically:

1. 1.creates matching Kubernetes Ingress objects in every cluster underlying your Cluster Federation
2. 2.ensures that all of these in-cluster ingress objects share the same logical global L7 (i.e. HTTP(S)) load balancer and IP address
3. 3.monitors the health and capacity of the service “shards” (i.e. your Pods) behind this ingress in each cluster
4. 4.ensures that all client connections are routed to an appropriate healthy backend service endpoint at all times, even in the event of Pod, cluster, availability zone or regional outages
We can verify the ingress objects are matching in the underlying clusters. Notice the ingress IP addresses for all 9 clusters is the same.




```
$ for c in $(kubectl config view -o jsonpath='{.contexts[*].name}'); do kubectl --context=$c get ingress; done  

NAME      HOSTS     ADDRESS   PORTS     AGE  
nginx     \*                   80        1h  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        40m  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        1h  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        26m  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        1h  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        25m  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        38m  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        3m  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        57m  
NAME      HOSTS     ADDRESS          PORTS     AGE  
nginx     \*         130.211.40.xxx   80        56m
 ```



Note that in the case of Google Cloud Platform, the logical L7 load balancer is not a single physical device (which would present both a single point of failure, and a single global network routing choke point), but rather a [truly global, highly available load balancing managed service](https://cloud.google.com/load-balancing/), globally reachable via a single, static IP address.



Clients inside your federated Kubernetes clusters (i.e. Pods) will be automatically routed to the cluster-local shard of the Federated Service backing the Ingress in their cluster if it exists and is healthy, or the closest healthy shard in a different cluster if it does not. Note that this involves a network trip to the HTTP(S) load balancer, which resides outside your local Kubernetes cluster but inside the same GCP region.



The next step is to schedule the service backends. Let’s first create the ConfigMap in each cluster in the Federation.



We do this by submitting the ConfigMap to each cluster in the Federation.




```
$ for c in $(kubectl config view -o jsonpath='{.contexts[\*].name}'); do kubectl --context=$c create -f configmaps/zonefetch.yaml; done
 ```



Let’s have a quick peek at our Replica Set:




```
$ cat replicasets/nginx-rs.yaml


apiVersion: extensions/v1beta1  
kind: ReplicaSet  
metadata:  
  name: nginx  
  labels:  
    app: nginx  
    type: demo  
spec:  
  replicas: 9  
  template:  
    metadata:  
      labels:  
        app: nginx  
    spec:  
      containers:  
      - image: nginx  
        name: frontend  
        ports:  
          - containerPort: 80  
        volumeMounts:  
        - name: html-dir  
          mountPath: /usr/share/nginx/html  
      - image: busybox  
        name: zone-fetcher  
        command:  
          - "/bin/sh"  
          - "-c"  
          - "/zonefetch/zonefetch.sh"  
        volumeMounts:  
        - name: zone-fetch  
          mountPath: /zonefetch  
        - name: html-dir  
          mountPath: /usr/share/nginx/html  
      volumes:  
        - name: zone-fetch  
          configMap:  
            defaultMode: 0777  
            name: zone-fetch  
        - name: html-dir  
          emptyDir:  
            medium: ""
 ```



The Replica Set consists of 9 replicas, spread evenly across 9 clusters within the Cluster Federation. Annotations can also be used to control which clusters Pods are scheduled to. This is accomplished by adding annotations to the Replica Set spec, as follows:




```
apiVersion: extensions/v1beta1  
kind: ReplicaSet  
metadata:  
  name: nginx-us  
  annotations:  
    federation.kubernetes.io/replica-set-preferences: ```  
        {  
            "rebalance": true,  
            "clusters": {  
                "gce-us-central1-a": {  
                    "minReplicas": 2,  
                    "maxReplicas": 4,  
                    "weight": 1  
                },  
                "gce-us-central10b": {  
                    "minReplicas": 2,  
                    "maxReplicas": 4,  
                    "weight": 1  
                }  
            }  
        }
 ```



For the purpose of our demo, we’ll keep things simple and spread our Pods evenly across the Cluster Federation.



Let’s create the federated Replica Set:




```
$ kubectl --context=federation-cluster create -f replicasets/nginx-rs.yaml
 ```



Verify the Replica Sets and Pods were created in each cluster:




```
$ for c in $(kubectl config view -o jsonpath='{.contexts[\*].name}'); do kubectl --context=$c get rs; done  

NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         42s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         14m  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         45s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         46s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         47s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         48s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         49s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         49s  
NAME      DESIRED   CURRENT   READY     AGE  
nginx     1         1         1         49s


$ for c in $(kubectl config view -o jsonpath='{.contexts[\*].name}'); do kubectl --context=$c get po; done  

NAME          READY     STATUS    RESTARTS   AGE  
nginx-ph8zx   2/2       Running   0          25s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-sbi5b   2/2       Running   0          27s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-pf2dr   2/2       Running   0          28s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-imymt   2/2       Running   0          30s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-9cd5m   2/2       Running   0          31s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-vxlx4   2/2       Running   0          33s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-itagl   2/2       Running   0          33s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-u7uyn   2/2       Running   0          33s  
NAME          READY     STATUS    RESTARTS   AGE  
nginx-i0jh6   2/2       Running   0          34s
 ```



Below is an illustration of how the nginx service and associated ingress deployed. To summarize, we have a global VIP (130.211.23.176) exposed using a Global L7 load balancer that forwards requests to the closest cluster with available capacity.

[![](https://1.bp.blogspot.com/-vDz5dEG_-yI/WAE81YPVlYI/AAAAAAAAAwM/jvt46qwIViQbsbftCqFenUocGfssuLbjwCLcB/s640/Copy%2Bof%2BFederation%2BBlog%2BDrawing%2B%25281%2529.png)](https://1.bp.blogspot.com/-vDz5dEG_-yI/WAE81YPVlYI/AAAAAAAAAwM/jvt46qwIViQbsbftCqFenUocGfssuLbjwCLcB/s1600/Copy%2Bof%2BFederation%2BBlog%2BDrawing%2B%25281%2529.png)


To test this out, we’re going to spin up 2 Google Cloud Engine (GCE) instances, one in us-west1-b and the other in asia-east1-a. All client requests are automatically routed, via the shortest network path, to a healthy Pod in the closest cluster to the origin of the request. So for example, HTTP(S) requests from Asia will be routed directly to the closest cluster in Asia that has available capacity. If there are no such clusters in Asia, the request will be routed to the next closest cluster (in this case the U.S.). This works irrespective of whether the requests originate from a GCE instance or anywhere else on the internet. We only use a GCE instance for simplicity in the demo.





  ![](https://lh5.googleusercontent.com/GcJh6wsYfi8Kjb94g7tS1sOtWqDGohfcthfuEu1mqAkRe7zktmthFjkUke3jY_KqZi-T4wgENBkdZyrCYNV5PjaykF-a1f0io2RRaptBndrxY0qiFM1Q7O089B46JVeZwP__ImXg)




We can SSH directly into the VMs using the Cloud Console or by issuing a gcloud SSH command.




```
$ gcloud compute ssh test-instance-asia --zone asia-east1-a

-----

user@test-instance-asia:~$ curl 130.211.40.186  
<!DOCTYPE html>  
<html>  
<head>  
<title>Welcome to the global site!</title>  
</head>  
<body>  
<h1>Welcome to the global site! You are being served from asia-east1-b</h1>  
<p>Congratulations!</p>


user@test-instance-asia:~$ exit

----


$ gcloud compute ssh test-instance-us --zone us-west1-b

----

user@test-instance-us:~$ curl 130.211.40.186  
<!DOCTYPE html>  
<html>  
<head>  
<title>Welcome to the global site!</title>  
</head>  
<body>  
<h1>Welcome to the global site! You are being served from us-central1-b</h1>  
<p>Congratulations!</p>


----
 ```



Federations of Kubernetes Clusters can include clusters running in different cloud providers (e.g. GCP, AWS), and on-premises (e.g. on OpenStack). However, in Kubernetes 1.4, Federated Ingress is only supported across Google Cloud Platform clusters. In future versions we intend to support hybrid cloud Ingress-based deployments.



To summarize, we walked through leveraging the Kubernetes 1.4 Federated Ingress alpha feature to deploy a multi-homed service behind a global load balancer. External clients point to a single IP address and are sent to the closest cluster with usable capacity in any region, zone of the Federation, providing higher levels of availability without sacrificing latency or ease of operation.



We'd love to hear feedback on Kubernetes Cross Cluster Services. To join the community:

- Post issues or feature requests on [GitHub](https://github.com/kubernetes/kubernetes/tree/master/federation)
- Join us in the #federation channel on [Slack](https://kubernetes.slack.com/messages/sig-federation)
- Participate in the [Cluster Federation SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)
- [Download](http://get.k8s.io/) Kubernetes
- Follow Kubernetes on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
