document.addEventListener("DOMContentLoaded", () => {
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
					　<a href="../about">IAM.mmlとは？</a><br>
					　<a href="../ebnf">EBNF</a>
				</div>
				<br>
        <div>
				  <b>コマンド</b><br>
					　<a href="../note">音符</a><br>
					　<a href="../length">標準音価</a><br>
					　<a href="../key">調号</a><br>
					　<a href="../octave">オクターブ</a><br>
					　<a href="../tempo">テンポ</a><br>
					　<a href="../volume">音量</a>
				</div>
			</div>
    </div>
  `
})
