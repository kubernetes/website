---
title: "Apache Spark 2.3 with Native Kubernetes Support"
date: 2018-03-06
slug: apache-spark-23-with-native-kubernetes
url: /blog/2018/03/Apache-Spark-23-With-Native-Kubernetes
author: >
  Anirudh Ramanathan (Google),
  Palak Bhatia (Google)
---
### Kubernetes and Big Data

The open source community has been working over the past year to enable first-class support for data processing, data analytics and machine learning workloads in Kubernetes. New extensibility features in Kubernetes, such as [custom resources][1] and [custom controllers][2], can be used to create deep integrations with individual applications and frameworks.

Traditionally, data processing workloads have been run in dedicated setups like the YARN/Hadoop stack. However, unifying the control plane for all workloads on Kubernetes simplifies cluster management and can improve resource utilization.

"Bloomberg has invested heavily in machine learning and NLP to give our clients a competitive edge when it comes to the news and financial information that powers their investment decisions. By building our Data Science Platform on top of Kubernetes, we're making state-of-the-art data science tools like Spark, TensorFlow, and our sizable GPU footprint accessible to the company's 5,000+ software engineers in a consistent, easy-to-use way." - Steven Bower, Team Lead, Search and Data Science Infrastructure at Bloomberg

###  Introducing Apache Spark + Kubernetes

[Apache Spark 2.3][3] with native Kubernetes support combines the best of the two prominent open source projects — Apache Spark, a framework for large-scale data processing; and Kubernetes.

Apache Spark is an essential tool for data scientists, offering a robust platform for a variety of applications ranging from large scale data transformation to analytics to machine learning. Data scientists are adopting containers en masse to improve their workflows by realizing benefits such as packaging of dependencies and creating reproducible artifacts. Given that Kubernetes is the de facto standard for managing containerized environments, it is a natural fit to have support for Kubernetes APIs within Spark.

Starting with Spark 2.3, users can run Spark workloads in an existing Kubernetes 1.7+ cluster and take advantage of Apache Spark's ability to manage distributed data processing tasks. Apache Spark workloads can make direct use of Kubernetes clusters for multi-tenancy and sharing through [Namespaces][4] and [Quotas][5], as well as administrative features such as [Pluggable Authorization][6] and [Logging][7]. Best of all, it requires no changes or new installations on your Kubernetes cluster; simply [create a container image][8] and set up the right [RBAC roles][9] for your Spark Application and you're all set.

Concretely, a native Spark Application in Kubernetes acts as a [custom controller][2], which creates Kubernetes resources in response to requests made by the Spark scheduler. In contrast with [deploying Apache Spark in Standalone Mode][10] in Kubernetes, the native approach offers fine-grained management of Spark Applications, improved elasticity, and seamless integration with logging and monitoring solutions. The community is also exploring advanced use cases such as managing streaming workloads and leveraging service meshes like [Istio][11].

![][12]

To try this yourself on a Kubernetes cluster, simply download the binaries for the official [Apache Spark 2.3 release][13]. For example, below, we describe running a simple Spark application to compute the mathematical constant Pi across three Spark executors, each running in a separate pod. Please note that this requires a cluster running Kubernetes 1.7 or above, a [kubectl][14] client that is configured to access it, and the necessary [RBAC rules][9] for the default namespace and service account.  



```
$ kubectl cluster-info  

Kubernetes master is running at https://xx.yy.zz.ww

$ bin/spark-submit

   --master k8s://https://xx.yy.zz.ww

   --deploy-mode cluster

   --name spark-pi

   --class org.apache.spark.examples.SparkPi

   --conf spark.executor.instances=5

   --conf spark.kubernetes.container.image=

   --conf spark.kubernetes.driver.pod.name=spark-pi-driver

   local:///opt/spark/examples/jars/spark-examples_2.11-2.3.0.jar

 ```

To watch Spark resources that are created on the cluster, you can use the following kubectl command in a separate terminal window.



```
$ kubectl get pods -l 'spark-role in (driver, executor)' -w

NAME              READY STATUS  RESTARTS AGE

spark-pi-driver   1/1 Running  0 14s

spark-pi-da1968a859653d6bab93f8e6503935f2-exec-1   0/1 Pending 0 0s

```


The results can be streamed during job execution by running:



```

$ kubectl logs -f spark-pi-driver

```

When the application completes, you should see the computed value of Pi in the driver logs.

In Spark 2.3, we're starting with support for Spark applications written in Java and Scala with support for resource localization from a variety of data sources including HTTP, GCS, HDFS, and more. We have also paid close attention to failure and recovery semantics for Spark executors to provide a strong foundation to build upon in the future. Get started with [the open-source documentation][15] today.

###  Get Involved

There's lots of exciting work to be done in the near future. We're actively working on features such as dynamic resource allocation, in-cluster staging of dependencies, support for PySpark & SparkR, support for Kerberized HDFS clusters, as well as client-mode and popular notebooks' interactive execution environments. For people who fell in love with the Kubernetes way of managing applications declaratively, we've also been working on a [Kubernetes Operator][16] for spark-submit, which allows users to declaratively specify and submit Spark Applications.

And we're just getting started! We would love for you to get involved and help us evolve the project further.  

Huge thanks to the Apache Spark and Kubernetes contributors spread across multiple organizations who spent many hundreds of hours working on this effort. We look forward to seeing more of you contribute to the project and help it evolve further.

[1]: https://kubernetes.io/docs/concepts/api-extension/custom-resources/
[2]: https://kubernetes.io/docs/concepts/api-extension/custom-resources/#custom-controllers
[3]: http://spark.apache.org/releases/spark-release-2-3-0.html
[4]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[5]: https://kubernetes.io/docs/concepts/policy/resource-quotas/
[6]: https://kubernetes.io/docs/admin/authorization/
[7]: https://kubernetes.io/docs/concepts/cluster-administration/logging/
[8]: https://spark.apache.org/docs/latest/running-on-kubernetes.html#docker-images
[9]: https://spark.apache.org/docs/latest/running-on-kubernetes.html#rbac
[10]: https://kubernetes.io/blog/2016/03/using-Spark-and-Zeppelin-to-process-Big-Data-on-Kubernetes
[11]: https://istio.io/
[12]: https://1.bp.blogspot.com/-hl4pnOqiH4M/Wp4w9QmzghI/AAAAAAAAAL4/jcWoDOKEp3Y6lCzGxzTOlbvl2Mq1-2YeQCK4BGAYYCw/s1600/Screen%2BShot%2B2018-03-05%2Bat%2B10.10.14%2BPM.png
[13]: https://spark.apache.org/downloads.html
[14]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[15]: https://spark.apache.org/docs/latest/running-on-kubernetes.html
[16]: https://coreos.com/operators/
