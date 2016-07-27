// JavaScript Document
// Ian's expression compiler javascript routines
// Opcode file. Generating the intermediate code opcodes.

//Version 4.0 29/6/16  Beta Version

// See www.pouncy.co.uk for author's website

/*
COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16

*/

var opcodes_ar;
var opcodes_top;
var opcodes_max;
var def_string_tab;
var def_string_tab_top;
var def_string_tab_max;
var maxgenerate_opcodes_nest;

var pushnumcd;
var pushstrcd;

var gptr;
//var gptrprgend;


//index list of opecodes into lable table
var opcode_ind_list;
var opcode_ind_lis_top;
var opcode_ndef;

function init_opcode_ind_list2(){
var x;
var xlen=zopcount;
	opcode_ndef=-5;
	x=0;
	while(x<xlen){
	opcode_ind_list[x]=	opcode_ndef;
	x++;	
	}
	
}

function chk_opcoderng(a){
if(a<0)rerror("opcode <0 in chk_opcoderng"	);
if(a>=zopcount)rerror("opcode out of range in chk_opcoderng"	);
return(0);
	
}

/*
var op_func_init_ar=
[
['-',do_minus],
['+',do_plus],
['*',do_times],
['/',do_divide],
['sin',do_sin],
['x',do_x],
['pow',do_pow]
];
*/

function cold_init_op_funcs(){
	var x;
	var xlen;
	var h;
	var zname_istr;
	var str_obj;
	var zopfunc;
	xlen=op_func_init_ar.length;
	x=0;
	while(x<xlen){
	h=op_func_init_ar[x];
zname_istr=h[0];
str_obj=new cr_str_str(zname_istr);

zopfunc=h[1];
//tstrep3+=x+','+zopcount+','+zname_istr+'<br>\n';
//zprec=h[3];

res=findlab_obj(str_obj,1);
if(res==-1){
rerror("res=-1 cold_init_op_funcs; label could not be found");
}

z=labtab[res];
lopclass=z.opclass;
if(zop_builtin(lopclass)|zop_isop(lopclass)){
	opval=z.opvalue;
	chk_opcoderng(opval);
	opcode_ind_list[opval]=z;
z.opfunc=zopfunc;

}
else{
rerror("attempt to set an operator function for label entry that is not built in cold_init_op_funcs");	
}

	
		
	x++;
	}

		
}

function init_opcode_ind_list(){
var x;
var xlen=labtabl;
var z;
var lopclass;
var opval;
	opcode_ind_list=new Array();
	init_opcode_ind_list2();
	cold_init_op_funcs();
	/*
x=0;
	
while(x<xlen){	
z=labtab[x];
lopclass=z.opclass;
if(zop_builtin(lopclass)|zop_isop(lopclass)){
	opval=z.opvalue;
	chk_opcoderng(opval);
	opcode_ind_list[opval]=z;

}

x++;
}
*/
	
}

function init_opcodes_cold(){
	opcodes_ar=new Array();
	opcodes_max=500;
	def_string_tab_max=100;
	def_string_tab=new Array();
	uminus_opcode=-2;
	 pushnumcd=-3;; //code to push a num literal onto the stack
	 pushstrcd=-4; //code to push a def string onto the stack



	maxgenerate_opcodes_nest=30;
	init_opcode_ind_list();
	
	init_opcodes_hot();
	
}


function display_allnumcodes(){
	var ltxt;
	var cd;
	var cd2;
	ltxt="";
	gptr=0;
	while(gptr<opcodes_top){
		cd=opcodes_ar[gptr];
	ltxt+='gptr:'+gptr+' cd:'+cd;
	if(cd<0)ltxt+=' special (<0))';
	else{
	chk_opcoderng(cd);
	cd2=opcode_ind_list[cd];
	ltxt+=' redircd:'+cd2;
	if(cd2==	opcode_ndef)ltxt+=' (undefcode)';
	}
	ltxt+='<br>\n';
	gptr++;	
	}
	return(ltxt);
	
	}
	
		
	

function init_opcodes_hot(){
	opcodes_top=0;
 def_string_tab_top=0;
gptr=0;	
}


function popcode(){
var res;
	gptrchk();
	res=opcodes_ar[gptr];
	gptr++;
	return(res);
	
}

function gptrchk(){
if(gptr<0)rerror("gptr <0 in gptrchk");
if(gptr>=opcodes_top)rerror("gptr past end of code  in gptrchk");
	
return(0);	
}

function strindchk(d){
if(d<0)rerror("str literal table index <0 in strindchk");
if(d>=def_string_tab_top)rerror("str literal table index > top of strindchk");
	
return(0);	
}


function getstrlit(d){
	strindchk(d);
	return(def_string_tab[d]);
	
	
	
}

function chkopcdvalid(s){
	
	
	
}

function display_opcode(){
var txt;
var s;
var a;
var lstr;

var llab;
txt="<tr><td>";
//txt+='gptr:'+gptr;
txt+=gptr;
s=popcode();
txt+='</td><td>';
//txt+=' opcode:'+s+' ';
txt+=s;
txt+='</td><td>';
switch (s){
	case pushnumcd:{
		//number literal
		txt+='store_num:';
		a=popcode();
		//txt+=a+'<br>\n';
		txt+=a;
		
	break;	
	}
	 case pushstrcd:{
		txt+='store_str:';
		a=popcode();
		lstr=getstrlit(a);
//		 txt+="'"+lstr+"'<br>\n";
		 txt+="'"+lstr+"'";
	break;	
		 
		 
	 }
	 case uminus_opcode:{
		//txt+='uminus<br>';
		txt+='uminus';
		 
		 
		
	break;	
		 
	 }
default:	{
	chk_opcoderng(s);
	llab=opcode_ind_list[s];
	if(llab==opcode_ndef){rtxt+=txt;rerror("undefined opcode in display_opcode");}
	txt+=display_labent(llab);
	//txt+='<br>\n';
	break;
}
}
txt+='</td></tr>\n';
return(txt);
	
	
	
}


function display_allcodes_txt(){
	var ltxt;
	var ztxt;
gptr=0;
	ltxt="";
	ltxt+='<table  cellspacing="0" cellpadding="0" border="1" class="opcodetabclass">';
	ltxt+='<tr><td>Program Position</td><td>Opcode</td><td>Operation</td></tr>\n';
	while(gptr<opcodes_top){
	ztxt=	display_opcode();
//	rtxt+=ztxt;
	ltxt+=ztxt;
	//gptr++;	
	}
	ltxt+='<table>\n';
	return(ltxt);
	
}

function push_def_string(s){
	var res;
if(def_string_tab_top>=def_string_tab_max){
rerror("too many def strings  in push_def_string");
}
	def_string_tab[def_string_tab_top]=s;
	res=def_string_tab_top;
	def_string_tab_top++;
	return(res);
	
}
function push_string(s){
	var str_indx;
str_indx=push_def_string(s); //add to def string table

push_op(pushstrcd); //op to put  an def string on the stack.
push_op(str_indx); //put lit str index on stack
}

function push_op(opcode){
if(opcodes_top>=opcodes_max){
rerror("too many opcodes in push_op");
}
	opcodes_ar[opcodes_top]=opcode;
	opcodes_top++;
}

function push_number(num){
push_op(pushnumcd); //op to put  an def string on the stack.
	push_op(num); // puts it in code
}



function pushbranches(treen,nest){
var x;
var xlen;
if(treen.isleaf){
rerror("leaf node in pushbranches"	);
}
xlen=treen.branches.length;
x=0;
while(x<xlen){
	generate_opcodes(treen.branches[x],nest+1);
x++;	
}
	
}

function opcode_test(tree_disp_sw){
var ltxt;

try{
	ltxt="";
	clear_err_reps();
	init_opcodes_hot();
	tree_display_switch=tree_disp_sw;
	ltxt="";
if(glob_parse_tree==-1){
rerror(	"glob_parse_tree doesn't exist in  opcode_test()" );
}
rtxt+="generating opcodes<br>";
generate_opcodes(glob_parse_tree,0);
rtxt+="generated opcodes<br>";


rtxt+="displaying all code<br>";
ltxt+='<b>Compiled Program Intermediate Code Opcodes</b><br>\n';
//ltxt=display_allnumcodes();
ltxt+=display_allcodes_txt();
//ltxt+=display_allcodes_txt();
rtxt+="done all code<br>";

document.getElementById("iddiv1").style.height='';
//document.getElementById("id1").style.height=(1*((10+2)*yscale))+' px'
//document.getElementById("id1").style.height='50px'
document.getElementById("iddiv1").innerHTML = ltxt;



	}
	catch(err){
		rep_error(err);
		
	}
	
	
	
}
	
	
	



function generate_opcodes(treen,nest){
	var lopclass;
	var lname;
	lopclass=treen.opclass;
	if(nest>=maxgenerate_opcodes_nest){
		rerror("generate_opcodes over nested");
	}
		
	if(zop_isstringlit(lopclass)){
	push_string(treen.istr);
	return;
	}
	if(zop_isnumlit(lopclass)){
	push_number(treen.number);
	return;
	}
	
	
	
	if(zop_isop(lopclass)){
		if(treen.isleaf)rerror("operator as leaf node in generate_opcodes");
	//minus case
	blen=treen.branches.length;
	if(	treen.label.opvalue==sminus){
		if(	blen==1){
	//unary minus case
		pushbranches(treen,nest+1);
		push_op(uminus_opcode);
		return;
		}
	}
//operator
		if(!(treen.isleaf))pushbranches(treen,nest+1); //put parameters on the stack
	push_op(treen.label.opvalue); //push opcode
	return;
	}
	
	if(zop_builtin(lopclass)){
		// built inlabel function
		if(!(treen.isleaf))pushbranches(treen,nest+1); //put parameters on the stack
	push_op(treen.label.opvalue); //push opcode
		return;
	
	}else{
		lname=cr_istr_str(treen.label.name);

	rerror("function:"+lname+'non built in functions not supported yet in generate_opcodes' );
		
	}
	rerror("illegal node type in generate_opcodes");
}
