/*! http://mths.be/placeholder v2.0.7 by @mathias */
!((a, b, c) => {
  function d(a){
    var b={};
    var d=/^jQuery\d+$/;
    return c.each(a.attributes,(a, c) => {c.specified&&!d.test(c.name)&&(b[c.name]=c.value)}),b;
  }function e(a,d){
    var e=this;
    var f=c(e);
    if(e.value==f.attr("placeholder")&&f.hasClass("placeholder"))if(f.data("placeholder-password")){if(f=f.hide().next().show().attr("id",f.removeAttr("id").data("placeholder-id")),a===!0)return f[0].value=d;f.focus()}else e.value="",f.removeClass("placeholder"),e==b.activeElement&&e.select()
  }function f(){
    var a;
    var b=this;
    var f=c(b);
    var g=this.id;
    if(""==b.value){if("password"==b.type){if(!f.data("placeholder-textinput")){try{a=f.clone().attr({type:"text"})}catch(h){a=c("<input>").attr(c.extend(d(this),{type:"text"}))}a.removeAttr("name").data({"placeholder-password":!0,"placeholder-id":g}).bind("focus.placeholder",e),f.data({"placeholder-textinput":a,"placeholder-id":g}).before(a)}f=f.removeAttr("id").hide().prev().attr("id",g).show()}f.addClass("placeholder"),f[0].value=f.attr("placeholder")}else f.removeClass("placeholder")
  }
  var g;
  var h;
  var i="placeholder"in b.createElement("input");
  var j="placeholder"in b.createElement("textarea");
  var k=c.fn;
  var l=c.valHooks;
  i&&j?(h=k.placeholder=function(){return this},h.input=h.textarea=!0):(h=k.placeholder=function(){var a=this;return a.filter((i?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":e,"blur.placeholder":f}).data("placeholder-enabled",!0).trigger("blur.placeholder"),a},h.input=i,h.textarea=j,g={get(a) {var b=c(a);return b.data("placeholder-enabled")&&b.hasClass("placeholder")?"":a.value},set(a, d) {var g=c(a);return g.data("placeholder-enabled")?(""==d?(a.value=d,a!=b.activeElement&&f.call(a)):g.hasClass("placeholder")?e.call(a,!0,d)||(a.value=d):a.value=d,g):a.value=d}},i||(l.input=g),j||(l.textarea=g),c(() => {c(b).delegate("form","submit.placeholder",function(){var a=c(".placeholder",this).each(e);setTimeout(() => {a.each(f)},10)})}),c(a).bind("beforeunload.placeholder",() => {c(".placeholder").each(function(){this.value=""})}))
})(this,document,jQuery);