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
          <b>一覧</b><br>
          　<a href="${path}../reference/macro-inst">マクロと楽器</a><br>
          　<a href="${path}../reference/directive">ディレクティブ</a><br>
          　<a href="${path}../reference/command">コマンド</a>
        </div>
        <br>
        <a href="https://github.com/Tengu712/iam-mml">GitHub</a>
      </div>
    </div>
  `
}
