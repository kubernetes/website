---
title: " Thousand Instances of Cassandra using Kubernetes Pet Set "
date: 2016-07-13
slug: thousand-instances-of-cassandra-using-kubernetes-pet-set
url: /blog/2016/07/Thousand-Instances-Of-Cassandra-Using-Kubernetes-Pet-Set
author: >
   [Chris Love](https://twitter.com/chrislovecnm/) (Datapipe)
---

_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/07/five-days-of-kubernetes-1-3) on what's new in Kubernetes 1.3_


## Running The Greek Pet Monster Races


For the [Kubernetes 1.3 launch](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/), we wanted to put the new Pet Set through its paces. By testing a thousand instances of [Cassandra](https://cassandra.apache.org/), we could make sure that Kubernetes 1.3 was production ready. Read on for how we adapted Cassandra to Kubernetes, and had our largest deployment ever.

It’s fairly straightforward to use containers with basic stateful applications today. Using a persistent volume, you can mount a disk in a pod, and ensure that your data lasts beyond the life of your pod. However, with deployments of distributed stateful applications, things can become more tricky. With Kubernetes 1.3, the new [Pet Set](/docs/user-guide/petset/) component makes everything much easier. To test this new feature out at scale, we decided to host the Greek Pet Monster Races! We raced Centaurs and other Ancient Greek Monsters over hundreds of thousands of races across multiple availability zones.  

[![File:Cassandra1.jpeg](https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Cassandra1.jpeg/283px-Cassandra1.jpeg)](https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Cassandra1.jpeg/283px-Cassandra1.jpeg)  
As many of you know Kubernetes is from the Ancient Greek: κυβερνήτης. This means helmsman, pilot, steersman, or ship master. So in order to keep track of race results, we needed a data store, and we choose Cassandra. Κασσάνδρα, Cassandra who was the daughter of King of Priam and Queen Hecuba of Troy. With multiple references to the ancient Greek language, we thought it would be appropriate to race ancient Greek monsters.



From there the story kinda goes sideways because Cassandra was actually the Pets as well. Read on and we will explain.



One of the new exciting features in Kubernetes 1.3 is Pet Set. In order to organize the deployment of containers inside of Kubernetes, different deployment mechanisms are available. Examples of these components include Resource Controllers and Daemon Set. Pet Sets is a new feature that delivers the capability to deploy containers, as Pets, inside of Kubernetes. Pet Sets provide a guarantee of identity for various aspects of the pet / pod deployment: DNS name, consistent storage, and ordered pod indexing. Previously, using components like Deployments and Replication Controllers, would only deploy an application with a weak uncoupled identity. A weak identity is great for managing applications such as microservices, where service discovery is important, the application is stateless, and the naming of individual pods does not matter. Many software applications do require strong identity, including many different types of distributed stateful systems. Cassandra is a great example of a distributed application that requires consistent network identity, and stable storage.



Pet Sets provides the following capabilities:



- A stable hostname, available to others in DNS. Number is based off of the Pet Set name and starts at zero. For example cassandra-0.
- An ordinal index of Pets. 0, 1, 2, 3, etc.
- Stable storage linked to the ordinal and hostname of the Pet.
- Peer discovery is available via DNS. With Cassandra the names of the peers are known before the Pets are created.
- Startup and Teardown ordering. Which numbered Pet is going to be created next is known, and which Pet will be destroyed upon reducing the Pet Set size. This feature is useful for such admin tasks as draining data from a Pet, when reducing the size of a cluster.



If your application has one or more of these requirements, then it may be a candidate for Pet Set.  
A relevant analogy is that a Pet Set is composed of Pet dogs. If you have a white, brown or black dog and the brown dog runs away, you can replace it with another brown dog no one would notice. If over time you can keep replacing your dogs with only white dogs then someone would notice. Pet Set allows your application to maintain the unique identity or hair color of your Pets.



Example workloads for Pet Set:



- Clustered software like Cassandra, Zookeeper, etcd, or Elastic require stable membership.
- Databases like MySQL or PostgreSQL that require a single instance attached to a persistent volume at any time.



Only use Pet Set if your application requires some or all of these properties. Managing pods as stateless replicas is vastly easier.



So back to our races!



As we have mentioned, Cassandra was a perfect candidate to deploy via a Pet Set. A Pet Set is much like a [Replica Controller](/docs/user-guide/replication-controller/) with a few new bells and whistles. Here's an example YAML manifest:  




# Headless service to provide DNS lookup
```
apiVersion: v1

kind: Service

metadata:

  labels:

    app: cassandra

  name: cassandra

spec:

  clusterIP: None

  ports:

    - port: 9042

  selector:

    app: cassandra-data

----

# new API name

apiVersion: "apps/v1alpha1"

kind: PetSet

metadata:

  name: cassandra

spec:

  serviceName: cassandra

  # replicas are the same as used by Replication Controllers

  # except pets are deployed in order 0, 1, 2, 3, etc

  replicas: 5

  template:

    metadata:

      annotations:

        pod.alpha.kubernetes.io/initialized: "true"

      labels:

        app: cassandra-data

    spec:

      # just as other component in Kubernetes one

      # or more containers are deployed

      containers:

      - name: cassandra

        image: "cassandra-debian:v1.1"

        imagePullPolicy: Always

        ports:

        - containerPort: 7000

          name: intra-node

        - containerPort: 7199

          name: jmx

        - containerPort: 9042

          name: cql

        resources:

          limits:

            cpu: "4"

            memory: 11Gi

          requests:

           cpu: "4"

           memory: 11Gi

        securityContext:

          privileged: true

        env:

          - name: MAX\_HEAP\_SIZE

            value: 8192M

          - name: HEAP\_NEWSIZE

            value: 2048M

          # this is relying on guaranteed network identity of Pet Sets, we

          # will know the name of the Pets / Pod before they are created

          - name: CASSANDRA\_SEEDS

            value: "cassandra-0.cassandra.default.svc.cluster.local,cassandra-1.cassandra.default.svc.cluster.local"

          - name: CASSANDRA\_CLUSTER\_NAME

            value: "OneKDemo"

          - name: CASSANDRA\_DC

            value: "DC1-Data"

          - name: CASSANDRA\_RACK

            value: "OneKDemo-Rack1-Data"

          - name: CASSANDRA\_AUTO\_BOOTSTRAP

            value: "false"

          # this variable is used by the read-probe looking

          # for the IP Address in a `nodetool status` command

          - name: POD\_IP

            valueFrom:

              fieldRef:

                fieldPath: status.podIP

        readinessProbe:

          exec:

            command:

            - /bin/bash

            - -c

            - /ready-probe.sh

          initialDelaySeconds: 15

          timeoutSeconds: 5

        # These volume mounts are persistent. They are like inline claims,

        # but not exactly because the names need to match exactly one of

        # the pet volumes.

        volumeMounts:

        - name: cassandra-data

          mountPath: /cassandra\_data

  # These are converted to volume claims by the controller

  # and mounted at the paths mentioned above.  Storage can be automatically

  # created for the Pets depending on the cloud environment.

  volumeClaimTemplates:

  - metadata:

      name: cassandra-data

      annotations:

        volume.alpha.kubernetes.io/storage-class: anything

    spec:

      accessModes: ["ReadWriteOnce"]

      resources:

        requests:
          storage: 380Gi
 ```



You may notice that these containers are on the rather large size, and it is not unusual to run Cassandra in production with 8 CPU and 16GB of ram. There are two key new features that you will notice above; dynamic volume provisioning, and of course Pet Set. The above manifest will create 5 Cassandra Pets / Pods starting with the number 0: cassandra-data-0, cassandra-data-1, etc.  

In order to generate data for the races, we used another Kubernetes feature called Jobs. Simple python code was written to generate the random speed of the monster for every second of the race. Then that data, position information, winners, other data points, and metrics were stored in Cassandra. To visualize the data, we used JHipster to generate a AngularJS UI with Java services, and then used D3 for graphing.  

An example of one of the Jobs:  


```
apiVersion: batch/v1

kind: Job

metadata:

  name: pet-race-giants

  labels:

    name: pet-races

spec:

  parallelism: 2

  completions: 4

  template:

    metadata:

      name: pet-race-giants

      labels:

        name: pet-races

    spec:

      containers:

      - name: pet-race-giants

        image: py3numpy-job:v1.0

        command: ["pet-race-job", --length=100", "--pet=Giants", "--scale=3"]

        resources:

          limits:

            cpu: "2"

          requests:

            cpu: "2"

      restartPolicy: Never
 ```



[![File:Polyphemus.gif](https://upload.wikimedia.org/wikipedia/commons/0/0e/Polyphemus.gif)](https://upload.wikimedia.org/wikipedia/commons/0/0e/Polyphemus.gif)Since we are talking about Monsters, we had to go big. We deployed 1,009 minion nodes to [Google Compute Engine](https://cloud.google.com/compute/) (GCE), spread across 4 zones, running a custom version of the Kubernetes 1.3 beta. We ran this demo on beta code since the demo was being set up before the 1.3 release date. For the minion nodes, GCE virtual machine n1-standard-8 machine size was chosen, which is vm with 8 virtual CPUs and 30GB of memory. It would allow for a single instance of Cassandra to run on one node, which is recommended for disk I/O.  

Then the pets were deployed! One thousand of them, in two different Cassandra Data Centers. Cassandra distributed architecture is specifically tailored for multiple-data center deployment. Often multiple Cassandra data centers are deployed inside the same physical or virtual data center, in order to separate workloads. Data is replicated across all data centers, but workloads can be different between data centers and thus application tuning can be different. Data centers named 'DC1-Analytics' and ‘DC1-Data’ where deployed with 500 pets each. The race data was created by the python Batch Jobs connected to DC1-Data, and the JHipster UI was connected DC1-Analytics.  

Here are the final numbers:  


- 8,072 Cores. The master used 24, minion nodes used the rest
- 1,009 IP addresses
- 1,009 routes setup by Kubernetes on Google Cloud Platform
- 100,510 GB persistent disk used by the Minions and the Master
- 380,020 GB SSD disk persistent disk. 20 GB for the master and 340 GB per Cassandra Pet.
- 1,000 deployed instances of Cassandra
Yes we deployed 1,000 pets, but one really did not want to join the party! Technically with the Cassandra setup, we could have lost 333 nodes without service or data loss.  



### Limitations with Pet Sets in 1.3 Release


- Pet Set is an alpha resource not available in any Kubernetes release prior to 1.3.
- The storage for a given pet must either be provisioned by a dynamic storage provisioner based on the requested storage class, or pre-provisioned by an admin.
- Deleting the Pet Set will not delete any pets or Pet storage. You will need to delete your Pets and possibly its storage by hand.
- All Pet Sets currently require a "governing service", or a Service responsible for the network identity of the pets. The user is responsible for this Service.
- Updating an existing Pet Set is currently a manual process. You either need to deploy a new Pet Set with the new image version or orphan Pets one by one and update their image, which will join them back to the cluster.


#### Resources and References


- The source code for the demo is available on [GitHub](https://github.com/k8s-for-greeks/gpmr): (Pet Set examples will be merged into the Kubernetes Cassandra Examples).
- More information about [Jobs](/docs/user-guide/jobs/)
- [Documentation for Pet Set](https://github.com/kubernetes/kubernetes.github.io/blob/release-1.3/docs/user-guide/petset.md)
- Image credits: Cassandra [image](https://commons.wikimedia.org/wiki/File:Cassandra1.jpeg) and Cyclops [image](https://commons.wikimedia.org/wiki/File:Polyphemus.gif)


