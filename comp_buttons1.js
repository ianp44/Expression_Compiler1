// JavaScript Document
// Ian's expression compiler javascript routines
// Buttons including help buttons information file

//Version 4.0 Beta Version.
// See www.pouncy.co.uk for author's website

/*
COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16

*/
var comp_help2_ar=[

['Expression Compiler Result Text','This is where the program will display the result of the computation done by the intermediate code'+
' program if it is successful.'],

['Parse Error Report Text','This is where parsing errors (also called syntax errors) are reported by the expression compiler.'],
['Error Report Text','This is where general  errors  are reported by all parts of  the expression compiler.'],
['About','COPYRIGHT NOTICE.<br>This expression compiler and associated help and glossary system and all associated source code and data is  is copyright  (C)  by Ian Pouncy 7/6/16 under the <br>GNU GENERAL PUBLIC LICENSE <br> Version 3, 29 June 2007<br> see Free Software Foundation, Inc., see <a href="http://fsf.org">http://fsf.org</a><br><br>This means you can use it if you want under the terms of that licence.<br><br>This source code  has been registered on github (user name Ianp44) on 27/7/16.'],

['Compiler Glossary','<br><span class="zred">If you want to easily select and compile and graph an equation and aren\'t too familiar with compilers, see the compile run and graph an equation box lower down the page on the expression compiler page proper. You can do it'+
' with only 2 or 3 clicks.</span><br>'+'<br>'+

'This is the help system associated with the expression compiler. This is definitely a Beta release. As of 5/7/16 the'+
 ' documentation on the expression compiler'+' particularly the buttons and features isn\'t too bad if you know anything about compilers and ' +' programming. <br>The general entries are not so good; '+
'not checked and not complete.<br> If you want help on any buttons or features on the expression compiler page where there is a green ? to'+
' the right of it, just click on the ? and it will take you to a entry in this glossary.'+
'<br> To see the Glossary index just click on the back to glossary index link.<br>'+
'To get back to the expression compiler proper, just click on the Back to Expression Compiler Proper Link near the top of'+
' the Glossary Page.'+'<br>Warning your back button may not work in Microsoft Edge, so you will have to use the back links instead.'],
['Help About Button Help','If you click on the green ? anywhere it will take you to a help entry relevant to the thing to the'+
' left of it.'

],
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



];



var button_help2_ar=[

['Close Equation Box','This button closes the equations box. It does not select an equation, and does nothing else.'+
' <br>If you select an equation the box will close automatically.'],

['Show Equations Box','This button opens the equations box, which allows you to select an equation which will put the equation text'+
' into the compiler input text box. When you select an equation the box will close again automatically. If you do not wish to select an'+
' equation click the Close Equation Box to close the box without selecting an equation.'],
['Compile to Tree Only','This button compiles the expression in the compiler input text box into a parse tree, and then, if successful,'+
' displays the parse tree lower down the page.'],
['Complete Compile','This button compiles the expression in the compiler input text box into a parse tree, and then, if successful,'+
' generates an intermediate code program from the parse tree, and then displays the intermediate code opcodes lower down the page.'],
['Complete Compile and Run','This button does a complete compile (see complete compile button) and then, if successful, runs the '
+'intermediate code program to yield a result if it runs successfully. To be used for expressions which are not intended to be graphed.'],
['Complete Compile and Run and Graph','This button does a complete compile (see complete compile button) and then, if successful, runs the '+
'expression intermediate code to graph the curve defined by the expression. The expression intermediate code program is actually called '+
'for each pixel to calculate the y position on the graph, which is the program result. The function x() which you can put in your'+
' expression (more than once if you want) is a built in function taking no parmaters which yields the x pixel position as it\'s return value as'+ ' the graph'+ 
' is plotted.'],
['Reset and Run','This button doesn\'t compile the expression input text, but will run the intermediate code program which has been compiled if it is there.'+
' It doesn\'t graph the values, just runs the program once and yields a result.'],
['Graph Equation','This button doesn\'t compile expression input text, but will run/graph the intermediate code program which has been compiled if it is there.'+
' It runs the intermediate code program once for each pixel in the graph. See  Complete Compile and Run and Graph for more about how'+
' it graphs.'],
['Display Parse Tree','This button displays the parse tree generated by the first stage of the compiler if it exists. It doesn\'t'+
' compile or run anything. It is displayed lower down the page.'],
['Display Intermediate Code','This button displays the intermediate code generated by the first stage of the compiler if it exists. It doesn\'t'+
' compile or run anything. It is displayed lower down the page.'],
['Reset Program','This button resets the intermediate code program counter. It is used in conjunction with the single step button.'],
['Single Step','This button single steps through the intermediate code program, displaying the program counter value and also the '+
'values on the program stack.']

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

var button_help_ar=
[
//"one","1",
//"two",'2',
//['Button Name', 'Description of what it does.',''],
["Get Input Text","Simply redisplays the text you can type into the input text box.",'get_input_text()'],
["Test Initialisation Button (Reset)","Initialises the lable table   and then displays it (showing all the built in functions.) Nothing works unless the routine is called first"+
 ' when the page loads. <span class="zred">It is now done automatically when the page loads.</span>'+
 '(See lower down the page for the output.)','test_labtab()'],
  
  ['Test String Objects', 'This tests my array text string objects, which redisplay the '+
" text from the text input box. Note the '!' change in the text, which is done by the array string objects"+
  ' routines. '+
  'What they are actually doing is converting the text input box text string javascript string to  my '+
  " (written by me) array text string object,copying it again,  putting in a '!' and converting it back to a javascript text  string.<br>"+
  'These routines have some advantages over the javascript text strings.<br>','test_str_obj()'],
  
  ['Test Javascript Function Behaviour', 'Tests something to do with javascript function behaviour.','zchk_funcs()'],
  ['Test Arrays Button', 'Tests that the initialisation data arrays are working correctly.<br>','array_test()'],
  
['Test Tree Routines Button', 'Creates a test pars output  tree and displays it at the bottom of the page.','tst_tree_routines()'],

['Parstoken Test Button', 'This  parses out compiler tokens (symbols that mean something) from the input text<br>'+
' A number (can be a decimal )or a character string '+
'or something from the lable table<br>'+
'(eg. +- [ ]) is  a valid token.<br>The result is displayed lower down.','top_token_test()'],

['Parse to Tree Test','This parses the input text and attempts to create a parse tree and will give sensible error messages'+
'<br>The parse tree is displayed lower down in a cut down more understandable format.','top_parse_test0()'],

['Parse to Tree Test Verbose','This parses the input text and attempts to create a parse tree and will give sensible error messages.'+
'<br>The parse tree is displayed lower down showing all the data about each entry.','top_parse_test1()'],

['Generate and Display Opcodes','This generates the intermediate code from the parse tree if the parse tree exists.<br>The result is displayed lower down.','opcode_test(0)'],
['Generate and Display Opcodes Verbose','This generates the intermediate code from the parse tree if the pares tree exists.<br>The result is displayed lower down showing more detail.','opcode_test(1)']


];
/*
<button onclick="get_input_text()">Get Input Text</button> , 
<button onclick="test_labtab()">Test Initialisation</button> , 
<button onclick="test_str_obj()">Test String Objects</button> , 
<button onclick="zchk_funcs()">Test Javascript Function Behaviour </button> , 
<button onclick="array_test()">Test Arrays</button>,
<button onclick="tst_tree_routines()">Test Tree Routines</button>,
<button onclick="top_token_test()">Parstoken Test</button>,
<button onclick="top_parse_test0()">Parse to tree Test</button>,
<button onclick="top_parse_test1()">Parse to tree Test Verbose</button><br>
<button onclick="opcode_test(0)">Generate and Display Opcodes</button>,
<button onclick="opcode_test(1)">Generate and Display Opcodes  Verbose</button>,
*/

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


function button_generate(){
var txt="";
var x;
var xlen;	
var z;
var reftxt;

xlen=	button_help_ar.length;

x=0;
//txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){

z=button_help_ar[x];
//txt+='<tr>';
txt+='<button onclick="'+z[2]+'">'+z[0]+'</button>';
//reftxt=zrep_char('Compiler Button '+z[0],' ','_');
reftxt=zrep_char(z[0],' ','_');
txt+='<button class="buttonhelpclass" onclick="help_button('+"'"+reftxt+"')"+'">?</button> ';
//txt+=do_cell2(button_help_ar[x]);
//txt+=do_cell2(z[0]);
//x++;	
//if(x>=xlen)rerror("data error in button help");
//txt+=do_cell2(button_help_ar[x]);
//txt+=do_cell2(z[1]);
x++;	
//txt+='</tr>';

//x++;

//txt+=x+'<br>\n';
}
//	txt+="</table>\n";
document.getElementById("buttons_span").innerHTML = txt;
//document.getElementById("button_help").innerHTML = "buttons";
	
}


function button_help(){
var txt="";
var x;
var xlen;	
var z;

xlen=	button_help_ar.length;

x=0;
txt+='<table cellspacing="0" cellpadding="0" border="1" class="buttonhlpclass">'

while(x<xlen){

z=button_help_ar[x];
txt+='<tr>';
//txt+=do_cell2(button_help_ar[x]);
txt+=do_cell2(z[0]);
//x++;	
//if(x>=xlen)rerror("data error in button help");
//txt+=do_cell2(button_help_ar[x]);
txt+=do_cell2(z[1]);
x++;	
txt+='</tr>';

//x++;

//txt+=x+'<br>\n';
}
	txt+="</table>\n";
document.getElementById("button_help").innerHTML = txt;
//document.getElementById("button_help").innerHTML = "buttons";
	
}
