---
---
<script language="JavaScript">
var metadata;
var currentTopics;
var sortingBy;
var reverse = true;
function mainLogic()
{
  var tag=window.location.hash.replace("#","");
  console.log(metadata)
  if(tag) {
    if (tag.indexOf("object=" > -1))
    {
      tag = tag.replace("object=","");
      topicsFilter("object",$.trim(tag));
    }
    if (tag.indexOf("concept=") > -1)
    {
      tag = tag.replace("concept=","");
      topicsFilter("concept",$.trim(tag));
    }
  } else {
    currentTopics = metadata.pages;
  }
  renderTable(currentTopics);
}

$( document ).ready(function() {
  $.get("/metadata.txt", function(data, status) {
    metadata = $.parseJSON(data);
    metadata.pages.sort(dynamicSort("t"));
    mainLogic()
  });
});
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function renderTable(topiclist)
{
  var output = new Array();
  output.push("<table><thead><tr><th><a class='topicsort'><u style='cursor: pointer; cursor: hand;'>Topic</u></a></th><th><a class='sectionsort'><u style='cursor: pointer; cursor: hand;'>Section</u></a></th><th>Tags</th></tr></thead><tbody>");
  for(n=0;n<topiclist.length;n++) {
    output.push(topicToTableRow(topiclist[n]));
  }
  output.push("</tbody></table>");
  $("#output").html(output.join(""));
  $(".conceptfilter").click(function() {
    topicsFilter("concept",$(this).text());
  })
  $(".objectfilter").click(function() {
    topicsFilter("object",$(this).text());
  })
  $(".topicsort").click(function() {
    if (sortingBy == "topics") {
      if (reverse)
      {
        currentTopics.sort(dynamicSort('t'));
        reverse = false;
      } else {
        currentTopics.sort(dynamicSort('-t'));
        reverse = true;
      }
    } else {
      currentTopics.sort(dynamicSort('t'));
      reverse = false;
    }
    renderTable(currentTopics);
    sortingBy = "topics";
  })
  $(".sectionsort").click(function() {
    if (sortingBy == "section") {
      if (reverse)
      {
        currentTopics.sort(dynamicSort('s'));
        reverse = false;
      } else {
        currentTopics.sort(dynamicSort('-s'));
        reverse = true;
      }
    } else {
      currentTopics.sort(dynamicSort('s'));
      reverse = false;
    }
    renderTable(currentTopics);
    sortingBy = "section";
  })
}
function atScrub(string) { return string.replace(/'/g, "&#39;"); }
function topicToTableRow(topic)
{
  var output = new Array();
  output.push("<tr><td>");
  var title = (topic.g) ? atScrub(topic.g) : atScrub(topic.t);
  output.push("<b><a href='" + topic.u + "' title='" + title + "'>");
  output.push(topic.t);
  output.push("</a></b>");
  if (topic.g) output.push("<br/><span style='color:#999'>" + topic.g + "</span>");
  output.push("</td><td>")
  output.push(topic.s);
  output.push("</td><td>");
  if (topic.cr) {
    output.push("Concepts: ");
    for(i=0;i<topic.cr.length;i++)
    {
      if (i>0) output.push(", ");
      output.push("<a href='/docs/sitemap/#concept=" + topic.cr[i].concept + "' class='conceptfilter'>" + topic.cr[i].concept + "</a>");
    }
  }
  output.push("<br/>");
  if (topic.or) {
    output.push("Objects: ");
    for(i=0;i<topic.or.length;i++)
    {
      if (i>0) output.push(", ");
      output.push("<a href='/docs/sitemap/#object=" + topic.or[i].object + "' class='objectfilter'>" + topic.or[i].object + "</a>");
    }
  }
  output.push("</td></tr>");
  return output.join("");
}
function topicsFilter(type,tag)
{
  console.log(type + ":" + tag);
  currentTopics=[];
  for(i=0;i<metadata.pages.length;i++)
  {
    if(type=="object") var tagsArray = metadata.pages[i].or;
    if(type=="concept") var tagsArray = metadata.pages[i].cr;
    if (tagsArray)
    {
      for(n=0;n<tagsArray.length;n++)
      {
        if (tagsArray[n][type]==tag) currentTopics.push(metadata.pages[i]);
      }
    }
  }
  if (currentTopics.length==0) currentTopics = metadata.pages;
  renderTable(currentTopics);
}
</script>

Click tags or use the drop downs to filter. Click table headers to sort or reverse sort.

<div id="output" />


