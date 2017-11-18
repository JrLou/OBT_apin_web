
function loadScript(url, apikey) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.setAttribute("apikey", apikey);
    document.body.appendChild(script);
    fundebug.appversion = "1.8.0";
    //
    if(window.location.hostname.indexOf("www.apin.com")>=0){
        fundebug.releasestage = "production";
    }else{
        fundebug.releasestage = "development";
    }
}

loadScript("https://og6593g2z.qnssl.com/fundebug.0.3.3.min.js", "9118aceecbca5f72a7d6d801ab1196a34f59af72067ef4fa6161d05ce3006cc7");