---
title: " How Watson Health Cloud Deploys Applications with Kubernetes "
date: 2017-07-14
slug: how-watson-health-cloud-deploys
url: /blog/2017/07/How-Watson-Health-Cloud-Deploys
author: >
   Sandhya Kapoor (IBM)
---
Today’s post is by [Sandhya Kapoor](https://www.linkedin.com/in/sandhyakapoor/), Senior Technologist, Watson Platform for Health, IBM



For more than a year, Watson Platform for Health at IBM deployed healthcare applications in virtual machines on our cloud platform. Because virtual machines had been a costly, heavyweight solution for us, we were interested to evaluate Kubernetes for our deployments.   


Our design was to set up the application and data containers in the same namespace, along with the required agents using sidecars, to meet security and compliance requirements in the healthcare industry.



I was able to run more processes on a single physical server than I could using a virtual machine. Also, running our applications in containers ensured optimal usage of system resources.



To orchestrate container deployment, we are using [IBM Cloud Kubernetes Service infrastructure](https://cloud.ibm.com/containers-kubernetes/landing), a Kubernetes implementation by IBM for automating deployment, scaling, and operations of application containers across clusters of hosts, providing container-centric infrastructure.



With Kubernetes, our developers can rapidly develop highly available applications by leveraging the power and flexibility of containers, and with integrated and secure volume service, we can store persistent data, share data between Kubernetes pods, and restore data when needed.



Here is a snapshot of Watson Care Manager, running inside a Kubernetes cluster:



 ![](https://lh4.googleusercontent.com/LeKfLOkNldqReFh47f2AuFU42dhvKDwDxac_Psil_bdZWldKY80ZZi4Rv3n0--jq8Mqq9qRFVa1AbLIt9TIPLLRVmon4DaBsltFYbUJikrOp0qcavJQ9XHjRL-A1yvWR6mTNayBP)



 ![](https://lh3.googleusercontent.com/EU3DgtFKagWp5S0UpKj-wRgx8WK2nvQ2BG-4dGio57pGNj42A7Lip9IARBba34hIm84-_7zwWt6iImQE8beSqLxpzXm-2w_84M_X2IHQ7jvpWtIDMF81hmq6N4hGSxp6DQoFW5qX)



Before deploying an app, a user must create a worker node cluster. I can create a cluster using the kubectl cli commands or create it from the [IBM Cloud](https://cloud.ibm.com/) dashboard.



Our clusters consist of one or more physical or virtual machines, also known as worker nodes, that are loosely coupled, extensible, and centrally monitored and managed by the Kubernetes master. When we deploy a containerized app, the Kubernetes master decides where to deploy the app, taking into consideration the deployment requirements and available capacity in the cluster.



A user makes a request to Kubernetes to deploy the containers, specifying the number of replicas required for high availability. The Kubernetes scheduler decides where the [pods](/docs/concepts/workloads/pods/pod/) (groups of one or more containers) will be scheduled and which worker nodes they will be deployed on, storing this information internally in Kubernetes and [etcd](https://github.com/coreos/etcd#etcd). The deployment of pods in worker nodes is updated based on load at runtime, optimizing the placement of pods in the cluster.



Kubelet running in each worker node regularly polls the kube API server. If there is new work to do, kubelet pulls the configuration information and takes action, for example, spinning off a new pod.



Process Flow:

| ![](https://lh6.googleusercontent.com/jckmDLJIsy6m8Dxj6GZ6yv5vmQqrZXAi42eJz8iIefl2A87LXoRJUubCkSh05Ptaojt_faEFq4G6UMfZZYVOUiaEzt8Erp51xbyRWW_08qn9vvz-WvztBNlrG431YgI6880-ZULO) |
| UCD –&nbsp;IBM UrbanCode Deploy is a tool for automating application deployments through your environments. WH Cluster – Kubernetes worker node. |



Usage of GitLab in the Process Flow:

We stored all our artifacts in GitLab, which includes the Docker files that are required for creating the image, YAML files needed to create a pod, and the configuration files to make the Healthcare application run.



GitLab and Jenkins interaction in the Process Flow:

We use Jenkins for continuous integration and build automation to create/pull/retag the Docker image and push the image to a Docker registry in the cloud.



Basically, we have a Jenkins job configured to interact with GitLab project to get the latest artifacts and, based on requirements, it will either create a new Docker image from scratch by pulling the needed intermediate images from Docker/Bluemix repository or update the Docker image.



After the image is created/updated the Jenkins job pushes the image to a Bluemix repository to save the latest image to be pulled by UrbanCode Deploy (UCD) component.



Jenkins and UCD interaction in the Process Flow:

The Jenkins job is configured to use the UCD component and its respective application, application process, and the UCD environment to deploy the application. The Docker image version files that will be used by the UCD component are also passed via Jenkins job to the UCD component.



Usage of UCD in the Process Flow:

UCD is used for deployment and the end-to end deployment process is automated here. UCD component process involves the following steps:

- Download the required artifacts for deployment from the Gitlab.
- Login to Bluemix and set the KUBECONFIG based on the Kubernetes cluster used for creating the pods.
- Create the application pod in the cluster using kubectl create command.
- If needed, run a rolling update to update the existing pod.



 ![](https://lh4.googleusercontent.com/laBRZK_ifwLXGkLL8fl0fZbUmm-HI4nC-tUNIFAy2wg4UHQT97reKyNOrNydYS8PmnhgqsBQctYCLTjJF12KR_uuVUdqiNx-B1OP1YrBwL2vi5SlEO9RSFQEbs-X6FoMHw0QK53A)



Deploying the application in IBM Cloud Kubernetes Service:



Provision a cluster in IBM Cloud Kubernetes Service with \<x\> worker nodes. Create Kubernetes controllers for deploying the containers in worker nodes, the IBM Cloud Kubernetes Service infrastructure pulls the Docker images from IBM Cloud Container Registry to create containers. We tried deploying an application container and running a logmet agent (see Reading and displaying logs using logmet container, below) inside the containers that forwards the application logs to an IBM Cloud logging service. As part of the process, YAML files are used to create a controller resource for the UrbanCode Deploy (UCD). UCD agent is deployed as a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) controller, which is used to connect to the UCD server. The whole process of deployment of application happens in UCD. To support the application for public access, we created a service resource to interact between pods and access container services. For storage support, we created persistent volume claims and mounted the volume for the containers.



| ![](https://lh6.googleusercontent.com/iFKlbBX8rjWTuygIfjImdxP8R7xXuvaaoDwldEIC3VRL03XIehxagz8uePpXllYMSxoyai5a6N-0NB4aTGK9fwwd8leFyfypxtbmaWBK-b2Kh9awcA76-_82F7ZZl7lgbf0gyFN7) |
| UCD: IBM UrbanCode Deploy is a tool for automating application deployments through your environments. IBM Cloud Kubernetes Service: Kubernetes implementation of IBM. WH Docker Registry: Docker Private image registry. Common agent containers: We expect to configure our services to use the WHC mandatory agents. We deployed all ion containers. |



Reading and displaying logs using logmet container:



Logmet is a cloud logging service that helps to collect, store, and analyze an application’s log data. It also aggregates application and environment logs for consolidated application or environment insights and forwards them. Metrics are transmitted with collectd. We chose a model that runs a logmet agent process inside the container. The agent takes care of forwarding the logs to the cloud logging service configured in containers.



The application pod mounts the application logging directory to the storage space, which is created by persistent volume claim, and stores the logs, which are not lost even when the pod dies. Kibana is an open source data visualization plugin for Elasticsearch. It provides visualization capabilities on top of the content indexed on an Elasticsearch cluster.

 ![](https://lh3.googleusercontent.com/Fat60VoOQ6CBxHgAdva9Xwcu1X4coZFlld1eS7ZrB4MbTR9HbwyuXgQ6CncXxeZ_mWqWzpTatB7bOB199QCcCaY8905yAqzMO0-Rx4NNnYj94uXHEy_dwLbLVFQJvQTu8cGW8HSz)



Exposing services with Ingress:



[Ingress controllers](/docs/concepts/services-networking/ingress/#ingress-controllers) are reverse proxies that expose services outside cluster through URLs. They act as an external HTTP load balancer that uses a unique public entry point to route requests to the application.



To expose our services to outside the cluster, we used Ingress. In IBM Cloud Kubernetes Service, if we create a paid cluster, an Ingress controller is automatically installed for us to use. We were able to access services through Ingress by creating a YAML resource file that specifies the service path.


- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
