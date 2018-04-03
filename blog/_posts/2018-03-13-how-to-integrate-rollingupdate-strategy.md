---
layout: post
title: How to Integrate RollingUpdate Strategy for TPR in Kubernetes
date: '2018-03-13T07:00:00.000-07:00'
author: kbarnard
tags: 
modified_time: '2018-03-13T07:00:51.163-07:00'
thumbnail: https://lh5.googleusercontent.com/4WiSkxX-XBqARVqQ0No-1tZ31op90LAUkTco3FdIO1mFScNOTVtMCgnjaO8SRUmms-6MAb46CzxlXDhLBqAAAmbx26atJnu4t1FTTALZx_CbUPqrCxjL746DW4TD42-03Ac9VB2c=s72-c
blogger_id: tag:blogger.com,1999:blog-112706738355446097.post-6541066173784430574
blogger_orig_url: http://blog.kubernetes.io/2018/03/how-to-integrate-rollingupdate-strategy.html
---

<div>With Kubernetes, it’s easy to manage and scale stateless applications 
like web apps and API services right out of the box. To date, almost all of 
the talks about Kubernetes has been about microservices and stateless 
applications. 

With the popularity of container-based microservice architectures, there is a 
strong need to deploy and manage RDBMS(Relational Database Management 
Systems). RDBMS requires experienced database-specific knowledge to correctly 
scale, upgrade, and re-configure while protecting against data loss or 
unavailability. 

For example, MySQL (the most popular open source RDBMS) needs to store data in 
files that are persistent and exclusive to each MySQL database’s storage. Each 
MySQL database needs to be individually distinct, another, more complex is in 
cluster that need to distinguish one MySQL database from a cluster as a 
different role, such as master, slave, or shard. High availability and zero 
data loss are also hard to accomplish when replacing database nodes on failed 
machines. 

Using powerful Kubernetes API extension mechanisms, we can encode RDBMS domain 
knowledge into software, named WQ-RDS, running atop Kubernetes like built-in 
resources. 

WQ-RDS leverages Kubernetes primitive resources and controllers, it deliveries 
a number of enterprise-grade features and brings a significantly reliable way 
to automate time-consuming operational tasks like database setup, patching 
backups, and setting up high availability clusters. WQ-RDS supports mainstream 
versions of Oracle and MySQL (both compatible with MariaDB). 

Let’s demonstrate how to manage a MySQL sharding cluster. 

## MySQL Sharding ClusterMySQL Sharding Cluster is a scale-out database 
architecture. Based on the hash algorithm, the architecture distributes data 
across all the shards of the cluster. Sharding is entirely transparent to 
clients: Proxy is able to connect to any Shards in the cluster and issue 
queries to the correct shards directly. 

<table align="center" cellpadding="0" cellspacing="0" 
class="tr-caption-container" style="margin-left: auto; margin-right: auto; 
text-align: center;"><td style="text-align: center;"><img height="332" 
src="https://lh5.googleusercontent.com/4WiSkxX-XBqARVqQ0No-1tZ31op90LAUkTco3FdIO1mFScNOTVtMCgnjaO8SRUmms-6MAb46CzxlXDhLBqAAAmbx26atJnu4t1FTTALZx_CbUPqrCxjL746DW4TD42-03Ac9VB2c" 
style="margin-left: auto; margin-right: auto;" width="640" /><td 
class="tr-caption" style="text-align: center;"><div style="text-align: 
left;"><span style="font-size: small; text-align: start;">Note: Each shard 
corresponds to a single MySQL instance. Currently, WQ-RDS supports a maximum 
of 64 shards. 
All of the shards are built with Kubernetes Statefulset, Services, Storage 
Class, configmap, secrets and MySQL. WQ-RDS manages the entire lifecycle of 
the sharding cluster. Advantages of the sharding cluster are obvious: 
1. Scale out queries per second (QPS) and transactions per second (TPS) 
1. Scale out storage capacity: gain more storage by distributing data to 
multiple nodes 
<div> 
## Create a MySQL Sharding ClusterLet’s create a Kubernetes cluster with 8 
shards. 
  <div dir="ltr" style="margin-left: 0pt;"><table style="border-collapse: 
collapse; border: none; width: 451.27559055118115pt;"><colgroup><col 
width="*"></col></colgroup><tr style="height: 0pt;"><td style="border-bottom: 
solid #000000 1pt; border-left: solid #000000 1pt; border-right: solid #000000 
1pt; border-top: solid #000000 1pt; padding: 5pt 5pt 5pt 5pt; vertical-align: 
top;"><span style="font-family: &quot;courier new&quot; , &quot;courier&quot; 
, monospace;">kubectl create -f mysqlshardingcluster.yaml 
Next, create a MySQL Sharding Cluster including 8 shards. 
1. TPR : MysqlCluster and MysqlDatabase 
<div><table style="border-collapse: collapse; border: none; width: 
451.276pt;"><colgroup><col width="*"></col></colgroup><tr style="height: 
0pt;"><td style="border-color: rgb(0, 0, 0); border-style: solid; 
border-width: 1pt; padding: 5pt; vertical-align: top;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">[root@k8s-master ~]# kubectl get mysqlcluster 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
NAME             KIND 

clustershard-c   MysqlCluster.v1.mysql.orain.comMysqlDatabase from 
clustershard-c0 to clustershard-c7 belongs to MysqlCluster clustershard-c. 

<table style="border-collapse: collapse; border: none; width: 
451.276pt;"><colgroup><col width="*"></col></colgroup><tr style="height: 
0pt;"><td style="border-color: rgb(0, 0, 0); border-style: solid; 
border-width: 1pt; padding: 5pt; vertical-align: top;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">[root@k8s-master ~]# kubectl get mysqldatabase 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">NAME KIND 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c0 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c1 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c2 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c3 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c4 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c5 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c6 MysqlDatabase.v1.mysql.orain.com 
<span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"> 
 <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">clustershard-c7 MysqlDatabase.v1.mysql.orain.com 
Next, let’s look at two main features: high availability and RollingUpdate 
strategy. 

To demonstrate, we'll start by running sysbench to generate some load on the 
cluster. In this example, QPS metrics are generated by MySQL export, collected 
by Prometheus, and visualized in Grafana. 

## Feature: high availability<div>WQ-RDS handles MySQL instance crashes while 
protecting against data loss. 

When killing clustershard-c0, WQ-RDS will detect that clustershard-c0 is 
unavailable and replace clustershard-c0 on failed machine, taking about 35 
seconds on average. 

<img height="154" 
src="https://lh3.googleusercontent.com/sXqVqfTu6rMWn0mlHLgHHqATe_qsx1tNmMfX60HoTwyhd5HCL4A_ViFBQAZfOoVGioeXcI_XXbzVFUdq2hbKGwS0OXH6PFGqgpZshfBwrT088bz4KqeyTbHpQR2olyzE6eRo1fan" 
width="640" /> 

zero data loss at same time. 

<img height="392" 
src="https://lh6.googleusercontent.com/7xnN_sODa-3Ch3ScAUlggCTeYfnE3-wxRaCIHrljHCB7LnXgth8zeCv0gk_UU1jbSDBQuACQ2Mf1FO1-E7GvMWwGKjp7irenAKp4DkHlA5LR9OVuLXqubPFhhksA8kfBUh4Z4OuN" 
width="640" /> 
<h3> 
</h3>## Feature : RollingUpdate StrategyMySQL Sharding Cluster brings us not 
only strong scalability but also some level of maintenance complexity. For 
example, when updating a MySQL configuration like innodb_buffer_pool_size, a 
DBA has to perform a number of steps: 

1. Apply change time. 
2. Disable client access to database proxies. 
3. Start a rolling upgrade.<div> 
Rolling upgrades need to proceed in order and are the most demanding step of 
the process. One cannot continue a rolling upgrade until and unless previous 
updates to MySQL instances are running and ready. 

4 Verify the cluster. 
5. Enable client access to database proxies. 

Possible problems with a rolling upgrade include: 
1. node reboot 
1. MySQL instances restart 
1. human error 
Instead, WQ-RDS enables a DBA to perform rolling upgrades automatically. 

## StatefulSet RollingUpdate in KubernetesKubernetes 1.7 includes a major 
feature that adds automated updates to StatefulSets and supports a range of 
update strategies including rolling updates. 

## Note: For more information about [StatefulSet 
RollingUpdate](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#rolling-updates), 
see the Kubernetes docs. 

Because TPR (currently CRD) does not support the rolling upgrade strategy, we 
needed to integrate the RollingUpdate strategy into WQ-RDS. Fortunately, the 
[Kubernetes repo](https://github.com/kubernetes/kubernetes) is a treasure for 
learning. In the process of implementation, there are some points to share: 
1. **MySQL Sharding Cluster has ****changed**: Each StatefulSet has its 
corresponding ControllerRevision, which records all the revision data and 
order (like git). Whenever StatefulSet is syncing, StatefulSet Controller will 
firstly compare it's spec to the latest corresponding ControllerRevision data 
(similar to git diff). If changed, a new ControllerrRevision will be 
generated, and the revision number will be incremented by 1. WQ-RDS borrows 
the process, MySQL Sharding Cluster object will record all the revision and 
order in ControllerRevision. 
1. **How to initialize MySQL Sharding Cluster to meet request ****replicas**: 
Statefulset supports two [Pod management 
policies](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#rolling-updates): 
Parallel and OrderedReady. Because MySQL Sharding Cluster doesn’t require 
ordered creation for its initial processes, we use the Parallel policy to 
accelerate the initialization of the cluster. 
1. **How to perform a Rolling ****Upgrade**: Statefulset recreates pods in 
strictly decreasing order. The difference is that WQ-RDS updates shards 
instead of recreating them, as shown below: 
<img height="283" 
src="https://lh6.googleusercontent.com/B4ig8krCsXwvMeBy8NamQi1DrihUEzBcRTHCqhn9kUvlcpPrFoYUNAxn61qh8S2HXcdg31QpOhWSsYHP0jI4QxPkKpZ5oY-k9gFp1eK63qt6rwTMMWMiBs45DObY6rw2R7c0lNPu" 
width="640" /> 
1. **When RollingUpdate ends**: Kubernetes signals termination clearly. A 
rolling update completes when all of a set's Pods have been updated to the 
updateRevision. The status's currentRevision is set to updateRevision and its 
updateRevision is set to the empty string. The status's currentReplicas is set 
to updateReplicas and its updateReplicas are set to 0. 
## Controller revision in WQ-RDSRevision information is stored in 
MysqlCluster.Status and is no different than Statefulset.Status. 

<table style="border-collapse: collapse; border: none; width: 
451.276pt;"><colgroup><col width="*"></col></colgroup><tr style="height: 
0pt;"><td style="border-color: rgb(0, 0, 0); border-style: solid; 
border-width: 1pt; padding: 5pt; vertical-align: top;"><div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;"><span style="font-family: &quot;courier 
new&quot; , &quot;courier&quot; , monospace;">root@k8s-master ~]# kubectl get 
mysqlcluster -o yaml clustershard-c<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">apiVersion: v1<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">items:<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; 
margin-top: 0pt;"><span style="background-color: white; font-size: 10pt; 
font-style: normal; font-variant: normal; font-weight: 400; text-decoration: 
none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">- apiVersion: mysql.orain.com/v1<div dir="ltr" style="line-height: 
1.38; margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: 
white; font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 
400; text-decoration: none; vertical-align: baseline; white-space: 
pre-wrap;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;">  kind: MysqlCluster<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;"><span style="font-family: &quot;courier 
new&quot; , &quot;courier&quot; , monospace;">  metadata:<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;"><span style="font-family: &quot;courier 
new&quot; , &quot;courier&quot; , monospace;">    creationTimestamp: 
2017-10-20T08:19:41Z<div dir="ltr" style="line-height: 1.38; margin-bottom: 
0pt; margin-top: 0pt;"><span style="background-color: white; font-size: 10pt; 
font-style: normal; font-variant: normal; font-weight: 400; text-decoration: 
none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">    labels:<div dir="ltr" style="line-height: 1.38; margin-bottom: 
0pt; margin-top: 0pt;"><span style="background-color: white; font-size: 10pt; 
font-style: normal; font-variant: normal; font-weight: 400; text-decoration: 
none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">      AppName: clustershard-crm<div dir="ltr" style="line-height: 
1.38; margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: 
white; font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 
400; text-decoration: none; vertical-align: baseline; white-space: 
pre-wrap;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;">      Createdby: orain.com<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;"><span style="font-family: &quot;courier 
new&quot; , &quot;courier&quot; , monospace;">      DBType: MySQL<div 
dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: white; font-size: 10pt; font-style: 
normal; font-variant: normal; font-weight: 400; text-decoration: none; 
vertical-align: baseline; white-space: pre-wrap;"><span style="font-family: 
&quot;courier new&quot; , &quot;courier&quot; , monospace;">    name: 
clustershard-c<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; 
margin-top: 0pt;"><span style="background-color: white; font-size: 10pt; 
font-style: normal; font-variant: normal; font-weight: 400; text-decoration: 
none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">    namespace: default<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">    resourceVersion: "415852"<div dir="ltr" style="line-height: 
1.38; margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: 
white; font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 
400; text-decoration: none; vertical-align: baseline; white-space: 
pre-wrap;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;">    selfLink: 
/apis/mysql.orain.com/v1/namespaces/default/mysqlclusters/clustershard-c<div 
dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: white; font-size: 10pt; font-style: 
normal; font-variant: normal; font-weight: 400; text-decoration: none; 
vertical-align: baseline; white-space: pre-wrap;"><span style="font-family: 
&quot;courier new&quot; , &quot;courier&quot; , monospace;">    uid: 
6bb089bb-b56f-11e7-ae02-525400e717a6<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">  spec:<div dir="ltr" style="line-height: 1.38; margin-bottom: 
0pt; margin-top: 0pt;"><span style="background-color: white; font-size: 10pt; 
font-style: normal; font-variant: normal; font-weight: 400; text-decoration: 
none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">  ...<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; 
margin-top: 0pt;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">      
<span style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 700; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;">dbresourcespec:<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 700; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;"><span style="font-family: &quot;courier 
new&quot; , &quot;courier&quot; , monospace;">        limitedcpu: 1200m<div 
dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: white; font-size: 10pt; font-style: 
normal; font-variant: normal; font-weight: 700; text-decoration: none; 
vertical-align: baseline; white-space: pre-wrap;"><span style="font-family: 
&quot;courier new&quot; , &quot;courier&quot; , monospace;">        
limitedmemory: 400Mi<div dir="ltr" style="line-height: 1.38; margin-bottom: 
0pt; margin-top: 0pt;"><span style="background-color: white; font-size: 10pt; 
font-style: normal; font-variant: normal; font-weight: 700; text-decoration: 
none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">        requestcpu: 1000m<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 700; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">        requestmemory: 400Mi<div dir="ltr" style="line-height: 
1.38; margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: 
white; font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 
400; text-decoration: none; vertical-align: baseline; white-space: 
pre-wrap;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;">  ...<div dir="ltr" style="line-height: 
1.38; margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: 
white; font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 
400; text-decoration: none; vertical-align: baseline; white-space: 
pre-wrap;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;">  status:<div dir="ltr" style="line-height: 
1.38; margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: 
white; font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 
400; text-decoration: none; vertical-align: baseline; white-space: 
pre-wrap;"><span style="font-family: &quot;courier new&quot; , 
&quot;courier&quot; , monospace;">    currentReplicas: 8<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="background-color: white; font-size: 10pt; font-style: normal; 
font-variant: normal; font-weight: 400; text-decoration: none; vertical-align: 
baseline; white-space: pre-wrap;"><span style="font-family: &quot;courier 
new&quot; , &quot;courier&quot; , monospace;">    currentRevision: 
clustershard-c-648d878965<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">    replicas: 8<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="background-color: white; 
font-size: 10pt; font-style: normal; font-variant: normal; font-weight: 400; 
text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"><span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;">    updateRevision: clustershard-c-648d878965<span 
style="font-family: &quot;courier new&quot; , &quot;courier&quot; , 
monospace;"><span 
id="docs-internal-guid-2d69757b-1dcc-95f4-620b-c9aac20f2367"> 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: white; font-size: 10pt; font-style: 
normal; font-variant: normal; font-weight: 400; text-decoration: none; 
vertical-align: baseline; white-space: pre-wrap;"><span style="font-family: 
&quot;courier new&quot; , &quot;courier&quot; , monospace;">kind: List<h3> 
Example: Perform a rolling upgrade</h3>Finally, We can now update 
"clustershard-c" to update configuration "innodb_buffer_pool_size" from 6GB to 
7GB and reboot. 

The process takes 480 seconds. 

<img height="200" 
src="https://lh4.googleusercontent.com/LOxFDdojYxnPvSHDYwivVge6vGImK7uTdyvCsKrxCMF3rIlVkw7mHeNhJiNJwz1aGzVhZXpqrgzHC6pIbkPk3JPAtuSqX9ovAYBzK01BGfzwkXvMGZomAh4L0DahGyD3QB715B-Z" 
width="640" /> 

The upgrade is in monotonically decreasing manner: 

<img height="199" 
src="https://lh6.googleusercontent.com/DhFbY3JDh23A_91c04TujxWM9xCX_xq1xOCXHi7XAd75LzKwDtbH6Gr_2VXCscg8AeVCQzw3Inw4M-uvssWq8od4va0wd-fIyClVY63FjRfeU16fQda_XqzBYRIhrG5W3tDnCAwC" 
width="640" /> 

<img height="200" 
src="https://lh6.googleusercontent.com/bAJtLRRl2TqQrfBOooNm9DIEuezoBhT3f-XuOyGxp8sKePzfRaQYcJ7PFvL30xw9jeUpc-3rVw6Qjr46dFRk7mmUsf3oichNEuC-BFwCEtpbxK0_BjSJxtIE4B5xR4CGw1m6Hf0D" 
width="640" /> 

<img height="199" 
src="https://lh4.googleusercontent.com/ALYk-EP_rYibA95nIIo8TKx8BYuSY9w1Pqw4JLEiV89K9i06uBhkTrYWX26FjYtheGKVwwVMTtDKH7UTBovGf8AEpK97T3RT23RSAUTs4GyDFaDOGmlRAczbGLm0UjQglbB_NPdF" 
width="640" /> 

<img height="200" 
src="https://lh4.googleusercontent.com/gmM6UbgVOBWPJBpIMutxeTxGiwtjFv25KAHQw3ebVAF5Kxm-uxkPKEiYKhpwYUTyDe5knYlGmQDDHiN8eefBJx0fbK7jg4IlpG5_DXMUG6rNNFIbpP7Q94ANROIeUfe5JP6t-k37" 
width="640" /> 

<img height="200" 
src="https://lh5.googleusercontent.com/aiczeqRNRls8lh-LYbnx112kgZI2gvaBMimAk74KlLhR3EVicuKAemTKr2eKUSFPjmKbsg_gw_nY1G4YU0-3J1EjDPOhz55UUri47Py-s-jRf0dF-lAKn6TRrF6IvGtv2aldWa3k" 
width="640" /> 

<img height="200" 
src="https://lh6.googleusercontent.com/mwRQP_wXMCzpXsC5sqb0nJ9jU4KdUl4FiUE26gQZMQbrn5zcgqSYZB03CLmGsT2Nuq-7x00W4Ar3IUAh7hxEksQEGl6ugAmY0wo7xjzisNH9VE1qto9Afx8QW2Sr6NR-SBDeJfTt" 
width="640" /> 

<img height="200" 
src="https://lh6.googleusercontent.com/joraaJ-qX-K8zTdAFBJWeOswQQtNeX6yezKGkSM56FNYQT-XYrgsxvNLYBE0askw9huAmJhebCVU4AMvjz4B6xlIjdLwO3vMX7_dWBzkfu05HZ3-NOsFnqg-jvkLknl-ldRzUcFO" 
width="640" /> 

<img height="200" 
src="https://lh5.googleusercontent.com/ayoUAhD-azUjUqjut7iSiW8FBFJpCJZLRJDT9mXJoy4QTutAsGgr4yPvbFumaXasOqpsmJ_zZ2k7nrQl2YrjGqPr83PXe-tXjj9OLc-GYhhtJTzBEeddWpZn5pDyBpdw9I4sD-O0" 
width="640" /> 

## ConclusionRollingUpgrade is meaningful to database administrators. It 
provides a more effective way to operator database. 

--Orain Xiong, co-founder, Woqutech 