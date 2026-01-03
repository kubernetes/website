---
title: " The Growing Kubernetes Ecosystem "
date: 2015-07-24
slug: the-growing-kubernetes-ecosystem
url: /blog/2015/07/The-Growing-Kubernetes-Ecosystem
author: >
   Martin Buhr (Google)
---
Over the past year, we’ve seen fantastic momentum in the Kubernetes project, culminating with the release of [Kubernetes v1][4] earlier this week. We’ve also witnessed the ecosystem around Kubernetes blossom, and wanted to draw attention to some of the cooler offerings we’ve seen.


| ----- |
|

![][5]

 |

[CloudBees][6] and the Jenkins community have created a Kubernetes plugin, allowing Jenkins slaves to be built as Docker images and run in Docker hosts managed by Kubernetes, either on the Google Cloud Platform or on a more local Kubernetes instance. These elastic slaves are then brought online as Jenkins schedules jobs for them and destroyed after their builds are complete, ensuring masters have steady access to clean workspaces and minimizing builds’ resource footprint.

 |  
|

![][7]

 |

[CoreOS][8] has created launched Tectonic, an opinionated enterprise distribution of Kubernetes, CoreOS and Docker. Tectonic includes a management console for workflows and dashboards, an integrated registry to build and share containers, and additional tools to automate deployment and customize rolling updates. At KuberCon, CoreOS launched Tectonic Preview, giving users easy access to Kubernetes 1.0, 24x7 enterprise ready support, Kubernetes guides and Kubernetes training to help enterprises begin experiencing the power of Kubernetes, CoreOS and Docker.

 |  
|

![][9]

 |

[Hitachi Data Systems][10] has announced that Kubernetes now joins the list of solutions validated to run on their enterprise Unified Computing Platform. With this announcement Hitachi has validated Kubernetes and VMware running side-by-side on the UCP platform, providing an enterprise solution for container-based applications and traditional virtualized workloads.

 |  
|

![][11]

 |

[Kismatic][12] is providing enterprise support for pure play open source Kubernetes. They have announced open source and commercially supported Kubernetes plug-ins specifically built for production-grade enterprise environments. Any Kubernetes deployment can now benefit from modular role-based access controls (RBAC), Kerberos for bedrock authentication, LDAP/AD integration, rich auditing and platform-agnostic Linux distro packages.

 |  
|

![][13]

 |

[Meteor Development Group][14], creators of Meteor, a JavaScript App Platform, are using Kubernetes to build [Galaxy][14] to run Meteor apps in production. Galaxy will scale from free test apps to production-suitable high-availability hosting.

 |  
|

![][15]

 |

Mesosphere has incorporated Kubernetes into its Data Center Operating System (DCOS) platform as a first class citizen. Using DCOS, enterprises can deploy Kubernetes across thousands of nodes, both bare-metal and virtualized machines that can run on-premise and in the cloud.  Mesosphere also launched a beta of their [Kubernetes Training Bootcamp][16] and will be offering more in the future.

 |  
|

![][17]

 |

[Mirantis][18] is enabling hybrid cloud applications across OpenStack and other clouds supporting Kubernetes. An OpenStack Murano app package supports full application lifecycle actions such as deploy, create cluster, create pod, add containers to pods, scale up and scale down.

 |  
|

![][19]

 |

[OpenContrail][20] is creating a kubernetes-contrail plugin designed to stitch the cluster management capabilities of Kubernetes with the network service automation capabilities of OpenContrail. Given the event-driven abstractions of pods and services inherent in Kubernetes, it is a simple extension to address network service enforcement by leveraging OpenContrail’s Virtual Network policy approach and programmatic API’s.

 |  
|

![logo.png][21]

 |

[Pachyderm][22] is a containerized data analytics engine which provides the broad functionality of Hadoop with the ease of use of Docker. Users simply provide containers with their data analysis logic and Pachyderm will distribute that computation over the data. They have just released full deployment on Kubernetes for on premise deployments, and on Google Container Engine, eliminating all the operational overhead of running a cluster yourself.  

 |  
|

![][23]

 |

[Platalytics, Inc][24]. and announced the release of one-touch deploy-anywhere feature for its Spark Application Platform. Based on Kubernetes, Docker, and CoreOS, it allows simple and automated deployment of Apache Hadoop, Spark, and Platalytics platform, with a single click, to all major public clouds, including Google, Amazon, Azure, DigitalOcean, and private on-premise clouds. It also enables hybrid cloud scenarios, where resources on public and private clouds can be mixed.

 |  
|

![][25]

 |

[Rackspace][26] has created Corekube as a simple, quick way to deploy Kubernetes on OpenStack. By using a decoupled infrastructure that is coordinated by etcd, fleet and flannel, it enables users to try Kubernetes and CoreOS without all the fuss of setting things up by hand.

 |  
|

![][27]

 |

[Red Hat][28] is a long time proponent of Kubernetes, and a significant contributor to the project. In their own words, “From Red Hat Enterprise Linux 7 and Red Hat Enterprise Linux Atomic Host to OpenShift Enterprise 3 and the forthcoming Red Hat Atomic Enterprise Platform, we are well-suited to bring container innovations into the enterprise, leveraging Kubernetes as the common backbone for orchestration.”

 |  
|

![][29]

 |

[Redapt][30] has launching a variety of turnkey, on-premises Kubernetes solutions co-engineered with other partners in the Kubernetes partner ecosystem. These include appliances built to leverage the CoreOS/Tectonic, Mirantis OpenStack, and Mesosphere platforms for management and provisioning. Redapt also offers private, public, and multi-cloud solutions that help customers accelerate their Kubernetes deployments successfully into production.

 |

| ----- |
|



 |   
 |

We’ve also seen a community of services partners spring up to assist in adopting Kubernetes and containers:  



| ----- |
|

![Screen Shot 2015-07-21 at 1.12.16 PM.png][31]

 |



[Biarca][32] is using Kubernetes to ease application deployment and scale on demand across available hybrid and multi-cloud clusters through strategically managed policy. A video on their website illustrates how to use Kubernetes to deploy applications in a private cloud infrastructure based on OpenStack and use a public cloud like GCE to address bursting demand for applications.

 |  
|

![][33]

 |

[Cloud Technology Partners][34] has developed a Container Services Offering featuring Kubernetes to assist enterprises with container best practices, adoption and implementation. This offering helps organizations understand how containers deliver competitive edge.  

 |  
|

![][35]

 |

[DoIT International][36] is offering a Kubernetes Bootcamp which consists of a series of hands-on exercises interleaved with mini-lectures covering hands on topics such as Container Basics, Using Docker, Kubernetes and Google Container Engine.

 |  
|

![][37]

 |

[OpenCredo][38] provides a practical, lab style container and scheduler course in addition to consulting and solution delivery.  The three-day course allows development teams to quickly ramp up and make effective use of containers in real world scenarios, covering containers in general along with Docker and Kubernetes.

|  
|

![][39]

 |

[Pythian][40] focuses on helping clients design, implement, and manage systems that directly contribute to revenue and business success. They provide small, [dedicated teams of highly trained and experienced data experts][41] have the deep Kubernetes and container experience necessary to help companies solve Big Data problems with containers.

 |


 [1]: https://lh4.googleusercontent.com/2dJvY1Cl9i6SQ8apKARcisvFZPDYY5LltIsmz3W-jmon7DFE4p7cz3gsBPuz9KM_LSiuwx1xIPYr9Ygm5DTQ2f-DUyWsg7zs7YL7O3JMCHQ8Ji4B3EGpx26fbF_glQPPPp4RQTE
[2]: http://blog.cloudbees.com/2015/07/on-demand-jenkins-slaves-with.html
[3]: https://lh4.googleusercontent.com/vC0B6UWRaxOq9ar-7naIX9HNs9ANfq8f5VTP-MpIOpRTxHeE7kMDAcmswsDF6SVsd_xtRa7Kr2z3wJCXbGj2Lp6fp7pfhaWd5bHuA9_cYHhvY1WmQEjXHdPZxYzwBqExAmtTdiA
[4]: https://tectonic.com/
[5]: https://lh6.googleusercontent.com/Y6MY5k_Eq6CddNzfRrRo14kLuJwe1KYtJq_7KcIGy1bRf65KwoX1uAuCBwEL0P_FGSomZPQZ-hs7CG8Vze7qDKsISZrLEyRZkm5OSHngjjXfCItCiMXI3FtnD9iyDvYurd5sRXQ
[6]: https://www.hds.com/corporate/press-analyst-center/press-releases/2015/gl150721.html
[7]: https://lh4.googleusercontent.com/iHZAfjvGPHYsIwUgevTTPN74fBU53Y1qdwq9hUsIixLWIbbv7P_02CQR6V5LPi4n4BCeg1LK3g5Iaizpkm5dXCmI7TdYKEaC7H2wLa9tzSkp8TyR93U1SilcGvpLDlzPLWhY664
[8]: https://www.kismatic.com/
[9]: https://lh5.googleusercontent.com/kTu3RRmc1LH1vgdHQeCibALfJJCxE9JR5ZRE30xAn_bphO_uk-2n3RRolw3Yrb1uheyXMQRsH8ps7v3mrvhjkJo0f2ye7unVd1PT0trv8cE5VP1Pnq5P4oUx6m7DWKANZyyBnsg
[10]: http://info.meteor.com/blog/meteor-and-a-galaxy-of-containers-with-kubernetes
[11]: https://lh5.googleusercontent.com/H1r-80pX8-ixDHCJDBKLWkNA1keMUvjv058e87-B80Wr8LSxP7SjSXc-5ru3MT4k18zYxl0L8aqJv3aylx8UYNGAXEmCCuHKwjZ4Z5tbG-LFCTiyRVdrlVUukHhi8QtsbuR1u3c
[12]: https://mesosphere.com/training/kubernetes/
[13]: https://lh6.googleusercontent.com/7BkcAAf9SoEDyzjgGsNg_YVi8cRb1mdPHsc4FtK7JQkl2iVR_zIy9wkDPT7bls-z7FhgTIekAj1Z7q6Y_4oaZ2OLygkHxPmxZ3MNnkI4f8C78cjyk2gvt40Yk-m3_VSt8sIXz2Q
[14]: https://www.mirantis.com/blog/kubernetes-docker-mirantis-openstack-6-1/
[15]: https://lh6.googleusercontent.com/Zi_nKEcB6uWZYXMOBStKPFLkHIXQn2FsnFP4ab2BFeBbUWv-d1oEBLQos-OpYpfwO3mao6xGusvX9O1JiyL4357XJBsmTXmcSnTnrBXCBOxJkB1uhOjntfAv8fN2YjZ6ITK53YU
[16]: http://www.opencontrail.org/opencontrail-kubernetes-integration/
[17]: https://lh5.googleusercontent.com/F9dS-UFz8L50xoj8jCjgUvOo-r3pNLs4cEGRczHu5mD8YdMgnJctyzBuWQ0LmZeBB3cDHc1LB_4kHZDmjuP6KGr_n3W8Q0fGbBHxinRZggdMC0NDDWl-xDwy68GO6qotJr2JcOA
[18]: http://pachyderm.io/
[19]: https://lh6.googleusercontent.com/dXhnvnlWtL9-oTd_irtLYTu8g78l9-LKj9PwjV5v4mpvGcPh4GQlHeQZpnIMJGwEyBxagut94Onagb0GsVJuVx10VVp-GHZ0vG_Z-jbxthLHhuzhQaBSFfA9pfoOI3cl6Rh7Hk4
[20]: http://www.platalytics.com/
[21]: https://lh3.googleusercontent.com/0EQQc3sjVbw1cEYVeT0S5rT1iPLEMHteiKlSMDNqw8lNVOf4vG5qE6pVfvmZlRcg-NoOABC-mMcMSdD8ayrmpok0T91N15QqqmH378ydxK1843dcuJdtEsCnr1Y_RQQo-hWrBfI
[22]: https://github.com/metral/corekube
[23]: https://lh4.googleusercontent.com/qxQciTVBkyYDWeSgoxtg7InxQuuXsGSLBDfdxJB9Czo71BzQN5bUugLZhQKkERHqWAnkqHIY2VWi2J7g-pGn4V4AzPE0alBksedou78r0KMZm4QqYTN8QYHIMo4RtVmdw90azYw
[24]: http://www.redhat.com/en/about/blog/welcoming-kubernetes-officially-enterprise-open-source-world
[25]: https://lh3.googleusercontent.com/0EQQc3sjVbw1cEYVeT0S5rT1iPLEMHteiKlSMDNqw8lNVOf4vG5qE6pVfvmZlRcg-NoOABC-mMcMSdD8ayrmpok0T91N15QqqmH378ydxK1843dcuJdtEsCnr1Y_RQQo-hWrBfI
[26]: https://github.com/metral/corekube
[27]: https://lh4.googleusercontent.com/qxQciTVBkyYDWeSgoxtg7InxQuuXsGSLBDfdxJB9Czo71BzQN5bUugLZhQKkERHqWAnkqHIY2VWi2J7g-pGn4V4AzPE0alBksedou78r0KMZm4QqYTN8QYHIMo4RtVmdw90azYw
[28]: http://www.redhat.com/en/about/blog/welcoming-kubernetes-officially-enterprise-open-source-world
[29]: https://lh5.googleusercontent.com/8FfYhnwb__NUuoXEC-tNzuAuA6rFGz6IgQnVYh-fQ89i685-3t_2UjN291S-VZAAkyrPJ-MaAPMr36uV0PLWlv_GE1aE99shx_XzrEi4c8OKcEkiRs3z_tsB20w5ZiZ7UeZgzT8
[30]: http://www.redapt.com/kubernetes/%20%E2%80%8E
[31]: https://lh3.googleusercontent.com/dOHU9NjLGrG6UgGuNjvhuR5oDkrR5z1AZ0sM8BkLgaMuXY7pfDev8ukVbD1nrBeRj9LKryJcoGEvhZSo_dHIP8ahHIkAWqsT_QSOoiu7rfM9WX3lubCI4N1WKmE7yrRquaL7nAc
[32]: http://biarca.io/building-distributed-multi-cloud-applications-using-kubernetes-and-containers/
[33]: https://lh3.googleusercontent.com/Ac0FiR1FJ4tfp90zBVX7fr36BAVxUqRW7VIOFw12Rp6BzHRR0x_BwTfbaheXLYSYMuPZouf4huql04Uu9fVEn956b7BWIUcTzUgWuB5JYSFawwrP_AA6uzdOHZAQ2aROo1vhm1s
[34]: http://www.cloudtp.com/container-adoption-services/
[35]: https://lh6.googleusercontent.com/tBtFRPzI6OAPKvaak9X3QWcrzGuBsrk1szFGi-Bq3EQweBo6nZ0Qmwxk9EwLZ9ItP9-1Zip4rxtwtFa0ILylO1CySuOa1qLcO2ab0yJCN1SCe-r_BNPX8hD5Qigxb7sqqXgx09A
[36]: http://doit-intl.com/kubernetes
[37]: https://lh3.googleusercontent.com/qO2YK7IxIVPpIsdN0Ry7B5zc_cdzfZb6DlgAJWpy-VJajL84m3u2nyo3-6QRZ_wFCY0-r4ryltiT4j1D_y_BeguxGXWap2YlSfdqyYAIbi2__p0uLXymtYkAu5VFVfA___eMbUY
[38]: https://www.opencredo.com/2015/04/20/kubernetes/
[39]: https://lh5.googleusercontent.com/XgMDUbRt_UKn4v4D7roz4mpE4qqUYpLI2c9460vt65yXrLxhcrM3rmH9Xcg-C0RMylhRxTWIMFInHYLN1O9v9FZ1NoUVI6ynsmoAQUGMN1Nc27jhXzIRiRXwWzx_HOH5TtX3NaE
[40]: http://www.pythian.com/google-kubernetes/
[41]: http://www.pythian.com/blog/lessons-learned-kubernetes/
