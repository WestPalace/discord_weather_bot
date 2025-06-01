function getWeatherPost() {
  const targetUrl = 'https://tenki.jp/indexes/dress/6/30/6200/27211/';
  var response1 = UrlFetchApp.fetch(targetUrl);
  var html = response1.getContentText();

  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1242708367995306014/K4a5M7XpUKLasM2lDR08LEkrRh0RHVebHJsxMgSZcZg4edBO2CGXFoC9D2xMmWBVZTOM";

  const url = "https://www.jma.go.jp/bosai/forecast/data/forecast/";
  const area = "270000"; // 大阪
  const response2 = UrlFetchApp.fetch(`${url}${area}.json`); 

  const json=JSON.parse(response2.getContentText());

  const reportDatetime = new Date(json[0]["reportDatetime"])

  embeds = []
  
  const loc = json[0].timeSeries[0].areas[0];
  if(loc.area.name == "大阪府"){
    today = new Date()
    const weatherCode = loc.weatherCodes[0];

    embeds[embeds.length] = {
      "title": `${today.getMonth() + 1}月${today.getDate()}日`,
      "description": extractWeather(html)[0],
      "color": 5829375,
      "thumbnail": {
        "url": extractWeatherIcon(html)[0]
      },
    }

    embeds[embeds.length] = {
      "title": `服装指数: ${extractNumbers(html)[1]}`,
      "description": `${extractComments(html)[1]}`,
      "color": 5829375,
      "thumbnail": {
        "url": extractUrl(html)[0]
      },
    }

    today.setDate(today.getDate() + 1)
  }

  //console.log(embeds);
  //console.log(json[0].timeSeries[0].areas[0].area.name);

  data = {
    "content": `茨木市の天気 ${today.getMonth() + 1}月${extractAnnouncement(html)[0]}`,
    "embeds": embeds
  }
  options =
  {
    "method" : "POST",
    'contentType': 'application/json',
    'payload' : JSON.stringify(data),
  };
  UrlFetchApp.fetch(DISCORD_WEBHOOK, options);
  
}

function extractAnnouncement(html) {
  var $ = Cheerio.load(html);
  
  // 指定したタグ要素を取得
  var elements = $('time.date-time');
  
  // 指定したタグ要素のテキストを格納する配列
  var texts = [];

  // 各指定したタグ要素のテキストを配列に追加
  elements.each((_, element) => {
    texts.push($(element).text());
  });
  
  texts = texts.map(str => {
    // 文字列が '0' で始まる場合、一文字目を削除する
    return str.startsWith("0") ? str.slice(1) : str;
  });

  return texts;
}

function extractNumbers(html) {
  var $ = Cheerio.load(html);
  
  // 指定したタグ要素を取得
  var elements = $('.indexes-telop-0');
  
  // 指定したタグ要素のテキストを格納する配列
  var texts = [];

  // 各指定したタグ要素のテキストを配列に追加
  elements.each((_, element) => {
    texts.push($(element).text());
  });

  return texts;
}

function extractComments(html) {
  var $ = Cheerio.load(html);
  
  // 指定したタグ要素を取得
  var elements = $('.indexes-telop-1');
  
  // 指定したタグ要素のテキストを格納する配列
  var texts = [];

  // 各指定したタグ要素のテキストを配列に追加
  elements.each((_, element) => {
    texts.push($(element).text());
  });
  
  return texts;
}

function extractUrl(html) {
  var $ = Cheerio.load(html);
  
  // 指定したタグ要素を取得
  var elements = $('.daytime-icon img');
  
  // 指定したタグ要素のテキストを格納する配列
  var texts = [];

  // 各指定したタグ要素のテキストを配列に追加
  elements.each((_, element) => {
    texts.push($(element).attr('src'));
  });

  return texts;
}

function extractWeather(html) {
  var $ = Cheerio.load(html);
  
  // 指定したタグ要素を取得
  var elements = $('p.weather-icon img');
  
  // 指定したタグ要素のテキストを格納する配列
  var texts = [];

  // 各指定したタグ要素のテキストを配列に追加
  elements.each((_, element) => {
    texts.push($(element).attr('alt'));
  });
  
  return texts;
}

function extractWeatherIcon(html) {
  var $ = Cheerio.load(html);
  
  // 指定したタグ要素を取得
  var elements = $('p.weather-icon img');
  
  // 指定したタグ要素のテキストを格納する配列
  var texts = [];

  // 各指定したタグ要素のテキストを配列に追加
  elements.each((_, element) => {
    texts.push($(element).attr('src'));
  });
  
  return texts;
}
