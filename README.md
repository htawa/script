# miu$script  
### *specterX ktst* :  
言の葉の樹の下で <http://lisge.com/>  
での戦闘ログをcsvで抽出するスクリプトです。  
jsです、tampermonkey(拡張)やブックマークレットあたりでお使い下さい。  

* _使い方_ :  
画面下部のログ取得を押して戦闘ログ取得します。
最後まで取得すると"specterX_ktst"と表示されるのでもう一度押すと画面が開きます。  

* _ログ情報_ :  
[target]-[user]-[key]-[subkey]-[prop]-[other]の繋がるパターンを取得します。  
何も選択しないと何も取得できません。  
スキル名とスキル効果でフィルタリングできます(正規表現化されます)。  
適当に名前をつけてプリセットに登録できます(削除で選択中のプリセットを削除)。  
syntaxに指定した構文でcsvに出力します(画面下記一覧からクリックでsyntaxに追加できます)。  

* _注意事項_ :  
他のスクリプトと干渉する事があります。  
chromeとfirefoxで動作確認。  
