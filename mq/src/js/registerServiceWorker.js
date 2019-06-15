const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (isLocalhost) {
        checkValidServiceWorker(swUrl); 
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '这个web应用程序应先提供缓存服务。更多： https://goo.gl/SC7cgQ'   
          );
        });
      } else {    
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {            
              console.log('新内容可用,请刷新.');
            } else {
              console.log('缓存内容以供脱机使用.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('服务注册错误:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  // 检查是否可以找到服务。如果它不能就重新加载页面。
  fetch(swUrl)
    .then(response => {
      // 确保服务的存在
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // 没有找到服务。可能是不同的应用。重新加载页面。
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 	找到服务
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        '没有互联网连接，应用程序正在脱机模式下运行.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
