/*
//var path = "/sdcard/脚本/test.js";
if(!files.exists(path)){
    toast("脚本文件不存在: " + path);
    exit();
}
*/
var window = floaty.window(
    <vertical>
        <button id="action" text="悬浮窗开" w="90" h="40" bg="#77ffffff"/>
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
    if (window.action.getText() == '悬浮窗开') {
        //  execution = engines.execScriptFile(path);
        console.show();
        window.action.setText('悬浮窗关');
    } else {
        //  if(execution){
        //     execution.getEngine().forceStop();
        //  }
        console.hide();
        window.action.setText('悬浮窗开');
    }
}
/*
var tk = [{
    "w": "习近平法治思想是习近平新时代中国特色社会主义思想的重要组成部分。",
    "x": "1",
    "d": "AB"
}]
*/
var tk = dttk("0dtgbtk.txt");
window.dt.click(function() {
    threads.start(function() {
        pp();
    })

})

function pp() {
    var tm = className("android.widget.TextView").id("tv_question").findOnce();
    if (tm != null) {
        var t = gl(tm.text());
        for (var i = 0; i < tk.length; i++) {
            if (t.indexOf(gl(tk[i].w)) != -1) {
                var s = tk[i].d;
                toastLog(tk[i].w + "\n" + s + "\n---------")
                for (var j = 0; j < s.length; j++) {
                    click(s.charAt(j));
                    sleep(1000);
                }
                break;
            }
        }
    }else{
        toastLog("请在答题页面!");
    }


}

function gl(text) {
    return text.replace(/[^\u4e00-\u9fa5]/g, '');
}

function dttk(tikues) {
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