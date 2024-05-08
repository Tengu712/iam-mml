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
          　<a href="${path}../ebnf">EBNF</a>
        </div>
        <br>
        <div>
          <b>コマンド</b><br>
          　<a href="${path}../note">音符</a><br>
          　<a href="${path}../length">標準音価</a><br>
          　<a href="${path}../key">調号</a><br>
          　<a href="${path}../octave">オクターブ</a><br>
          　<a href="${path}../tempo">テンポ</a><br>
          　<a href="${path}../volume">音量</a><br>
          　<a href="${path}../instrument">音源</a>
        </div>
        <br>
        <div>
          <b>音源</b><br>
          　<a href="${path}../instrument/theory">理論</a><br>
          　<a href="${path}../instrument/grammer">文法</a>
        </div>
      </div>
    </div>
  `
}
