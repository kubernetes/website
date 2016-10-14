---
assignees:
- bgrant0607
- thockin

---

Kubernetes is an open source, production-ready cluster management and container orchestration system. With Kubernetes on your cluster, you can ensure that your containerized applications and other cloud-based workloads run where you want them, when you want them, and with the resources that they need.

The Kubernetes system works with popular containerization solutions, such as Docker and rkt, and can run on cloud clusters from major cloud providers such as Amazon Web Services, Google Cloud Platform, and Microsoft Azure, as well as custom and on-premises clusters.

<p>
<style>
h2, h3, h4 {
  border-bottom: 0px !important;
}
.colContainer {
  padding-top:2px;
  padding-left: 2px;
  overflow: auto;
}
#samples a {
  color: #000;
}
.col3rd {
  display: block;
  width: 250px;
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  overflow: hidden;
}
.col3rd h3, .col2nd h3 {
  margin-bottom: 0px !important;
}
.col3rd .button, .col2nd .button {
  margin-top: 20px;
  border-radius: 2px;
}
.col3rd p, .col2nd p {
  margin-left: 2px;
}
.col2nd {
  display: block;
  width: 400px;
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  overflow: hidden;
}
.shadowbox {
  display: inline;
  float: left;
  text-transform: none;
  font-weight: bold;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 24px;
  position: relative;
  display: block;
  cursor: pointer;
  box-shadow: 0 2px 2px rgba(0,0,0,.24),0 0 2px rgba(0,0,0,.12);
  border-radius: 10px;
  background: #fff;
  transition: all .3s;
  padding: 16px;
  margin: 0 16px 16px 0;
  text-decoration: none;
  letter-spacing: .01em;
}
.shadowbox img {
    min-width: 150px;
    max-width: 150px;
    max-height: 50px;
}
</style>
<div class="colContainer">
  <div class="col3rd">
    <h3>What is Kubernetes?</h3>
    <p>Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers across clusters of hosts. Learn more about what this means for your app.</p>
    <a href="/docs/whatisk8s/" class="button">Read the Overview</a>
  </div>
  <div class="col3rd">
    <h3>Kubernetes Basics Interactive Tutorial</h3>
    <p>The Kubernetes Basics interactive tutorials let you try out Kubernetes features right out of your web browser, in a virtual terminal. Learn about the Kubernetes system and deploy, expose, scale, and upgrade a containerized application in just a few minutes.</p>
    <a href="/docs/tutorials/kubernetes-basics/" class="button">Try the Interactive Tutorials</a>
  </div>
  <div class="col3rd">
    <h3>Installing Kubernetes on Linux with kubeadm</h3>
    <p>This quickstart will show you how to install a secure Kubernetes cluster on any computers running Linux, using a tool called <code>kubeadm</code> which is part of Kubernetes. It'll work with local VMs, physical servers and/or cloud servers, either manually or as part of your own automation. It is currently in alpha but please try it out and give us feedback!</p>
    <a href="/docs/getting-started-guides/kubeadm/" class="button">Install Kubernetes with kubeadm</a>
  </div>
</div>

## Samples

<div id="samples" class="colContainer">
<a href="/docs/getting-started-guides/meanstack/" class="shadowbox">
  <img src="/images/docs/meanstack/image_0.png"><br/>MEAN Stack
</a>
<a href="https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook" target="_blank" class="shadowbox">
  <img src="/images/docs/redis.svg"><br/>Guestbook + Redis
</a>
<a href="https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/storage/cassandra" target="_blank" class="shadowbox">
  <img src="/images/docs/cassandra.svg"><br/>Cloud Native Cassandra
</a>
<a href="https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/mysql-wordpress-pd/" target="_blank" class="shadowbox">
  <img src="/images/docs/wordpress.svg"><br/>WordPress + MySQL
</a>
</div>

<p>&nbsp;</p>
<p>&nbsp;</p>

<div class="colContainer">
  <div class="col2nd">
  <h3>Contribute to Our Docs</h3>
  <p>The docs for Kubernetes are open-source, just like the code for Kubernetes itself. The docs are on GitHub Pages, so you can fork it and it will auto-stage on username.github.io, previewing your changes!</p>
  <a href="/editdocs/" class="button">Write Docs for K8s</a>
  </div>
  <div class="col2nd">
  <h3>Need Help?</h3>
  <p>Try consulting our <a href="/docs/troubleshooting/">troubleshooting guides</a>, or <a href="https://github.com/kubernetes/kubernetes/wiki/User-FAQ">our FAQ</a>. Kubernetes is also supported by a great community of contributors and experts who hang out in <a href="http://slack.kubernetes.io/">our Slack channel</a>, <a href="https://groups.google.com/forum/#!forum/kubernetes-users">our Google Group</a> and <a href="http://stackoverflow.com/questions/tagged/kubernetes">Stack Overflow</a>.</p>
  <a href="/docs/troubleshooting/" class="button">Get Support</a>
  </div>
</div>
