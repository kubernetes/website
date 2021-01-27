---
layout: blog
title: "Working with PersistentVolume and Secrets for Deploying MySQL on Kubernetes"
date: 2021-01-25
slug: work-with-persistent-volume-and-secrets-for-deploying-mysql-on-kubernetes
---

In most of full-stack applications, there is an authentication system
for users to register their account and conduct activities in the
system. The users’ data is usually stored in a SQL or No-SQL databases.
To setup and deploy MySQL database on Kubernetes, you need to know 3
major concepts: Persistent Volumes, Secrets and Persistent Volume Claim.
In this article, we discuss them and show you how they work together to
make the communications between database and application possible. The
concepts covered in this article will provide you with good foundation
for applying them to your next Kubernetes full-stack application
deployment project.  

Kubernetes Persistent Volume
----------------------------

Let’s start off by explaining what a **Persistent Volume** (**PV**) is
and what role does it play in the [Kubernetes
Pods](https://kubernetes.io/docs/concepts/workloads/pods/).
In a nutshell, PV in Kubernetes are used for deploying MySQL database. A
PV is a piece of storage in the cluster. It is a resource in the cluster
just like a node. The Persistent volume’s lifecycle is independent from
Pod lifecycles. It preserves data through restarting, rescheduling, and
even deleting Pods.


 Kubernetes Persistent Volume Claim
-----------------------------------

PVs are consumed by something called
a **PersistentVolumeClaim** (**PVC**). Similar to a Pod, a PVC is a
request for storage by a user. While Pods consume node resources, PVCs
consume PV resources. Likewise, Pods can request specific levels of
resources (CPU and Memory); whereas, PVCs can request specific size and
access modes (e.g. read-write or read-only). In short, Pods and PV work
hand-in-hand to use the system resources in a way that is conducive to
their operation. 

Kubernetes Secrets
------------------

Put it simply, we use [Kubernetes
secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
to store the database credentials. A Secret is just an object (that
contains key-value pairs and some metadata) in Kubernetes that lets you
store and manage sensitive information, such as passwords, tokens, SSH
keys etc. The secrets are stored in
Kubernetes [etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd).
You can [enable
encryption](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) to
store secrets in encrypted form in etcd. This is how a secret looks like
in the YAML representation:

      apiVersion: v1
      kind: Secret
      metadata: 
      name: mysecret
      type: Opaque
      data: 
      username: YWRtaW4=
      password: MWYyZDFlMmU2N2Rm 



Deploy MySQL on Kubernetes Using PV and Secrets
-----------------------------------------------

Following is the Kubernetes manifest for MySQL deployment. We have added
comments alongside each configuration to make sure that its usage is
clear to you.

`   `

    apiVersion: v1

    kind: PersistentVolume            # Create a PersistentVolume 

    metadata: 

      name: mysql-pv

      labels: 

        type: local

    spec: 

      storageClassName: standard      # Storage class. A PV Claim requesting the same storageClass can be bound to this volume.  

      capacity: 

        storage: 250Mi

      accessModes: 

        - ReadWriteOnce

      hostPath:                       # hostPath PersistentVolume is used for development and testing. It uses a file/directory on the Node to emulate network-attached storage 

        path: "/mnt/data" 

      persistentVolumeReclaimPolicy: Retain  # Retain the PersistentVolume even after PersistentVolumeClaim is deleted. The volume is considered “released”. But it is not yet available for another claim because the previous claimant’s data remains on the volume.  

    ---    

    apiVersion: v1

    kind: PersistentVolumeClaim        # Create a PersistentVolumeClaim to request a PersistentVolume storage 

    metadata:                          # Claim name and labels 

      name: mysql-pv-claim

      labels: 

        app: polling-app

    spec:                              # Access mode and resource limits 

      storageClassName: standard       # Request a certain storage class 

      accessModes: 

        - ReadWriteOnce                # ReadWriteOnce means the volume can be mounted as read-write by a single Node 

      resources: 

        requests: 

          storage: 250Mi

    --- 

    apiVersion: v1                    # API version 

    kind: Service                     # Type of kubernetes resource  

    metadata: 

      name: polling-app-mysql         # Name of the resource 

      labels:                         # Labels that will be applied to the resource 

        app: polling-app

    spec: 

      ports: 

        - port: 3306 

      selector:                       # Selects any Pod with labels `app=polling-app,tier=mysql` 

        app: polling-app

        tier: mysql

      clusterIP: None

    --- 

    apiVersion: apps/v1

    kind: Deployment                    # Type of the kubernetes resource 

    metadata: 

      name: polling-app-mysql           # Name of the deployment 

      labels:                           # Labels applied to this deployment  

        app: polling-app

    spec: 

      selector: 

        matchLabels:                    # This deployment applies to the Pods matching the specified labels 

          app: polling-app

          tier: mysql

      strategy: 

        type: Recreate

      template:                         # Template for the Pods in this deployment 

        metadata: 

          labels:                       # Labels to be applied to the Pods in this deployment 

            app: polling-app

            tier: mysql

        spec:                           # The spec for the containers that will be run inside the Pods in this deployment 

          containers: 

          - image: mysql:5.6            # The container image 

            name: mysql

            env:                        # Environment variables passed to the container  

            - name: MYSQL_ROOT_PASSWORD 

              valueFrom:                # Read environment variables from kubernetes secrets 

                secretKeyRef: 

                  name: mysql-root-pass

                  key: password

            - name: MYSQL_DATABASE

              valueFrom: 

                secretKeyRef: 

                  name: mysql-db-url

                  key: database

            - name: MYSQL_USER

              valueFrom: 

                secretKeyRef: 

                  name: mysql-user-pass

                  key: username

            - name: MYSQL_PASSWORD

              valueFrom: 

                secretKeyRef: 

                  name: mysql-user-pass

                  key: password

            ports: 

            - containerPort: 3306        # The port that the container exposes        

              name: mysql

            volumeMounts: 

            - name: mysql-persistent-storage  # This name should match the name specified in `volumes.name` 

              mountPath: /var/lib/mysql

          volumes:                       # A PersistentVolume is mounted as a volume to the Pod   

          - name: mysql-persistent-storage

            persistentVolumeClaim: 

              claimName: mysql-pv-claim

In short, we are creating the following four resources in the above
manifest file: 

-   PV
-   A PVC for requesting access to the PV resource
-   A service for having a static endpoint for the MySQL database
-   A deployment for running and managing the MySQL Pod

The MySQL container reads database credentials from environment
variables. The environment variables access these credentials from
Kubernetes secrets.
 For the next step, you can start a Minikube cluster to create
Kubernetes secrets to store database credentials and deploy the MySQL
instance.

### Summary

In this article, you learn about how to deploy MySQL on 
Kubernetes and in doing so you learned three important Kubernetes concepts:
Persistent Volume, Persistent Volume Claim and Secrets. We also reviewed
a sample configuration environment for setting the right properties for
PV, PVC and Secrets on the manifest file. 




About Author
Matt Zand is a serial entrepreneur and the founder of 3 successful tech startups: [DC Web Makers](https://blockchain.dcwebmakers.com/), [Coding Bootcamps](http://coding-bootcamps.com/) and [High School Technology Services](https://myhsts.org/). He is a leading author of [Hands-on Smart Contract Development with Hyperledger Fabric] (https://www.oreilly.com/library/view/hands-on-smart-contract/9781492086116/) book by O’Reilly Media. He has written more than 100 technical articles and tutorials on blockchain development for Hyperledger, Ethereum and Corda R3 platforms. At DC Web Makers, he leads a team of blockchain experts for consulting and deploying enterprise decentralized applications. As chief architect, he has designed and developed blockchain courses and training programs for Coding Bootcamps. He has a master's degree in business management from the University of Maryland. Prior to blockchain development and consulting, he worked as senior web and mobile App developer and consultant, angel investor, business advisor for a few startup companies. You can connect with him on LI: https://www.linkedin.com/in/matt-zand-64047871
