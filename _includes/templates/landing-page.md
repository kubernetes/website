{% if page.cards %}<!-- check for this before going any further; if not present, skip to else at bottom -->
<style>
h2, h3, h4 {
  border-bottom: 0px !important;
  font-size: 22px !important;
  padding-bottom: 20px !important;
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
  width: 250px;
  display: inline;
  float: left;
  text-transform: none;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 24px;
  position: relative;
  display: block;
  cursor: pointer;
  box-shadow: 0 2px 2px rgba(0,0,0,.24),0 0 2px rgba(0,0,0,.12);
  border-radius: 5px;
  background: #fff;
  transition: all .3s;
  padding: 16px;
  margin: 0 16px 16px 0;
  text-decoration: none;
  letter-spacing: .01em;
  height: 220px;
}
.shadowbox img {
    min-width: 100px;
    max-width: 100px;
    max-height: 50px;
    margin-right: 5px;
    margin-bottom: 5px;
    float: left;
}
</style>

<div class="colContainer">
{% for card in page.cards %}{% if card.title %}
  <div class="col3rd shadowbox">
    <h3>{{card.title}}</h3>
    <p>{% if card.image %}<img src="{{card.image}}">{% endif %}{{card.description}}</p>
  </div>
{% endif %}{% endfor %}
</div>

{% else %}

### ERROR: You must define "cards" front-matter YAML
{: style="color:red" }

This template requires that you insert YAML at the top of your document
that defines the "cards" you'd like to display on the page. The cards will
render in clickable boxes. 

To get rid of this message and take advantage of this template, define `cards`:

```yaml
---
cards:
- progression: no
- card:
  title: Mean Stack
  image: /docs/meanstack/image_0.png
  description: Lorem ipsum dolor it verberum.
- card:
  title: Guestbook + Redis
  image: /images/docs/redis.svg
  description: Lorem ipsum dolor it verberum.
- card:
  title: Cloud Native Cassandra
  image: /images/docs/cassandra.svg
  description: Lorem ipsum dolor it verberum.
- card:
  title: WordPress + MySQL
  image: /images/docs/wordpress.svg
  description: Lorem ipsum dolor it verberum. 
---
```

**Note:** If `progression` is set to `yes` then a "Start Here!" icon will be
placed on the first card and arrows suggesting linear reading will be overlayed
between the other cards, telling the reader that they should explore the content
in a certain order. 

{% endif %}
