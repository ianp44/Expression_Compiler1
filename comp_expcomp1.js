// Ian's expression compiler javascript routines
//Main parsing routines

//Version 4.0 28/6/16 Beta Version

// See www.pouncy.co.uk for author's website


/*
COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16

*/


//opcode result
var zopcodes; //array of resultant opcodes

var zopcodetop; //length of opcode structure
var zopcodemax=300; //max length of opcode structure

var gerrpt;
var gerrpt2;

/*=============================*/

var txt_token;
var holdpos; //beginning of last parsetoken


// Run time routines 

function call_routine(ptr){



}

/*
function execute code(ptr){




}

*/


/*=============================*/


//global variables

//var zname_istr,zop,zopclass,zarity,zprec;
//zopc_is_prop_op
//zopc_is_built_in

//var zopc_is_func=0<<3;
//zopc_is_built_in

var zopc_lex_typ_msk =7;
var zopc_is_lex_char =0;
var zopc_is_prop_op =1;
var zopc_is_var=2;
var zopc_is_lit=3;
var zopc_is_txt_lab=4;


//label entry type codes
var zopc_typ_msk=3<<4;
var zopc_is_func=0<<4;
var zopc_is_number=1<<4;
var zopc_is_object=2<<4;
var zopc_is_string=3<<4;

var zopc_is_built_in=1<<6;

var zopc_is_expression=0<<7;
var zopc_is_statement=1<<7;


var intr_op=zopc_is_prop_op|zopc_is_built_in;
var intr_func=zopc_is_built_in|zopc_is_func|zopc_is_txt_lab;
//var zopc_is_lex_char=55;

var opinit_ar=
[
['[',zopc_is_lex_char,0,0],
[']',zopc_is_lex_char,0,0],
//[',',zopc_is_lex_char,0,0],
['(',zopc_is_lex_char,0,0],
[')',zopc_is_lex_char,0,0],
[';',zopc_is_lex_char,0,0],
['.',zopc_is_lex_char,0,0],

['*',intr_op,2,5],
['/',intr_op,2,5],

['+',intr_op,2,3],
['-',intr_op,2,3],
[",",intr_op,2,1]
];

var lab_init_ar=[
['x',intr_func,0],
['sin',intr_func,1],
['pow',intr_func,2]


];


//var buftxt; // text to pars (actually an array of numbers)

var zopcount;


var buftxtarray;
var buftxttop;


//utility functions
//returns char at pos x in str
function zposchar(str,x){
//return(str.substring(x,x+1));
return(str.charAt(x));



}

function bufposchar(){
//return(zposchar(txtbuf,bufpos));
return(txtbuf.charAt(bufpos));

}

var is_a;
var is_z;
var is_A;
var is_Z;
var is__;
var is_0;
var is_9;
var is_sp;
var is_sq;
var is_dq;
var is_dot;

function init_is_funcs(){
//fromCharCode
//charCodeAt

is_a='a'.charCodeAt(0);
is_z='z'.charCodeAt(0);
is_A='A'.charCodeAt(0);
is_Z='Z'.charCodeAt(0);
is__='_'.charCodeAt(0);
is_0='0'.charCodeAt(0);
is_9='9'.charCodeAt(0);
is_sp=' '.charCodeAt(0);
is_dq='"'.charCodeAt(0);
is_sq="'".charCodeAt(0);
is_dot='.'.charCodeAt(0);


}

var opcharcds;
var opcharcds_len;
var opcharstr="[]+=-()/<>*%;&|^!.,";

function init_iopchar_cds(){
var x;
var xlen;
opcharcds= new Array();
x=0;
xlen=opcharstr.length;
while(x<xlen){
opcharcds[x]=opcharstr.charCodeAt(x);
x++;
}
opcharcds_len=xlen;



}

//returns true if c is an operator character
function is_opchar(c){
x=0;
while(x<opcharcds_len){
if(c==opcharcds[x])return(true);
x++;
}
return(false);
}

//returns true if c (single character number) is an alpha or '_' char
function is_alpha(c){
if((is_a<=c)&&(c<=is_z))return(true);
if(c==is__)return(true);
return((is_A<=c)&&(c<=is_Z));

}



/*
function is_alpha(c){
if(('a'<=c)&&(c<='z'))return(true);
if(c=='_')return(true);
return(('A'<=c)&&(c<='Z'));

}


*/

//returns true if c (single character) is an numeric char
function is_num(c){
return((is_0<=c)&&(c<=is_9));

}

/*functon is_num(c){
return(('0'<=c)&&(c<='9'));

}
*/
//returns true if c  is an c symbol char number

function is_alnum(c){
if(is_alpha(c))return(true);
return(is_num(c));
}

/*
Note on run time types and implementation.

variables can be set to anything.

types of variable are
-number
-string
-object



*/


function compare_priority(pri1,pri2){
var lpri1;
var lpri2;
//is_lefta
//lpri1=(~is_lefta)&pri1;
//lpri2=(~is_lefta)&pri2;
lpri1=pri1;
lpri2=pri2;
if(lpri1>lpri2)return(1); // take the first expression only
if(lpri1<lpri2)return(0); // take both terms
// means priority is equal
return(0);


/*
if(!(is_lefta&pri1)){ //eg + - 
return(1);  // take the first expression only
}else{ // = and comma operator etc. 
return(0); // take both terms
}
*/
}






//global variables
var labtab; //lable table - array of label structure entries
var labtabl; //lable table length
var labtabmax=300; //max lable table entries
var txtbuf; //buffer input string for parsing
var bufpos; //pars position in txtbuf
var pushbackflag;
var parshead; // parsed item- lable table index number
var rtxt; //reporting buffer
//var highest_op_val; see zopcount;


//var txtpos; 
/*
var zopcodes; //array of opcode values; 0 implies next value is a numeric literal
var zopcodetop; //length of opcode structure
var zopcodemax=300; //max length of opcode structure
*/

function disp_opclass(zopclass){
var x;
var txt;
txt="";

x=zopclass&zopc_lex_typ_msk;

switch(x){
 case zopc_is_lex_char :txt+='lex_char';break;
 case zopc_is_prop_op :txt+='proper_op';break;
 case zopc_is_var: txt+='var';break;
 case zopc_is_lit :txt+='lit';break;
 case zopc_is_txt_lab:txt+='txtlab';break;
 default: txt+='unknown_lex_typ';break;

}
txt+=', ';

//zopc_is_number
//zopc_is_string

x=zopclass&zopc_typ_msk;
switch(x){
 case zopc_is_func :txt+='func';break;
 case zopc_is_number :txt+='number';break;
 case zopc_is_object: txt+='object';break;
 case zopc_is_string :txt+='string';break;
 default: txt+='unknown_typ';break;

}

if(zopclass&zopc_is_built_in){
txt+=', built_in';

}
return(txt);

}

//lable table entries
//zopclass codes
/*
var zopc_lex_typ_msk =3;
var zopc_is_lex_char =0;
var zopc_is_prop_op =1;
var zopc_is_var=2;
var zopc_is_lit=3;
*/
//zopc_lex_typ_msk

//zopc_is_prop_op
//zopc_is_built_in

//zopc_is_lit
//var zopc_typ_msk=3<<3
//var zopc_is_func=0<<3;
//zopc_is_built_in
/*
//label entry type codes
var zopc_typ_msk=3<<3;
var zopc_is_func=0<<3;
var zopc_is_number=1<<3;
var zopc_is_object=2<<3;
var zopc_is_string=3<<3;

var zopc_is_built_in=32;

var zopc_is_expression=0<<6;
var zopc_is_statement=1<<6;
*/
//var 

//zopc_is_lit|zopc_is_number
//zopc_is_lit|zopc_is_string

//zopc_typ_msk
//zopc_is_number
//zopc_is_string

//function fzopc
//priority codes .pri in labent for ops
//var pri_mask=64;
var is_lefta=128; //is left associative

//built ins/intrinsics
/*
var lbra= 1;
var ket=2;
var zcomma=3;
var semic=3;
*/
var lbra;
var ket;
var zcomma;
var semic;
var sminus;
var zdot;
//var 

function get_op_zop(ziname){
var zname_str;
var res;
var z;
zname_str=new cr_str_str(ziname);
res=findop_obj(zname_str,2);
if(res==-1){
rerror("Couldn't find op in get_op_zop");

}
z=labtab[res];
return(z.opvalue);


}

function init_pars_vars(){
//	get_op_zop('!');
lbra=get_op_zop('(');
ket=get_op_zop(')');
zcomma=get_op_zop(',');
semic=get_op_zop(';');
sminus=get_op_zop('-'); //for unary minus
zdot=get_op_zop('.');

}

//opcode structure
//function cropcodes(zopcode,

//creates string object from intrinsic string
function cr_str_str(s){
var x;
var xlen;
xlen=s.length;
this.len=s.length;
this.chars=new Array();
x=0;
while(x<xlen){
this.chars[x]=s.charCodeAt(x);
x++;
}
return(this);

}
//appends str2 to str1
function app_str_str_obj(str1,str2){
var x;
var xlen;
var str2_str;
str2_str=str1.length;

xlen=str2.len;
x=0;
while(x<xlen){
str1.chars[str2_str+x]=str2.chars[x];
x++;
}

}

//creates string object from another string object

function cr_str_str_obj(s){
var x;
var xlen;
xlen=s.len;
this.len=s.len;
this.chars=new Array();
x=0;
while(x<xlen){
this.chars[x]=s.chars[x];
x++;
}
return(this);

}

//creates intrinsic string  from string object
function cr_istr_str(s){
var res;
var x;
var xlen;
res="";
xlen=s.len;
x=0;
while(x<xlen){
res+=String.fromCharCode(s.chars[x]);
x++;
}
return(res);
}


//lable table entries object constructor function

function labtabent(zname,zop,zopclass,zarity,zprec){
this.name=new cr_str_str_obj(zname);
this.opvalue=zop; //lex id code or built in function id code
this.opclass=zopclass;
this.arity=zarity;
this.priority=zprec;
return(this);
}


//zopc_typ_msk
//zopc_is_number
//zopc_is_string
//returns true if opclass is lex char
function zop_islexchar(zopclass){
return((zopclass&zopc_lex_typ_msk)==zopc_is_lex_char);
}




//var zopc_typ_msk=3<<3
//var zopc_is_func=0<<3;

//returns true if opclass is any kind of function
function zop_isfunc(zopclass){
return((zopclass&zopc_typ_msk)==zopc_is_func);
}

//returns true if opclass is any kind of named function, not an op
function zop_is_nm_func(zopclass){
	//if((zopclass&zopc_lex_typ_msk)==zopc_is_lit)return(false); //is a literal
	//if((zopclass&zopc_lex_typ_msk)==zopc_is_prop_op)return(false);
if ((zopclass&zopc_lex_typ_msk)!=zopc_is_txt_lab)return(false); // not a lable
return((zopclass&zopc_typ_msk)==zopc_is_func);
}

//returns true if opclass is literal
function zop_islit(zopclass){
return((zopclass&zopc_lex_typ_msk)==zopc_is_lit);
}

//returns true if opclass is string
function zop_isstring(zopclass){
return((zopclass&zopc_typ_msk)==zopc_is_string);
}

//returns true if opclass is number
function zop_isnum(zopclass){
return((zopclass&zopc_typ_msk)==zopc_is_number);
}

//returns true if opclass is numeric literal
function zop_isnumlit(zopclass){
if(!zop_islit(zopclass))return(false);
return(zop_isnum(zopclass));
}

//returns true if opclass is lit string
function zop_isstringlit(zopclass){
if(!zop_islit(zopclass))return(false);
return(zop_isstring(zopclass));
}

//zopc_lex_typ_msk
//zopc_is_prop_op

//zopc_is_built_in

//returns true if opclass  is an intrinsic operator
function zop_builtin(zopclass){
return(zopclass&zopc_is_built_in);
}


//returns true if opclass  is a proper  operator

function zop_isop2(zopclass){
return((zopclass&zopc_lex_typ_msk)==zopc_is_prop_op);
}

//returns true if opclass  is a proper intrinsic operator
function zop_isop(zopclass){
//if(!zop_isop2(zopclass))return(false);
return((zopclass&zopc_lex_typ_msk)==zopc_is_prop_op);
}

/*
//returns true is lable table entry is an operator
function zop_isnumlit(zopclass){
var x;
x=labent.opclass;
//zopc_lex_typ_msk
//zopc_is_lit

if((zopclass&zopc_lex_typ_msk)!=zopc_is_lit)return(0); 
//not a literal
return(opclass&zopc_is_numlit);
}

//returns true is lable table entry is an operator
function zop_isop(labent){
return(labent.opclass&zopc_is_op);
}
//returns true is lable table entry is a built in func or a variable name
function zop_istlab(labent){
return(labent.opclass&(zopc_is_var|zopc_is_bfunc);
}


//returns true if opclass code is an numeric literal
function zop_isnumlit(clsval){
return(clsval&zopc_is_numlit);
}

//returns true if opclass code  is an operator
function zop_isop(clsval){
return(clsval&zopc_is_op);
}
//returns true if opclass code  is a built in func 
function zop_isbfunc(clsval){
return(clsval&zopc_is_func);
}
//returns true if opclass code  is a variable name
function zop_isvar(clsval){
return(clsval&zopc_is_var));
}

//returns true if opclass code  is a built in func or a variable name
function zop_istlab(clsval){
return(clsval&(zopc_is_var|zopc_is_bfunc));
}

*/ 

function create_op(zname,zop,zopclass,zarity,zprec){
var res;

res= new labtabent(zname,zop,zopclass,zarity,zprec);

return(res);
}

function add_op(zname_istr,maxlen,zop,zopclass,zarity,zprec){
var str_obj;
var res;
var i;
str_obj=new cr_str_str(zname_istr);
res=findop_obj(str_obj,maxlen);
if(res!=-1){
rerror("opstring already in table at pos:"+res+" in add_op");

}

//adding new op label
if(labtabl>=labtabmax-1){
rerror("too many lables in add_op");
}
i=labtabl;
labtab[i]=create_op(str_obj,zop,zopclass,zarity,zprec);
labtabl++;


}

var tstrep3;


function cold_init_labs(){
var x;
var xlen;
var zname_istr,zop,zopclass,zarity,zprec;
var h;
var str_obj;
var res;
x=0;
xlen=lab_init_ar.length;

//tstrep3="";

while(x<xlen){
h=lab_init_ar[x];
zname_istr=h[0];
str_obj=new cr_str_str(zname_istr);

zop=zopcount;
zopclass=h[1];
zarity=h[2];
//tstrep3+=x+','+zopcount+','+zname_istr+'<br>\n';
//zprec=h[3];

res=findlab_obj(str_obj,1);
if(res==-1){
rerror("res=-1 in cold_init_labs");
}
labtab[res].opvalue=zop;
labtab[res].opclass=zopclass;
labtab[res].arity=zarity;
labtab[res].priority=0;

//add_op(zname_istr,2,zop,zopclass,zarity,zprec);
zopcount++;
x++;
}
//document.getElementById("parserror_id").innerHTML = tstrep3;


}

function cold_init_ops(){
var x;
var xlen;
var zname_istr,zop,zopclass,zarity,zprec;
var h;
x=0;
xlen=opinit_ar.length;
while(x<xlen){
h=opinit_ar[x];
zname_istr=h[0];
zop=zopcount;
zopclass=h[1];
zarity=h[2];
zprec=h[3];
add_op(zname_istr,2,zop,zopclass,zarity,zprec);
zopcount++;
x++;
}


}

//looks for longest matching operator in lable table and returns index or -1 if not found.



//gets last longest matching operator
//maximum length currently 2 chars
function findop_obj(zname,zmaxlen){
//var c1;
//var c2;
var best;
var bestlen;
var lopclass;

var i;
var x;
best=-1;
bestlen=-1;
i=0;
while(i<labtabl){
lopclass=labtab[i].opclass;
if(zop_isop(lopclass)||zop_islexchar(lopclass)){
//if(zop_isop(labtab[i].opclass))
//	gtxt+=cr_istr_str(labtab[i].name)+'<br>\n';
	x=0;
	while(x<zmaxlen){
		if(x>=zname.len)break;
		if(x>=labtab[i].name.len)break;
		if(zname.chars[x]!=labtab[i].name.chars[x])break;
		if(bestlen<x){
			best=i;
			bestlen=x;
		}
	x++;
	}

}
i++;
}

return(best);
}

/*

//looks for an operator in lable table and returns index or -1 if not found.

//gets last longest matching operator
//maximum length currently 2 chars
function findop(){
var c1;
var c2;
var best=-1;
var i;
var j;
j=0;
while(j<2){
c1=zposchar(txtbuf,bufpos+j);
i=0;
while(i<labtabl){
if(zop_isop(labtab[i].opclass)){
if(j<(labtab[i].name.length)){
if(c1==zposchar(labtab[i].name,j){
best=i;

}

}
}
i++;
}


j++;
}
return(best);
}

*/

//compare two my string objects
function cmp_str_obj(str1,str2){
//var res;
var x;
var xlen1;
var xlen2;
var c1;
var c2;

x=0;
xlen1=str1.len;
xlen2=str2.len;

while(1){
	if(x==xlen1){
		if(x==xlen2)return(0);
		else return(-1);
}else if(x==xlen2){
	return(1);
		
	}else{

c1=str1.chars[x];
c2=str2.chars[x];

/*
if(a1[x]<a2[x])return(-1);
if(a1[x]>a2[x])return(1);
*/
if(c1<c2)return(-1);
if(c1>c2)return(1);
	}
x++;

}


}

function cmp_ar_str(a1,a2){
//var res;
var x;

x=0;
while(1){
if(a1[x]==0){
if(a2[x]==0)return(0);
else return(-1);
}
else
return(1);

if(a1[x]<a2[x])return(-1);
if(a1[x]>a2[x])return(1);

x++;

}


}
//finds a text lable (in a str obj) and creates a new entry if missing if crflag is set else returns -1
//is case sensitive

function findlab_obj(zname,crflag){
var i;
i=0;
while(i<labtabl){
//if(zop_istlab(labtab[i].opclass))
if(cmp_str_obj(labtab[i].name,zname)==0){
return(i);

}

i++;
}
if(!crflag)return(-1); //not found
if(labtabl>=labtabmax-1){
rerror("too many lables in findlab_obj");
}
i=labtabl;
labtab[i]=new labtabent(zname,-1,0,0,0);
labtabl++;
//function labtabent(zname,zop,zopclass,zarity,zprec);
return(i);

}

/*


//finds a text lable and creates a new entry if missing if crflag is set else returns -1
//is case sensitive
function findlab(zname,crflag){
var i;
i=0;
while(i<labtabl){
if(zop_istlab(labtab[i].opclass)){
if(labtab[i].name==zname){
return(i);

}
}
i++;
}
if(!crflag)return(-1); //not found
if(labtabl>=labtabmax-1){
rerror("too many lables");
}
i=labtabl;
labtab[i]=new labtabent(zname,-1,0,0,0);
labtabl++;
//function labtabent(zname,zop,zopclass,zarity,zprec);
return(i);

}

*/
function rerror(txt){

throw(txt);

}



function parshead_new(){
this.opclass=0;
this.labent=-1;
this.numvalue=0;
this.istrvalue="";
 return(this);
}

function init_labtab(){
labtab=new Array(); //lable table - array of label structure entries
labtabl=0; //lable table length

}

function cold_init(){
init_is_funcs();
//button_help();
button_generate();
init_iopchar_cds();
//txt_token= new Array();
txt_token= new cr_str_str("");
init_labtab();
zopcount=3;
tree_init2();
cold_init_ops();
cold_init_labs();
init_pars_vars();
init_opcodes_cold();
cold_run_init();
//init_pars_vars();



}

function parsinit(){
//parsing variables
pushbackflag=0;
glob_parse_tree=-1;

parshead= new parshead_new();
holdpos=0;
//

/*
//opcode variables
zopcodes= new Array();
zopcodetop=0;
*/

/*
parshead.opclass=0;
parshead.labent=-1;
parshead.numvalue=0;
*/

}

function getlexchar(z){
if(z<0)rerror("-ve z index in getlexchar");
if(z>=buftxtarray.length)return(-1);
//if(endofbuf())return(-1);
return(buftxtarray[z]);
}

function skipspaces(){
	var c;
while(1){
//if(endofbuf())return;
c=getlexchar(bufpos);
if((c!=is_sp)&&(c!=10))return;
bufpos++;

}
}

function pushback(){
pushbackflag=1;
}

/*
var txt_token;
var holdpos; //beginning of last parsetoken
*/
//var txt_token_len;


function break_csym(){
var x;
var c;
txt_token.len=0;
x=0;
while(1){
c=getlexchar(bufpos);

//c=buftxtarray[bufpos];
if(!is_alnum(c))break;
txt_token.chars[x]=c;

bufpos++;
x++;
}
txt_token.len=x;


}

function get_num(sw){
var resnum;
var c;
var zdivr;
zdivr=1;

resnum=0;
while(1){
c=getlexchar(bufpos);
//c=buftxtarray[bufpos];
if(!is_num(c))break;
resnum=resnum*10;
resnum+=c-is_0;
if(sw==1)zdivr*=10;

bufpos++;
}
if(sw==1){resnum=resnum/zdivr;} //calculate fractional part of
//decimal number
return(resnum);
}


function break_num(){
var resnum;
var c;
resnum=get_num(0); //get integer part
c=getlexchar(bufpos);
//c=buftxtarray[bufpos];
if(c!=is_dot)return(resnum);
bufpos++;
resnum+=get_num(1); //get fractional part
return(resnum);
}

var max_op_len=2;


function break_op(){
var x;
var c;
x=0;
txt_token.len=0;
while(x<max_op_len){
c=getlexchar(bufpos+x);
//c=getlexchar(bufpos+x);
//c=buftxtarray[bufpos+x];
if(!is_opchar(c))break;
txt_token.chars[x]=c;
x++;
}
txt_token.len=x;
//return(x);
}





var maxoplen=2; //max operator length

function endofbuf(){
if(bufpos>=buftxtarray.length)return(true);
return(false);

}

function break_istr(c){
var c2;
var listr;
listr="";
//c2=getlexchar(bufpos);
bufpos++;
while(1){
	if(endofbuf()){
		parserror("Unexpected  end of input text in a string literal");
	return("");
	}
c2=getlexchar(bufpos);
if(c2==c){
bufpos++;
break;// end of string	
}
listr+=String.fromCharCode(c2);
bufpos++;
		
}
	
return(listr);
	
	
}

function is_quotes(c){
if(c==is_dq){
return(true);	
}
if(c==is_sq){
return(true);	
}
return(false);
	
}

function parstoken(){
var tokstr;
var x;
var c;
var rnum;
var listr;
var bestop;
if(pushbackflag==1){
pushbackflag=0;
return(0);

}
skipspaces();
holdpos=bufpos;
if(endofbuf())return(-1);

c=getlexchar(bufpos);
//c=buftxtarray[bufpos];
//if c symbol
if (is_alpha(c)){
break_csym();
parshead.labent=labtab[findlab_obj(txt_token,1)];
parshead.opclass=parshead.labent.opclass;
//rerror("term in parstoken");
return(0);
}
else if (is_num(c)){
rnum=break_num();
parshead.opclass=zopc_is_lit|zopc_is_number;
parshead.labent=-1;
parshead.numvalue=rnum;
return(0);

}
//zopc_is_number
//zopc_is_string

else if (is_quotes(c)){
listr=break_istr(c);
parshead.opclass=zopc_is_lit|zopc_is_string;
parshead.labent=-1;
parshead.numvalue=0;
parshead.istrvalue=listr;
return(0);

}
else if (is_opchar(c)){

break_op();
bestop=findop_obj(txt_token,maxoplen);
if(bestop==-1){
	parserror("Illegal or unknown  character string '"+
	cr_istr_str(txt_token) +"' in text");
}else{
	parshead.labent=labtab[bestop];
	parshead.opclass=parshead.labent.opclass;
	bufpos+=parshead.labent.name.len;
	}
//	rerror("term in isopchar");
return(0);

}

else 
parserror("Illegal character "+c +'('+String.fromCharCode(c) +") in text");

return(0);
}

/*================*/
function token_test(){
var x;
 rtxt="Parsed Token List:<br>\n";
x=0;
while(1){
if(-1==parstoken()){
break;

}

rtxt+="token:"+x+':';
/*
parshead.opclass=0;
this.labent=-1;
this.numvalue=0;

*/

rtxt+=disp_opclass(parshead.opclass);
rtxt+='<br>\n';

if(zop_isnumlit(parshead.opclass)){
rtxt+='Number:'+parshead.numvalue+'<br>\n';

}else if(zop_isstringlit(parshead.opclass)){
rtxt+='String:"'+parshead.istrvalue+'"<br>\n';

}
else{

rtxt+=display_labent(parshead.labent);
rtxt+='<br>\n';

}
x++;
}
display_rtxt();

}

/*================*/
function zcreate_tree_node(sw,zdata,zisleaf,zbranches){

if(sw==0){
//proper label table entry
this.label=zdata;
this.opclass=zdata.opclass;
this.isleaf=zisleaf;
if(!zisleaf){
this.branches=zbranches; 
}
}else if (sw==1){
//string literal
this.opclass=zopc_is_lit|zopc_is_string;
this.isleaf=true;

//this.istr=cr_istr_str(data);
this.istr=zdata;
//this.branches=[]; no branches, is a leaf


}else if (sw==2){
//number literal
this.opclass=zopc_is_lit|zopc_is_number;
this.isleaf=true;
this.number=zdata;
//this.branches=[]; no branches, is a leaf


}

else{
rerror("illegal switch value in zcreate_tree_node");

}

return(this);

}





/*================*/



//adds a value to the zopcodes array (the program 

/*
var zopcodes; //array of resultant opcodes

var zopcodetop; //length of opcode structure
var zopcodemax=300; //max length of opcode structure
*/
function oppush(f){
if(zopcodetop>=zopcodemax-1)rerror("out of opcode space");
zopcodes[zopcodetop++]=f;
}
//checks for a comma
function pars_comma(){
 if(zop_isop(parshead.opclass)){//operator or brackets
//return(parshead.labent.opvalue==zcomma); //is an lbra or not
if(parshead.labent.opvalue==zcomma){ //is an lbra or not
//parstoken();
return(true);
}
}

return(false);
}

//checks for an semic
function pars_semic(){
 if(zop_islexchar(parshead.opclass)){//operator or brackets
//return(parshead.labent.opvalue==semic); //is an semic or not
if(parshead.labent.opvalue==semic){ //is an lbra or not
//parstoken();
return(true);
}
}
return(false);
}

//checks for an lbra
function pars_lbra(){
 if(zop_islexchar(parshead.opclass)){//operator or brackets
//return(parshead.labent.opvalue==lbra); //is an lbra or not
if(parshead.labent.opvalue==lbra){ //is an lbra or not
//parstoken();
return(true);
}
}
return(false);
}

//checks for a ket
function pars_ket(){
 if(zop_islexchar(parshead.opclass)){//operator or brackets
//return(parshead.labent.opvalue==ket); //is an lbra or not
if(parshead.labent.opvalue==ket){ //is an lbra or not
//parstoken();
return(true);
}

}
return(false);
}

/*
//returns true if pri1 should be done first
function compare_priorty(pri1,pri2){
var lpri1,lpri2;
lpri1=pri1&primask;
lpri2=pri2&primask;
if(lpri==lpri2{ //check for left associative
if((pri1&is_lefta)==0)return(false);else return(true);
}

if(lpri1>lpri2)return(true);else return(false);

}
*/

function zdo_parameter_list(zarity){
var x;
var res;
var zlocalnode;
var cflag;

res= new Array();
x=0;
rtxt+="zdopl:"+zdisplay_buffer()+'<br>\n';
cflag=0;
parstoken();
if(!pars_lbra())parserror("Expected a '(' in parameter list");
while(1){
parstoken();
rtxt+="zdopl(loop):"+zdisplay_buffer()+'<br>\n';
//parstoken();
if(pars_ket()){//end of parameter list
rtxt+="a_pars_ket:"+zdisplay_buffer()+'<br>\n';
/*
if(x!=zarity){
parserror("Incorrect number  of parameters in paramter list");
return(-1);
}
*/
if(cflag==1)parserror("Expected an expression in paramter list");

return(res);
}
pushback();
zlocalnode=pars_expression3(2);
parstoken();
cflag=0;
if(zlocalnode==-1){
parserror("xExpected an expression");
return(-1);
}
res[x]=zlocalnode;
x++;
if(pars_comma()){
	cflag=1;
	//parserror("Expected an comma in parameter list");
	//return(-1);
	//pushback();
	}else{
pushback();
}

}

}
function pars_sequence(){
while(1){
if(!pars_element())break;
}

}


function pars_statement(){
var zlocalnode;

parstoken();

if(pars_semic())return;
zlocalnode=pars_expression();

if(pars_semic())return;

}

function pars_expression3(lpriority){
//operators
var zlabent;
//var opcd;
var zlocalnode;
var zlocalnode2;
var zlocalnode3;
var zarity;

rtxt+="expression3:"+zdisplay_buffer()+'<br>\n';

parstoken();
//rtxt+="expression3:"+zdisplay_buffer()+'<br>';
zlocalnode=pars_expression();
if(zlocalnode==-1)parserror("Expected a valid expression");

parstoken();



 if(!zop_isop(parshead.opclass)){
	 pushback();return(zlocalnode);
 }//end of expression
 
 // have an operator
zlabent=parshead.labent;
zarity=zlabent.arity;
if(zarity!=2){
parserror("Expected a binary operator");
return(-1);
}
rtxt+="expression3(pri):"+zdisplay_buffer()+' lpriority:'+lpriority+' zlabent.priority:'+zlabent.priority+'<br>\n';

//binary operator
if(compare_priority(lpriority,zlabent.priority)==1){
//take one term only, means push back and return
pushback();
return(zlocalnode); //

}else {
//take both terms
zlocalnode2=pars_expression3(zlabent.priority);
if(zlocalnode2==-1){
	parserror("Expected a valid expression");
	return (-1);}
	
zlocalnode3=
new zcreate_tree_node(0,zlabent,false,[zlocalnode,zlocalnode2]);

//##
parstoken();


 if(!zop_isop(parshead.opclass)){
	 pushback();return(zlocalnode3);//should be the end of the expression
 }//end of expression
 
 // have an operator
zlabent=parshead.labent;
zarity=zlabent.arity;
if(zarity!=2){
parserror("Expected a binary operator");
return(-1);
}
rtxt+="expression3(prt 2):"+zdisplay_buffer()+' lpriority:'+lpriority+' zlabent.priority:'+zlabent.priority+'<br>\n';

//binary operator
zlocalnode5=pars_expression3(lpriority);
if(zlocalnode2==-1){
	parserror("Expected a valid expression");
	return (-1);}
	
zlocalnode6=
new zcreate_tree_node(0,zlabent,false,[zlocalnode3,zlocalnode5]);


return(zlocalnode6); //



}

 
 error("illegal line in pars_expression3" );
}

/*
function pars_expression2(lpriority){
//operators
var zlabent;
//var opcd;
var zlocalnode;
var zlocalnode2;
var zlocalnode3;
var zarity;

//parstoken();

zlocalnode=pars_expression(lpriority);
if(zlocalnode==-1)parserror("Expected a valid expression");

parstoken();



 if(zop_isop(parshead.opclass)){//operator 
zlabent=parshead.labent;
zarity=zlabent.arity;
if(zarity!=2){
parserror("Expected a binary operator");
return(-1);
}
//binary operator
if(compare_priority(lpriority,zlabent.priority)==1){
//take one term only, means push back and return
pushback();
return(zlocalnode); //

}else {
//take both terms
zlocalnode2=pars_expression(zlabent.priority);
if(zlocalnode2==-1)parserror("Expected a valid expression");
zlocalnode3=
new zcreate_tree_node(0,zlabent,false,[zlocalnode,zlocalnode2]);
return(zlocalnode3); //



}


}
else { //operator not there
pushback();
return(zlocalnode); //


}


}
*/

function pars_expression(){
var zlabent;
var opcd;
var zlocalnode;
var zlocalnode2;
var zarity;
var param_list;

//parstoken();
rtxt+="expression0:"+zdisplay_buffer()+'<br>\n';

if(zop_isnumlit(parshead.opclass)){//numeric literal
//oppush(0);
//oppush(parshead.numvalue);
rtxt+="expression0:numlit:"+zdisplay_buffer()+'<br>\n';
zlocalnode=new zcreate_tree_node(2,parshead.numvalue,undefined,undefined)
return(zlocalnode);
}
if(zop_isstringlit(parshead.opclass)){//numeric literal
//oppush(0);
//oppush(parshead.numvalue);
zlocalnode=new zcreate_tree_node(1,parshead.istrvalue,undefined,undefined)
return(zlocalnode);
}

if(pars_lbra()){//brackets
//parstoken();
rtxt+="expression0:gotlbra:"+zdisplay_buffer()+'<br>\n';

zlocalnode=pars_expression3(0);
if(-1==zlocalnode)parserror("Expected an expression");
//parstoken();
if(!pars_ket())parserror("Expected a ')'");
parstoken();
return(zlocalnode);

}
//operators

/*
 if(zop_isop(parshead.opclass)){//operator 
zlabent=parshead.labent;
zarity=zlabent.arity;
if(zarity==1){
//unary operator
//parstoken();
zlocalnode2=pars_expression(lpriority);
if(zlocalnode2==-1)parserror("Expected a valid expression");
zlocalnode=new zcreate_tree_node(0,zlabent,false,[zlocalnode2]);
return(zlocalnode);


}else if (zarity==2){
//binary operator
//these are illegal at the start of an expression
parserror("Unexpected binary operator at start of expression");
return(-1);
}
else {

rerror("Illegal arity value:"+zarity+" in pars_expression");

}

}

*/
 if(zop_is_nm_func(parshead.opclass)){//some kind of in function, not an op
zlabent=parshead.labent;
rtxt+="expression0:is_nm_func:"+zdisplay_buffer()+'<br>\n';
//opcd=labent.opvalue;
param_list=zdo_parameter_list(zlabent.arity);
//oppush(opcd); //saved the code
if(param_list==-1){
parserror("Expected a parameter list");
return(-1);

}
if(param_list.length==0){
zlocalnode=new zcreate_tree_node(0,zlabent,true,undefined);

}else{
zlocalnode=new zcreate_tree_node(0,zlabent,false, param_list);
}
return(zlocalnode);

}


parserror("zExpected an expression");
return(-1);

}

function set_buf_txt(txt){
var x;
var xlen;
buftxtarray = new Array();
 buftxttop=0;
bufpos=0;
holdpos=0;

x=0;
xlen=txt.length;
while(x<xlen){
buftxtarray[x]=txt.charCodeAt(x);

x++;
}
 buftxttop=x;

}

//function token_test
function top_token_test(){
var dtxt;
try{
		clear_err_reps();
		tree_display_switch=1; //verbose
dtxt=document.forms["prgform"]["textin"].value;
set_buf_txt(dtxt);
parsinit();	
token_test();
}
catch(err){
rep_error(err);

}

	
	
}

var glob_parse_tree;


function pars_text( txt){
//txtbuf=txt; //text to pars
//bufpos=0; //start of txtbuf
set_buf_txt(txt);

parsinit();

glob_parse_tree=pars_expression(0);




}

//parse input text to tree test
function top_parse_test(){
var dtxt;
try{
		clear_err_reps();
		opcodes_top=0; //clears output code before compile attempt
dtxt=document.forms["prgform"]["textin"].value;
set_buf_txt(dtxt);
parsinit();	

//token_test();
glob_parse_tree=pars_expression3(0);
if(glob_parse_tree==-1){
rerror(	"glob_parse_tree data doesn't exit in  top_parse_test()" );
}
disp_whole_tree(glob_parse_tree);
}
catch(err){
rep_error(err);

}

	
	
}

function top_parse_test0(){
tree_display_switch=0;
	top_parse_test();
	
}
function top_parse_test1(){
	tree_display_switch=1;
	top_parse_test();
	
	
}