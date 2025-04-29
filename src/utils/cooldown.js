
/**
 * Class to manage cooldowns.
 * @param cooldownTime for an action
 * Example of use: An entity may create a this.jumpCooldown = new Cooldown(500) and ask for bool this.jumpCooldown.canUse(time) at update(time, delta) to check if can perform a jump after an input.
 */
export default class Cooldown 
{
    constructor(cooldownTime) {
        this.cooldownTime = cooldownTime;
        this.lastUsed = 0;
    }

    canUse(currentTime) {
        if (currentTime - this.lastUsed >= this.cooldownTime) {
            this.lastUsed = currentTime;
            return true;
        }
        return false;
    }

    reset(currentTime) {
        this.lastUsed = currentTime;
    }

    setCooldownTime(newTime) {
        this.cooldownTime = newTime;
    }
}