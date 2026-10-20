(function () {
  var PAGES = [["index.html","Home"],["about.html","About"],["children.html","Children"],["events.html","Events"],["sermons.html","Sermons"],["bulletin.html","Bulletin"],["give.html","Give"],["contact.html","Contact"]];
  var FB = "https://www.facebook.com/cbccaribou";
  var YT = "https://www.youtube.com/@calvarybaptistchurchcaribo4374";
  var CC = "https://cariboucalvary.churchcenter.com";
  var here = location.pathname.split("/").pop() || "index.html";

  var nav = PAGES.map(function (p) {
    var cls = (p[0] === here) ? ' class="active"' : "";
    return '<li><a href="' + p[0] + '"' + cls + ">" + p[1] + "</a></li>";
  }).join("");

  var header = document.getElementById("site-header");
  if (header) header.outerHTML =
    '<header class="site"><div class="wrap"><a href="index.html"><img src="images/logo.png" alt="Calvary Baptist Church, Caribou"></a>' +
      '<nav aria-label="Main"><ul>' + nav + '<li><a href="' + FB + '" target="_blank" rel="noopener">Facebook</a></li><li><a href="' + YT + '" target="_blank" rel="noopener">YouTube</a></li><li><a href="' + CC + '" target="_blank" rel="noopener">MyCalvary</a></li></ul></nav></div></header>';


  var footer = document.getElementById("site-footer");
  if (footer) footer.outerHTML =
    '<footer class="site"><div class="wrap grid">' +
    '<div><strong>Calvary Baptist Church</strong><br>46 Access Hwy<br>Caribou, ME 04736<br>Mailing: PO Box 86, Caribou, ME 04736<br>Phone: <a href="tel:+12074936608">207-493-6608</a><br><a href="mailto:Info@cariboucalvary.org">Info@cariboucalvary.org</a></div>' +
    '<div><strong>Join us</strong><br>Sunday School: 8:45 AM<br>Sunday Worship: 10:00 AM<br>Tuesday Bible Study/Potluck: 6:00-7:30 PM</div>' +
    '<div><strong>Connect</strong><br><a href="' + FB + '" target="_blank" rel="noopener">Facebook</a><br><a href="' + YT + '" target="_blank" rel="noopener">YouTube</a><br><a href="' + CC + '" target="_blank" rel="noopener">MyCalvary</a><br><a href="give.html">Give</a></div>' +
    '</div><div class="wrap" style="margin-top:16px;font-size:.85rem">&copy; ' + new Date().getFullYear() + ' Calvary Baptist Church, Caribou, Maine</div></footer>';

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  // Events: reads data/events.json, hides past events automatically
  var list = document.getElementById("events-list");
  if (list) {
    var limit = parseInt(list.getAttribute("data-limit"), 10) || 999;
    fetch("data/events.json").then(function (r) { return r.json(); }).then(function (data) {
      var t = new Date(); var today = t.getFullYear() + "-" + ("0" + (t.getMonth() + 1)).slice(-2) + "-" + ("0" + t.getDate()).slice(-2);
      var ev = (data.events || []).filter(function (e) { return e.date >= today; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, limit);
      if (!ev.length) { list.innerHTML = "<p>No upcoming events are posted right now. Please check back soon or follow us on Facebook.</p>"; return; }
      var M = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      list.innerHTML = ev.map(function (e) {
        var p = e.date.split("-");
        return '<div class="event"><div class="date">' + M[parseInt(p[1], 10) - 1] + "<span>" + parseInt(p[2], 10) + "</span></div><div><h3>" + esc(e.title) + "</h3>" +
          (e.time ? '<div class="muted">' + esc(e.time) + (e.location ? " &bull; " + esc(e.location) : "") + "</div>" : "") +
          (e.description ? "<p>" + esc(e.description) + "</p>" : "") + "</div></div>";
      }).join("");
    }).catch(function () { list.innerHTML = "<p>Events could not be loaded.</p>"; });
  }

  // Bulletin: reads data/bulletin.json
  var bul = document.getElementById("bulletin");
  if (bul) {
    fetch("data/bulletin.json").then(function (r) { return r.json(); }).then(function (d) {
      var html = "";
      if (d.current) {
        html += "<h2>" + esc(d.current_title || "This Week's Bulletin") + '</h2><p><a class="btn orange" href="' + esc(d.current) + '" target="_blank" rel="noopener">Open / Download PDF</a></p>' +
          '<iframe class="embed" src="' + esc(d.current) + '" title="Current bulletin"></iframe>';
      } else { html += "<p>The current bulletin has not been posted yet.</p>"; }
      if (d.archive && d.archive.length) {
        html += "<h2>Past Bulletins</h2><ul>" + d.archive.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; })
          .map(function (b) { return '<li><a href="' + esc(b.file) + '" target="_blank" rel="noopener">' + esc(b.title || b.date) + "</a> <span class=\"muted\">(" + esc(b.date) + ")</span></li>"; }).join("") + "</ul>";
      }
      bul.innerHTML = html;
    }).catch(function () { bul.innerHTML = "<p>The bulletin could not be loaded.</p>"; });
  }
})();
