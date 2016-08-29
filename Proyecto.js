var barajaEspannola={tipo: 'ESPAÑOLA', palos: ['oros', 'copas', 'espadas', 'bastos'], cartasPalo: 10, comodines:0};
var barajaInglesa={tipo: 'INGLESA', palos: ['corazones', 'diamantes', 'picas', 'tréboles'], cartasPalo:13, comodines:2};
var barajaBlackJack={tipo: 'BLACKJACK', palos: ['corazones', 'diamantes', 'picas', 'treboles'], cartasPalo:13, comodines:0}

var Croupier={

	//cartas contendrá un array de cartas {palo:, valor:}
	cartas: [],//contendrá una vez generada las cartas
	
	//se debe invocar con napes=barajaEspannola o naipes=barajaInglesa para que se genere el array cartas
	generaBaraja: function(naipes){//generará las cartas a usar
		this.cartas=[];
		for (var i=0;i<naipes.cartasPalo;i++){//se añaden las cartas normale
			for(var j=0; j<naipes.palos.length;j++){
				this.cartas[this.cartas.length]={ palo:naipes.palos[j], valor: i+1};
				//console.log(this.cartas[this.cartas.length-1]);
			}
		}
		for (var i=0;i<naipes.comodines;i++){//se añaden los comodines al final
			this.cartas[this.cartas.length]={palo:'comodín', valor: 0};
			//console.log(this.cartas[this.cartas.length-1]);
		}
			
	},
	//función que desordena el array cartas
	barajar: function(){
		for (var i=0;i<100;i++){
			var carta1=Math.floor(this.cartas.length*Math.random());
			var carta2=Math.floor(this.cartas.length*Math.random());
			var aux=this.cartas[carta1];
			this.cartas[carta1]=this.cartas[carta2];
			this.cartas[carta2]=aux;
		}
	},


	//genera un array de naipes que extrae con los 'cuantos' primeros elementos y elimina esos elementos de cartas.
	//si no se pasa el parámetro cuantos extrae un solo elemento.
	repartir: function(cuantos){
		cuantos=cuantos||1;//si no se pasa parámetro cuantos reparte solo 1 carta (..||1)
		var naipes=this.cartas.splice(0,cuantos)//splice quita (en este caso) 1 elemento de la posición 0 y lo devuelve
		return naipes;//devolvemos un array con los repartidos
		
	},
	//obtiene la valoración de mano que es un array de 5 cartas, si tiene un número de elementos distintos no hace valoración.
	//si se trata de la baraja inglesa para hacer la valoración se tiene en cuenta de si hay comodines.
	//si hay CINCO cartas iguales (CUATRO +comodin o TRES + dos comodines) se duplica el valor.
	puntuar(mano){
		var valor=0;
		var iguales=true;
		var carta=0;//caso de ser iguales las CINCO contiene el valor de la carta
		var cartaMax=0;//puntuación máxima de una de las cartas de la mano
		var comodines=0;//numero de comodines de la mano
		if (mano.length!=5){
			console.log('SOLO SE PUNTÚAN MANOS DE 5 CARTAS');
		}else{
			for (var i=0;i<5;i++){
				valor+=this.puntos(+mano[i].valor);
				if(this.puntos(+mano[i].valor)>cartaMax)cartaMax=this.puntos(+mano[i].valor);
				if(mano[i].valor!=0){
					iguales=iguales&&(carta===0||carta===this.puntos(+mano[i].valor));
					carta=this.puntos(+mano[i].valor);
				}else{//aumentamos el nº de comodines;
					comodines++;
				}				
			}
			valor+=comodines*cartaMax;//si hay comodines se interpreta que valen lo mismo que la carta de mayor valor presente en la mano.
			if(iguales)valor=10*carta;//si son cuatro cartas iguales valen del doble de 5 veces la carta (10)
		}
		return valor;
	},
	//muestra el array cartas como lista de texto
	muestra:function (mano){
		mano=mano||this.cartas;//si no se pasa parámetro se muestran las cartas de Croupier.
		var texto='';
		for (var i=0;i<mano.length; i++){
			texto+=(i+1)+':';
			if(mano[i].valor==0){//comodin 
				texto+=mano[i].valor+'X; ';
			}else{
				texto+=mano[i].valor+mano[i].palo[0].toUpperCase()+'; ';
			}
		}
		return texto;
	},
//PARTE 1 -----ES UNA FUNCIÓN QUE DEVUELVE EL VALOR DE UNA CARTA DETERMINADA, EN GENERAL DEVUEVE COMO VALOR SU NUMERO 
	//SALVO EN LOS CASOS:
		//AS: NÚMERO 1 VALOR 20
		//JOTA: NÚMERO 11 VALOR 12
		//DAMA: NÚMERO 12 VALOR 14
		//REY: NÚMERO 13 VALOR 17
	puntos:function(carta){
		var valor=carta;
		switch (carta){
			case 1: valor = 20;break;//AS
			case 11: valor = 12;break;//JOTA
			case 12: valor = 14;break;//DAMA
			case 13: valor = 17;break;//DAMA
		}
		return valor;
	},
	//devuelve el valor, si se pasa de 21 devuelve 0 punto
	puntuarBlacJack:function(mano){
		var valor=0;
		var valores=[0];
		for (var i=0;i<mano.length;i++){
			var antiguos=valores.length;
			for (var j=0;j<antiguos;j++){
				if(+mano[i].valor>10){//las figuras valen 10 puntos
					valores[j]+=10;
				}else{//en caso contrario su puntuación
					valores[j]+=+mano[i].valor;
					if(+mano[i].valor===1){//se trata de un as ya se ha considerado que puede valer 1 punto
						valores[antiguos+j]=valores[j]+10;//se crea otra posibilidad en que vale 11 puntos (1+10)
					}
				}
			}
		}
		//si no se pasa de 21 tomamos el máximo de las opciones posibles jugando con valores 10 o 1 para los ases.
		for (var i=0; i<valores.length; i++){
			if(valores[i]<22){
				if(valores[i]>valor){
					valor=valores[i];
				}
			}
		}
		return valor;
	},
	limpiar(){
		jugadas[jugadas.length]={ apuestas:[], cartas:[], asegura:[], activo: [], pagado: [], croupier:[], finalizada: false };
	},
	iniciaJugada:function(){
		this.generaBaraja(barajaBlackJack);
		this.barajar()
		//jugadas[jugadas.length]={ apuestas:[], cartas:[], asegura:[], activo: [], pagado: [], croupier:[], finalizada: false };
		for (var i=0;i<jugadores.length;i++){
			jugadas[jugadas.length-1].apuestas[i]=apuestas[i];
			if(apuestas[i]>0){
				jugadas[jugadas.length-1].cartas[i]=Croupier.repartir(2);
				jugadas[jugadas.length-1].activo[i]=true;
				jugadas[jugadas.length-1].pagado[i]=false;
			}else{
				jugadas[jugadas.length-1].cartas[i]=[];
				jugadas[jugadas.length-1].activo[i]=true;
				jugadas[jugadas.length-1].pagado[i]=true;
			}
			//console.log(jugadas[jugadas.length-1].cartas[i]);
		}
		jugadas[jugadas.length-1].croupier=Croupier.repartir(2);
	},
	muestraJugada:function(tapa){
		var njugada=jugadas.length-1;
		var res='jugadas.length: ';
		for(var i=0;i<jugadores.length;i++){
			res+='{'+jugadores[i].nombre+':'+jugadas[njugada].apuestas[i]+'€ +[';
			//console.log(jugadas[njugada].cartas[i][0]);
			for(var j=0;j<jugadas[njugada].cartas[i].length; j++){
				//console.log(res+j+ ': '+jugadas[njugada].cartas[i].length);
				switch(jugadas[njugada].cartas[i][j].valor){
					case 1:  res+='A';break;//as
					case 11: res+='J';break;//Jota
					case 12: res+='D';break;//Dama
					case 13: res+='K';break;//Rey
					default: res+=jugadas[njugada].cartas[i][j].valor;
				}
				res+=jugadas[njugada].cartas[i][j].palo[0].toUpperCase()+'; ';
			}
			res+=']}';
		}
		res+='[';
		for(var j=0;j<jugadas[njugada].croupier.length; j++){
			if(j===0&&tapa) res+='XX; '
			else{
				switch(jugadas[njugada].croupier[j].valor){
					case 1:  res+='A';break;//as
					case 11: res+='J';break;//Jota
					case 12: res+='D';break;//Dama
					case 13: res+='K';break;//Rey
					default: res+=jugadas[njugada].croupier[j].valor;
				}
				res+=jugadas[njugada].croupier[j].palo[0].toUpperCase()+'; ';
			}
		}
		console.log(res+']');
	},
		pagoblacjack:function(){
		var njugada=jugadas.length-1;
		//if(jugadas[njugada].croupier[1].valor!=1&&jugadas[njugada].croupier[1].valor<10){
			for(var i=0;i<jugadores.length;i++){
				if(this.puntuarBlacJack(jugadas[njugada].cartas[i])==21){
					jugadas[njugada].activo[i]=false;//se desactiva el jugador
					jugadores[i].bolsa+=3*apuestas[i]/2;//se paga vez y media
					jugadas[njugada].pagado[i]=true;
					console.log('BLACKJACK: '+jugadores[i].nombre+': '+jugadores[i].bolsa+'€. apostó '+apuestas[i]+'€.');
				}
			}
		//}
	},
	asegurar: function(){
		var njugada=jugadas.length-1;
		if(jugadas[njugada].croupier[1].valor===1||jugadas[njugada].croupier[1].valor>9){
			if(this.puntuarBlacJack(jugadas[njugada].croupier)==21){//se paga el seguro 1/2 de la apuesta si se hizo seguro
				for(var i=0;i<jugadores.length;i++){
					if(asegurar[i]){//si se aseguró
						jugadas[njugada].asegura[i]=true;
						jugadores[i].bolsa+=apuestas[i];//se paga la apuesta, doble del seguro
						console.log('ASEGURADO: '+jugadores[i].nombre+': '+jugadores[i].bolsa+'€. apostó '+apuestas[i]+'€.');
					}else jugadas[njugada].asegura[i]=false;
				}
				//Una vez pagados los seguros se finaliza la partida
				this.finalizar(); 				
			}else{
				for(var i=0;i<jugadores.length;i++){
					if(asegurar[i]){//si se aseguró
						jugadas[njugada].asegura[i]=true;
						jugadores[i].bolsa-=apuestas[i]/2;//se cobra media apuesta
						console.log('ASEGURADO: '+jugadores[i].nombre+': '+jugadores[i].bolsa+'€. apostó '+apuestas[i]+'€.');
					}else jugadas[njugada].asegura[i]=false;
				}
				//una vez cobrados los seguros se continua la partida con posibles blackjacks
				this.pagoblacjack();
			}
			
		}else{
			//se miran posibles blackjacks
			this.pagoblacjack();
		}
	},

	continuar:function(){
		var njugada=jugadas.length-1;
		var activo=false;
		for(var i=0;i<jugadores.length;i++){
			
			if(jugadas[njugada].activo[i]&&pedir[i]&&this.puntuarBlacJack(jugadas[njugada].cartas[i])!=0){
				console.log('valor: '+this.puntuarBlacJack(jugadas[njugada].cartas[i]));
				jugadas[njugada].cartas[i][jugadas[njugada].cartas[i].length]=Croupier.repartir(1)[0];
				jugadas[njugada].activo[i]=true;
				activo=true;
			}else{
				jugadas[njugada].activo[i]=false;
				console.log('JUGADOR: '+jugadores[i].nombre+': '+jugadas[njugada].activo[i]+'.');
			}
		}
		return activo;
	},
	finalizar: function(){
		this.muestraJugada(false);
		njugada=jugadas.length-1;
		if(!jugadas[njugada].finalizada){
			var valorCroupier=this.puntuarBlacJack(jugadas[njugada].croupier);
			while(valorCroupier<17){
				jugadas[njugada].croupier[jugadas[njugada].croupier.length]=Croupier.repartir(1)[0];
				valorCroupier=this.puntuarBlacJack(jugadas[njugada].croupier);
				this.muestraJugada(false);
				if(valorCroupier===0)break;//si se pasa salimos del bucle
			}
			console.log('El croupier saca '+valorCroupier+'.');
			for(var i=0;i<jugadores.length;i++){
				if(!jugadas[njugada].pagado[i]){//ya se pagaron los blacjacks
					var valJugador=this.puntuarBlacJack(jugadas[njugada].cartas[i]);
					var resultado='';
					if(valorCroupier>valJugador||valJugador==0){//si se pasa un jugador pierde
						resultado='pierde ('+valorCroupier+'>'+valJugador+')'+apuestas[i]+'€. ';
						jugadores[i].bolsa-=apuestas[i];
				
					}else if(valorCroupier==valJugador){
						resultado='empata ('+valorCroupier+'='+valJugador+'). ';
					}else{
						resultado='gana ('+valorCroupier+'<'+valJugador+')'+apuestas[i]+'€. ';
						jugadores[i].bolsa+=apuestas[i];
					}
					console.log(jugadores[i].nombre+' '+resultado+ 'Tiene: '+jugadores[i].bolsa+'€. ');
				} else console.log(jugadores[i].nombre+' hizo BlackJack y Tiene: '+jugadores[i].bolsa+'€. ');
			}
			jugadas[njugada].finalizada=true;
		}
	}
		
}

var jugadores=[{nombre: 'Juan', bolsa:100}, {nombre:'Encarna', bolsa:100}, {nombre:'Irene', bolsa:100}, {nombre:'Eva', bolsa:100},
{nombre:'Elena', bolsa:100}, {nombre:'Álex', bolsa:100}];
var apuestas=[5,10,5,10,5,5];
var jugadas=[];
var asegurar=[false, false, false, false, false, false];
var pedir=[true,true,false,false,true,false];


