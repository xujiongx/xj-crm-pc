/**
 * 加载 js 文件
 * @param url url
 * @param callback 加载完成回调
 */
export function loaded(url: string, callback?: () => void) {
  var script = document.createElement('script'),
    fn = callback || function () {};
  script.type = 'text/javascript';
  script.onload = function () {
    fn();
  };
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * 加载 js 文件
 * @param url url
 * @param callback 加载完成回调
 */
export function loadJS(url: string | string[], callback?: () => void) {
  if (Object.prototype.toString.call(url) === '[object Array]') {
    let index = 0;
    let len = url.length;
    for (var i = 0; i < url.length; i++) {
      loaded(url[i], () => {
        index++;
        if (index == len)
          try {
            callback && callback();
          } catch (e) {}
      });
    }
  } else if (typeof url == 'string') {
    loaded(url, callback);
  }
}

/** 下载js文件 */
