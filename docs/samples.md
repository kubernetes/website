---
assignees:
- bgrant0607

---
We have a wide variety of samples to choose from.

## Recently updated samples

The Kubernetes team is highlighting these samples as being the most up-to-date. Active upkeep is being done or has recently been done
on these samples to ensure they are high quality and work on Kubernetes {{page.version}}. 

<p>&nbsp;</p>

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
