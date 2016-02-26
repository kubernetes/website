---
---

**By: Sandeep Dinesh** - _July 29, 2015_

![image](/images/docs/meanstack/image_0.png)

In [a recent post](http://blog.sandeepdinesh.com/2015/07/running-mean-web-application-in-docker.html), I talked about running a MEAN stack with [Docker Containers.](http://docker.com/)

Manually deploying Containers is all fine and dandy, but is rather fragile and clumsy. What happens if the app crashes? How can the app be updated? Rolled back?

Thankfully, there is a system we can use to manage our containers in a cluster environment called Kubernetes. Even better, Google has a managed version of Kubernetes called [Google Container Engine](https://cloud.google.com/container-engine/) so you can get up and running in minutes.

* TOC
{:toc}

## The Basics of Using Kubernetes

Before we jump in and start kube’ing it up, it’s important to understand some of the fundamentals of Kubernetes.

* Containers: These are the Docker, rtk, AppC, or whatever Container you are running. You can think of these like subatomic particles; everything is made up of them, but you rarely (if ever) interact with them directly.
* Pods: Pods are the basic component of Kubernetes. They are a group of Containers that are scheduled, live, and die together. Why would you want to have a group of containers instead of just a single container? Let’s say you had a log processor, a web server, and a database. If you couldn't use Pods, you would have to bundle the log processor in the web server and database containers, and each time you updated one you would have to update the other. With Pods, you can just reuse the same log processor for both the web server and database.
* Replication Controllers: This is the management component of Kubernetes, and it’s pretty cool. You give it a set of Pods, tell it "I want three copies of this," and it creates those copies on your cluster. It will do its best to keep those copies always running, so if one crashes it will start another.
* Services: This is the other side to Replication Controllers. A service is the single point of contact for a group of Pods. For example, let’s say you have a Replication Controller that creates four copies of a web server pod. A Service will split the traffic to each of the four copies. Services are "permanent" while the pods behind them can come and go, so it’s a good idea to use Services.


## Step 1: Creating the Container

In my previous post, I used off-the-shelf containers to keep things simple.

I had a stock MongoDB container and a stock Node.js container. The Mongo container ran fine without any modification. However, I had to manually enter the Node container to pull and run the code. Obviously this isn't ideal in Kubernetes land, as you aren't supposed to log into your servers!

Instead, you have to build a custom container that has the code already inside it and runs automatically.

To do this, you need to use more Docker. Make sure you have the latest version installed for the rest of this tutorial.

Getting the code:

Before starting, let’s get some code to run. You can follow along on your personal machine or a Linux VM in the cloud. I recommend using Linux or a Linux VM; running Docker on Mac and Windows is outside the scope of this tutorial.

```shell
$ git clone https://github.com/ijason/NodeJS-Sample-App.git app
$ mv app/EmployeeDB/* app/
$ sed -i -- 's/localhost/mongo/g' ./app/app.js
```

This is the same sample app we ran before. The second line just moves everything from the `EmployeeDB` subfolder up into the app folder so it’s easier to access. The third line, once again, replaces the hardcoded `localhost` with the `mongo` proxy.

Building the Docker image:

First, you need a `Dockerfile`. This is basically the list of instructions Docker uses to build a container image.

Here is the `Dockerfile` for the web server:

```shell
FROM node:0.10.40

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./app/ ./
RUN npm install

CMD ["node", "app.js"]
```

A `Dockerfile` is pretty self explanatory, and this one is dead simple.

First, it uses the official Node.js image as the base image.

Then, it creates a folder to store the code, `cd`s into that directory, copies the code in, and installs the dependencies with npm.

Finally, it specifies the command Docker should run when the container starts, which is to start the app.


## Step 2: Building our Container

Right now, the directory should look like this:

```shell
$ ls

Dockerfile app
```

Let’s build.

```shell
$ docker build -t myapp .
```

This will build a new Docker image for your app. This might take a few minutes as it is downloading and building everything.

After that is done, test it out:

```shell
$ docker run myapp
```

At this point, you should have a server running on `http://localhost:3000` (or wherever Docker tells you). The website will error out as there is no database running, but we know it works!

![image](/images/docs/meanstack/image_1.png)


## Step 3: Pushing our Container

Now you have a custom Docker image, you have to actually access it from the cloud.

As we are going to be using the image with Google Container Engine, the best place to push the image is the [Google Container Registry](https://cloud.google.com/tools/container-registry/). The Container Registry is built on top of [Google Cloud Storage](https://cloud.google.com/storage/), so you get the advantage of scalable storage and very fast access from Container Engine.

First, make sure you have the latest version of the [Google Cloud SDK installed](https://cloud.google.com/sdk/).

[Windows users click here.](https://dl.google.com/dl/cloudsdk/release/GoogleCloudSDKInstaller.exe)

For Linux/Mac:

```shell
$ curl https://sdk.cloud.google.com | bash
```

Then, make sure you log in and update.

```shell
$ gcloud auth login
$ gcloud components update
```

You're ready to push your container live, but you'll need a destination. Create a Project in [the Google Cloud Platform Console](https://console.developers.google.com/), and leave it blank. Use the Project ID below, and push your project live.

```shell
$ docker tag myapp gcr.io/<YOUR-PROJECT-ID>/myapp
$ gcloud docker push gcr.io/<YOUR-PROJECT-ID>/myapp
```

After some time, it will finish. You can check the console to see the container has been pushed up.

![image](/images/docs/meanstack/image_2.png)


## **Step 4: Creating the Cluster**

So now you have the custom container, let’s create a cluster to run it.

Currently, a cluster can be as small as one machine to as big as 100 machines. You can pick any machine type you want, so you can have a cluster of a single `f1-micro` instance, 100 `n1-standard-32` instances (3,200 cores!), and anything in between.

For this tutorial I'm going to use the following:

* Create a cluster named `mean-cluster`
* Give it a size of 2 nodes
* Machine type will be `n1-standard-1`
* Zone will be `us-central-1f` (Use a zone close to you)

There are two ways to create this cluster. Take your pick.

**Command Line:**

```shell
$ gcloud beta container \
 --project "<YOUR-PROJECT-ID>" \
 clusters create "mean-cluster" \
 --zone "us-central1-f" \
 --machine-type "n1-standard-1" \
 --num-nodes "2" \
 --network "default"
```

**GUI:**

![image](/images/docs/meanstack/image_3.png)

After a few minutes, you should see this in the console.

![image](/images/docs/meanstack/image_4.png)


## **Step 5: Creating the Database Service**

Three things need to be created:

1. Persistent Disk to store the data (pods are ephemeral, so we shouldn't save data locally)
2. Replication Controller running MongoDB
3. Service mapping to that Replication Controller

To create the disk, run this:

```shell
$ gcloud compute disks create \
 --project "<YOUR-PROJECT-ID>" \
 --zone "us-central1-f" \
 --size 200GB \
 mongo-disk
```

Pick the same zone as your cluster and an appropriate disk size for your application.

Now, we need to create a Replication Controller that will run the database. I’m using a Replication Controller and not a Pod, because if a standalone Pod dies, it won't restart automatically.

### `db-controller.yml`

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
 labels:
   name: mongo
 name: mongo-controller
spec:
 replicas: 1
 template:
   metadata:
     labels:
       name: mongo
   spec:
     containers:
     - image: mongo
       name: mongo
       ports:
       - name: mongo
         containerPort: 27017
         hostPort: 27017
       volumeMounts:
           - name: mongo-persistent-storage
             mountPath: /data/db
     volumes:
       - name: mongo-persistent-storage
         gcePersistentDisk:
           pdName: mongo-disk
           fsType: ext4
```

We call the controller `mongo-controller`, specify one replica, and open the appropriate ports. The image is `mongo`, which is the off the shelf MongoDB image.

The `volumes` section creates the volume for Kubernetes to use. There is a Google Container Engine-specific `gcePersistentDisk` section that maps the disk we made into a Kubernetes volume, and we mount the volume into the `/data/db` directory (as described in the MongoDB Docker documentation)

Now we have the Controller, let’s create the Service:

### `db-service.yml`

```yaml
apiVersion: v1
kind: Service
metadata:
 labels:
   name: mongo
 name: mongo
spec:
 ports:
   - port: 27017
     targetPort: 27017
 selector:
   name: mongo
```

Again, pretty simple stuff. We "select" the mongo Controller to be served, open up the ports, and call the service `mongo`.

This is just like the "link" command line option we used with Docker in my previous post. Instead of connecting to `localhost`, we connect to `mongo`, and Kubernetes redirects traffic to the mongo service!

At this point, the local directory looks like this:

```shell
$ ls

Dockerfile
app
db-controller.yml
db-service.yml
```

## Step 6: Running the Database

First, let’s "log in" to the cluster

```shell
$ gcloud container clusters get-credentials mean-cluster
```

Now create the controller.

```shell
$ kubectl create -f db-controller.yml
```

And the Service.

```shell
$ kubectl create -f db-service.yml
```

`kubectl` is the Kubernetes command line tool (automatically installed with the Google Cloud SDK). We are just creating the resources specified in the files.

At this point, the database is spinning up! You can check progress with the following command:

```shell
$ kubectl get pods
```

Once you see the mongo pod in running status, we are good to go!

```shell
$ kubectl get pods

NAME                    READY  REASON   RESTARTS AGE
mongo-controller-xxxx   1/1    Running  0        3m
```


## Step 7: Creating the Web Server

Now the database is running, let’s start the web server.

We need two things:

1. Replication Controller to spin up and down web server pods
2. Service to expose our website to the interwebs

Let’s look at the Replication Controller configuration:

### `web-controller.yml`

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
 labels:
   name: web
 name: web-controller
spec:
 replicas: 2
 template:
   metadata:
     labels:
       name: web
   spec:
     containers:
     - image: gcr.io/<YOUR-PROJECT-ID>/myapp
       name: web
       ports:
       - containerPort: 3000
         name: http-server
```

Here, we create a controller called `web-controller`, and we tell it to create two replicas. Replicas of what you ask? You may notice the `template` section looks just like a Pod configuration, and that's because it is. We are creating a Pod with our custom Node.js container and exposing port 3000.


Now for the Service

### `web-service.yml`

```yaml
apiVersion: v1
kind: Service
metadata:
 name: web
 labels:
   name: web
spec:
 type: LoadBalancer
 ports:
   - port: 80
     targetPort: 3000
     protocol: TCP
 selector:
   name: web
```

Notice two things here:

1. The type is *LoadBalancer*. This is a cool feature that will make Google Cloud Platform create an external network load balancer automatically for this service!
2. We map external port 80 to the internal port 3000, so we can serve HTTP traffic without messing with Firewalls.

At this point, the local directory looks like this

```shell
$ ls

Dockerfile app db-pod.yml db-service.yml web-service.yml web-controller.yml
```


## Step 8: Running the Web Server

Create the Controller.

```shell
$ kubectl create -f web-controller.yml
```

And the Service.

```shell
$ kubectl create -f web-service.yml
```

And check the status.

```shell
$ kubectl get pods
```

Once you see the web pods in running status, we are good to go!

```shell
$ kubectl get pods

NAME                   READY     REASON    RESTARTS   AGE
mongo-controller-xxxx  1/1       Running   0          4m
web-controller-xxxx    1/1       Running   0          1m
web-controller-xxxx    1/1       Running   0          1m
```


## Step 9: Accessing the App

At this point, everything is up and running. The architecture looks something like this:

![image](/images/docs/meanstack/image_5.png)

By default, port 80 should be open on the load balancer. In order to find the IP address of our app, run this command:

```shell
$ gcloud compute forwarding-rules list

NAME     REGION        IP_ADDRESS       IP_PROTOCOL TARGET
abcdef   us-central1   104.197.XXX.XXX  TCP         us-xxxx
```

If you go to the IP address listed, you should see the app up and running!

![image](/images/docs/meanstack/image_6.png)

And the Database works!

![image](/images/docs/meanstack/image_7.png)


#### **Final Thoughts**

By using Container Engine and Kubernetes, we have a very robust, container based MEAN stack running in production.

[In anoter post](https://medium.com/google-cloud/mongodb-replica-sets-with-kubernetes-d96606bd9474#.e93x7kuq5), I cover how to setup a MongoDB replica set. This is very important for running in production.

Hopefully I can do some more posts about advanced Kubernetes topics such as changing the cluster size and number of Node.js web server replicas, using different environments (dev, staging, prod) on the same cluster, and doing rolling updates.

Thanks to [Mark Mandel](https://medium.com/@markmandel), [Aja Hammerly](https://medium.com/@thagomizer), and [Jack Wilber](https://medium.com/@jack.g.wilber). [Some rights reserved](http://creativecommons.org/licenses/by/4.0/) by the author.

