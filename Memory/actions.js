/*=============================================================================*/
/*--Memory game, developed by Lucas Elsaesser--							 	 --*/
/*--The idea of this programm is a simple web-based Memory game in javascript--*/
/*--																		 --*/
/*--This file is part of the projekt "Memory"								 --*/
/*--15.09.2017																 --*/
/*=============================================================================*/

//Liste mit den Pfaden zu den Bildern
var memory_array = ['./images/sydneyOperaHouse.jpg', './images/sydneyOperaHouse.jpg', './images/chichenItza.jpg', './images/chichenItza.jpg', './images/tajMahal.jpg',
					'./images/tajMahal.jpg', './images/stonehenge.jpg', './images/stonehenge.jpg', './images/petra.jpg', './images/petra.jpg',
					'./images/eiffelTower.jpg', './images/eiffelTower.jpg', './images/burjKhalifa.jpg', './images/burjKhalifa.jpg',
					'./images/machuPicchu.jpg', './images/machuPicchu.jpg', './images/Neuschwanstein.jpg', './images/Neuschwanstein.jpg',
					'./images/cologneCathedral.jpg', './images/cologneCathedral.jpg', './images/saintBasilsCathedral.jpg', './images/saintBasilsCathedral.jpg',
					'./images/pyramidsOfGizeh.jpg', './images/pyramidsOfGizeh.jpg'];

var memory_values = []; //Karten die aufgedeckt wurden (in einem Zug) --> hier stehen die zwei Dateipfade aus memory_array drin, die in diesem Zug aufgedeckt wurden
var memory_tile_ids = []; //Karten die aufgedeckt wurden, allerdings nicht der Text wie oben sondern hier die <div> elemente selbst --> dadruch weiß man welches Feld man später umdrehen soll
var tiles_flipped = 0;
var turnCount = 0; //Zähler für die Züge
var progressBarValue = 0; //Progressbar startet zu beginn bei 0%


//Hauptfunktion, hier wird das Spielfeld generiert
//Das Skript startet an dieser Stelle
function newBoard() {
 showCurrentTurn(); //Einmaliger Aufruf von hier, damit der Zähler bei 0 startet
 tiles_flipped = 0;
 memory_array = _.shuffle(memory_array); //_.shuffle Funktion kommt von der Lodash Library, ansonsten Fisher Yates Algorithmus verwenden
 var output = '';
 _.forEach(memory_array, function(memory_array_value, index) { // _.forEach kommt von Lodash
 output += '<div id="tile_'+ index +'" onclick="memoryFlipTile(this,\''+ memory_array_value +'\')"></div>';
 });
 document.getElementById('memory_board').innerHTML = output; //Die ganzen Einzelnen div Elemente (Memory Karten) werden in das leere Memory Feld gesetzt
}


function canFlipCard(tile) {
	//alert(memory_values.length);
	return tile.innerHTML == "" && memory_values.length < 2; //Überprüft ob keine oder genau eine Karte bisher umgedreht wurden
	//Hier steht: Wenn der Inhalt des div-Elements (welches umgedreht werden soll) LEER ist (also umgedreht, kein Bild) UND das Array maximal einen Wert hat (also bisher nur 1 Karte umgedreht wurde)...
	//... dann: return true, ansonsten return false
}

function flipCard(tile, value) { //Diese Funktion wird aufgerufen wenn eine Karte umgedreht wird und sorgt für den optischen Effekt indem der Style der Karte angepasst wird
	tile.innerHTML = '<img src=\'' + value + '\'>';
}

function areNoCardsFlipped() { //Diese beiden Funktionen überprüfen ob keine, bzw. genau eine Karte bereits umgedreht wurden
	return memory_values.length == 0; //Dafür wird einfach die Länge des Arrays geprüft - dort werden die umgedrehten Karten gespeichert
}
function isOneCardFlipped() {
	return memory_values.length == 1;
}

function setCardAsFlipped(tile, value) { //Speichert die umgedrehten Karten in das memory_values Array und die dazugehörigen IDs in das memory_title_ids Array
 	memory_values.push(value);
 	memory_tile_ids.push(tile.id);
}

function lookForMatch() { //Überprüft die memory_values darauf ob ein Paar gefunden wurde
	turnCount += 1; // += ist das selbe wie turnCount = turnCount + 1 (kurze Schreibweise)
	showCurrentTurn(); //Zähler aktualisieren

 	return memory_values[0] == memory_values[1]; //Dieser Ausdruck kann entweder wahr (true) oder falsch (false) sein!
 												 //So weiß die aufrufende Funktion direkt ob die beiden Karten zusammenpassen oder nicht
}

function matchCards() { //Wenn ein Paar gefunden wurde (lookForMatch == true) dann Zähler für Aufgedeckte Karten um 2 erhöhen und gespeicherte Werte aus den Arrays löschen
	displayItemText();
	refreshProgressBar();
 	tiles_flipped += 2;
 	memory_values = [];
 	memory_tile_ids = [];
}

function isGameOver() { //Wenn Anzahl der Aufgedeckten Karten == Gesamtzahl der Karten, dann Spiel gewonnen
 return tiles_flipped == memory_array.length;
}

function gameIsOver() { //Wenn das Spiel gewonnen wurde, wird eine Nachricht gesendet
	$(document).ready (function(){
		document.getElementById("win-alert").innerHTML = "<strong>Herzlichen Glückwunsch</strong><br />Du hast in " + turnCount  + " Zügen gewonnen. Versuche es doch nochmal! :)";
            $("#win-alert").show();
    });
}

function cardsDoNotMatch() { //Wenn 2 aufgedeckte Karten nicht zueinander passen, werden nach 1000 Millisekunden die Karten wieder umgedreht
	setTimeout(flipCardBack, 2000);
}


//Wenn man mehr als 40 Züge braucht: verloren!
function tooMuchTurns() {
	if(turnCount > 40) {
		alert("You have no turns left... Game over!");
		turnCount = 0; //dann zähler resetten...
		newBoard(); //... und automatisch neues Spiel starten
	}
}


//Funktion ändert den Text des HTML Elements "turnCountDisplay" zum aktuellen Wert von turnCount
function showCurrentTurn() {
	document.getElementById("turnCountDisplay").innerHTML = "Zug: " + turnCount;
}


//Mit dieser Funktion wird der Ausgabe-String für die Discovery-Box erstellt und mit jQuery anschließend ausgegeben
function displayItemText() {
	var tile1 = memory_values[0];
	var name="error"; //Text für die "kleine" Info Box
	var text="error"; //Text für die ausführlichen Informationen

	var infoTextStorage = [
	//0
		"Das Weltberühmte Opernhaus wurde 1973 fertiggestellt und ist mit über 1.100.000 glasierten Keramikplatten bedeckt. Es enthält fünf Theater mit insgesamt 5532 Sitzplätzen. Es ist ein UNESCO-Welterbe.",

	//1
		"Chichen Itza ist eine Maya-Ruine auf der mexikanischen Halbinsel Yucatan. <br />Ihr Name bedeutet Übersetzt: \"Am Rande des Brunnes der Itza\". Itza ist dabei der Name des Volkes. <br />Aufgrund von Keramikfunden wird vermutet, dass Chichen Itza bereits vor über 2000 Jahren besiedelt war. Heute ist es ein UNESCO-Welterbe und gehört zu den \"neuen sieben Weltwundern\".",

	//2
		"Taj Mahal (\"Krone des Palastes\") ist eine Grabstädte im indischen Bundesstaat Uttar Pradesh. Es wurde auf einer 100 x 100 Meter großen Marmorplattform errichtet und hat die Form einer Moschee. Erbaut wurde es auf Befehl des Großmoguls Shah Jahan, als Erinnerung für seine verstorbene große Liebe. Taj Mahal wurde 1648 nach 17 Jahren Bauzeit fertiggestellt. Es ist ein UNESCO-Welterbe und gehört zu den \"neuen sieben Weltwundern\".",

	//3
		"Stonehenge ist eines der ältesten, noch erhaltenen Bauwerke der Welt. Neuste Forschungen legen nahe, dass der Steinkreis bereits 3000 v.Chr. errichtet wurde. Die Anlage selbst soll sogar bereits seit 11.000 v.Chr. genutzt worden sein. Woher die riesigen, tonnenschweren Steine stammen und wie die Menschen sie transportieren konnten, ist bis heute Unbekannt. Forscher glauben, dass sie aus den Preseli-Bergen in Wales stammen könnten und von einem Gletscher ins Land getragen wurden. Stonehenge ist UNESCO-Welterbe.",

	//4
		"Petra ist eine verlassene Felsenstadt im heutigen Jordanien. Zwischen 500 - 300 v.Chr. war sie Hauptstadt des Reiches der Nabatäer und ein bedeutender Handelsplatz. Höhepunkt von Petra sind die gigantischen Grabtempel, die direkt aus der Felswand herausgemeißelt wurden. Die Stadt wird unter anderem Namen sogar im Alten Testament erwähnt. Petra ist griechisch und bedeutet \"Fels\". Petra ist eines der \"neuen sieben Weltwunder\" und seit 1985 UNESCO-Welterbe.",

	//5
		"Der Eiffelturm ist eines der bekanntesten und meistbesuchten Wahrzeichen der Welt. Er gilt als Ikone der Architektur und Ingenieurskunst. Das ehemals 312 Meter hohe Bauwerk wurde 1889, zum 100. Jahrestag der Französischen Revolution, fertiggestellt. Architekt und namesgeber ist Gustave Eiffel. Nach 1921 trug das Bauwerk zur Geschichte des Radiofunks und Fernsehen bei, da es als erster Europäischer Sendeturm genutzt wurde. Heute ist der Turm übrigens 324 Meter hoch. 2000 wurde eine zusätzliche Antenne montiert.",

	//6
		"Burj Khalifa ist ein Wolkenkratzer in Dubai und mit 828 Metern das höchste Gebäude der Welt. Es wurde 2009 nach 5 Jahren Bauzeit fertiggestellt. Das Gebäude besitzt 189 Etagen - die höchste befindet sich 638 Meter über dem Erdboden. Genutzt werden diese für Wohnungen, Hotels und Büros. Der Bau der Anlage kostete ca. 1 Mrd. Euro.",

	//7
		"Machu Picchu (\"alter Gipfel\") ist eine gut erhaltene Ruinenstadt in Peru. Die Inkas erbauten die Stadt im 15. Jahrhundert zwischen den Gipfeln der Berge Huayna Picchu und Machu Picchu. Sie liegt in 2430 Metern höhe. Die Anlage ist bis heute über eine Inkastraße mit der damaligen Hauptstadt der Inkas, Cusco, verbunden. Machu Picchu ist eine der größten Tourismusattraktionen Südamerikas. Die Anlage ist UNESCO-Welterbe und eines der \"neuen sieben Weltwunder\".",

	//8
		"Schloss Neuschwanstein steht bei Füssen im südlichen Bayern. Das Schloss entstand, als die Ruine der Burg Hohenschwangau auf geheiß des bayerischen Königs Ludwig II 1869 wiederaufgebaut werden sollte. Das Schloss diente dabei eigens Ludwigs perönlichem Rückzugsort. 2002 stürzten in der nähe Teile eins Meteoriten auf die Erde, der seitdem auch unter dem Namen Neuschwanstein bekannt ist. Schloss Neuschwanstein zählt heute zu einer der berühmtesten Sehenswürdigkeiten Deutschlands.",

	//9
		"Die Hohe Domkirche Sankt Petrus ist eine römisch-katholische Kirche in Köln unter dem Patrozinium des Apostels Petrus. Mit 157 Metern ist es nach dem Ulmer Münster das zweithöchste Kirchengebäude Europas und das dritthöchste Weltweit (Basilika Notre-Dame in der Elfenbeinküste). Einzigartik am Kölner Dom ist seine Bauweise. Begonnen wurde im 13. Jahrhundert im damaligen Baustil der Gotik. Vollendet wurde er aber erst nach jahrhunderter langer Arbeit im 19. Jahrhundert (Neugotik). Der Kölner Dom vereint dadurch verschiedene Stilelemente der Geschichte in einem weltweit einzigartigen Bauwerk.<br />Er ist ein UNESCO-Welterbe.",

	//10
		"Die Kathedrale des heiligen Basilius ist eine russisch-orthodoxe Kirche in der russischen Hauptstadt Moskau. Sie steht am südlichen Ende des Roten Platzes und gilt als Wahrzeichen der Stadt. Die 115 Meter hohe Kathedrale besitzt neun Kuppeln, jede in eigner Form und Farbe. Eigentlich sind es sogar neun eigene Kirchen, zusammengesetzt in eine riesige Kathedrale. Gebaut wurde sie im Auftrag von Zar Iwan IV (der Schreckliche). Heute ist die Anlage ein Museum.",

	//11
		"Genau wie Stonehenge zählen die Pyramiden von Gizeh zu den ältesten erhaltenen Bauwerken der Menschheit. Sie befinden sich am westlichen Rand des Niltals, nahe der Stadt Gizeh. Sie sind das einzige erhaltene der \"sieben antiken Weltwunder\" und sind heute UNESCO-Welterbe. Die größte der Pyramiden ist die bekannte Cheops-Pyramide mit heute 138 Metern höhe. Gebaut wurde die Anlage vermutlich 2620 v.Chr. bis 2500 v.Chr. Der Komplex besteht ingesamt aus drei kleinen und drei größeren Pyramiden von denen alle bis heute erhalten sind.",

	//12
		"insert new text here"
	];

	switch(tile1) {
		case './images/sydneyOperaHouse.jpg': name = "das Opernhaus von Sydney";
											  text = infoTextStorage[0];
		break;
		case './images/chichenItza.jpg': name = "Chichen Itza";
										 text = infoTextStorage[1];
		break;
		case './images/tajMahal.jpg': name = "Taj Mahal";
									  text = infoTextStorage[2];
		break;
		case './images/stonehenge.jpg': name = "Stonehenge";
										text = infoTextStorage[3];
		break;
		case './images/petra.jpg': name = "Petra";
								   text = infoTextStorage[4];
		break;
		case './images/eiffelTower.jpg': name = "den Eiffelturm";
										 text = infoTextStorage[5];
		break;
		case './images/burjKhalifa.jpg': name = "Burj Khalifa";
										 text = infoTextStorage[6];
		break;
		case './images/machuPicchu.jpg': name = "Machu Picchu";
										 text = infoTextStorage[7];
		break;
		case './images/Neuschwanstein.jpg': name = "Schloss Neuschwanstein";
											text = infoTextStorage[8];
		break;
		case './images/cologneCathedral.jpg': name = "den Kölner Dom";
											  text = infoTextStorage[9];
		break;
		case './images/saintBasilsCathedral.jpg': name = "die Basilius Kathedrale";
												  text = infoTextStorage[10];
		break;
		case './images/pyramidsOfGizeh.jpg': name = "die Pyramiden von Gizeh";
											 text = infoTextStorage[11];
		break;

	}

	$(document).ready (function(){
		document.getElementById("discovery-alert").innerHTML = "<strong>Glückwunsch!</strong><br />Du hast " + name  + " gefunden!";
            $("#discovery-alert").show(function showAlert() {
               $("#discovery-alert").fadeTo(4000, 500).slideUp(500, function(){
               $("#discovery-alert").slideUp(500);
                });
            });
 	});

 	$(document).ready (function() {
 		document.getElementById("info-alert").innerHTML = "<strong>Wusstest du schon?</strong><br />" + text;
 		$("#info-alert").show();
 	});
}

function refreshProgressBar() {
	progressBarValue += 8.3333;
	$(document).ready(function() {
		$('#progBa').css('width', progressBarValue + '%')
					 .attr('aria-valuenow', progressBarValue);
	});
}


function flipCardBack() { //Funktion zum wieder Zudecken der Karten. Der Style wird dabei auf default zurückgesetzt.
	var tile_1 = document.getElementById(memory_tile_ids[0]);
	var tile_2 = document.getElementById(memory_tile_ids[1]);
	tile_1.style.backgroundImage = "url(./images/card-texture.jpg)";
	tile_1.innerHTML = "";
	tile_2.style.backgroundImage = "url(./images/card-texture.jpg)";
	tile_2.innerHTML = "";
	memory_values = []; //Gespeicherte Karten werden gelöscht
	memory_tile_ids = [];
}


//Jedesmal wenn eine Memory Karte angeklickt wird, wird diese Funktion aufgerufen.
//Das passiert weil jede Karte bei der generierung in newBoard() das attribut onclick="memoryFlipTile" bekommt.
function memoryFlipTile(tile, value) {
	tooMuchTurns();
	 if (canFlipCard(tile)) {
	   flipCard(tile, value);
	   if (areNoCardsFlipped()) {
	     setCardAsFlipped(tile, value);
	   } else if(isOneCardFlipped()) {
	     setCardAsFlipped(tile, value);
	       if(lookForMatch()) {
	         matchCards();
	         if (isGameOver()) {
	           gameIsOver();
	         }
	       } else {
	         cardsDoNotMatch();
       }
     }
   }
 }


//Hiermit werden die alerts zu beginn ausgeschaltet und nur aktiviert, wenn sie aufgerufen werden
$(document).ready(function() {
	$("#discovery-alert").hide();
});
$(document).ready(function() {
	$("#win-alert").hide();
});
$(document).ready(function() {
	$("#info-alert").hide();
});
