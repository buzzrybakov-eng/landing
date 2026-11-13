/* Применение настроек сайта «АМТ Ай».
   Настройки лежат в файле settings.json рядом с index.html:

     {
       "multilang": false
     }

   multilang:
     false — только русский язык, без иконок флагов (по умолчанию);
     true  — три языка (русский, казахский, английский),
             в шапке и подвале видны иконки флагов.

   Если файл настроек прочитать не удалось — действует режим
   по умолчанию: только русский язык. */
(function () {
  var scriptEl = document.currentScript;
  var settingsUrl = new URL('settings.json', scriptEl ? scriptEl.src : window.location.href);

  function applySettings(settings) {
    var multilang = !!(settings && settings.multilang === true);

    if (multilang) {
      /* мультиязычный режим: показываем иконки флагов */
      document.body.classList.add('multilang');
      return;
    }

    /* одноязычный режим: только русский язык */
    var ruLink = document.querySelector('link[rel="alternate"][hreflang="ru"]');

    /* убираем служебные ссылки на языковые версии */
    Array.prototype.forEach.call(
      document.querySelectorAll('link[rel="alternate"][hreflang]'),
      function (el) { el.parentNode.removeChild(el); }
    );

    /* если открыта не русская версия — переходим на русскую */
    if (document.documentElement.lang !== 'ru') {
      window.location.replace(ruLink ? ruLink.href : '../index.html');
    }
  }

  fetch(settingsUrl.href, { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('settings.json: HTTP ' + response.status);
      return response.json();
    })
    .then(applySettings)
    .catch(function () {
      applySettings(null); /* настройки не прочитались — режим по умолчанию */
    });
})();
