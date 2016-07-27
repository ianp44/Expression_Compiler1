// JavaScript Document
// Ian's expression compiler javascript routines
// Equations file

//Version 4.0 Beta Version.
// See www.pouncy.co.uk for author's website

/*

COPYRIGHT NOTICE.
This code is copyright  (C)  by Ian Pouncy 7/6/16.
under the   GNU GENERAL PUBLIC LICENSE,  Version 3, 29 June 2007 , see Free Software Foundation, Inc. <http://fsf.org/> 
 
This means you can use it if you want under the terms of that licence.

This source code  has been registered on github (user name Ianp44) on 27/7/16


*/


var equations=
[
['Sine wave','40*sin((2*3.14*x())/100)', 'Sine wave of period 100 pixels and amplitude 40 pixels'],
['Parabola', '((x()/100)-4)*((x()/100)-4)*15','Simple Parabola'],
['Exponential','3*pow(2.71,((x()/100)))','Simple Exponential'],
['Exponential Decay','5*pow(2.71,0-((x()/100)-4))','Simple Exponential Decay'],
['Linear Rise','30*((x()/100)-4)','Simple Linear Rise'],
['Square Root','50*pow((x()/100),0.5)','Square Root Curve']



];

function close_equation_box(){
	document.getElementById("equations1").style.visibility='hidden';
	
}

function graph_equation2(x){
	var z;
try{
	
	document.getElementById("equations1").style.visibility='hidden';
	z=equations[x];
	
	document.forms["prgform"]["textin"].value=z[1];
	
	
}
	catch(err){
		rep_error(err);
		
	}

	
	
}

function generate_button_entry(x2){
var txt;
var z;
z=equations[x2];
txt='';
txt='<tr>';
txt+='<td><button onclick="graph_equation2('+x2+')">'+z[0]+'</button></td>';
txt+='<td>'+z[1]+'</td>';
txt+='<td>'+z[2]+'</td>';
txt+='</tr>\n';
	
	return(txt);
}

function show_equations(){
	
	var txt;
	var x;
	var xlen;
	x=0;
	xlen=equations.length;
	txt='';
txt+='<center>\n';
	txt+='<button onclick="close_equation_box()">Close Equation Box</button>';
	txt+='<button class="buttonhelpclass" onclick="help_button2('
	+"'Close_Equation_Box'" +')">?</button><br>';
	
//txt+='<center>\n';

	txt+='<b>Equations Box</b><br>';
	txt+='Click the select button to select the equation. This sets the compiler input  text to  the selected equation text.<br>';
	txt+='To compile run/graph an equation click on the complete compile run and graph button, which will attempt to do a complete compile of the selected equation, and then, if successful, will run and graph the equation.<br>';
	txt+='If you do not wish to select an equation, click the Close Equation Box.<br>';
	//txt+='and then click on generate and display opcodes, to generate the program codes.<br>';
//	txt+='The click graph equation to display the graph if everything works ok.<br>';
	txt+='<br>';
txt+='<center>\n';
txt+='<table cellpadding="0" cellspacing="0" width="600" border="1">\n';
txt+='<tr><td><b>Select Button</b></td><td><b>Equation Expression Text</b></td><td><b>Description</b></td></tr>';
	while(x<xlen){
	txt+=	generate_button_entry(x);
	
		x++;
	}
	



txt+='</center>\n';
document.getElementById("equations1").innerHTML = txt;


document.getElementById("equations1").style.visibility='visible';


}




