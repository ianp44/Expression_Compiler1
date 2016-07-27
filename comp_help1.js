// JavaScript Document
// Ian's expression compiler javascript help support routines

//Version 4.0 29/6/16 Beta Version

// See www.pouncy.co.uk for author's website


/*
COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16

*/

var rtxt;
var zquery;
var zurl;
var zurlparams;
var qualcom;
var lnkstem2;
var zmode;


var glossary_ind_ar;
var glossary_ar;

var glossary_ar_src2=
[
["Interpreter","An Interpreter is a program similar to  a compiler which doesn't compile the high level language program just once and produce lower level language code, but directly parses the high level language as it runs it and never produces a lower level language (machine code or other lower level language) at all."],
["Compiler","A compiler is a computer program that  takes a computer program written in a high level language and converts/translates it into a computer program in a lower level language (this could be machine code or some kind of interpretable code) which the computer can then actually run to make the computer do what the program is intended to do. It is impossible to run the higher level langauge program without using the compiler to translate it to the lower level version which the computer can run directly somehow."],
["Machine Code","The code written in binary bits and bytes which directly tells the computer's CPU (central processing unit) which is part of the computer's hardward what to do as it goes through the sequence of binary bits and bytes running the program. This means the computer CPU is told what to do by one bit of machine code, does it, and then goes on to the next bit of machine code."],
["High Level Language","A high level language is something which programmers like to write in, and is much easier to understand and program in than a low level language. They are almost invariably written in simple character. Javascript is a high level language. See low level language."],
["Low Level Language","A low level language is one that the computer hardware can execute/run directly or intermediate code which can be run by a simple program in order to get the computer to do what the program/programmer wants. x86 machine code is an example of a low level language. See also assembler. Low level languages are difficult to understand for a programmer or to write in. They are usually represented /stored s binary bits/bytes, in contrast to high level languages which are usually represented as text."],
["Tree","A tree in computing is a way of representing data. "],

["Parse Tree","This is what a compiler may produce after it has parsed a high level language program, or expression or bit of a program or statement in a program. It is usually not saved/ouput by the compiler but then used as part of the compile process as it generates the low level language. My expression compiler (as of 18/6/16) currently produces a parse tree. In a expression parse tree the nodes are operators/functions and the nodes/leaves hanging off it are the paramaters of the function or operator. The leaves must be either functions or operators with zero arity which mesns they take no parmameters and just return a value. Or the leaves might be literal constants from the program text source code. (Numeric or string values.) Or they can be variables. This means corresponding to a variable name/identifier in the high level language program source code."],
["Expression","An Expression is a piece of high level language source code which defines an operation which evaluates to a value. Examples in Javascript are 2+2 ( evalutes to value 4) 'Hello '+'Kitty' ( evalutes to value 'Hello Kitty'). An expression is made up of operators, possibly funtions, and variables or literal values.) Often we think of expressions as just evaluating to values, but the functions they call may do things as well as return values. The small print is the javascript and other high level language assignment operator '='. An example in Javascript is x=2 which sets the variable called/named/indentified by the label/name/identifier x to the value of 2. Whether an expression containing an assignment operator is a statement or an expression can be argued about. "],
["Arithmeric Expression","An Arithmetic expression is an expresion made up of numeric variables, arithmetic operators, and numeric values."],
["Ian's Expression Compiler Language Definition","Currently (as of 18/6/16) my expression compiler supports numeric values including decimal. Also text character strings in either kind of quote. The arithmeric operators + - and * / and  the Javascript comma  operator. The comma operator evaluates the two expression on either side of it . (eg. 2*3,4) and throws away the left value (2*3) and yeilds/returns the right value (in this case 4). It think there may be a bug in my expression compiler because it is doing the right hand side of equivalent priority operators first which is probably wrong. Other things my expression compiler currently supports are the built in functions x, sin and pow. Currently it will parse expressions using these functions with arbitrary numbers of paramters as it does not checka arity at the moment."],
["Operator","A Operator in an expression."],
["Arithmetic Operator","An Arithmetic Operator is an operator in an expression which dose numerical arithmetic. Examples are + - * and /. "],
["Operator Priority","Expression Operator priority determines which order the compiler will say to evaluate and expression containing operators and values and variables."],
["Brackets","Brackets in a expression mean that the expresion inside the brackets should be evaluated first before the value that expression yeilds/returns in used in the rest of the expression. This means that you can use brackets to override the set priorities of operators in order to make them do what you want. Examples are 2+3*5 will evaluate to 17 not 25 because the compiler will do the 3*5 first. You can change this by doing (2+3)*5 with brackets which means the compiler will say to do the addition first, and it will then evaluate to 25. To avoid ambiguity you might like to write 2+(3*5) not 2+3*5. These are totally equivalent. Brackets are also used in Javascript to delinate the paramater list after a funtion call. Eg. sin(x). Note functions may have no paramaters in which case they still(in Javascript) need brackets after them but have a null parameter list.Eg. x(). "],
["Function","A Function is a piece of program code which can be called from a another peice of program code (see function call) in order to do something and then return. (See function return). To return means that program execution recommences at the point it was called from. In high level languages you call a function by placing it's label/identifier in an expression or statement in the high level language source code. When the compiler compiles this it will generate a function call/call subroutine instruction in the low level machine code or intermediate code."],
["Built in Function","A built in function is a a function which is built into the compiler not programmed of defined by the programmer. Examples are math functions for javascript, like sin, cos, pow."],
["Parameter","A paramter"],
["Arity","Arity is the number of parmaters a function or expression/arithmeic operator uses/takes when it is called or refereed to in the high level language source code. Binary operators like + * / have an arity of 2. "],
["Function Parameter List","A function paramter list is the list of expresion values or varible names/identifiers which come after a function call in most high level languages. Often they are just variable names or just literal values. (Eg. integers or strings literal values.) Most functions always use/take a fixed number of parameters in their paramater list, and it can be zero. The paramaters are the values or variables which are to be passed to the function to be called for it to use for whatever it does."],
["Literal","A literal is a value in the high level language source code which is defined/set in the program text, not computed at run time."],
["Variable","A Variable is a place in the computer where data is stored. The variables we have in high level languages are given identifiers/names/lables (usually by the programmer in the program text/source code somehow) though some of them may be built into the compiler /interpreter. The key idea is that the label/ identifier says which data storage location/entity we are talking about. The data stored in a variable can be changed by the program as it runs (See run time.) and is called it's value. This is done when the program executes a command/statement which changes that variable. The value of a variable can usually be accessed/retrieved by a program statement/command in order that's it's value can be used for some purpose. Variables can have different types. Common ones are floating point variables which store floating point values, character string variables, which store strings/sequences of text characters, and integers which store integer numbers. "],
["String","A string is a sequence of text characters. Strings can have just about any length. Strings can be variabls (stored in the computer somewhere) or literals (defined in the program source code) or constants."],
["Number","A number in a computer is a numerical value which can be an integer number, a floating point number, or a hexidecimal number. Whether a number is hexidecimal or decimal is probably only relevant when it is displayed or converted to or from a text character string. Numbers can have varying degrees of precision and this is related to how many bytes of storage they take up."],



["Integer","An Integer is a type of number variable or value (eg. a literal value in the program source code) which is not a fraction. See floating point. It is quite distinct from a character string, which contains text."],
["Source Code","Source Code is the text of a computer program and is written in the high level language that the compiler or iterpreter supports, and is probably just a plain text file."]
/*
['Compiler Input Text Box','This is where the compiler input text for the expression it will compile goes.<br>(You can type what you'+
' like in here or edit it anyway you like. Try a sensible arithmetic expression or use the Equation box to help you.<br>'+
'Currently allowable symbols are + - * and , . , is the comma operator which is allowed.<br>'+
'Also allowed are the built in functions sin(&lt;expression&gt;), which calculates the sin of the expresion value in it\'s paramter list,'+
'  pow(&lt;expression&gt;,&lt;expression&gt;), which yeilds the first expression to the power of the 2nd expression in it\'s parameter list'+
'  and x() which yields the horizontal pixel position to calculate with when graphing a function. x() can occur in the expression as'
+' many times as you want.'+
'Also allowed are decimal and whole numbers and character string literals. These are anything in either kind of (matching) quotes.'+
'<br>Arithmetic operators are parsed using the correct javascript priority.<br>'+
'Unary minus is not yet supported. Strings literal will compile but not run correctly (as of 29/6/16).<br>'+
'Arity (the number of parameters in a function paramater list) is not checked at the moment (as of 29/6/16) , so if you'+
' mismatch the number of'+
' paramaters to a function you will get a run time stack error and your program won\'t work correctly.']

*/

];

/*
["Type",""],
["Constant",""],
["Statement",""],
["Compile Time",""],
["Compile Time Error",""],
["Syntax Error",""],

["Identifier",""],
["Label",""],
["Bit",""],
["Binary",""],
["Byte",""],
["Token",""],
["Character",""],
["Instruction",""],
["Assembly Language",""],
["Assembler",""],

["Function Call",""]
["Function Return",""],

["Floating Point",""]

["Intermediate Code",""],

*/
comp_help2_ar

function import_data5(){
var x;
var xlen;	
var z;
//var reftxt;
var x2;
//var xlen2;
var z2;
xlen=	comp_help2_ar.length;
x2=glossary_ar.length;

x=0;
//txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){

z=comp_help2_ar[x];
z2= new Array();
glossary_ar[x2]=z2;
z2[0]=z[0];
z2[1]=z[1];
z2[2]='Compiler_General_Help';


x2++;
x++;	
}
//	txt+="</table>\n";
	
}



function import_data2(){
var x;
var xlen;	
var z;
//var reftxt;
var x2;
//var xlen2;
var z2;
xlen=	glossary_ar_src2.length;
x2=glossary_ar.length;

x=0;
//txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){

z=glossary_ar_src2[x];
z2= new Array();
glossary_ar[x2]=z2;
z2[0]=z[0];
z2[1]=z[1];
z2[2]='General';


x2++;
x++;	
}
//	txt+="</table>\n";
	
}

function import_data3(){
var x;
var xlen;	
var z;
//var reftxt;
var x2;
//var xlen2;
var z2;
xlen=	button_help2_ar.length;
x2=glossary_ar.length;

x=0;
//txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){

z=button_help2_ar[x];
z2= new Array();
glossary_ar[x2]=z2;
z2[0]=z[0];
z2[1]=z[1];
z2[2]='Expression Compiler Button';


x2++;
x++;	
}
//	txt+="</table>\n";
	
}

	
	
	


function import_data1(){
//var txt="";
var x;
var xlen;	
var z;
//var reftxt;
var x2;
//var xlen2;
var z2;
xlen=	button_help_ar.length;
x2=glossary_ar.length;

x=0;
//txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){

z=button_help_ar[x];
z2= new Array();
glossary_ar[x2]=z2;
z2[0]=z[0];
z2[1]=z[1];
z2[2]='Old Expression Compiler Test Button';
x2++;
x++;	
}
//	txt+="</table>\n";
	
}

	


function help_cold_init(){
	//glossary_ind_ar=new Array();
	glossary_ar=new Array();
	import_data1();
	import_data2();
	import_data3();
	import_data5();
	set_ind_array();
	zmode='notable';
	
	lnkstem2='compiler_help1.html';
//	glossary_ind_ar=set_ind_array(glossary_ar);
	
}

/*
function zrep_char(s,a,b){
var txt;
var x;
var xlen;
var c;
x=0;
txt='';
xlen=s.length;
while(x<xlen){
c=s.charAt(x);
	if(c==a)c=b;
	txt+=c;
	
x++;	
}
return(txt);

}

*/
function get_glossary_entry_ind (s){
var x;
var xlen;
var res;
res=-1;
x=0;
xlen=glossary_ar.length;
while(x<xlen){
	if(s.toLowerCase()==glossary_ar[x][0].toLowerCase()){
	return(x);	
	}
x++;	
}
return(-1); // not found
	
	
}

function set_ind_array(){
//var res;
var x;
var xlen;
xlen=glossary_ar.length;
glossary_ind_ar= new Array();
x=0;

while(x<xlen){
	glossary_ind_ar[x]=x;
x++;	
}
	
//	return(res);
}

function ret_text(gloss_ar,x,y){
	var z;
	var res;
if((x<0)||(x>=	gloss_ar.length)){
	rerror("x out of range of array in ret_text ");
}
//rerror('break 1 in ret_text');

z=gloss_ar[x];
if((y<0)||(y>=	z.length)){
	rerror("y out of range of array in ret_text ");
}
res=z[y];
rtxt+='ret_text:x:'+x+', y:'+y+' res:'+res+'<br>';

//rerror('break 3 in ret_text');
return(z[y]);
	
}

function iscwhitespace(c){
if(c==" ")return(true);
if(c.charCodeAt(0)==10)return(true);
return(false);
	
}

function pskipspaces(s,x){
	var c;
	var xlen=s.length;
	if(x<0)rerror("-ve index in pskipspaces");
while(1){
//if(endofbuf())return;
if(x>=xlen)return(x);
c=s.charAt(x);
if(iscwhitespace(c))return(x);
x++;

}
}


function max_pars_match(s,a){
var hold;
var holdx;
var x;
var y;
var xlen;
var ylen;
var res=[-1,-1];
xlen=s.length;
ylen=a.length;

hold=-1;
holdx=-1;
x=0;
y=0;
while(x<xlen){
	if(x>=xlen){
	if(y>=ylen){; //complete match
	hold=y;
	holdx=x;
	break;
	}
		
	}
	if(y>=ylen)break;
	c1=s.charAt(x);
	c2=a.charAt(y);
	c1=c1.toLowerCase();
	c2=c2.toLowerCase();
	if(c1!=c2)break;	
	
	if	(iscwhitespace(c1)){
	hold=y;
	holdx=x;
	x=pskipspaces(s,x);
	y=pskipspaces(s,y);
	
	}
	
	
x++;	
y++;
}
	
	res[0]=holdx;
	res[1]=hold;
	return(res);
	
}

function match_head(s,gloss_ar){
var x;
var xlen;
var res;
//var ylen;
xlen=gloss_ar.length;
//ylen=s.length;

x=0;
while(x){
	res=max_pars_match(gloss_ar[x][0],s);
	if(res[0]!=-1){
	if(res[0]==gloss_ar[x][0].length)return(res);	
	}
x++;	
}
return([-1,-1]);
	
}

function zmake_ref(s,j,stitle){
var txt;
txt="";
txt+='<a href="';
txt+=j;
txt+='" title="'+stitle+'">';
txt+=s;
txt+='</a>';
return(txt);	
	
}

function break_word(s){
var x;
var xlen;
var c;
x=0;
xlen=s.length;
while(1){
	if(x>=xlen)return(x);
	c=s.charAt(x);
	if(	iscwhitespace(c))break;
	
x++;	
}
x=	pskipspaces(s,x);
return(x);
}

function zsafe_slice2(s,a,b){
var res;
if((a<0)||(b<0))	rerror('index <0 in zsafe_slice');
if(b==0)return('');
if(a>=b)return('');
return(s.slice(a,b-1));
	
}

function translate_str(s){
	var txt;
	var res2;
	var x;
	txt="";
	while(1){
	x=	pskipspaces(s,0);
	txt+=safe_slice2(s,0,x);
	s=safe_slice2(s,x,s.length);
if(s=="")return(txt);		
		
		res2=match_head(s,glossary_ar);
		if(res2[0]!=-1){
			ltxt=glossary_ar[res2[0]][0];
			/*
			if(res2[1]==0)ltxt2='';else{
			ltxt2=s.slice(0,res2[1]-1);
			}
			*/
			ltxt2=safe_slice2(s,0,res2[1]);
			ltxt3=zrep_char(ltxt,' ','_');
			x=res2[1];
		txt+=	zmake_ref(ltxt2,lnkstem2+'?glossname='+ltxt3,'Link to compiler glossary entry for '+ltxt);
		
		}else{ //no match
		x=break_word(s);
		txt+=safe_slice2(s,0,x);
		
		
		}
		s=safe_slice2(s,x,s.length);
		
	}
	
	
	
	
}

function ret_tab_entry(gloss_ar,x){
var txt;
txt=""
//rerror("break error in ret_tab_entry ");
txt+="<tr>";
txt+="<td>";
txt+='<b>'+	ret_text(gloss_ar,x,0)+'</b>';
//txt+='one:'+x;
txt+="</td>";
txt+="<td>";
//txt+='two:'+x;
txt+=ret_text(gloss_ar,x,1);
txt+="</td>";
txt+="<tr>\n";
return(txt);

	
}

var iwidth;

function do_glossary_index(){
var txt;
var ltxt0;
var ltxt3;
var x;
var xlen;
var xlen2;
var i;
iwidth=2;
txt='';
//xlen=glossary_ind_ar.length;
/*
txt+='glossary_ar.length:'+glossary_ar.length;
txt+='<br>';
txt+='glossary_ind_ar.length:'+glossary_ind_ar.length;
txt+='<br>';
*/
txt+='<a href="'+lnkstem2+'">Back to Glossary Index</a>\n';
txt+='<p class="indextitleclass"> Glossary Index</p>\n';

xlen=glossary_ind_ar.length;
xlen2=xlen/iwidth;;
xlen2=Math.ceil(xlen2)-1;

x=0;
//xlen=5;
//txt+='<table border="1" class="gtableclass" cellspacing="0" cellpadding="5">';
txt+='<table  cellspacing="0" cellpadding="0" border="1" class="gloss_ind_tabclass">';
	
while(x<xlen2){
	y=0;
	txt+='<tr>';
	
	while(y<iwidth){
		i=y*xlen2+x;
		if(i>=xlen){txt+='<td>&nbsp;</td>';txt+='<td>&nbsp;</td>';}
		else {
			txt+='<td>';
			
		ltxt0=ret_text(glossary_ar,glossary_ind_ar[i],0);
	ltxt3=zrep_char(ltxt0,' ','_');
			//txt+=ltxt3;
			txt+=	zmake_ref(ltxt0,lnkstem2+'?glossname='+ltxt3,'Link to compiler glossary entry for '+ltxt0);
					txt+='</td>';
	txt+='</td><td>';
	txt+=ret_text(glossary_ar,glossary_ind_ar[i],2);
	txt+='</td>';
		}
		y++;
	}
	txt+='</tr>\n';
	
//if(x<xlen-1)txt+=' , ';
//txt+=	ret_tab_entry(glossary_ar,glossary_ind_ar[x]);
//txt+=	ret_tab_entry(glossary_ar,x);
x++;	
}
txt+='</table>\n';
	//txt+='</table>\n';
	return(txt);
	
}


function do_glossary_table(){
var txt;
txt='';
var x;
var xlen;
//xlen=glossary_ind_ar.length;
/*
txt+='glossary_ar.length:'+glossary_ar.length;
txt+='<br>';
txt+='glossary_ind_ar.length:'+glossary_ind_ar.length;
txt+='<br>';
*/

txt+='<p class="tabletitleclass"> Glossary Table Index</p>\n';

xlen=glossary_ind_ar.length;

x=0;
//xlen=5;
txt+='<table border="1" class="gtableclass" cellspacing="0" cellpadding="5">';

while(x<xlen){
txt+=	ret_tab_entry(glossary_ar,glossary_ind_ar[x]);
//txt+=	ret_tab_entry(glossary_ar,x);
x++;	
}
	txt+='</table>\n';
	return(txt);
	
}

function display_status(s){
document.getElementById("statusid").innerHTML = s+'\n';
	
}

function clear_err_reps2(){
	rtxt="";
		document.getElementById("entryid").innerHTML = "";
	document.getElementById("entryid").style.visibility = 'hidden';

//document.getElementById("statusid").innerHTML = '<br>Status Clear<br>';
document.getElementById("statusid").innerHTML = 'Clear';
document.getElementById("tableid").innerHTML = '<br>No Table<br>';
document.getElementById("tableid").style.visibility = 'hidden';

document.getElementById("errorid").innerHTML = "Error Report: None<br>\n";
}

function rerror(s){
	
	throw(s);
}

function rep_error(s){
var txt;	
		txt="<b>Error Report:<br>Runtime Error:</b>  "+s+'<br>\n'
		txt+='<b>rtxt:</b>'+rtxt+'<br>\n';
document.getElementById("errorid").innerHTML = txt;
	
}

function geturlquery(){ //get the invoking url and query string
var ltxt;
var lpos;
zurl=window.location.href;
ltxt=zurl;
lpos=ltxt.indexOf("?"); //returns the query  char position
if(lpos==-1)ltxt=""; // no query in URL
ltxt=ltxt.slice(lpos+1);  //returns everything after that point
zquery=ltxt;
}
function process_query(zqer){
var res=new Array();
var iarray;
var larray;
var x;

iarray=zqer.split('&');
x=0;
while(x<iarray.length){
larray=iarray[x].split('=');
if(larray.length<2){
larray[1]="znull";
}
res[2*x]=larray[0];
res[(2*x)+1]=larray[1];


x++;
}

return(res);

}

function display_gloss_entry(x){
var txt;
txt='';
		if((x<0)||(x>=glossary_ar.length))rerror('x out of bounds in display_glossname');
txt+='<a href="'+lnkstem2+'">Back to Glossary Index</a>\n';

	txt+='<p class="glosstitleclass"> Glossary Entry for:  '+glossary_ar[x][0]+'</p>';
	txt+='<p class="glosscatclass"> Catagory:  '+glossary_ar[x][2]+'</p>';
	txt+='<p class="glossdataclass"> '+glossary_ar[x][1]+'</p>';
	document.getElementById("entryid").innerHTML = txt;
	document.getElementById("entryid").style.visibility = 'visible';
	
	
	
}



function display_glossname(s){
	var x;
	var txt;
	var ztxt2;
	txt='';
	ztxt2="";
	s=zrep_char(s,'_',' ');
	txt+='Name to find is: '+s+' ';
	display_status(txt);
	
	x=get_glossary_entry_ind(s);
	//txt+='result of get_glossary_entry_ind is:'+x+'<br>';
	//display_status(txt);	
	if(x!=-1){
		if((x<0)||(x>=glossary_ar.length))rerror('x out of bounds in display_glossname');
		
	//txt+='gloss entry:'+glossary_ar[x][1]+'<br>';
	display_gloss_entry(x);
	}else{
	txt="Entry for search key:"+s +" was not found.";	
	ztxt2+=do_glossary_index();
	 
 
	document.getElementById("tableid").innerHTML = ztxt2;
	document.getElementById("tableid").style.visibility = 'visible';

	}
	display_status(txt);
	
	
	
}

function process_command(){
	var x;
	var xlen;
	var res;
	var name;
	res=-1;
	x=0;
xlen=	zurlparams.length;
qualcom='default';
name='';
while(x<xlen){
	if(zurlparams[x]=='glossname'){
		name=zurlparams[x+1];
		//display_glossname(name);
		//res=0;
	}
	if(zurlparams[x]=='qualcommand'){
		qualcom=zurlparams[x+1];
		//display_glossname(name);
		//res=0;
	}
x+=2;	
}
if(name!=''){
		display_glossname(name);
		res=0;
}

return(res);
}

function display_url_params(){
var x;
var xlen;
rtxt+='display_url_params:<br>';

xlen=	zurlparams.length;
x=0;
while(x<xlen){
rtxt+='x:'+x+' '+zurlparams[x]+'<br>';	
x++;
}
}

function main_load(){
var txt;
var sw;
	try{
clear_err_reps2();
 help_cold_init();
 //clear_err_reps2();
 
sort_ar_ind(glossary_ind_ar,glossary_ar);
 
 geturlquery();
zurlparams= process_query(zquery);
display_url_params();
//rerror('break in main_load');

sw=0;
if(zurlparams.length<2){
	sw=1;
}else if(zurlparams	[1]=='znull'){
	sw=1;
}
else{
if(process_command()==-1)sw=1;	
}
if(sw==1){
 
 if(zmode=='table'){
txt=do_glossary_table();
 }else {
txt=do_glossary_index();
	 
 }
document.getElementById("tableid").innerHTML = txt;
document.getElementById("tableid").style.visibility = 'visible';


}

	}
//rerror('break error in disp_table1');

	
	catch(err){
		
		rep_error(err);
		
	}
	
	
	
}

function disp_sorted_table1(){
var txt;
	try{
help_cold_init();
 clear_err_reps2();
sort_ar_ind(glossary_ind_ar,glossary_ar);

txt=do_glossary_table();
//rerror('break error in disp_table1');
document.getElementById("tableid").innerHTML = txt;
document.getElementById("tableid").style.visibility = 'visible';

	}
	catch(err){
		
		rep_error(err);
		
	}
	
}

function disp_table1(){
var txt;
	try{
help_cold_init();
 clear_err_reps2();
 txt=do_glossary_table();
//rerror('break error in disp_table1');
document.getElementById("tableid").innerHTML = txt;
document.getElementById("tableid").style.visibility = 'visible';

	}
	catch(err){
		
		rep_error(err);
		
	}
	
}

/*

function cmp_istr(a,b){
	
	
}
*/

function sort_ar_ind(ind_ar,gloss_ar){
var x;
var xlen;
var y;
var ok=0;
var swap;
xlen=ind_ar.length;
if(xlen!=gloss_ar.length){
rerror("array size mismatch in sort_ar_ind ");
}
while(1){
ok=1;
x=0;
while(x<xlen-1){
	swap=0;
		if(gloss_ar[ind_ar[x]][2].toLowerCase()>gloss_ar[ind_ar[x+1]][2].toLowerCase())swap=1;
		else if(gloss_ar[ind_ar[x]][2].toLowerCase()==gloss_ar[ind_ar[x+1]][2].toLowerCase()){
		if(gloss_ar[ind_ar[x]][0].toLowerCase()>gloss_ar[ind_ar[x+1]][0].toLowerCase()){swap=1};
			
		}
		
	
	

	//if(gloss_ar[ind_ar[x]][0].toLowerCase()>gloss_ar[ind_ar[x+1]][0].toLowerCase()){
		//swap ind_ar entries
	if(swap==1){
	y=ind_ar[x];
	ind_ar[x]=ind_ar[x+1];
	ind_ar[x+1]=y;
	ok=0;
	}
x++;	
}
	if(ok==1)break; //sort completed
	
}
	
	
}



