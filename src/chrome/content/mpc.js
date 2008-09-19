/**
* 絵文字変換クラス
* @author horikawa_t <horikawa.takahiro@gmail.com>
* @original_author   ryster <ryster@php-develop.org>
* @license  http://www.opensource.org/licenses/mit-license.php The MIT License
* @version  Release: 0.0.1
*/
//var MobilePictogramConverter = function() {};
var MobilePictogramConverter = {
	/**
	* タイプに合わせて、専用のクラスオブジェクトを生成
	* @param string  str	 変換前文字列
	* @param string  carrier strの絵文字キャリア (MPC_FROM_FOMA, MPC_FROM_EZWEB, MPC_FROM_SOFTBANK)
	* @return mixed
	*/
	factory : function (carrier) {
		var classname = eval('MPC_'+carrier);
		var mpc = new classname;
		return mpc;
	}
};
