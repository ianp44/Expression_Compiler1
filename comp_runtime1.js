// Ian's expression compiler javascript routines
// runtime routines

//Version 4.0 28/6/16  Beta Version

// See www.pouncy.co.uk for author's website

/*
COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16

*/

//gptr is program counter
var str_stack;
var str_stack_sp;
var str_stack_top;

var runstack;
var runstack_sp;
var runstack_top;

var globx; //for x function

function close_graph(){
document.getElementById("disp1").style.visibility='hidden';
	
	
}

function graph_equation(){
var txt;
var x;
var xwidth;
try{
document.getElementById("disp1").style.visibility='visible';
	
xwidth=800;
	
txt="SVG image dynamically generated using javascript<br>";
txt+='<button onclick="close_graph()">Close Graph Window</button><br>';

txt+="This runs on your computer, not the server.<br>";
txt+='<svg height="600" width="800">  <polyline points="';
x=0;
while(x<xwidth){
	y=zcalcval(x);
	y=300-y;
txt+=x+','+y+' ';
	
x++;	
}
txt+='" style="fill:none;stroke:red;stroke-width:1" />  Sorry, your browser does not support inline SVG.</svg>';
document.getElementById("disp1").innerHTML = txt;

}
	catch(err){
		close_graph();
		rep_error(err);
		
	}
}

function zpopstringstack(){
//	var res;
if(	str_stack_sp<0)rerror("string stack underflow in zpopstringstack");
if(	str_stack_sp>str_stack_top-1)rerror("string stack sp out of range in zpopstringstack");
	str_stack_sp--;
	
}

function zpopstack(){
var res;
var z;
if(	runstack_sp<=0)rerror("stack underflow in zpopstack");
runstack_sp--;
res=runstack[runstack_sp];
/*
z=runstack[runstack_sp];
res=new create_rnvar();
res.tp=z.tp;
res.data=z.data;
*/
if(res.tp==1){
//string object on stack	
	zpopstringstack();
}
;
return(res);
	
}

function zpushstack_num(n){
var z;
if(	runstack_sp<0)rerror("stack sp <0 in zpushstack_num");
if(	runstack_sp>=runstack_top-1)rerror("stack overflow in zpushstack_num");
z=runstack[runstack_sp];
z.tp=0; //number
z.data=n;
	
runstack_sp++;	
}


function push_str_stack(s_obj){
	var res;
if(	str_stack_sp<0)rerror("string stack sp <0 in push_str_stack");
if(	str_stack_sp>str_stack_top-1)rerror("string stack overflow in push_str_stack");

str_stack[str_stack_sp]=s_obj;
res=s_obj;
	str_stack_sp++;
	return(res);
	
}

function zpushstack_istr(s){
var z;

if(	runstack_sp<0)rerror("stack sp <0 in zpushstack_istr");
if(	runstack_sp>=runstack_top-1)rerror("stack overflow in zpushstack_istr");
z=runstack[runstack_sp];
z.tp=1; //string object
z.data=push_str_stack(new cr_str_str(s));
runstack_sp++;	
	
}

function zpushstack_str_obj(s_obj){
var z;
if(	runstack_sp<0)rerror("stack sp <0 in zpushstack_str_obj");
if(	runstack_sp>=runstack_top-1)rerror("stack overflow in zpushstack_str_obj");
z=runstack[runstack_sp];
z.tp=1; //string object
z.data=push_str_stack(new cr_str_str_obj(s));
runstack_sp++;		
}

function conv_num_str(num){
var res;
//res=''+
res=new cr_str_str(''+num);
return(res);	
	
}

function conv_str_num(s_obj){
var ltxt;
ltxt=cr_istr_str(s_obj);
res=1.0*ltxt;
return(res);	
	
}

function auto_conv_num_n(d){
	var res;
if(d.tp==1){
res=conv_str_num(d.data);
return(res);	
}
return(d.data);	
}

function auto_conv_num(d){
	var res;
if(d.tp==1){
res=conv_str_num(d.data);
d.data=res;
d.tp=0; //number
}
return(d);
}

function do_plus(){
var a1;
var a2;
var a1_n;
var a2_n;
var res;
var str_res;
var str_res2;
var res2;
a2=zpopstack();
a1=zpopstack();

if((a1.tp==1)&&(a2.tp==1)){
	str_res=new cr_str_str_obj(a1.data);
	app_str_str_obj(str_res,a2.data);
	zpushstack_str_obj(str_res);
	
return;
	
}
if((a1.tp==0)&&(a2.tp==0)){
zpushstack_num(a1.data+a2.data);
return;
	
}
if(a1.tp==1){
a1_n=auto_conv_num_n(a1);
if(isNaN(a1_n)){
//couldn't convert to number, so go the other way
	str_res=new cr_str_str_obj(a1.data);
	 str_res2= new cr_str_str(''+a2.data);

	app_str_str_obj(str_res,str_res2);
	zpushstack_str_obj(str_res);
	return;
}else{
zpushstack_num(a1_n+a2.data);
return;
	
	
}
}
if(a2.tp==1){
a2_n=auto_conv_num_n(a2);
if(isNaN(a2_n)){
//couldn't convert to number, so go the other way
	str_res= new cr_str_str(''+a1.data);
app_str_str_obj(str_res,a2.data);
	
	zpushstack_str_obj(str_res);
	return;
}else{
zpushstack_num(a1.data+a2_n);
return;
	
}
}

rerror("break in do_plus, shouldn't ever get here"	);
}


function do_uminus(){
var a1;
var a2;
var res;
var res2;
a1=zpopstack();
//a2=zpopstack();
a1=auto_conv_num(a1);
//a2=auto_conv_num(a2);
//res=a1.data-a2.data;
zpushstack_num(-res);

	
}


function do_minus(){
var a1;
var a2;
var res;
var res2;
a1=zpopstack();
a2=zpopstack();
a1=auto_conv_num(a1);
a2=auto_conv_num(a2);
res=a2.data-a1.data;
zpushstack_num(res);

	
}

function do_times(){
var a1;
var a2;
var res;
var res2;
var ltxt;
//ltxt='';
//ltxt+='do_times: ';
a1=zpopstack();
a2=zpopstack();
a1=auto_conv_num(a1);
a2=auto_conv_num(a2);
//ltxt+='a1:'+a1.data;
//ltxt+=' a2:'+a2.data;

res=a1.data*a2.data;
//ltxt+=' res:'+res+'<br>\n';
zpushstack_num(res);
//rtxt+=ltxt;

	
}

function do_pow(){
var a1;
var a2;
var res;
var res2;
a1=zpopstack();
a2=zpopstack();
a1=auto_conv_num(a1);
a2=auto_conv_num(a2);
res=Math.pow(a2.data,a1.data);
zpushstack_num(res);
	
}

function do_sin(){
var a1;
var a2;
var res;
var res2;
a1=zpopstack();
//a2=zpopstack();
a1=auto_conv_num(a1);
//a2=auto_conv_num(a2);
res=Math.sin(a1.data);
zpushstack_num(res);
	
}

function do_x(){
var a1;
var a2;
var res;
var res2;
//a1=zpopstack();
//a2=zpopstack();
//a1=auto_conv_num(a1);
//a2=auto_conv_num(a2);
//res=Math.sin(a1.data);
zpushstack_num(globx);
	
}


function do_divide(){
var a1;
var a2;
var res;
var res2;
a1=zpopstack();
a2=zpopstack();
a1=auto_conv_num(a1);
a2=auto_conv_num(a2);
res=a2.data/a1.data;
zpushstack_num(res);

	
}

function do_comma(){
var a1;
var a2;
var res;
var res2;
a1=zpopstack();
a2=zpopstack();
/*
a1=auto_conv_num(a1);
a2=auto_conv_num(a2);
*/
if(a1.tp==1){zpushstack_str_obj(a1.data);}
else {
zpushstack_num(a1.data);
	
}

	
}




var op_func_init_ar=
[
['-',do_minus],
['+',do_plus],
['*',do_times],
['/',do_divide],
[',',do_comma],
['sin',do_sin],
['x',do_x],
['pow',do_pow]
];


function exopcode(){
var txt;
var s;
var a;
var lstr;

var llab;
txt="";
txt+='gptr:'+gptr;
s=popcode();

txt+=' opcode:'+s+' ';
switch (s){
	case pushnumcd:{
		//number literal
		txt+='store_num:';
		a=popcode();
		zpushstack_num(a);
		txt+=a+'<br>\n';
		
	break;	
	}
	 case pushstrcd:{
		txt+='store_str:';
		a=popcode();
		lstr=getstrlit(a);
		zpushstack_istr(lstr);
		 //txt+="'"+lstr+"'<br>\n";
	break;	
		 
		 
	 }
	 case uminus_opcode:{
		 do_uminus();
		//txt+='uminus<br>';
		 
		 
		
	break;	
		 
	 }
	 
	 
default:	{
	chk_opcoderng(s);
	llab=opcode_ind_list[s];
	if(llab==opcode_ndef){rerror("undefined opcode in exopcode");}
	llab.opfunc();
	//txt+='<br>\n';
	break;
}
}
return(txt);
	
	
	
}

function display_stack(){
var txt;
var x;
var ltp;
var z;

txt="Stack Dump<br>\nRunstacksp:"+runstack_sp+'<br>\n';;
x=0;
while(x<runstack_sp){
	z=runstack[x];
	ltp=z.tp;
	txt+='sp:'+x+'tp:'+ ltp;
	if(ltp==0){ //number
		txt+='num:'+z.data;
	}else{
	txt+="str:'"+cr_istr_str(z.data)+"'";
			
	}
	txt+='<br>\n';
	x++;
}
document.getElementById("idstack").innerHTML = txt;
	
}

function show_step_pos(){
document.getElementById("idprg").innerHTML = 'Gptr:'+gptr+'<br>\n';
	
}

function incstacksp(){
	try{
	//runstack_sp++;
	zpushstack_num(43.2);
	display_stack();
	show_step_pos();
	}
	catch(err){
		rep_error(err);
		
	}
	
	
	
}


function zreset_prg(){
	try{
	gptr=0;
	warm_run_init();
	str_stack_sp=0;
	runstack_sp=0;
	display_stack();
	show_step_pos();
	}
	catch(err){
		rep_error(err);
		
	}
	
	
	
}

function zrunprg(){
var ltxt;
	try{
		warm_run_init();
	str_stack_sp=0;
	runstack_sp=0;
	gptr=0;
	ltxt='Result of expression program is:';
	document.getElementById("idstack").innerHTML='';
document.getElementById("idprg2").innerHTML = '<b>'+ltxt+' Not Computed</b>';
	zrun_code(0);
	display_stack();
	if(runstack_sp!=1){
	ltxt+='Error: Stack mismatched at end of progam<br>';
	
	
	}else{
		
	z=runstack[0];
	if(z.tp!=0){
	ltxt+='a string , not reliable yet</b>';	
	}else{
		
	ltxt+=z.data+'</b>';
	}
	}
	
document.getElementById("idprg2").innerHTML = '<b>'+ltxt;

		
	}
	
	catch(err){
		rep_error(err);
		
	}
	
	
	
}


function zsstep(){
var ltxt;
	try{
	if(gptr>=opcodes_top){
document.getElementById("idprg").innerHTML = 'Gptr:'+gptr+' at end of proram<br>Use Reset Button to reset Gptr\n';
	return;
		
	}
	//show_step_pos();
	ltxt=exopcode();
	display_stack();
	//display_rtxt();
	//show_step_pos();
document.getElementById("idprg").innerHTML = 'Gptr:'+gptr+'<br>\n'+ltxt;
	}
	catch(err){
		rep_error(err);
		
	}
	
	
	
}

function zcalcval(x){
var z;

gptr=0;
runstack_sp=0;
globx=x;

	while(gptr<opcodes_top){
	exopcode();
	}
	if(runstack_sp!=1){
	rerror("stack result mismatch in zcalcval");
	
	}
	z=runstack[0];
	if(z.tp!=0)rerror("requires a number value to graph");
	return z.data;
	
	
}
function zrun_code(ptr){
	var ltxt;
	var ztxt;
	gptr=ptr;
	//ltxt="";
	while(gptr<opcodes_top){
	exopcode();
//	rtxt+=ztxt;
	//ltxt+=ztxt;
	//gptr++;	
	}
	//return(ltxt);
	
}



function cold_run_init(){
runstack= new Array();
str_stack= new Array();
str_stack_top=100;
//str_stack_sp=0;
runstack_top=500;
//runstack_sp=0;
warm_run_init();
globx=30;
	
}




function create_rnvar(){
this.tp=0
this.data=0;
return(this);	
}

function warm_init_stack(){
var x;
var xlen;
x=0;
xlen=runstack_top;
while(x<xlen){
runstack[x]=new	create_rnvar();

x++;	
}
	
}

function warm_run_init(){
//runstack= new Array();
//str_stack= new Array();
//str_stack_top=100;
str_stack_sp=0;
//runstack_top=500;
runstack_sp=0;
warm_init_stack();
	
}


function ex_op(){
	
	
	
}




