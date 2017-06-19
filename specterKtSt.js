// ==UserScript==
// @name         specterKtSt
// @namespace    _specterKtSt
// @version      0.1.0
// @description  ktstのログに色々書き加えていくスクリプト。
// @author       ssz
// @match        http://lisge.com/kk/k/*
// @match        http://lisge.com/kk/tb/*
// @match        http://lisge.com/kk/br/*
// @updataURL    https://raw.githubusercontent.com/htawa/script/master/specterKtSt.js
// @grant        none
// ==/UserScript==

(function(){
"use strict";
var miu$ = {};
const Scriptname = "specterX",
	Version = "ktst0.5",
	Errtitle = `ERROR ${Scriptname} ${Version} : `,
	Autoload = false,
	Bit = 32,
	//css
	zIndex = 156,
	Borderline = "solid 1px rgb(0,0,0)";
console.log(Errtitle);

/*

※注釈
※同名キャラがいる場合は使えません。
※同一キャラの同名スキルは判別できません。
※取得していないログ
	（キャラ）の（スキル）が消滅！
	行動終了時の＜なんとかかんとかが消滅＞
	離脱メッセージ

※取得出来ていないログ
	*なんかあれば
	*スキルの語尾に（にゃー）とかついてるとダメかも

※正確に取得出来ないスキル
	ソルプレッサ

※表示していない効果
	盾

*/


miu$._GetStatus = {};

//////////////////////////////////////////////////////////////
// skill
//

miu$._Skill = {};

miu$._Skill.list = function() {
	this.list = list();
	//スキルリスト {"Flag-fuyo": };
	//["スキル名"]["Flag-fuyo"] = true or false 付与スキルの場合true
	//["スキル名"][0] = [prop] or false ここで指定したログから順番に「効果がなかった」の判別。falseはスキルの発動から。
	//["スキル名"][1] = 差し込むステータス。"AT"等、ログの発生順。
	//[乗算係数, 加算係数, lv係数, 付与フラグ, 人数補正]
	//[上昇低下フラグ, [prop], key, key, ...];
};

miu$._Skill.list.prototype.list = function() {
	var res = {};
	res["攻撃"] = {"Flag-fuyo": true, "typejs": [false,false,["key",0],["key",1]], "typeconv": [false,["key",0]], "AT": [0.015,0,10,""], "MAT": [0.015,0,10,""]};
	return res;
};

//////////////////////////////////////////////////////////////
// flag
//

miu$._Flag = {};

miu$._Flag.SET = function() {
	var array = [], i;
	for(i = 0; i < Bit; ++i) array[i] = 1 << i;
	return array;
};

miu$._Flag.GET = new miu$._Flag.SET();

miu$._Flag.addressList = function() {
	this.key = this.keylist();
	this.subkey = this.subkeylist();
	this.prop = this.proplist();
};

miu$._Flag.addressList.prototype.keylist = function() {
	var res = []; //[タグ,表示用]
	res[0] = ["AT", "AT"];
	res[1] = ["MAT", "MAT"];
	res[2] = ["DF", "DF"];
	res[3] = ["MDF", "MDF"];
	res[4] = ["HIT", "HIT"];
	res[5] = ["MHIT", "MHIT"];
	res[6] = ["EVA", "EVA"];
	res[7] = ["MEVA", "MEVA"];
	res[8] = ["HEAL", "HEAL"];
	res[9] = ["SPD", "SPD"];
	res[10] = ["CRI", "CRI"];
	res[11] = ["連続", "連続"];
	res[12] = ["MHP", "MHP"];
	res[13] = ["HP", "HP"];
	res[14] = ["MSP", "MSP"];
	res[15] = ["SP", "SP"];
	res[16] = ["yHeal", "与HEAL"];
	res[17] = ["hHeal", "被HEAL"];
	res[18] = ["yDam", "与DAM"];
	res[19] = ["hDam", "被DAM"];
	res[20] = ["Hate", "Hate"];
	res[21] = ["消費SP", "消費SP"];
	res[22] = ["射程", "射程"];
	res[23] = ["隊列", "隊列"];
	res[24] = ["軽減率", "軽減率"];
	res[25] = ["付与lv", "付与lv"];
	res[26] = ["変調特性", "変調特性"];
	res[27] = ["変調耐性", "変調耐性"];
	res[28] = ["変調防御", "変調防御"];
	res[29] = ["変調深度", "変調深度"];
	res[30] = ["afterAction", "action"];
	res[31] = ["unknown", "unknown"];
	return res;
};

miu$._Flag.addressList.prototype.subkeylist = function() {
	var res = [];
	res[0] = ["祝", "祝福"];
	res[1] = ["護", "加護"];
	res[2] = ["毒", "猛毒"];
	res[3] = ["衰", "衰弱"];
	res[4] = ["痺", "麻痺"];
	res[5] = ["乱", "混乱"];
	res[6] = ["呪", "呪縛"];
	res[7] = ["魅", "魅了"];
	res[8] = ["TstartEnd", "T開始時後"];
	res[9] = ["ActionEnd", "A行動後"];
	res[10] = ["ATurnEnd", "T行動後"];
	res[11] = ["unknown", "unknown"];
	return res;
};

miu$._Flag.addressList.prototype.proplist = function() {
	var res = [];
	res[0] = ["ダメージ", "ダメージ"];
	res[1] = ["回復", "回復"];
	res[2] = ["回避", "回避"];
	res[3] = ["効果なし", "効果なし"];
	res[4] = ["増加", "増加"];
	res[5] = ["減少", "減少"];
	res[6] = ["上昇", "上昇"];
	res[7] = ["低下", "低下"];
	res[8] = ["奪取", "奪取"];
	res[9] = ["強奪", "強奪"];
	res[10] = ["強化", "強化"];
	res[11] = ["弱化", "弱化"];
	res[12] = ["追加", "変調追加"];
	res[13] = ["軽減", "変調軽減"];
	res[14] = ["抵抗", "変調抵抗"];
	res[15] = ["変調防御", "変調防御"];
	res[16] = ["unknown", "unknown"];
	return res;
};


//////////////////////////////////////////////////////////////
// state
//

miu$._DATAstate = {};

miu$._DATAstate.PC = function(name, eno, ptid, mhp, msp, psp, gensui, i) {
	this.Eno = eno;
	this.Name = name;
	this.PTid = ptid;
	this.startMHP = mhp;
	this.startMSP = msp;
	this.PSP = psp;
	this["減衰率"] = gensui;
	this.status = new miu$._DATAstate.stA(5,5,5,5,5,5);
	this.statusBt = new miu$._DATAstate.stC();
	this.flagindex = i;
	this.skill = {};
};

miu$._DATAstate.stA = function(sa, sb, sc, sd, se, sf) {
	this["ST"] = sa;
	this["AG"] = sb;
	this["DX"] = sc;
	this["IN"] = sd;
	this["VT"] = se;
	this["MN"] = sf;
};

miu$._DATAstate.stB = function(mhp, msp) {
	this.yDam = 0;
	this.hDam = 0;
	this.yHeal = 0;
	this.hHeal = 0;
	this.Impact = 0;
	this.state = new miu$._DATAstate.stBstate(mhp, msp);
	this["変調深度"] = new miu$._DATAstate.hentyo();
	this["変調防御"] = new miu$._DATAstate.hentyo();
	this.per = new miu$._DATAstate.stBper();
	this.shield = 0;
	this.fuyoLv = {};
	this.goei = {};
	this["隊列"] = 0;
	this["射程"] = 0;
};

miu$._DATAstate.stBstate = function(mhp, msp) {
	this.HP = mhp;
	this.MHP = mhp;
	this.SP = msp;
	this.MSP = msp;
	this.AT = 0;
	this.MAT = 0;
	this.DF = 0;
	this.MDF = 0;
	this.EVA = 0;
	this.MEVA = 0;
	this.HIT = 0;
	this.MHIT = 0;
	this.SPD = 0;
	this.CRI = 0;
	this.HEAL = 0;
};

miu$._DATAstate.stBper = function() {
	this.AT = [0, 0]; //[%, turn]
	this.MAT = [0, 0];
	this.DF = [0, 0];
	this.MDF = [0, 0];
	this.EVA = [0, 0];
	this.MEVA = [0, 0];
	this.HIT = [0, 0];
	this.MHIT = [0, 0];
	this.SPD = [0, 0];
	this.CRI = [0, 0];
	this.HEAL = [0, 0];
};

miu$._DATAstate.hentyo = function() {
	this["毒"] = 0;
	this["衰"] = 0;
	this["痺"] = 0;
	this["魅"] = 0; 
	this["呪"] = 0;
	this["乱"] = 0;
	this["祝"] = 0;
	this["護"] = 0;
};

miu$._DATAstate.stC = function() {
	Object.keys(new miu$._DATAstate.St_ofTime()).forEach((v) => {
		this[v] = 0;
	});
};

miu$._DATAstate._update = function(num, add) {
	num += add;
	if(num < 0) num = 0;
	return num;
};

miu$._DATAstate.stBper.prototype.Reset = function(key) {
	this[key][0] = 0;
};

miu$._DATAstate.stBper.prototype.Aend = function() {
	Object.keys(this).forEach((key) => {
		if(this[key][0]) {
			--this[key][1];
			if(!this[key][1]) this.Reset(key);
		}
	});
};

miu$._DATAstate.hentyo.prototype.Aend = function() {
	Object.keys(this).forEach((key) => {
		if(this[key] > 0) --this[key];
	});
};

miu$._DATAstate.PC.prototype.stBtReset = function() {
	var list = new miu$._DATAstate.St_ofTime(),
		st = {};
	Object.keys(this.status).forEach((key) => {
		st[key] = (this.status[key] >= 1) ? Math.max(Math.floor(Math.pow(this.status[key] - 1, 1.66) / 10 * this["減衰率"] + 1.005), 2) : 0;
	});
	Object.keys(this.statusBt).forEach((key) => {
		var a = Object.keys(st).reduce((pre, v) => {
			return st[v] * list[key][v] + pre;
		}, 0);
		this.statusBt[key] = (a + list[key]["固定値"]) * list[key]["倍率"];
	});
};

miu$._DATAstate.St_ofTime = function() {
	this.MHP = {"ST": 4, "AG": 1, "DX": 2, "IN": 1, "VT": 8, "MN": 2, "固定値": 120, "倍率": 12},
	this.MSP = {"ST": 1, "AG": 1, "DX": 3, "IN": 4, "VT": 2, "MN": 7, "固定値": 100, "倍率": 1},
	this.AT = {"ST": 12, "AG": 0, "DX": 6, "IN": 0, "VT": 0, "MN": 0, "固定値": 100, "倍率": 1},
	this.MAT = {"ST": 0, "AG": 0, "DX": 0, "IN": 12, "VT": 0, "MN": 6, "固定値": 100, "倍率": 1},
	this.DF = {"ST": 5, "AG": 0, "DX": 0, "IN": 0, "VT": 10, "MN": 3, "固定値": 100, "倍率": 1},
	this.MDF = {"ST": 2, "AG": 0, "DX": 0, "IN": 10, "VT": 2, "MN": 4, "固定値": 100, "倍率": 1},
	this.HIT = {"ST": 1, "AG": 4, "DX": 10, "IN": 0, "VT": 3, "MN": 0, "固定値": 100, "倍率": 1},
	this.MHIT = {"ST": 0, "AG": 0, "DX": 0, "IN": 0, "VT": 0, "MN": 0, "固定値": 100, "倍率": 1},
	this.EVA = {"ST": 1, "AG": 11, "DX": 2, "IN": 2, "VT": 2, "MN": 0, "固定値": 100, "倍率": 1},
	this.MEVA = {"ST": 1, "AG": 8, "DX": 1, "IN": 3, "VT": 1, "MN": 4, "固定値": 100, "倍率": 1},
	this.SPD = {"ST": 3, "AG": 11, "DX": 0, "IN": 2, "VT": 1, "MN": 1, "固定値": 100, "倍率": 1},
	this.CRI = {"ST": 0, "AG": 0, "DX": 0, "IN": 0, "VT": 0, "MN": 0, "固定値": 100, "倍率": 1},
	this.HEAL = {"ST": 1, "AG": 0, "DX": 3, "IN": 2, "VT": 6, "MN": 6, "固定値": 100, "倍率": 1}
};

//////////////////////////////////////////////////////////////
// regexp
//

miu$._REG = {};

miu$._REG.hentyo = function() {
	this.list = /[毒衰痺魅呪乱祝護]/;
	this.type = /.*(毒|衰|痺|魅|呪|乱|祝|護).*/;
	this.keys = {"変調防御": /防御効果/, "変調特性": /特性/, "変調耐性": /耐性/, "変調深度": /^を|^に|深度/};
};

miu$._REG.script = function(RegPCstr) {
	this.nTrim = new RegExp("(" + RegPCstr + ")");
	this.action = new miu$._REG.action(RegPCstr);
	this.damage = new miu$._REG.damage(RegPCstr);
	this.effect = new miu$._REG.effect();
};

miu$._REG.action = function(RegPCstr) {
	this.L = new RegExp("(" + RegPCstr + ")のリンクスキルが発動！！$");
	this.n = new RegExp("▼(" + RegPCstr + ")の(行動|連続行動)！\\((\\d+)\\)(.*)");
	this.P = new RegExp("(" + RegPCstr + ")の(.+)$");
	this.Mc = new RegExp("連続行動がキャンセル！！$");
	this.Md = new RegExp("猛毒により\\s(\\d+)\\sのダメージ！MHPが\\s(\\d+)\\s減少！$");
};

miu$._REG.damage = function(RegPCstr) {
	this.trimE = new RegExp("(" + RegPCstr + ")(の|は|に|から|には)(.*)?$");
	this.Critical = new RegExp("(Critical Hit!!)$");
	this.Tate = new RegExp("盾により(" + RegPCstr + ")への攻撃ダメージが無効化！（盾：(\\d+)→(\\d+)）$");
	this.Kata = new RegExp("(" + RegPCstr + ")への攻撃を(" + RegPCstr + ")が庇った！$");
	this.TateKaihi = new RegExp("盾回避！$");
	this.skillef = new RegExp("^([自|味|敵].?)(\\d+)?\\:(.*)！$");
};

miu$._REG.effect = function() {
	this.Status = new RegExp("^(.?AT|.?DF|.?HIT|.?EVA|SPD|CRI|HEAL)(が|を)(.+)！$");
	this.StatusKJ = new RegExp("^\\s*(.?AT|.?DF|.?HIT|.?EVA|SPD|CRI|HEAL)(\\d+)％(強化|弱化)");
	this.StatusHS = new RegExp("^(M?HP|M?SP)?(が|を|に)?\\s*(\\d+)\\s*(.+?)！\\s*(.+?！)?$");
	this.yhHeal = new RegExp("(使う|受ける)スキルによるHP回復量が(.+)！$");
	this.yhDam = new RegExp("^次に(受ける|与える)攻撃ダメージへの補正が\\s*");
	this.Hentyo = new RegExp("^(猛毒|衰弱|麻痺|魅了|呪縛|混乱|祝福|加護)(を|に|への防御効果.|特性が|耐性が|深度が|深度を)(\\d*)(.*)！$");
	this.Renzok = new RegExp("次の連続行動が(早く|遅く)なったかも！$");
	this.syatai = new RegExp("^(射程|隊列)(が)(\\d+).*になった！$");
	this.shield = new RegExp("盾(が|を)\\s*(\\d*)\\s*(.+)！$");
	this.nasi = new RegExp("何の効果もなかった！$");
	this.kaihi = new RegExp("攻撃を回避！$");
	this.hate = new RegExp("狙われ(にくく|やすく)なった！$");
	this.fuyoLv = new RegExp("^\\s*(.+)LVが?\\s\\s(\\d+)\\s\\sが?(.+)！$");
	this.useSp = new RegExp("消費SPが\\s*(\\d+)\\s*(.+)！$");
	this.keigen = new RegExp("(受ける)HP減少/奪取効果が(.+)！$");
	this.impact = new RegExp("衝撃でよろめいた！$");
	this.goei = new RegExp("対する攻撃を\\s*(\\d+)\\s*回護衛！");
};

miu$._REG.checker = function() {
	this.RegStr = /[\(\)]|[\[\]]|[\\\^\$\*\+\?\.]/;
	this.checkReg = /[\(.*?\)]|[\[.*?\]]|[\\\^\$\*\+\?\.]/;
	this.RegCut = /([\(\)]|[\[\]]|[\\\^\$\*\+\?\.])/;
};

//////////////////////////////////////////////////////////////
// data
//

miu$._LOGdata = {};

miu$._LOGdata.init = function() {
	this.character = {};
	this.acterTable = [];
	this.log = [];
	this.sList = {};
};

miu$._LOGdata.init.prototype.createC = function(elem) {
	var ch = new miu$._GETlog.characterTable(elem, 0),
		tag = new miu$._GETlog.indexlist(),
		resultacter = {},
		resultTable = [],
		membercount = 0;
	ch.character.forEach((val, i) => {
		var ptid = i;
		resultTable[ptid] = [];
		val.forEach((val, i) => {
			++membercount;
			resultacter[val[tag.name]] = new miu$._DATAstate.PC(val[tag.name], val[tag.eno], ptid, val[tag.mhp], val[tag.msp], val[tag.psp], 1.00, membercount);
			resultacter[val[tag.name]].stBtReset();
			resultTable[ptid][i] = val[tag.name];
		});
	});
	this.character = resultacter;
	this.acterTable = resultTable;
	return true;
};

miu$._LOGdata.init.prototype.createL = function(elem) {
	var ch = new miu$._GETlog.characterTable(elem, 0),
		reg = new miu$._REG.checker(),
		tST = {},
		result = [],
		RegPCstr = "",
		msg, i;
	Object.keys(this.character).forEach((name) => {
		tST[name] = new miu$._DATAstate.stB(this.character[name].startMHP, this.character[name].startMSP);
		RegPCstr += miu$._LOGdata.regstr(name, reg) + "|";
	});
	RegPCstr = RegPCstr.substr(0, RegPCstr.length - 1);
	reg = new miu$._REG.script(RegPCstr);
	for(i = 0; (i < elem.length) && ch.character.length; ++i) {
		console.log(i + " turn : ");
		ch = new miu$._GETlog.characterTable(elem, i);
		ch.character.forEach((v) => {
			v.forEach((v) => {
				tST[v[1]]["変調深度"] = v[2];
			});
		});
		msg = new miu$._GETlog.messageTable(elem, i, reg, tST);
		result[i] = {"pt": miu$._GETlog.NoP(ch.character), "log": msg.msg};
	}
	i = result.findIndex((v) => {return v.pt.some((v) => {return !v});});
	if(i > 0) result.splice(i, result.length - i);
	console.log("戦闘終了");
	console.log(tST);
	this.log = result;
	return true;
};

miu$._LOGdata.init.prototype.createS = function() {
	this.log.forEach((v) => {
		console.log("createS",v.log);
		var dada = this.makeSkillContainer(v.log, "");
		console.log("dsafas",dada);
	});
	return true;
};
	//変調変換数差し込み,効果がなかったステータスの差し込み,増減スキル抽出,スキル抽出
miu$._LOGdata.init.prototype.makeSkillContainer = function(logdata, id) {
	var container = [], type;
	((v) => {
		type = (Array.isArray(v));
		if(!type && typeof v.id !== "undefined") {
			id = v.id;
			if(!this.character[v.user].skill[id]) this.character[v.user].skill[id] = v; //スキル抽出
		}
	})(logdata[0]);
	logdata.forEach((v, i) => {
		if(Array.isArray(v)) { //array
			container[i] = this.makeSkillContainer(v, id);
		} else { //obj
			container[i] = [v.prop, v.key, v.subkey, v.add];
		}
	});
	if(type) {
		return container;
	} else {
		this.getNoEffectAndConvert(logdata, id, container);
	}
	return false; //階層check終了
};

miu$._LOGdata.init.prototype.getNoEffectAndConvert = function(logdata, id, ctr) {
	console.log("ctr",id,ctr);
	var defS = {},
		defS = defS[id],
		bool = (typeof defS !== "undefined");
	ctr.forEach((v) => {
		if(Array.isArray(v) && miu$._LOGdata.checkFlag(v[0], "prop", [3,4,5,6,7,8,9])) {
			console.log("ctr[i]",id,v);
			console.log("true");
			if(typeof this.sList[id] === "undefined") {
				this.sList[id] = {};
				if(bool) this.sList[id]["Flag-fuyo"] = defS["Flag-fuyo"]; //付与flag
				this.sList[id][v[1]] = (bool) ? (typeof defS[v[1]] !== "undefined") ? defS[v[1]] : [0,0,0,""] : [0,0,0,""];
			} else {
				this.sList[id][v[1]] = (bool) ? (typeof defS[v[1]] !== "undefined") ? defS[v[1]] : [0,0,0,""] : [0,0,0,""];
			}
		}
	});
	if(bool && typeof defS["typejs"] !== "undefined") { //上昇低下
		this.getNoEffect(logdata, defS, ctr);
	}
	if(bool && typeof defS["typeconv"] !== "undefined") { //変調変換
		
	}
};

miu$._LOGdata.init.prototype.getNoEffect = function(logdata, defS, ctr) {
	ctr.forEach((v) => {
		if(Array.isArray(v)) {
			if(defS["typejs"][1]);
		}
	});
};

miu$._LOGdata.init.prototype.getConvert = function() {

};

miu$._LOGdata.checkFlag = function(check, type, li) {
	var f = new miu$._Flag.addressList(),
		get, i, len = li.length; //効果なし,増加,減少,上昇,低下,奪取,強奪
	li.forEach((v) => { get |= miu$._Flag.GET[v]; });
	i = f[type].findIndex((v) => { return (v[0] === check); });
	return (miu$._Flag.GET[i] & get) ? true : false;
};

miu$._LOGdata.regstr = function(str, reg) {
	var result = str;
	if(reg.checkReg.test(str)) {
		result = "";
		str = str.split(reg.RegCut);
		str.forEach((val) => {
			if(reg.RegStr.test(val)) {
				val = "\\" + val;
			}
			result += val;
		});
	}
	return result;
};

//////////////////////////////////////////////////////////////
// log
//

miu$._GETlog = {};

miu$._GETlog.NoP = function(mem) {
	var x = [];
	mem.forEach((val) => {
		x.push(val.length);
	});
	return x;
};

miu$._GETlog.indexlist = function() {
	this.tairetu = 0;
	this.name = 1;
	this.hentyo = 2;
	this.mhp = 3;
	this.msp = 4;
	this.psp = 5;
	this.eno = 6;
};

miu$._GETlog.infoStatus = function(name, tST) {
	var obj = JSON.parse(JSON.stringify(tST[name]));
	delete obj.shield;
	delete obj["変調防御"];
	return obj;
};

//////要素のフィルタリング/////////////////////////////////////
miu$._GETlog.getIndex = function(elem, name, str) {
	str = new RegExp(str);
	return Array.from(elem).findIndex((v) => {
		return str.test(v[name]);
	});
};

miu$._GETlog.getNode = function(elem, name, str) {
	str = new RegExp(str);
	return Array.from(elem).filter((v) => {
		return str.test(v[name]);
	});
};

miu$._GETlog.splitGetNode = function(elem, name, str) {
	var result = [[],[]];
	str = new RegExp(str);
	Array.from(elem).forEach((v) => {
		result[(str.test(v[name])) ? 0 : 1].push(v);
	});
	return result;
};

//////ターン毎の人数,変調,MHP,MSPを取得/////////////////////////
miu$._GETlog.characterTable = function(tElem, tNum) {
	this.character = this.Turn(tElem, tNum);
};

miu$._GETlog.characterTable.prototype.Turn = function(tElem, tNum) {
	var tTable = tElem[tNum][0].getElementsByTagName('table');
	tTable = [tTable[2], tTable[3]];
	return tTable.map((v,i) => {
		return Array.from(v.getElementsByTagName('tr')).map((v) => {
			return this.parseText(miu$._GETlog.splitGetNode(v.getElementsByTagName('td'), 'className', "F2"), i);
		});
	});
};

miu$._GETlog.characterTable.prototype.parseText = function(e, i) {
	var str = [],
		tag = new miu$._GETlog.indexlist(),
		cache;
	cache = e[1][0].align;
	str[tag.tairetu] = (cache === "CENTER") ? 2 : (cache === "RIGHT") ? (i) ? 3 : 1 : (i) ? 1 : 3;
	e = miu$._GETlog.splitGetNode(e[0][0].children, 'className', 'LKG\\d+');
	str[tag.psp] = parseInt(e[0][0].className.split(/(\d+)/)[1], 10);
	e = miu$._GETlog.splitGetNode(e[1], 'nodeName', 'BR')[1];
	e = miu$._GETlog.splitGetNode(e, 'nodeName', 'IMG')[1];
	cache = e[e.length - 1].textContent.split(/(\d+$)/);
	str[tag.msp] = parseInt(cache[1], 10);
	--e.length;
	cache = e[e.length - 1].textContent.split(/(\d+$)/);
	str[tag.mhp] = parseInt(cache[1], 10);
	--e.length;
	e = miu$._GETlog.splitGetNode(e, 'nodeName', 'SPAN');
	str[tag.name] = e[1][0].textContent;
	if(e[1][0].nodeName === "A") {
		cache = e[1][0].href.split(/id=(\d+)/);
		str[tag.eno] = parseInt(cache[1], 10);
	} else {
		str[tag.eno] = 0;
	}
	str[tag.hentyo] = this.hentyo(e[0]);
	return str;
};

miu$._GETlog.characterTable.prototype.hentyo = function(hnty) {
	var res = new miu$._DATAstate.hentyo();
	hnty.forEach((v) => {
		var s = v.textContent.split(/(\d+)/);
		res[s[0]] = parseInt(s[1], 10);
	});
	return res;
};

//////ターン毎のログを取得//////////////////////////////////////
miu$._GETlog.messageTable = function(tElem, tNum, reg, tST) {
	this.msg = this.Turn(tElem, tNum, reg, tST);
};

miu$._GETlog.messageTable.prototype.Turn = function(tElem, tNum, reg, tST) {
	var result = [],
		response = new String(tNum),
		funcTurnName = function(searchName) {
			var i, len = searchName.length;
			if(Array.isArray(searchName)) {
				for(i = 0; i < len; ++i) {
					if(searchName[i]) return funcTurnName(searchName[i]);
				}
			} else {
				return searchName.user;
			}
			return false;
		},
		UndefinedArray = function(logdata) {
			var i;
			for(i = 0; i < logdata.length; ++i) {
				while(!logdata[i] && i < logdata.length) logdata.splice(i, 1);
				if(Array.isArray(logdata[i])) UndefinedArray(logdata[i]);
				if(Array.isArray(logdata[i]) && !logdata[i].length) logdata.splice(i, 1);
			}
			return logdata;
		};
	tElem = tElem[tNum].map((v) => { return v; });
	tElem.forEach((v,i) => {
		((response) => {
			var idx = [0], user;
			v = (i) ? v.getElementsByTagName('td')[0].children[0] : v.getElementsByTagName('td')[0].lastElementChild;
			if(this.Acheck(miu$._GETlog.getNode(v.children, 'nodeName', 'B'))) {
				//console.log("A行動");
				result[i] = ((res, elem) => {
					var sName, msg, len;
					for(idx[0] = 0, len = elem.length; idx[0] < len; ++idx[0]) {
						sName = {"user": false, "id": false, "slv": false};
						msg = elem[idx[0]].textContent.split(/\n/);
						res[idx[0]] = this.checkSkill(elem[idx[0]], msg, reg, tST, sName, idx, response + "," + idx[0])[0];
					}
					return res;
				})([], miu$._GETlog.splitGetNode(v.children, 'nodeName', 'BR')[1]);
				//A行動終了
				user = funcTurnName(result[i]);
				tST[user]["変調深度"].Aend();
				tST[user].per.Aend();
				tST[user].Impact = 0;
				((arr, i) => {
					for(; i < arr.length; ++i) {
						if(!arr[i]) arr.splice(i, 1);
						if(arr[i].length === 1 && Array.isArray(arr[i][0]) && Array.isArray(arr[i][0][0]) && arr[i][0][0][0].type === "A") arr[i].push({"user": user, "key": "afterAction", "subkey": "ActionEnd"});
						if(!arr[i][0]) arr.splice(i, 1);
					}
				})(result[i], 0);
				result[i].push({"user": user, "key": "afterAction", "subkey": "ATurnEnd"});
			} else {
				//console.log("開始時,離脱時");
				result[i] = ((res, elem) => {
					elem.forEach((v,i) => {
						var sName = {"user": false, "id": false, "slv": false},
							msg = v.textContent.split(/\n/);
						res[i] = this.checkSkill(v, msg, reg, tST, sName, idx, response + "," + i)[0];
					});
					return res;
				})([], miu$._GETlog.splitGetNode(v.children, 'nodeName', 'BR')[1]);
			}
		})(response + "," + i);
	});
	if(tNum) result[0].push({"key": "afterAction", "subkey": "TstartEnd"});
	result = UndefinedArray(result);
	console.log(result);
	return result;
};

miu$._GETlog.messageTable.prototype.Acheck = function(elem) {
	var reg = /BAA\d/,
		i, len = elem.length;
	for(i = 0; i < len; ++i) {
		if(reg.test(elem[i].className)) return true;
	}
	return false;
};

miu$._GETlog.messageTable.prototype.msgcheck = function(msg, reg) {
	var msgs = [];
	msg.forEach((v) => {
		if(!/^\t/.test(v)) msgs.push(v);
	});
	return msgs;
};

miu$._GETlog.messageTable.prototype.msgelem = function(elem) {
	var a = [],
		func = (h) => {
			h.forEach((v) => {
				var s;
				if(/\n/.test(v.textContent)) {
					if(v.nodeName === "#text") {
						s = v.previousSibling;
						if(s && s.nodeName !== "DIV" && s.className !== "CL") a.push(s);
					} else {
						func(Array.from(v.childNodes));
					}
				}
			});
		};
	func(Array.from(elem.childNodes));
	return a;
};

miu$._GETlog.messageTable.prototype.checkSkill = function(elem, msg, reg, tST, sName, idx, response) {
	//console.log(response);
	var msglist = {"elem": elem, "msg": this.msgcheck(msg, reg), "sName": sName, "idx": idx, "elembr": this.msgelem(elem)},
		countlist = {"Critical": 0, "TateKata": 0},
		result = [], i = 0, len, pcount = 0, responseIndex = 0;
	if(msglist.sName.user && msglist.sName.id) {
		result[responseIndex] = {"user": msglist.sName.user, "id": msglist.sName.id, "slv": msglist.sName.slv, "type": "A", "行動数": msglist.sName["行動数"]};
		++responseIndex;
		++i;
	}
	((arr) => {
		var e = [], eb = [];
		arr.forEach((v, i) => {
			if(v !== "") {
				e.push(msglist.msg[i]);
				eb.push(msglist.elembr[i]);
			}
		});
		msglist.msg = e;
		msglist.elembr = eb;
	})(msglist.msg);
	//console.log(msglist.elembr);
	//console.log(msglist.msg);
	for(len = msglist.msg.length; i < len; ++i) {
		((res, pElem) => {
			//console.log(i,msglist.msg[i]);
			if(msglist.sName.user && msglist.sName.id) {
				//効果を取得、途中でパッシブがあれば再帰
				res = this.getSkillEffect(reg, msglist, tST, i, countlist, result, response + "," + responseIndex);
				if(!res && reg.action.P.test(msglist.msg[i])) {
					pElem = miu$._GETlog.splitGetNode(msglist.elem.children, 'nodeName', 'DL')[0];
					if(pElem.length) {
						res = this.checkSkill(pElem[pcount], pElem[pcount].textContent.split(/\n/), reg, tST, {"user": false, "id": false, "slv": false}, idx, response + "," + responseIndex);
						i += res[1];
						res = res[0];
						++pcount;
					}
				}
			} else {
				//スキル名等を取得
				res = this.getSkillName(reg, msglist, tST, i, response + "," + responseIndex);
			}
			//console.log(i,len,res);
			if(res) result[responseIndex++] = res;
		})();
	}
	//console.log(i);
	return [result,i-1];
};

	//スキル効果を取得用
miu$._GETlog.messageTable.prototype.getSkillEffect = function(reg, msglist, tST, x, countlist, resultlist, response) {
	var key = Object.keys(reg.damage).find((v) => {
			return reg.damage[v].test(msglist.msg[x]);
		});
	if(key) return this[key](reg, msglist, tST, x, countlist, resultlist, response);
};
	//damage
miu$._GETlog.messageTable.prototype.trimE = function(reg, msglist, tST, x, countlist, resultlist, response) {
	var Nameid = msglist.msg[x].split(reg.damage.trimE),
		efflist = {"target": Nameid[1], "str": "", "pre": Nameid[0], "rlist": resultlist, "i": x, "response": response},
		key = Object.keys(reg.effect).find((v) => {
			return reg.effect[v].test(Nameid[3]);
		});
	if(key) {
		efflist.str = Nameid[3].split(reg.effect[key]);
		return this[key](reg, msglist, tST, efflist);
	}
};

miu$._GETlog.messageTable.prototype.Critical = function(reg, msglist, tST, x, countlist, resultlist) {
	return { "user": msglist.sName.user, "prop": "Critical", "NoT": countlist.Critical++};
};

miu$._GETlog.messageTable.prototype.Tate = function(reg, msglist, tST, x, countlist, resultlist) {
	var Nameid = msglist.msg[x].split(reg.damage.Tate);
	return {"target": Nameid[1], "add": parseInt(Nameid[3], 10), "prop": "盾受", "NoT": countlist.TateKata++};
};

miu$._GETlog.messageTable.prototype.Kata = function(reg, msglist, tST, x, countlist, resultlist) {
	var Nameid = msglist.msg[x].split(reg.damage.Kata);
	--tST[Nameid[2]].goei[Nameid[1]];
	return {"target": Nameid[1], "user": Nameid[2], "prop": "護衛", "NoT": countlist.TateKata++};
};

miu$._GETlog.messageTable.prototype.TateKaihi = function(reg, msglist, tST, x, countlist, resultlist) {
	return {"user": msglist.sName.user, "prop": "盾回避", "NoT": countlist.TateKata++};
};

miu$._GETlog.messageTable.prototype.skillef = function(reg, msglist, tST, x, countlist, resultlist) {
	var str = msglist.msg[x].split(/！?$/);
	return {"user": msglist.sName.user, "spec": str[0]};
};

	//effect
miu$._GETlog.messageTable.prototype.Status = function(reg, msglist, tST, efflist) {
	return {"target": efflist.target, "key": efflist.str[1], "prop": efflist.str[3]};
};

miu$._GETlog.messageTable.prototype.StatusKJ = function(reg, msglist, tST, efflist) {
	var add = parseInt(efflist.str[2], 10),
		prop = efflist.str[3],
		key = efflist.str[1],
		regexp = [/^(\d+)\sターンの間、/, /(\d+)\sターンに..！$/],
		msg = [efflist.pre, efflist.str[4]],
		turn = 0;
	regexp.forEach((val, i) => {
		if(val.test(msg[i])) {
			turn = parseInt(msg[i].split(val)[1], 10);
		}
	});
	tST[efflist.target].per[key][1] = turn;
	if(turn) {
		tST[efflist.target].per[key][0] = (prop === "強化") ? add : -add;
	} else {
		tST[efflist.target].per.Reset(key);
	}
	return {"target": efflist.target, "key": key, "subkey": "per", "add": add, "prop": prop, "turn": turn};
};

miu$._GETlog.messageTable.prototype.StatusHS = function(reg, msglist, tST, efflist) {
	var cri = 0,
		func = {},
		list = [],
		info = {},
		target = efflist.target,
		regprop = /(盾受|肩代|盾回避|Critical)/,
		i = 1, len = efflist.rlist.length, obj;
	func["盾受"] = function(o) {
		tST[o.target].shield = o.add;
	};
	func["護衛"] = function(o) {
		target = o.target;
	};
	func["盾回避"] = function(o) {
		return ;
	};
	func["Critical"] = function(o) {
		cri = miu$._GETlog.splitGetNode(msglist.elem.getElementsByTagName('I'), 'className', 'Y4')[0];
		cri = cri[o.NoT].textContent.match(/Critical\sHit!!/g);
		cri = cri.length;
	};
	func["sublist"] = function(str) {
		var add = parseInt(str[3], 10),
			prop = str[4],
			key = str[1];
		if(!key) key = "HP";
		if(/ダメージ/.test(prop)) prop = "ダメージ";
		miu$._GETlog.statehpsp(prop, msglist.sName.user, target, key, add, tST);
		return {"target": target, "key": key, "add": add, "prop": prop};
	};
	for(i = 1; ((len - i) >= 1) && (i <= 3); ++i) {
		obj = efflist.rlist[len - i];
		if(typeof obj === "undefined" || Array.isArray(obj) || !regprop.test(obj.prop)) break;
		func[obj.prop](obj);
	}
	list.push(func.sublist(efflist.str));
	if(efflist.str[5]) list.push(func.sublist(efflist.str[5].split(reg.effect.StatusHS)));
	((i, prop, e) => {
		prop = list.find((v) => {return /奪取|強奪/.test(v.prop)});
		if(prop) prop = prop.prop;
		e[0] = miu$._HTMLfunc.setInfo(efflist.rlist, tST, target, msglist.sName.user, efflist.response);
		e[1] = miu$._HTMLfunc.sethpsp(tST, target, msglist.sName.user, prop);
		msglist.elembr[i].parentNode.insertBefore(e[0], msglist.elembr[i]);
		msglist.elembr[i].parentNode.insertBefore(e[1], msglist.elembr[i]);
	})(efflist.i, "", []);
	info = {"user": msglist.sName.user, "userStatus": miu$._GETlog.infoStatus(msglist.sName.user, tST), "targetStatus": miu$._GETlog.infoStatus(target, tST), "critical": cri};
	if(list[0].prop === "ダメージ") {
		tST[msglist.sName.user].yDam = 0;
		tST[target].hDam = 0;
	}
	list.forEach((val) => {
		val.info = info;
	});
	return list;
};

miu$._GETlog.messageTable.prototype.yhHeal = function(reg, msglist, tST, efflist) {
	var key = (efflist.str[1] === "使う") ? "yHeal" : "hHeal";
	return {"target": efflist.target, "key": key, "prop": efflist.str[2]};
};

miu$._GETlog.messageTable.prototype.yhDam = function(reg, msglist, tST, efflist) {
	var key = (efflist.str[1] === "受ける") ? "hDam" : "yDam",
		add = efflist.str[2].split(/(.\d+)/);
	add = (add.length > 1) ? parseInt(add[1], 10) : 0;
	tST[efflist.target][key] = add;
	return {"target": efflist.target, "key": key, "add": add};
};

miu$._GETlog.messageTable.prototype.Hentyo = function(reg, msglist, tST, efflist) {
	var reghentyo = new miu$._REG.hentyo,
		subkey = efflist.str[1].split(reghentyo.type)[1],
		add = parseInt(efflist.str[3], 10),
		prop = efflist.str[4],
		key = Object.keys(reghentyo.keys).find((v) => { return reghentyo.keys[v].test(efflist.str[2])}),
		funckey = (key) ? key.match(/防御|深度/) : null;
	if(funckey !== null) {
		prop = ((fk, pr) => {
			var func = {};
			func["防御"] = (p) => {
				var reg = {"追加": /得た/, "減少": /減/};
				p = Object.keys(reg).find((v) => { return reg[v].test(p)});
				tST[efflist.target][key][subkey] = miu$._DATAstate._update(tST[efflist.target][key][subkey], (p === "追加") ? add : -add);
				return p;
			};
			func["深度"] = (p) => {
				var reg = {"追加": /.*追加/, "軽減": /減/, "抵抗": /抵抗/, "変調防御": /防御/, "奪取": /奪取/};
				p = Object.keys(reg).find((v) => { return reg[v].test(p)});
				if(p === "抵抗") {
					add = 0;
					return p;
				}
				if(p === "奪取") {
					tST[efflist.target][key][subkey] = miu$._DATAstate._update(tST[efflist.target][key][subkey], -add);
					tST[msglist.sName.user][key][subkey] = miu$._DATAstate._update(tST[msglist.sName.user][key][subkey], add);
				} else {
					((key, add) => {
						tST[efflist.target][key][subkey] = miu$._DATAstate._update(tST[efflist.target][key][subkey], add);
					})((p === "変調防御") ? p : key, (p === "追加") ? add : -add);
				}
				return p;
			};
			return func[fk](pr);
		})(funckey[0], prop);
	}
	return {"target": efflist.target, "key": key, "subkey": subkey, "add": add, "prop": prop};
};

miu$._GETlog.messageTable.prototype.Renzok = function(reg, msglist, tST, efflist) {
	var prop = (efflist.str[1] === "早く") ? "増加" : "減少";
	return {"target": efflist.target, "key": "連続", "prop": prop};
};

miu$._GETlog.messageTable.prototype.syatai = function(reg, msglist, tST, efflist) {
	var add = parseInt(efflist.str[3], 10),
		key = efflist.str[1];
	tST[efflist.target][key] = add;
	return {"target": efflist.target, "key": key, "add": add, "prop": "射隊"};
};

miu$._GETlog.messageTable.prototype.shield = function(reg, msglist, tST, efflist) {
	var add = parseInt(efflist.str[2], 10),
		prop = efflist.str[3],
		sub = (prop === "減少") ? -1 : 1;
	if(prop === "奪取") {
		tST[msglist.sName.user].shield = miu$._DATAstate._update(tST[msglist.sName.user].shield, add);
		sub = -1;
	}
	tST[efflist.target].shield = miu$._DATAstate._update(tST[efflist.target].shield, (add * sub));
	return {"target": efflist.target, "key": "shield", "add": add, "prop": prop};
};

miu$._GETlog.messageTable.prototype.nasi = function(reg, msglist, tST, efflist) {
	return {"target": efflist.target, "prop": "効果なし"};
};

miu$._GETlog.messageTable.prototype.kaihi = function(reg, msglist, tST, efflist) {
	var info = {"user": msglist.sName.user, "userStatus": miu$._GETlog.infoStatus(msglist.sName.user, tST), "targetStatus": miu$._GETlog.infoStatus(efflist.target, tST)};
	return {"target": efflist.target, "key": "unknown", "prop": "回避", "info": info};
};

miu$._GETlog.messageTable.prototype.hate = function(reg, msglist, tST, efflist) {
	var prop = (efflist.str[1] === "やすく") ? "増加" : "減少";
	return {"target": efflist.target, "key": "Hate", "prop": prop};
};

miu$._GETlog.messageTable.prototype.fuyoLv = function(reg, msglist, tST, efflist) {
	return ((t, k, add, prop, f) => {
		var i = (/増加/.test(prop)) ? 1 : -1;
		if(typeof f[k] === "undefined") f[k] = 0;
		f[k] = miu$._DATAstate._update(f[k], add * i);
		return {"target": t, "key": "付与lv", "subkey": k, "add": add, "prop": prop};
	})(efflist.target, efflist.str[1], parseInt(efflist.str[2], 10), (/付加|増加/.test(efflist.str[3])) ? "増加" : "減少", tST[efflist.target].fuyoLv);
};

miu$._GETlog.messageTable.prototype.useSp = function(reg, msglist, tST, efflist) {
	return {"target": efflist.target, "key": "消費SP", "add": efflist.str[1], "prop": efflist.str[2]};
};

miu$._GETlog.messageTable.prototype.keigen = function(reg, msglist, tST, efflist) {
	return {"target": efflist.target, "key": "軽減率", "prop": efflist.str[2]};
};

miu$._GETlog.messageTable.prototype.impact = function(reg, msglist, tST, efflist) {
	tST[efflist.target].Impact = 1;
	return {"target": efflist.target, "key": "Impact"};
};

miu$._GETlog.messageTable.prototype.goei = function(reg, msglist, tST, efflist) {
	return ((t,u,add) => {
		if(typeof tST[u].goei[t] === "undefined") tST[u].goei[t] = 0;
		tST[u].goei[t] = add;
		return {"target": t, "key": "護衛", "user": u, "add": add};
	})(efflist.target, msglist.sName.user, efflist.str[1]);
};

	//スキル名等を取得用
miu$._GETlog.messageTable.prototype.getSkillName = function(reg, msglist, tST, x, response) {
	var key = Object.keys(reg.action).find((v) => { return reg.action[v].test(msglist.msg[x]); });
	if(key) return this[key](reg, msglist, tST, x, response);
};
	//action
miu$._GETlog.messageTable.prototype.P = function(reg, msglist, tST, x, response) {
	var strP = msglist.msg[x].split(reg.action.P),
		r = /LV/;
	strP[3] = "0";
	if(r.test(strP[2])) {
		r = strP[2].split(r);
		strP[2] = r[0];
		strP[3] = r[1];
	};
	msglist.sName = {"user": strP[1], "id": strP[2], "slv": strP[3]};
	return {"user": msglist.sName.user, "id": msglist.sName.id, "slv": parseInt(msglist.sName.slv, 10), "type": "P"};
};

miu$._GETlog.messageTable.prototype.n = function(reg, msglist, tST, x, response) {
	++msglist.idx[0];
	var el = miu$._GETlog.splitGetNode(msglist.elem.parentNode.children, 'nodeName', 'BR')[1][msglist.idx[0]];
	return ((res, el, msg, str) => {
		var skillName = el[0].getElementsByTagName('i')[0].textContent;
		((sp) => {
			if(sp) tST[str[1]].state.SP -= sp * (sp + 1) / 2 * 10;
		})(miu$._GETlog.splitGetNode(el[0].children, 'className', 'P2')[0].length);
		el.forEach((v,i) => {
			msg = v.textContent.split(/\n/);
			res[i] = this.checkSkill(v, msg, reg, tST, {"user": str[1], "id": skillName, "slv": 0, "行動数": parseInt(str[3], 10)}, msglist.idx, response + "," + i)[0];
			skillName = false;
		});
		return res;
	})([], miu$._GETlog.splitGetNode(el.children, 'nodeName', 'BR')[1], "", msglist.msg[x].split(reg.action.n));
};

miu$._GETlog.messageTable.prototype.L = function(reg, msglist, tST, x, response) {
	var strL = msglist.msg[x].split(reg.action.L),
		elem = miu$._GETlog.splitGetNode(msglist.elem.children, 'nodeName', 'I(?!.)')[0];
	elem = elem[1].textContent;
	msglist.sName = {"user": strL[1], "id": elem, "slv": 0};
	return {"user": msglist.sName.user, "id": msglist.sName.id, "slv": parseInt(msglist.sName.slv, 10), "type": "LA"};
};

miu$._GETlog.messageTable.prototype.Mc = function(reg, msglist, tST, x, response) {
	return {"user": msglist.sName.user, "id": "魅了キャンセル", "変調深度": tST[msglist.sName.user]["変調深度"]["魅"], "type": "H"};
};

miu$._GETlog.messageTable.prototype.Md = function(reg, msglist, tST, x, response) {
	var dam = msglist.msg[x].split(reg.action.Md),
		elem = miu$._GETlog.splitGetNode(msglist.elem.parentNode.children, 'className', 'BAA\\d+')[0],
		result = [{},[{},{}]];
	elem = miu$._GETlog.splitGetNode(elem[0].children, 'className', 'F5')[0];
	elem = elem[0].textContent.split(reg.nTrim);
	msglist.sName = {"user": elem[1], "id": "猛毒ダメージ", "slv": false};
	result[0] = { "user": msglist.sName.user, "id": "猛毒ダメージ", "変調深度": tST[msglist.sName.user]["変調深度"]["毒"], "type": "H" };
	result[1][0] = { "target": msglist.sName.user, "key": "HP", "add": parseInt(dam[1], 10), "prop": "ダメージ" };
	result[1][1] = { "target": msglist.sName.user, "key": "MHP", "add": parseInt(dam[2], 10), "prop": "減少" };
	miu$._GETlog.statehpsp(result[1][0].prop, msglist.sName.user, msglist.sName.user, result[1][0].key, result[1][0].add, tST);
	miu$._GETlog.statehpsp(result[1][1].prop, msglist.sName.user, msglist.sName.user, result[1][1].key, result[1][1].add, tST);
	(() => {
		var e = miu$._HTMLfunc.sethpsp(tST, msglist.sName.user, msglist.sName.user, "");
		msglist.elem.appendChild(e);
	})();
	return result;
};



//////////////////////////////////////////////////////////////
	//
miu$._GETlog.statehpsp = function(prop, user, target, key, add, tST) {
	var regs = [/ダメージ|減少|低下/, /奪取|強奪/, /増加|上昇|回復/],
		i = regs.findIndex((v) => {return v.test(prop);});
	if(i < 0) alert(prop);
	if(--i) {
		tST[target].state[key] += add * i;
	} else {
		tST[target].state[key] += -add;
		tST[user].state[key] += add;
		target = user;
	}
	if(!/M../.test(key) && (tST[target].state[key] > tST[target].state["M" + key])) {
		tST[target].state[key] = tST[target].state["M" + key];
	}
};

//////ログの整形///////////////////////////////////////////////




//////////////////////////////////////////////////////////////
// html
//

miu$._HTMLfunc = {};

miu$._HTMLfunc.init = function() {
	var e = document.createElement('div'),
		bodyNode = document.body;
	e.id = Scriptname;
	bodyNode.appendChild(e);
	return e;
};

miu$._HTMLfunc.getlog = function(top_element) {
	var e = document.createElement('div');
	e.id = 'open_Button';
	e.textContent = "ログ取得";
	e.addEventListener('mouseenter', function() {
		this.classList.add("_openlight");
	}, false);
	e.addEventListener('mouseleave', function() {
		this.classList.remove("_openlight");
	}, false);
	top_element.appendChild(e);
	return e;
};

miu$._HTMLfunc.closeInfo = 0;
miu$._HTMLfunc.alpha = 0.8;

//////Listener////////////////////////////////////////////////
miu$._HTMLfunc.listener = {};

miu$._HTMLfunc.listener.lightadd = function() {
	this.classList.add("_closelight");
};

miu$._HTMLfunc.listener.lightremove = function() {
	this.classList.remove("_closelight");
};

//////information_insert//////////////////////////////////////
miu$._HTMLfunc.sethpsp = function(tST, target, user, prop) {
	var e = document.createElement('span'),
		name = [target, user],
		hp = name.map((v) => {
			var e = document.createElement('span');
				e.classList.add(Scriptname + "_bold");
				e.textContent = tST[v].state.HP;
				if(tST[v].state.HP < 0) e.classList.add(Scriptname + "_red");
			return e;
		});
	e.innerHTML = target + "&nbsp;[ hp : " + hp[0].outerHTML + " / " + tST[target].state.MHP + " &nbsp;sp : " + tST[target].state.SP + " ]";
	if(/奪取|強奪/.test(prop)) {
		e.innerHTML += "&nbsp;&nbsp;" + user + "&nbsp;[ hp : " + hp[1].outerHTML + " / " + tST[user].state.MHP + " &nbsp;sp : " + tST[user].state.SP + " ]";
	}
	e.classList.add(Scriptname + "_inserthpsp");
	return e;
};

miu$._HTMLfunc.setInfo = function(logdata, tST, target, user, response) {
	var e = document.createElement('span');
	e.textContent = "info";
	e.classList.add(Scriptname + "_insertinfo");
	e.addEventListener('click', function(evl) {
		var information_Window = document.getElementById('information_Window');
		if(miu$._HTMLfunc.closeInfo) miu$._HTMLfunc.closeInfo.classList.remove(Scriptname + "_infoclick");
		miu$._HTMLfunc.closeInfo = this;
		this.classList.add(Scriptname + "_infoclick");
		information_Window.style.display = "block";
		miu$._HTMLfunc.getInfo(logdata, information_Window, response);
		information_Window.style.left = evl.pageX;
		information_Window.style.top = evl.pageY;
	}, false);
	return e;
};

miu$._HTMLfunc.getInfo = function(logdata, information_Window, response) {
	var info_box = document.getElementById(((v) => {return v})(Scriptname + "_information_window_box")),
		close = info_box.getElementsByClassName(((v) => {return v})(Scriptname + "_close"))[0],
		main_box = document.getElementById('information_window_main'),
		information_window_sub = document.getElementById(((r) => {return r;})(Scriptname + "_information_window_sub")),
		information_window_info = document.getElementById('information_window_info'),
		e = {}, spec = [];
	console.log(logdata);
	console.log(response);
	main_box.textContent = "";
	information_window_sub.style.display = "";
	logdata.forEach((v,i) => {if(!Array.isArray(v) && typeof v.spec !== "undefined") spec.push(i);});
	response = response.split(/\,/);
	response = response[response.length - 1];
	e.skill = document.createElement('div');
	e.skill.classList.add("_info_box_skill");
	e.skill.innerHTML = ((t, res) => {
		res = spec.findIndex((v) => {return response < v;}) - 1;
		res = (res < 0) ? spec.length - 1 : res;
		t += "<div class=\"" + Scriptname + "_italic\"><span class=\"_info_box_skill_name\">" + logdata[0].id + "</span><span class=\"_info_box_skill_text\">" + logdata[0].slv + "</span>";
		t += "<span class=\"_info_box_skill_text\">" + logdata[0].type + "</span><span class=\"_info_box_skill_text\">" + logdata[0].user + "</span></div>";
		t += "<div><span class=\"_info_box_skill_text\">" + ((sp) => {return (logdata[0].type === "A") ? (sp) ? -sp * (sp + 1) / 2 * 10 : "-" : "-";})(spec.length) + "/sp</span>";
		t += "<span class=\"_info_box_skill_text\">" + ((t) => {
			spec.forEach((v,i) => {t += (() => {return (i > 0) ? "→" : "◇"})() + "</span><span" + (() => {return (i === res) ? " class=\"" + Scriptname + "_bold\"" : ""})() + ">" + logdata[v].spec + "</span><span>";});
			return t;
		})("") + "</span></div>";
		return t;
	})("");
	main_box.appendChild(e.skill);
	e.eff = document.createElement('div');
	e.eff.classList.add("_info_box_skill");
	e.el = {};
	((logd) => {
		var txarr = {"add": "add", "key": "key", "subkey": "subkey", "prop": "prop", "target": "target", "info": "_"},
			te = {"table": document.createElement('table'), "thead": document.createElement('thead'), "tbody": document.createElement('tbody'), "tr": {}, "td": {}};
		e.el.table = te;
		e.eff.appendChild(te.table);
		te.table.appendChild(te.thead);
		te.table.appendChild(te.tbody);
		te.table.classList.add("_info_box_skill_table");
		if(!Array.isArray(logd)) logd = [logd];
		logd.splice(0,0,txarr);
		logd.forEach((v,i) => {
			var bh = (i) ? "tbody" : "thead";
			te.tr[i] = document.createElement('tr');
			te[bh].appendChild(te.tr[i]);
			te.td[i] = {};
			Object.keys(txarr).forEach((t) => {
				var text = (logd[i][t]) ? (t !== "info") ? logd[i][t] : (!i) ? "info" : "▷ open ◁" : "-";
				te.td[i][t] = document.createElement('td');
				te.td[i][t].textContent = text;
				te.tr[i].appendChild(te.td[i][t]);
			});
		});
	})(JSON.parse(JSON.stringify(logdata[response])));
	main_box.appendChild(e.eff);
	((ef) => {
		var func = {}, efo;
		func.mouseenter = function() {this.textContent = "▶ open ◀";};
		func.mouseleave = function() {this.textContent = "▷ open ◁";};
		func.prev = function(x) {
			x.textContent = "▷ open ◁";
			x.classList.remove(Scriptname + "_info_openclose_click");
			x.addEventListener('mouseenter', func.mouseenter, false);
			x.addEventListener('mouseleave', func.mouseleave, false);
		};
		Object.keys(ef).forEach((v,i) => {
			if(i) {
				ef[v].info.classList.add(Scriptname + "_info_openclose");
				func.prev(ef[v].info);
				ef[v].info.addEventListener('click', function() {
					if(this.textContent !== "◀ open ▶") {
						if(efo) func.prev(efo);
						information_window_sub.style.display = "block";
						efo = this;
						this.textContent = "◀ open ▶";
						efo.classList.add(Scriptname + "_info_openclose_click");
						efo.removeEventListener('mouseenter', func.mouseenter, false);
						efo.removeEventListener('mouseleave', func.mouseleave, false);
						miu$._HTMLfunc.informationWindowSub(logdata[response][i-1].info, information_window_info, logdata[response][i-1].target);
					} else {
						func.prev(efo);
						information_window_sub.style.display = "";
						efo = undefined;
					}
				}, false);
			}
		});
	})(e.el.table.td);
	close.addEventListener('mouseenter', miu$._HTMLfunc.listener.lightadd, false);
	close.addEventListener('mouseleave', miu$._HTMLfunc.listener.lightremove, false);
	close.addEventListener('click', () => {
		information_Window.style.display = "none";
		miu$._HTMLfunc.closeInfo.classList.remove(Scriptname + "_infoclick");
	}, false);
};

miu$._HTMLfunc.informationWindowSub = function(e, top, target) {
	var elems = {"otherkey": "div", "otherlist": "ul", "stelem": "ul", "user": "li", "target": "li", "status": "div"},
		el = {}, otherkey = {}, func = {};
	func.text = (a,b) => {return (a + " : <span class=\"" + Scriptname + "_nomaltext\">" + b + "</span>");};
	func.start_ul = (a,e) => {
		e.textContent = "";
		func.list(a,e);
	};
	func.list = (a,e) => {
		var ul = document.createElement('ul');
		e.appendChild(ul);
		Object.keys(a).forEach((v) => {
			var li = document.createElement('li');
			ul.appendChild(li);
			if(a[v].toString() === "[object Object]") {
				li.innerHTML = func.text(v, "▽");
				func.list(a[v], li);
			} else {
				li.innerHTML = func.text(v, a[v]);
			}
		});
	};
	top.textContent = "";
	Object.keys(elems).forEach((v) => {
		el[v] = document.createElement(elems[v]);
	});
	top.appendChild(el.otherkey);
	el.otherkey.appendChild(el.otherlist);
	top.appendChild(el.stelem);
	el.stelem.appendChild(el.target);
	el.stelem.appendChild(el.user);
	top.appendChild(el.status);
	Object.keys(e).forEach((v) => {
		if(!/targetStatus|userStatus|user(?!.)/.test(v)) {
			otherkey[v] = document.createElement('li');
			otherkey[v].innerHTML = func.text(v, e[v]);
			el.otherlist.appendChild(otherkey[v]);
		}
	});
	el.otherkey.classList.add("_info_sub");
	el.status.classList.add("_info_sub");
	el.target.innerHTML = func.text("target", target);
	el.user.innerHTML = func.text("user", e.user);
	el.stelem.classList.add("_info_sub_nav");
	((arr) => {
		var pre = arr[0];
		el[pre].classList.add("_info_nav_open");
		el[pre].classList.add("_info_nav_on");
		func.start_ul(e[pre + "Status"], el.status);
		el.stelem.addEventListener('mouseenter', function() {
			arr.forEach((v) => {
				if(v !== pre) el[v].classList.add("_info_nav_open");
			});
		}, false);
		el.stelem.addEventListener('mouseleave', function() {
			arr.forEach((v) => {
				if(v !== pre) el[v].classList.remove("_info_nav_open");
			});
		}, false);
		arr.forEach((v) => {
			el[v].addEventListener('mouseenter', function() {
				this.classList.add("_info_sub_namelight");
			}, false);
			el[v].addEventListener('mouseleave', function() {
				this.classList.remove("_info_sub_namelight");
			}, false);
			el[v].addEventListener('click', function() {
				el[pre].classList.remove("_info_nav_on");
				this.classList.add("_info_nav_on");
				pre = v;
				func.start_ul(e[pre + "Status"], el.status);
			}, false);
		});
	})(["target", "user"]);
};

//////information_Window//////////////////////////////////////
miu$._HTMLfunc.informationWindow = function(top_element) {
	var e = ["information_Window", "information_window_main", "information_window_top", "information_window_info", Scriptname + "_information_window_box", Scriptname + "_information_window_sub"],
		f = [Scriptname + "_close", Scriptname + "_textinfo"],
		ev = {}, fv = {}, func = {}, xy = {"x": 0, "y": 0};
	e.forEach((k) => {
		ev[k] = document.createElement('div');
		ev[k].id = k;
	});
	f.forEach((k) => {
		fv[k] = document.createElement('div');
		fv[k].classList.add(k);
		ev.information_window_top.appendChild(fv[k]);
	});
	ev.information_Window.appendChild(ev[Scriptname + "_information_window_box"]);
	ev.information_Window.appendChild(ev[Scriptname + "_information_window_sub"]);
	fv[Scriptname + "_textinfo"].textContent = "Informations";
	fv[Scriptname + "_close"].textContent = "close";
	ev[Scriptname + "_information_window_box"].style.backgroundColor = "rgba(0,0,0," + (miu$._HTMLfunc.alpha * 0.9) + ")";
	ev[Scriptname + "_information_window_sub"].style.backgroundColor = "rgba(0,0,0," + (miu$._HTMLfunc.alpha * 0.9) + ")";
	ev[Scriptname + "_information_window_box"].appendChild(ev.information_window_top);
	ev[Scriptname + "_information_window_box"].appendChild(ev.information_window_main);
	ev[Scriptname + "_information_window_sub"].appendChild(ev.information_window_info);
	top_element.appendChild(ev.information_Window);
	fv[Scriptname + "_textinfo"].draggable = true;
	fv[Scriptname + "_textinfo"].addEventListener('mouseenter', function() {
		this.textContent = "◀ Informations ▶";
	}, false);
	fv[Scriptname + "_textinfo"].addEventListener('mouseleave', function() {
		this.textContent = "Informations";
	}, false);
	func.mouseup = function() {
		information_Window.removeEventListener('mouseup', func.mouseup, false);
		information_Window.removeEventListener('touchend', func.mouseup, false);
		document.body.removeEventListener('mousemove', func.mousemove, false);
		document.body.removeEventListener('touchmove', func.mousemove, false);
		information_Window.classList.remove("_info_drag");
		ev[Scriptname + "_information_window_box"].style.backgroundColor = "rgba(0,0,0," + (miu$._HTMLfunc.alpha * 0.9) + ")";
		ev[Scriptname + "_information_window_sub"].style.backgroundColor = "rgba(0,0,0," + (miu$._HTMLfunc.alpha * 0.9) + ")";
	};
	func.mousemove = function(evl) {
		var event = (evl.type === "mousemove") ? evl : evl.changedTouches[0];
		evl.preventDefault();
		information_Window.style.left = event.pageX - xy.x + "px";
		information_Window.style.top = event.pageY - xy.y + "px";
		information_Window.addEventListener('mouseup', func.mouseup, false);
		information_Window.addEventListener('touchend', func.mouseup, false);
		document.body.addEventListener('mouseleave', func.mouseup, false);
		document.body.addEventListener('touchleave', func.mouseup, false);
	};
	func.mousedown = function(evl) {
		var event = (evl.type === "mousedown") ? evl : evl.changedTouches[0];
		information_Window.classList.add("_info_drag");
		ev[Scriptname + "_information_window_box"].style.backgroundColor = "rgba(0,0,0," + (miu$._HTMLfunc.alpha * 0.9 / 2) + ")";
		ev[Scriptname + "_information_window_sub"].style.backgroundColor = "rgba(0,0,0," + (miu$._HTMLfunc.alpha * 0.9 / 2) + ")";
		xy.x = event.pageX - information_Window.offsetLeft;
		xy.y = event.pageY - information_Window.offsetTop;
		document.body.addEventListener('mousemove', func.mousemove, false);
		document.body.addEventListener('touchmove', func.mousemove, false);
	};
	fv[Scriptname + "_textinfo"].addEventListener('mousedown', func.mousedown, false);
	fv[Scriptname + "_textinfo"].addEventListener('touchstart', func.mousedown, false);
	return ev;
};

//////overlay_window/////////////////////////////////////////
miu$._HTMLfunc.mainWindow = function(top_element, open_Button, data) {
	var input = miu$._HTMLfunc.input(),
		e = ["overlay_Window", "top_overlay", "overlay_close", "opacity", "menu_tab", "main_area"],
		ev = {}, func = {};
	e.forEach((k) => {
		ev[k] = document.createElement('div');
		ev[k].id = k;
	});
	func.overlay_opacity = (v) => {
		var information_window_box = document.getElementById(((r) => {return r;})(Scriptname + "_information_window_box")),
			information_window_sub = document.getElementById(((r) => {return r;})(Scriptname + "_information_window_sub"));
		miu$._HTMLfunc.alpha = v;
		information_window_box.style.backgroundColor = "rgba(0,0,0," + (v * 0.9) + ")";
		information_window_sub.style.backgroundColor = "rgba(0,0,0," + (v * 0.9) + ")";
		ev.overlay_Window.style.backgroundColor = "rgba(0,0,0," + v + ")";
	};
	top_element.appendChild(ev.overlay_Window);
	ev.overlay_Window.appendChild(ev.top_overlay);
	ev.overlay_Window.appendChild(ev.main_area);
	ev.top_overlay.appendChild(ev.overlay_close);
	ev.top_overlay.appendChild(ev.opacity);
	ev.top_overlay.appendChild(ev.menu_tab);
	func.overlay_opacity(miu$._HTMLfunc.alpha);
	ev.overlay_close.textContent = "close";
	ev.opacity.textContent = "透明度 :";
	ev.opacity.appendChild(input);
	input.addEventListener('change', () => {
		func.overlay_opacity(input.value);
	}, false);
	miu$._HTMLfunc.menuTab(ev, open_Button, data);
};
	//input
miu$._HTMLfunc.input = function() {
	var e = document.createElement('input');
	e.type = "number";
	e.max = 1;
	e.min = 0;
	e.step = 0.01;
	e.value = miu$._HTMLfunc.alpha;
	return e;
};

miu$._HTMLfunc.menuTab = function(ev, open_Button, data) {
	var v = ["view_status", "view_takeLog", "view_skillLog"],
		m = ["ステータス", "ログ", "スキル"],
		view = {}, menu = {}, onlist = {}, func = {},
		menuOn = 0;
	v.forEach((k) => {
		view[k] = document.createElement('div');
		view[k].id = k;
		view[k].classList.add(Scriptname + "_view");
		ev.main_area.appendChild(view[k]);
		onlist[k] = 0;
		miu$._HTMLfunc.view[k](data, k, onlist, view[k])
	});
	m.forEach((k) => {
		menu[k] = document.createElement('span');
		menu[k].classList.add(Scriptname + "_menu");
		menu[k].textContent = k;
		ev.menu_tab.appendChild(menu[k]);
	});
	ev.overlay_close.addEventListener('mouseenter', miu$._HTMLfunc.listener.lightadd, false);
	ev.overlay_close.addEventListener('mouseleave', miu$._HTMLfunc.listener.lightremove, false);
	open_Button.addEventListener('click', () => {
		ev.overlay_Window.style.display = "block";
	}, false);
	ev.overlay_close.addEventListener('click', () => {
		ev.overlay_Window.style.display = "none";
	}, false);
	func.viewlight_chenge = (before, after) => {
		menu[m[before]].classList.remove("_menulight");
		menu[m[after]].classList.add("_menulight");
		view[v[before]].style.display = "none";
		view[v[after]].style.display = "block";
	};
	func.viewlight_chenge(menuOn, menuOn);
	m.forEach((k,i) => {
		menu[k].addEventListener('mouseenter', function() {
			this.classList.add("_openlight");
			if(i !== menuOn) this.classList.add("_menusublight");
		}, false);
		menu[k].addEventListener('mouseleave', function() {
			this.classList.remove("_openlight");
			if(i !== menuOn) this.classList.remove("_menusublight");
		}, false);
		menu[k].addEventListener('click', function() {
			if(i !== menuOn) {
				this.classList.remove("_menusublight");
				func.viewlight_chenge(menuOn, i);
				menuOn = i;
			}
		}, false);
	});
};

miu$._HTMLfunc.view = {};
//////////////////////////////////////////////////////////////
miu$._HTMLfunc.view.view_html = function() {
	this.tr = "<tr>";
	this._tr = "</tr>";
	this._td = "</td>";
	this.td0 = "<td class=\"v_status_td_00\">";
	this.td1 = "<td class=\"v_status_td_01\">";
	this.td2 = "<td class=\"v_status_td_02\">";
	this.td3 = "<td class=\"v_status_td_03\">";
};

miu$._HTMLfunc.view.getPage = function(url, func1, func2) {
	var x = new XMLHttpRequest();
	x.open("GET", url, true);
	x.responseType = "document";
	x.onreadystatechange = () => {
		if(x.readyState === 4) {
			if(x.status === 200 && x.response !== null) {
				if(func1) return func1(x.response);
			} else {
				if(func2) return func2(x.status);
			}
		}
	};
	x.send();
};

//////view_status/////////////////////////////////////////////
miu$._HTMLfunc.view.view_status = function(data, key, onlist, viewElem) {
	console.log(key);
	var area = document.createElement('div'),
		pts = [] , ids = {}, member = 0;
	viewElem.appendChild(area);
	area.classList.add("pt_area");
	data.acterTable.forEach((v,i) => {
		pts[i] = document.createElement('div');
		pts[i].classList.add("pt_area_sub");
		v.forEach((v) => {
			var flag = ++member;
			ids[v] = document.createElement('div');
			ids[v].classList.add("pt_area_name");
			ids[v].textContent = data.character[v].Eno + " : " + v;
			pts[i].appendChild(ids[v]);
			ids[v].addEventListener('mouseenter', function() {
				this.classList.add("_pt_sublight");
			}, false);
			ids[v].addEventListener('mouseleave', function() {
				this.classList.remove("_pt_sublight");
			}, false);
			ids[v].addEventListener('click', function() {
				if(onlist[key] & miu$._Flag.GET[flag]) {
					viewElem.removeChild(viewElem.getElementsByClassName(((t) => {return t;})("pt_area" + flag))[0]);
					onlist[key] ^= miu$._Flag.GET[flag];
					this.classList.remove("_pt_light");
				} else {
					onlist[key] |= miu$._HTMLfunc.view.view_status_character(data, key, onlist, viewElem, flag, v) << flag;
					this.classList.add("_pt_light");
				}
			}, false);
		});
		area.appendChild(pts[i]);
	});
};

miu$._HTMLfunc.view.view_status_character = function(data, key, onlist, viewElem, flag, name) {
	var area = document.createElement('div'),
		f = [Scriptname + "_close", "d0", "d1", "d2", "d3"],
		t = ["t0", "t1", "t2", "t3"],
		eno = data.character[name].Eno,
		h = new miu$._HTMLfunc.view.view_html(),
		fv = {}, tv = {}, e = {}, v_func = {};
	viewElem.appendChild(area);
	area.classList.add("v_status_area");
	area.classList.add("pt_area" + flag);
	f.forEach((k) => {
		fv[k] = document.createElement('div');
		fv[k].classList.add(k);
		area.appendChild(fv[k]);
	});
	t.forEach((k,i) => {
		var tbody = document.createElement('tbody');
		tv[k] = document.createElement('table');
		tv[k].classList.add(Scriptname + "_table");
		tv[k].appendChild(tbody);
		fv[f[i+1]].appendChild(tv[k]);
	});
	v_func[0] = (t) => {
		var func = (a,b) => {return (h.tr + h.td1 + a + " :" + h._td + h.td0 + b + h._td + h._tr);};
		t += func("Eno", eno) + func("ID", name);
		return t;
	};
	v_func[1] = (t, row) => {
		var func = (a) => {return (h.tr + h.td1 + a + " :" + h._td + h.td2 + "<input class=\"v_st_input\" type=\"number\" name=\"" + a + "\" min=\"0\" step=\"1\" value=\"" + data.character[name].status[a] + "\">" + h._td);};
		t += func("ST") + "<td class=\"v_status_td_03\" rowspan=\"2\" colspan=\"2\">";
		if(eno) {
			t += "<input class=\"v_status_get\" type=\"button\" value=\"" + ((typeof miu$._GetStatus[eno] === "undefined") ? "get" : "complete") + "\">";
		} else {
			row = 4;
		}
		t += h._td + h._tr;
		t += func("AG") + h._tr;
		t += func("DX") + "<td class=\"v_status_td_01\" rowspan=\"" + row + "\" colspan=\"2\" style=\"vertical-align: top;\">" + h._td + h._tr;
		t += func("IN") + h._tr;
		t += func("VT") + h._tr;
		t += func("MN");
		if(eno) t += h.td1 + "減衰 :" + h._td + h.td2 + "<input class=\"v_st_input\" type=\"number\" name=\"減衰率\" max=\"1\" min=\"0\" step=\"0.001\" value=\"" + data.character[name]["減衰率"] + "\">" + h._td;
		t += h._tr;
		return t;
	};
	v_func[2] = (t,d) => {
		var func = (a,st) => {
				var style = (v) => {return ("style=\"color: rgb(" + v + ")\"");},
					color = (st[0] > st[1]) ? style("220,128,128") : (st[0] < st[1]) ? style("128,128,220") : "";
				return (h.tr + h.td1 + a + " :" + h._td + h.td2 + "<span " + color + ">" + st[0] + "</span>" + h._td + h.td1 + "(" + a + ") :" + h._td + h.td2 + st[1] + h._td + h._tr);
			},
			psp = Object.keys(d.status).reduce((pre, v) => {return pre + d.status[v];}, 0);
		psp = Math.floor(Math.pow(psp / 6, 1.33) / 4 * d["減衰率"] + 1);
		t += func("PSP", [psp, d.PSP]) + func("MHP", [d.statusBt.MHP, d.startMHP]) + func("MSP", [d.statusBt.MSP, d.startMSP]);
		return t;
	};
	v_func[3] = (t) => {
		var func = (a) => {return (h.td1 + a + " :" + h._td + h.td2 + data.character[name].statusBt[a] + h._td);},
			func2 = (a,b) => {return (h.tr + func(a) + func(b) + h._tr);};
		t += func2("AT", "MAT") + func2("DF", "MDF");
		t += func2("HIT", "MHIT") + func2("EVA", "MEVA");
		t += func2("HEAL", "SPD") + h.tr + func("CRI") + h._tr;
		return t;
	};
	v_func[4] = (el) => {
		var val = parseFloat(el.value),
			key = el.name,
			add = (key === "減衰率") ? data.character[name] : data.character[name].status;
		add[key] = val;
	};
	v_func[5] = () => {
		data.character[name].stBtReset();
		tv[t[2]].children[0].innerHTML = v_func[2]("", data.character[name]);
		tv[t[3]].children[0].innerHTML = v_func[3]("");
	};
	tv[t[0]].children[0].innerHTML = v_func[0]("");
	tv[t[1]].children[0].innerHTML = v_func[1]("", 3);
	v_func[5]();
	fv[Scriptname + "_close"].textContent = "close";
	fv[Scriptname + "_close"].addEventListener('click', () => {
		viewElem.removeChild(area);
		onlist[key] ^= miu$._Flag.GET[flag];
		viewElem.getElementsByClassName("pt_area_name")[flag - 1].classList.remove("_pt_light");
	}, false);
	fv[Scriptname + "_close"].addEventListener('mouseenter', miu$._HTMLfunc.listener.lightadd, false);
	fv[Scriptname + "_close"].addEventListener('mouseleave', miu$._HTMLfunc.listener.lightremove, false);
	e.input_status_get = tv[t[1]].children[0].getElementsByClassName('v_status_get')[0];
	e.v_st_input = tv[t[1]].children[0].getElementsByClassName('v_st_input');
	if(e.input_status_get) e.input_status_get.addEventListener('click', () => {
		var val = e.input_status_get.value,
			url = "http://lisge.com/kk/?id=" + eno + "&b=1",
			setChangeStatus = () => {
				Array.from(miu$._GetStatus[eno][0].getElementsByClassName('T2')).forEach((v,i) => {
					e.v_st_input[i].value = parseInt(v.textContent, 10);
					v_func[4](e.v_st_input[i]);
				});
				v_func[5]();
			};
		if(val === "get") {
			e.input_status_get.value = "取得中...";
			miu$._HTMLfunc.view.getPage(url, (res) => {
				miu$._GetStatus[eno] = res.getElementsByClassName('TST');
				if(miu$._GetStatus[eno].length) {
					setChangeStatus();
					e.input_status_get.value = "complete";
				} else {
					e.input_status_get.value = "none";
				}
			}, (state) => {
				e.input_status_get.value = state;
			});
		} else {
			if(val === "complete") setChangeStatus();
		}
	}, false);
	Array.from(e.v_st_input).forEach((v) => {
		v.addEventListener('change', () => {
			v_func[4](v);
			v_func[5]();
		}, false);
	});
	return 1;
};

//////view_takeLog////////////////////////////////////////////
miu$._HTMLfunc.view.view_takeLog = function(data, key, onlist, viewElem) {
	console.log(key);
};

//////view_skillLog///////////////////////////////////////////
miu$._HTMLfunc.view.view_skillLog = function(data, key, onlist, viewElem) {
	console.log(key);
};

//////stylesheet//////////////////////////////////////////////
miu$._HTMLfunc.stylesheet = function() {
	var head = document.getElementsByTagName('head')[0],
		s = document.createElement('style'),
		css = function(a) {
			var text = ((r,i,l) => {
				for(; i < l; ++i) arguments[i].forEach((v) => {r += v + "\n";});
				return r;
			})("", 1, arguments.length);
			return a + " {\n" + text + "}\n";
		},
		tx = function() {return Array.from(arguments).map((v) => {return v + ";";})},
		cl = ".", id = "#",
		font = tx("font-size: 10px", "font-weight: normal", "font-style: normal", "color: rgb(220,220,220)"),
		disp = {"b": tx("display: block"), "n": tx("display: none"), "ib": tx("display: inline-block")},
	///////////////////////
		t = ""
		+ css(id + Scriptname, font)
		+ css(id + "open_Button",
			tx("position: fixed",
			"z-index: " + zIndex,
			"bottom: 0",
			"width: 100%",
			"margin: 0",
			"padding: 5px 0",
			"background: rgba(0,0,0,0.7)",
			"border-top: " + Borderline,
			"text-align: center",
			"cursor: pointer")
		)
		+ css(cl + "_openlight",
			tx("color: rgb(255,255,255)",
			"text-shadow: 0 0 1px rgba(255,255,255,0.5)")
		)
		+ css(cl + Scriptname + "_close",
			tx("background: rgba(255,255,255,0.5)",
			"width: 80px",
			"float: right",
			"cursor: pointer")
		)
		+ css(cl + "_closelight",
			tx("color: rgb(255,255,255)",
			"background: rgba(255,255,255,0.6) !important")
		)
	///////////////////////
		+ css(id + "overlay_Window",
			tx("position: fixed",
			"z-index: " + (zIndex + 1),
			"text-align: center",
			"margin: 0",
			"padding: 0",
			"width: 100%",
			"height: 100%",
			"top: 0px"),
			disp.n
		)
		+ css(id + "top_overlay",
			tx("background: rgba(0,0,0,0.3)",
			"padding: 10px 0 0 0")
		)
		+ css(id + "overlay_close",
			tx("background: rgba(255,255,255,0.5)",
			"width: 80px",
			"float: right",
			"padding: 0px 0",
			"cursor: pointer")
		)
		+ css(id + "opacity",
			tx("float: right",
			"margin: 0 20px 0 0",
			"text-arign: right")
		)
		+ css(id + "opacity input",
			font,
			tx("background: rgba(0,0,0,0.3)",
			"width: 60px",
			"height: 15px",
			"padding: 0 0 0 5px",
			"border: none")
		)
		+ css(id + "menu_tab",
			tx("padding: 0 0 0 10px",
			"width: 100%",
			"text-align: left",
			"border-bottom: solid 1px rgba(0,0,0,0.7)")
		)
		////
		+ css(cl + Scriptname + "_menu",
			tx("background: rgba(255,255,255,0.5)",
			"font-size: 12px",
			"width: 150px",
			"margin: 0 10px 0 0",
			"padding: 5px 0",
			"text-align: center",
			"border-left: solid 1px rgba(255,255,255,0.3)",
			"border-top: solid 1px rgba(255,255,255,0.3)",
			"border-right: solid 1px rgba(255,255,255,0.3)",
			"cursor: pointer"),
			disp.ib
		)
		+ css(cl + "_menulight",
			tx("background: rgba(255,255,255,0.7)",
			"color: rgb(255,255,255)")
		)
		+ css(cl + "_menusublight",
			tx("background: rgba(255,255,255,0.6)")
		)
		////
		+ css(cl + Scriptname + "_view", disp.n)
	///////////////////////
		+ css(cl + "pt_area",
			tx("float: left",
			"width: 200px",
			"margin: 10px 0 0 10px")
		)
		+ css(cl + "pt_area_sub",
			tx("text-align: left",
			"padding: 5px 0 5px 15px",
			"margin: 0 0 10px 0",
			"border-left: solid 10px rgba(0,0,0,0.3)")
		)
		+ css(cl + "pt_area_name",
			tx("padding: 2px 5px",
			"font-size: 11px",
			"cursor: pointer")
		)
		+ css(cl + "_pt_light",
			tx("color: rgb(255,255,255)",
			"font-weight: bold")
		)
		+ css(cl + "_pt_sublight",
			tx("color: rgb(255,255,255)",
			"background: rgba(255,255,255,0.1)")
		)
		////
		+ css(cl + "v_status_area",
			tx("float: left",
			"margin: 10px 0 0 10px",
			"padding: 2px 15px",
			"border-left: solid 10px rgba(0,0,0,0.3)")
		)
		+ css(cl + "v_status_td_00",
			tx("text-align: left",
			"font-weight: bold",
			"padding: 0 0 0 5px",
			"width: 160px")
		)
		+ css(cl + "v_status_td_01",
			tx("text-align: right",
			"width: 40px")
		)
		+ css(cl + "v_status_td_02",
			tx("text-align: left",
			"font-weight: bold",
			"padding: 0 0 0 5px",
			"width: 60px")
		)
		+ css(cl + "v_status_td_03",
			tx("text-align: center",
			"font-weight: bold",
			"padding: 0 0 0 5px",
			"width: 60px")
		)
		+ css(cl + "v_status_td_02 input",
			font,
			tx("background: rgba(0,0,0,0.3)",
			"width: 60px",
			"height: 15px",
			"padding: 0 0 0 5px",
			"border: none")
		)
		+ css(cl + "v_status_get",
			font,
			tx("color: rgb(0,0,0)",
			"width: 60px",
			"font-family: sans-serif")
		)
		
	///////////////////////
		+ css(id + Scriptname + "_v_ver_back",
			font,
			tx("width: 70%",
			"text-align: left",
			"margin: 10px auto 0 auto")
		)
		+ css(cl + Scriptname + "_v_ver_head",
			tx("font-style: italic",
			"font-size: 15px")
		)
		+ css(cl + Scriptname + "_v_ver_text",
			tx("margin: 5px 20px")
		)
	///////////////////////
		+ css(cl + Scriptname + "_bold", tx("font-weight: bold !important"))
		+ css(cl + Scriptname + "_italic", tx("font-style: italic !important"))
		+ css(cl + Scriptname + "_red", tx("color: rgba(128,0,0,0.5)"))
		+ css(cl + Scriptname + "_text", font, disp.ib)
		+ css(cl + Scriptname + "_table", font, tx("margin: 0"))
		+ css(cl + Scriptname + "_nomaltext", tx("color: rgb(220,220,220)"))
	///////////////////////
		+ css(cl + Scriptname + "_insertinfo",
			font,
			tx("margin-left: 10px",
			"padding: 0 20px",
			"color: rgba(0,0,0,0.5)",
			"background: rgba(0,0,0,0.1)",
			"border-radius: 5px",
			"cursor: pointer")
		)
		+ css(cl + Scriptname + "_infoclick",
			tx("background: rgba(0,0,0,0.1)",
			"box-shadow: 0 1px 1px 0 rgba(0,0,0,0.7)")
		)
		+ css(cl + Scriptname + "_inserthpsp",
			font,
			tx("color: rgba(0,0,0,0.5)",
			"padding-left: 5px")
		)
	///////////////////////
		+ css(id + "information_Window",
			tx("position: absolute",
			"z-index: " + (zIndex - 5)),
			disp.n
		)
		+ css(cl + "_info_drag",
			tx("z-index: " + (zIndex - 4) + " !important")
		)
		+ css(id + Scriptname + "_information_window_box",
			tx("position: relative",
			"min-width: 320px",
			"min-height: 50px",
			"text-align: center",
			"border: " + Borderline,
			"border-radius: 5px",
			"box-shadow: 0px 1px 1px 0 rgba(0,0,0,0.7)"),
			disp.b
		)
		+ css(id + Scriptname + "_information_window_sub",
			tx("margin-top: 10px",
			"text-align: center",
			"border: " + Borderline,
			"border-radius: 5px",
			"box-shadow: 0px 1px 1px 0 rgba(0,0,0,0.7)"),
			disp.n
		)
		+ css(id + "information_window_top",
			tx("background: rgba(0,0,0,0.3)",
			"border-bottom: solid 1px rgba(0,0,0,0.7)")
		)
		+ css(cl + Scriptname + "_textinfo",
			font,
			tx("cursor: move")
		)
		+ css(id + "information_window_main",
			tx("margin: 5px 0")
		)
		+ css(cl + "_info_box_skill",
			tx("text-align: left",
			"padding: 0 10px")
		)
		+ css(cl + "_info_box_skill_name",
			tx("font-size: 15px")
		)
		+ css(cl + "_info_box_skill_text",
			tx("margin-left: 10px")
		)
		+ css(cl + "_info_box_skill_table",
			font,
			tx("margin: 5px 0",
			"text-align: center",
			"border: solid 1px rgba(0,0,0,0.3)")
		)
		+ css(cl + "_info_box_skill_table thead td",
			tx("background: rgba(0,0,0,0.3)",
			"font-style: italic",
			"color: rgba(220,220,220,0.5)")
		)
		+ css(cl + "_info_box_skill_table td",
			tx("padding: 0 3px",
			"min-width: 40px",
			"border: solid 1px rgba(0,0,0,0.3)")
		)
		+ css(id + "information_window_info",
			tx("margin: 10px",
			"color: rgba(220,220,220,0.5)",
			"text-align: left")
		)
		+ css(cl + Scriptname + "_info_openclose",
			tx("cursor: pointer")
		)
		+ css(cl + Scriptname + "_info_openclose_click",
			tx("background: rgba(255,255,255,0.3)",
			"color: rgb(255,255,255)",
			"text-shadow: 0 0 1px rgba(255,255,255,0.5)")
		)
		+ css(cl + "_info_sub ul",
			tx("margin: 0",
			"padding: 0px 20px",
			"font-style: italic",
			"list-style-type: square")
		)
		+ css(cl + "_info_sub_nav",
			tx("margin: 10px 0",
			"padding: 0",
			"border: double 4px rgba(0,0,0,0.3)",
			"list-style-type: none")
		)
		+ css(cl + "_info_sub_nav li",
			tx("margin: 1px",
			"padding: 0 10px",
			"border: solid 1px rgba(0,0,0,0)",
			"cursor: pointer",
			"text-align: center"),
			disp.n
		)
		+ css(cl + "_info_sub_namelight",
			tx("background: rgba(0,0,0,0.3)",
			"border: solid 1px rgba(0,0,0,0.3) !important")
		)
		+ css(cl + "_info_nav_open",
			tx("display: list-item !important")
		)
		+ css(cl + "_info_nav_on",
			tx("color: rgb(255,255,255)")
		)
		
	///////////////////////
		;
	///////////////////////
	s.type = 'text/css';
	s.textContent = t;
	head.appendChild(s);
	return s;
};


//////////////////////////////////////////////////////////////
// create
//

miu$._CREATEhtml = {};

miu$._CREATEhtml.init = function() {
	var stylesheet = miu$._HTMLfunc.stylesheet(),
		top_element = miu$._HTMLfunc.init(),
		open_Button = miu$._HTMLfunc.getlog(top_element),
		information_Window = miu$._HTMLfunc.informationWindow(top_element);
	if(Autoload) {
		miu$._CREATEhtml.setlog(top_element, open_Button);
	} else {
		((f) => {
			f = () => {
				miu$._CREATEhtml.setlog(top_element, open_Button);
				open_Button.removeEventListener('click', f, false);
			};
			open_Button.addEventListener('click', f, false);
		})();
	}
};

miu$._CREATEhtml.setlog = function(top_element, open_Button) {
	var e = document.getElementsByClassName('AL')[0].children,
		i = miu$._GETlog.getIndex(e, 'className', 'CL'),
		data;
	e = e[++i].children;
	e = miu$._CREATEhtml.turnElem(e);
	console.log(e);
	if(open_Button.textContent === "ログ取得") {
		open_Button.textContent = "取得中...";
		data = new miu$._LOGdata.init();
		if(!data.createC(e)) return false;
		if(!data.createL(e)) return false;
		//if(!data.createS()) return false;
		console.log(data);
		miu$._HTMLfunc.mainWindow(top_element, open_Button, data);
		open_Button.textContent = Scriptname + " " + Version;
	}
};

miu$._CREATEhtml.turnElem = function(elem) {
	var res = [];
	Array.from(elem).forEach((v) => {
		if(v.nodeName === "TABLE") {
			if(typeof v.getElementsByClassName('B7i')[0] !== "undefined") res.push([]);
			if(res.length) res[res.length - 1].push(v);
		}
		if(v.nodeName === "DIV") {
			if(res.length) res[res.length - 1].push(v.getElementsByTagName('table')[0]);
		}
	});
	return res;
};



//////////////////////////////////////////////////////////////
// start
//

console.log(miu$);

miu$._STARTscript = miu$._CREATEhtml.init();

})();