---
title: " Creating a PostgreSQL Cluster using Helm "
date: 2016-09-09
slug: creating-postgresql-cluster-using-helm
url: /blog/2016/09/Creating-Postgresql-Cluster-Using-Helm
author: >
  Jeff McCormick (Crunchy Data)
---

[Crunchy Data](http://www.crunchydata.com/) supplies a set of open source PostgreSQL and PostgreSQL related containers. The Crunchy PostgreSQL Container Suite includes containers that deploy, monitor, and administer the open source PostgreSQL database, for more details view this GitHub [repository](https://github.com/crunchydata/crunchy-containers).   

In this post we’ll show you how to deploy a PostgreSQL cluster using [Helm](https://github.com/kubernetes/helm), a Kubernetes package manager. For reference, the Crunchy Helm Chart examples used within this post are located [here](https://github.com/CrunchyData/crunchy-containers/tree/master/examples/kubehelm/crunchy-postgres), and the pre-built containers can be found on DockerHub at [this location](https://hub.docker.com/u/crunchydata/dashboard/).   

This example will create the following in your Kubernetes cluster:  

- postgres master service
- postgres replica service
- postgres 9.5 master database (pod)
- postgres 9.5 replica database (replication controller)




 ![HelmBlogDiagram.jpg](https://lh5.googleusercontent.com/Ff3vRGv3RHsrbAvJUFpVTehohw-OI2AeFmeVSVrdJuU0mjx3lKTa07YlaB_a7rW65rfAdupyeSqOT2DyxnSJ6_y4sXY5DhW14qM-vkxRo32969VZEpUNrZ3hIFdwJ9T04Ev6w2to)



This example creates a simple Postgres streaming replication deployment with a master (read-write), and a single asynchronous replica (read-only). You can scale up the number of replicas dynamically.



**Contents**



The example is made up of various Chart files as follows:


|  |  |
| :------------: | :------------: |
|values.yaml |This file contains values which you can reference within the database templates allowing you to specify in one place values like database passwords|
|templates/master-pod.yaml|The postgres master database pod definition.  This file causes a single postgres master pod to be created.
|templates/master-service.yaml|The postgres master database has a service created to act as a proxy.  This file causes a single service to be created to proxy calls to the master database.
|templates/replica-rc.yaml| The postgres replica database is defined by this file.  This file causes a replication controller to be created which allows the postgres replica containers to be scaled up on-demand.|
|templates/replica-service.yaml|This file causes the service proxy for the replica database container(s) to be created.|




**Installation**



[Install Helm](https://github.com/kubernetes/helm#install) according to their GitHub documentation and then install the examples as follows:




```
helm init

cd crunchy-containers/examples/kubehelm

helm install ./crunchy-postgres
 ```



**Testing**



After installing the Helm chart, you will see the following services:



```
kubectl get services  
NAME              CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE  
crunchy-master    10.0.0.171   \<none\>        5432/TCP   1h  
crunchy-replica   10.0.0.31    \<none\>        5432/TCP   1h  
kubernetes        10.0.0.1     \<none\>        443/TCP    1h
 ```



It takes about a minute for the replica to begin replicating with the master. To test out replication, see if replication is underway with this command, enter password for the password when prompted:



```
psql -h crunchy-master -U postgres postgres -c 'table pg\_stat\_replication'
 ```



If you see a line returned from that query it means the master is replicating to the slave. Try creating some data on the master:




```
psql -h crunchy-master -U postgres postgres -c 'create table foo (id int)'

psql -h crunchy-master -U postgres postgres -c 'insert into foo values (1)'
 ```




Then verify that the data is replicated to the slave:




```
psql -h crunchy-replica -U postgres postgres -c 'table foo'
 ```



You can scale up the number of read-only replicas by running the following kubernetes command:



```
kubectl scale rc crunchy-replica --replicas=2
 ```


It takes 60 seconds for the replica to start and begin replicating from the master.  



The Kubernetes Helm and Charts projects provide a streamlined way to package up complex applications and deploy them on a Kubernetes cluster.  Deploying PostgreSQL clusters can sometimes prove challenging, but the task is greatly simplified using Helm and Charts.






- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
