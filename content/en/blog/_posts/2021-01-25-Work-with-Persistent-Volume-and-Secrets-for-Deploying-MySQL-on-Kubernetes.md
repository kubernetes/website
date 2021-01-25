---
layout: blog
title: "Working with PersistentVolume and Secrets for Deploying MySQL on Kubernetes"
date: 2021-01-25
slug: work-with-persistent-volume-and-secrets-for-deploying-mysql-on-kubernetes
---

<p>In most of full-stack  applications, there is an authentication system for users to register their  account and conduct activities in the system. The users&rsquo; data is usually stored  in a SQL or No-SQL databases. To setup and deploy MySQL database on Kubernetes,  you need to know 3 major concepts: Persistent Volumes, Secrets and Persistent Volume Claim. In this article, we  discuss them and show you how they work together to make the communications  between database and application possible.   The concepts covered in this article will provide you with good  foundation for applying them to your next Kubernetes full-stack application  deployment project.  &nbsp;</p>
<h2>Kubernetes Persistent  Volume</h2>
<p>Let&rsquo;s start off by  explaining what a <strong>Persistent Volume</strong> (<strong>PV</strong>) is and what role does it play  in the <a href="https://coding-bootcamps.com/blog/kubernetes-evolution-from-virtual-servers-and-kubernetes-architecture.html">Kubernetes Pods</a>.  In a nutshell, PV in Kubernetes are used for deploying MySQL database. A PV is  a piece of storage in the cluster. It is a resource in the cluster just like a  node. The Persistent volume&rsquo;s lifecycle is independent from Pod lifecycles. It  preserves data through restarting, rescheduling, and even deleting Pods.</p>
<h2><br>
  Kubernetes Persistent Volume Claim </h2>
<p>PVs are consumed by  something called a&nbsp;<strong>PersistentVolumeClaim</strong>&nbsp;(<strong>PVC</strong>). Similar to a Pod, a PVC is a request for storage by  a user. While Pods consume node resources, PVCs consume PV resources. Likewise,  Pods can request specific levels of resources (CPU and Memory); whereas, PVCs  can request specific size and access modes (e.g. read-write or read-only). In  short, Pods and PV work hand-in-hand to use the system resources in a way that  is conducive to their operation. <br>
</p>
<h2>Kubernetes Secrets</h2>
<p>Put it simply, we use <a href="https://blockchain.dcwebmakers.com/blog/advance-topics-for-deploying-and-managing-kubernetes-containers.html">Kubernetes secrets</a> to store the database credentials. A Secret is just an object (that  contains key-value pairs and some metadata) in Kubernetes that lets you store  and manage sensitive information, such as passwords, tokens, SSH keys etc. The  secrets are stored in Kubernetes&nbsp;<a href="https://kubernetes.io/docs/concepts/overview/components/#etcd">etcd</a>. You can&nbsp;<a href="https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/">enable encryption</a>&nbsp;to store secrets in encrypted form in etcd. This  is how a secret looks like in the YAML representation:</p>
<pre>
  apiVersion: v1<br>
  kind: Secret<br>
  metadata: <br>
  name: mysecret<br>
  type: Opaque<br>
  data: <br>
  username: YWRtaW4=<br>
  password: MWYyZDFlMmU2N2Rm </pre>
  <br>
<h2>Deploy MySQL on  Kubernetes Using PV and Secrets</h2>
<p>Following is the  Kubernetes manifest for MySQL deployment. We have added comments alongside each  configuration to make sure that its usage is clear to you.</p>
<code>
  <pre>apiVersion: v1</pre>
  <pre>kind: PersistentVolume            # Create a PersistentVolume </pre>
  <pre>metadata: </pre>
  <pre>  name: mysql-pv</pre>
  <pre>  labels: </pre>
  <pre>    type: local</pre>
  <pre>spec: </pre>
  <pre>  storageClassName: standard      # Storage class. A PV Claim requesting the same storageClass can be bound to this volume.  </pre>
  <pre>  capacity: </pre>
  <pre>    storage: 250Mi</pre>
  <pre>  accessModes: </pre>
  <pre>    - ReadWriteOnce</pre>
  <pre>  hostPath:                       # hostPath PersistentVolume is used for development and testing. It uses a file/directory on the Node to emulate network-attached storage </pre>
  <pre>    path: &quot;/mnt/data&quot; </pre>
  <pre>  persistentVolumeReclaimPolicy: Retain  # Retain the PersistentVolume even after PersistentVolumeClaim is deleted. The volume is considered &ldquo;released&rdquo;. But it is not yet available for another claim because the previous claimant&rsquo;s data remains on the volume.  </pre>
  <pre>---    </pre>
  <pre>apiVersion: v1</pre>
  <pre>kind: PersistentVolumeClaim        # Create a PersistentVolumeClaim to request a PersistentVolume storage </pre>
  <pre>metadata:                          # Claim name and labels </pre>
  <pre>  name: mysql-pv-claim</pre>
  <pre>  labels: </pre>
  <pre>    app: polling-app</pre>
  <pre>spec:                              # Access mode and resource limits </pre>
  <pre>  storageClassName: standard       # Request a certain storage class </pre>
  <pre>  accessModes: </pre>
  <pre>    - ReadWriteOnce                # ReadWriteOnce means the volume can be mounted as read-write by a single Node </pre>
  <pre>  resources: </pre>
  <pre>    requests: </pre>
  <pre>      storage: 250Mi</pre>
  <pre>--- </pre>
  <pre>apiVersion: v1                    # API version </pre>
  <pre>kind: Service                     # Type of kubernetes resource  </pre>
  <pre>metadata: </pre>
  <pre>  name: polling-app-mysql         # Name of the resource </pre>
  <pre>  labels:                         # Labels that will be applied to the resource </pre>
  <pre>    app: polling-app</pre>
  <pre>spec: </pre>
  <pre>  ports: </pre>
  <pre>    - port: 3306 </pre>
  <pre>  selector:                       # Selects any Pod with labels `app=polling-app,tier=mysql` </pre>
  <pre>    app: polling-app</pre>
  <pre>    tier: mysql</pre>
  <pre>  clusterIP: None</pre>
  <pre>--- </pre>
  <pre>apiVersion: apps/v1</pre>
  <pre>kind: Deployment                    # Type of the kubernetes resource </pre>
  <pre>metadata: </pre>
  <pre>  name: polling-app-mysql           # Name of the deployment </pre>
  <pre>  labels:                           # Labels applied to this deployment  </pre>
  <pre>    app: polling-app</pre>
  <pre>spec: </pre>
  <pre>  selector: </pre>
  <pre>    matchLabels:                    # This deployment applies to the Pods matching the specified labels </pre>
  <pre>      app: polling-app</pre>
  <pre>      tier: mysql</pre>
  <pre>  strategy: </pre>
  <pre>    type: Recreate</pre>
  <pre>  template:                         # Template for the Pods in this deployment </pre>
  <pre>    metadata: </pre>
  <pre>      labels:                       # Labels to be applied to the Pods in this deployment </pre>
  <pre>        app: polling-app</pre>
  <pre>        tier: mysql</pre>
  <pre>    spec:                           # The spec for the containers that will be run inside the Pods in this deployment </pre>
  <pre>      containers: </pre>
  <pre>      - image: mysql:5.6            # The container image </pre>
  <pre>        name: mysql</pre>
  <pre>        env:                        # Environment variables passed to the container  </pre>
  <pre>        - name: MYSQL_ROOT_PASSWORD </pre>
  <pre>          valueFrom:                # Read environment variables from kubernetes secrets </pre>
  <pre>            secretKeyRef: </pre>
  <pre>              name: mysql-root-pass</pre>
  <pre>              key: password</pre>
  <pre>        - name: MYSQL_DATABASE</pre>
  <pre>          valueFrom: </pre>
  <pre>            secretKeyRef: </pre>
  <pre>              name: mysql-db-url</pre>
  <pre>              key: database</pre>
  <pre>        - name: MYSQL_USER</pre>
  <pre>          valueFrom: </pre>
  <pre>            secretKeyRef: </pre>
  <pre>              name: mysql-user-pass</pre>
  <pre>              key: username</pre>
  <pre>        - name: MYSQL_PASSWORD</pre>
  <pre>          valueFrom: </pre>
  <pre>            secretKeyRef: </pre>
  <pre>              name: mysql-user-pass</pre>
  <pre>              key: password</pre>
  <pre>        ports: </pre>
  <pre>        - containerPort: 3306        # The port that the container exposes        </pre>
  <pre>          name: mysql</pre>
  <pre>        volumeMounts: </pre>
  <pre>        - name: mysql-persistent-storage  # This name should match the name specified in `volumes.name` </pre>
  <pre>          mountPath: /var/lib/mysql</pre>
  <pre>      volumes:                       # A PersistentVolume is mounted as a volume to the Pod   </pre>
  <pre>      - name: mysql-persistent-storage</pre>
  <pre>        persistentVolumeClaim: </pre>
  <pre>          claimName: mysql-pv-claim</pre>
</code>
<p>In short, we are creating the  following four resources in the above manifest file: <br>
</p>
<ul>
  <li>PV</li>
  <li>A PVC for requesting access to the PV resource</li>
  <li>A service for having a static endpoint for the MySQL  database</li>
  <li>A deployment for running and managing the MySQL Pod</li>
</ul>
<p>The MySQL container reads  database credentials from environment variables. The environment variables  access these credentials from Kubernetes secrets.<br>
  For the next step, you can  start a Minikube cluster to create Kubernetes secrets to store database  credentials and deploy the MySQL instance. </p>
<h3>Summary</h3>
<p>In this article, you learn  about how to deploy MySQL on <a href="https://myhsts.org/tutorial-review-of-17-essential-topics-for-mastering-kubernetes.php">Kubernetes</a> and in doing so you learned three important Kubernetes concepts: Persistent Volume,  Persistent Volume Claim and Secrets. We also reviewed a sample configuration environment  for setting the right properties for PV, PVC and Secrets on the manifest file. You  can extend this article by using Kubernetes tools like Minikube to make  Kubernetes secrets to store database credentials and deploy the MySQL instance. </p>
<h3>Resources</h3>
<p>
  For more discussions and  helps on Kubernetes, reading the following articles is highly recommended: </p>
<ul type="disc">
  <li><a href="https://myhsts.org/tutorial-review-of-17-essential-topics-for-mastering-kubernetes.php" target="_blank">17       Best Practices for Managing Kubernetes Containers</a></li>
  <li><a href="https://blockchain.dcwebmakers.com/blog/advance-topics-for-deploying-and-managing-kubernetes-containers.html" target="_blank">Advance       System Admin Guide- 9 Best Practices for Managing Kubernetes</a></li>
  <li><a href="https://coding-bootcamps.com/blog/kubernetes-evolution-from-virtual-servers-and-kubernetes-architecture.html" target="_blank">System       Admin Guide- What is Kubernetes and how it works</a></li>
  <li><a href="https://blockchain.dcwebmakers.com/blog/comprehensive-guide-for-migration-from-monolithic-to-microservices-architecture.html" target="_blank">Comprehensive       Guide for Migration From Monolithic To Microservices Architecture</a></li>
  <li><a href="https://coding-bootcamps.com/blog/pod-to-pod-communications-in-kubernetes.html">Review  of Pod-to-Pod Communications in Kubernetes</a></li>
  <li><a href="https://coding-bootcamps.com/blog/build-containerized-applications-with-golang-on-kubernetes.html">Build and  Deploy Containerized Applications with Golang on Kubernetes</a></li>
</ul>
