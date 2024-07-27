---
title: " Kubernetes Containers Logging and Monitoring with Sematext "
date: 2016-11-18
slug: kubernetes-containers-logging-monitoring-with-sematext
url: /blog/2016/11/Kubernetes-Containers-Logging-Monitoring-With-Sematext
author: >
  Stefan Thies (Sematext)
---

Managing microservices in containers is typically done with Cluster Managers and Orchestration tools. Each container platform has a slightly different set of options to deploy containers or schedule tasks on each cluster node. Because we do [container monitoring and logging](http://sematext.com/kubernetes) at Sematext, part of our job is to share our knowledge of these tools, especially as it pertains to container observability and devops. Today we’ll show a tutorial for Container Monitoring and Log Collection on Kubernetes.  

**Dynamic Deployments Require Dynamic Monitoring**  

The high level of automation for the container and microservice lifecycle makes the monitoring of Kubernetes more challenging than in more traditional, more static deployments. Any static setup to monitor specific application containers would not work because Kubernetes makes its own decisions according to the defined deployment rules. It is not only the deployed microservices that need to be monitored. It is equally important to watch metrics and logs for Kubernetes core services themselves, such as Kubernetes Master running etcd, controller-manager, scheduler and apiserver and Kubernetes Workers (fka minions) running kubelet and proxy service. Having a centralized place to keep an eye on all these services, their metrics and logs helps one spot problems in the cluster infrastructure. Kubernetes core services could be installed on bare metal, in virtual machines or as containers using Docker. Deploying Kubernetes core services in containers could be helpful with deployment and monitoring operations - tools for container monitoring would cover both core services and application containers. So how does one monitor such a complex and dynamic environment?  

**Agent for Kubernetes Metrics and Logs**  

There are a number of [open source docker monitoring and logging projects](https://sematext.com/blog/2016/07/19/open-source-docker-monitoring-logging/) one can cobble together to build a monitoring and log collection system (or systems). The advantage is that the code is all free. The downside is that this takes times - both initially when setting it up and later when maintaining. That’s why we built [Sematext Docker Agent](http://sematext.com/docker) - a modern, Docker-aware metrics, events, and log collection agent. It runs as a tiny container on every Docker host and collects logs, metrics and events for all cluster nodes and all containers. It discovers all containers (one pod might contain multiple containers) including containers for Kubernetes core services, if core services are deployed in Docker containers. Let’s see how to deploy this agent.  

**Deploying Agent to all Kubernetes Nodes **  

Kubernetes provides [DaemonSets](http://kubernetes.io/v1.1/docs/admin/daemons.html), which ensure pods are added to nodes as nodes are added to the cluster. We can use this to easily deploy Sematext Agent to each cluster node!  
Configure Sematext Docker Agent for Kubernetes  
Let’s assume you’ve created an SPM app for your Kubernetes metrics and events, and a Logsene app for your Kubernetes logs, each of which comes with its own token. The Sematext Docker Agent [README](https://github.com/sematext/sematext-agent-docker) lists all configurations (e.g. filter for specific pods/images/containers), but we’ll keep it simple here.  


- Grab the latest sematext-agent-daemonset.yml (raw plain-text) template (also shown below)
- Save it somewhere on disk
- Replace the SPM\_TOKEN and LOGSENE\_TOKEN placeholders with your SPM and Logsene App tokens

```
apiVersion: extensions/v1beta1  
kind: DaemonSet  
metadata:  
  name: sematext-agent  
spec:  
  template:  
    metadata:  
      labels:  
        app: sematext-agent  
    spec:  
      selector: {}  
      dnsPolicy: "ClusterFirst"  
      restartPolicy: "Always"  
      containers:  
      - name: sematext-agent  
        image: sematext/sematext-agent-docker:latest  
        imagePullPolicy: "Always"  
        env:  
        - name: SPM\_TOKEN  
          value: "REPLACE THIS WITH YOUR SPM TOKEN"  
        - name: LOGSENE\_TOKEN  
          value: "REPLACE THIS WITH YOUR LOGSENE TOKEN"  
        - name: KUBERNETES  
          value: "1"  
        volumeMounts:  
          - mountPath: /var/run/docker.sock  
            name: docker-sock  
          - mountPath: /etc/localtime  
            name: localtime  
      volumes:  
        - name: docker-sock  
          hostPath:  
            path: /var/run/docker.sock  
        - name: localtime  
          hostPath:  
            path: /etc/localtime
 ```



**Run Agent as DaemonSet**



Activate Sematext Agent Docker with _kubectl_:



```
\> kubectl create -f sematext-agent-daemonset.yml

daemonset "sematext-agent-daemonset" created
 ```



Now let’s check if the agent got deployed to all nodes:



```
\> kubectl get pods

NAME                   READY     STATUS              RESTARTS   AGE

sematext-agent-nh4ez   0/1       ContainerCreating   0          6s

sematext-agent-s47vz   0/1       ImageNotReady       0          6s
 ```



The status “ImageNotReady” or “ContainerCreating” might be visible for a short time because Kubernetes must download the image for sematext/sematext-agent-docker first. The setting imagePullPolicy: "Always" specified in sematext-agent-daemonset.yml makes sure that Sematext Agent gets updated automatically using the image from Docker-Hub.

If we check again we’ll see Sematext Docker Agent got deployed to (all) cluster nodes:



```
\> kubectl get pods -l sematext-agent

NAME                   READY     STATUS    RESTARTS   AGE

sematext-agent-nh4ez   1/1       Running   0          8s

sematext-agent-s47vz   1/1       Running   0          8s
 ```



Less than a minute after the deployment you should see your Kubernetes metrics and logs! Below are screenshots of various out of the box reports and explanations of various metrics’ meanings.



**Interpretation of Kubernetes Metrics**



The metrics from all Kubernetes nodes are collected in a single SPM App, which aggregates metrics on several levels:

- Cluster - metrics aggregated over all nodes displayed in SPM overview
- Host / node level - metrics aggregated per node
- Docker Image level - metrics aggregated by image name, e.g. all nginx webserver containers
- Docker Container level - metrics aggregated for a single container



| ![](https://lh3.googleusercontent.com/THk0zW4Q2YUxPF7pcdcg8WVbut4_BZPFsHuqtBet3AnijJ84w8TYGmNQ5F_CCmOz3W7_DWuacFOZWtJQDGR7I_jRJIf6LIxT8uxuLr4DSPbFC2BOUHgGncgXqIaBGo-L-zrQnDVa) |
| Host and Container Metrics from the Kubernetes Cluster |



Each detailed chart has filter options for Node, Docker Image, and Docker Container. As Kubernetes uses the pod name in the name of the Docker Containers a search by pod name in the Docker Container filter makes it easy to select all containers for a specific pod.



Let’s have a look at a few Kubernetes (and Docker) key metrics provided by SPM.



Host Metrics such as CPU, Memory and Disk space usage. Docker images and containers consume more disk space than regular processes installed on a host. For example, an application image might include a Linux operating system and might have a size of 150-700 MB depending on the size of the base image and installed tools in the container. Data containers consume disk space on the host as well. In our experience watching the disk space and using cleanup tools is essential for continuous operations of Docker hosts.



 ![](https://lh5.googleusercontent.com/CJ7BYLNV0dx6CSWpmFSFgDteCjzQYcVOEz5W5gUOa6rK_H1Z6ozImfRJLIWH3X5YCOOSH-EfFuMo4Tdj0EaC7XTZ0bpmCmIsw7hWrB_1ctxkdI7JC5dhBA3umCmr1QG0SqovIDa6)



Container count - represents the number of running containers per host



| ![](https://lh5.googleusercontent.com/FUG46hzUj5FJSJgNLu4t6HIIa_QHcLXCDTgqHFoT711bO8M5BRd2w8hmzAk1ZQ0_iz7JkeDudoHNt50v_CaPWcanMOjSymiscMQZqBSudTZ4rrVDFWqkqtRNjOj9zrscQsrJ04Px) |
| Container Counters per Kubernetes Node over time |



Container Memory and Memory Fail Counters. These metrics are important to watch and very important to tune applications. Memory limits should fit the footprint of the deployed pod (application) to avoid situations where Kubernetes uses default limits (e.g. defined for a namespace), which could lead to OOM kills of containers. Memory fail counters reflect the number of failed memory allocations in a container, and in case of OOM kills a Docker Event is triggered. This event is then displayed in SPM because [Sematext Docker Agents](https://github.com/sematext/sematext-agent-docker) collects all Docker Events. The best practice is to tune memory setting in a few iterations:

- Monitor memory usage of the application container
- Set memory limits according to the observations
- Continue monitoring of memory, memory fail counters, and Out-Of-Memory events. If OOM events happen, the container memory limits may need to be increased, or debugging is required to find the reason for the high memory consumptions.

| ![](https://lh6.googleusercontent.com/Qq1_FhJRC72H0fvc71Oy_RqxbmBe8IZ4L4JTtADxBfLAjopRv2tJW5Fvc8DstD6iOj9JKfNt8U2gWAxzedx9tdnHuld-k1agDMAXDyWM-AuLOs7IDi-KNxEj_p-Kwef12SjeAiVc) |
| Container memory usage, limits and fail counters |


Container CPU usage and throttled CPU time. The CPU usage can be limited by CPU shares - unlike memory, CPU usage it is not a hard limit. Containers might use more CPU as long the resource is available, but in situations where other containers need the CPU limits apply and the CPU gets throttled to the limit.



 ![](https://lh5.googleusercontent.com/iSMZcZROnz6jovMg9XVlHSYFSiOgpgbrcJ0dVK7aXRaXq0psyAHE_Y4mN3aD0k2yRjH-Lgr-X3prNtBexFNmaNdWNXFd0MNnDSwjo8hbgNXydgRWjaT1X-_xbD6f_U92z9VMf4C7)



There are more [docker metrics to watch](https://sematext.com/blog/2016/06/28/top-docker-metrics-to-watch/), like disk I/O throughput, network throughput and network errors for containers, but let’s continue by looking at Kubernetes Logs next.



**Understand Kubernetes Logs**

Kubernetes containers’ logs are not much different from Docker container logs. However, Kubernetes users need to view logs for the deployed pods. That’s why it is very useful to have Kubernetes-specific information available for log search, such as:

- Kubernetes name space
- Kubernetes pod name
- Kubernetes container name
- Docker image name
- Kubernetes UID

Sematext Docker Agent extracts this information from the Docker container names and tags all logs with the information mentioned above. Having these data extracted in individual fields makes it is very easy to watch logs of deployed pods, build reports from logs, quickly narrow down to problematic pods while troubleshooting, and so on! If Kubernetes core components (such as kubelet, proxy, api server) are deployed via Docker the Sematext Docker Agent will collect Kubernetes core components logs as well.



| ![](https://lh6.googleusercontent.com/yiOiPMwqkH0FIyxDXfWi_Qs03JCwTag4gH5ZK3ylEuv3zJpymrZCec6YyhOPJwUkVTzAkN4mmL-DRsUVhluhdwgnZwsT7Vu1TDMrhEYpw2tFKc0Fe28O2_aw3kvBf3VZAB-hb5Mf) |
| All logs from Kubernetes containers in Logsene |

There are many other useful features Logsene and Sematext Docker Agent give you out of the box, such as:

- Automatic format detection and parsing of logs

  - Sematext Docker Agent includes patterns to recognize and parse many log formats
- Custom pattern definitions for specific images and application types
- [Automatic Geo-IP enrichment for container logs](https://sematext.com/blog/2016/04/11/automatic-geo-ip-enrichment-for-docker-logs-2/)
- Filtering logs e.g. to exclude noisy services
- Masking of sensitive data in specific log fields (phone numbers, payment information, authentication tokens)
- Alerts and scheduled reports based on logs
- Analytics for structured logs e.g. in Kibana or Grafana

Most of those topics are described in our [Docker Log Management](https://sematext.com/blog/2015/08/12/docker-log-management/) post and are relevant for Kubernetes log management as well. If you want to learn more about [Docker monitoring](http://blog.sematext.com/2016/01/12/docker-swarm-collecting-metrics-events-logs/), read more on our [blog](https://sematext.com/blog/tag/docker,kubernetes).







- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
