(function (window, undefined) {
    var kakao = {};
    window.kakao = window.kakao || kakao;
    
    kakao.apiver = "2.0.1";
    var uagent = navigator.userAgent.toLocaleLowerCase();
    if (uagent.search("android") > -1) {
        kakao.os = "android";
        kakao.install = "market://details?id=com.kakao.talk";
    } else if (uagent.search("iphone") > -1 || uagent.search("ipod") > -1 || uagent.search("ipad") > -1) {
        kakao.os = "ios";
        kakao.install = "http://itunes.apple.com/app/id362057947";
    }

    function serialized(args) {
        var params = args;
        params.apiver = kakao.apiver;
        params.type = 'link';
        
        //check required
        var required_params = ["appid", "appver", "url", "appname", "msg"];
        if (typeof args.metainfo != "undefined") {
            params.type = "app";
            required_params.push("metainfo");
        }
        for (var i = 0, _len = required_params.length; i < _len; i++) {
            var _k= required_params[i];
            var v = args[_k] || undefined;
            if (v === undefined) {
                throw "Argument Required : " + _k;
            }

            params[_k] = v;
        }

        var stripped = [];
        for (var k in params) {
            stripped.push(k + "=" + encodeURIComponent(params[k]));
        }

        return stripped.join("&");
    }
    kakao.link = function (args) {
        var base_url = "kakaolink://sendurl?";
        var full_url = base_url + serialized(args);

        var install_block = function () {
                window.location = kakao.install;
            };
        if (this.os == "ios") {
            setTimeout(install_block, 25);
            window.location = full_url;
        } else if (this.os == "android") {
            var iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            iframe.src = full_url;
            iframe.onload = install_block;
            document.body.appendChild(iframe);
        }
    };

}(window));
