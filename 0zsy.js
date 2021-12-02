threads.start(function() {
    // sleep(1000);
    // click("立即开始");
    text("立即开始").findOne().click();

});

//截图请求
requestScreenCapture();
var zidian = tiku("tk题库.txt");
toastLog(zidian.length);

/*
//var path = "/sdcard/脚本/test.js";
if(!files.exists(path)){
    toast("脚本文件不存在: " + path);
    exit();
}
*/
var window = floaty.window(
    <vertical>
        <input id="w" text="" hint="" textSize="12sp"   bg="#77dddddd" lines="4"/>
        <input id="wb" text="" hint="" textSize="12sp"   bg="#77dddddd" lines="4"/>
        <button id="action" text="移动" w="90" h="40" bg="#77ffffff"/>
        <button id="dt" text="答题" w="90" h="40" bg="#77ffffff"/>
    </vertical>
);

setInterval(() => {}, 1000);

var execution = null;

//记录按键被按下时的触摸坐标
var x = 0,
    y = 0;
//记录按键被按下时的悬浮窗位置
var windowX, windowY;
//记录按键被按下的时间以便判断长按等动作
var downTime;

window.action.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            //如果按下的时间超过1.5秒判断为长按，退出脚本
            if (new Date().getTime() - downTime > 1500) {
                exit();
            }
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                onClick();
            }
            return true;
    }
    return true;
});

function onClick() {
    if (window.action.getText() == '移动') {
        //  execution = engines.execScriptFile(path);
        window.action.setText('停止运行');
    } else {
        if (execution) {
            execution.getEngine().forceStop();
        }
        window.action.setText('移动');
    }
}



function jietu(xx, yy, kk, gg) {
    var img = captureScreen();
    // var clip=images.clip(img, tis.left, tis.top, tis.width(), tis.height())
    var clip = images.clip(img, xx, yy, kk, gg)
    images.save(clip, "1.png","png", 100);
    // toastLog(t);
    var t = Baidu_OCR("1.png");

    // 回收图片
    img.recycle();
    clip.recycle();
    var aa = zl(t)
    return aa
}

function zl(ti) {
    return ti.replace(/[^\u4e00-\u9fa5]/g, ""); //字典只保留汉字。
}
//1.2获取问题。
function huoquwenti() {
    try {
        log("已点答题按键");
        var ti = className("android.widget.ListView").findOne(5000);
        var tis = ti.parent().bounds();
        // toastLog(tis);
        var t = jietu(tis.left, tis.top, tis.width(), 70);
        log(t);
        ui.run(function() {
            window.w.setText(">" + t);
        })
        var jie = ""; //建空列表,放结果
        for (var i = 0; i < zidian.length; i++) {
            var tks = zl(zidian[i].wenti);
            var jieguo = tks.indexOf(t); //问题匹配筛选。
            if (jieguo >= 0) {
                var jies = zidian[i].daan;
                jie += jies+"\n"; //结果放入列表。
            }
        }
        ui.run(function() {
            window.wb.setText(">" + jie);
        })
        log("答案:>>" + jie.slice(0, 50) + "<<\n"); //匹配字典答案结果。
    } catch (e) {
        ui.run(function() {
            window.w.setText("未获取");
        })
    }
}

/*

//此代码由飞云脚本圈整理提供（www.feiyunjs.com）
function Baidu_OCR(imgFile) {
    access_token = http.get("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=YIKKfQbdpYRRYtqqTPnZ5bCE&client_secret=hBxFiPhOCn6G9GH0sHoL0kTwfrCtndDj").body.json().access_token;
    url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic" + "?access_token=" + access_token;
    imag64 = images.toBase64(images.read(imgFile));
    res = http.post(url, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        image: imag64,
        image_type: "BASE64",
        language_type: "JAP"
    });
    str = JSON.parse(res.body.string()).words_result.map(val => val.words).join('\n');
    return str;
}
*/
//修改
function Baidu_OCR(imgFile) {
    access_token = http.get("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=YIKKfQbdpYRRYtqqTPnZ5bCE&client_secret=hBxFiPhOCn6G9GH0sHoL0kTwfrCtndDj").body.json().access_token;
    url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic" + "?access_token=" + access_token;
    imag64 = images.toBase64(images.read(imgFile), "png", 100);
    res = http.post(url, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        image: imag64,
        image_type: "BASE64",
        language_type: "CHN_ENG"
    });
    //  log(res.body.string());
    ///   str = JSON.parse(res.body.string()).words_result.map(val => val.words).join('\n');
    var strs = JSON.parse(res.body.string());
    var strss = strs["words_result"][0]["words"];
    log(strss);
    return strss;
}

//imgFile="/storage/emulated/0/脚本/1.png";

//imgFile="/storage/emulated/0/DCIM/Screenshots/Screenshot_20211201_094902.jpg";

//1打开题库。
function tiku(tikues) {
    try {
        var tikubl = tikues
        var file = open(tikubl, "r", "utf-8"); //读取文件的所有内容
        var text = file.read();
        var ytext = text.slice(0, 3)
        if (ytext.indexOf("[")) {
            var qukongge = text.replace(/\s/g, "");
            if (qukongge.length > 0) {
                var texts = qukongge.slice(0, text.length - 1);
                var ass = "[" + texts + "]";
                var zidians = eval('(' + ass + ')');
            }
        } else {
            var zidians = eval('(' + text + ')');
        }
        file.close();
        return zidians;

    } catch (e) {
        log("题库打开失败");
    }
}



window.dt.click(function() {
    threads.start(function() {

        huoquwenti();
    })
})