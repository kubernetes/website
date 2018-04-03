---
layout: post
title: Apache Spark 2.3 with Native Kubernetes Support
date: '2018-03-06T12:00:00.000-08:00'
author: kbarnard
tags: 
modified_time: '2018-03-06T12:04:09.640-08:00'
thumbnail: https://1.bp.blogspot.com/-hl4pnOqiH4M/Wp4w9QmzghI/AAAAAAAAAL4/jcWoDOKEp3Y6lCzGxzTOlbvl2Mq1-2YeQCK4BGAYYCw/s72-c/Screen%2BShot%2B2018-03-05%2Bat%2B10.10.14%2BPM.png
blogger_id: tag:blogger.com,1999:blog-112706738355446097.post-4939704287671088784
blogger_orig_url: http://blog.kubernetes.io/2018/03/apache-spark-23-with-native-kubernetes.html
---

<div><h3> 
Kubernetes and Big Data</h3>The open source community has been working over 
the past year to enable first-class support for data processing, data 
analytics and machine learning workloads in Kubernetes. New extensibility 
features in Kubernetes, such as [custom 
resources](https://kubernetes.io/docs/concepts/api-extension/custom-resources/) 
and [custom 
controllers](https://kubernetes.io/docs/concepts/api-extension/custom-resources/#custom-controllers), 
can be used to create deep integrations with individual applications and 
frameworks. 

Traditionally, data processing workloads have been run in dedicated setups 
like the YARN/Hadoop stack. However, unifying the control plane for all 
workloads on Kubernetes simplifies cluster management and can improve resource 
utilization. 

"Bloomberg has invested heavily in machine learning and NLP to give our 
clients a competitive edge when it comes to the news and financial information 
that powers their investment decisions. By building our Data Science Platform 
on top of Kubernetes, we're making state-of-the-art data science tools like 
Spark, TensorFlow, and our sizable GPU footprint accessible to the company's 
5,000+ software engineers in a consistent, easy-to-use way." - Steven Bower, 
Team Lead, Search and Data Science Infrastructure at Bloomberg 

<div>## Introducing Apache Spark + Kubernetes[Apache Spark 
2.3](http://spark.apache.org/releases/spark-release-2-3-0.html) with native 
Kubernetes support combines the best of the two prominent open source projects 
— Apache Spark, a framework for large-scale data processing; and Kubernetes. 

Apache Spark is an essential tool for data scientists, offering a robust 
platform for a variety of applications ranging from large scale data 
transformation to analytics to machine learning. Data scientists are adopting 
containers en masse to improve their workflows by realizing benefits such as 
packaging of dependencies and creating reproducible artifacts. Given that 
Kubernetes is the de facto standard for managing containerized environments, 
it is a natural fit to have support for Kubernetes APIs within Spark. 

Starting with Spark 2.3, users can run Spark workloads in an existing 
Kubernetes 1.7+ cluster and take advantage of Apache Spark’s ability to manage 
distributed data processing tasks. Apache Spark workloads can make direct use 
of Kubernetes clusters for multi-tenancy and sharing through 
[Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) 
and [Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/), as 
well as administrative features such as [Pluggable 
Authorization](https://kubernetes.io/docs/admin/authorization/) and 
[Logging](https://kubernetes.io/docs/concepts/cluster-administration/logging/). 
Best of all, it requires no changes or new installations on your Kubernetes 
cluster; simply [create a container 
image](https://spark.apache.org/docs/latest/running-on-kubernetes.html#docker-images) 
and set up the right [RBAC 
roles](https://spark.apache.org/docs/latest/running-on-kubernetes.html#rbac) 
for your Spark Application and you’re all set. 

Concretely, a native Spark Application in Kubernetes acts as a [custom 
controller](https://kubernetes.io/docs/concepts/api-extension/custom-resources/#custom-controllers), 
which creates Kubernetes resources in response to requests made by the Spark 
scheduler. In contrast with [deploying Apache Spark in Standalone 
Mode](https://kubernetes.io/blog/2016/03/30/using-Spark-and-Zeppelin-to-process-Big-Data-on-Kubernetes/) 
in Kubernetes, the native approach offers fine-grained management of Spark 
Applications, improved elasticity, and seamless integration with logging and 
monitoring solutions. The community is also exploring advanced use cases such 
as managing streaming workloads and leveraging service meshes like 
[Istio](https://istio.io/).<div> 
<div><div class="separator" style="clear: both; text-align: center;">[<img 
border="0" 
src="https://1.bp.blogspot.com/-hl4pnOqiH4M/Wp4w9QmzghI/AAAAAAAAAL4/jcWoDOKEp3Y6lCzGxzTOlbvl2Mq1-2YeQCK4BGAYYCw/s1600/Screen%2BShot%2B2018-03-05%2Bat%2B10.10.14%2BPM.png" 
/>](http://1.bp.blogspot.com/-hl4pnOqiH4M/Wp4w9QmzghI/AAAAAAAAAL4/jcWoDOKEp3Y6lCzGxzTOlbvl2Mq1-2YeQCK4BGAYYCw/s1600/Screen%2BShot%2B2018-03-05%2Bat%2B10.10.14%2BPM.png) 

To try this yourself on a Kubernetes cluster, simply download the binaries for 
the official [Apache Spark 2.3 
release](https://spark.apache.org/downloads.html). For example, below, we 
describe running a simple Spark application to compute the mathematical 
constant Pi across three Spark executors, each running in a separate pod. 
Please note that this requires a cluster running Kubernetes 1.7 or above, a 
[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) client that 
is configured to access it, and the necessary [RBAC 
rules](https://spark.apache.org/docs/latest/running-on-kubernetes.html#rbac) 
for the default namespace and service account. 
<div dir="ltr" style="margin-left: 0pt;"><br class="Apple-interchange-newline" 
/><table style="border-collapse: collapse; border: none; width: 
468pt;"><colgroup><col width="*"></col></colgroup><tr style="height: 0pt;"><td 
style="border-color: rgb(0, 0, 0); border-style: solid; border-width: 1pt; 
padding: 5pt; vertical-align: top;"><div dir="ltr" style="line-height: 1.2; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="font-family: &quot;courier 
new&quot;; font-size: 11pt; white-space: pre-wrap;">$ kubectl cluster-info 
<span id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"> 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">Kubernetes master is running at 
https://xx.yy.zz.ww<span 
id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"> 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">$ bin/spark-submit \<span 
id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"> 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">    --master k8s://https://xx.yy.zz.ww 
\<span id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"> 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">    --deploy-mode cluster \<span 
id="docs-internal-guid-3341b81d-f9ee-3140-dde1-cc8e8fcaf36b"> <div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">    --name spark-pi \<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">    --class 
org.apache.spark.examples.SparkPi \<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="font-family: &quot;courier 
new&quot;; font-size: 11pt; vertical-align: baseline; white-space: pre-wrap;"> 
   --conf spark.executor.instances=5 \<div dir="ltr" style="line-height: 1.38; 
margin-bottom: 0pt; margin-top: 0pt;"><span style="font-family: &quot;courier 
new&quot;; font-size: 11pt; vertical-align: baseline; white-space: pre-wrap;"> 
   --conf spark.kubernetes.container.image=&lt;spark-image&gt; \<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">    --conf 
spark.kubernetes.driver.pod.name=spark-pi-driver \<div dir="ltr" 
style="line-height: 1.38; margin-bottom: 0pt; margin-top: 0pt;"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">    
local:///opt/spark/examples/jars/spark-examples_2.11-2.3.0.jar<div><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;"> 
<div> 
To watch Spark resources that are created on the cluster, you can use the 
following kubectl command in a separate terminal window.<div><div dir="ltr" 
style="margin-left: 0pt;"><br class="Apple-interchange-newline" /><table 
style="border-collapse: collapse; border: none; width: 468pt;"><colgroup><col 
width="*"></col></colgroup><tr style="height: 0pt;"><td style="border-color: 
rgb(0, 0, 0); border-style: solid; border-width: 1pt; padding: 5pt; 
vertical-align: top;"><div dir="ltr" style="line-height: 1.2; margin-bottom: 
0pt; margin-top: 0pt;"><span style="font-family: &quot;courier new&quot;; 
font-size: 11pt; white-space: pre-wrap;">$ kubectl get pods -l 'spark-role in 
(driver, executor)' -w 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: transparent; color: black; font-family: 
&quot;courier new&quot;; font-size: 11pt; font-style: normal; font-variant: 
normal; font-weight: 400; text-decoration: none; vertical-align: baseline; 
white-space: pre-wrap;">NAME              READY     STATUS    RESTARTS   
AGE<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: transparent; color: black; font-family: 
&quot;courier new&quot;; font-size: 11pt; font-style: normal; font-variant: 
normal; font-weight: 400; text-decoration: none; vertical-align: baseline; 
white-space: pre-wrap;">spark-pi-driver   1/1       Running   0          
14s<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: transparent; color: black; font-family: 
&quot;courier new&quot;; font-size: 11pt; font-style: normal; font-variant: 
normal; font-weight: 400; text-decoration: none; vertical-align: baseline; 
white-space: pre-wrap;">spark-pi-da1968a859653d6bab93f8e6503935f2-exec-1   0/1 
      Pending   0         0s<span 
id="docs-internal-guid-3341b81d-f9ed-d2eb-9955-8ee9e98ac7f7"> 
<div dir="ltr" style="line-height: 1.38; margin-bottom: 0pt; margin-top: 
0pt;"><span style="background-color: transparent; color: black; font-family: 
&quot;courier new&quot;; font-size: 11pt; font-style: normal; font-variant: 
normal; font-weight: 400; text-decoration: none; vertical-align: baseline; 
white-space: pre-wrap;">...<span 
id="docs-internal-guid-dd1bcd95-6e93-6561-dfaf-69e0d1863714"> 
The results can be streamed during job execution by running:<div><div 
dir="ltr" style="margin-left: 0pt;"><br class="Apple-interchange-newline" 
/><table style="border-collapse: collapse; border: none; width: 
468pt;"><colgroup><col width="*"></col></colgroup><tr style="height: 0pt;"><td 
style="border-color: rgb(0, 0, 0); border-style: solid; border-width: 1pt; 
padding: 5pt; vertical-align: top;"><div dir="ltr" style="line-height: 1.2; 
margin-bottom: 0pt; margin-top: 0pt;"><span 
id="docs-internal-guid-3341b81d-f9ed-43cf-51e4-7047ac84f63c"><span 
style="font-family: &quot;courier new&quot;; font-size: 11pt; vertical-align: 
baseline; white-space: pre-wrap;">$ kubectl logs -f spark-pi-driver 
<span id="docs-internal-guid-dd1bcd95-6e93-6561-dfaf-69e0d1863714"> When the 
application completes, you should see the computed value of Pi in the driver 
logs. 

In Spark 2.3, we’re starting with support for Spark applications written in 
Java and Scala with support for resource localization from a variety of data 
sources including HTTP, GCS, HDFS, and more. We have also paid close attention 
to failure and recovery semantics for Spark executors to provide a strong 
foundation to build upon in the future. Get started with [the open-source 
documentation](https://spark.apache.org/docs/latest/running-on-kubernetes.html) 
today. 

## Get InvolvedThere’s lots of exciting work to be done in the near future. 
We’re actively working on features such as dynamic resource allocation, 
in-cluster staging of dependencies, support for PySpark &amp; SparkR, support 
for Kerberized HDFS clusters, as well as client-mode and popular notebooks’ 
interactive execution environments. For people who fell in love with the 
Kubernetes way of managing applications declaratively, we’ve also been working 
on a [Kubernetes Operator](https://coreos.com/operators/) for spark-submit, 
which allows users to declaratively specify and submit Spark Applications. 

And we’re just getting started! We would love for you to get involved and help 
us evolve the project further. 
1. Join the spark-dev and spark-user [mailing 
lists](https://spark.apache.org/community.html). 
1. File an issue in [Apache Spark 
JIRA](https://issues.apache.org/jira/issues/?jql=project+%3D+SPARK+AND+component+%3D+Kubernetes) 
under the Kubernetes component. 
1. Join our [SIG 
meetings](https://github.com/kubernetes/community/tree/master/sig-big-data) on 
Wednesdays at 10am PT. 
Huge thanks to the Apache Spark and Kubernetes contributors spread across 
multiple organizations who spent many hundreds of hours working on this 
effort. We look forward to seeing more of you contribute to the project and 
help it evolve further. 

Anirudh Ramanathan and Palak Bhatia 
Google 