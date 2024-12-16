if (hljs) {
  hljs.registerLanguage("mml", function(hljs) {
    return {
      contains: [
        {
          className: "comment",
          begin: /^;/,
          end: /$/,
          relevance: 0
        }
      ]
    }
  })
}

function createMenu(path) {
  const menu = document.getElementById("menu")
  menu.innerHTML = `
    <div id="sidebar-wrapper">
      <div id="sidebar">
        <div>
          <b>IAM.mml Docs</b>
        </div>
        <br>
        <div>
          <b>一般</b><br>
          　<a href="${path}../about">IAM.mmlとは？</a><br>
          　<a href="${path}../releasenote">リリースノート</a>
        </div>
        <br>
        <div>
          <b>学習</b><br>
          　<a href="${path}../learning/cdefgab">1.ドレミファソラシ</a><br>
          　<a href="${path}../learning/commands">2.各種コマンド</a><br>
          　<a href="${path}../learning/directive">3.ディレクティブ</a><br>
          　<a href="${path}../learning/instrument">4.楽器定義</a>
        </div>
        <br>
        <div>
          <b>一覧</b><br>
          　<a href="${path}../reference/macro-inst">マクロと楽器</a><br>
          　<a href="${path}../reference/directive">ディレクティブ</a><br>
          　<a href="${path}../reference/command">コマンド</a>
        </div>
        <br>
        <div>
          <b>理論</b><br>
          　<a href="${path}../theory/synthesize">シンセサイズ</a>
        </div>
        <br>
        <a href="https://github.com/Tengu712/iam-mml">GitHub</a>
      </div>
    </div>
  `
}
