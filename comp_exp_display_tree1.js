// Ian's expression compiler javascript routines
// Tree display routines.

//Version 4.0 28/6/16 Beta Version

// See www.pouncy.co.uk for author's website


/*
COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16

*/

var gtxt;
var xscale=30;
var yscale=15;
var glob_ypos;
var tree_display_switch;

function display_labent(zlabent){
var lname;
var ltxt="";

lname=cr_istr_str(zlabent.name);
if(tree_display_switch==1){
ltxt+='Labent: ';
ltxt+='name:'+lname+' ,';
ltxt+='opc:('+zlabent.opclass+
') '+disp_opclass(zlabent.opclass)+' ,';
ltxt+='op_val:'+zlabent.opvalue+' ,';
ltxt+='arity:'+zlabent.arity+' ,';
ltxt+='pri:'+zlabent.priority+'<br>\n';
}else{
	ltxt+=lname;
	
}
//glob_ypos++;
return(ltxt);

}

function tree_init2(){
tree_display_switch=1; //verbose


}

function display_all_labtab(){
var ltxt;
var x=0;
var xlen=labtabl;
ltxt="";
ltxt="Complete dump of label table<br>\n";
while(x<xlen){
ltxt+="Index:"+x+" ";
ltxt+=display_labent(labtab[x]);

x++;}
ltxt+="<br>\n";
ltxt+="<br>\n";
ltxt+="<br>\n";
ltxt+="<br>\n";

document.getElementById("id1").innerHTML = ltxt;


}

function display_data_treen(zentry){
var lopclass;
var x;
var xlen;

lopclass=zentry.opclass;

/*if(zentry.isleaf){

}
*/
//gtxt+='Treen: ';
if(zentry.isleaf){
	if(tree_display_switch==1)gtxt+='Leaf ,';

}else{
if(tree_display_switch==1)gtxt+='Node: ,';

}

if(tree_display_switch==1){gtxt+='opc:('+lopclass+') , '+disp_opclass(lopclass);}
if(zop_isstringlit(lopclass)){
if(tree_display_switch==1)gtxt+=" value:'";else gtxt+="'";
gtxt+=zentry.istr;
gtxt+="'";
//return(0);

}else 
if(zop_isnumlit(lopclass)){
if(tree_display_switch==1)gtxt+=' value:';
gtxt+=zentry.number;
gtxt+='';
//return(0);

}else{
//gtxt+='qlabel ,';
if(tree_display_switch==1)gtxt+=' ';
gtxt+=display_labent(zentry.label);

//return(1);
}


}
function display_rtxt(){
document.getElementById("id1").innerHTML ="Report Text:<br>" 
+rtxt;

//"id1"
}

function dodiv(ztree,nest){
var res;
gtxt+='<div class="treedivclass" style="position: absolute;';
if(tree_display_switch==1){gtxt+=' left:'+(1*(nest*xscale))+'px;';}
else {gtxt+=' left:'+(1*(nest*15))+'px;';}
gtxt+=' top:'+(1*(glob_ypos*yscale))+'px;';
gtxt+='">';


display_data_treen(ztree);

gtxt+='\n</div>\n';
glob_ypos++;
}

function zdisplay_tree2(ztree,nest){
var x;
var xlen;
var res;
dodiv(ztree,nest);
//more nodes
//gtxt+='<b>Node Branches:</b><br>\n';
//glob_ypos++;
if(!ztree.isleaf){
x=0;
xlen=ztree.branches.length;
while(x<xlen){
zdisplay_tree2(ztree.branches[x],nest+1);
x++;
}
}




}

/*========================*/
/* Tree create test routines */

//creates a number literal leaf node
function create_num_nd(n){
return (new zcreate_tree_node(2,n,undefined,undefined));
	
	
}
//creates a istr literal leaf node
function create_istr_nd(s){
return (new zcreate_tree_node(1,s,undefined,undefined));
	
	
}

//creates a labent node with branches
function create_labent_nd(labent,branches){
	var xlen;
	var izleaf;
	xlen=branches.length;
	izleaf=false;
	if(xlen==0)izleaf=true;
return (new zcreate_tree_node(0,labent,izleaf,branches));
	
	
}

//creates a label labent node with branches
//assumes will be found, returns error if not
//doesn't check arity

function create_istr_label_nd(s,branches){
var labind;
var labent;

labind=findlab_obj(new cr_str_str(s),0);
if(labind==-1)rerror("Couldn't find label:"+s+" in create_istr_label_nd");
labent=labtab[labind];
return(create_labent_nd(labent,branches));

}
//creates a label labent node with branches
//assumes will be found, returns error if not
//doesn't check arity
function create_istr_op_label_nd(s,branches){
var labind;
var labent;
var op_obj;
//gtxt="Tst Error Report<br>";
op_obj=new cr_str_str(s);
//parserror(cr_istr_str(op_obj));
//document.getElementById("parserror_id").innerHTML =  cr_istr_str(op_obj);
//assumes max len of op is 2
labind=findop_obj(op_obj,2);
//rerror("Term in  in create_istr_op_label_nd");
if(labind==-1){

//document.getElementById("id1").innerHTML = gtxt;
	rerror("Couldn't find label:"+s+" in create_istr_op_label_nd");
}
labent=labtab[labind];
return(create_labent_nd(labent,branches));

}


/*========================*/
//Test routines

function create_tst_tree(){
var res;
//res=create_istr_label_nd('x',[]);
//res=create_istr_label_nd('x',[create_num_nd(3)]);



res=create_istr_op_label_nd('+',[create_istr_label_nd('x',[create_num_nd(3)]),create_num_nd(557)]);
res=create_istr_op_label_nd('+',[create_istr_nd("This is a string"),res]);
return(res);
	
}

function tst_tree_routines(){
	//var dtxt;
	var ltree;
	try{
		gtxt="<b>Parse Tree</b><br>";
		glob_ypos=1;
	clear_err_reps();
	ltree=create_tst_tree();
zdisplay_tree2(ltree,0);
document.getElementById("iddiv1").style.height=(1*((glob_ypos+1)*yscale))+'px'
//document.getElementById("id1").style.height=(1*((10+2)*yscale))+' px'
//document.getElementById("id1").style.height='50px'
document.getElementById("iddiv1").innerHTML = gtxt;



	}
	catch(err){
		rep_error(err);
		
	}
	
	
	
}


function disp_whole_tree(ltree){
	//var dtxt;
	//var ltree;
		gtxt="<b>Output Parse Tree</b><br>";
		glob_ypos=1;
	//clear_err_reps();
	//ltree=create_tst_tree();
zdisplay_tree2(ltree,0);
document.getElementById("iddiv1").style.height=(1*((glob_ypos+1)*yscale))+'px'
//document.getElementById("id1").style.height=(1*((10+2)*yscale))+' px'
//document.getElementById("id1").style.height='50px'
document.getElementById("iddiv1").innerHTML = gtxt;



	
	
	
	
}

function help_button(s){
	var z;
	z='compiler_help1.html'+'?glossname=';
	z+=s;
window.location.assign(z);	

	
}
function help_button2(s){
	var z;
	z='compiler_help1.html'+'?glossname=';
	//z+='Compiler_Button_'+s;
	z+=s;
	
window.location.assign(z);	

	
}

function display_code(){
var ltxt;
try{
clear_err_reps();
if(opcodes_top==0){
rerror(	"There is no intermediate code to display." );
	
}
ltxt="";
ltxt+='<b>Compiled Program Intermediate Code Opcodes</b><br>\n';
//ltxt=display_allnumcodes();
ltxt+=display_allcodes_txt();
document.getElementById("iddiv1").style.height='';
document.getElementById("iddiv1").innerHTML = ltxt;

}
catch(err){
rep_error(err);

}

	
}

function display_out_tree(){
try{
clear_err_reps();

	
	if(glob_parse_tree==-1){
rerror(	"glob_parse_tree data doesn't exit in  top_parse_test()" );
}
disp_whole_tree(glob_parse_tree);
}
catch(err){
rep_error(err);

}

	
}

//does generate tree and then generate code
function compile2(){
	top_parse_test0();
	if(gerrpt2==1) return;
	opcode_test(0);
	
}

function compile2_graph(){
	top_parse_test0();
	if(gerrpt2==1) return;
	opcode_test(0);
	if(gerrpt2==1) return;
	graph_equation();	
}

function compile2_run(){
	top_parse_test0();
	if(gerrpt2==1) return;
	opcode_test(0);
	if(gerrpt2==1) return;
	zrunprg();
	
}


/*========================*/

function zdisplay_buffer(){
var txt="";
var x;
var xlen;
var col;
var sw;
x=0;
xlen=buftxtarray.length;
while(x<=xlen){
sw=0;
if(x==holdpos){sw=1;col='green';}
if(x==bufpos){sw=1;col='red';}
if(sw==1){
txt+='<span style="background-color:'+col+';">';

}
if(x<xlen){
txt+=String.fromCharCode(buftxtarray[x]);
} else txt+=' ';
if(sw==1){
txt+='</span>\n';
}

x++;
}
return(txt);
}

function clear_err_reps(){
	rtxt="";
	gerrpt=1; //can run again
	gerrpt2=0; //no error
	
document.getElementById("parserror_id").innerHTML = "None<br>\n";
document.getElementById("errid").innerHTML = "None<br>\n";
document.getElementById("id1").innerHTML = "";
document.getElementById("iddiv1").innerHTML = "";

document.getElementById("idstack").innerHTML = "";

document.getElementById("idprg").innerHTML = "";
}

function rep_error(s){
var lerr;
gerrpt2=1; //error has occurred
if(gerrpt==0){
lerr="Error: "+s+"<br>Terminating<br>This is an initialisation Error<br>You can reload the page to try again by pressing F5<br>\n";
}else{
lerr="Error:"+s+"<br>Terminating that button press attempt.<br> Try to fix the problem and try again. You do not have to reload the page.<br>\n";
	
}
document.getElementById("errid").innerHTML = lerr;
display_rtxt();
}

function parserror(s){
var ltxt;
ltxt="";
ltxt+="<b>Parserror:</b> "+s+ "<br>At location:<br>";
ltxt+=zdisplay_buffer();
ltxt+='<br>\n';

document.getElementById("parserror_id").innerHTML = ltxt;
display_rtxt();
rerror("pars error");

}


//lab_init_ar
function array_test(){
var txt;
var dtxt;
var x;
var xlen;
var y;
var ylen;
var ar;
try{
txt="";

clear_err_reps();
ar=lab_init_ar;
x=0;
xlen=ar.length;
while(x<xlen){
txt+=x+' ';
	y=0;
	ylen=ar[x].length;
	while(y<ylen){
		txt+=y+':'+ar[x][y]+' ,';
	y++;	
	}
txt+='<br> ';
x++;	
}

//cold_init();
//display_all_labtab();

document.getElementById("parserror_id").innerHTML = txt;


}
catch(err){
rep_error(err);

}
}



function test_labtab(){
var txt;
var dtxt;
try{
//txt="";

clear_err_reps();
gerrpt=0; //not allowed to repeat

cold_init();
display_all_labtab();
document.getElementById("idprg2").innerHTML = '<b>Result of expression program is: Not Computed</b>';

//document.getElementById("parserror_id").innerHTML = "test_labtab here";


}
catch(err){
rep_error(err);

}
}

function test_str_obj(){
var txt;
var dtxt;
var ftxt;
var str_obj;
var str_obj2;
try{
	clear_err_reps();
//txt="";
//cold_init();
//display_all_labtab();
dtxt=document.forms["prgform"]["textin"].value;
str_obj=new cr_str_str(dtxt);
str_obj.chars[4]=32+1;
str_obj2=new cr_str_str_obj(str_obj);
//str_obj.chars[4]=32+1;
ftxt=cr_istr_str(str_obj2);
document.getElementById("parserror_id").innerHTML = ftxt;


}
catch(err){
rep_error(err);

}
}

function get_input_text(){
var txt;
var dtxt;
try{
	clear_err_reps();
txt="Input Text<br>";
//txt+=document.getElementById("textin").innerHTML;
dtxt=document.forms["prgform"]["textin"].value;
txt+=dtxt;
txt+='<br>\n';

document.getElementById("parserror_id").innerHTML = txt;
}
catch(err){
rep_error(err);

}
}

function demo_function(){
	var txt;
txt="Hello: demo_function<br>";
return(txt);
}

function zchk_funcs(){
var lfunc;

try{

	clear_err_reps();
rtxt="chk_funcs report<br>";
//txt="Input Text<br>";
lfunc=demo_function;
rtxt+="got demo function<br>";
rtxt+=lfunc();
display_rtxt();
}
catch(err){
rep_error(err);

}
	
}

var button_help_ar=
[
//"one","1",
//"two",'2',
'Button Name', 'Description of what it does.',
"  Get Input Text","Simply redisplays the text you can type into the input text box.",
"Test Initialisation Button/Reset","Initialises the lable table   and then displays it (showing all the built in functions.) Nothing works unless the routine is called first"+
 ' when the page loads. <span class="zred">It is now done automatically when the page loads.</span>'+
 '(See lower down the page for the output.)'
  ,
  'The Test String Objects', 'This tests my array text string objects, which redisplay the <br>'+
" text from the text input box. Note the '!' change in the text, which is done by the array string objects"+
  ' routines.<br>'+
  'What they are actually doing is converting the text input box text string javascript string to  my <br>'+
  " (written by me) array text string object,copying it again,  putting in a '!' and converting it back to a javascript text  string.<br>"+
  'These routines have some advantages over the javascript text strings.<br>',
  'Test Javascript Function Behaviour', 'Tests something to do with javascript function behaviour',
'Test Arrays Button', 'Tests that the initialisation data arrays are working correctly.<br>',
'Test Tree Routines Button', 'Creates a test pars output  tree and displays it at the bottom of the page.',
'Parstoken Test Button', 'This  parses out compiler tokens (symbols that mean something) from the input text<br>'+
' A number (can be a decimal )or a character string'+
'or something from the lable table<br>'+
'(eg. +- [ ]) is  a valid token.<br>The result is displayed lower down.',
'Parse to Tree Test','This parses the input text and attempts to create a parse tree and will give sensible error messages'+
'<br>The parse tree is displayed lower down in cut down more understandable format.',
'Parse to Tree Test Verbose','This parses the input text and attempts to create a parse tree and will give sensible error messages'+
'<br>The parse tree is displayed lower down showing all the data about each entry.'

];

function do_cell2(s){
var ztxt="";
ztxt+='<td>';
ztxt+=s;
ztxt+='</td>\n';
return(ztxt);
	
}
/*
function button_help(){
var txt="";
var x;
var xlen;	
xlen=	button_help_ar.length;

x=0;
txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){
txt+='<tr>';
txt+=do_cell2(button_help_ar[x]);
x++;	
if(x>=xlen)rerror("data error in button help");
txt+=do_cell2(button_help_ar[x]);
x++;	
txt+='</tr>';

}
	txt+="</table>\n";
document.getElementById("button_help").innerHTML = txt;
//document.getElementById("button_help").innerHTML = "buttons";
	
}
*/
function zdisplay_tree(ztree){
gtxt="";
zdisplay_tree2(ztree,0);

document.getElementById("id1").innerHTML = txt;



}