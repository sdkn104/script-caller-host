var o=new XMLSerializer();
w=window.open();
d=w.document;
d.open();
d.write(o.serializeToString(document.documentElement).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g,'&quot;'));
d.close();

