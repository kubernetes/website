---
title: " Inside JD.com's Shift to Kubernetes from OpenStack "
date: 2017-02-10
slug: inside-jd-com-shift-to-kubernetes-from-openstack
url: /blog/2017/02/Inside-Jd-Com-Shift-To-Kubernetes-From-Openstack
---
_Editor's note: Today’s post is by the Infrastructure Platform Department team at JD.com about their transition from OpenStack to Kubernetes. JD.com is one of China’s largest companies and the first Chinese Internet company to make the Global Fortune 500 list._  


[![](https://upload.wikimedia.org/wikipedia/en/7/79/JD_logo.png)](https://upload.wikimedia.org/wikipedia/en/7/79/JD_logo.png)


**History of cluster building**  

**The era of physical machines (2004-2014)**  

Before 2014, our company's applications were all deployed on the physical machine. In the age of physical machines, we needed to wait an average of one week for the allocation to application coming on-line. Due to the lack of isolation, applications would affected each other, resulting in a lot of potential risks. At that time, the average number of tomcat instances on each physical machine was no more than nine. The resource of physical machine was seriously wasted and the scheduling was inflexible. The time of application migration took hours due to the breakdown of physical machines. And the auto-scaling cannot be achieved. To enhance the efficiency of application deployment, we developed compilation-packaging, automatic deployment, log collection, resource monitoring and some other systems.  

**Containerized era (2014-2016)**  

The Infrastructure Platform Department ([IPD](https://github.com/ipdcode)) led by Liu Haifeng--Chief Architect of JD.COM, sought a new resolution in the fall of 2014. Docker ran into our horizon. At that time, docker had been rising, but was slightly weak and lacked of experience in production environment. We had repeatedly tested docker. In addition, docker was customized to fix a couple of issues, such as system crash caused by device mapper and some Linux kernel bugs. We also added plenty of new features into docker, including disk speed limit, capacity management, and layer merging in image building and so on.  

To manage the container cluster properly, we chose the architecture of OpenStack + Novadocker driver. Containers are managed as virtual machines. It is known as the first generation of JD container engine platform--JDOS1.0 (JD Datacenter Operating System). The main purpose of JDOS 1.0 is to containerize the infrastructure. All applications run in containers rather than physical machines since then. As for the operation and maintenance of applications, we took full advantage of existing tools. The time for developers to request computing resources in production environment reduced to several minutes rather than a week. After the pooling of computing resources, even the scaling of 1,000 containers would be finished in seconds. Application instances had been isolated from each other. Both the average deployment density of applications and the physical machine utilization had increased by three times, which brought great economic benefits.  

We deployed clusters in each IDC and provided unified global APIs to support deployment across the IDC. There are 10,000 compute nodes at most and 4,000 at least in a single OpenStack distributed container cluster in our production environment. The first generation of container engine platform (JDOS 1.0) successfully supported the “6.18” and “11.11” promotional activities in both 2015 and 2016. There are already 150,000 running containers online by November 2016.  

_“6.18” and “11.11” are known as the two most popular online promotion of JD.COM, similar to the black Friday promotions. Fulfilled orders in November 11, 2016 reached 30 million.&nbsp;_  

In the practice of developing and promoting JDOS 1.0, applications were migrated directly from physical machines to containers. Essentially, JDOS 1.0 was an implementation of IaaS. Therefore, deployment of applications was still heavily dependent on compilation-packaging and automatic deployment tools. However, the practice of JDOS1.0 is very meaningful. Firstly, we successfully moved business into containers. Secondly, we have a deep understanding of container network and storage, and know how to polish them to the best. Finally, all the experiences lay a solid foundation for us to develop a brand new application container platform.  

**New container engine platform (JDOS 2.0)**  

**Platform architecture**  

When JDOS 1.0 grew from 2,000 containers to 100,000, we launched a new container engine platform (JDOS 2.0). The goal of JDOS 2.0 is not just an infrastructure management platform, but also a container engine platform faced to applications. On the basic of JDOS 1.0 and Kubernetes, JDOS 2.0 integrates the storage and network of JDOS 1.0, gets through the process of CI/CD from the source to the image, and finally to the deployment. Also, JDOS 2.0 provides one-stop service such as log, monitor, troubleshooting, terminal and orchestration. The platform architecture of JDOS 2.0 is shown below.  



 ![D:\百度云同步盘\徐新坤-新人培训计划\docker\MAE\分享\arc.png](https://lh3.googleusercontent.com/Hs2DAPmZIbqGrWK8oZvBGBJzZbSwLHry7_go0PmCQFCoB_nEjidMOwD8pHlLjqXHqGXXu140RT4EXQq7OX-qgNHQci1G-0-nEavRxha-L02RFmR9WyKp3sHCuxY2qFWmnz0UIVfpfGL_ZLsQAA)


|Function |Product |
|---|---|
|Source Code Management |Gitlab |
|Container Tool |Docker |
|Container Networking |Cane |
|Container Engine |Kubernetes |
|Image Registry |Harbor |
|CI Tool |Jenkins |
|Log Management |Logstash + Elastic Search |
|Monitor |Prometheus |


In JDOS 2.0, we define two levels, system and application. A system consists of several applications and an application consists of several Pods which provide the same service. In general, a department can apply for one or more systems which directly corresponds to the namespace of Kubernetes. This means that the Pods of the same system will be in the same namespace.  

Most of the JDOS 2.0 components (GitLab / Jenkins / Harbor / Logstash / Elastic Search / Prometheus) are also containerized and deployed on the Kubernetes platform.  

**One Stop Solution**  



 ![D:\百度云同步盘\徐新坤-新人培训计划\docker\MAE\分享\cicd.png](https://lh4.googleusercontent.com/s3hP_s27l4FiV1rR0dcJEg4dAZL9caJbk-kiDnZyfykt5ldXdcsfxlDEdneZJA9L8sPzOvxJI8WyZV0Cm1CI_b_oABKzBwazoEe86yCd9E75Dm0UBfRU2AgzYYzJ5ukxBIME977-mT9GA6XTGw)




1. 1.JDOS 2.0 takes docker image as the core to implement continuous integration and continuous deployment.
2. 2.Developer pushes code to git.
3. 3.Git triggers the jenkins master to generate build job.
4. 4.Jenkins master invokes Kubernetes to create jenkins slave Pod.
5. 5.Jenkins slave pulls the source code, compiles and packs.
6. 6.Jenkins slave sends the package and the Dockerfile to the image build node with docker.
7. 7.The image build node builds the image.
8. 8.The image build node pushes the image to the image registry Harbor.
9. 9.User creates or updates app Pods in different zone.

The docker image in JDOS 1.0 consisted primarily of the operating system and the runtime software stack of the application. So, the deployment of applications was still dependent on the auto-deployment and some other tools. While in JDOS 2.0, the deployment of the application is done during the image building. And the image contains the complete software stack, including App. With the image, we can achieve the goal of running applications as designed in any environment.  

 ![D:\百度云同步盘\徐新坤-新人培训计划\docker\MAE\分享\image.png](https://lh4.googleusercontent.com/dL9knSIAFBdaOQvIGRt8wUntzPQnV7J0Y4O8osNwQhC2N3O2cPKDA3b64THn0sorPOXXIuldc_tXJMv1dcanhdKf1wk0MfKbxpv_BLeTxo5B1CehgSX66XHYx7BrAeiGt7qFulytO9W5K9JfXg)  



**Networking and External Service Load Balancing**



JDOS 2.0 takes the network solution of JDOS 1.0, which is implemented with the VLAN model of OpenStack Neutron. This solution enables highly efficient communication between containers, making it ideal for a cluster environment within a company. Each Pod occupies a port in Neutron, with a separate IP. Based on the Container Network Interface standard ([CNI](https://github.com/containernetworking/cni)) standard, we have developed a new project Cane for integrating kubelet and Neutron.



 ![D:\百度云同步盘\徐新坤-新人培训计划\docker\MAE\分享\network.png](https://lh6.googleusercontent.com/KV37EdZE0MDzNllUVlvaQYOEgDiS72UmHwPs6o2jj7LB7gL0ptTjxDxfjA9Vi6X-2xTBwsxfLgo6iJnt1P2_C9KHwKYe8bniclL5UsFRhdw0g0Ylr7MAPTSg1a3LQsEtN7eLoNsnl8NENBDETQ)





At the same time, Cane is also responsible for the management of LoadBalancer in Kubernetes service. When a LoadBalancer is created / deleted / modified, Cane will call the creating / removing / modifying interface of the lbaas service in Neutron. In addition, the Hades component in the Cane project provides an internal DNS resolution service for the Pods.  

_The source code of the&nbsp;Cane project is currently being finished and will be released on GitHub soon._  



**Flexible Scheduling**





[![D:\百度云同步盘\徐新坤-新人培训计划\docker\MAE\分享\schedule.png](https://lh6.googleusercontent.com/P6aA1V-ND_i0l6flYQ1TFvjq651FpUznfLRrL6VqmnMYLdP_WUhDDICq9J0d2gcIu16I0Bz2KLAJnfk4RQ1tv1MuKj_hfF6cLdh5JVktH1xFmbFnsNus3anpL7q5NK8WAS0JQFz6cNT32S72Yg)](https://lh6.googleusercontent.com/P6aA1V-ND_i0l6flYQ1TFvjq651FpUznfLRrL6VqmnMYLdP_WUhDDICq9J0d2gcIu16I0Bz2KLAJnfk4RQ1tv1MuKj_hfF6cLdh5JVktH1xFmbFnsNus3anpL7q5NK8WAS0JQFz6cNT32S72Yg)JDOS 2.0 accesses applications, including big data, web applications, deep learning and some other types, and takes more diverse and flexible scheduling approaches. In some IDCs, we experimentally mixed deployment of online tasks and offline tasks. Compared to JDOS 1.0, overall resource utilization increased by about 30%.



**Summary**



The rich functionality of Kubernetes allows us to pay more attention to the entire ecosystem of the platform, such as network performance, rather than the platform itself. In particular, the SREs highly appreciated the functionality of replication controller. With it, the scaling of the applications is achieved in several seconds. JDOS 2.0 now has accessed about 20% of the applications, and deployed 2 clusters with about 20,000 Pods running daily. We plan to access more applications of our company, to replace the current JDOS 1.0. And we are also glad to share our experience in this process with the community.



Thank you to all the contributors of Kubernetes and the other open source projects.




_--Infrastructure Platform Department team at JD.com_  


- Get involved with the Kubernetes project on&nbsp;[GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on&nbsp;[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- [Download](http://get.k8s.io/) Kubernetes
- Connect with the community on&nbsp;[Slack](http://slack.k8s.io/)
- Follow us on Twitter&nbsp;[@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
