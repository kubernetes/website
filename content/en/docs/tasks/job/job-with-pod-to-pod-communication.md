---
title: Job with Pod-to-Pod Communication
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

<!-- overview -->

In this example, you will run a Job in [Indexed completion mode](/blog/2021/04/19/introducing-indexed-jobs/) configured such that
the pods created by the Job can communicate with each other using pod hostnames rather than pod IP addresses.

Pods within a Job might need to communicate among themselves. The user workload running in each pod could query the Kubernetes API server
to learn the IPs of the other Pods, but it's much simpler to rely on Kubernetes' built-in DNS resolution.

Jobs in Indexed completion mode automatically set the pods' hostname to be in the format of
`${jobName}-${completionIndex}`. You can use this format to deterministically build
pod hostnames and enable pod communication *without* needing to create a client connection to
the Kubernetes control plane to obtain pod hostnames/IPs via API requests. 

This configuration is useful
for use cases where pod networking is required but you don't want to depend on a network 
connection with the Kubernetes API server.

## {{% heading "prerequisites" %}}

You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{<note>}}
If you are using MiniKube or a similar tool, you may need to take
[extra steps](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)
to ensure you have DNS.
{{</note>}}

<!-- steps -->

## Starting a Job with Pod-to-Pod Communication

To enable pod-to-pod communication using pod hostnames in a Job, you must do the following:

1. Set up a [headless Service](/docs/concepts/services-networking/service/#headless-services)
with a valid label selector for the pods created by your Job. The headless service must be in the same namespace as 
the Job. One easy way to do this is to use the `job-name: <your-job-name>` selector, since the `job-name` label will be automatically added by Kubernetes. This configuration will trigger the DNS system to create records of the hostnames of 
the pods running your Job. 

2. Configure the headless service as subdomain service for the Job pods by including the following value in your Job template spec: 

   ```yaml
   subdomain: <headless-svc-name>
   ```

### Example 
Below is a working example of a Job with pod-to-pod communication via pod hostnames enabled.
The Job is completed only after all pods successfully ping each other using hostnames.

{{<note>}}
In the Bash script executed on each pod in the example below, the pod hostnames can be prefixed
by the namespace as well  if the pod needs to be reached from outside the namespace.
{{</note>}}

```yaml

apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP must be None to create a headless service
  selector:
    job-name: example-job # must match Job name
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
      subdomain: headless-svc # has to match Service name
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

After applying the example above, reach each other over the network
using: `<pod-hostname>.<headless-service-name>`. You should see output similar to the following:

```shell
kubectl logs example-job-0-qws42
```

```
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

{{<note>}}
Keep in mind that the `<pod-hostname>.<headless-service-name>` name format used
in this example would not work with DNS policy set to `None` or `Default`.
You can learn more about pod DNS policies [here](/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy).
{{</note>}}
