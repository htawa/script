// ==UserScript==
// @name         specterX_ktst
// @namespace    miu$_specterX_ktst
// @version      0.3.0
// @description  ktstのログ抽出スクリプト。
// @author       ssz
// @match        http://lisge.com/kk/k/*
// @match        http://lisge.com/kk/tb/*
// @match        http://lisge.com/kk/br/*
// @updataURL    https://github.com/htawa/script/raw/master/specterX_ktst.user.js
// @downloadURL  https://github.com/htawa/script/raw/master/specterX_ktst.user.js
// @grant        none
// ==/UserScript==

/*
※注釈
※同名キャラがいる場合は使えません。
※同一キャラの同名スキルは判別できません。

※取得していないログ
	（キャラ）の（スキル）が消滅！
	離脱メッセージ
	
※取得出来ていないログ
	なにかあれば
*/

(function(){
"use strict";
const miu$ = {},
	ScriptName = "SpecterX_ktst",
	Version = "0.3.0",
	doc = document,
	Bit = 32,
	checkObject = function(obj, str) {return (Object.prototype.toString.call(obj) === "[object " + str + "]");},
	nonnnnono = 0;


//////////////////////////////////////////////////////////////
// webstorage
//
miu$._JSON = {};

miu$._JSON.GET = {};

miu$._JSON.check = function(type) {
	try {
		const storage = window[type],
			x = "__storage_test__";
		storage.setItem(x,x);
		storage.removeItem(x);
		return true;
	} catch(e) {
		return false;
	}
};

miu$._JSON.start = function(func) {
	const type = "localStorage";
	if(miu$._JSON.check(type)) {
		func(window[type]);
	} else {
		alert(type + "を使用出来ませんでした。");
	}
};

miu$._JSON.save = function() {
	miu$._JSON.start(ls => {
		ls.setItem(ScriptName, JSON.stringify(miu$._JSON.GET));
	});
};

miu$._JSON.remove = function() {
	miu$._JSON.start(ls => {
		ls.removeItem(ScriptName);
	});
};

miu$._JSON.set = function() {
	miu$._JSON.start(ls => {
		miu$._JSON.GET = ls.getItem(ScriptName);
		if(!miu$._JSON.GET) {//webstorageが空の時
			miu$._JSON.GET = {};
			miu$._JSON.GET.V_log_preset = {};
			miu$._JSON.save();
		} else {
			miu$._JSON.GET = JSON.parse(miu$._JSON.GET);
			if(!Object.keys(miu$._JSON.GET.V_log_preset).length) {//presetが空の時
				miu$._JSON.GET.V_log_preset = {};
				miu$._JSON.save();
			}
		}
	});
};

miu$._JSON.log = function() {
	miu$._JSON.start(ls => {console.log(ls);});
};

//////////////////////////////////////////////////////////////
// flag
//
miu$._Flag = {};

miu$._Flag.SET = function() {
	const array = [];
	for(let i = 0; i < Bit; ++i) array[i] = 1 << i;
	return array;
};

miu$._Flag.GET = new miu$._Flag.SET();

miu$._Flag.fuyoSkill = {};

miu$._Flag.addressList = function(d) {
	this.character = this.characterlist(d);
	this.key = this.keylist();
	this.subkey = this.subkeylist();
	this.prop = this.proplist();
	this.other = this.otherlist();
};

miu$._Flag.addressList.prototype.characterlist = function(d) {
	const res = [];
	Object.keys(d).forEach(v => {res.push([d[v].Eno + " : " + v, d[v].Eno + " : " + v]);});
	res.push([undefined, "- なし"]);
	return res;
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
	res[19] = ["hDam", "受DAM"];
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
	res[30] = ["護衛", "護衛"];
	res[31] = [undefined, "- なし"];
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
	res[8] = [undefined, "- なし"];
	Object.keys(miu$._Flag.fuyoSkill).forEach(v => {res.push([v, v]);});
	return res;
};

miu$._Flag.addressList.prototype.proplist = function() {
	var res = [];
	res[0] = ["物理ダメージ", "物撃"];
	res[1] = ["魔法ダメージ", "魔撃"];
	res[2] = ["物魔ダメージ", "物魔撃"];
	res[3] = ["変調ダメージ", "変調ダメ"];
	res[4] = ["回復", "回復"];
	res[5] = ["回避", "回避"];
	res[6] = ["効果なし", "効果なし"];
	res[7] = ["増加", "増加"];
	res[8] = ["減少", "減少"];
	res[9] = ["上昇", "上昇"];
	res[10] = ["低下", "低下"];
	res[11] = ["奪取", "奪取"];
	res[12] = ["強奪", "強奪"];
	res[13] = ["強化", "強化"];
	res[14] = ["弱化", "弱化"];
	res[15] = ["追加", "変調追加"];
	res[16] = ["軽減", "変調軽減"];
	res[17] = ["抵抗", "変調抵抗"];
	res[18] = ["変調防御", "変調防御"];
	res[19] = [undefined, "- なし"];
	return res;
};

miu$._Flag.addressList.prototype.otherlist = function() {
	var res = [];
	res[0] = ["スキル説明", "スキル説明"];
	res[1] = ["TstartState", "T開始State"];
	res[2] = ["TstartEnd", "T開始時後"];
	res[3] = ["nTag", "▼An行動"];
	res[4] = ["AnEnd", "▼An行動後"];
	res[5] = ["AturnEnd", "A行動終了時"];
	res[6] = ["Impact", "Impact"];
	res[7] = ["Critical", "critical"];
	res[8] = ["盾回避", "盾回避"];
	res[9] = ["盾受", "盾受"];
	res[10] = ["護衛", "護衛(肩代)"];
	res[11] = [undefined, "- なし"];
	return res;
};

miu$._Flag.addressList.prototype.keysIndex = function(k, s, index) {
	return this.setIndex((arr => {
		const len = arr.length;
		for(let i = 0; i < len; ++i) if(arr[i][index] === s) return i;
		console.log("error","[" + k + " : " + s + "]が不一致。");
		return 0;
	})(this[k]));
};

miu$._Flag.addressList.prototype.setIndex = function(n) {
	return [parseInt(n / Bit), parseInt(n % Bit)];
};

miu$._Flag.addressList.prototype.getIndex = function(mod) {
	return (mod[0] * Bit) + mod[1];
};

miu$._Flag.addressList.prototype.createFlag = function(arr, i) {
	if(Array.isArray(arr)) arr[i[0]] |= miu$._Flag.GET[i[1]];
};

miu$._Flag.addressList.prototype.resetFlag = function(arr, i) {
	if(Array.isArray(arr) && !arr[i[0]]) arr[i[0]] = 0;
};

miu$._Flag.addressList.prototype.getFlag = function(n) {
	return miu$._Flag.GET[n];
};

miu$._Flag.addressList.prototype.checkkey = function(k) {
	return (/target|user/.test(k)) ? "character" : k;
};

miu$._Flag.addressList.prototype.getcharacterName = function(mod) {
	return this.character[this.getIndex(mod)][0].split(/\s:\s/)[1];
};

miu$._Flag.addressList.prototype.getcharacterEno = function(mod) {
	return this.character[this.getIndex(mod)][0].split(/\s:\s/)[0];
};

//////////////////////////////////////////////////////////////
// state
//
miu$._DATAstate = {};

miu$._DATAstate.PC = function(name, eno, mhp, msp, ptid, i) {
	this.Eno = eno;
	this.Name = name;
	this.PTid = ptid;
	this.flagindex = i;
	this.State = new miu$._DATAstate.PC_state(mhp, msp);
};

miu$._DATAstate.PC_state = function(mhp, msp) {
	this.MHP = mhp;
	this.MSP = msp;
};

miu$._DATAstate.stB = function(eno, ptid, mhp, msp) {
	this.Eno = eno;
	this.PTid = ptid;
	this.yDam = 0;
	this.hDam = 0;
	//this.yHeal = 0;
	//this.hHeal = 0;
	//this["連続"] = 0;
	this.Impact = 0;
	//this.shield = 0;
	this.fuyoLv = {};
	this.goei = {};
	this["隊列"] = 0;
	this["変調深度"] = new miu$._DATAstate.hentyo();
	this["変調防御"] = new miu$._DATAstate.hentyo();
	this.per = new miu$._DATAstate.stB_per();
	this.state = new miu$._DATAstate.stB_state(mhp, msp);
	this.stateCount = new miu$._DATAstate.count();
};

miu$._DATAstate.stB_state = function(mhp, msp) {
	this.HP = mhp;
	this.MHP = mhp;
	this.nMHP = mhp;
	this.SP = msp;
	this.MSP = msp;
	this["消費SP"] = 0;
};

miu$._DATAstate.stB_state.prototype.nMHPdoku = function(add) {
	this.nMHP -= Math.floor(add / 2);
};

miu$._DATAstate.stB_per = function() {
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

miu$._DATAstate.stB_per.prototype.Reset = function(key) {
	this[key][0] = 0;
};

miu$._DATAstate.stB_per.prototype.Aend = function() {
	Object.keys(this).forEach(key => {
		if(this[key][0]) {
			--this[key][1];
			if(!this[key][1]) this.Reset(key);
		}
	});
};

miu$._DATAstate.count = function() {
	this.HP = [0, 0]; //[上昇低下, 奪取]
	this.MHP = [0, 0];
	this.SP = [0, 0];
	this.MSP = [0, 0];
	this.AT = [0, 0];
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
	this["消費SP"] = [0, 0];
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

miu$._DATAstate._update = function(num, add) {
	num += add;
	if(num < 0) num = 0;
	return num;
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
	this.n = new RegExp("^▼(" + RegPCstr + ")の(行動|連続行動)！\\((\\d+)\\)(.*)");
	this.tEnd = new RegExp("^　（\\s(" + RegPCstr + ")の(.*)\\s）$");
	this.P = new RegExp("(" + RegPCstr + ")の(.+)$");
	//this.Mc = new RegExp("連続行動がキャンセル！！$");
	this.Md = new RegExp("猛毒により\\s(\\d+)\\sのダメージ！MHPが\\s(\\d+)\\s減少！$");
};

miu$._REG.damage = function(RegPCstr) {
	this.trimE = new RegExp("(" + RegPCstr + ")(の|は|に|から|には)(.*)?$");
	this.Critical = new RegExp("(Critical\\sHit!!)$");
	//this.Tate = new RegExp("盾により(" + RegPCstr + ")への攻撃ダメージが無効化！（盾：(\\d+)→(\\d+)）$");
	this.Kata = new RegExp("(" + RegPCstr + ")への攻撃を(" + RegPCstr + ")が庇った！$");
	//this.TateKaihi = new RegExp("盾回避！$");
	this.skillef = new RegExp("^([自|味|敵|他]?.?)(\\d+)?\\:(.*)！$");
};

miu$._REG.effect = function() {
	var str = "増加|減少|上昇|低下|奪取|強奪|回復|..ダメージ";
	this.Status = new RegExp("^(.?AT|.?DF|.?HIT|.?EVA|SPD|CRI|HEAL)(が|を)(.+)！$");
	this.StatusKJ = new RegExp("^\\s*(.?AT|.?DF|.?HIT|.?EVA|SPD|CRI|HEAL)(\\d+)％(強化|弱化)");
	this.StatusHS = new RegExp("^(M?HP|M?SP)?(が|を|に)?\\s*(\\d+)\\s*の?(" + str + ")！\\s*(.+?！)?$");
	this.yhHeal = new RegExp("(使う|受ける)スキルによるHP回復量が(.+)！$");
	this.yhDam = new RegExp("^次に(受ける|与える)攻撃ダメージへの補正が\\s*");
	this.Hentyo = new RegExp("^(猛毒|衰弱|麻痺|魅了|呪縛|混乱|祝福|加護)(を|に|への防御効果.|特性が|耐性が|深度が|深度を)(\\d*)(.*)！$");
	this.Renzok = new RegExp("次の連続行動が(早く|遅く)なったかも！$");
	//this.syatai = new RegExp("^(射程|隊列)(が)(\\d+).*になった！$");
	//this.shield = new RegExp("盾(が|を)\\s*(\\d*)\\s*(.+)！$");
	//this.nasi = new RegExp("何の効果もなかった！$");
	this.kaihi = new RegExp("攻撃を回避！$");
	this.hate = new RegExp("狙われ(にくく|やすく)なった！$");
	this.fuyoLv = new RegExp("^\\s*(.+)LVが?\\s\\s?(\\d+)\\s\\sが?(.+)！$");
	this.useSp = new RegExp("消費SPが\\s*(\\d+)\\s*(.+)！$");
	this.keigen = new RegExp("(受ける)HP減少/奪取効果が(.+)！$");
	this.impact = new RegExp("衝撃でよろめいた！$");
	this.goei = new RegExp("対する攻撃を\\s*(\\d+)\\s*回護衛！");
	//this.syometu = new RegExp("が消滅！$");
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
	this.logdata = [];
};

miu$._LOGdata.init.prototype.createC = function(e) {
	const ch = new miu$._GETlog.characterTable(e[0]),
		tag = miu$._GETlog.indexlist,
		resultacter = {},
		resultTable = [];
	let membercount = 0;
	ch.character.forEach((v,i) => {
		resultTable[i] = [];
		v.forEach((v,j) => {
			++membercount;
			resultacter[v[tag.name]] = new miu$._DATAstate.PC(v[tag.name], v[tag.eno], v[tag.mhp], v[tag.msp], i, membercount);
			resultTable[i][j] = v[tag.name];
		});
	});
	this.character = resultacter;
	this.acterTable = resultTable;
	return true;
};

miu$._LOGdata.init.prototype.createL = function(e) {
	const state = new miu$._GETlog.turnMessageTable(),
		result = [];
	state.Reg = (RegPCstr => {
		const reg = new miu$._REG.checker();
		Object.keys(this.character).forEach(name => {
			state.stateinit(this.character[name], name);
			["HP", "SP"].forEach(v => {
				state.tST[name].state["M" + v] = this.character[name].State["M" + v];
				state.tST[name].state[v] = this.character[name].State["M" + v];
			});
			state.tST[name].state.nMHP = this.character[name].State.MHP;
			RegPCstr += miu$._LOGdata.regstr(name, reg) + "|";
		});
		RegPCstr = RegPCstr.substr(0, RegPCstr.length - 1);
		return new miu$._REG.script(RegPCstr);
	})("");
	e.forEach((v,i) => {
		const ch = new miu$._GETlog.characterTable(v);
		const pt = (() => {
			const a = [];
			ch.character.forEach(v => {
				a.push(v.length);
				v.forEach(v => {
					Object.keys(state.tST[v[1]]["変調深度"]).forEach(h => {state.tST[v[1]]["変調深度"][h] = v[2][h];});
					state.tST[v[1]]["隊列"] = v[0];
					state.tST[v[1]].state.HP = v[3];
					state.tST[v[1]].state.MHP = v[4];
					state.tST[v[1]].state.SP = v[5];
					state.tST[v[1]].state.MSP = v[6];
				});
			});
			return a;
		})();
		const logdata = state.loginit(v, i);
		result[i] = {"pt": pt, "log": logdata};
		//console.log(i, result[i]);
	});
	this.logdata = result;
	return true;
};

miu$._LOGdata.init.prototype.createS = function() {
	return true;
};

miu$._LOGdata.regstr = function(str, reg) {
	const f = () => {
		let r = "";
		str.split(reg.RegCut).forEach(v => {
			if(reg.RegStr.test(v)) v = "\\" + v;
			r += v;
		});
		return r;
	};
	return (reg.checkReg.test(str)) ? f() : str;
};

//////////////////////////////////////////////////////////////
// log
//
miu$._GETlog = {};

miu$._GETlog.indexlist = {
	"tairetu": 0,
	"name": 1,
	"hentyo": 2,
	"hp": 3,
	"mhp": 4,
	"sp": 5,
	"msp": 6,
	"link": 7,
	"eno": 8
};

miu$._GETlog.infoStatus = function(name, tST) {
	const obj = JSON.parse(JSON.stringify(tST[name]));
	return obj;
};

miu$._GETlog.before_tST = function(tST) {
	return JSON.parse(JSON.stringify(tST));
};

//////要素のフィルタリング/////////////////////////////////////
miu$._GETlog.getIndex = function(e, name, str) {
	const reg = new RegExp(str);
	return Array.from(e).findIndex(v => {
		return reg.test(v[name]);
	});
};

miu$._GETlog.splitGetNode = function(e, name, str) {
	const r = [[],[]],
		reg = new RegExp(str);
	Array.from(e).forEach(v => {
		r[(reg.test(v[name])) ? 0 : 1].push(v);
	});
	return r;
};

//////ターン毎の人数,変調,MHP,MSPを取得/////////////////////////
miu$._GETlog.characterTable = function(tElem) {
	this.character = this.Turn(tElem);
};

miu$._GETlog.characterTable.prototype.Turn = function(e) {
	const tTable = e[0].getElementsByTagName('table');
	return [tTable[2], tTable[3]].map((v,i) => {
		return Array.from(v.getElementsByTagName('tr')).map(v => {
			return this.parseText(miu$._GETlog.splitGetNode(v.getElementsByTagName('td'), 'className', 'F2'), i);
		});
	});
};

miu$._GETlog.characterTable.prototype.parseText = function(e, i) {
	const str = [],
		tag = miu$._GETlog.indexlist;
	let cache;
	cache = e[1][0].align;
	str[tag.tairetu] = (cache === "CENTER") ? 2 : (cache === "RIGHT") ? (i) ? 3 : 1 : (i) ? 1 : 3;
	e = miu$._GETlog.splitGetNode(e[0][0].children, 'className', 'LKG\\d+');
	str[tag.link] = parseInt(e[0][0].className.split(/(\d+)/)[1], 10);
	e = miu$._GETlog.splitGetNode(e[1], 'nodeName', 'BR|IMG')[1];
	cache = e[e.length-1].textContent.split(/(\d+)/);
	str[tag.sp] = parseInt(cache[1], 10);
	str[tag.msp] = parseInt(cache[3], 10);
	--e.length;
	cache = e[e.length-1].textContent.split(/(\d+)/);
	str[tag.hp] = parseInt(cache[1], 10);
	str[tag.mhp] = parseInt(cache[3], 10);
	--e.length;
	e = miu$._GETlog.splitGetNode(e, 'nodeName', 'SPAN');
	str[tag.name] = e[1][0].textContent;
	if(e[1][0].nodeName === "A") {
		cache = e[1][0].href.split(/id=(\d+)/);
		str[tag.eno] = parseInt(cache[1], 10);
	} else {
		str[tag.eno] = 0;
	}
	str[tag.hentyo] = (hnty => {
		const r = new miu$._DATAstate.hentyo();
		hnty.forEach(v => {
			const s = v.textContent.split(/(\d+)/);
			r[s[0]] = parseInt(s[1], 10);
		});
		return r;
	})(e[0]);
	return str;
};

//////ターン毎のログを取得//////////////////////////////////////
miu$._GETlog.turnMessageTable = function() {
	this.tST = {};
	this.Reg = {};
};

miu$._GETlog.turnMessageTable.prototype.stateinit = function(obj, name) {
	this.tST[name] = new miu$._DATAstate.stB(obj.Eno, obj.PTid, 0, 0);
};

miu$._GETlog.turnMessageTable.prototype.loginit = function(tElem, tNum) {
	const result = [];
	const tagT = [{"type": "S", "id": "T開始State"}];
	(btST => {
		Object.keys(btST).forEach(u => {
			tagT.push(this.pushResult(btST, u, u, this.listResult(btST, u, u, undefined, undefined, undefined, undefined, "TstartState")));
		});
	})(miu$._GETlog.before_tST(this.tST));
	tElem.forEach((v,i) => {
		v = v.getElementsByTagName('td')[0].lastElementChild;
		v = miu$._GETlog.splitGetNode(v.children, 'nodeName', '^BR$')[1];
		const Aindex = v.findIndex(v => {return this.Reg.action.n.test(v.textContent);});
		if(Aindex >= 0) {//A行動
			//console.log(i, "A行動", v);
			const a = miu$._GETlog.msgsplit(v[Aindex])[0].split(this.Reg.action.n);
			const hentyo = (v => {
				const r = new miu$._DATAstate.hentyo();
				const hReg = new miu$._REG.hentyo();
				v = v.split(/[\[\]]/).filter(v => {return (/:/.test(v) && hReg.type.test(v));});
				v.forEach(v => {
					const s = v.split(/:(\d+)/);
					s[0] = s[0].split(hReg.type)[1];
					r[s[0]] = parseInt(s[1], 10);
				});
				return r;
			})(a[4]);
			const tagA = {"user": a[1], "nA": parseInt(a[3], 10), "変調深度": hentyo};
			result[i] = this.checkSkill(v, tagA);
			this.tST[tagA.user].per.Aend();
			this.tST[tagA.user].Impact = 0;
			const tagE = [{"type": "E", "user": tagA.user, "id": "A行動終了時"}, this.pushResult(miu$._GETlog.before_tST(this.tST), tagA.user, tagA.user, this.listResult(this.tST, tagA.user, undefined, undefined, undefined, undefined, undefined, "AturnEnd"))];
			if(result[i][result[i].length-1] === 0) {
				result[i][result[i].length-1] = tagE;
			} else {
				result[i].push(tagE);
			}
		} else {//開始時,離脱時
			//console.log(i, "開始時,離脱時", v);
			result[i] = this.checkSkill(v, {});
		}
	});
	result[0].unshift(tagT);
	result[0].push([{"type": "E", "id": "T開始時後"}, this.listResult(this.tST, undefined, undefined, undefined, undefined, undefined, undefined, "TstartEnd")]);
	//console.log(456, result);
	return result;
};

miu$._GETlog.msgsplit = function(v) {
	return v.textContent.split(/\n/).filter(v => {
		return (!/^\t/.test(v));
	});
};

miu$._GETlog.turnMessageTable.prototype.checkSkill = function(e, tagA) {
	const result = [], len = e.length;
	for(let i = 0; i < len; ++i) {
		const msg = miu$._GETlog.msgsplit(e[i]);
		const key = (msg[1] === "") ? undefined : Object.keys(this.Reg.action).find(v => {return this.Reg.action[v].test(msg[0]);});
		//console.log(e[i], msg, key);
		if(key) {
			if(key === "n") {
				const a = msg[0].split(this.Reg.action.n);
				const tagN = {"type": "N", "user": a[1], "id": "▼An行動", "nA": parseInt(a[3], 10), "nN": a[2]};
				if(!/連続/.test(tagN.nN)) {
					Object.keys(tagA["変調深度"]).forEach(v => {
						this.tST[tagA.user]["変調深度"][v] = tagA["変調深度"][v];
					});
				}
				result[i] = [tagN, this.pushResult(miu$._GETlog.before_tST(this.tST), tagA.user, tagA.user, this.listResult(this.tST, tagA.user, undefined, undefined, undefined, undefined, undefined, "nTag"))];
				++i;
			}
			result[i] = this["action_" + key](e[i], msg, tagA);
		} else {
			console.log(999, "error: key = " + key, msg[0]);
		}
	}
	//console.log("checkSkill", result);
	return result;
};

/////////action/////////
miu$._GETlog.turnMessageTable.prototype.action_L = function(el, message, tagA) {
	const a = message[0].split(this.Reg.action.L),
		result = [];
	result[0] = {"type": "L", "user": a[1], "id": message[1], "slv": 0};
	this.checkMessage(2, result, el, message);
	//console.log("L", result);
	return result;
};
miu$._GETlog.turnMessageTable.prototype.action_n = function(el, message, tagA) {
	const e = miu$._GETlog.splitGetNode(el.children, 'nodeName', 'BR')[1],
		result = [];
	for(let i = 0; i < e.length; ++i) {
		const msg = miu$._GETlog.msgsplit(e[i]),
			key = Object.keys(this.Reg.action).find(v => {return this.Reg.action[v].test(msg[0]);});
		result[i] = [];
		if(key) {//L,P
			result[i] = this["action_" + key](e[i], msg, tagA);
		} else {//n
			result[i][0] = {"type": "A", "user": tagA.user, "id": msg[0], "slv": 0};
			(sp => {
				const useSP = (sp * (sp + 1) / 2 * 10) + this.tST[tagA.user].state["消費SP"];
				if(useSP > 0) this.tST[tagA.user].state.SP -= useSP;
			})(miu$._GETlog.splitGetNode(e[0].children, 'className', 'P2')[0].length);
			this.checkMessage(1, result[i], e[i], msg);
		}
	}
	result.push([{"type": "E", "user": tagA.user, "id": "▼An行動後"}, this.pushResult(miu$._GETlog.before_tST(this.tST), tagA.user, tagA.user, this.listResult(this.tST, tagA.user, undefined, undefined, undefined, undefined, undefined, "AnEnd"))]);
	//console.log("n", result);
	return result;
};
miu$._GETlog.turnMessageTable.prototype.action_P = function(el, message, tagA) {
	const a = message[0].split(this.Reg.action.P),
		r = /LV/, result = [];
	a[3] = 0;
	if(r.test(a[2])) {
		const b = a[2].split(r);
		a[2] = b[0];
		a[3] = parseInt(b[1], 10);
	}
	result[0] = {"type": "P", "user": a[1], "id": a[2], "slv": a[3]};
	this.checkMessage(1, result, el, message);
	//console.log("P", result);
	return result;
};
miu$._GETlog.turnMessageTable.prototype.action_Md = function(el, message, tagA) {
	const a = message[0].split(this.Reg.action.Md),
		btST = miu$._GETlog.before_tST(this.tST),
		f = new miu$._Flag.addressList(this.tST),
		func = (a,b) => {return f[a][f.getIndex(b[a])][0];},
		result = [{}, [{}, {}]];
	result[0] = {"type": "H", "user": tagA.user, "id": "猛毒ダメージ", "slv": this.tST[tagA.user]["変調深度"]["毒"]};
	result[1][0] = this.pushResult(btST, tagA.user, tagA.user, this.listResult(this.tST, tagA.user, tagA.user, parseInt(a[1], 10), "HP", undefined, "変調ダメージ", undefined));
	result[1][1] = this.pushResult(btST, tagA.user, tagA.user, this.listResult(this.tST, tagA.user, tagA.user, parseInt(a[2], 10), "MHP", undefined, "減少", undefined));
	this.state_hpsp(func("prop", result[1][0]), tagA.user, tagA.user, func("key", result[1][0]), result[1][0].add, this.tST);
	this.state_hpsp(func("prop", result[1][1]), tagA.user, tagA.user, func("key", result[1][1]), result[1][1].add, this.tST);
	this.tST[tagA.user].state.nMHPdoku(result[1][1].add);
	//console.log("H", result);
	return result;
};
miu$._GETlog.turnMessageTable.prototype.action_tEnd = function(el, message, tagA) {
	const hReg = new miu$._REG.hentyo(),
		a = message[0].split(this.Reg.action.tEnd)[2].split(/が解消！|が消滅！/);
	a.forEach(v => {
		const c = v.split(hReg.type)[1];
		if(c) this.tST[tagA.user]["変調深度"][c] = 0;
	});
	//console.log("tEnd", result);
	return 0;
};

miu$._GETlog.turnMessageTable.prototype.checkMessage = function(index, result, el, message) {
	const len = message.length,
		countlist = {"cri": undefined, "kata": undefined},
		Plist = miu$._GETlog.splitGetNode(el.children, 'nodeName', 'DL')[0];
	const func_length = r => {
		let len = 0;
		r.forEach(v => {if(checkObject(v, "Array") && v[0].type) len += func_length(v);});
		len += r.length;
		return len;
	};
	for(let i = index, Pi = 0; i < len; ++i) {
		//console.log(i, message[i]);
		const key = Object.keys(this.Reg.damage).find(v => {return this.Reg.damage[v].test(message[i]);});
		if(key) {
			let r = this["damage_" + key](message[i], result[0], countlist);
			if(!r && this.Reg.action.P.test(message[i])) {
				r = this.action_P(Plist[Pi], miu$._GETlog.msgsplit(Plist[Pi]), {});
				++Pi;
				i += func_length(r);
			}
			if(r) result.push(r);
		} else {
			if(message[i] !== "") console.log(777, "error: msgkey = " + key, message[i]);
		}
	}
};

/////////damage/////////
miu$._GETlog.turnMessageTable.prototype.damage_trimE = function(msg, sobj, cl) {
	const m = msg.split(this.Reg.damage.trimE);
	const key = Object.keys(this.Reg.effect).find(v => {return this.Reg.effect[v].test(m[3]);});
	if(key) {
		const str = {"target": m[1], "eff": m[3].split(this.Reg.effect[key]), "dmg": m, "cl": cl};
		const r = this["effect_" + key](str, sobj, miu$._GETlog.before_tST(this.tST));
		if(r) return r;
	}
	return key;
};
miu$._GETlog.turnMessageTable.prototype.damage_Critical = function(msg, sobj, cl) {
	const add = msg.match(/Critical\sHit!!/g).length,
		li = this.listResult(this.tST, sobj.user, undefined, add, undefined, undefined, undefined, "Critical");
	cl.cri = li;
	return li;
};
miu$._GETlog.turnMessageTable.prototype.damage_Kata = function(msg, sobj, cl) {
	const m = msg.split(this.Reg.damage.Kata),
		li = this.listResult(this.tST, m[2], m[1], undefined, undefined, undefined, undefined, "護衛");
	--this.tST[m[2]].goei[m[1]];
	cl.kata = li;
	return li;
};
miu$._GETlog.turnMessageTable.prototype.damage_skillef = function(msg, sobj, cl) {
	const li = this.listResult(this.tST, sobj.user, undefined, undefined, undefined, undefined, undefined, "スキル説明");
	li.spec = msg;
	return li;
};

/////////effect/////////
miu$._GETlog.turnMessageTable.prototype.effect_Status = function(msg, sobj, btST) {
	const li = this.listResult(this.tST, sobj.user, msg.target, undefined, msg.eff[1], undefined, msg.eff[3], undefined);
	this.count(li.prop, li.key, msg.target);
	return this.pushResult(btST, sobj.user, msg.target, li);
};
miu$._GETlog.turnMessageTable.prototype.effect_StatusKJ = function(msg, sobj, btST) {
	const add = parseInt(msg.eff[2], 10),
		key = msg.eff[1],
		prop = msg.eff[3],
		m = [msg.dmg[0], msg.eff[4]],
		regexp = [/^(\d+)\sターンの間、/, /(\d+)\sターンに..！$/];
	let turn = 0;
	regexp.forEach((v,i) => {if(v.test(m[i])) turn = parseInt(m[i].split(v)[1], 10);});
	this.tST[msg.target].per[key][1] = turn;
	if(turn) {
		this.tST[msg.target].per[key][0] = (prop === "強化") ? add : -add;
	} else {
		this.tST[msg.target].per.Reset(key);
	}
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, add, key, undefined, prop, undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_StatusHS = function(msg, sobj, btST) {
	const list = [];
	const func_li = str => {
		const add = parseInt(str[3], 10);
		const prop = str[4];
		const key = (str[1]) ? str[1] : "HP";
		if(/ダメージ/.test(prop)) {
			this.tST[sobj.user].yDam = 0;
			this.tST[msg.target].hDam = 0;
		}
		const li = this.listResult(this.tST, sobj.user, msg.target, add, key, undefined, prop, undefined);
		this.count(li.prop, li.key, msg.target);
		if(key === "MHP") console.log("nMHP計算");
		this.state_hpsp(prop, sobj.user, msg.target, key, add, this.tST);
		return li;
	};
	list.push(func_li(msg.eff));
	if(msg.eff[5]) list.push(func_li(msg.eff[5].split(this.Reg.effect.StatusHS)));
	list.forEach(v => {
		this.pushResult(btST, sobj.user, msg.target, v);
		if(msg.cl.cri) v.info.cri = msg.cl.cri.add;
	});
	Object.keys(msg.cl).forEach(v => {msg.cl[v] = undefined;});
	return list;
};
miu$._GETlog.turnMessageTable.prototype.effect_yhHeal = function(msg, sobj, btST) {
	const key = (msg.eff[1] === "使う") ? "yHeal" : "hHeal";
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, undefined, key, undefined, msg.eff[2], undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_yhDam = function(msg, sobj, btST) {
	const key = (msg.eff[1] === "受ける") ? "hDam" : "yDam",
		m = msg.eff[2].split(/(.\d+)/),
		add = (m.length > 1) ? parseInt(m[1], 10) : 0;
	this.tST[msg.target][key] = add;
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, add, key, undefined, undefined, undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_Hentyo = function(msg, sobj, btST) {
	const hReg = new miu$._REG.hentyo();
	const a = {
		"add": parseInt(msg.eff[3], 10),
		"subkey": msg.eff[1].split(hReg.type)[1],
		"prop": msg.eff[4],
		"key": Object.keys(hReg.keys).find(v => {return hReg.keys[v].test(msg.eff[2]);})
	};
	const funckey = (a.key) ? a.key.match(/防御|深度/) : null;
	if(!a.add) a.add = undefined;
	if(funckey !== null) {
		a.prop = ((fk,pr) => {
			const func = {};
			func["防御"] = p => {
				const reg = {"追加": /得た/, "減少": /減/};
				p = Object.keys(reg).find(v => {return reg[v].test(p);});
				this.tST[msg.target][a.key][a.subkey] = miu$._DATAstate._update(this.tST[msg.target][a.key][a.subkey], (p === "追加") ? a.add : -a.add);
				return p;
			};
			func["深度"] = p => {
				const reg = {"追加": /.*追加/, "軽減": /減/, "抵抗": /抵抗/, "変調防御": /防御/, "奪取": /奪取/};
				p = Object.keys(reg).find(v => {return reg[v].test(p);});
				if(p === "抵抗") {
					a.add = 0;
					return p;
				}
				if(p === "奪取") {
					this.tST[msg.target][a.key][a.subkey] = miu$._DATAstate._update(this.tST[msg.target][a.key][a.subkey], -a.add);
					this.tST[sobj.user][a.key][a.subkey] = miu$._DATAstate._update(this.tST[sobj.user][a.key][a.subkey], a.add);
				} else {
					((key,add) => {
						this.tST[msg.target][key][a.subkey] = miu$._DATAstate._update(this.tST[msg.target][key][a.subkey], add);
					})((p === "変調防御") ? p : a.key, (p === "追加") ? a.add : -a.add);
				}
				return p;
			};
			return func[fk](pr);
		})(funckey[0], a.prop);
	}
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, a.add, a.key, a.subkey, a.prop, undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_Renzok = function(msg, sobj, btST) {
	const prop = (msg.eff[1] === "早く") ? "増加" : "減少";
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, undefined, "連続", undefined, prop, undefined));
};
//miu$._GETlog.turnMessageTable.prototype.effect_syatai = function(msg, sobj, btST) {};
//miu$._GETlog.turnMessageTable.prototype.effect_shield = function(msg, sobj, btST) {};
//miu$._GETlog.turnMessageTable.prototype.effect_nasi = function(msg, sobj, btST) {};
miu$._GETlog.turnMessageTable.prototype.effect_kaihi = function(msg, sobj, btST) {
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, undefined, undefined, undefined, "回避", undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_hate = function(msg, sobj, btST) {
	const prop = (msg.eff[1] === "やすく") ? "増加" : "減少";
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, undefined, "Hate", undefined, prop, undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_fuyoLv = function(msg, sobj, btST) {
	return ((u,t,k,add,prop,fuyo) => {
		const i = (/増加/.test(prop)) ? 1 : -1;
		if(!fuyo[k]) fuyo[k] = 0;
		if(!miu$._Flag.fuyoSkill[k]) miu$._Flag.fuyoSkill[k] = true;
		fuyo[k] = miu$._DATAstate._update(fuyo[k], add * i);
		return this.pushResult(btST, u, t, this.listResult(this.tST, u, t, add, "付与lv", k, prop, undefined));
	})(sobj.user , msg.target, msg.eff[1], parseInt(msg.eff[2], 10), (/付加|増加/.test(msg.eff[3])) ? "増加" : "減少", this.tST[msg.target].fuyoLv);
};
miu$._GETlog.turnMessageTable.prototype.effect_useSp = function(msg, sobj, btST) {
	const add = parseInt(msg.eff[1], 10);
	const prop = msg.eff[2];
	const i = (/増加|上昇/.test(prop)) ? 1 : -1;
	const li = this.listResult(this.tST, sobj.user, msg.target, add, "消費SP", undefined, prop, undefined);
	this.count(li.prop, li.key, msg.target);
	this.tST[msg.target].state["消費SP"] += add * i;
	return this.pushResult(btST, sobj.user, msg.target, li);
};
miu$._GETlog.turnMessageTable.prototype.effect_keigen = function(msg, sobj, btST) {
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, undefined, "軽減率", undefined, msg.eff[2], undefined));
};
miu$._GETlog.turnMessageTable.prototype.effect_impact = function(msg, sobj, btST) {
	this.tST[msg.target].Impact++;
	return this.pushResult(btST, sobj.user, msg.target, this.listResult(this.tST, sobj.user, msg.target, undefined, undefined, undefined, undefined, "Impact"));
};
miu$._GETlog.turnMessageTable.prototype.effect_goei = function(msg, sobj, btST) {
	return ((u,t,add) => {
		if(typeof this.tST[u].goei[t] === "undefined") this.tST[u].goei[t] = 0;
		this.tST[u].goei[t] += add;
		return this.pushResult(btST, u, t, this.listResult(this.tST, u, t, add, "護衛", undefined, undefined, undefined));
	})(sobj.user, msg.target, parseInt(msg.eff[1], 10));
};
//miu$._GETlog.turnMessageTable.prototype.effect_syometu = function(msg, sobj) {};

//////////
miu$._GETlog.turnMessageTable.prototype.listResult = function(tST, user, target, add, key, subkey, prop, other) {
	const f = new miu$._Flag.addressList(tST);
	return {
		"target": f.keysIndex("character", ((target) ? tST[target].Eno + " : " + target : target), 0),
		"user": f.keysIndex("character", ((user) ? tST[user].Eno + " : " + user : user), 0),
		"add": add, "key": f.keysIndex("key", key, 0),
		"subkey": f.keysIndex("subkey", subkey, 0),
		"prop": f.keysIndex("prop", prop, 0),
		"other": f.keysIndex("other", other, 0)
	};
};

miu$._GETlog.turnMessageTable.prototype.pushResult = function(tST, user, target, li) {
	li.info = {"userStatus": miu$._GETlog.infoStatus(user, tST), "targetStatus": miu$._GETlog.infoStatus(target, tST)};
	return li;
};

//////////
miu$._GETlog.turnMessageTable.prototype.state_hpsp = function(prop, user, target, key, add, tST) {
	const regs = [/ダメージ|減少|低下/, /奪取|強奪/, /増加|上昇|回復/],
		func = t => {if(/sp/.test(key) && (t[key] < 0)) t[key] = 0;};
	let i = regs.findIndex(v => {return v.test(prop);});
	if(i < 0) alert("state_hpsp : " + prop);
	if(--i) {
		tST[target].state[key] += add * i;
		func(tST[target].state);
	} else {//奪取|強奪
		tST[target].state[key] += -add;
		func(tST[target].state);
		tST[user].state[key] += add;
		target = user;
	}
	if(!/M../.test(key) && (tST[target].state[key] > tST[target].state["M" + key])) tST[target].state[key] = tST[target].state["M" + key];
};

miu$._GETlog.turnMessageTable.prototype.count = function(prop, key, target) {
	const f = new miu$._Flag.addressList(this.tST),
		k = f.key[f.getIndex(key)][0],
		i = [[6], [9, 10], [11]].findIndex(v => {return v.find(v => {return v === f.getIndex(prop);});});
	if(i) {
		this.tST[target].stateCount[k][i-1]++;
	} else {
		//効果が無かった
	}
};


//////////////////////////////////////////////////////////////
// html
//
miu$._HTMLfunc = {};

miu$._HTMLfunc.top_element = function() {
	return miu$._HTMLfunc.createANDappendChild('div', doc.body, function(e) {
		e.id = ScriptName;
	});
};

miu$._HTMLfunc.open_Button = function(top_element) {
	return miu$._HTMLfunc.createANDappendChild('div', top_element, function(e) {
		const tx = "_openlight";
		e.id = "open_Button";
		e.textContent = "ログ取得";
		e.addEventListener('mouseenter', function() {this.classList.add(tx);}, false);
		e.addEventListener('mouseleave', function() {this.classList.remove(tx);}, false);
	});
};

miu$._HTMLfunc.createANDappendChild = function(t, elem, func) {
	const e = doc.createElement(t);
	func(e);
	elem.appendChild(e);
	return e;
};

//miu$._HTMLfunc.alpha = 0.8;

//////overlay_window//////////////////////////////////////////
miu$._HTMLfunc.mainWindow = function(top_element, open_Button, data) {
	const e = {"overlay_Window": 0, "top_overlay": 0, "overlay_close": 0, "opacity": 0, "menu_tab": 0, "main_area": 0};
	Object.keys(e).forEach(v => {
		e[v] = doc.createElement('div');
		e[v].id = v;
	});
	let alpha = 0.8;
	const func_overlay_opacity = v => {
		alpha = v;
		e.overlay_Window.style.backgroundColor = "rgba(0,0,0," + v + ")";
	};
	top_element.appendChild(e.overlay_Window);
	e.overlay_Window.appendChild(e.top_overlay);
	e.overlay_Window.appendChild(e.main_area);
	e.top_overlay.appendChild(e.overlay_close);
	e.top_overlay.appendChild(e.opacity);
	e.top_overlay.appendChild(e.menu_tab);
	func_overlay_opacity(alpha);
	e.overlay_close.textContent = "close";
	e.opacity.textContent = "透明度 :";
	const input = miu$._HTMLfunc.createANDappendChild('input', e.opacity, (el) => {
		el.type = "number";
		el.max = 1;
		el.min = 0;
		el.step = 0.01;
		el.value = alpha;
	});
	input.addEventListener('change', () => {
		func_overlay_opacity(input.value);
	}, false);
	miu$._HTMLfunc.menuTab(e, open_Button, data);
};

miu$._HTMLfunc.menuTab = function(e, open_Button, data) {
	const view = {"view_takeLog": 0, "view_setting": 0};
	const menu = {"ログ": 0, "設定": 0};
	const v = Object.keys(view);
	const m = Object.keys(menu);
	const onlist = {};
	let menuOn = 0;
	v.forEach(k => {
		view[k] = miu$._HTMLfunc.createANDappendChild('div', e.main_area, (el) => {
			el.id = k;
			el.classList.add(ScriptName + "_view");
		});
		onlist[k] = 0;
		miu$._HTMLfunc["v_"+ k](data, k, onlist, view[k]);
	});
	m.forEach(k => {
		menu[k] = miu$._HTMLfunc.createANDappendChild('span', e.menu_tab, (el) => {
			el.classList.add(ScriptName + "_menu");
			el.textContent = k;
		});
	});
	e.overlay_close.addEventListener('mouseenter', function() {this.classList.add("_closelight");}, false);
	e.overlay_close.addEventListener('mouseleave', function() {this.classList.remove("_closelight");}, false);
	open_Button.addEventListener('click', () => {e.overlay_Window.classList.add("_disp_f");}, false);
	e.overlay_close.addEventListener('click', function() {e.overlay_Window.classList.remove("_disp_f");}, false);
	const func_chenge_viewlight = (before, after) => {
		menu[m[before]].classList.remove("_menulight");
		menu[m[after]].classList.add("_menulight");
		view[v[before]].classList.remove("_disp_b");
		view[v[after]].classList.add("_disp_b");
	};
	func_chenge_viewlight(menuOn, menuOn);
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
				func_chenge_viewlight(menuOn, i);
				menuOn = i;
			}
		}, false);
	});
};

//////view_takeLog////////////////////////////////////////////
miu$._HTMLfunc.v_view_takeLog = function(data, key, onlist, viewElem) {
	const e = {"select_area": "div", "logtop": "div", "preset_select": "select", "preset_text": "input", "preset_button": "input", "preset_delete": "input", "select_main": "div", "select_area2": "div", "checkSelect": "div", "select_right": "div", "search_box": "input", "search_box_spec": "input", "select_getter": "div", "select_result": "div", "result_area": "div"};
	const select = {"target": 0, "user": 0, "key": 0, "subkey": 0, "prop": 0, "other": 0};
	const result = {"select_list": "select", "select_button": "input"};
	const option = {"csv": 0};
	const rElem = {}, r_func = {};
	const flag = new miu$._Flag.addressList(data.character);
	const func_create = e => {
		Object.keys(e).forEach(v => {
			e[v] = doc.createElement(e[v]);
			e[v].classList.add("v_tL_" + v);
		});
	};
	const func_light = function(v) {
		v.addEventListener('mouseenter', function() {this.classList.add("_text_sublight");}, false);
		v.addEventListener('mouseleave', function() {this.classList.remove("_text_sublight");}, false);
	};
	const func_labelinput = (text, cl, inputtype) => {
		const e = {"label": 0, "input": 0, "span": 0};
		Object.keys(e).forEach(v => {e[v] = doc.createElement(v);});
		e.label.classList.add("v_tL_" + cl);
		e.label.appendChild(e.input);
		e.label.appendChild(e.span);
		e.input.type = inputtype;
		e.input.name = cl;
		e.span.textContent = text;
		return e;
	};
	func_create(e);
	func_create(result);
	miu$._HTMLfunc._presetLoad(e.preset_select, miu$._JSON.GET.V_log_preset);
	e.preset_text.type = "text";
	e.preset_text.placeholder = "プリセット登録名";
	e.preset_text.spellcheck = false;
	e.preset_button.type = "button";
	e.preset_button.value = "登録";
	e.preset_delete.type = "button";
	e.preset_delete.value = "削除";
	e.search_box.type = "search";
	e.search_box.placeholder = "スキル名検索";
	e.search_box.spellcheck = false;
	e.search_box_spec.type = "search";
	e.search_box_spec.placeholder = "スキル効果検索";
	e.search_box_spec.spellcheck = false;
	e.checkSelect.appendChild(e.search_box);
	e.checkSelect.appendChild(e.search_box_spec);
	Object.keys(select).forEach(k => {
		const elogGet = {"logGetSelect": "div", "logGetTitle": "div", "hide": "div"};
		const span = {"icon": "▶", "name": ("." + k)};
		func_create(elogGet);
		Object.keys(span).forEach(k => {
			span[k] = miu$._HTMLfunc.createANDappendChild('span', elogGet.logGetTitle, el => {
				el.textContent = span[k];
				el.classList.add(k);
			});
		});
		miu$._HTMLfunc.createANDappendChild('div', elogGet.hide, d => {
			["[ 全選択 ]", "[ 全解除 ]"].forEach(k => {
				miu$._HTMLfunc.createANDappendChild('span', d, s => {
					s.classList.add("_input_allchecked");
					s.textContent = k;
					func_light(s);
					s.addEventListener('click', function() {
						const b = /選択/.test(k);
						Array.from(this.parentNode.parentNode.getElementsByTagName('input')).forEach(v => {v.checked = b;});
					}, false);
				});
			});
		});
		if(/target|user/.test(k)) {
			flag.character.forEach(v => {
				miu$._HTMLfunc.createANDappendChild('div', elogGet.hide, d => {
					const il = func_labelinput(v[1], "logGet_pc", "checkbox");
					il.input.checked = true;
					d.appendChild(il.label);
					func_light(d);
				});
			});
		} else {
			let d = 0;
			flag[k].forEach((v,i) => {
				const il = func_labelinput(v[1], "logGet_st", "checkbox");
				il.input.checked = true;
				if((i + 1) % 2) {
					d = miu$._HTMLfunc.createANDappendChild('div', elogGet.hide, () => {});
				}
				d.appendChild(il.label);
				func_light(il.label);
			});
		}
		func_light(elogGet.logGetTitle);
		elogGet.logGetTitle.addEventListener('click', function() {
			if(span.icon.textContent === "▶") {
				span.icon.textContent = "▽";
				this.nextSibling.classList.add("_disp_b");
			} else {
				span.icon.textContent = "▶";
				this.nextSibling.classList.remove("_disp_b");
			}
		}, false);
		elogGet.logGetSelect.appendChild(elogGet.logGetTitle);
		elogGet.logGetSelect.appendChild(elogGet.hide);
		e.checkSelect.appendChild(elogGet.logGetSelect);
		select[k] = elogGet;
	});
	Object.keys(option).forEach(v => {
		option[v] = miu$._HTMLfunc.createANDappendChild('option', result.select_list, op => {
			op.textContent = v;
			op.value = option[v];
		});
		rElem[v] = doc.createElement('div');
		rElem[v].classList.add("v_tL_result_hide");
	});
	result.select_button.type = "button";
	result.select_button.value = "search";
	viewElem.appendChild(e.select_area);
	e.select_area.appendChild(e.logtop);
	e.logtop.appendChild(e.preset_select);
	e.logtop.appendChild(e.preset_text);
	e.logtop.appendChild(e.preset_button);
	e.logtop.appendChild(e.preset_delete);
	e.select_area.appendChild(e.select_main);
	e.select_main.appendChild(e.select_area2);
	e.select_area2.appendChild(e.checkSelect);
	e.select_area2.appendChild(e.select_right);
	e.select_right.appendChild(e.select_getter);
	e.select_right.appendChild(e.result_area);
	e.select_getter.appendChild(result.select_list);
	e.select_getter.appendChild(result.select_button);
	(() => {//csv
		const els = {"syntax": "input", "rText": "textarea", "copy_area": "div", "manual": "div"};
		const cpy = {"rCopy": "input"};
		Object.keys(els).forEach(v => {els[v] = miu$._HTMLfunc.createANDappendChild(els[v], rElem.csv, d => {d.classList.add("v_tL_csv_" + v);});});
		Object.keys(cpy).forEach(v => {cpy[v] = miu$._HTMLfunc.createANDappendChild(cpy[v], els.copy_area, d => {d.classList.add("v_tL_csv_" + v);});});
		els.syntax.type = "search";
		els.syntax.placeholder = " syntax";
		els.syntax.spellcheck = false;
		cpy.rCopy.type = "button";
		cpy.rCopy.value = "copy";
		els.rText.readOnly = true;
		els.rText.placeholder = " csv";
		els.rText.spellcheck = false;
		els.rText.value = "";
		els.t = (() => {
			const t = {"table": "table", "tbody": "tbody"};
			const tr = {
				"turn": [0, "ターン"], "Eno": [1, "Eno"],
				"char": [1, "キャラクターの名前"], "pt": [1, "PTの残り人数"],
				"yDam": [1, "与DAM％"], "hDam": [1, "受DAM％"],
				//"yHeal": [1, "与HEAL"], "hHeal": [1, "被HEAL"],
				//"Rnzk": [1, "連続"],
				"Imp": [1, "Impact"],
				"stHP": [1, "HP"], "stMHP": [1, "MHP"],
				"stnMHP": [1, "nMHP"],"stSP": [1, "SP"],
				"stMSP": [1, "MSP"],
				//"stAT": [1, "AT"],
				//"stMAT": [1, "MAT"], "stDF": [1, "DF"],
				//"stMDF": [1, "MDF"], "stEVA": [1, "EVA"],
				//"stMEVA": [1, "MEVA"], "stHIT": [1, "HIT"],
				//"stMHIT": [1, "MHIT"], "stSPD": [1, "SPD"],
				//"stCRI": [1, "CRI"], "stHEAL": [1, "HEAL"],
				"H毒": [1, "猛毒"], "H衰": [1, "衰弱"],
				"H痺": [1, "麻痺"], "H肉": [1, "肉体変調"],
				"H魅": [1, "魅了"], "H呪": [1, "呪縛"],
				"H乱": [1, "混乱"], "H精": [1, "精神変調"],
				"H祝": [1, "祝福"], "H護": [1, "加護"],
				"%AT": [1, "AT+％"], "%MAT": [1, "MAT+％"],
				"%DF": [1, "DF+％"], "%MDF": [1, "MDF+％"],
				"%EVA": [1, "EVA+％"], "%MEVA": [1, "MEVA+％"],
				"%HIT": [1, "HIT+％"], "%MHIT": [1, "MHIT+％"],
				"%SPD": [1, "SPD+％"], "%CRI": [1, "CRI+％"],
				"%HEAL": [1, "HEAL+％"], "Retu": [1, "隊列"],
				//"Syat": [1, "射程"],
				"id": [0, "スキル名"],
				"lv": [0, "スキルlv"], "type": [0, "スキルのタイプ(A,P,L)"],
				"nA": [0, "行動数"], "spec": [0, "スキル説明"],
				"key": [0, "key"], "subkey": [0, "subkey"],
				"prop": [0, "prop"], "other": [0, "other"],
				"cri": [0, "Critical数"], "add": [0, "効果量"]
			};
			const td = {}, syntaxText = {};
			Object.keys(t).forEach(v => {t[v] = doc.createElement(t[v]);});
			Object.keys(tr).forEach(v => {
				const tx = tr[v][1];
				td[v] = (tr[v][0]) ? {"t": 0, "u": 0, "text": 0} : {"s": 0, "text": 0};
				tr[v] = miu$._HTMLfunc.createANDappendChild('tr', t.tbody, trx => {
					Object.keys(td[v]).forEach(k => {
						td[v][k] = miu$._HTMLfunc.createANDappendChild('td', trx, tdx => {
							tdx.classList.add("v_tL_csv_manual_table_" + k);
							if(k === "s") tdx.colSpan = 2;
							tdx.textContent = k + v;
							if(k !== "text") {
								func_light(tdx);
								syntaxText[tdx.textContent] = true;
								tdx.addEventListener('click', function() {
									const tx = this.textContent;
									els.syntax.value += (els.syntax.value) ? "," + tx : tx;
								}, false);
							} else {
								tdx.textContent = tx + " を表示します。";
							}
						});
					});
				});
			});
			t.table.appendChild(t.tbody);
			els.manual.innerHTML = "<div>syntax<br>[ t~ : target ] , [ u~ : user ] , [ s~ : skill ]</div>";
			els.manual.appendChild(t.table);
			r_func.csv = reg => {
				const keys = {};
				Object.keys(select).forEach(v => {
					keys[v] = [];
					Array.from(select[v].logGetSelect.getElementsByTagName('input')).forEach((input, i) => {
						if(input.checked) {
							i = flag.keysIndex(flag.checkkey(v), input.nextSibling.textContent, 1);
							flag.resetFlag(keys[v], i);
							flag.createFlag(keys[v], i);
						}
					});
				});
				els.rText.value = (syn => {
					let csv = "";
					const obj = {}, func = {};
					func.addSyntax = (v) => {csv += v + "\n";};
					func.addString = function(o,k) {k.split(/,/).forEach((k,i) => {if(syn[k]) o[k] = arguments[i+2];});};
					func.checkSyntax = array => {
						const len = array.length;
						for(let i = 0; i < len; ++i) {
							if(syntaxText[array[i]]) {
								obj[array[i]] = true;
							} else {
								func.addSyntax("syntax error : [ " + array[i] + " ]");
								return false;
							}
						}
						return true;
					};
					func.logdata = (logdata, obj, search_id, search_spec, pt) => {
						logdata.forEach(v => {
							if(checkObject(v, "Object")) {
								if(v.type) {
									search_id = func.log_type(obj, v);
									search_spec = "";
								} else if(v.spec) {
									search_spec = func.log_spec(obj, v);
								} else if(reg.skill.test(search_id) && reg.spec.test(search_spec)) {
									func.checkLog(obj, v, pt);
								}
							} else {
								func.logdata(v, JSON.parse(JSON.stringify(obj)), search_id, search_spec, pt);
							}
						});
					};
					func.log_type = (obj, v) => {//APLHNES
						func.addString(obj, "stype,sid,slv,snA", v.type, v.id, v.slv, v.nA);
						return v.id;
					};
					func.log_spec = (obj, v) => {
						func.addString(obj, "sspec", v.spec);
						return v.spec;
					};
					func.checkLog = (obj, v, pt) => {
						const li = {};
						if((() => {
							let bool = 1;
							Object.keys(keys).forEach(k => {
								bool &= (keys[k][v[k][0]] & flag.getFlag(v[k][1])) ? 1 : 0;
								li[k] = flag[flag.checkkey(k)][flag.getIndex(v[k])][0];
							});
							return bool;
						})()) {
							["target", "user"].forEach(t => {
								if(li[t]) {
									li[t.substring(0, 1) + "Eno"] = parseInt(li[t].split(/\s:\s/)[0], 10);
									li[t] = li[t].split(/\s:\s/)[1];
								}
							});
							func.addString(obj, "tEno,uEno,tchar,uchar,skey,ssubkey,sprop,sother,sadd", li.tEno, li.uEno, li.target, li.user, li.key, li.subkey, li.prop, li.other, v.add);
							if(v.info) {
								func.addString(obj, "scri", v.info.cri);
								["target", "user"].forEach(t => {
									const a = v.info[t + "Status"], n = t.substring(0, 1);
									func.addString(obj, `${n}pt,${n}yDam,${n}hDam,${n}Imp,${n}Retu`, pt[a.PTid], a.yDam, a.hDam, a.Impact, a["隊列"]);
									(v => {func.addString(obj, `${n}%AT,${n}%MAT,${n}%DF,${n}%MDF,${n}%EVA,${n}%MEVA,${n}%HIT,${n}%MHIT,${n}%SPD,${n}%CRI,${n}%HEAL`, v.AT[0], v.MAT[0], v.DF[0], v.MDF[0], v.EVA[0], v.MEVA[0], v.HIT[0], v.MHIT[0], v.SPD[0], v.CRI[0], v.HEAL[0]);})(a.per);
									(v => {func.addString(obj, `${n}stHP,${n}stMHP,${n}stnMHP,${n}stSP,${n}stMSP`, v.HP, v.MHP, v.nMHP, v.SP, v.MSP);})(a.state);
									(v => {func.addString(obj, `${n}H毒,${n}H衰,${n}H痺,${n}H魅,${n}H呪,${n}H乱,${n}H祝,${n}H護,${n}H肉,${n}H精`, v["毒"], v["衰"], v["痺"], v["魅"], v["呪"], v["乱"], v["祝"], v["護"], v["毒"]+v["衰"]+v["痺"], v["魅"]+v["呪"]+v["乱"]);})(a["変調深度"]);
								});
							}
							func.addSyntax(Object.keys(obj).map(k => {return (obj[k] === true) ? undefined : obj[k];}).join(","));
						}
					};
					if(func.checkSyntax(syn.split(/,/))) {
						syn = JSON.parse(JSON.stringify(obj));
						func.addSyntax(Object.keys(syn).join(","));
						data.logdata.forEach((v,i) => {
							func.addString(obj, "sturn", i);
							v.log.forEach(l => {
								func.logdata(l, JSON.parse(JSON.stringify(obj)), "", "", v.pt);
							});
						});
					}
					return csv;
				})(els.syntax.value);
			};
			return {"tables": t, "tr": tr, "td": td};
		})();
		cpy.rCopy.addEventListener('click', function() {
			els.rText.select();
			doc.execCommand('copy');
		}, false);
		e.result_area.appendChild(rElem.csv);
	})();
	const func_select_change = function() {
		const key = Object.keys(option);
		e.result_area.textContent = "";
		e.result_area.appendChild(rElem[key[parseInt(result.select_list.value)]]);
	};
	func_select_change();
	result.select_list.addEventListener('change', func_select_change, false);
	result.select_button.addEventListener('click', function() {
		const key = Object.keys(option);
		const regexp = {"skill": e.search_box, "spec": e.search_box_spec};
		Object.keys(regexp).forEach(v => {
			const r = (array => {
				let reg = "";
				array.forEach(v => {reg += v + "|";});
				return reg;
			})(regexp[v].value.trim().split(/\s+/));
			regexp[v] = new RegExp(r.substr(0, r.length - 1));
		});
		r_func[key[parseInt(result.select_list.value)]](regexp);
	}, false);
	e.preset_select.addEventListener('change', function(ev) {
		const o = miu$._JSON.GET.V_log_preset[ev.target[ev.target.value].textContent];
		rElem.csv.getElementsByClassName('v_tL_csv_syntax')[0].value = o.syntax;
		e.search_box.value = o.search_skill;
		e.search_box_spec.value = o.search_spec;
		["key", "subkey", "prop", "other"].forEach(k => {
			Array.from(select[k].hide.getElementsByTagName('input')).forEach((input, i) => {
				const j = flag.setIndex(i);
				input.checked = (o[k][j[0]].indexOf(j[1]) + 1) ? true : false;
			});
		});
	}, false);
	e.preset_button.addEventListener('click', function() {
		const key = e.preset_text.value.trim().split(/\s+/).join("");
		if(key) {
			miu$._JSON.GET.V_log_preset[key] = (() => {
				const result = {};
				result.syntax = rElem.csv.getElementsByClassName('v_tL_csv_syntax')[0].value;
				result.search_skill = e.search_box.value;
				result.search_spec = e.search_box_spec.value;
				["key", "subkey", "prop", "other"].forEach(k => {
					result[k] = [];
					Array.from(select[k].logGetSelect.getElementsByTagName('input')).forEach((input, i) => {
						if(input.checked) {
							i = flag.keysIndex(flag.checkkey(k), input.nextSibling.textContent, 1);
							if(!result[k][i[0]]) result[k][i[0]] = [];
							result[k][i[0]].push(i[1]);
						}
					});
				});
				return result;
			})();
			miu$._HTMLfunc._presetLoad(e.preset_select, miu$._JSON.GET.V_log_preset);
			miu$._JSON.save();
		}
	}, false);
	e.preset_delete.addEventListener('click', function() {
		try {
			const v = e.preset_select[e.preset_select.selectedIndex].textContent;
			if(miu$._JSON.GET.V_log_preset[v]) {
				delete miu$._JSON.GET.V_log_preset[v];
				miu$._HTMLfunc._presetLoad(e.preset_select, miu$._JSON.GET.V_log_preset);
				miu$._JSON.save();
			}
		} catch(e) {
			alert(e + "\n >>selectが空です。");
		}
	}, false);
};

miu$._HTMLfunc._presetLoad = function(select, preset) {
	select.textContent = "";
	Object.keys(preset).forEach((v,i) => {
		miu$._HTMLfunc.createANDappendChild('option', select, op => {
			op.textContent = v;
			op.value = i;
		});
	});
};

//////view_setting////////////////////////////////////////////
miu$._HTMLfunc.v_view_setting = function(data, key, onlist, viewElem) {
	const e = {"setting_area": "div", "setting_url": "label"};
	const json = {"text": "span", "file": "input", "save": "input"};
	Object.keys(e).forEach(v => {
		e[v] = doc.createElement(e[v]);
		e[v].classList.add("v_st_" + v);
	});
	Object.keys(json).forEach(v => {
		json[v] = miu$._HTMLfunc.createANDappendChild(json[v], e.setting_url, j => {
			j.classList.add("v_st_url_" + v);
		});
	});
	json.text.textContent = "jsonURL :";
	json.file.type = "file";
	json.file.spellcheck = false;
	json.save.type = "button";
	json.save.value = "save";
	viewElem.appendChild(e.setting_area);
	e.setting_area.appendChild(e.setting_url);
	json.file.addEventListener('change', function(ev) {
		const file = ev.target.files;
		ev.stopPropagation();
		ev.preventDefault();
		try {
			Array.from(file).forEach(f => {
				const reader = new FileReader();
				if(/json/.test(f.type)) {
					reader.onload = function(e) {
						const el = doc.getElementById('view_takeLog').getElementsByClassName('v_tL_preset_select')[0];
						miu$._JSON.GET = JSON.parse(e.target.result);
						miu$._HTMLfunc._presetLoad(el, miu$._JSON.GET.V_log_preset);
						miu$._JSON.save();
					};
					reader.readAsText(f);
				} else {
					throw "jsonファイルではありません。";
				}
			});
		} catch(e) {
			alert(e);
		}
	}, false);
	json.save.addEventListener('click', function() {
		const blob = new Blob([JSON.stringify(miu$._JSON.GET, null)], {"type": "application/json"});
		const a = doc.createElement('a');
		const url = URL.createObjectURL(blob);
		a.href = url;
		a.target = "_blank";
		a.download = ScriptName + "_setting.json";
		a.click();
		URL.revokeObjectURL(url);
	}, false);
};

//////stylesheet//////////////////////////////////////////////
miu$._HTMLfunc.stylesheet = function() {
	const css = function(a) {
		const text = (l => {
			let r = "";
			for(let i = 1; i < l; ++i) arguments[i].forEach(v => {r += v + "\n";});
			return r;
		})(arguments.length);
		return a + "{\n" + text + "}\n";
	};
	const tx = function() {return Array.from(arguments).map(v => {return v + ";";});},
		cl = ".", id = "#",
		font = tx("font-size: 10px", "font-weight: normal", "font-style: normal", "color: rgb(220,220,220)"),
		absolute = tx("width: 100%", "height: 100%", "position: absolute"),
		zIndex = 156;
	/////////
	const t = ""
		+ css("html, body", tx("width: 100%", "height: 100%", "margin: 0"))
		+ css(id + ScriptName, font, tx("max-width: 100%", "max-height: 100%"))
		+ css(id + "open_Button", tx("position: fixed", "z-index: "+zIndex, "bottom: 0", "width: 100%", "padding: 5px 0", "background: rgba(0,0,0,0.7)", "border-top: solid 1px rgb(0,0,0)", "text-align: center", "cursor: pointer"))
		+ css(cl + "_openlight", tx("color: rgb(255,255,255) !important", "text-shadow: 0 0 1px rgba(255,255,255,0.4) !important"))
	/////////
		+ css(id + "overlay_Window", tx("position: fixed", "flex-direction: column", "z-index: "+(zIndex+1), "text-align: center", "margin: 0", "padding: 0", "width: 100%", "height: 100%", "max-width: 100%", "max-height: 100%", "top: 0px", "display: none"))
		+ css(id + "top_overlay", tx("box-sizing: border-box", "width: 100%", "background: rgba(0,0,0,0.3)", "padding: 10px 0 0 0"))
		+ css(id + "overlay_close", tx("background: rgba(255,255,255,0.5)", "width: 80px", "float: right", "padding: 0px 0", "cursor: pointer"))
		+ css(id + "opacity", tx("float: right", "margin: 0 20px 0 0", "text-align: right"))
		+ css(id + "opacity input", font, tx("background: rgba(0,0,0,0.3)", "width: 60px", "height: 15px", "padding: 0 0 0 5px", "border: none"))
		+ css(id + "menu_tab", tx("box-sizing: border-box", "padding: 0 0 0 10px", "width: 100%", "text-align: left", "border-bottom: solid 1px rgba(0,0,0,0.7)"))
		+ css(id + "main_area", tx("box-sizing: border-box", "position: relative", "width: 100%", "height: 100%"))
		+ css(cl + ScriptName + "_menu", tx("box-sizing: border-box", "border-radius: 3px", "font-size: 12px", "width: 150px", "margin: 0 2px 0 0", "padding: 3px 0", "text-align: center", "cursor: pointer", "display: inline-block"))
		+ css(cl + "_closelight", tx("color: rgb(255,255,255)", "background: rgba(255,255,255,0.6) !important"))
		+ css(cl + "_menulight", tx("background: rgba(128,160,255,0.4)", "color: rgb(220,235,255)"))
		+ css(cl + "_menusublight", tx("background: rgba(128,160,255,0.2)"))
		+ css(cl + ScriptName + "_view", tx("display: none"))
	/////////
		+ css(cl + "_disp_f", tx("display: flex !important"))
		+ css(cl + "_disp_b", tx("display: block !important"))
	/////////
		+ css(cl + "v_tL_select_area", absolute, tx("display: flex", "flex-direction: column", "text-align: center", "margin: 0", "padding: 0", "max-height: 100%", "top: 0px"))
		+ css(cl + "v_tL_logtop", tx("box-sizing: border-box", "width: 100%", "padding: 15px 0 15px 20px", "text-align: left"))
		+ css(cl + "v_tL_preset_select", font, tx("color: rgb(0,0,0)", "width: 100px", "font-family: serif"))
		+ css(cl + "v_tL_preset_text", font, tx("box-sizing: border-box", "font-size: 12px", "margin: 0 1px 0 10px", "padding: 2px", "background: rgba(0,0,0,0.3)", "border: inset 2px rgba(255,255,255,1)", "width: 100px"))
		+ css(cl + "v_tL_preset_button, " + cl + "v_tL_preset_delete", tx("font-size: 10px", "font-weight: normal", "font-style: normal", "font-family: serif", "color: rgb(0,0,0)", "width: 60px"))
		+ css(cl + "v_tL_select_main", tx("position: relative", "height: 100%", "width: 100%"))
		+ css(cl + "v_tL_select_area2", absolute, tx("display: flex", "flex-direction: row", "margin: 0", "padding: 0", "max-height: 100%", "top: 0px", "text-align: left"))
		+ css(cl + "v_tL_checkSelect", tx("width: 220px", "padding: 0 0 0 30px", "height: 100%", "overflow-y: auto"))
		+ css(cl + "v_tL_search_box, " + cl + "v_tL_search_box_spec", font, tx("box-sizing: border-box", "font-size: 12px", "margin: 0 0 10px 0", "padding: 2px", "background: rgba(0,0,0,0.3)", "border: inset 2px rgba(255,255,255,1)", "width: 100%"))
		+ css(cl + "_text_sublight", tx("color: rgb(255,255,255)", "background: rgba(255,255,255,0.1)"))
		+ css(cl + "v_tL_hide", tx("margin: 0 0 10px 5px", "display: none"))
		+ css(cl + "v_tL_logGetTitle", tx("padding: 2px 10px", "font-size: 11px", "cursor: pointer"))
		+ css(cl + "v_tL_logGetTitle " + cl + "name", tx("margin: 0 0 0 5px"))
		+ css(cl + "v_tL_logGet_pc", tx("width: 100%", "cursor: pointer", "display: inline-block"))
		+ css(cl + "v_tL_logGet_st", tx("width: 50%", "cursor: pointer", "display: inline-block"))
		+ css(cl + "v_tL_logGet_pc input", tx("vertical-align: sub"))
		+ css(cl + "v_tL_logGet_st input", tx("vertical-align: sub"))
		+ css(cl + "_input_allchecked", tx("width: 50%", "margin: 5px 0", "text-align: center", "cursor: pointer", "display: inline-block"))
		+ css(cl + "v_tL_select_right", tx("display: flex", "flex-direction: column", "box-sizing: border-box", "padding: 0 0 0 10px", "position: relative", "height: 100%", "width: 100%"))
		+ css(cl + "v_tL_select_button", tx("margin: 0 0 0 10px", "font-size: 10px", "font-weight: normal", "font-style: normal", "font-family: serif", "color: rgb(0,0,0)", "width: 60px"))
		+ css(cl + "v_tL_select_list", font, tx("color: rgb(0,0,0)", "min-width: 100px", "font-family: serif"))
		+ css(cl + "v_tL_select_getter", tx("width: 100%"))
		+ css(cl + "v_tL_result_area", tx("padding: 10px 0 0 0", "height: 100%", "width: 100%", "overflow: auto"))
		+ css(cl + "v_tL_result_hide", tx("display: flex", "flex-direction: column", "box-sizing: border-box", "position: relative", "height: 100%", "width: 100%"))
		+ css(cl + "v_tL_csv_syntax", font, tx("box-sizing: border-box", "font-size: 12px", "margin: 0 0 10px 0", "padding: 2px", "background: rgba(0,0,0,0.3)", "width: 50%", "border: inset 2px rgba(255,255,255,1)"))
		+ css(cl + "v_tL_csv_rText", font, tx("box-sizing: border-box", "margin: 0 0 0 0", "resize: none", "padding: 3px", "height: 30%", "width: 50%", "background: rgba(0,0,0,0.3)", "overflow: scroll"))
		+ css(cl + "v_tL_csv_copy_area", tx("width: 100%", "padding: 0 0 10px 0"))
		+ css(cl + "v_tL_csv_rCopy", tx("margin: 0 0 0 0", "font-size: 10px", "font-weight: normal", "font-style: normal", "font-family: serif", "color: rgb(0,0,0)", "width: 60px"))
		+ css(cl + "v_tL_csv_manual", tx("box-sizing: border-box", "height: 100%", "width: 50%", "overflow: scroll"))
		+ css(cl + "v_tL_csv_manual div", tx("padding: 10px 10px 0 10px"))
		+ css(cl + "v_tL_csv_manual table", font, tx("margin: 10px", "text-align: center", "border: solid 1px rgba(0,0,0,0.3)"))
		+ css(cl + "v_tL_csv_manual tbody td", tx("padding: 1px 5px", "min-width: 50px", "border: solid 1px rgba(0,0,0,0.3)"))
		+ css(cl + "v_tL_csv_manual_table_text", tx("text-align: left"))
	/////////
		+ css(cl + "v_st_setting_area", tx("padding: 15px 0 0 20px", "text-align: left"))
		+ css(cl + "v_st_url_file", font, tx("box-sizing: border-box", "padding: 2px", "margin: 0 0 0 5px", "background: rgba(0,0,0,0.3)", "font-family: serif", "cursor: pointer", "width: 300px"))
		+ css(cl + "v_st_url_save", font, tx("margin: 0 0 0 10px", "color: rgb(0,0,0)", "font-family: serif", "width: 60px"))
	/////////
		;
	/////////
	return miu$._HTMLfunc.createANDappendChild('style', doc.getElementsByTagName('head')[0], function(e) {
		e.type = "text/css";
		e.textContent = t;
	});
};

//////////////////////////////////////////////////////////////
// html
//
miu$._CREATEhtml = {};

miu$._CREATEhtml.init = function() {
	const stylesheet = miu$._HTMLfunc.stylesheet(),
		top_element = miu$._HTMLfunc.top_element(),
		open_Button = miu$._HTMLfunc.open_Button(top_element),
		func = () => {
			miu$._CREATEhtml.setlog(top_element, open_Button);
			open_Button.removeEventListener('click', func, false);
		};
	miu$._JSON.set();
	open_Button.addEventListener('click', func, false);
};

miu$._CREATEhtml.setlog = function(top_element, open_Button) {
	const e = (e => {
			const i = miu$._GETlog.getIndex(e, 'className', 'CL');
			return miu$._CREATEhtml.turnElem(e[i+1].children);
		})(doc.getElementsByClassName('AL')[0].children);
	console.log(e);
	if(open_Button.textContent === "ログ取得") {
		const f = s => {open_Button.textContent = s;},
			data = new miu$._LOGdata.init();
		f("取得中...");
		if(!data.createC(e)) return f("エラー");
		if(!data.createL(e)) return f("エラー");
		if(!data.createS()) return f("エラー");
		console.log(data);
		miu$._HTMLfunc.mainWindow(top_element, open_Button, data);
		f(ScriptName + "_" + Version);
	}
};

miu$._CREATEhtml.turnElem = function(e) {
	const r = [];
	Array.from(e).forEach(v => {
		if(v.nodeName === "TABLE") {
			if(!checkObject(miu$._GETlog.splitGetNode(v.getElementsByTagName('td'), 'className', '[RGB]7i')[0][0], "Undefined")) r.push([]);
			if(r.length) r[r.length-1].push(v);
		}
		if(v.nodeName === "DIV") {
			if(r.length) r[r.length-1].push(v.getElementsByTagName('table')[0]);
		}
	});
	return r;
};

//////////////////////////////////////////////////////////////
// start
//

miu$._CREATEhtml.init();

})();