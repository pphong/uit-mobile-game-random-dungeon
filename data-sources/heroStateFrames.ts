
const HeroFrames: Record<string, string> = {
  ATK1: require("@/assets/animated-entitiy/heroes/atk-1.gif"),
  ATK2: require("@/assets/animated-entitiy/heroes/atk-2.gif"),
  ATK3: require("@/assets/animated-entitiy/heroes/atk-3.gif"),
  FJump: require("@/assets/animated-entitiy/heroes/full-jump.gif"),
  Idle: require("@/assets/animated-entitiy/heroes/idle.gif"),
  Death: require("@/assets/animated-entitiy/heroes/death-0.gif"),
  Hurt: require("@/assets/animated-entitiy/heroes/hurt.gif"),
};

export enum HeroStateEnum {
    ATK1 = 'ATK1',
    ATK2 = 'ATK2',
    ATK3 = 'ATK3',
    FJump = 'FJump',
    Idle = 'Idle',
    Death = 'Death',
    Hurt = 'Hurt'
}

export default HeroFrames;
