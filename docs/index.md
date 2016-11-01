---
assignees:
- bgrant0607
- thockin

---

<p>The Kubernetes documentation can help you set up Kubernetes, learn about the system, or get your applications and workloads running on Kubernetes.</p>

<p><a href="/docs/whatisk8s/" class="button">Read the Kubernetes Overview</a></p>

<style>
h3, h4 {
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

<h2>Quickstarts</h2>

<p>Some quick ways to get started with Kubernetes include:</p>
<p>&nbsp;</p>

<div id="quickstarts" class="colContainer">
  <div class="col3rd">
    <h4>Kubernetes Basics Interactive Tutorial</h4>
    <p>The Kubernetes Basics interactive tutorials let you try out Kubernetes right out of your web browser, using a virtual terminal. Learn about the Kubernetes system and deploy, expose, scale, and upgrade a containerized application in just a few minutes.</p>
    <a href="/docs/tutorials/kubernetes-basics/" class="button">Try the Interactive Tutorials</a>
  </div>
  <div class="col3rd">
    <h3>Installing Kubernetes on AWS with kops</h3>
    <p>This quickstart will show you how to bring up a complete Kubernetes cluster on AWS, using a tool called <code>kops</code>.</p>
    <a href="/docs/getting-started-guides/kops/" class="button">Install Kubernetes with kops</a>
  </div>
  <div class="col3rd">
    <h4>Installing Kubernetes on Linux with kubeadm</h4>
    <p>This quickstart helps you install a secure Kubernetes cluster using the built-in <code>kubeadm</code> tool. You can use <code>kubeadm</code> to install Kubernetes on any pre-existing machines that are running Linux. <code>kubeadm</code> is currently an alpha feature, but we invite you to try it out and give us feedback!</p>
    <a href="/docs/getting-started-guides/kubeadm/" class="button">Install Kubernetes with kubeadm</a>
  </div>
</div>

<h2>Tutorials, Tasks, Concepts, and Guides</h2>

<p>The Kubernetes documentation contains a number of resources to help you understand and work with Kubernetes.</p>
<ul>
<li><b><a href="/docs/tutorials/">Tutorials</a></b> contain detailed walkthroughs of the Kubernetes workflow, both for working on existing Kubernetes clusters or setting up your own clusters.</li>
<li><b><a href="/docs/tasks/">Tasks</a></b> contain step-by-step instructions for common Kubernetes tasks.</li>
<li><b><a href="/docs/tutorials/">Concepts</a></b> provide a deep understanding of how Kubernetes works.</li>
<li><b><a href="/docs/tutorials/">Guides</a></b> provide background information on Kubernetes features along with some instructions and usage examples.</li>
</ul>

<h2>API and Command References</h2>

<p>The <a href="/docs/reference/">reference</a> documentation provides complete information on the Kubernetes APIs and the <code>kubectl</code> command-line interface.</p>

<h2>Tools</h2>

<p>The <a href="/docs/tools/">tools</a> page contains a list of native and third-party tools for Kubernetes.</p>