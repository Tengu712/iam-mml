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
          　<a href="${path}../releasenote">リリースノート</a><br>
          　<a href="${path}../ebnf">EBNF</a>
        </div>
        <br>
        <div>
          <b>コマンド</b><br>
          　<a href="${path}../command/note">音符</a><br>
          　<a href="${path}../command/length">標準音価</a><br>
          　<a href="${path}../command/key">調号</a><br>
          　<a href="${path}../command/octave">オクターブ</a><br>
          　<a href="${path}../command/tempo">テンポ</a><br>
          　<a href="${path}../command/volume">音量</a><br>
          　<a href="${path}../command/instrument">音源</a>
        </div>
        <br>
        <div>
          <b>音源</b><br>
          　<a href="${path}../instrument/tutorial">チュートリアル</a><br>
          　<a href="${path}../instrument/theory">理論</a><br>
          　<a href="${path}../instrument/grammer">文法</a>
        </div>
      </div>
    </div>
  `
}
