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
          <b>学習</b><br>
          　<a href="${path}../learning/screen/">画面の見方</a><br>
          　<a href="${path}../learning/sample">サンプルコード</a><br>
          　<a href="${path}../learning/tutorial-score">楽譜定義</a><br>
          　<a href="${path}../learning/tutorial-inst">音源定義</a>
        </div>
        <br>
        <div>
          <b>楽譜</b><br>
          　<a href="${path}../score/grammer">文法</a>
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
          　<a href="${path}../command/instrument">音源</a><br>
          　<a href="${path}../command/macro">マクロ</a><br>
          　<a href="${path}../command/loop">ループ</a>
        </div>
        <br>
        <div>
          <b>音源</b><br>
          　<a href="${path}../instrument/theory">理論</a><br>
          　<a href="${path}../instrument/grammer">文法</a>
        </div>
        <br>
        <a href="https://github.com/Tengu712/iam-mml">GitHub</a>
      </div>
    </div>
  `
}
