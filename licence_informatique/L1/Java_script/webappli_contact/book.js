"use strict";

let elements=["nom","pseudo","prenom","email","telephone"];

function Affiche_contact(){

	let liste=document.querySelector("#liste ul");

	for(let i=0;i<personnes.length;i++){

		let element=document.createElement("li");
		let nom_complet=personnes[i]["nom"]+" "+"'"+personnes[i]["pseudo"]+"'"+" "+personnes[i]["prenom"];

		let texte=document.createTextNode(nom_complet);
		element.setAttribute("data-position",i);
		element.appendChild(texte);

		element.addEventListener("click",Affiche_detail);
		liste.appendChild(element);

	}


}

function Date_french(date){
	let mois=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
	let jours=["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

	let day=jours[date.getDay()];
	let month=mois[date.getMonth()];
	let year=date.getFullYear();
	let num=date.getDate();

	let complet=day+" "+num+" "+month+" "+year;

	return complet;

}

function Affiche_detail(event) {

	let section=document.getElementById("details");

	Del_detail();

	let personne=personnes[event.currentTarget.dataset.position];

	let h1=document.createElement("h1");
	let titre=document.createTextNode(personne["nom"]+" "+personne["prenom"]);

	h1.appendChild(titre);
	section.appendChild(h1);

	let h2=document.createElement("h2");
	let pseudo=document.createTextNode("Pseudo : "+personne["pseudo"]);

	h2.appendChild(pseudo);
	section.appendChild(h2);


	let a=document.createElement("a");
	let mail=document.createTextNode(personne["email"]);
	a.setAttribute("href","");

	a.appendChild(mail);
	section.appendChild(a);

	let p1=document.createElement("p");
	let num_tel=document.createTextNode(personne["telephone"]);

	p1.appendChild(num_tel);
	section.appendChild(p1);

	let p2=document.createElement("p");
	let date=new Date(personne["date"]);
	date=Date_french(date);
	let creation=document.createTextNode("Contact créé le : "+date);

	p2.appendChild(creation);
	section.appendChild(p2);

	let p3=document.createElement("p");
	let id=document.createTextNode("Identifiant interne : "+personne["id"]);

	p3.appendChild(id);
	section.appendChild(p3);

	let modif=document.createElement("button");
	let texte=document.createTextNode("Modifier");

	modif.setAttribute("data-position",event.currentTarget.dataset.position);
	modif.addEventListener("click",Modifier_contact);

	modif.appendChild(texte);
	section.appendChild(modif);

	let supprimer=document.createElement("button");
	texte=document.createTextNode("Supprimer");

	supprimer.setAttribute("data-position",event.currentTarget.dataset.position);
	supprimer.addEventListener("click",Supprimer_contact);

	supprimer.appendChild(texte);
	section.appendChild(supprimer);

}

function Modifier_contact(event){
	let form=document.querySelector("#formulaire form");
	let formulaire=form.cloneNode(true);
	formulaire.style.display="block";
	formulaire.setAttribute("data-position",event.currentTarget.dataset.position);
	let inputs=formulaire.elements;

	let personne=personnes[event.currentTarget.dataset.position];

	for(let i=0;i<inputs.length;i++){

		let input=inputs[i];

		input.setAttribute("value",personne[elements[i]]);

	}

	let envoyer=document.createElement("button");
	let texte=document.createTextNode("Envoyer");

	envoyer.appendChild(texte);
	envoyer.addEventListener("click",Modification);

	formulaire.appendChild(envoyer);

	let section_form=document.getElementById("formulaire");

	section_form.appendChild(formulaire);



}

function Modification(event){

	event.preventDefault();

	let formulaire=document.querySelectorAll("#formulaire form")[1];
	let section_form=document.getElementById("formulaire");
	let inputs=formulaire.elements;
	let personne=personnes[formulaire.dataset.position];

	for(let i=0;i<inputs.length;i++){

		let input=inputs[i];
		personne[elements[i]]=input.value;


	}
	section_form.removeChild(formulaire);
	Del_detail();
	Maj_contact();
	Enregistrement_storage();


}

function Supprimer_contact(event){

	let personne=personnes[event.currentTarget.dataset.position];

	let confirmation=window.confirm("Voulez vous supprimer "+personne["nom"]+" '"+personne["pseudo"]+"' "+personne["prenom"]+" ?");

	if(confirmation){

		personnes.splice(event.currentTarget.dataset.position,1);

		Del_detail();
		Maj_contact();
		Enregistrement_storage();

	}



}

function Del_detail(){

	let section=document.getElementById("details");

	while (section.children.length!=0){

		let last=section.lastElementChild;
		section.removeChild(last);

	}

}

function Maj_contact(){

	Del_contact();

	Affiche_contact();


}

function Del_contact(){

	let contact=document.querySelector("#liste ul");

	while(contact.children.length!=0){

		let last=contact.lastElementChild;
		contact.removeChild(last);

	}

}

function Ajout_contact(event){
	Del_detail();
	let form=document.querySelector("#formulaire form");
	let formulaire=form.cloneNode(true);
	formulaire.style.display="block";


	let ajouter=document.createElement("button");
	let texte=document.createTextNode("Ajouter");

	ajouter.appendChild(texte);
	ajouter.addEventListener("click",Ajouter);

	formulaire.appendChild(ajouter);

	let section_form=document.getElementById("formulaire");
	section_form.appendChild(formulaire);



}

function Ajouter(event){
	event.preventDefault();
	Del_detail();
	let new_personn={};
	let id=chance.guid();
	new_personn["id"]=id;
	let formulaire=document.querySelectorAll("#formulaire form")[1];
	let inputs=formulaire.elements;
	for(let i=0;i<inputs.length-1;i++){

		let input=inputs[i];
		new_personn[elements[i]]=input.value;

	}
	let today=new Date();
	let mois=parseInt(today.getMonth())+1;
	mois=mois.toString();
	let date=today.getFullYear()+"-"+mois+"-"+today.getDate();
	new_personn["date"]=date;
	personnes.push(new_personn);

	let section=document.getElementById("formulaire");
	section.removeChild(formulaire);

	Maj_contact();
	Enregistrement_storage();

}

function Enregistrement_storage(){
		let store=window.localStorage;
		let data=JSON.stringify(personnes);
		store.setItem("contacts",data);
}

function Test_Storage(){
	let store=window.localStorage;
	if(store.getItem("contacts")){
		let data=store.getItem("contacts");
		data=JSON.parse(data);
		personnes=data;

	}


}
Test_Storage();
Affiche_contact();
let button_ajouter=document.getElementById("ajouter");
button_ajouter.addEventListener("click",Ajout_contact);
