/**
 * 发送GET请求
 */
function sendGet(url, parmsObj, successFunc, errorFunc){

    if (!url.match('http://')) {
        if (url.charAt(0) != '/') url = '/' + url;
        url = baseUrl + url;
    }

    var key = "key";//getUserinfo().key || '';
    if(key != ''){
        parmsObj = parmsObj || {};
        parmsObj['key'] = key;
    }

    $.ajax({
        type: 'GET',
        url: url,
        data: parmsObj,
        timeout: 15000,
        dataType : "jsonp",
        jsonp: "callback",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(json, textStatus) {
            successFunc ? successFunc(json, textStatus) : null
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorFunc ? errorFunc(XMLHttpRequest, textStatus, errorThrown) : null;
        },
        complete : function(XMLHttpRequest,status){
            if(status=='timeout'){
                showInfo("请求超时")
            }
        }
    })
}

function sendPost(url, parmsObj, successFunc, errorFunc){

    if (!url.match('http://')) {
        if (url.charAt(0) != '/') url = '/' + url;
        url = baseUrl + url
    }

    var key = getUserinfo().key || '';
    if(key != ''){
        parmsObj = parmsObj || {};
        parmsObj['key'] = key;
    }

    $.ajax({
        type: 'post',
        url: url,
        data: parmsObj,
        timeout: 5000,
        dataType : "jsonp",
        jsonp: "callback",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(json, textStatus) {
            successFunc ? successFunc(json, textStatus) : null
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorFunc ? errorFunc(XMLHttpRequest, textStatus, errorThrown) : null
        },
        complete : function(XMLHttpRequest,status){
            if(status=='timeout'){
                showInfo("请求超时")
            }
        }
    })
}

/**
 * 将一个参数对象拼接到url后面
 */
function appendParms(url, parmsObj){
    if (parmsObj != null) {
        var parms = '';
        for (var pro in parmsObj) {
            parms += pro + '=' + parmsObj[pro] + '&'
        }

        parms = parms.substring(0, parms.length-1)
    }

    return (url.indexOf('?') != -1) ? (url += parms ? ("&" + parms) : '') : (url += parms ? ("?" + parms) : '');
}

/**
 * 获取url中的参数并组合为对象
 */
function getArgs(url){

    if (url.indexOf('?') != -1) {
        var strs = url.split('?');
        var str = strs[1];

        var obj = new Object()

        if (str.indexOf('&') != -1) {
            strs = str.split('&');
            for (var i in strs){
                var ss = strs[i].split('=');
                obj[ss[0]] = ss[1];
            }
        }else {
            strs = str.split('=');
            obj[strs[0]] = strs[1];
        }

        return obj
    }
    return null
}

function hasProperty(url,key){
    var ret = false;
    if (url.indexOf('?') != -1) {
        var strs = url.split('?');
        var str = strs[1];

        if (str.indexOf('&') != -1) {
            strs = str.split('&');
            for (var i in strs){
                var ss = strs[i].split('=');
                if(ss[0] == key){
                    ret = true;
                    break;
                }
            }
        }else {
            strs = str.split('=');
            if(strs[0] == key)
                ret = true;
        }

        return ret;
    }
    return ret;
}

/**
 * 通过时间戳获取时间方法
 * unixTime  时间戳
 * isFull    格式 true 2001-10-10 10:20:30  false 2001-10-10 可以为空
 */
function getTime(unixTime, isFull){
    var time = new Date(unixTime);
    var ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    ymdhis += (time.getUTCMonth()+1) + "-";
    ymdhis += time.getUTCDate();
    if (isFull === true)
    {
        ymdhis += " " + time.getUTCHours() + ":";
        ymdhis += time.getUTCMinutes() + ":";
        ymdhis += time.getUTCSeconds();
    }
    return ymdhis;
}

/**
 * 获取cookie中的用户信息
 */
function getUserinfo(){
    var cookie_val = $.JSONCookie("userinfo");

    if (!cookie_val) {return null}

    if (!cookie_val.user || cookie_val.user.length == 0) {return null}

    return cookie_val.user[cookie_val.user.length - 1]
}

/**
 * 显示加载页面
 */
function showLoading(message){

    hideHUD();

    showInfo(message, 'images/loading_sprite.png', 'rgba(0, 0, 0, 0.8)', 'white', 'rgba(0, 0, 0, 0)', false);
}
/**
 * 显示成功提示
 */
function showSuccess(message) {
    hideHUD();

    showInfo(message, 'images/success.png', 'rgba(0, 0, 0, 0.8)', 'white', 'rgba(0, 0, 0, 0)', true);
}
/**
 * 没需求，先空着
 */
function showError(message) {}

/**
 * 隐藏HUD
 */
function hideHUD(){
    $('#loadingDiv').remove()
}

/**
 * 显示提示信息(可详细定制)
 * message: 展示文字
 * image: 展示图片(默认在不自动隐藏时，图片会顺时针转动)
 * frontColor: 前景色
 * textColor: 文字颜色
 * backgroundColor: 背景色
 * autoHide: 自动隐藏(默认为true，即2秒后自动隐藏)
 */
function showInfo(message, image, frontColor, textColor, backgroundColor, autoHide=true){

    hideHUD();

    var _PageHeight = $(document.body).height(),
        _PageWidth = $(document.body).width();

    var FrontInset = 15;//内嵌间距   文字和图片间距 *1.5

    var imageWH = image ? 46 : 0; //暂时设为固定值，图片大小
    var textFont = message ? 15 : 0; //文字大小

    var messageW = message ? message.length * textFont : 0;

    var frontW = Math.max(imageWH, messageW);

    var frontH = imageWH + textFont + (message ? FrontInset * 2 : 0) + (image ? FrontInset * 1.5 : 0);

    var _LoadingTop = (_PageHeight - frontH) / 2,
        _LoadingLeft = (_PageWidth - frontW - FrontInset * 2) / 2;

    var backgroundColor = backgroundColor ? backgroundColor : 'rgba(0, 0, 0, 0)';
    var textColor = textColor ? textColor : '#fff';
    var frontColor = frontColor ? frontColor : 'rgba(0, 0, 0, 0.8)';

    var backgroundStyle = 'position:fixed;' +
        'opacity:0;' +
        'left:0;' +
        'width:100%;' +
        'height:100%;' +
        'top:0;' +
        'background: '+backgroundColor+';' +
        'z-index:10000;';
    var frontStyle = 'position: absolute;' +
        ' cursor1: wait;' +
        ' left: ' + _LoadingLeft + 'px;' +
        ' top:' + _LoadingTop + 'px;' +
        ' width: auto;' +
        ' height: auto;' +
        ' padding-left: '+(FrontInset*2)+'px;' +
        ' padding-right: '+(FrontInset*2)+'px;' +
        ' border-radius: 5px;' +
        ' background-color: '+frontColor+';';
    var textStyle = 'color: '+textColor+';' +
        ' font-size: '+textFont+'px;' +
        ' font-family:\'Microsoft YaHei\';' +
        ' width: auto;' +
        ' height: '+(textFont+FrontInset*2)+'px;' +
        ' line-height: '+(textFont+FrontInset*2)+'px;' +
        ' text-align: center';
    var imageStyle = 'background-image: url('+image+');' +
        'background-size: cover;' +
        'width: '+imageWH+'px;' +
        'height: '+imageWH+'px;' +
        'margin-top: '+FrontInset+'px;' +
        'margin-bottom: '+(FrontInset/2)+'px;' +
        'margin-left: auto;' +
        'margin-right: auto';

    var backgroundHtml = '<header id="loadingDiv" style="'+backgroundStyle+'"></header>';

    var frontHtml = '<div style="'+frontStyle+'"></div>';

    var imageHtml = image ? '<div id="loadingImage" style="'+imageStyle+'"></div>' : '';

    var textHtml = message ? '<div style="'+textStyle+'">'+message+'</div>' : '';

    var _LoadingHtml = frontHtml.substr(0, frontHtml.length - '</div>'.length);
    _LoadingHtml += imageHtml;

    _LoadingHtml += textHtml + '</div>';


    _LoadingHtml = backgroundHtml.substr(0, backgroundHtml.length - '</header>'.length) + _LoadingHtml + '</header>';

    $('body').append(_LoadingHtml);

    $('#loadingDiv').animate({"opacity":"1"},200);

    if (autoHide) {
        window.setTimeout(function(){
            hideHUD()
        }, 2000)
    } else if (image) {
        var div = document.getElementById('loadingImage');
        div.style.animation = 'run 1s linear 0s infinite normal';
        var rule = '@keyframes run {\
                            from {}\
                            to {transform: rotate(200deg)}\
                        }';
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = rule;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

function fixString(str) {
    if (!str || str == 'null' || str == 'nil' || str == 'undefine'){
        return ''
    }
    return str
}