Algoritmo segundo_mayor
	Definir N, Num, i, PrMay, SeMay como Entero;
	
	Escribir "Cuántos números?:";
	Leer N;
	Dimension Num[N];
	
	//Leer los N números
	Para i=0 Hasta N-1 Con Paso 1 Hacer
		Escribir "Número ", i+1, "?:";
		Leer Num[i];
	Fin Para
	
	Si Num[0] > Num[1] Entonces
		PrMay=Num[0];
		SeMay=Num[1];
	SiNo
		PrMay=Num[1];
		SeMay=Num[0];
	Fin Si
	Para i=2 Hasta N-1 Con Paso 1 Hacer
		Si Num[i]> PrMay Entonces
			SeMay=PrMay;
			PrMay=Num[i];
		SiNo
			Si Num[i]>SeMay Entonces
				SeMay=Num[i];
			Fin Si
		Fin Si
	Fin Para
	Escribir "El Segundo Mayor es: ", SeMay; 
FinAlgoritmo
