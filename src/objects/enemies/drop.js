//funcion que se usa para dropear fichas y plantas cuando un enemigo muere
export function drop(x, y, exp, lifeRec, pool, pool2) {
	let coin = pool.spawn(x, y);
	coin.setExp(exp);

	//hay un 25% de probabilidad de dropear una cura
	var dropPlant = Math.random() < 0.25;
	if (dropPlant) {
		let plant = pool2.spawn(x + 30, y + 20);
		plant.setLifeRec(lifeRec);
	}
}
