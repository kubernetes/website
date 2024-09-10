---
title: " Kubernetes on OpenStack "
date: 2015-05-19
slug: kubernetes-on-openstack
url: /blog/2015/05/Kubernetes-On-Openstack
author: >
   Martin Buhr (independent)
---



[![](https://3.bp.blogspot.com/-EOrCHChZJZE/VVZzq43g6CI/AAAAAAAAF-E/JUilRHk369E/s400/Untitled%2Bdrawing.jpg)](https://3.bp.blogspot.com/-EOrCHChZJZE/VVZzq43g6CI/AAAAAAAAF-E/JUilRHk369E/s1600/Untitled%2Bdrawing.jpg)



Today, the [OpenStack foundation](https://www.openstack.org/foundation/) made it even easier for you deploy and manage clusters of Docker containers on OpenStack clouds by including Kubernetes in its [Community App Catalog](http://apps.openstack.org/). &nbsp;At a keynote today at the OpenStack Summit in Vancouver, Mark Collier, COO of the OpenStack Foundation, and Craig Peters, &nbsp;[Mirantis](https://www.mirantis.com/) product line manager, demonstrated the Community App Catalog workflow by launching a Kubernetes cluster in a matter of seconds by leveraging the compute, storage, networking and identity systems already present in an OpenStack cloud.



The entries in the catalog include not just the ability to [start a Kubernetes cluster](http://apps.openstack.org/#tab=murano-apps&asset=Kubernetes%20Cluster), but also a range of applications deployed in Docker containers managed by Kubernetes. These applications include:



- Apache web server
- Nginx web server
- Crate - The Distributed Database for Docker
- GlassFish - Java EE 7 Application Server
- Tomcat - An open-source web server and servlet container
- InfluxDB - An open-source, distributed, time series database
- Grafana - Metrics dashboard for InfluxDB
- Jenkins - An extensible open source continuous integration server
- MariaDB database
- MySql database
- Redis - Key-value cache and store
- PostgreSQL database
- MongoDB NoSQL database
- Zend Server - The Complete PHP Application Platform



This list will grow, and is curated [here](https://opendev.org/x/k8s-docker-suite-app-murano/src/branch/master/Kubernetes). You can examine (and contribute to) the YAML file that tells Murano how to install and start the Kubernetes cluster [here](https://opendev.org/x/k8s-docker-suite-app-murano/src/branch/master/Kubernetes/KubernetesCluster/package/Classes/KubernetesCluster.yaml).



[The Kubernetes open source project](https://github.com/GoogleCloudPlatform/kubernetes) has continued to see fantastic community adoption and increasing momentum, with over 11,000 commits and 7,648 stars on GitHub. With supporters ranging from Red Hat and Intel to CoreOS and Box.net, it has come to represent a range of customer interests ranging from enterprise IT to cutting edge startups. We encourage you to give it a try, give us your feedback, and get involved in our growing community.
