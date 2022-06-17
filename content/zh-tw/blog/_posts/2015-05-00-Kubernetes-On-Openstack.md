---
title: " OpenStack 上的 Kubernetes "
date: 2015-05-19
slug: kubernetes-on-openstack
---

<!--
---
title: " Kubernetes on OpenStack "
date: 2015-05-19
slug: kubernetes-on-openstack
url: /zh-cn/blog/2015/05/Kubernetes-On-Openstack
---
-->

[![](https://3.bp.blogspot.com/-EOrCHChZJZE/VVZzq43g6CI/AAAAAAAAF-E/JUilRHk369E/s400/Untitled%2Bdrawing.jpg)](https://3.bp.blogspot.com/-EOrCHChZJZE/VVZzq43g6CI/AAAAAAAAF-E/JUilRHk369E/s1600/Untitled%2Bdrawing.jpg)


<!--
Today, the [OpenStack foundation](https://www.openstack.org/foundation/) made it even easier for you deploy and manage clusters of Docker containers on OpenStack clouds by including Kubernetes in its [Community App Catalog](http://apps.openstack.org/). &nbsp;At a keynote today at the OpenStack Summit in Vancouver, Mark Collier, COO of the OpenStack Foundation, and Craig Peters, &nbsp;[Mirantis](https://www.mirantis.com/) product line manager, demonstrated the Community App Catalog workflow by launching a Kubernetes cluster in a matter of seconds by leveraging the compute, storage, networking and identity systems already present in an OpenStack cloud.
-->
今天，[OpenStack 基金會](https://www.openstack.org/foundation/)透過在其[社群應用程式目錄](http://apps.openstack.org/)中包含 Kubernetes，使您更容易在 OpenStack 雲上部署和管理 Docker 容器叢集。
今天在溫哥華 OpenStack 峰會上的主題演講中，OpenStack 基金會的營運長：Mark Collier 和 [Mirantis](https://www.mirantis.com/) 產品線經理 Craig Peters 透過利用 OpenStack 雲中已經存在的計算、儲存、網路和標識系統，在幾秒鐘內啟動了 Kubernetes 叢集，展示了社群應用程式目錄的工作流。

<!--
The entries in the catalog include not just the ability to [start a Kubernetes cluster](http://apps.openstack.org/#tab=murano-apps&asset=Kubernetes%20Cluster), but also a range of applications deployed in Docker containers managed by Kubernetes. These applications include:
-->
目錄中的條目不僅包括[啟動 Kubernetes 叢集](http://apps.openstack.org/#tab=murano-apps&asset=Kubernetes%20Cluster)的功能，還包括部署在 Kubernetes 管理的 Docker 容器中的一系列應用程式。這些應用包括：

<!--

-
Apache web server
-
Nginx web server
-
Crate - The Distributed Database for Docker
-
GlassFish - Java EE 7 Application Server
-
Tomcat - An open-source web server and servlet container
-
InfluxDB - An open-source, distributed, time series database
-
Grafana - Metrics dashboard for InfluxDB
-
Jenkins - An extensible open source continuous integration server
-
MariaDB database
-
MySql database
-
Redis - Key-value cache and store
-
PostgreSQL database
-
MongoDB NoSQL database
-
Zend Server - The Complete PHP Application Platform

-->


-
Apache web 伺服器
-
Nginx web 伺服器
-
Crate - Docker的分散式資料庫
-
GlassFish - Java EE 7 應用伺服器
-
Tomcat - 一個開源的 web 伺服器和 servlet 容器
-
InfluxDB - 一個開源的、分散式的、時間序列資料庫
-
Grafana -   InfluxDB 的度量儀表板
-
Jenkins - 一個可擴充套件的開放原始碼持續整合伺服器
-
MariaDB 資料庫
-
MySql 資料庫
-
Redis - 鍵-值快取和儲存
-
PostgreSQL 資料庫
-
MongoDB NoSQL 資料庫
-
Zend 伺服器 - 完整的 PHP 應用程式平臺

<!--
This list will grow, and is curated [here](https://opendev.org/x/k8s-docker-suite-app-murano/src/branch/master/Kubernetes). You can examine (and contribute to) the YAML file that tells Murano how to install and start the Kubernetes cluster [here](https://opendev.org/x/k8s-docker-suite-app-murano/src/branch/master/Kubernetes/KubernetesCluster/package/Classes/KubernetesCluster.yaml).
-->
此列表將會增長，並在[此處](https://opendev.org/x/k8s-docker-suite-app-murano/src/branch/master/Kubernetes)進行策劃。您可以檢查（並參與）YAML 檔案，該檔案告訴 Murano 如何根據[此處](https://opendev.org/x/k8s-docker-suite-app-murano/src/branch/master/Kubernetes/KubernetesCluster/package/Classes/KubernetesCluster.yaml)定義來安裝和啟動 ...apps/blob/master/Docker/Kubernetes/KubernetesCluster/package/Classes/KubernetesCluster.yaml)安裝和啟動 Kubernetes 叢集。

<!--
[The Kubernetes open source project](https://github.com/GoogleCloudPlatform/kubernetes) has continued to see fantastic community adoption and increasing momentum, with over 11,000 commits and 7,648 stars on GitHub. With supporters ranging from Red Hat and Intel to CoreOS and Box.net, it has come to represent a range of customer interests ranging from enterprise IT to cutting edge startups. We encourage you to give it a try, give us your feedback, and get involved in our growing community.
-->
[Kubernetes 開源專案](https://github.com/GoogleCloudPlatform/kubernetes)繼續受到社群的歡迎，並且勢頭越來越好，GitHub 上有超過 11000 個提交和 7648 顆星。從 Red Hat 和 Intel 到 CoreOS 和 Box.net，它已經代表了從企業 IT 到前沿創業企業的一系列客戶。我們鼓勵您嘗試一下，給我們您的反饋，並參與到我們不斷增長的社群中來。


<!--

- Martin Buhr, Product Manager, Kubernetes Open Source Project

-->

- Martin Buhr, Kubernetes 開源專案產品經理

