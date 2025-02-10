---
title: " Helm Charts: making it simple to package and deploy common applications on Kubernetes "
date: 2016-10-10
slug: helm-charts-making-it-simple-to-package-and-deploy-apps-on-kubernetes
url: /blog/2016/10/Helm-Charts-Making-It-Simple-To-Package-And-Deploy-Apps-On-Kubernetes
author: >
  Vic Iglesias (Google)
---
There are thousands of people and companies packaging their applications for deployment on Kubernetes. This usually involves crafting a few different Kubernetes resource definitions that configure the application runtime, as well as defining the mechanism that users and other apps leverage to communicate with the application. There are some very common applications that users regularly look for guidance on deploying, such as databases, CI tools, and content management systems. These types of applications are usually not ones that are developed and iterated on by end users, but rather their configuration is customized to fit a specific use case. Once that application is deployed users can link it to their existing systems or leverage their functionality to solve their pain points.  

For best practices on how these applications should be configured, users could look at the many resources available such as: the [examples folder](https://github.com/kubernetes/kubernetes/tree/master/examples) in the Kubernetes repository, the Kubernetes [contrib repository](https://github.com/kubernetes/contrib), the [Helm Charts repository](https://github.com/helm/charts), and the [Bitnami Charts repository](https://github.com/bitnami/charts). While these different locations provided guidance, it was not always formalized or consistent such that users could leverage similar installation procedures across different applications.  

So what do you do when there are too many places for things to be found?  



[![](https://lh5.googleusercontent.com/l6CowJsfGRoH2wgWHlxtId4Foil2Fcs7AZ0NbOT7jGrXliESRSc6jNH8bdMmfpU-_gDRqy9UDSYCj7WaSKF1ZLK1a7t2qNo5JaIOglozee2SDIPteuOZ6aHzNMyBBJXukBv0zF9x)](https://lh5.googleusercontent.com/l6CowJsfGRoH2wgWHlxtId4Foil2Fcs7AZ0NbOT7jGrXliESRSc6jNH8bdMmfpU-_gDRqy9UDSYCj7WaSKF1ZLK1a7t2qNo5JaIOglozee2SDIPteuOZ6aHzNMyBBJXukBv0zF9x)

[xkcd Standards](https://xkcd.com/927/)



In this case, we’re not creating Yet Another Place for Applications, rather promoting an existing one as the canonical location. As part of the Special Interest Group Apps ([SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)) work for the [Kubernetes 1.4 release](https://kubernetes.io/blog/2016/09/kubernetes-1-4-making-it-easy-to-run-on-kuberentes-anywhere/), we began to provide a home for these Kubernetes deployable applications that provides continuous releases of well documented and user friendly packages. These packages are being created as Helm [**Charts**](https://github.com/kubernetes/helm/blob/master/docs/charts.md) and can be installed using the Helm tool. **[Helm](https://github.com/kubernetes/helm)** allows users to easily templatize their Kubernetes manifests and provide a set of configuration parameters that allows users to customize their deployment.

**Helm is the package manager** (analogous to yum and apt) and **Charts are packages** (analogous to debs and rpms). The home for these Charts is the [Kubernetes Charts repository](https://github.com/kubernetes/charts) which provides continuous integration for pull requests, as well as automated releases of Charts in the master branch.   

There are two main folders where charts reside. The [stable folder](https://github.com/kubernetes/charts/tree/master/stable) hosts those applications which meet minimum requirements such as proper documentation and inclusion of only Beta or higher Kubernetes resources. The [incubator folder](https://github.com/kubernetes/charts/tree/master/incubator) provides a place for charts to be submitted and iterated on until they’re ready for promotion to stable at which time they will automatically be pushed out to the default repository. For more information on the repository structure and requirements for being in stable, have a look at [this section in the README](https://github.com/kubernetes/charts#repository-structure).  

The following applications are now available:  




|Stable repository | Incubating repository |
|---|---|
|[Drupal](https://github.com/kubernetes/charts/tree/master/stable/drupal) | [Consul](https://github.com/kubernetes/charts/tree/master/incubator/consul) |
|[Jenkins](https://github.com/kubernetes/charts/tree/master/stable/jenkins)|[Elasticsearch](https://github.com/kubernetes/charts/tree/master/incubator/elasticsearch) |
| [MariaDB](https://github.com/kubernetes/charts/tree/master/stable/mariadb) | [etcd](https://github.com/kubernetes/charts/tree/master/incubator/etcd) |
| [MySQL](https://github.com/kubernetes/charts/tree/master/stable/mysql) | [Grafana](https://github.com/helm/charts/tree/master/stable/grafana) |
| [Redmine](https://github.com/kubernetes/charts/tree/master/stable/redmine)|[MongoDB](https://github.com/helm/charts/tree/master/stable/mongodb)|
| [Wordpress](https://github.com/kubernetes/charts/tree/master/stable/wordpress)|[Patroni](https://github.com/kubernetes/charts/tree/master/incubator/patroni) |
||[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)|
|  | [Spark](https://github.com/helm/charts/tree/master/stable/spark)|
|    | [ZooKeeper](https://github.com/kubernetes/charts/tree/master/incubator/zookeeper) |


**Example workflow for a Chart developer**  


1. [Create a chart](https://github.com/kubernetes/helm/blob/master/docs/charts.md)
2. Developer provides parameters via the [values.yaml](https://github.com/kubernetes/helm/blob/master/docs/charts.md#values-files) file allowing users to customize their deployment. This can be seen as the API between chart devs and chart users.
3. A [README](https://github.com/kubernetes/charts/tree/master/stable/mariadb) is written to help describe the application and its parameterized values.
4. Once the application installs properly and the values customize the deployment appropriately, the developer adds a [NOTES.txt](https://github.com/helm/helm/blob/dev-v2/docs/charts.md) file that is shown as soon as the user installs. This file generally points out the next steps for the user to connect to or use the application.
5. If the application requires persistent storage, the developer adds a mechanism to store the data such that pod restarts do not lose data. Most charts requiring this today are using [dynamic volume provisioning](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes) to abstract away underlying storage details from the user which allows a single configuration to work against Kubernetes installations.
6. Submit a [Pull Request to the Kubernetes Charts repo](https://github.com/kubernetes/charts/pulls). Once tested and reviewed, the PR will be merged.
7. Once merged to the master branch, the chart will be packaged and released to Helm’s default repository and available for users to install.

**Example workflow for a Chart user**  


1. 1.[Install Helm](https://helm.sh/docs/intro/quickstart/#install-helm)
2. 2.[Initialize Helm](https://helm.sh/docs/intro/quickstart/#install-an-example-chart)
3. 3.[Search for a chart](https://helm.sh/docs/intro/using_helm/#helm-search-finding-charts)

```
$ helm search  
NAME VERSION DESCRIPTION stable/drupal 0.3.1 One of the most versatile open source content m...stable/jenkins 0.1.0 A Jenkins Helm chart for Kubernetes. stable/mariadb 0.4.0 Chart for MariaDB stable/mysql 0.1.0 Chart for MySQL stable/redmine 0.3.1 A flexible project management web application. stable/wordpress 0.3.0 Web publishing platform for building blogs and ...
 ```

4. 4.[Install the chart](https://helm.sh/docs/intro/using_helm/#helm-install-installing-a-package)

```
$ helm install stable/jenkins
 ```

5. 5.After the install   

```
Notes:



1. Get your 'admin' user password by running:

  printf $(printf '\%o' `kubectl get secret --namespace default brawny-frog-jenkins -o jsonpath="{.data.jenkins-admin-password[*]}"`);echo



2. Get the Jenkins URL to visit by running these commands in the same shell:

\*\*\*\* NOTE: It may take a few minutes for the LoadBalancer IP to be available.                      \*\*\*\*

\*\*\*\*       You can watch the status of by running 'kubectl get svc -w brawny-frog-jenkins' \*\*\*\*

  export SERVICE\_IP=$(kubectl get svc --namespace default brawny-frog-jenkins -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

  echo http://$SERVICE\_IP:8080/login
```


3. Login with the password from step 1 and the username: admin



For more information on running Jenkins on Kubernetes, visit [here](https://cloud.google.com/solutions/jenkins-on-container-engine).



**Conclusion**  

Now that you’ve seen workflows for both developers and users, we hope that you’ll join us in consolidating the breadth of application deployment knowledge into a more centralized place. Together we can raise the quality bar for both developers and users of Kubernetes applications. We’re always looking for feedback on how we can better our process. Additionally, we’re looking for contributions of new charts or updates to existing ones. Join us in the following places to get engaged:  


- SIG Apps - [Slack Channel](https://kubernetes.slack.com/messages/sig-apps/)
- SIG Apps - [Weekly Meeting](https://github.com/kubernetes/community/tree/master/sig-apps#meeting)
- [Submit a Kubernetes Charts Issue](https://github.com/kubernetes/charts/issues)
A big thank you to the folks at Bitnami, Deis, Google and the [other contributors](https://github.com/kubernetes/charts/graphs/contributors) who have helped get the Charts repository to where it is today. We still have a lot of work to do but it's been wonderful working together as a community to move this effort forward.  


- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
