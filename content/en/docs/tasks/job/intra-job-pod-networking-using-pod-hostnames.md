---
title: Intra-Job Pod Networking Using Pod Hostnames
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

<!-- overview -->

In this example, we will run a job in [indexed completion mode](https://kubernetes.io/blog/2021/04/19/introducing-indexed-jobs/) configured such that
the pods created by the job can communicate with each other using pod hostnames rather than pod IPs.

Pods within a Job might need to communicate among themselves. They could query the Kubernetes API
to learn the IPs of the other Pods, but it's much simpler to rely on Kubernetes' built-in DNS resolution.
Jobs in indexed completion mode automatically set the pod hostname to be in the format of
`${jobName}-${completionIndex}`, which can be used to deterministically determine
pod hostnames and enable pod networking *without* needing to create a client connection to
the Kubernetes control plane to obtain pod hostnames/IPs via API requests. This can be useful
for use cases where pod networking is required but we don't want to depend on a network 
connection with the Kubernetes API server.

## {{% heading "prerequisites" %}}

You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## Starting a job with pod networking using pod hostnames

To enable pod-to-pod communication using pod hostnames, you must do the following:

1. Set up a [headless service](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services)
with a valid label selector for the pods created by your job. This will trigger the 
Kubernetes' service discovery mechanism to cache the hostnames of 
the pods running your job (note that the service discovery mechanism does not need to be 
in the same namepsace as the job pods). One easy way to do this is to use the `job-name: <your-job-name>`
selector, since the job-name label will be automatically added by Kubernetes. 

**Note**: if you are using MiniKube or a similar tool, you may need to take [extra steps](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/) to ensure you have DNS.

2. Update the template spec in your job with the following: `subdomain: <headless-svc-name>`
   where `<headless-svc-name>` must match the name of your headless service
   exactly. 

Example job which completes only after all pods successfully ping each other using hostnames:

```yaml

apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP must be None to create a headless service
  selector:
    job-name: example-job # must match job template spec label
---
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 3
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      subdomain: headless-svc # has to match headless service name
      restartPolicy: Never
      containers:
      - name: example-workload
        image: bash:latest
        command:
        - bash
        - -c
        - |
          for i in 0 1 2
          do
            gotStatus="-1"
            wantStatus="0"             
            while [ $gotStatus -ne $wantStatus ]
            do                                       
              ping -c 1 example-job-${i}.headless-svc > /dev/null 2>&1
              gotStatus=$?                
              if [ $gotStatus -ne $wantStatus ]; then
                echo "Failed to ping pod example-job-${i}.headless-svc, retrying in 1 second..."
                sleep 1
              fi
            done                                                         
            echo "Successfully pinged pod: example-job-${i}.headless-svc"
          done
```

After applying the example above, pods will be able to reach each other over the network
using: `<pod-hostname>.<headless-service-name>`. You should see output similar to the following:
```
$ kubectl logs example-job-0-qws42
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```
**NOTE**: It is important note that the `<pod-hostname>.<headless-service-name>` name format used
in this example would not work with DNS policy set to `None` or `Default`. You can learn more about pod
DNS policies [here](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy).
