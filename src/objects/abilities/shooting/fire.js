export function fire(shooter, target, damage, speed, sprite, scale, pool, num, critChance = 0, critMultiplier = 2) {
    // Calcular el 醤gulo base hacia el objetivo
    const angleToTarget = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);

    // Configurar el rango de dispersi髇 (en radianes)
    const spread = Phaser.Math.DegToRad(8); // Rango total del spread
    const angleStep = num > 1 ? spread / (num - 1) : 0; // Evitar divisi髇 por cero
    const startAngle = angleToTarget - spread / 2;

    for (let i = 0; i < num; i++) {
        // Calcular el 醤gulo para esta bala
        const angle = startAngle + i * angleStep;
        // Determinar si esta bala es un cr韙ico y calcular el da駉 final
        const isCritical = Math.random() < critChance; // Probabilidad de cr韙ico
        const finalDamage = isCritical ? damage * critMultiplier : damage;

        // Calcular la direcci髇 de la bala a partir del 醤gulo ajustado
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        // Extrae la bala de la pool
        let bullet = pool.spawn(shooter.x, shooter.y, sprite);
        bullet.rotation = angle+90;

        // Configurar la bala
        bullet.setScale(scale);
        bullet.setSpeed(speed);
        bullet.setDamage(finalDamage);

        // Mover la bala hacia la posici髇 calculada
        //uso dx y dy por el disparo en abanico si lo hay
        bullet.move(shooter.x, shooter.y, shooter.x + dx * 1000, shooter.y + dy * 1000);

        // Mensaje de ataque cr韙ico (opcional)
        //if (isCritical) {
        //    console.log(`Ataque criico! Daño: ${finalDamage}`);
        //}
        //else console.log(`Daño: ${finalDamage}`);
    }
}