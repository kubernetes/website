---
title: " Kubernetes the Easy Way "
date: 2017-11-01
slug: kubernetes-easy-way
url: /blog/2017/11/Kubernetes-Easy-Way
author: >
  Dan Garfield (Codefresh)
---

Kelsey Hightower wrote an invaluable guide for Kubernetes called [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way). It’s an awesome resource for those looking to understand the ins and outs of Kubernetes—but what if you want to put Kubernetes on easy mode? That’s something we’ve been working on together with Google Cloud. In this guide, we’ll show you how to get a cluster up and running, as well as how to actually deploy your code to that cluster and run it.   

This is Kubernetes the easy way.&nbsp;



## What We’ll Accomplish

1. 1.Set up a cluster
2. 2.Deploy an application to the cluster
3. 3.Automate deployment with rolling updates

## Prerequisites

- A containerized application
- You can also use [a demo app](https://github.com/containers101/demochat).
- A [Google Cloud Account](https://cloud.google.com/?utm_source=kubernetes.io&utm_medium=codefresh-easy-mode) or a Kubernetes cluster on another provider
- Everything after Cluster creation is identical with all providers.
- A free account on [Codefresh](https://codefresh.io/kubernetes-deploy/)
- Codefresh is a service that handles Kubernetes deployment configuration and automation.&nbsp;

We made Codefresh free for open-source projects and offer 200 builds/mo free for private projects, to make adopting Kubernetes as easy as possible. Deploy as much as you like on as many clusters as you like.&nbsp;



## Set Up a Cluster
1. Create an account at [cloud.google.com](https://cloud.google.com/?utm_source=kubernetes.io&utm_medium=codefresh-easy-mode) and log in.  

**Note:** If you’re using a Cluster outside of Google Cloud, you can skip this step.  

Google Container Engine is Google Cloud’s managed Kubernetes service. In our testing, it’s both powerful and easy to use.   

If you’re new to the platform, you can get a $500 credit at the end of this process.   

2. Open the menu and scroll down to **Container Engine**. Then select **Container Clusters**.   

 ![](https://lh6.googleusercontent.com/dqvtK-xyGelr_LW3qlFiamYRrpiq633R68cKitrbCZPtDY_uLBF7R7_PGVNvWja24_mG74vDBzpXddYhbRNeyBGPbQ_yfCq367Zp7eJZoiJEWurFWdmJ0AJlNJJ9TzDivE-8Ak9E)  

3. Click **Create cluster.**  

We’re done with step 1. In my experience it usually takes less than 5 minutes for a cluster to be created.&nbsp;



## Deploy an Application to Kubernetes
First go to [Codefresh and create an account using GitHub, Bitbucket, or Gitlab](https://codefresh.io/kubernetes-deploy/). As mentioned previously, Codefresh is free for both open source and smaller private projects. We’ll use it to create the configuration Yaml necessary to deploy our application to Kubernetes. Then we'll deploy our application and automate the process to happen every time we commit code changes. Here are the steps:  

1. 1.Create a Codefresh account
2. 2.Connect to Google Cloud (or other cluster)
3. 3.Add Cluster
4. 4.Deploy static image
5. 5.Build and deploy an image
6. 6.Automate the process

### Connect to Google Cloud
To connect your Clusters in Google Container Engine, go to _Account Settings \> Integrations \> Kubernetes_ and click **Authenticate**. This prompts you to login with your Google credentials.   

Once you log in, all of your clusters are available within Codefresh.   

 ![](https://lh4.googleusercontent.com/edYv9DtPymvBBN37KdjUUkhkA9Cy7tZmGMw5V94XEWkesGh9xlOn3O7f6MdsmzKlF75KPM908CXLd9i3bbJCfgZ4BpGy6WvL_l1ADu9tWSIdm9l_uUiB0lPLyvCk1d1FCu2fLc0f)



### Add Cluster
To add your cluster, click the down arrow, and then click **add cluster**, select the project and cluster name. You can now deploy images!



### Optional: Use an Alternative Cluster
To connect a non-GKE cluster we’ll need to add a token and certificate to Codefresh. Go to _Account Settings (bottom left) \> Integrations \> Kubernetes \> Configure \> Add Provider \> Custom Providers_. Expand the dropdown and click **Add Cluster**.


 ![](https://lh4.googleusercontent.com/UNXfErkrIV-eoyAi3DS9zkRm8Awk7wMTpIQZssrscKY6hehDo63jzvkBYAdgD3fXJXgcDApi4z5dHI5S99Nk6YbvUVUQU_6hC7qRZ-9Y828k-N86f23OOSG04CXvlTWDE9XDIWhd)  

Follow the instructions on how to generate the needed information and click Save. Your cluster now appears under the Kubernetes tab.&nbsp;



### Deploy Static Image to Kubernetes
Now for the fun part! Codefresh provides an easily modifiable boilerplate that takes care of the heavy lifting of configuring Kubernetes for your application.   

1. Click on the **Kubernetes** tab: this shows a list of namespaces.   

Think of namespaces as acting a bit like VLANs on a Kubernetes cluster. Each namespace can contain all the services that need to talk to each other on a Kubernetes cluster. For now, we’ll just work off the default namespace (the easy way!).   

2. Click **Add Service** and fill in the details.   

You can use the [demo application I mentioned earlier](https://github.com/containers101/demochat) that has a Node.js frontend with a MongoDB.   

 ![](https://lh4.googleusercontent.com/YzQzEdIMwWt3lGR9Q4RTELvaB_fYYo2QKqkeXhfTCDnIVX4FBx_quYNgAbo6Wc_wpk0anl7Co3RDwDWnrOyibog9V9DISOZYQqiFE9T4ErlDYuqOGWiRw3-zk4p4WcURaOVg3Dkn)

Here’s the info we need to pass:  

**Cluster** - This is the cluster we added earlier, our application will be deployed there.   
**Namespace** - We’ll use default for our namespace but you can create and use a new one if you’d prefer. Namespaces are discrete units for grouping all the services associated with an application.   
**Service name** - You can name the service whatever you like. Since we’re deploying Mongo, I’ll just name it mongo!  
**Expose port** - We don’t need to expose the port outside of our cluster so we won’t check the box for now but we will specify a port where other containers can talk to this service. Mongo’s default port is ‘27017’.   
**Image** - Mongo is a public image on Dockerhub, so I can reference it by name and tag, ‘mongo:latest’.  
**Internal Ports** - This is the port the mongo application listens on, in this case it’s ‘27017’ again.   

We can ignore the other options for now.   

3. Scroll down and click **Deploy**.  

 ![](https://lh4.googleusercontent.com/4dhWXsf0BhyDDyB6XmmuCo2RCNztTPNuy36lYuzAHEYsFmKKkS6ibbKKo3sIqyQIYNTsTE6m5fjtlnEB0gmYoeQ40DZjwuSVyO4-pQKPjZflDT75NZ61aytXnEhFiAUHUDk9l1Wj)  

Boom! You’ve just deployed this image to Kubernetes. You can see by clicking on the status that the service, deployment, replicas, and pods are all configured and running. If you click Edit \> Advanced, you can see and edit all the raw YAML files associated with this application, or copy them and put them into your repository for use on any cluster.&nbsp;



### Build and Deploy an Image
To get the rest of our demo application up and running we need to build and deploy the Node.js portion of the application. To do that we’ll need to add our repository to Codefresh.   

1. Click on _Repositories \> Add Repository_, then copy and paste the [demochat repo url](https://github.com/containers101/demochat) (or use your own repo).  

 ![](https://lh6.googleusercontent.com/Mbs04O7PFJ6yFRRmPo2PDs3MU5IyKq53jrgSB6Xcm1Ki8eStJacoRsPDqv5_m92E0Ki-r-hi_4nbaAqUKRXNE57-TJbmacM3vqrkwM-3ASuBGmmugGc-QkHgfQrRSuAzCP60bSzA)  

We have the option to use a dockerfile, or to use a template if we need help creating a dockerfile. In this case, the demochat repo already has a dockerfile so we’ll select that. Click through the next few screens until the image builds.   

Once the build is finished the image is automatically saved inside of the Codefresh docker registry. You can also add any [other registry to your account](https://docs.codefresh.io/v1.0/docs/docker-registry) and use that instead.  

To deploy the image we’ll need  

- a pull secret
- the image name and registry
- the ports that will be used


### Creating the Pull Secret
The pull secret is a token that the Kubernetes cluster can use to access a private Docker registry. To create one, we’ll need to generate the token and save it to Codefresh.   

1. Click on **User Settings** (bottom left) and generate a new token.   

2. Copy the token to your clipboard.  

 ![](https://lh5.googleusercontent.com/fJxTvuK0b-ssLls87EgSccmpZoRk_KXTQdxOglvgKlPHlc6pr-yNBht4rKYyLcFF7SERS2czWLSh_YUNGOy7Q9UjQqlGNKJdmG1uyDpVr_IIx3BqsauxfXnIrEtQbdXKAOg-nfr3)  

3. Go to _Account Settings \> Integrations \> Docker Registry \> Add Registry_ and select **Codefresh Registry**. Paste in your token and enter your username (entry is case sensitive). Your username must match your name displayed at the bottom left of the screen.   

4. Test and save it.   

We’ll now be able to create our secret later on when we deploy our image.



### Get the image name
1. Click on **Images** and open the image you just built. Under _Comment_ you’ll see the image name starting with r.cfcr.io.   

 ![](https://lh5.googleusercontent.com/5XciQfEpUxYZp6Tuic3TWFOkXi5I_x-16i9yXkpAMn4BRC54Rh7Hic4yM5Feo6A65jArBQyXfIgexTZ9rp-mM6l9Rmu4fm3aeE48x98veKN4_39j3hkRVm8goLTaWX0U9KgJuYIi)  

2. Copy the image name; we’ll need to paste it in later.



### Deploy the private image to Kubernetes
We’re now ready to deploy the image we built.   

1. Go to the Kubernetes page and, like we did with mongo, click Add Service and fill out the page. Make sure to select the same namespace you used to deploy mongo earlier.&nbsp;


 ![](https://lh4.googleusercontent.com/reUappaYGmp27xL32HFg6OWHRZfw60o5fUxTII7jrUUmGN4lqNrEaPW8Dl5RHK-N4nOCSOTe-9A6Y0HIiSzPxyCceOzOmrNeTB_QGKRfyI5EnpTM7mT-neGsBwYx-zn4BETgN8Nz)  

Now let’s expose the port so we can access this application. This provisions an IP address and automatically configures ingress.   

2. Click **Deploy** : your application will be up and running within a few seconds! The IP address may take longer to provision depending on your cluster location.   

 ![](https://lh6.googleusercontent.com/nGiPsfscMpcvxfjqseEH5Ft2K3yzvT93ZW3vVJtg_QF3gN_-ndMnZ4Kpcz_WqIr76irCwaBFr7Du6mzVGYYgHxgZFdBNi3hWWW5UWFtnvhyEq2DDM8zCIEXKTo84gjGCOsvenp1r)  

From this view you can scale the replicas, see application status, and similar tasks.   

3. Click on the IP address to view the running application.  

 ![](https://lh4.googleusercontent.com/GmZYxhd4tgEJONm8MBIY_m1rfOH05_LxCwpnbrFk013pNEIMAcNGsuPqR5DfFevjbTYAKTRqj4aXhwxowXM5D7p5KjBLqZ0YyTP226Awl2BC6MdBXwfb3E-HEAZTI_MlEEkBu5oC)

At this point you should have your entire application up and running! Not so bad huh? Now to automate deployment!



### Automate Deployment to Kubernetes
Every time we make a change to our application, we want to build a new image and deploy it to our cluster. We’ve already set up automated builds, but to automate deployment:   

1. Click on **Repositories** (top left).  

2. Click on the pipeline for the demochat repo (the gear icon).  

 ![](https://lh5.googleusercontent.com/dD_Dn5SgpSSqTfIeHep4QKhx6rM8zcTWQVR-wHwBWLMzeZ9vsueS320yOeH_nuaKSYlSwrSB3UhML0wcLYZeoCPtga9mvvpyShutYoVKNtZ16e9ZDvglHDiOqugXunkDstUPF_aV)  

3. It’s a good idea to run some tests before deploying. Under _Build and Unit Test_, add npm test for the unit test script.   

4. Click **Deploy Script** and select **Kubernetes (Beta)**. Enter the information for the service you’ve already deployed.   

 ![](https://lh5.googleusercontent.com/an0aib6sTTqZqhfjMjOGFcWRRcaQSjezjk9XHVxEsLr_6hWi0kslsgQR6D0gP3EiA8D4pON-BhmakaRhpFVCkH16F80jt2-EWAJki4i2u4fYRQSdumiihC5fDjUyOyC9rwm1QilT)  

You can see the option to use a deployment file from your repo, or to use the deployment file that you just generated.   

5. Click **Save**.   

You’re done with deployment automation! Now whenever a change is made, the image will build, test, and deploy.&nbsp;



## Conclusions
We want to make it easy for every team, not just big enterprise teams, to adopt Kubernetes while preserving all of Kubernetes’ power and flexibility. At any point on the Kubernetes service screen you can switch to YAML to view all of the YAMLfiles generated by the configuration you performed in this walkthrough. You can tweak the file content, copy and paste them into local files, etc.   

This walkthrough gives everyone a solid base to start with. When you’re ready, you can tweak the entities directly to specify the exact configuration you’d like.   

We’d love your feedback! Please share with us on [Twitter](https://twitter.com/codefresh), or [reach out directly](https://codefresh.io/contact-us/).



## Addendums
**Do you have a video to walk me through this?** [You bet](https://www.youtube.com/watch?v=oFwFuUxxFdI&list=PL8mgsmlx4BWV_j_L5oq-q8JdPnlJc3bUv).  

**Does this work with Helm Charts?** Yes! We’re currently piloting Helm Charts with a limited set of users. Ping us if you’d like to try it early.  

**Does this work with any Kubernetes cluster?** It should work with any Kubernetes cluster and is tested for Kubernetes 1.5 forward.   

**Can I deploy Codefresh in my own data center?** Sure, Codefresh is built on top of Kubernetes using Helm Charts. Codefresh cloud is free for open source, and 200 builds/mo. Codefresh on prem is currently for enterprise users only.   

**Won’t the database be wiped every time we update?** Yes, in this case we skipped creating a persistent volume. It’s a bit more work to get the persistent volume configured, if you’d like, [feel free to reach out](https://codefresh.io/contact-us/) and we’re happy to help!
